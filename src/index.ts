/**
 * @supernal/interface - Open Source Edition
 * 
 * Universal AI Interface - Make any application AI-controllable with decorators.
 * Core framework, basic features, and adapter system.
 * 
 * Enterprise features (test generation, architecture visualization, story system)
 * available at https://supernal.ai/enterprise
 */

// Core decorators and registry
export { Tool, ToolConfig, ToolMetadata } from './decorators/Tool';
export { getStandaloneTools, getStandaloneTool } from './decorators/Tool';
export {
  ToolProvider,
  ToolProviderConfig,
  getToolProviderConfig,
  isToolProvider,
  CONTAINER_SCOPE_GLOBAL,
} from './decorators/ToolProvider';

// Container scope constants
export { ContainerScope, ContainerScopeType } from './decorators';
export { 
  ClickTool, 
  ChangeTool, 
  TypeTool, 
  HoverTool, 
  MultiActionTool, 
  FormTool 
} from './decorators/ToolHelpers';

// Specialized decorators and presets
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
} from './decorators/ToolPreset';

// Registries
export { ToolRegistry } from './background/registry/ToolRegistry';
export { ComponentRegistry, ComponentMetadata } from './background/registry/ComponentRegistry';

// Component decorators
export { Component, ComponentConfig } from './decorators/Component';

// Stateful components
export { StatefulComponent, isStatefulComponent } from './interfaces/StatefulComponent';

// Storage (basic adapters only - browser/memory)
export * from './storage';

// System tools
export { SystemTools } from './tools/SystemTools';

// Testing utilities (basic - no generation)
export * from './testing';

// Data management
export * from './data';

// Name contracts (hierarchical IDs)
export * as Names from '../names';

// Name contract scanning
export {
  ContractScanner,
  // RouteContractScanner - server-only (uses ts-node/register)
  type ScanResult,
  type ContractEntry,
} from './name-contracts';

// Route scanning
export {
  RouteScanner,
  NextjsDynamicScanner,
  NameExtractor,
  RouteContractGenerator,
  RouteContractsConfig,
  type RouteInfo,
  type RouteScanResult,
} from './routes';

// Component scanning (server-only - not exported in browser bundle)
// ComponentScanner uses Node.js modules (fs, glob) and should only be used server-side
// To use ComponentScanner, import directly: import { ComponentScanner } from '@supernal/interface/src/components/ComponentScanner'
// Or use the enterprise package which provides server-side utilities

// Execution engines
export { DOMExecutor } from './execution/DOMExecutor';

// React hooks
export { useToolBinding } from './react';

// Types
export * from './types';
export type { ComponentStorage, ToolOptions } from './types/Tool';

// AI (basic matching and execution)
export * from './ai';

// Exposure API
export { ExposureCollector } from './exposure/ExposureCollector';

// Architecture initialization (basic)
export {
  initializeArchitecture,
  createAutoInitializer,
  ContainerRegistry,
} from './background/architecture';
export { architectureRegistry, inferNavToContainerMap } from './architecture/registry';
export { createContainer, createContainers } from './architecture/createContainer';
export type { ContainerConfig } from './architecture/createContainer';
export type { ArchitectureOptions, InitializedArchitecture } from './architecture/initialize';
export type { ContainerDefinition } from './background/architecture/Containers';

// Names
export { createNames, getComponentIds, isComponentId } from './names/createNames';
export type { ComponentId } from './names/createNames';

// Chat UI Components
export { ChatBubble } from './ui/react/chat/ChatBubble';
export { ChatInputProvider, useChatInput } from './contexts/ChatInputContext';

// Chat UI Adapters (ALL OPEN - Key value proposition!)
export {
  // Types
  ChatUIAdapter,
  ChatUIProps,
  ReadableState,
  ToolExecutionCallback,
  AdapterFactory,
  ChatUIProviderConfig,
  // Provider
  ChatUIProvider,
  ChatUI,
  useChatUI,
  useChatUIOptional,
  withChatUI,
  // Adapters
  // NOTE: CopilotKitAdapter is exported separately via @supernal/interface/adapters/copilotkit
  NativeAdapter,
  createNativeAdapter,
  // Bridge utilities
  bridgeToolRegistry,
  bridgeComponentState,
  registerReadable,
  createAuditTrail,
  setupBridge,
} from './adapters';
export type { 
  CopilotKitAdapterConfig, 
  NativeAdapterConfig,
  BridgeToolRegistryOptions,
  BridgeComponentStateOptions,
  AuditTrailOptions,
  ToolExecution as ChatToolExecution,
} from './adapters';

// Re-export commonly used types
export type {
  UniversalExecutionContext,
  UniversalToolResult
} from './background/registry/ToolRegistry';

// MCP (Model Context Protocol) - NEW in v1.1.0
// IMPORTANT: MCP is server-side only (Node.js)
// Import from '@supernal/interface/mcp-server' in Node.js
// DO NOT import MCP in browser bundles (uses readline, process.stdin)
// Types only for browser usage:
export type {
  MCPServer,
  MCPServerConfig,
  MCPTransport,
  MCPRequest,
  MCPResponse,
  MCPTool,
  MCPToolsListResponse,
  MCPToolCallRequest,
  MCPToolCallResponse
} from './mcp';

// State Management - NEW in v1.1.0
export {
  syncStateToDom,
  triggerStateChange,
  getStateFromDom,
  waitForState,
  onStateChange,
  type StateChangeEventDetail
} from './state/StateSync';

// Enterprise feature stubs (warn users, drive upgrade)
export { NavigationGraph } from './background/navigation/NavigationGraph';
export type { INavigationGraph } from './background/navigation/INavigationGraph';
export { RuntimeTreeBuilder } from './background/navigation/RuntimeTreeBuilder';
export { TreeBuilder } from './background/navigation/RuntimeTreeBuilder';
export { LocationContext } from './background/location/LocationContext';

// Version info
export const VERSION = '1.1.0'; // Updated for MCP + State Management
export const PACKAGE_NAME = '@supernal/interface';

// Enterprise features not included in open source
// Available at https://supernal.ai/enterprise:
// - Test Generation (TestGenerator, ComponentTestGenerator, DocumentationGenerator)
// - Story System (StoryBuilder, StoryExecutor, StoryRegistry)
// - Architecture Visualization (ArchitectureGraph, RuntimeGraphTracker)
// - Advanced AI (LLMProvider, ParameterExtractor, SuggestionEngine)
// - File Storage Adapter (Node.js)
// - Navigation Graph (runtime tracking)
