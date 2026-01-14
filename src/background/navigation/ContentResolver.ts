/**
 * ContentResolver - Interface for content-aware navigation
 *
 * Enables fuzzy navigation within a context by providing searchable content.
 * When a user says "open blog contracts", the ContentResolver fetches blog posts,
 * searches them, and returns the best match for navigation.
 *
 * Separation of Concerns:
 * - NavigationGraph: Knows routes and contexts
 * - ContentResolver: Knows how to search content within a context (pluggable)
 * - FuzzyMatcher: Generic string matching (reused)
 *
 * @example
 * ```typescript
 * // Register blog context with content resolver
 * NavigationGraph.getInstance().registerContext({
 *   id: 'blog',
 *   name: 'Blog',
 *   metadata: {
 *     route: '/blog',
 *     contentResolver: {
 *       fetch: () => fetch('/api/blog-posts').then(r => r.json()),
 *       searchFields: (post) => [post.title, post.slug, ...post.tags],
 *       toRoute: (post) => `/blog/${post.slug}`,
 *       toDisplay: (post) => ({ title: post.title, description: post.excerpt }),
 *     }
 *   }
 * });
 *
 * // Auto-generates tool that handles:
 * // - "go to blog" → /blog
 * // - "open blog contracts" → fuzzy search → /blog/matching-post
 * ```
 */

/**
 * Content item display info for suggestions
 */
export interface ContentDisplayInfo {
  /** Title to show in suggestions */
  title: string;
  /** Optional description/excerpt */
  description?: string;
}

/**
 * ContentResolver interface for fuzzy navigation within a context
 *
 * @template T - Type of content items (e.g., BlogPost, Product, User)
 */
export interface ContentResolver<T = any> {
  /**
   * Fetch searchable content
   *
   * This is called when a user searches within this context.
   * Results may be cached by the implementation.
   *
   * @returns Promise resolving to array of content items
   *
   * @example
   * ```typescript
   * fetch: () => fetch('/api/blog-posts').then(r => r.json())
   * fetch: async () => db.products.findMany()
   * ```
   */
  fetch: () => Promise<T[]>;

  /**
   * Extract searchable fields from an item
   *
   * Returns strings that will be matched against the user's query.
   * Order matters - first fields are weighted higher.
   *
   * @param item - Content item
   * @returns Array of searchable strings
   *
   * @example
   * ```typescript
   * searchFields: (post) => [post.title, post.slug, ...post.tags]
   * searchFields: (product) => [product.name, product.sku, product.brand]
   * ```
   */
  searchFields: (item: T) => string[];

  /**
   * Convert matched item to a navigation route
   *
   * @param item - Matched content item
   * @returns Route path to navigate to
   *
   * @example
   * ```typescript
   * toRoute: (post) => `/blog/${post.slug}`
   * toRoute: (product) => `/products/${product.id}`
   * ```
   */
  toRoute: (item: T) => string;

  /**
   * Optional: Custom display info for suggestions
   *
   * Used when showing "Did you mean..." suggestions.
   * If not provided, route path is used as title.
   *
   * @param item - Content item
   * @returns Display info for UI
   *
   * @example
   * ```typescript
   * toDisplay: (post) => ({ title: post.title, description: post.excerpt })
   * toDisplay: (product) => ({ title: product.name, description: `$${product.price}` })
   * ```
   */
  toDisplay?: (item: T) => ContentDisplayInfo;
}

/**
 * Result of a content-aware navigation
 */
export interface ContentNavigationResult<T = any> {
  /** Whether navigation was successful */
  success: boolean;
  /** Human-readable message */
  message: string;
  /** The matched item (if any) */
  item?: T;
  /** Suggestions if no exact match found */
  suggestions?: ContentDisplayInfo[];
}

/**
 * Navigation context extended with optional content resolver
 */
export interface NavigationContextMetadata {
  /** Route path for this context */
  route?: string;
  /** Content resolver for fuzzy navigation */
  contentResolver?: ContentResolver;
  /** Whether this context was auto-created */
  autoCreated?: boolean;
  /** Context type (page, modal, etc.) */
  type?: string;
  /** Additional metadata */
  [key: string]: any;
}
