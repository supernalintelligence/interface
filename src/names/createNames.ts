/**
 * Create Component Names Helper
 * 
 * Creates a component namespace with automatic kebab-case conversion and registry.
 * 
 * Supports multiple formats for maximum flexibility:
 * 
 * @example Minimal array format (fastest to write)
 * ```typescript
 * export const Blog = createNames('blog', ['container', 'searchInput', 'postCard']);
 * // Result: { container: 'blog-container', searchInput: 'blog-search-input', postCard: 'blog-post-card' }
 * ```
 * 
 * @example Object format (same as current)
 * ```typescript
 * export const Blog = createNames('blog', {
 *   container: 'container',
 *   searchInput: 'searchInput',
 *   postCard: 'postCard',
 * });
 * ```
 * 
 * @example Custom suffixes (for special cases)
 * ```typescript
 * export const Blog = createNames('blog', {
 *   container: 'main-wrapper',  // Becomes 'blog-main-wrapper'
 *   searchInput: 'search',       // Becomes 'blog-search'
 * });
 * ```
 */

import { architectureRegistry } from '../architecture/registry';

/**
 * Convert camelCase to kebab-case
 */
function camelToKebab(str: string): string {
  return str
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase()
    .replace(/^-/, ''); // Remove leading dash if first char was uppercase
}

// Overload signatures for different input types
// eslint-disable-next-line no-redeclare
export function createNames<P extends string, K extends string>(
  prefix: P,
  names: readonly K[]
): { [Key in K]: `${P}-${string}` };

// eslint-disable-next-line no-redeclare
export function createNames<P extends string, N extends Record<string, string>>(
  prefix: P,
  names: N
): { [K in keyof N]: `${P}-${string}` };

/**
 * Create component names with automatic prefixing and kebab-case conversion
 * 
 * @param prefix - The prefix for all component IDs (e.g., 'blog', 'demo')
 * @param names - Array of keys or object mapping keys to suffixes
 * @returns Object with fully qualified component IDs (prefix-suffix in kebab-case)
 */
// eslint-disable-next-line no-redeclare
export function createNames<P extends string>(
  prefix: P,
  names: readonly string[] | Record<string, string>
): Record<string, `${P}-${string}`> {
  const result: any = {};
  
  if (Array.isArray(names)) {
    // Array format: ['container', 'searchInput'] -> { container: 'blog-container', searchInput: 'blog-search-input' }
    for (const key of names) {
      const kebab = camelToKebab(key);
      result[key] = `${prefix}-${kebab}`;
    }
  } else {
    // Object format: { container: 'container' } -> { container: 'blog-container' }
    for (const [key, value] of Object.entries(names)) {
      const kebab = camelToKebab(value);
      result[key] = `${prefix}-${kebab}`;
    }
  }
  
  // Register with architecture registry
  architectureRegistry.registerComponent(prefix, result);
  
  return result;
}

/**
 * Type helper to extract component ID type
 */
export type ComponentId<T> = T extends Record<string, infer U> ? U : never;

/**
 * Get all component IDs from a namespace as a flat array
 */
export function getComponentIds<T extends Record<string, string>>(
  namespace: T
): string[] {
  return Object.values(namespace);
}

/**
 * Validate that a string is a valid component ID in a namespace
 */
export function isComponentId<T extends Record<string, string>>(
  namespace: T,
  id: string
): id is T[keyof T] {
  return Object.values(namespace).includes(id);
}

