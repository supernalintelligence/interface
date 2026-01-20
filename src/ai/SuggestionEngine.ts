/**
 * SuggestionEngine - "Did You Mean?" system for invalid queries
 * 
 * Provides helpful suggestions when user queries don't match any tools:
 * - Typo detection (Levenshtein distance)
 * - Similar command suggestions
 * - Available command list
 */

import type { ToolMetadata } from '../decorators/Tool';

/**
 * Suggestion with confidence
 */
export interface Suggestion {
  text: string;
  confidence: number; // 0-100
  type: 'typo' | 'similar' | 'example' | 'category';
  tool?: ToolMetadata;
}

/**
 * SuggestionEngine for generating "Did You Mean?" prompts
 */
export class SuggestionEngine {
  /**
   * Generate suggestions for an invalid/ambiguous query
   * @param query User's query
   * @param tools Available tools
   * @param maxSuggestions Maximum number of suggestions to return
   */
  getSuggestions(
    query: string,
    tools: ToolMetadata[],
    maxSuggestions: number = 5
  ): Suggestion[] {
    const suggestions: Suggestion[] = [];
    const lowerQuery = query.toLowerCase().trim();
    
    // 1. Check for typos (Levenshtein distance ≤ 3)
    for (const tool of tools) {
      const examples = (tool as any).examples || [];
      const allPhrases = [tool.name, ...examples];
      
      for (const phrase of allPhrases) {
        const distance = this.levenshtein(lowerQuery, phrase.toLowerCase());
        
        if (distance <= 3 && distance > 0) {
          const confidence = Math.round((1 - distance / Math.max(lowerQuery.length, phrase.length)) * 100);
          
          suggestions.push({
            text: phrase,
            confidence,
            type: 'typo',
            tool
          });
        }
      }
    }
    
    // 2. Find similar commands (keyword overlap)
    const queryWords = lowerQuery.split(/\s+/);
    for (const tool of tools) {
      const examples = (tool as any).examples || [];
      const toolWords = [
        ...tool.name.toLowerCase().split(/\s+/),
        ...(tool.description?.toLowerCase().split(/\s+/) || []),
        ...examples.flatMap((e: string) => e.toLowerCase().split(/\s+/))
      ];
      
      const overlap = queryWords.filter(w => toolWords.includes(w)).length;
      if (overlap > 0) {
        const confidence = Math.round((overlap / queryWords.length) * 100);
        
        // Use first example if available, otherwise tool name
        const text = examples[0] || tool.name;
        
        suggestions.push({
          text,
          confidence,
          type: 'similar',
          tool
        });
      }
    }
    
    // 3. Category-based suggestions
    const categoryMatch = this.matchCategory(lowerQuery);
    if (categoryMatch) {
      const categoryTools = tools.filter(t => t.category === categoryMatch);
      for (const tool of categoryTools.slice(0, 3)) {
        const examples = (tool as any).examples || [];
        const text = examples[0] || tool.name;
        
        suggestions.push({
          text,
          confidence: 60,
          type: 'category',
          tool
        });
      }
    }
    
    // Sort by confidence and deduplicate
    const sorted = suggestions
      .sort((a, b) => b.confidence - a.confidence)
      .filter((s, i, arr) => 
        // Remove duplicates (same text)
        i === arr.findIndex(other => other.text === s.text)
      )
      .slice(0, maxSuggestions);
    
    return sorted;
  }
  
  /**
   * Format suggestions into a user-friendly message
   */
  formatSuggestions(suggestions: Suggestion[]): string {
    if (suggestions.length === 0) {
      return 'No suggestions available. Try typing "help" to see all commands.';
    }
    
    const typos = suggestions.filter(s => s.type === 'typo');
    const similar = suggestions.filter(s => s.type === 'similar' || s.type === 'category');
    
    let message = '';
    
    if (typos.length > 0) {
      message += '❓ Did you mean?\n';
      for (const typo of typos.slice(0, 3)) {
        message += `  • "${typo.text}"\n`;
      }
    }
    
    if (similar.length > 0) {
      if (message) message += '\n';
      message += '💡 Similar commands:\n';
      for (const sim of similar.slice(0, 3)) {
        message += `  • "${sim.text}"\n`;
      }
    }
    
    return message.trim();
  }
  
  /**
   * Match query to a category
   */
  private matchCategory(query: string): string | null {
    const categories: Record<string, string[]> = {
      'navigation': ['go', 'open', 'navigate', 'show', 'view', 'page'],
      'theme': ['theme', 'color', 'dark', 'light', 'appearance'],
      'data': ['load', 'fetch', 'get', 'data', 'retrieve'],
      'form': ['submit', 'save', 'form', 'input', 'enter'],
      'state': ['set', 'change', 'update', 'modify', 'status']
    };
    
    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some(kw => query.includes(kw))) {
        return category;
      }
    }
    
    return null;
  }
  
  /**
   * Calculate Levenshtein distance between two strings
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

