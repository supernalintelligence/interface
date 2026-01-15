/**
 * Supernal Intelligence Interface - Decorator System Exports
 *
 * Enhanced decorators for automatic AI tool generation with safety controls.
 */

// Container scope constants
/**
 * ContainerScope - Named constants for tool container scoping
 *
 * Usage:
 * - ContainerScope.GLOBAL: Tool available on all pages (default)
 * - Route path (e.g., '/examples'): Tool scoped to that route and sub-routes
 *
 * @example
 * ```typescript
 * @ToolProvider({ containerId: ContainerScope.GLOBAL })  // Available everywhere
 * @ToolProvider({ containerId: '/examples' })            // Only on /examples pages
 * ```
 */
export const ContainerScope = {
  /** Tool available on all pages - the default if no containerId specified */
  GLOBAL: 'global',
} as const;

export type ContainerScopeType = typeof ContainerScope[keyof typeof ContainerScope] | string;

// Base decorators
export { Tool, ToolConfig, ToolMetadata } from './Tool';
export {
  ToolProvider,
  ToolProviderConfig,
  getToolProviderConfig,
  isToolProvider,
} from './ToolProvider';
export {
  Component,
  ComponentConfig,
  getComponentConfig,
  isComponent,
} from './Component';

// Specialized decorators (simplified API)
export {
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
  SpecializedTools,
} from './SpecializedTools';
export type { SpecializedToolType } from './SpecializedTools';

// Preset system for DRY configuration
export {
  ToolPreset,
  getToolPreset,
  applyPreset,
  registerPendingPreset,
  clearToolPresets,
  PresetTemplates,
  createPreset,
  containerPreset,
  pathPreset,
} from './ToolPreset';

// Runtime callback types
export type { ToolOptions } from '../types/Tool';
