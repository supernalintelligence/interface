/**
 * Chat UI Adapter Types
 * 
 * Defines the interface for swappable chat UI providers.
 * Adapters bridge between UI libraries and our ToolRegistry.
 */

import type { ToolMetadata } from '../../decorators/Tool';

/**
 * Readable state that can be exposed to AI
 */
export interface ReadableState {
  /** Unique identifier */
  id: string;
  /** Human-readable description for AI context */
  description: string;
  /** Function to get current value */
  getValue: () => unknown;
  /** Optional: Subscribe to value changes */
  subscribe?: (callback: (value: unknown) => void) => () => void;
}

/**
 * Tool execution event for audit trails
 */
export interface ToolExecution {
  /** Tool identifier */
  toolId: string;
  /** Tool display name */
  toolName: string;
  /** Arguments passed to tool */
  args: Record<string, unknown>;
  /** Execution result */
  result: unknown;
  /** Whether execution succeeded */
  success: boolean;
  /** Error if failed */
  error?: Error;
  /** When execution occurred */
  timestamp: Date;
  /** How long execution took (ms) */
  duration: number;
  /** Tool's danger classification */
  dangerLevel?: 'safe' | 'moderate' | 'dangerous' | 'destructive';
  /** Whether approval was required */
  approvalRequired?: boolean;
}

/**
 * Callback for tool execution events
 */
export type ToolExecutionCallback = (execution: ToolExecution) => void;

/**
 * Chat UI rendering props
 */
export interface ChatUIProps {
  /** Position of chat widget */
  position?: 'bottom-right' | 'bottom-left' | 'sidebar' | 'inline';
  /** Color theme */
  theme?: 'light' | 'dark' | 'system';
  /** Chat window title */
  title?: string;
  /** Input placeholder text */
  placeholder?: string;
  /** Initial message from AI */
  initialMessage?: string;
  /** System prompt for AI */
  systemPrompt?: string;
  /** Whether chat starts open */
  defaultOpen?: boolean;
  /** Callback when user sends message */
  onMessage?: (message: string) => void;
  /** Additional className */
  className?: string;
}

/**
 * Chat UI Adapter Interface
 * 
 * Implement this to add support for any chat UI library.
 * The adapter bridges between the UI and our ToolRegistry.
 * 
 * @example
 * ```typescript
 * class CopilotKitAdapter implements ChatUIAdapter {
 *   name = 'copilotkit';
 *   
 *   registerTools(tools) {
 *     // Convert to useCopilotAction calls
 *   }
 *   
 *   render(props) {
 *     return <CopilotPopup {...props} />;
 *   }
 * }
 * ```
 */
export interface ChatUIAdapter {
  /** Adapter name for identification */
  readonly name: string;
  
  /** 
   * Register tools from ToolRegistry
   * Adapter converts to its native format (e.g., useCopilotAction)
   * Called once on initialization
   */
  registerTools(tools: ToolMetadata[]): void;
  
  /**
   * Register readable state from ComponentRegistry
   * Adapter converts to its native format (e.g., useCopilotReadable)
   * Called once on initialization, updates via subscription
   */
  registerReadables(readables: ReadableState[]): void;
  
  /**
   * Subscribe to tool execution events
   * Critical for audit trails, analytics, compliance
   * Returns unsubscribe function
   */
  onToolExecution(callback: ToolExecutionCallback): () => void;
  
  /**
   * Render the chat UI component
   * This is the main entry point for displaying the chat
   */
  render(props: ChatUIProps): React.ReactNode;
  
  /**
   * Optional: Initialize adapter (e.g., connect to runtime)
   * Called before first render
   */
  initialize?(): Promise<void>;
  
  /**
   * Optional: Cleanup on unmount
   * Called when adapter is disposed
   */
  dispose?(): void;
  
  /**
   * Optional: Check if adapter is ready
   * Returns false if dependencies not met (e.g., missing API key)
   */
  isReady?(): boolean;
}

/**
 * Adapter factory function type
 */
export type AdapterFactory<TConfig = unknown> = (config?: TConfig) => ChatUIAdapter;

/**
 * Configuration for ChatUIProvider
 */
export interface ChatUIProviderConfig {
  /** The adapter to use */
  adapter: ChatUIAdapter;
  /** Whether to auto-register tools from ToolRegistry */
  autoRegisterTools?: boolean;
  /** Whether to auto-register component state as readables */
  autoRegisterReadables?: boolean;
  /** Filter function for which tools to register */
  toolFilter?: (tool: ToolMetadata) => boolean;
}

