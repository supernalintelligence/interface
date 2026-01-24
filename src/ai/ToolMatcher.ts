/**
 * ToolMatcher - Pluggable strategy for matching user queries to tools
 * 
 * Supports multiple matching strategies with priority-based selection:
 * - Exact match (priority 100)
 * - Fuzzy string matching (priority 60)
 * - LLM-based semantic matching (priority 50)
 * - Keyword-based heuristics (priority 30)
 */

import type { ToolMetadata } from '../decorators/Tool';

/**
 * Match result with confidence score and extracted parameters
 */
export interface ToolMatch {
  tool: ToolMetadata;
  confidence: number; // 0-100
  parameters?: any[];
  reasoning?: string; // Why this tool was matched (for debugging)
}

/**
 * Base interface for all matching strategies
 */
export interface MatcherStrategy {
  name: string;
  priority: number; // Higher = try first (100 = exact, 50 = LLM, 30 = fuzzy)
  
  /**
   * Match a query against available tools
   * @returns Array of matches sorted by confidence (highest first)
   */
  match(query: string, tools: ToolMetadata[], context?: MatchContext): Promise<ToolMatch[]>;
}

/**
 * Context passed to matchers for better matching
 */
export interface MatchContext {
  currentContainer?: string;
  currentPage?: string;
  currentPath?: string; // Actual browser path for exact route matching
  conversationHistory?: string[];
  userPreferences?: Record<string, any>;
}

/**
 * Main ToolMatcher orchestrator
 */
export class ToolMatcher {
  private strategies: MatcherStrategy[] = [];
  
  constructor() {
    // Register default strategies (more added via registerStrategy)
    this.registerStrategy(new ExactMatcher());
    this.registerStrategy(new FuzzyMatcher());
  }
  
  /**
   * Register a new matching strategy
   */
  registerStrategy(strategy: MatcherStrategy): void {
    this.strategies.push(strategy);
    // Sort by priority (highest first)
    this.strategies.sort((a, b) => b.priority - a.priority);
  }
  
  /**
   * Find best matches for a query using all strategies
   * @returns Top N matches sorted by confidence
   */
  async findMatches(
    query: string,
    tools: ToolMetadata[],
    context?: MatchContext,
    topN: number = 5
  ): Promise<ToolMatch[]> {
    const allMatches: ToolMatch[] = [];
    
    // Try each strategy in priority order
    for (const strategy of this.strategies) {
      try {
        const matches = await strategy.match(query, tools, context);
        allMatches.push(...matches);
      } catch (error) {
        console.warn(`[ToolMatcher] Strategy ${strategy.name} failed:`, error);
      }
    }
    
    // Deduplicate by tool ID and keep highest confidence
    const deduped = new Map<string, ToolMatch>();
    for (const match of allMatches) {
      const key = match.tool.elementId || match.tool.name;
      const existing = deduped.get(key);
      
      if (!existing || match.confidence > existing.confidence) {
        deduped.set(key, match);
      }
    }
    
    // Sort by confidence and return top N
    return Array.from(deduped.values())
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, topN);
  }
  
  /**
   * Get suggestions for invalid/ambiguous queries
   */
  async getSuggestions(
    query: string,
    tools: ToolMetadata[],
    context?: MatchContext
  ): Promise<string[]> {
    // Find close matches (confidence 30-60%)
    const matches = await this.findMatches(query, tools, context, 10);
    const suggestions = matches
      .filter(m => m.confidence >= 30 && m.confidence < 70)
      .map(m => {
        const toolName = m.tool.name;
        const examples = (m.tool as any).examples;
        if (examples && examples.length > 0) {
          return `"${examples[0]}"`;
        }
        return `"${toolName}"`;
      })
      .slice(0, 5);
    
    return suggestions;
  }
}

/**
 * Exact match strategy - checks for exact tool name or example match
 */
class ExactMatcher implements MatcherStrategy {
  name = 'exact';
  priority = 100;
  
  async match(query: string, tools: ToolMetadata[]): Promise<ToolMatch[]> {
    const lowerQuery = query.toLowerCase().trim();
    const matches: ToolMatch[] = [];
    
    for (const tool of tools) {
      const toolName = tool.name.toLowerCase();
      const examples = (tool as any).examples || [];
      
      // Check exact name match
      if (lowerQuery === toolName) {
        matches.push({
          tool,
          confidence: 100,
          reasoning: 'Exact name match'
        });
        continue;
      }
      
      // Check exact example match
      for (const example of examples) {
        const exampleLower = example.toLowerCase();
        if (lowerQuery === exampleLower) {
          matches.push({
            tool,
            confidence: 95,
            reasoning: `Exact example match: "${example}"`
          });
          break;
        }
      }
    }
    
    return matches;
  }
}

/**
 * Fuzzy match strategy - uses Levenshtein distance and keyword matching
 */
class FuzzyMatcher implements MatcherStrategy {
  name = 'fuzzy';
  priority = 60;
  
  async match(query: string, tools: ToolMetadata[]): Promise<ToolMatch[]> {
    const lowerQuery = query.toLowerCase().trim();
    const matches: ToolMatch[] = [];

    console.log(`[FuzzyMatcher] Matching query: "${query}" against ${tools.length} tools`);

    for (const tool of tools) {
      let bestScore = 0;
      let bestMatch = '';

      // Check tool name similarity
      const nameScore = this.similarity(lowerQuery, tool.name.toLowerCase());
      if (nameScore > bestScore) {
        bestScore = nameScore;
        bestMatch = tool.name;
      }

      // Check examples similarity
      const examples = (tool as any).examples || [];
      for (const example of examples) {
        // Remove placeholders like {query}, {title} for better matching
        const exampleNormalized = example.toLowerCase().replace(/\{[^}]+\}/g, '').trim();

        // Check if query matches the pattern without the placeholder
        const exampleScore = this.similarity(lowerQuery, exampleNormalized);
        if (exampleScore > 0.5) {
          console.log(`[FuzzyMatcher] Similarity match! Tool: ${tool.name}, Example: "${example}", Normalized: "${exampleNormalized}", Score: ${exampleScore.toFixed(3)}`);
        }
        if (exampleScore > bestScore) {
          bestScore = exampleScore;
          bestMatch = example;
        }

        // Also check if query has extra words that could be the placeholder value
        // E.g., "open your users" should match "open {query}"
        const queryWords = lowerQuery.split(/\s+/);
        const patternWords = exampleNormalized.split(/\s+/).filter((w: string) => w.length > 0);

        // If query starts with the same words as the pattern, it's likely a match with parameter
        if (patternWords.length > 0 && queryWords.length >= patternWords.length) {
          const matchesPattern = patternWords.every((word: string, i: number) =>
            queryWords[i] && queryWords[i].includes(word)
          );

          if (matchesPattern) {
            // Boost score for parameter-based patterns
            const paramScore = 0.85 + (patternWords.length / queryWords.length * 0.10);
            console.log(`[FuzzyMatcher] Pattern match! Tool: ${tool.name}, Example: "${example}", Pattern words: [${patternWords.join(', ')}], Query words: [${queryWords.join(', ')}], Score: ${paramScore}`);
            if (paramScore > bestScore) {
              bestScore = paramScore;
              bestMatch = `${example} (pattern match with parameter)`;
            }
          }
        }
      }
      
      // Check keyword overlap
      const keywords = tool.description?.toLowerCase().split(/\s+/) || [];
      const queryWords = lowerQuery.split(/\s+/);
      const keywordScore = queryWords.filter(w => keywords.includes(w)).length / queryWords.length;
      
      if (keywordScore > bestScore) {
        bestScore = keywordScore;
        bestMatch = 'keyword overlap';
      }
      
      // Only include if confidence > 50%
      if (bestScore > 0.5) {
        console.log(`[FuzzyMatcher] ✓ Match found! Tool: ${tool.name}, Score: ${Math.round(bestScore * 100)}%, Reason: ${bestMatch}, Component: ${tool.componentName || 'ungrouped'}`);
        matches.push({
          tool,
          confidence: Math.round(bestScore * 100),
          reasoning: `Fuzzy match: ${bestMatch}`
        });
      }
    }
    
    return matches;
  }
  
  /**
   * Calculate similarity between two strings (0-1)
   * Uses Levenshtein distance normalized by string length
   */
  private similarity(a: string, b: string): number {
    const distance = this.levenshtein(a, b);
    const maxLength = Math.max(a.length, b.length);
    return 1 - (distance / maxLength);
  }
  
  /**
   * Levenshtein distance algorithm
   */
  private levenshtein(a: string, b: string): number {
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
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    return matrix[b.length][a.length];
  }
}

