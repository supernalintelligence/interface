/**
 * Tool Preset Decorator
 * 
 * Allows defining common configuration at file or class level to reduce
 * repetition across multiple tools.
 * 
 * DRY Principle: Define once, apply to many.
 * 
 * NOTE: Due to TypeScript decorator execution order (methods run before class),
 * we use a two-phase approach:
 * 1. Method decorators check for existing presets
 * 2. Class decorator applies retroactively if needed via metadata
 */

import { ToolConfig } from './Tool';
import { ToolCategory } from '../types';
import { ToolRegistry } from '../background/registry/ToolRegistry';

/**
 * Storage for preset configurations
 * Keyed by class/file identifier
 */
const presetRegistry = new Map<string, Partial<ToolConfig>>();

/**
 * Pending tools that need preset applied when class decorator runs
 * Maps className -> array of {toolId, userConfig}
 */
const pendingPresets = new Map<string, Array<{toolId: string, userConfig: Partial<ToolConfig>}>>();

/**
 * Get the current preset for a class (if any)
 */
export function getToolPreset(target: any): Partial<ToolConfig> | undefined {
  // For method decorators, target is the prototype, so we need to get the constructor
  const constructor = target.constructor || target;
  const className = constructor.name;
  return presetRegistry.get(className);
}

/**
 * Register a tool as pending preset application
 */
export function registerPendingPreset(className: string, toolId: string, userConfig: Partial<ToolConfig>) {
  if (!pendingPresets.has(className)) {
    pendingPresets.set(className, []);
  }
  pendingPresets.get(className)!.push({toolId, userConfig});
}

/**
 * @ToolPreset - Define common tool configuration at class level
 * 
 * All tools within this class will inherit these defaults unless overridden.
 * 
 * Due to decorator execution order, this runs AFTER method decorators,
 * so we retroactively apply the preset to all registered methods.
 * 
 * @example
 * ```typescript
 * @ToolPreset({
 *   category: ToolCategory.CHAT,
 *   tags: ['chat', 'messaging']
 * })
 * class ChatTools {
 *   @AITool({ toolId: 'send-message', elementId: 'send-btn' })
 *   async sendMessage(text: string) {
 *     // Inherits category, tags from preset
 *   }
 *   
 *   @AITool({ 
 *     toolId: 'clear-chat',
 *     category: ToolCategory.UTILITY  // Override preset category
 *   })
 *   async clearChat() {
 *     // Uses UTILITY instead of CHAT
 *   }
 * }
 * ```
 */
export function ToolPreset(preset: Partial<ToolConfig>) {
  return function<T extends { new (...args: any[]): {} }>(constructor: T) {
    const className = constructor.name;
    
    // Store preset for this class
    presetRegistry.set(className, preset);
    
    // Apply preset retroactively to all pending tools in this class
    const toolEntries = pendingPresets.get(className) || [];
    
    for (const {toolId, userConfig} of toolEntries) {
      const tool = ToolRegistry.getTool(toolId);
      
      if (tool) {
        // Merge with correct priority: userConfig > preset > tool defaults
        const merged = {
          ...tool,       // Tool with specialized defaults
          ...preset,     // Preset overrides defaults
          ...userConfig, // User config overrides everything
          // Deep merge nested objects
          permissions: {
            ...tool.permissions,
            ...preset.permissions,
            ...userConfig.permissions,
          },
          callbacks: {
            ...tool.callbacks,
            ...preset.callbacks,
            ...userConfig.callbacks,
          },
          origin: {
            ...tool.origin,
            ...preset.origin,
            ...userConfig.origin,
          },
        };
        
        // Update the tool in registry
        const [providerName, methodName] = toolId.split('.');
        ToolRegistry.registerTool(providerName, methodName, merged as any);
      }
    }
    
    // Clear pending for this class
    pendingPresets.delete(className);
    
    // Return the original class (decorator doesn't modify it)
    return constructor;
  };
}

/**
 * Apply preset to a tool config if available
 * Called internally by specialized tool decorators
 * 
 * NOTE: This function now just returns the preset, the actual merging
 * is done in the specialized decorator factory.
 */
export function applyPreset(
  target: any,
  config: Partial<ToolConfig>
): Partial<ToolConfig> {
  const preset = getToolPreset(target);
  return preset || {};
}

/**
 * Clear all presets (useful for testing)
 */
export function clearToolPresets() {
  presetRegistry.clear();
}

// ============================================================================
// Predefined Preset Templates
// ============================================================================

/**
 * Common preset templates for typical use cases
 */
export const PresetTemplates = {
  /**
   * Chat/Messaging preset
   */
  Chat: {
    category: ToolCategory.CHAT,
    tags: ['chat', 'messaging'],
    executionContext: 'both' as const,
  } as Partial<ToolConfig>,
  
  /**
   * Settings/Configuration preset
   */
  Settings: {
    category: ToolCategory.SETTINGS,
    tags: ['settings', 'configuration'],
    executionContext: 'both' as const,
  } as Partial<ToolConfig>,
  
  /**
   * Search preset
   */
  Search: {
    category: ToolCategory.SEARCH,
    tags: ['search', 'query'],
    executionContext: 'api' as const,
  } as Partial<ToolConfig>,
  
  /**
   * Navigation preset
   */
  Navigation: {
    category: ToolCategory.NAVIGATION,
    tags: ['navigation', 'routing'],
    executionContext: 'ui' as const,
    callbacks: {
      navigation: true,
    },
  } as Partial<ToolConfig>,
  
  /**
   * Data Management preset
   */
  Data: {
    category: ToolCategory.DATA,
    tags: ['data', 'crud'],
    executionContext: 'api' as const,
  } as Partial<ToolConfig>,
  
  /**
   * Onboarding/Help preset
   */
  Onboarding: {
    category: ToolCategory.ONBOARDING,
    tags: ['onboarding', 'help', 'tutorial'],
    executionContext: 'ui' as const,
    generateStories: true,
  } as Partial<ToolConfig>,
} as const;

/**
 * Helper function to create preset from template
 * 
 * @example
 * ```typescript
 * @ToolPreset(createPreset('Chat', { category: ToolCategory.CHAT }))
 * class ChatTools {
 *   // All tools inherit Chat preset
 * }
 * ```
 */
export function createPreset(
  template: keyof typeof PresetTemplates,
  overrides: Partial<ToolConfig> = {}
): Partial<ToolConfig> {
  return {
    ...PresetTemplates[template],
    ...overrides,
  };
}

// ============================================================================
// Context-Based Presets (for modal/container-specific tools)
// ============================================================================

/**
 * Create a preset for tools within a specific component
 *
 * Note: Component grouping is now handled automatically by the @Component decorator
 * via the componentName field. This helper is mainly for setting category and other
 * common config for component-specific tools.
 *
 * @example
 * ```typescript
 * @ToolPreset(componentPreset('ChatModal', ToolCategory.CHAT))
 * class ChatModalTools {
 *   @AITool({ toolId: 'send' })
 *   async send(text: string) {
 *     // Automatically grouped by component via @Component decorator
 *   }
 * }
 * ```
 */
export function componentPreset(
  _componentName: string,
  category: ToolCategory,
  additionalConfig: Partial<ToolConfig> = {}
): Partial<ToolConfig> {
  // Note: componentName is now set by @Component decorator, not here
  return {
    category,
    ...additionalConfig,
  };
}

/**
 * Create a preset for tools on a specific path/route
 * 
 * @example
 * ```typescript
 * @ToolPreset(pathPreset('/settings', ToolCategory.SETTINGS))
 * class SettingsPageTools {
 *   // All tools inherit path context
 * }
 * ```
 */
export function pathPreset(
  path: string,
  category: ToolCategory,
  additionalConfig: Partial<ToolConfig> = {}
): Partial<ToolConfig> {
  return {
    category,
    origin: {
      path,
    },
    ...additionalConfig,
  };
}

