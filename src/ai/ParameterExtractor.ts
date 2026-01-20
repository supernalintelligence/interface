/**
 * ParameterExtractor - Extract parameters from natural language queries
 * 
 * Supports multiple extraction strategies:
 * - Pattern-based (using tool examples)
 * - Entity extraction (dates, numbers, names)
 * - LLM-based extraction (structured JSON)
 */

import type { ToolMetadata } from '../decorators/Tool';

/**
 * Extracted parameter with metadata
 */
export interface ExtractedParameter {
  value: any;
  type: 'string' | 'number' | 'boolean' | 'date' | 'object';
  confidence: number; // 0-100
  source: 'pattern' | 'entity' | 'llm';
}

/**
 * Parameter extraction result
 */
export interface ExtractionResult {
  parameters: any[];
  confidence: number;
  reasoning?: string;
}

/**
 * Base interface for extraction strategies
 */
export interface ExtractorStrategy {
  name: string;
  priority: number;
  
  extract(query: string, tool: ToolMetadata): Promise<ExtractionResult | null>;
}

/**
 * Main ParameterExtractor orchestrator
 */
export class ParameterExtractor {
  private strategies: ExtractorStrategy[] = [];
  
  constructor() {
    // Register default strategies
    this.registerStrategy(new PatternExtractor());
    this.registerStrategy(new EntityExtractor());
  }
  
  /**
   * Register a new extraction strategy
   */
  registerStrategy(strategy: ExtractorStrategy): void {
    this.strategies.push(strategy);
    this.strategies.sort((a, b) => b.priority - a.priority);
  }
  
  /**
   * Extract parameters from query for a specific tool
   */
  async extract(query: string, tool: ToolMetadata): Promise<ExtractionResult> {
    // Try each strategy in priority order
    for (const strategy of this.strategies) {
      try {
        const result = await strategy.extract(query, tool);
        if (result && result.confidence >= 60) {
          console.log(`✅ [ParamExtract] Used strategy: ${strategy.name}`, result);
          return result;
        }
      } catch (error) {
        console.warn(`[ParamExtract] Strategy ${strategy.name} failed:`, error);
      }
    }
    
    // No successful extraction
    return {
      parameters: [],
      confidence: 0,
      reasoning: 'No extraction strategy succeeded'
    };
  }
}

/**
 * Pattern-based extraction using tool examples
 */
class PatternExtractor implements ExtractorStrategy {
  name = 'pattern';
  priority = 80;
  
  async extract(query: string, tool: ToolMetadata): Promise<ExtractionResult | null> {
    const examples = (tool as any).examples || [];
    if (examples.length === 0) {
      return null;
    }
    
    const lowerQuery = query.toLowerCase().trim();
    
    // Try to match each example pattern
    for (const example of examples) {
      const pattern = example.toLowerCase();
      
      // Check if query starts with the pattern
      if (lowerQuery.startsWith(pattern)) {
        // Extract trailing text as parameter
        const trailing = query.substring(example.length).trim();
        
        if (trailing) {
          console.log(`🔍 [PatternExtract] Matched: "${example}" → param: "${trailing}"`);
          return {
            parameters: [trailing],
            confidence: 90,
            reasoning: `Matched pattern: "${example}"`
          };
        }
      }
      
      // Check if pattern contains a placeholder (e.g., "open blog {title}")
      const placeholderMatch = pattern.match(/\{(\w+)\}/);
      if (placeholderMatch) {
        // Create a regex from the pattern
        const regexPattern = pattern.replace(/\{(\w+)\}/g, '(.+?)');
        const regex = new RegExp(`^${regexPattern}$`, 'i');
        const match = lowerQuery.match(regex);
        
        if (match && match[1]) {
          console.log(`🔍 [PatternExtract] Placeholder match: "${example}" → param: "${match[1]}"`);
          return {
            parameters: [match[1].trim()],
            confidence: 95,
            reasoning: `Matched placeholder in: "${example}"`
          };
        }
      }
    }
    
    return null;
  }
}

/**
 * Entity extraction for common types (numbers, dates, etc.)
 */
class EntityExtractor implements ExtractorStrategy {
  name = 'entity';
  priority = 60;
  
  async extract(query: string, tool: ToolMetadata): Promise<ExtractionResult | null> {
    const parameters: any[] = [];
    
    // Extract numbers
    const numberMatch = query.match(/\d+/);
    if (numberMatch) {
      parameters.push(parseInt(numberMatch[0], 10));
    }
    
    // Extract quoted strings
    const quotedMatch = query.match(/"([^"]+)"/);
    if (quotedMatch) {
      parameters.push(quotedMatch[1]);
    }
    
    // Extract common entities (colors, themes, etc.)
    const colorMatch = query.match(/\b(red|blue|green|dark|light|black|white)\b/i);
    if (colorMatch) {
      parameters.push(colorMatch[1].toLowerCase());
    }
    
    if (parameters.length > 0) {
      return {
        parameters,
        confidence: 70,
        reasoning: `Extracted ${parameters.length} entities`
      };
    }
    
    return null;
  }
}

