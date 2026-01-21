/**
 * Generic AI Interface for Tool Command Processing
 *
 * Uses core abstractions:
 * - ToolMatcher (pluggable matching strategies)
 * - ParameterExtractor (declarative parameter extraction)
 * - ToolExecutor (universal execution engine)
 * - SuggestionEngine ("Did You Mean?" system)
 *
 * NO HARDCODED ROUTES - everything is inferred from NavigationGraph
 */

import { ToolRegistry } from "../background/registry/ToolRegistry";
import type { ToolMetadata } from "../decorators/Tool";
import { NavigationGraph } from "../background/navigation/NavigationGraph";
import { ToolMatcher, type MatchContext } from "./ToolMatcher";
import { ParameterExtractor } from "./ParameterExtractor";
import { ToolExecutor } from "./ToolExecutor";
import { SuggestionEngine } from "./SuggestionEngine";

export interface AICommand {
  query: string;
  tool?: ToolMetadata;
  confidence: number;
  requiresApproval: boolean;
  parameters?: unknown[];
  parsedIntent?: {
    action: string;
    target?: string;
    value?: string;
  };
}

export interface AIResponse {
  success: boolean;
  message: string;
  executedTool?: string;
  timestamp: string;
}

/**
 * Generic AI Interface - works for ANY app with ZERO configuration
 * Container detection is INFERRED from NavigationGraph
 *
 * Supports pluggable matching strategies via ToolMatcher.
 * For LLM-based matching, see @supernalintelligence/interface-enterprise
 */
export class AIInterface {
  // Core abstractions
  protected matcher: ToolMatcher;
  protected paramExtractor: ParameterExtractor;
  protected executor: ToolExecutor;
  protected suggestionEngine: SuggestionEngine;

  constructor() {
    // Initialize core abstractions
    this.matcher = new ToolMatcher();
    this.paramExtractor = new ParameterExtractor();
    this.executor = new ToolExecutor();
    this.suggestionEngine = new SuggestionEngine();
  }

  /**
   * Register a custom matcher strategy (for BYOK LLM integration)
   * @param strategy Custom matching strategy
   */
  public registerMatcherStrategy(strategy: any): void {
    this.matcher.registerStrategy(strategy);
  }

  /**
   * Get current container - INFERRED from NavigationGraph
   * NO HARDCODED ROUTE MAPPINGS
   */
  private getCurrentContext(): MatchContext {
    if (typeof window === 'undefined') {
      return {
        currentContainer: 'unknown',
        currentPage: 'unknown',
        currentPath: 'unknown'
      };
    }

    // Use the context set by useContainer() hook, NOT route inference
    // This ensures the context matches what the page component registered
    const graph = NavigationGraph.getInstance();
    const currentContextId = graph.getCurrentContext() || 'unknown';

    // Get route for tool filtering (tools are scoped by route, not context ID)
    const currentRoute = graph.getCurrentRoute?.() || currentContextId;

    // Get actual current path for exact route matching (e.g., /blog vs /blog/post-slug)
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : currentRoute;

    return {
      currentContainer: currentRoute, // Container route (e.g., '/blog') for prefix matching
      currentPage: currentContextId,   // Keep context ID for display
      currentPath: currentPath         // Actual path for exact matching
    };
  }

  /**
   * Find matching tools using ToolMatcher
   */
  async findToolsForCommand(query: string): Promise<AICommand[]> {
    console.log(`🔍 [AI] Finding tools for: "${query}"`);

    // Get all available tools
    const toolsMap = ToolRegistry.getAllTools();
    const allTools = Array.from(toolsMap.values());
    const context = this.getCurrentContext();

    console.log(`📍 [AI] Current context:`, context);

    // Filter tools by current route
    // Search tools (scoped) require EXACT path match to avoid showing on detail pages
    // Example: "Search Blog" only available on /blog index, NOT /blog/post-slug
    // Navigation tools use container prefix matching
    const scopedTools = allTools.filter(tool => {
      if (!tool.containerId) return false;

      // Search/content tools: require exact path match (e.g., /blog but not /blog/slug)
      // Check custom metadata fields set by NavigationGraph
      const toolMeta = tool as any;
      if (toolMeta.toolType === 'navigation' && toolMeta.actionType === 'navigation' && tool.name.startsWith('Search ')) {
        const toolRoute = tool.containerId;
        const currentPath = context.currentPath || context.currentContainer;
        return currentPath === toolRoute;
      }

      // Other scoped tools: use container matching
      return tool.containerId === context.currentContainer;
    });

    const globalTools = allTools.filter(tool =>
      !tool.containerId
    );

    const navigationTools = allTools.filter(tool =>
      tool.containerId !== context.currentContainer && tool.category === 'navigation'
    );

    console.log(`📦 [AI] Scoped tools: ${scopedTools.length}, Global tools: ${globalTools.length}, Navigation tools: ${navigationTools.length}`);
    console.log(`📦 [AI] Navigation tools available:`, navigationTools.map(t => `${t.name} (containerId: ${t.containerId || 'GLOBAL'}, examples: ${(t as any).examples?.slice(0, 2).join(', ') || 'none'})`));

    // Combine: scoped first, then global, then navigation
    const contextTools = [...scopedTools, ...globalTools, ...navigationTools];

    console.log(`📦 [AI] Total filtered to ${contextTools.length} tools for context: ${context.currentContainer}`);

    // Use ToolMatcher to find matches
    const matches = await this.matcher.findMatches(query, contextTools, context, 5);

    // Convert to AICommand format
    const commands: AICommand[] = matches.map(match => ({
      query,
      tool: match.tool,
      confidence: match.confidence,
      requiresApproval: match.tool.dangerLevel === 'dangerous' || match.tool.dangerLevel === 'destructive',
      parameters: match.parameters || []
    }));

    console.log(`✅ [AI] Found ${commands.length} matching tools:`,
      commands.map(c => `${c.tool?.name} (${Math.round((c.confidence || 0) * 100)}%)`));

    return commands;
  }

  /**
   * Execute a command using ToolExecutor
   * Implements chain-of-responsibility: tries each matched tool until one succeeds
   */
  async executeCommand(commands: AICommand[], useFirstMatch: boolean = false): Promise<AIResponse> {
    if (commands.length === 0) {
      // Use SuggestionEngine for helpful response
      const toolsMap = ToolRegistry.getAllTools();
      const allTools = Array.from(toolsMap.values());
      const context = this.getCurrentContext();

      // Get available commands for current context
      const contextTools = allTools.filter(t =>
        t.aiEnabled &&
        (!t.containerId || t.containerId === context.currentContainer || t.category === 'navigation')
      );

      const examples = contextTools.flatMap(t => (t as any).examples || []).slice(0, 5);

      return {
        success: false,
        message: `❓ No matching command found.\n\n💡 Try:\n${examples.map(ex => `• "${ex}"`).join('\n')}`,
        timestamp: new Date().toISOString()
      };
    }

    // Chain-of-responsibility: try each command until one succeeds
    const errors: string[] = [];

    for (let i = 0; i < commands.length; i++) {
      const command = commands[i];

      if (!command.tool) {
        errors.push(`Command ${i + 1}: No tool found`);
        continue;
      }

      console.log(`🎯 [AI] Executing (attempt ${i + 1}/${commands.length}): ${command.tool.name}`);

      // Extract parameters using ParameterExtractor
      const extraction = await this.paramExtractor.extract(command.query, command.tool);
      const parameters = extraction.parameters.length > 0 ? extraction.parameters : command.parameters;

      console.log(`📋 [AI] Parameters:`, parameters);

      // Execute using ToolExecutor
      try {
        const result = await this.executor.execute(command.tool, parameters || []);

        if (result.success) {
          // Success! Return immediately
          console.log(`✅ [AI] Tool succeeded: ${command.tool.name}`);
          return {
            success: true,
            message: `✅ ${result.message}`,
            executedTool: command.tool.name,
            timestamp: new Date().toISOString()
          };
        } else {
          // Tool executed but returned failure - try next tool
          console.log(`⚠️  [AI] Tool failed, trying next: ${result.message}`);
          errors.push(`${command.tool.name}: ${result.message}`);

          // If useFirstMatch is true, stop after first attempt
          if (useFirstMatch) {
            return {
              success: false,
              message: `❌ ${result.message}`,
              executedTool: command.tool.name,
              timestamp: new Date().toISOString()
            };
          }
        }
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        console.log(`❌ [AI] Tool threw error, trying next: ${errorMsg}`);
        errors.push(`${command.tool.name}: ${errorMsg}`);

        // If useFirstMatch is true, stop after first attempt
        if (useFirstMatch) {
          return {
            success: false,
            message: `❌ ${errorMsg}`,
            timestamp: new Date().toISOString()
          };
        }
      }
    }

    // All tools failed
    return {
      success: false,
      message: `❌ All tools failed:\n${errors.map((e, i) => `${i + 1}. ${e}`).join('\n')}`,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * CONVENIENCE: Process a text query end-to-end
   */
  async processQuery(query: string): Promise<AIResponse> {
    const commands = await this.findToolsForCommand(query);
    return this.executeCommand(commands, false); // Enable fallback chain
  }

  /**
   * Get all available commands for help/autocomplete
   */
  getAvailableCommands(): string[] {
    const toolsMap = ToolRegistry.getAllTools();
    const allTools = Array.from(toolsMap.values());
    const context = this.getCurrentContext();

    // Filter by current context
    const contextTools = allTools.filter(tool =>
      !tool.containerId ||
      tool.containerId === context.currentContainer ||
      tool.category === 'navigation'
    );

    // Extract examples
    const commands: string[] = [];
    for (const tool of contextTools) {
      const examples = (tool as any).examples || [];
      commands.push(...examples);
    }

    return commands;
  }

  /**
   * Get suggestions for incomplete query (autocomplete)
   */
  async getSuggestions(partialQuery: string): Promise<string[]> {
    const toolsMap = ToolRegistry.getAllTools();
    const allTools = Array.from(toolsMap.values());
    const suggestions = this.suggestionEngine.getSuggestions(partialQuery, allTools, 5);
    return suggestions.map(s => s.text);
  }
}
