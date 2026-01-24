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

export interface ToolProviderConfig {
  name?: string; // Provider name (defaults to class name)
  description?: string; // Human-readable description of this provider
  category?: string; // Default category for all tools
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
 * @example Zero-config syntax (no parameters needed)
 * ```typescript
 * @ToolProvider()
 * class MyTools {
 *   @Tool({ elementId: 'button', examples: ['click'] })
 *   async action() {}
 * }
 * ```
 *
 * @example Full config syntax
 * ```typescript
 * @ToolProvider({
 *   category: 'user_interaction',
 *   aiEnabled: true
 * })
 * class MyTools { }
 * ```
 *
 * @param config Provider configuration (optional)
 */
// eslint-disable-next-line no-redeclare
export function ToolProvider(config?: ToolProviderConfig): <T extends { new (...args: any[]): {} }>(constructor: T) => T {
  return function <T extends { new (...args: any[]): {} }>(constructor: T): T {
    // Use empty config if not provided
    const providerConfig: ToolProviderConfig = config || {};

    // Store provider config on the class
    (constructor as any).__toolProvider__ = {
      name: constructor.name,
      config: providerConfig,
      registeredAt: new Date().toISOString(),
    };

    // Update all tools registered for this provider with inherited values
    const TR = getToolRegistry();
    if (TR) {
      const tools = TR.getToolsByProvider(constructor.name);
      tools.forEach((tool: any) => {
        // Apply inherited values from provider config
        if (providerConfig.aiEnabled !== undefined && tool.aiEnabled === undefined) {
          tool.aiEnabled = providerConfig.aiEnabled;
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
