/**
 * Supernal MCP Server
 * 
 * MCP (Model Context Protocol) server that exposes Supernal Interface tools
 * to external AI agents like Claude Desktop, Cursor, and custom MCP clients.
 * 
 * Usage:
 * ```typescript
 * import { createSupernalMCPServer } from '@supernal/interface';
 * 
 * const server = createSupernalMCPServer({
 *   name: 'my-app-tools',
 *   version: '1.0.0'
 * });
 * 
 * await server.start();
 * ```
 */

import { ToolRegistry } from '../background/registry/ToolRegistry';
import { ToolExecutor } from '../ai/ToolExecutor';
import { NavigationGraph } from '../background/navigation/NavigationGraph';
import type { ToolMetadata } from '../decorators/Tool';
import type {
  MCPServer,
  MCPServerConfig,
  MCPRequest,
  MCPResponse,
  MCPTool,
  MCPToolsListResponse,
  MCPToolCallRequest,
  MCPToolCallResponse,
  MCPError,
  MCPTransport
} from './types';
import { MCPErrorCode } from './types';

/**
 * Default server configuration
 */
const DEFAULT_CONFIG: Partial<MCPServerConfig> = {
  name: 'supernal-interface',
  version: '1.0.0',
  description: 'MCP server for Supernal Interface tools',
  capabilities: {
    tools: {},
    resources: {},
    prompts: {}
  }
};

/**
 * Supernal MCP Server implementation
 */
export class SupernalMCPServer implements MCPServer {
  public config: MCPServerConfig;
  private executor: ToolExecutor;
  private transport?: MCPTransport;
  private running: boolean = false;

  constructor(config: Partial<MCPServerConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config } as MCPServerConfig;
    this.executor = new ToolExecutor();
  }

  /**
   * Start the MCP server with given transport
   */
  async start(transport: MCPTransport): Promise<void> {
    if (this.running) {
      throw new Error('Server is already running');
    }

    this.transport = transport;
    this.running = true;

    console.error(`[MCP Server] Starting: ${this.config.name} v${this.config.version}`);

    // Message processing loop
    while (this.running) {
      try {
        const request = await this.transport.receive();
        const response = await this.handle(request);
        
        // Only send response if not null (notifications return null)
        if (response !== null) {
          await this.transport.send(response);
        }
      } catch (error) {
        if (!this.running) break; // Transport closed
        
        console.error('[MCP Server] Error processing message:', error);
        
        // Send error response
        if (this.transport) {
          await this.transport.send({
            jsonrpc: '2.0',
            error: {
              code: MCPErrorCode.INTERNAL_ERROR,
              message: error instanceof Error ? error.message : 'Internal server error',
              data: error
            }
          });
        }
      }
    }
  }

  /**
   * Stop the MCP server
   */
  async stop(): Promise<void> {
    this.running = false;
    
    if (this.transport) {
      await this.transport.close();
      this.transport = undefined;
    }

    console.error('[MCP Server] Stopped');
  }

  /**
   * Handle incoming MCP request
   */
  async handle(request: MCPRequest): Promise<MCPResponse | null> {
    const { method, params, id } = request;

    try {
      // Handle notifications (no response needed)
      if (method.startsWith('notifications/')) {
        console.error(`[MCP Server] Received notification: ${method}`);
        return null; // No response for notifications
      }

      switch (method) {
        case 'tools/list':
          return this.handleToolsList(id);
          
        case 'tools/call':
          return await this.handleToolCall(id, params as MCPToolCallRequest);
          
        case 'initialize':
          return this.handleInitialize(id);
          
        default:
          return this.errorResponse(id, MCPErrorCode.METHOD_NOT_FOUND, `Method not found: ${method}`);
      }
    } catch (error) {
      return this.errorResponse(
        id,
        MCPErrorCode.INTERNAL_ERROR,
        error instanceof Error ? error.message : 'Internal error',
        error
      );
    }
  }

  /**
   * Handle tools/list request
   * 
   * Returns context-filtered tools based on NavigationGraph.getCurrentContext()
   * - If context is 'global': show all tools
   * - If context is specific (e.g., 'blog'): show tools for that context + global tools
   */
  private handleToolsList(id?: string | number): MCPResponse {
    const nav = NavigationGraph.getInstance();
    const currentContext = nav.getCurrentContext();
    
    const toolsByContainer = ToolRegistry.getToolsGroupedByContainer();
    const mcpTools: MCPTool[] = [];

    for (const [container, containerTools] of Object.entries(toolsByContainer)) {
      for (const tool of containerTools) {
        // Check if tool should be visible in current context
        const toolContext = nav.getToolContext(tool.name);
        
        // Include tool if:
        // 1. Current context is 'global' (show all), OR
        // 2. Tool has no context (it's global), OR
        // 3. Tool's context matches current context
        const isVisible = 
          currentContext === 'global' ||
          toolContext === null ||
          toolContext === currentContext;
        
        if (isVisible) {
          mcpTools.push(this.convertToMCPTool(container, tool));
        }
      }
    }

    const response: MCPToolsListResponse = {
      tools: mcpTools
    };

    return {
      jsonrpc: '2.0',
      id,
      result: response
    };
  }

  /**
   * Handle tools/call request
   */
  private async handleToolCall(id: string | number | undefined, params: MCPToolCallRequest): Promise<MCPResponse> {
    const { name, arguments: args } = params;

    if (!name) {
      return this.errorResponse(id, MCPErrorCode.INVALID_PARAMS, 'Missing tool name');
    }

    // Parse tool name (format: container.toolName)
    const [container, toolName] = name.split('.');

    if (!container || !toolName) {
      return this.errorResponse(id, MCPErrorCode.INVALID_PARAMS, `Invalid tool name format: ${name}. Expected: container.toolName`);
    }

    // Find tool by containerId and tool name
    // The tool may be registered with its class name, but exposed with containerId
    // Handle undefined containerId (treat as matching the container name used in MCP)
    const tool = Array.from(ToolRegistry.getAllTools().values()).find(t => {
      const toolContainer = t.containerId || 'global'; // undefined becomes 'global'
      return toolContainer === container && t.name === toolName;
    });

    if (!tool) {
      return this.errorResponse(id, MCPErrorCode.TOOL_NOT_FOUND, `Tool not found: ${name}`);
    }

    // Execute tool
    try {
      // Convert args object to array format expected by ToolExecutor
      const argsArray = Object.values(args || {});
      const result = await this.executor.execute(tool, argsArray);

      if (!result.success) {
        return this.errorResponse(
          id,
          MCPErrorCode.TOOL_EXECUTION_FAILED,
          result.message || 'Tool execution failed',
          { error: result.error, timing: result.timing }
        );
      }

      // Format success response
      const response: MCPToolCallResponse = {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: true,
              result: result.data,
              timing: result.timing,
              message: result.message
            }, null, 2)
          }
        ]
      };

      return {
        jsonrpc: '2.0',
        id,
        result: response
      };

    } catch (error) {
      return this.errorResponse(
        id,
        MCPErrorCode.TOOL_EXECUTION_FAILED,
        error instanceof Error ? error.message : 'Tool execution failed',
        error
      );
    }
  }

  /**
   * Handle initialize request
   */
  private handleInitialize(id?: string | number): MCPResponse {
    return {
      jsonrpc: '2.0',
      id,
      result: {
        protocolVersion: '2024-11-05',
        serverInfo: {
          name: this.config.name,
          version: this.config.version
        },
        capabilities: this.config.capabilities
      }
    };
  }

  /**
   * Convert Supernal tool to MCP tool format
   */
  private convertToMCPTool(container: string, tool: ToolMetadata): MCPTool {
    // tool.inputSchema is already a full schema object {type, properties, required}
    // Use it directly, or create a default if missing
    const inputSchema = tool.inputSchema || {
      type: 'object' as const,
      properties: {},
      required: []
    };

    return {
      name: `${container}.${tool.name}`,
      description: tool.description || `Tool: ${tool.name}`,
      inputSchema,
      annotations: {
        container,
        category: tool.category,
        elementId: tool.elementId,
        componentName: tool.componentName,
        toolType: tool.toolType,
        aiEnabled: tool.aiEnabled
      }
    };
  }

  /**
   * Create error response
   */
  private errorResponse(
    id: string | number | undefined,
    code: MCPErrorCode,
    message: string,
    data?: any
  ): MCPResponse {
    const error: MCPError = {
      code,
      message,
      data
    };

    return {
      jsonrpc: '2.0',
      id,
      error
    };
  }
}

/**
 * Create and configure a Supernal MCP server
 * 
 * @param config - Server configuration
 * @returns Configured MCP server instance
 * 
 * @example
 * ```typescript
 * const server = createSupernalMCPServer({
 *   name: 'my-app-tools',
 *   version: '1.0.0'
 * });
 * 
 * // Start with stdio transport
 * const transport = new StdioTransport();
 * await server.start(transport);
 * ```
 */
export function createSupernalMCPServer(config?: Partial<MCPServerConfig>): SupernalMCPServer {
  return new SupernalMCPServer(config);
}
