/**
 * Auto-Bridging Utilities
 * 
 * Zero-config bridging from @supernal-interface registries to any ChatUIAdapter.
 * These utilities automatically expose tools and state to the chat UI.
 */

import type { ChatUIAdapter, ReadableState, ToolExecution, ToolExecutionCallback } from './types';
import type { ToolMetadata } from '../decorators/Tool';
import { ToolRegistry } from '../background/registry/ToolRegistry';
// Note: ComponentRegistry integration is planned but not yet implemented
// import { ComponentRegistry } from '../background/registry/ComponentRegistry';

/**
 * Options for bridgeToolRegistry
 */
export interface BridgeToolRegistryOptions {
  /** Filter which tools to bridge (default: aiEnabled tools only) */
  filter?: (tool: ToolMetadata) => boolean;
  /** Whether to watch for new tool registrations */
  watch?: boolean;
  /** Callback when tools are bridged */
  onBridge?: (tools: ToolMetadata[]) => void;
}

/**
 * Bridge ToolRegistry to a ChatUIAdapter
 * 
 * Automatically registers all AI-enabled tools from ToolRegistry
 * with the adapter, converting them to the adapter's native format.
 * 
 * @example
 * ```typescript
 * const adapter = createCopilotKitAdapter();
 * const unsubscribe = bridgeToolRegistry(adapter);
 * 
 * // Later, to stop watching for new tools:
 * unsubscribe();
 * ```
 */
export function bridgeToolRegistry(
  adapter: ChatUIAdapter,
  options: BridgeToolRegistryOptions = {}
): () => void {
  const {
    filter = (tool) => tool.aiEnabled === true,
    watch = true,
    onBridge,
  } = options;

  // Get current tools and register them
  const allTools = Array.from(ToolRegistry.getAllTools().values());
  const filteredTools = allTools.filter(filter);
  
  adapter.registerTools(filteredTools);
  onBridge?.(filteredTools);

  // eslint-disable-next-line no-console
  console.log(`[bridgeToolRegistry] Bridged ${filteredTools.length} tools to ${adapter.name}`);

  // Watch for new registrations if enabled
  if (watch) {
    // Note: ToolRegistry.onRegister would need to be implemented
    // For now, return a no-op unsubscribe
    return () => {
      // eslint-disable-next-line no-console
      console.log(`[bridgeToolRegistry] Unsubscribed from ${adapter.name}`);
    };
  }

  return () => {};
}

/**
 * Options for bridgeComponentState
 */
export interface BridgeComponentStateOptions {
  /** Filter which components to bridge */
  filter?: (component: { id: string; state: unknown }) => boolean;
  /** Whether to watch for state changes */
  watch?: boolean;
  /** Custom description generator */
  descriptionGenerator?: (id: string, state: unknown) => string;
}

/**
 * Bridge ComponentRegistry state to a ChatUIAdapter as readables
 * 
 * Automatically exposes component state so the AI can "see" 
 * the current state of the application.
 * 
 * @example
 * ```typescript
 * const adapter = createCopilotKitAdapter();
 * bridgeComponentState(adapter);
 * 
 * // AI can now see: "Counter is currently at 5"
 * ```
 */
export function bridgeComponentState(
  adapter: ChatUIAdapter,
  options: BridgeComponentStateOptions = {}
): () => void {
  const {
    filter: _filter = () => true,
    descriptionGenerator: _descriptionGenerator = defaultDescriptionGenerator,
  } = options;

  const readables: ReadableState[] = [];

  // Try to get components from ComponentRegistry
  // Note: ComponentRegistry may not have getAllComponents - check if it exists
  try {
    // Get registered component IDs from metadata
    // ComponentRegistry stores metadata internally, we can access via getState
    // For now, we'll register readables that are explicitly provided
    // This is a placeholder until ComponentRegistry exposes getAllComponents
    
    // eslint-disable-next-line no-console
    console.log(`[bridgeComponentState] ComponentRegistry state bridging not yet implemented`);
    // eslint-disable-next-line no-console
    console.log(`[bridgeComponentState] Use registerReadables directly on the adapter for now`);
    
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(`[bridgeComponentState] Could not bridge component state:`, error);
  }

  adapter.registerReadables(readables);

  // eslint-disable-next-line no-console
  console.log(`[bridgeComponentState] Bridged ${readables.length} component states to ${adapter.name}`);

  return () => {
    // Cleanup subscriptions if needed
  };
}

/**
 * Manually register a readable state
 * 
 * Use this when you want to expose specific state to the AI.
 * 
 * @example
 * ```typescript
 * const adapter = createCopilotKitAdapter();
 * 
 * // Register a counter's state
 * registerReadable(adapter, {
 *   id: 'counter',
 *   description: 'Current counter value',
 *   getValue: () => counterState.value,
 * });
 * ```
 */
export function registerReadable(
  adapter: ChatUIAdapter,
  readable: ReadableState
): void {
  adapter.registerReadables([readable]);
}

/**
 * Default description generator for component state
 */
function defaultDescriptionGenerator(id: string, state: unknown): string {
  const componentName = id.split('.').pop() || id;
  
  if (state === null || state === undefined) {
    return `${componentName} has no state`;
  }

  if (typeof state === 'object') {
    const keys = Object.keys(state as object);
    if (keys.length === 0) {
      return `${componentName} is empty`;
    }
    if (keys.length === 1) {
      const key = keys[0];
      const value = (state as Record<string, unknown>)[key];
      return `${componentName} ${key} is ${formatValue(value)}`;
    }
    return `${componentName} state: ${JSON.stringify(state)}`;
  }

  return `${componentName} is ${formatValue(state)}`;
}

/**
 * Format a value for display
 */
function formatValue(value: unknown): string {
  if (typeof value === 'boolean') {
    return value ? 'enabled' : 'disabled';
  }
  if (typeof value === 'number') {
    return String(value);
  }
  if (typeof value === 'string') {
    return `"${value}"`;
  }
  return JSON.stringify(value);
}

/**
 * Options for createAuditTrail
 */
export interface AuditTrailOptions {
  /** Maximum number of executions to keep */
  maxExecutions?: number;
  /** Whether to log to console */
  logToConsole?: boolean;
  /** Custom logger */
  logger?: (execution: ToolExecution) => void;
  /** Filter which executions to track */
  filter?: (execution: ToolExecution) => boolean;
}

/**
 * Create an audit trail for tool executions
 * 
 * Tracks all tool executions through the adapter for compliance,
 * debugging, and analytics purposes.
 * 
 * @example
 * ```typescript
 * const adapter = createCopilotKitAdapter();
 * const { getExecutions, clear, unsubscribe } = createAuditTrail(adapter);
 * 
 * // Later:
 * const history = getExecutions();
 * console.log(`${history.length} tools executed`);
 * ```
 */
export function createAuditTrail(
  adapter: ChatUIAdapter,
  options: AuditTrailOptions = {}
): {
  getExecutions: () => ToolExecution[];
  getLastExecution: () => ToolExecution | undefined;
  clear: () => void;
  unsubscribe: () => void;
} {
  const {
    maxExecutions = 100,
    logToConsole = false,
    logger,
    filter = () => true,
  } = options;

  const executions: ToolExecution[] = [];

  const callback: ToolExecutionCallback = (execution) => {
    if (!filter(execution)) return;

    executions.push(execution);

    // Trim if over max
    while (executions.length > maxExecutions) {
      executions.shift();
    }

    // Log if enabled
    if (logToConsole) {
      const status = execution.success ? '✅' : '❌';
      // eslint-disable-next-line no-console
      console.log(
        `[AuditTrail] ${status} ${execution.toolName} (${execution.duration}ms)`,
        execution.args
      );
    }

    // Custom logger
    logger?.(execution);
  };

  const unsubscribe = adapter.onToolExecution(callback);

  return {
    getExecutions: () => [...executions],
    getLastExecution: () => executions[executions.length - 1],
    clear: () => {
      executions.length = 0;
    },
    unsubscribe,
  };
}

/**
 * Combined bridge setup for convenience
 * 
 * Sets up tool bridging, state bridging, and audit trail in one call.
 * 
 * @example
 * ```typescript
 * const adapter = createCopilotKitAdapter();
 * const { audit, cleanup } = setupBridge(adapter);
 * 
 * // Use the app...
 * 
 * // Check audit trail
 * console.log(audit.getExecutions());
 * 
 * // Cleanup when done
 * cleanup();
 * ```
 */
export function setupBridge(
  adapter: ChatUIAdapter,
  options: {
    tools?: BridgeToolRegistryOptions;
    state?: BridgeComponentStateOptions;
    audit?: AuditTrailOptions;
  } = {}
): {
  audit: ReturnType<typeof createAuditTrail>;
  cleanup: () => void;
} {
  const toolCleanup = bridgeToolRegistry(adapter, options.tools);
  const stateCleanup = bridgeComponentState(adapter, options.state);
  const audit = createAuditTrail(adapter, options.audit);

  return {
    audit,
    cleanup: () => {
      toolCleanup();
      stateCleanup();
      audit.unsubscribe();
    },
  };
}

