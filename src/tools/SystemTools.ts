/**
 * System Tools - AI Discovery & Help System
 * 
 * Provides mandatory tools for AI agents to discover and understand
 * available capabilities without hardcoding tool names.
 * 
 * Features:
 * - help(): Get usage information and available tools
 * - listCapabilities(): Query and filter available tools
 * - describe(): Get detailed information about specific tools
 * - Smart suggestions using Levenshtein distance for typos
 * 
 * @example
 * ```typescript
 * // AI discovers tools
 * const tools = await SystemTools.listCapabilities({ category: ToolCategory.DEMO });
 * 
 * // AI gets help on a specific tool
 * const info = await SystemTools.describe('sendMessage');
 * 
 * // AI gets suggestions on typos
 * try {
 *   await someAPI.setPriorty('high');  // Typo!
 * } catch (err) {
 *   // "setPriorty not found. Did you mean: setPriority, setStatus?"
 * }
 * ```
 */

import { Tool, ToolCategory } from '../types/Tool';
import { ClassifiedTool } from '../types/ClassifiedTool';
import { ToolRegistry } from '../background/registry/ToolRegistry';

/**
 * Query options for listCapabilities
 */
export interface CapabilityQuery {
  /**
   * Filter by category
   */
  category?: ToolCategory;
  
  /**
   * Filter by keyword search
   */
  keyword?: string;
  
  /**
   * Filter by platform support
   */
  platform?: 'chrome' | 'web' | 'desktop';
  
  /**
   * Filter by enabled status
   */
  enabled?: boolean;
  
  /**
   * Limit results
   */
  limit?: number;
  
  /**
   * Include only specific fields
   */
  fields?: Array<keyof Tool>;
}

/**
 * Tool summary for list results
 */
export interface ToolSummary {
  toolId: string;
  name: string;
  description: string;
  category: ToolCategory;
  aiEnabled?: boolean;
}

/**
 * Help result
 */
export interface HelpResult {
  /**
   * General help message
   */
  message: string;
  
  /**
   * Available tool categories
   */
  categories: ToolCategory[];
  
  /**
   * Total tool count
   */
  toolCount: number;
  
  /**
   * System tools (always available)
   */
  systemTools: string[];
  
  /**
   * Example queries
   */
  examples: string[];
}

/**
 * Levenshtein distance calculation for string similarity
 */
function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];
  
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }
  
  return matrix[b.length][a.length];
}

/**
 * Calculate similarity score (0-1, higher is more similar)
 */
function similarityScore(a: string, b: string): number {
  const distance = levenshteinDistance(a.toLowerCase(), b.toLowerCase());
  const maxLength = Math.max(a.length, b.length);
  return 1 - (distance / maxLength);
}

/**
 * System Tools for AI Discovery
 */
export class SystemTools {
  /**
   * Similarity threshold for suggestions
   */
  private static readonly SIMILARITY_THRESHOLD = 0.6;
  
  /**
   * Maximum suggestions to return
   */
  private static readonly MAX_SUGGESTIONS = 5;
  
  /**
   * Get general help and overview
   */
  static async help(): Promise<HelpResult> {
    const allTools = ToolRegistry.getTools();
    const categories = new Set<ToolCategory>();
    
    allTools.forEach(tool => {
      if (tool.category) {
        categories.add(tool.category);
      }
    });
    
    return {
      message: [
        'Welcome to the Supernal Intelligence Interface!',
        '',
        'Available Commands:',
        '- SystemTools.help(): Get this help message',
        '- SystemTools.listCapabilities(query): Query available tools',
        '- SystemTools.describe(toolId): Get detailed tool information',
        '',
        `Total Tools: ${allTools.length}`,
        `Categories: ${Array.from(categories).join(', ')}`,
      ].join('\n'),
      categories: Array.from(categories),
      toolCount: allTools.length,
      systemTools: ['help', 'listCapabilities', 'describe'],
      examples: [
        'SystemTools.listCapabilities({ category: ToolCategory.USER_INTERACTION })',
        'SystemTools.listCapabilities({ keyword: "button" })',
        'SystemTools.describe("sendMessage")',
      ],
    };
  }
  
  /**
   * List available capabilities with optional filtering
   */
  static async listCapabilities(query: CapabilityQuery = {}): Promise<ToolSummary[]> {
    let tools = ToolRegistry.getTools();
    
    // Filter by category
    if (query.category) {
      tools = tools.filter(t => t.category === query.category);
    }
    
    // Filter by keyword (searches name, description, keywords, useCases)
    if (query.keyword) {
      const keyword = query.keyword.toLowerCase();
      tools = tools.filter(t => {
        const searchText = [
          t.name,
          t.description,
          ...(t.keywords || []),
          ...(t.useCases || []),
        ].join(' ').toLowerCase();
        
        return searchText.includes(keyword);
      });
    }
    
    // Note: ToolMetadata doesn't have platformSupport or enabled,
    // so we skip those filters for now
    
    // Limit results
    if (query.limit && query.limit > 0) {
      tools = tools.slice(0, query.limit);
    }
    
    // Map to summaries
    return tools.map(t => ({
      toolId: t.toolId,
      name: t.name,
      description: t.description,
      category: t.category,
      aiEnabled: t.aiEnabled,
    }));
  }
  
  /**
   * Get detailed information about a specific tool
   */
  static async describe(toolId: string): Promise<any | null> {
    const tool = ToolRegistry.getTool(toolId);
    
    if (!tool) {
      // Try to find by name instead of full ID
      const allTools = ToolRegistry.getTools();
      const byName = allTools.find(t => t.name === toolId);
      
      if (byName) {
        return byName;
      }
      
      // Provide suggestions
      const suggestions = this.suggestTools(toolId);
      const suggestText = suggestions.length > 0
        ? `Did you mean: ${suggestions.join(', ')}?`
        : '';
      
      throw new Error(`Tool "${toolId}" not found. ${suggestText}`);
    }
    
    return tool;
  }
  
  /**
   * Suggest similar tool names (for error messages)
   */
  static suggestTools(invalidName: string): string[] {
    const allTools = ToolRegistry.getTools();
    
    // Calculate similarity scores
    const scored = allTools
      .map(tool => ({
        name: tool.name,
        toolId: tool.toolId,
        score: Math.max(
          similarityScore(invalidName, tool.name),
          similarityScore(invalidName, tool.toolId)
        ),
      }))
      .filter(item => item.score >= this.SIMILARITY_THRESHOLD)
      .sort((a, b) => b.score - a.score)
      .slice(0, this.MAX_SUGGESTIONS);
    
    return scored.map(item => item.name);
  }
  
  /**
   * Search tools by natural language query
   */
  static async search(query: string): Promise<ToolSummary[]> {
    const keywords = query.toLowerCase().split(/\s+/);
    const allTools = ToolRegistry.getTools();
    
    // Score each tool based on keyword matches
    const scored = allTools.map(tool => {
      const searchText = [
        tool.name,
        tool.description,
        ...(tool.keywords || []),
        ...(tool.useCases || []),
      ].join(' ').toLowerCase();
      
      // Count keyword matches
      const matches = keywords.filter(kw => searchText.includes(kw)).length;
      const score = matches / keywords.length;
      
      return { tool, score };
    });
    
    // Filter and sort by score
    return scored
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(item => ({
        toolId: item.tool.toolId,
        name: item.tool.name,
        description: item.tool.description,
        category: item.tool.category,
        aiEnabled: item.tool.aiEnabled,
      }));
  }
  
  /**
   * Get tool suggestions based on current context
   */
  static async suggestByContext(context: {
    recentTools?: string[];
    currentCategory?: ToolCategory;
    completedTools?: string[];
  }): Promise<ToolSummary[]> {
    const allTools = ToolRegistry.getTools();
    let suggestions = allTools;
    
    // Note: ToolMetadata doesn't have prerequisites, so we skip that filter
    
    // Filter by category if provided
    if (context.currentCategory) {
      suggestions = suggestions.filter(t => t.category === context.currentCategory);
    }
    
    // Exclude recently used tools
    if (context.recentTools && context.recentTools.length > 0) {
      suggestions = suggestions.filter(t => !context.recentTools!.includes(t.toolId));
    }
    
    // Limit to top suggestions
    return suggestions.slice(0, 10).map(t => ({
      toolId: t.toolId,
      name: t.name,
      description: t.description,
      category: t.category,
      aiEnabled: t.aiEnabled,
    }));
  }
  
  /**
   * Wrap tool execution with suggestion on error
   */
  static async executeWithSuggestions<T>(
    toolId: string,
    executor: () => Promise<T>
  ): Promise<T> {
    try {
      return await executor();
    } catch (err: any) {
      // If tool not found, add suggestions
      if (err.message?.includes('not found')) {
        const suggestions = this.suggestTools(toolId);
        if (suggestions.length > 0) {
          err.message += `\n\nDid you mean: ${suggestions.join(', ')}?`;
        }
      }
      throw err;
    }
  }
}

