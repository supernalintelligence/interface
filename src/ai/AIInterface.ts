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
        currentPage: 'unknown'
      };
    }

    // Use the context set by useContainer() hook, NOT route inference
    // This ensures the context matches what the page component registered
    const graph = NavigationGraph.getInstance();
    const currentContextId = graph.getCurrentContext() || 'unknown';

    // Get route for tool filtering (tools are scoped by route, not context ID)
    const currentRoute = graph.getCurrentRoute?.() || currentContextId;

    return {
      currentContainer: currentRoute, // Use route for tool filtering
      currentPage: currentContextId   // Keep context ID for display
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

    // Filter tools by current container
    // Priority: 1) Scoped to current container, 2) Global (no containerId), 3) Global navigation
    const scopedTools = allTools.filter(tool =>
      tool.containerId === context.currentContainer
    );

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
   */
  async executeCommand(commands: AICommand[], useFirstMatch: boolean = true): Promise<AIResponse> {
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

    const command = commands[0]; // Use highest confidence match

    if (!command.tool) {
      return {
        success: false,
        message: `❌ No tool found for command`,
        timestamp: new Date().toISOString()
      };
    }

    console.log(`🎯 [AI] Executing: ${command.tool.name}`);

    // Extract parameters using ParameterExtractor
    const extraction = await this.paramExtractor.extract(command.query, command.tool);
    const parameters = extraction.parameters.length > 0 ? extraction.parameters : command.parameters;

    console.log(`📋 [AI] Parameters:`, parameters);

    // Execute using ToolExecutor
    try {
      const result = await this.executor.execute(command.tool, parameters || []);

      return {
        success: result.success,
        message: result.success ? `✅ ${result.message}` : `❌ ${result.message}`,
        executedTool: command.tool.name,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);

      return {
        success: false,
        message: `❌ ${errorMsg}`,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * CONVENIENCE: Process a text query end-to-end
   */
  async processQuery(query: string): Promise<AIResponse> {
    const commands = await this.findToolsForCommand(query);
    return this.executeCommand(commands, true);
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
