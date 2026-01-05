/**
 * Create Container Helper
 * 
 * Creates a container configuration and registers it with the architecture registry.
 * Supports multiple formats from minimal to fully configured.
 * 
 * @example Minimal format (infers most fields)
 * ```typescript
 * export const BlogContainer = createContainer('Blog', 'page');
 * // Result: { id: 'blog', name: 'Blog', type: 'page', route: '/blog' }
 * ```
 * 
 * @example With route override
 * ```typescript
 * export const BlogContainer = createContainer('Blog', 'page', '/posts');
 * // Result: { id: 'blog', name: 'Blog', type: 'page', route: '/posts' }
 * ```
 * 
 * @example Full config object (maximum control)
 * ```typescript
 * export const BlogContainer = createContainer({
 *   id: 'blog-archive',
 *   name: 'Blog',
 *   type: 'page',
 *   route: '/archive',
 *   description: 'Blog archive page',
 *   metadata: { category: 'content' }
 * });
 * ```
 */

import { architectureRegistry } from '../architecture/registry';

export interface ContainerConfig {
  id: string;
  name: string;
  type: 'page' | 'modal' | 'drawer' | 'section';
  route?: string;
  description?: string;
  parent?: string;
  metadata?: Record<string, any>;
}

/**
 * Convert name to kebab-case ID
 */
function nameToId(name: string): string {
  return name
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase()
    .replace(/^-/, '');
}

/**
 * Convert name to default route
 */
function nameToRoute(name: string): string {
  return '/' + nameToId(name);
}

// Overload signatures
// eslint-disable-next-line no-redeclare
export function createContainer(
  name: string,
  type: 'page' | 'modal' | 'drawer' | 'section',
  route?: string
): ContainerConfig;

// eslint-disable-next-line no-redeclare
export function createContainer(config: ContainerConfig): ContainerConfig;

/**
 * Create and register a container with flexible input formats
 */
// eslint-disable-next-line no-redeclare
export function createContainer(
  nameOrConfig: string | ContainerConfig,
  type?: 'page' | 'modal' | 'drawer' | 'section',
  route?: string
): ContainerConfig {
  let config: ContainerConfig;
  
  if (typeof nameOrConfig === 'string') {
    // Minimal format: createContainer('Blog', 'page', '/custom-route')
    if (!type) {
      throw new Error('Type is required when using string format');
    }
    
    const name = nameOrConfig;
    const id = nameToId(name);
    const inferredRoute = route || nameToRoute(name);
    
    config = {
      id,
      name,
      type,
      route: inferredRoute,
    };
  } else {
    // Full config object format
    config = nameOrConfig;
    
    // Validate required fields
    if (!config.id || !config.name || !config.type) {
      throw new Error('Container must have id, name, and type');
    }
    
    // Infer route if not provided and type is page
    if (!config.route && config.type === 'page') {
      config.route = nameToRoute(config.name);
    }
  }
  
  // Register with architecture
  architectureRegistry.registerContainer(config.name, config);
  
  return config;
}

/**
 * Create multiple containers at once
 * 
 * @example
 * ```typescript
 * export const Containers = createContainers({
 *   Blog: { id: 'blog', name: 'Blog', type: 'page', route: '/blog' },
 *   Demo: { id: 'demo', name: 'Demo', type: 'page', route: '/demo' },
 * });
 * ```
 */
export function createContainers<T extends Record<string, ContainerConfig>>(
  configs: T
): T {
  const result: any = {};
  
  for (const [key, config] of Object.entries(configs)) {
    result[key] = createContainer(config);
  }
  
  return result;
}

/**
 * Type helper for container names
 */
export type ContainerName<T> = T extends { name: infer N } ? N : never;

