/**
 * ToolProvider Decorator
 *
 * Class-level decorator for configuring AI tool providers.
 * Provides default settings for all tools in a class.
 */

import type { ToolRegistry as ToolRegistryType } from '../background/registry/ToolRegistry';

// We'll get ToolRegistry lazily to avoid circular dependency issues
let ToolRegistryRef: typeof ToolRegistryType | null = null;

function getToolRegistry(): typeof ToolRegistryType {
  if (!ToolRegistryRef) {
    // Import ToolRegistry (works in both browser and Node.js)
    ToolRegistryRef = require('../background/registry/ToolRegistry').ToolRegistry;
  }
  return ToolRegistryRef!;
}

/**
 * ContainerScope constant for use in ToolProviderConfig.containerId
 * - 'global': Tool available on all pages (default)
 * - Route path (e.g., '/examples'): Tool scoped to that route and sub-routes
 */
export const CONTAINER_SCOPE_GLOBAL = 'global' as const;

export interface ToolProviderConfig {
  name?: string; // Provider name (defaults to class name)
  description?: string; // Human-readable description of this provider
  category?: string; // Default category for all tools
  /**
   * Container/context scoping for tools
   * - 'global' (default): Available on all pages
   * - Route path (e.g., '/examples'): Scoped to that route and sub-routes
   */
  containerId?: string;
  aiEnabled?: boolean; // Default AI enablement
  dangerLevel?: 'safe' | 'moderate' | 'dangerous' | 'destructive';
  requiresApproval?: boolean; // Default approval requirement
  executionContext?: 'ui' | 'api' | 'both';
  tags?: string[]; // Additional tags for all tools
  permissions?: {
    level?: string;
    sensitiveDataAccess?: boolean;
    networkAccess?: boolean;
    requiredScopes?: string[];
  };
}

/**
 * ToolProvider decorator - configures a class as an AI tool provider
 *
 * Automatically binds instances when they're created, so users don't need
 * to manually call ToolRegistry.bindInstance().
 *
 * @example Shorthand syntax (just containerId)
 * ```typescript
 * @ToolProvider('MyContainer')
 * class MyTools {
 *   @Tool('button', { examples: ['click'] })
 *   async action() {}
 * }
 * ```
 * 
 * @example Full config syntax
 * ```typescript
 * @ToolProvider({
 *   containerId: 'MyContainer',
 *   category: 'user_interaction',
 *   aiEnabled: true
 * })
 * class MyTools { }
 * ```
 * 
 * @param configOrContainerId Provider configuration or just containerId for shorthand
 */
// Type-safe overloads
// eslint-disable-next-line no-redeclare
export function ToolProvider(containerId: string): <T extends { new (...args: any[]): {} }>(constructor: T) => T;
// eslint-disable-next-line no-redeclare
export function ToolProvider(config: ToolProviderConfig): <T extends { new (...args: any[]): {} }>(constructor: T) => T;
// eslint-disable-next-line no-redeclare
export function ToolProvider(
  configOrContainerId: ToolProviderConfig | string
): <T extends { new (...args: any[]): {} }>(constructor: T) => T {
  return function <T extends { new (...args: any[]): {} }>(constructor: T): T {
    // Normalize to ToolProviderConfig
    const config: ToolProviderConfig = typeof configOrContainerId === 'string'
      ? { containerId: configOrContainerId }
      : configOrContainerId;

    // Default containerId to 'global' if not specified
    if (!config.containerId) {
      config.containerId = CONTAINER_SCOPE_GLOBAL;
    }

    // Store provider config on the class
    (constructor as any).__toolProvider__ = {
      name: constructor.name,
      config,
      registeredAt: new Date().toISOString(),
    };

    // Update all tools registered for this provider with inherited values
    const TR = getToolRegistry();
    if (TR) {
      const tools = TR.getToolsByProvider(constructor.name);
      tools.forEach((tool: any) => {
        // Apply inherited values from provider config
        if (config.containerId && !tool.containerId) {
          tool.containerId = config.containerId;
        }
        if (config.aiEnabled !== undefined && tool.aiEnabled === undefined) {
          tool.aiEnabled = config.aiEnabled;
        }
      });
    }

    // Wrap constructor to auto-bind instance on creation
    const WrappedConstructor = class extends constructor {
      constructor(...args: any[]) {
        super(...args);
        
        // Auto-bind this instance's methods to ToolRegistry
        // Only on client side (not during SSR)
        if (typeof window !== 'undefined') {
          const TR = getToolRegistry();
          if (TR) {
            TR.bindInstance(this);
          } else {
            console.warn(`⚠️  [ToolProvider] ToolRegistry not available for ${constructor.name}`);
          }
        }
      }
    };

    // Preserve original class name for debugging
    Object.defineProperty(WrappedConstructor, 'name', {
      value: constructor.name,
      writable: false
    });

    console.log(`🏭 Registered Tool Provider: ${constructor.name} (auto-binding enabled)`);

    return WrappedConstructor as T;
  };
}

/**
 * Get tool provider configuration for a class
 */
export function getToolProviderConfig(target: any): ToolProviderConfig | undefined {
  return target.constructor?.__toolProvider__?.config;
}

/**
 * Check if a class is a tool provider
 */
export function isToolProvider(target: any): boolean {
  return !!target.constructor?.__toolProvider__;
}
