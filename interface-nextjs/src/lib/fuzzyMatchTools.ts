/**
 * Fuzzy Matching Utilities
 * 
 * Shared fuzzy matching logic used by both:
 * - DemoAIInterface (client-side tool matching)
 * - CopilotKit mock endpoint (server-side fallback)
 */

import type { ToolMetadata } from "@supernal/interface/browser";

export interface FuzzyMatchResult {
  tool: ToolMetadata | undefined;
  score: number;
  confidence: number;
}

/**
 * Score how well a query matches a tool's examples, description, and method name
 */
export function scoreToolMatch(query: string, tool: ToolMetadata): number {
  const lowerQuery = query.toLowerCase().trim();
  let score = 0;
  
  // Check if query matches any examples
  if (tool.examples && Array.isArray(tool.examples)) {
    for (const example of tool.examples) {
      if (example && typeof example === 'string') {
        const exampleLower = example
          .replace(/\{[^}]+\}/g, '')
          .replace(/\s+/g, ' ')
          .trim()
          .toLowerCase();
        if (!exampleLower) {
          continue;
        }
        const queryWords = lowerQuery.split(/\s+/);
        const exampleWords = exampleLower.split(/\s+/);
        
        // Exact match gets highest score
        if (exampleLower === lowerQuery) {
          score += 20;
        }
        // Query is a complete word/phrase at start of example
        else if (exampleLower.startsWith(lowerQuery + ' ') || exampleLower.startsWith(lowerQuery)) {
          score += 15;
        }
        // All query words appear as complete words in example
        else if (queryWords.length > 1 && queryWords.every(qw => exampleWords.includes(qw))) {
          score += 12;
        }
        // Query is a significant word in example (at least 4 chars)
        else if (lowerQuery.length >= 4 && exampleWords.some(ew => ew === lowerQuery)) {
          score += 8;
        }
        // Partial word match as last resort
        else if (lowerQuery.length >= 5 && (exampleLower.includes(lowerQuery) || lowerQuery.includes(exampleLower))) {
          score += 3;
        }
      }
    }
  }
  
  // Check description match (lower weight)
  if (tool.description && typeof tool.description === 'string') {
    const descLower = tool.description.toLowerCase();
    if (descLower.includes(lowerQuery) && lowerQuery.length >= 4) {
      score += 2;
    }
  }
  
  // Check method name match (lower weight)
  if (tool.methodName && typeof tool.methodName === 'string') {
    const methodLower = tool.methodName.toLowerCase();
    const queryNoSpaces = lowerQuery.replace(/\s+/g, '');
    if (methodLower === queryNoSpaces) {
      score += 5;
    } else if (methodLower.includes(queryNoSpaces) && queryNoSpaces.length >= 4) {
      score += 2;
    }
  }
  
  return score;
}

/**
 * Find the best matching tool from a list
 */
export function findBestMatch(query: string, tools: ToolMetadata[]): FuzzyMatchResult {
  let bestTool: ToolMetadata | undefined;
  let bestScore = 0;
  
  for (const tool of tools) {
    const score = scoreToolMatch(query, tool);
    if (score > bestScore) {
      bestScore = score;
      bestTool = tool;
    }
  }
  
  return {
    tool: bestTool,
    score: bestScore,
    confidence: bestScore > 0 ? Math.min(bestScore / 10, 1) : 0
  };
}

/**
 * Generate a response message based on match result
 * Used by mock AI endpoint
 */
export function generateMatchResponse(query: string, match: FuzzyMatchResult): string {
  if (!match.tool) {
    return `I couldn't find a matching command for "${query}". Try commands like "increment counter", "set theme dark", or "reset".`;
  }
  
  const toolName = match.tool.name || match.tool.methodName || 'action';
  const confidence = Math.round(match.confidence * 100);
  
  if (match.confidence >= 0.8) {
    return `Executing ${toolName}.`;
  } else if (match.confidence >= 0.5) {
    return `I think you want to ${toolName} (${confidence}% confident). Executing...`;
  } else {
    return `Best match: ${toolName} (${confidence}% confident). If this isn't right, try being more specific.`;
  }
}






