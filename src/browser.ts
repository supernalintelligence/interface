/**
 * Browser-only exports for @supernal-interface/core
 *
 * This excludes CLI tools and Node.js-specific functionality
 * that can't be bundled for the browser.
 */

// Core decorators and registry
export { Tool, ToolConfig, ToolMetadata, setDefaultToolReporter } from './decorators/Tool';
export { ToolProvider, ToolProviderConfig } from './decorators/ToolProvider';
export {
  ClickTool,
  ChangeTool,
  TypeTool,
  HoverTool,
  MultiActionTool,
  FormTool,
  setGlobalToolReporter,
  type ToolExecutionReporter
} from './decorators/ToolHelpers';
export { ToolRegistry } from './background/registry/ToolRegistry';

// Component decorator
export { Component, ComponentConfig } from './decorators/Component';

// Specialized decorators
export {
  AITool,
  TestTool,
  OnboardingTool,
  DangerousTool,
  DestructiveTool,
  DataReadTool,
  DataWriteTool,
  NavigationTool,
  AIAndTestTool,
  OnboardingAndTestTool,
} from './decorators/SpecializedTools';

// Tool presets
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
} from './decorators/ToolPreset';

// Tool categories
export { ToolCategory } from './types/Tool';

// Container HOC
export { useContainer } from './decorators/ContainerHelpers';

// Architecture (generic types and utilities)
export {
  getContainer,
  getAllContainers,
  isComponentInContainer,
  findComponentContainers,
  ContainerRegistry,
  type ContainerDefinition,
  type ContainerId
} from './background/architecture';

// Container creation (browser-safe)
export { createContainer, createContainers } from './architecture/createContainer';
export type { ContainerConfig } from './architecture/createContainer';

// Exposure tracking
export { ExposureCollector } from './exposure/ExposureCollector';
export { NavigationGraph } from './background/navigation/NavigationGraph';
export { TreeBuilder } from './background/navigation/RuntimeTreeBuilder';
export type { RuntimeTreeBuilder } from './background/navigation/RuntimeTreeBuilder';
export { useComponentTracking } from './background/navigation/useComponentTracking';
export type {
  ContentResolver,
  ContentDisplayInfo,
  ContentNavigationResult,
  NavigationContextMetadata,
} from './background/navigation/ContentResolver';

// Location context (needed by NavigationGraph)
export { LocationContext } from './background/location/LocationContext';
export type { AppLocation, LocationScope as LocationScopeType } from './background/location/LocationContext';

// Location scope decorator
export { LocationScope, getLocationScope, hasLocationScope } from './decorators/LocationScope';

// Types (browser-safe)
export * from './types';

// Component Names (browser-safe)
export { createNames, getComponentIds, isComponentId } from './names/createNames';
export type { ComponentId } from './names/createNames';

// Execution (browser-safe)
export { DOMExecutor } from './execution/DOMExecutor';

// React hooks (browser-only)
// Note: usePersistedState excluded due to fs/promises dependency in StorageAdapter
// export { usePersistedState } from './react/usePersistedState';
export { useToolBinding } from './react';

// AI (browser-safe)
export { AIInterface, type AICommand, type AIResponse } from './ai/AIInterface';
export { ToolMatcher, type MatchContext } from './ai/ToolMatcher';
export { ParameterExtractor } from './ai/ParameterExtractor';
export { ToolExecutor } from './ai/ToolExecutor';
export { SuggestionEngine } from './ai/SuggestionEngine';

// Note: CLI tools, generators, and Node.js-specific functionality
// are excluded from browser builds
