/**
 * Fuzzy Matching Utility
 * Finds items that best match a search query
 */

export class FuzzyMatcher {
  /**
   * Find item that best matches the query
   */
  static findBest<T>(
    items: T[],
    query: string,
    getSearchableText: (item: T) => string[]
  ): T | null {
    const lowerQuery = query.toLowerCase().trim();
    
    if (!lowerQuery) return null;

    // Try exact match first
    let match = items.find(item => {
      const texts = getSearchableText(item);
      return texts.some(text => text.toLowerCase() === lowerQuery);
    });

    if (match) return match;

    // Try contains match
    match = items.find(item => {
      const texts = getSearchableText(item);
      return texts.some(text => text.toLowerCase().includes(lowerQuery));
    });

    if (match) return match;

    // Try word match (any word in query appears in text)
    const queryWords = lowerQuery.split(/\s+/);
    match = items.find(item => {
      const texts = getSearchableText(item);
      return texts.some(text => {
        const lowerText = text.toLowerCase();
        return queryWords.some(word => lowerText.includes(word));
      });
    });

    return match || null;
  }

  /**
   * Find all items that match the query (ranked by relevance)
   */
  static findAll<T>(
    items: T[],
    query: string,
    getSearchableText: (item: T) => string[]
  ): T[] {
    const lowerQuery = query.toLowerCase().trim();
    
    if (!lowerQuery) return [];

    const scored = items.map(item => {
      const texts = getSearchableText(item);
      let score = 0;

      for (const text of texts) {
        const lowerText = text.toLowerCase();
        
        // Exact match (highest score)
        if (lowerText === lowerQuery) {
          score += 100;
        }
        
        // Starts with query
        if (lowerText.startsWith(lowerQuery)) {
          score += 50;
        }
        
        // Contains query
        if (lowerText.includes(lowerQuery)) {
          score += 25;
        }
        
        // Word matches
        const queryWords = lowerQuery.split(/\s+/);
        const matchedWords = queryWords.filter(word => lowerText.includes(word));
        score += matchedWords.length * 10;
      }

      return { item, score };
    });

    return scored
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .map(({ item }) => item);
  }
}

