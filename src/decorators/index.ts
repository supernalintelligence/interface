/**
 * Supernal Intelligence Interface - Decorator System Exports
 *
 * Enhanced decorators for automatic AI tool generation with safety controls.
 */

// Zero-config element-based inference
/**
 * Tool Availability - Automatic element-based inference
 *
 * Tools are automatically available when their elements are visible on screen.
 * No manual configuration needed!
 *
 * @example
 * ```typescript
 * @Tool({ elementId: 'my-button' })  // Available when button is visible
 * async onClick() { }
 * ```
 */

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
  componentPreset,
  pathPreset,
} from './ToolPreset';

// Runtime callback types
export type { ToolOptions } from '../types/Tool';
