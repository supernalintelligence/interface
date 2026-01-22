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

    const context = this.getCurrentContext();
    console.log(`📍 [AI] Current context:`, context);

    // Use ToolRegistry.getToolsForCurrentContext() which properly resolves container IDs via ContainerRegistry
    const contextTools = ToolRegistry.getToolsForCurrentContext();

    // Separate for logging
    const scopedTools = contextTools.filter(tool => tool.containerId && tool.containerId !== 'global');
    const globalTools = contextTools.filter(tool => !tool.containerId || tool.containerId === 'global');
    const navigationTools = contextTools.filter(tool => tool.category === 'navigation');

    console.log(`📦 [AI] Scoped tools: ${scopedTools.length}, Global tools: ${globalTools.length}, Navigation tools: ${navigationTools.length}`);
    console.log(`📦 [AI] Navigation tools available:`, navigationTools.map(t => `${t.name} (containerId: ${t.containerId || 'GLOBAL'}, examples: ${(t as any).examples?.slice(0, 2).join(', ') || 'none'})`));

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
   * @param commands Array of matched commands to try
   * @param useFirstMatch If true, only try first command and stop
   * @param originalQuery Original user query (for better error messages when commands is empty)
   */
  async executeCommand(
    commands: AICommand[],
    useFirstMatch: boolean = false,
    originalQuery?: string
  ): Promise<AIResponse> {
    if (commands.length === 0) {
      // Use SuggestionEngine for intelligent "Did You Mean?" suggestions
      const toolsMap = ToolRegistry.getAllTools();
      const allTools = Array.from(toolsMap.values());
      const context = this.getCurrentContext();

      // Get available commands for current context
      const contextTools = allTools.filter(t =>
        t.aiEnabled &&
        (!t.containerId || t.containerId === context.currentContainer || t.category === 'navigation')
      );

      // Generate intelligent suggestions based on the query
      const query = originalQuery || commands[0]?.query || '';
      const suggestions = this.suggestionEngine.getSuggestions(query, contextTools, 5);

      let message = `❓ No matching command found${query ? ` for "${query}"` : ''}.\n\n`;

      if (suggestions.length > 0) {
        // Use SuggestionEngine's formatted output
        const formatted = this.suggestionEngine.formatSuggestions(suggestions);
        message += formatted;
      } else {
        // Fallback: show general examples if no suggestions
        const examples = contextTools.flatMap(t => (t as any).examples || []).slice(0, 5);
        message += `💡 Available commands:\n${examples.map(ex => `• "${ex}"`).join('\n')}`;
      }

      return {
        success: false,
        message,
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

    // All tools failed - provide helpful suggestions
    const query = originalQuery || commands[0]?.query || '';
    const toolsMap = ToolRegistry.getAllTools();
    const allTools = Array.from(toolsMap.values());
    const context = this.getCurrentContext();

    // Get context-aware tools for suggestions
    const contextTools = allTools.filter(t =>
      t.aiEnabled &&
      (!t.containerId || t.containerId === context.currentContainer || t.category === 'navigation')
    );

    const suggestions = this.suggestionEngine.getSuggestions(query, contextTools, 3);

    let message = `❌ Command failed: ${errors[errors.length - 1]}\n\n`;

    if (suggestions.length > 0) {
      message += `💡 Did you mean?\n${suggestions.slice(0, 3).map(s => `• "${s.text}"`).join('\n')}`;
    } else {
      message += `💡 Try "/help" to see available commands`;
    }

    return {
      success: false,
      message,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * CONVENIENCE: Process a text query end-to-end
   */
  async processQuery(query: string): Promise<AIResponse> {
    const commands = await this.findToolsForCommand(query);
    return this.executeCommand(commands, false, query); // Enable fallback chain, pass query for suggestions
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
