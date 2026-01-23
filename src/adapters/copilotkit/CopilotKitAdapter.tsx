/**
 * CopilotKit Adapter
 * 
 * Implements ChatUIAdapter for CopilotKit integration.
 * Provides wrapper components around CopilotKit with our API.
 * 
 * Strategy: Hybrid approach
 * - Bridge: Our ToolRegistry → useCopilotAction (for tool execution)
 * - Wrapper: Our components → CopilotKit components (for consistent API)
 */

import React, { useEffect, useRef } from 'react';
import type { 
  ChatUIAdapter, 
  ChatUIProps, 
  ReadableState, 
  ToolExecution, 
  ToolExecutionCallback 
} from '../types';
import type { ToolMetadata } from '../../decorators/Tool';

// CopilotKit imports - these are peer dependencies
// Users must install @copilotkit/react-core and @copilotkit/react-ui
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let CopilotPopup: React.ComponentType<any> | null = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let useCopilotAction: ((config: any) => void) | null = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let useCopilotReadable: ((config: any) => void) | null = null;

// Dynamic import to avoid hard dependency
async function loadCopilotKit() {
  try {
    // Dynamic imports - these will fail if packages not installed
    const reactCore = await import(/* webpackIgnore: true */ '@copilotkit/react-core');
    const reactUI = await import(/* webpackIgnore: true */ '@copilotkit/react-ui');

    useCopilotAction = reactCore.useCopilotAction;
    useCopilotReadable = reactCore.useCopilotReadable;
    // CopilotPopup not available in @copilotkit/react-ui@0.2.0
    // @ts-ignore - Property may not exist in all versions
    CopilotPopup = reactUI.CopilotPopup || reactUI.default?.CopilotPopup;
    
    return true;
  } catch {
    // eslint-disable-next-line no-console
    console.warn('[CopilotKitAdapter] CopilotKit packages not installed. Install @copilotkit/react-core and @copilotkit/react-ui');
    return false;
  }
}

/**
 * Configuration for CopilotKit adapter
 */
export interface CopilotKitAdapterConfig {
  /** Runtime URL for CopilotKit backend */
  runtimeUrl?: string;
  /** Default system prompt */
  systemPrompt?: string;
  /** Whether to auto-import CopilotKit CSS */
  importStyles?: boolean;
}

/**
 * Default system prompt for Supernal-enabled apps
 */
const DEFAULT_SYSTEM_PROMPT = `You are an AI assistant that can control this application using tools.

Available capabilities:
- Navigate between pages and sections
- Interact with UI components (buttons, inputs, forms)
- Read and modify application state
- Execute registered tool actions

Guidelines:
- When users ask you to do something, use the appropriate tool
- Always confirm what action you took
- If a tool fails, explain what went wrong
- Be helpful and concise

This application uses @supernal-interface for AI-controllable UI.`;

/**
 * CopilotKit Adapter Implementation
 */
export class CopilotKitAdapter implements ChatUIAdapter {
  readonly name = 'copilotkit';
  
  private tools: ToolMetadata[] = [];
  private readables: ReadableState[] = [];
  private executionCallbacks: ToolExecutionCallback[] = [];
  private config: CopilotKitAdapterConfig;
  private initialized = false;
  
  constructor(config: CopilotKitAdapterConfig = {}) {
    this.config = {
      runtimeUrl: '/api/copilotkit',
      systemPrompt: DEFAULT_SYSTEM_PROMPT,
      importStyles: true,
      ...config,
    };
  }
  
  async initialize(): Promise<void> {
    if (this.initialized) return;
    
    const loaded = await loadCopilotKit();
    if (!loaded) {
      throw new Error('CopilotKit packages not available');
    }
    
    // Import styles if requested
    if (this.config.importStyles) {
      try {
        // @ts-expect-error - Peer dependency not installed by default
        await import(/* webpackIgnore: true */ '@copilotkit/react-ui/styles.css');
      } catch {
        // Styles may already be imported or not available
      }
    }
    
    this.initialized = true;
  }
  
  registerTools(tools: ToolMetadata[]): void {
    this.tools = tools;
  }
  
  registerReadables(readables: ReadableState[]): void {
    this.readables = readables;
  }
  
  onToolExecution(callback: ToolExecutionCallback): () => void {
    this.executionCallbacks.push(callback);
    return () => {
      this.executionCallbacks = this.executionCallbacks.filter(cb => cb !== callback);
    };
  }
  
  private notifyExecution(execution: ToolExecution): void {
    this.executionCallbacks.forEach(cb => {
      try {
        cb(execution);
      } catch {
        // Ignore callback errors
      }
    });
  }
  
  isReady(): boolean {
    return this.initialized && CopilotPopup !== null;
  }
  
  dispose(): void {
    this.executionCallbacks = [];
    this.tools = [];
    this.readables = [];
  }
  
  render(props: ChatUIProps): React.ReactNode {
    if (!this.isReady()) {
      return null;
    }
    
    return (
      <CopilotKitChatWrapper
        adapter={this}
        tools={this.tools}
        readables={this.readables}
        config={this.config}
        {...props}
      />
    );
  }
}

/**
 * Internal wrapper component that handles hooks
 */
interface CopilotKitChatWrapperProps extends ChatUIProps {
  adapter: CopilotKitAdapter;
  tools: ToolMetadata[];
  readables: ReadableState[];
  config: CopilotKitAdapterConfig;
}

function CopilotKitChatWrapper({
  adapter,
  tools,
  readables,
  config,
  title = 'AI Assistant',
  placeholder: _placeholder,
  initialMessage = 'How can I help you today?',
  systemPrompt,
  defaultOpen = false,
  ...props
}: CopilotKitChatWrapperProps) {
  // Suppress unused variable warning
  void _placeholder;
  const registeredRef = useRef(false);
  
  // Register tools as CopilotKit actions
  useEffect(() => {
    if (registeredRef.current || !useCopilotAction) return;
    registeredRef.current = true;
    
    // eslint-disable-next-line no-console
    console.log(`[CopilotKitAdapter] Registering ${tools.length} tools`);
  }, [tools.length]);
  
  // Register tools - must be called conditionally to avoid dynamic hook calls
  useEffect(() => {
    if (!useCopilotAction) return;
    // Tools will be registered through the useCopilotAction hook below
    // This effect ensures we only register when the hook is available
  }, [tools]);
  
  // Register each tool using useCopilotAction hook
  // Note: This must be called unconditionally, at the same position in each render
  tools.forEach((tool) => {
    if (!useCopilotAction) return;
    
    useCopilotAction({
      name: tool.name || `${tool.componentName}.${tool.methodName}`,
      description: tool.aiDescription || tool.description || `Execute ${tool.methodName}`,
      parameters: convertInputSchema(tool.inputSchema),
      handler: async (args: Record<string, unknown>) => {
        const start = Date.now();
        
        try {
          // Execute through tool's method if available
          let result: unknown;
          if (tool.method) {
            result = await tool.method(...Object.values(args));
          } else if (tool.instance && tool.methodName) {
            result = await tool.instance[tool.methodName](...Object.values(args));
          } else {
            throw new Error(`Tool ${tool.name} has no executable method`);
          }
          
          const execution: ToolExecution = {
            toolId: tool.toolId,
            toolName: tool.name || tool.methodName || 'unknown',
            args: args as Record<string, unknown>,
            result,
            success: true,
            timestamp: new Date(),
            duration: Date.now() - start,
            containerId: tool.containerId,
            dangerLevel: tool.dangerLevel,
            approvalRequired: tool.requiresApproval,
          };
          
          (adapter as any).notifyExecution(execution);
          
          // Return message for chat display
          if (typeof result === 'object' && result !== null && 'message' in result) {
            return (result as { message: string }).message;
          }
          return `Executed ${tool.name}`;
        } catch (error) {
          const execution: ToolExecution = {
            toolId: tool.toolId,
            toolName: tool.name || tool.methodName || 'unknown',
            args: args as Record<string, unknown>,
            result: null,
            success: false,
            error: error instanceof Error ? error : new Error(String(error)),
            timestamp: new Date(),
            duration: Date.now() - start,
            containerId: tool.containerId,
            dangerLevel: tool.dangerLevel,
            approvalRequired: tool.requiresApproval,
          };
          
          (adapter as any).notifyExecution(execution);
          throw error;
        }
      },
    });
  });
  
  // Register readables
  readables.forEach((readable) => {
    if (!useCopilotReadable) return;
    
    useCopilotReadable({
      description: readable.description,
      value: readable.getValue(),
    });
  });
  
  if (!CopilotPopup) {
    return null;
  }
  
  return (
    <CopilotPopup
      instructions={systemPrompt || config.systemPrompt}
      labels={{
        title,
        initial: initialMessage,
      }}
      defaultOpen={defaultOpen}
      {...props}
    />
  );
}

/**
 * Convert our inputSchema to CopilotKit parameter format
 */
function convertInputSchema(schema: Record<string, unknown> | undefined): unknown[] {
  if (!schema || Object.keys(schema).length === 0) {
    return [];
  }
  
  return Object.entries(schema).map(([name, def]) => {
    const typeDef = def as Record<string, unknown>;
    return {
      name,
      type: (typeDef.type as string) || 'string',
      description: (typeDef.description as string) || name,
      required: (typeDef.required as boolean) ?? false,
    };
  });
}

/**
 * Factory function for creating CopilotKit adapter
 */
export function createCopilotKitAdapter(config?: CopilotKitAdapterConfig): CopilotKitAdapter {
  return new CopilotKitAdapter(config);
}

