/**
 * Specialized Tool Decorators
 * 
 * Simplified, context-specific decorators that reduce boilerplate by providing
 * sensible defaults for different use cases.
 * 
 * DRY Principle: All specialized decorators inherit from base Tool decorator
 * with context-specific overrides.
 */

import { Tool, ToolConfig } from './Tool';
import { ToolCategory } from '../types';
import { applyPreset, registerPendingPreset } from './ToolPreset';

/**
 * Base function to create specialized tool decorators
 * DRY: All specialized decorators use this factory
 * 
 * Merge order (highest priority first):
 * 1. User config (explicit overrides)
 * 2. Preset config (class-level @ToolPreset) - applied retroactively
 * 3. Specialized defaults (from decorator type)
 * 4. Base defaults (from Tool decorator)
 */
function createSpecializedTool(defaults: Partial<ToolConfig>) {
  return function(config: Partial<ToolConfig> = {}) {
    // Return decorator function that can access target
    return function(target: any, propertyKey?: string | symbol, descriptor?: PropertyDescriptor) {
      // Get preset if available (only for class methods)
      // Note: Preset might not be registered yet due to decorator execution order
      const preset = propertyKey ? applyPreset(target, {}) : {};
      
      // Merge with correct priority:
      // config (user) > preset > defaults (specialized)
      const mergedConfig: ToolConfig = {
        ...defaults,        // Specialized defaults (lowest priority)
        ...preset,          // Preset (middle priority) - might be empty initially
        ...config,          // User config (highest priority)
        // Deep merge nested objects
        permissions: {
          ...defaults.permissions,
          ...preset.permissions,
          ...config.permissions,
        },
        callbacks: {
          ...defaults.callbacks,
          ...preset.callbacks,
          ...config.callbacks,
        },
        origin: {
          ...defaults.origin,
          ...preset.origin,
          ...config.origin,
        },
      };
      
      // Apply the base Tool decorator
      const result = Tool(mergedConfig)(target, propertyKey!, descriptor!);
      
      // Register this tool as pending preset application (for class methods only)
      if (propertyKey) {
        const className = target.constructor?.name || 'Unknown';
        const methodName = String(propertyKey);
        const toolId = `${className}.${methodName}`;
        registerPendingPreset(className, toolId, config); // Pass user config
      }
      
      return result;
    };
  };
}

// ============================================================================
// AI-Enabled Tools
// ============================================================================

/**
 * @AITool - Tools that AI can safely use
 * 
 * Default Configuration:
 * - aiEnabled: true
 * - toolType: 'ai-safe'
 * - dangerLevel: 'safe'
 * - requiresApproval: false
 * - generateSimulation: true
 * - generateStories: true
 * 
 * @example
 * ```typescript
 * @AITool({ toolId: 'search-button' })
 * async search(query: string) {
 *   return await api.search(query);
 * }
 * ```
 */
export const AITool = createSpecializedTool({
  aiEnabled: true,
  toolType: 'ai-safe',
  dangerLevel: 'safe',
  requiresApproval: false,
  generateSimulation: true,
  generateStories: true,
  permissions: {
    level: 'auto_approve',
    sensitiveDataAccess: false,
    networkAccess: false,
  },
});

/**
 * @DangerousTool - Tools that require approval before AI can use
 * 
 * Default Configuration:
 * - aiEnabled: true (but requires approval)
 * - toolType: 'ai-dangerous'
 * - dangerLevel: 'dangerous'
 * - requiresApproval: true
 * - generateSimulation: true
 * - generateStories: true
 * 
 * @example
 * ```typescript
 * @DangerousTool({ 
 *   toolId: 'delete-account',
 *   description: 'Permanently delete user account'
 * })
 * async deleteAccount(userId: string) {
 *   return await api.deleteAccount(userId);
 * }
 * ```
 */
export const DangerousTool = createSpecializedTool({
  aiEnabled: true,
  toolType: 'ai-dangerous',
  dangerLevel: 'dangerous',
  requiresApproval: true,
  generateSimulation: true,
  generateStories: true,
  permissions: {
    level: 'approve_once',
    sensitiveDataAccess: true,
    networkAccess: true,
  },
});

/**
 * @DestructiveTool - Tools for irreversible, destructive operations
 * 
 * Default Configuration:
 * - aiEnabled: true (but requires approval)
 * - toolType: 'ai-dangerous'
 * - dangerLevel: 'destructive'
 * - requiresApproval: true
 * - generateSimulation: true
 * - generateStories: true
 * 
 * @example
 * ```typescript
 * @DestructiveTool({ 
 *   toolId: 'purge-database',
 *   description: 'Delete all data - cannot be undone'
 * })
 * async purgeDatabase() {
 *   return await api.purgeAllData();
 * }
 * ```
 */
export const DestructiveTool = createSpecializedTool({
  aiEnabled: true,
  toolType: 'ai-dangerous',
  dangerLevel: 'destructive',
  requiresApproval: true,
  generateSimulation: true,
  generateStories: true,
  permissions: {
    level: 'approve_once',
    sensitiveDataAccess: true,
    networkAccess: true,
  },
});

// ============================================================================
// Testing Tools
// ============================================================================

/**
 * @TestTool - Tools exclusively for testing (AI cannot use)
 * 
 * Default Configuration:
 * - aiEnabled: false
 * - toolType: 'test-only'
 * - dangerLevel: 'safe'
 * - requiresApproval: false
 * - generateSimulation: true
 * - generateStories: true
 * 
 * @example
 * ```typescript
 * @TestTool({ toolId: 'test-helper' })
 * async seedTestData() {
 *   return await db.seedTestData();
 * }
 * ```
 */
export const TestTool = createSpecializedTool({
  aiEnabled: false,
  toolType: 'test-only',
  dangerLevel: 'safe',
  requiresApproval: false,
  generateSimulation: true,
  generateStories: true,
});

// ============================================================================
// Onboarding & Help Tools
// ============================================================================

/**
 * @OnboardingTool - Tools for user tutorials and feature tours
 * 
 * Default Configuration:
 * - aiEnabled: true
 * - toolType: 'ai-safe'
 * - dangerLevel: 'safe'
 * - requiresApproval: false
 * - generateSimulation: true
 * - generateStories: true (critical for onboarding flows)
 * - category: ToolCategory.ONBOARDING
 * 
 * @example
 * ```typescript
 * @OnboardingTool({ 
 *   toolId: 'show-tooltip',
 *   description: 'Display contextual help tooltip'
 * })
 * async showTooltip(elementId: string, message: string) {
 *   return showTooltip(elementId, message);
 * }
 * ```
 */
export const OnboardingTool = createSpecializedTool({
  aiEnabled: true,
  toolType: 'ai-safe',
  dangerLevel: 'safe',
  requiresApproval: false,
  generateSimulation: true,
  generateStories: true, // Critical for onboarding flows
  category: ToolCategory.ONBOARDING,
});

// ============================================================================
// Data Tools
// ============================================================================

/**
 * @DataReadTool - Safe read-only data access tools
 * 
 * Default Configuration:
 * - aiEnabled: true
 * - toolType: 'ai-safe'
 * - dangerLevel: 'safe'
 * - requiresApproval: false
 * - category: ToolCategory.DATA
 * 
 * @example
 * ```typescript
 * @DataReadTool({ toolId: 'fetch-users' })
 * async fetchUsers(filters: UserFilters) {
 *   return await api.getUsers(filters);
 * }
 * ```
 */
export const DataReadTool = createSpecializedTool({
  aiEnabled: true,
  toolType: 'ai-safe',
  dangerLevel: 'safe',
  requiresApproval: false,
  category: ToolCategory.DATA,
  permissions: {
    level: 'auto_approve',
    sensitiveDataAccess: false,
    networkAccess: true,
  },
});

/**
 * @DataWriteTool - Tools that create/update data (requires approval)
 * 
 * Default Configuration:
 * - aiEnabled: true
 * - toolType: 'ai-restricted'
 * - dangerLevel: 'moderate'
 * - requiresApproval: true
 * - category: ToolCategory.DATA
 * 
 * @example
 * ```typescript
 * @DataWriteTool({ toolId: 'update-profile' })
 * async updateProfile(userId: string, data: ProfileData) {
 *   return await api.updateUser(userId, data);
 * }
 * ```
 */
export const DataWriteTool = createSpecializedTool({
  aiEnabled: true,
  toolType: 'ai-restricted',
  dangerLevel: 'moderate',
  requiresApproval: true,
  category: ToolCategory.DATA,
  permissions: {
    level: 'approve_once',
    sensitiveDataAccess: true,
    networkAccess: true,
  },
});

// ============================================================================
// Navigation Tools
// ============================================================================

/**
 * @NavigationTool - Tools for page/view navigation
 * 
 * Default Configuration:
 * - aiEnabled: true
 * - toolType: 'ai-safe'
 * - dangerLevel: 'safe'
 * - requiresApproval: false
 * - category: ToolCategory.NAVIGATION
 * - executionContext: 'ui'
 * 
 * @example
 * ```typescript
 * @NavigationTool({ toolId: 'goto-settings' })
 * async goToSettings() {
 *   router.push('/settings');
 * }
 * ```
 */
export const NavigationTool = createSpecializedTool({
  aiEnabled: true,
  toolType: 'ai-safe',
  dangerLevel: 'safe',
  requiresApproval: false,
  category: ToolCategory.NAVIGATION,
  executionContext: 'ui',
  callbacks: {
    navigation: true,
  },
});

// ============================================================================
// Combined Tools (Multiple Contexts)
// ============================================================================

/**
 * @AIAndTestTool - Tools for both AI use and testing
 * 
 * Default Configuration:
 * - aiEnabled: true
 * - toolType: 'ai-safe'
 * - dangerLevel: 'safe'
 * - requiresApproval: false
 * - generateSimulation: true
 * - generateStories: true
 * 
 * @example
 * ```typescript
 * @AIAndTestTool({ toolId: 'search' })
 * async search(query: string) {
 *   return await api.search(query);
 * }
 * ```
 */
export const AIAndTestTool = createSpecializedTool({
  aiEnabled: true,
  toolType: 'ai-safe',
  dangerLevel: 'safe',
  requiresApproval: false,
  generateSimulation: true,
  generateStories: true,
});

/**
 * @OnboardingAndTestTool - Tools for onboarding flows and testing
 * 
 * Alias for OnboardingTool (they have the same config)
 */
export const OnboardingAndTestTool = OnboardingTool;

// ============================================================================
// Export all specialized decorators
// ============================================================================

export const SpecializedTools = {
  AITool,
  DangerousTool,
  DestructiveTool,
  TestTool,
  OnboardingTool,
  DataReadTool,
  DataWriteTool,
  NavigationTool,
  AIAndTestTool,
  OnboardingAndTestTool,
} as const;

// ============================================================================
// Type Exports
// ============================================================================

export type SpecializedToolType = keyof typeof SpecializedTools;

