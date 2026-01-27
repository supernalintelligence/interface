/**
 * Page Content Parser
 *
 * Extracts suggestions and content from the current page for:
 * - Rotating suggestion chips in SubtitleOverlay
 * - Page-aware contextual prompts
 */

export interface Suggestion {
  text: string;
  type: 'generic' | 'page-specific';
  action?: () => void;
}

/**
 * Generic suggestions that work on any page
 */
const GENERIC_SUGGESTIONS: Suggestion[] = [
  { text: "Try: navigate to...", type: 'generic' },
  { text: "Ask: what can I do here?", type: 'generic' },
  { text: "Show me around", type: 'generic' },
  { text: "What's on this page?", type: 'generic' },
];

/**
 * Extract page-specific suggestions from headings
 *
 * Scans H1-H3 elements and generates contextual suggestions
 */
function extractPageSpecificSuggestions(): Suggestion[] {
  if (typeof window === 'undefined') return [];

  const headings = document.querySelectorAll('h1, h2, h3');
  const suggestions: Suggestion[] = [];

  // Limit to first 3 headings for conciseness
  Array.from(headings)
    .slice(0, 3)
    .forEach(heading => {
      const text = heading.textContent?.trim();
      if (text && text.length > 0 && text.length < 50) {
        suggestions.push({
          text: `Ask about: ${text}`,
          type: 'page-specific'
        });
      }
    });

  return suggestions;
}

/**
 * Extract all suggestions (generic + page-specific)
 *
 * Returns a configurable mix of static and dynamic suggestions
 *
 * @param maxSuggestions - Maximum number of suggestions to return (default: 7)
 * @param genericRatio - Ratio of generic to page-specific (default: 0.4 = 40% generic)
 */
export function extractPageSuggestions(
  maxSuggestions: number = 7,
  genericRatio: number = 0.4
): Suggestion[] {
  const pageSpecific = extractPageSpecificSuggestions();

  // Calculate split
  const numGeneric = Math.ceil(maxSuggestions * genericRatio);
  const numPageSpecific = maxSuggestions - numGeneric;

  // Combine: generic first, then page-specific
  const suggestions: Suggestion[] = [
    ...GENERIC_SUGGESTIONS.slice(0, numGeneric),
    ...pageSpecific.slice(0, numPageSpecific)
  ];

  return suggestions;
}

/**
 * Truncate suggestion text if too long
 */
export function truncateSuggestion(text: string, maxLength: number = 40): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}
