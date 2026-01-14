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

// Container HOC
export { useContainer } from './decorators/ContainerHelpers';

// Architecture (generic types and utilities)
export {
  getContainer,
  getAllContainers,
  isComponentInContainer,
  findComponentContainers,
  type ContainerDefinition,
  type ContainerId
} from './background/architecture';

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

// Types (browser-safe)
export * from './types';

// Execution (browser-safe)
export { DOMExecutor } from './execution/DOMExecutor';

// React hooks (browser-only)
// Note: usePersistedState excluded due to fs/promises dependency in StorageAdapter
// export { usePersistedState } from './react/usePersistedState';
export { useToolBinding } from './react';

// Note: CLI tools, generators, and Node.js-specific functionality
// are excluded from browser builds
