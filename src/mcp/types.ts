/**
 * MCP Protocol Types
 * 
 * Type definitions for Model Context Protocol (MCP) integration.
 * Based on @ai-sdk/mcp specification.
 */

/**
 * MCP tool parameter schema
 */
export interface MCPToolParameter {
  type: string;
  description?: string;
  required?: boolean;
  properties?: Record<string, MCPToolParameter>;
  items?: MCPToolParameter;
  enum?: string[];
  default?: any;
}

/**
 * MCP tool definition
 */
export interface MCPTool {
  /** Unique tool identifier (container.toolName format) */
  name: string;
  
  /** Human-readable description */
  description: string;
  
  /** JSON Schema for tool parameters */
  inputSchema: {
    type: 'object';
    properties: Record<string, MCPToolParameter>;
    required?: string[];
  };
  
  /** Optional annotations for additional metadata */
  annotations?: {
    container?: string;
    category?: string;
    elementId?: string;
    componentName?: string;
    [key: string]: any;
  };
}

/**
 * MCP tools/list response
 */
export interface MCPToolsListResponse {
  tools: MCPTool[];
}

/**
 * MCP tools/call request
 */
export interface MCPToolCallRequest {
  name: string;
  arguments: Record<string, any>;
}

/**
 * MCP content types
 */
export type MCPContentType = 'text' | 'image' | 'resource';

/**
 * MCP text content
 */
export interface MCPTextContent {
  type: 'text';
  text: string;
}

/**
 * MCP image content
 */
export interface MCPImageContent {
  type: 'image';
  data: string;
  mimeType: string;
}

/**
 * MCP resource content
 */
export interface MCPResourceContent {
  type: 'resource';
  resource: {
    uri: string;
    mimeType?: string;
    text?: string;
  };
}

/**
 * Union of all MCP content types
 */
export type MCPContent = MCPTextContent | MCPImageContent | MCPResourceContent;

/**
 * MCP tools/call response
 */
export interface MCPToolCallResponse {
  content: MCPContent[];
  isError?: boolean;
}

/**
 * MCP server configuration
 */
export interface MCPServerConfig {
  /** Server name */
  name: string;
  
  /** Server version */
  version: string;
  
  /** Optional description */
  description?: string;
  
  /** Optional capabilities */
  capabilities?: {
    tools?: {};
    resources?: {};
    prompts?: {};
  };
}

/**
 * MCP error codes
 */
export enum MCPErrorCode {
  PARSE_ERROR = -32700,
  INVALID_REQUEST = -32600,
  METHOD_NOT_FOUND = -32601,
  INVALID_PARAMS = -32602,
  INTERNAL_ERROR = -32603,
  TOOL_NOT_FOUND = -1,
  TOOL_EXECUTION_FAILED = -2
}

/**
 * MCP error
 */
export interface MCPError {
  code: MCPErrorCode;
  message: string;
  data?: any;
}

/**
 * MCP request
 */
export interface MCPRequest {
  jsonrpc: '2.0';
  id?: string | number;
  method: string;
  params?: any;
}

/**
 * MCP response
 */
export interface MCPResponse {
  jsonrpc: '2.0';
  id?: string | number;
  result?: any;
  error?: MCPError;
}

/**
 * MCP transport interface
 */
export interface MCPTransport {
  /** Send message to client */
  send(message: MCPResponse): Promise<void>;
  
  /** Receive message from client */
  receive(): Promise<MCPRequest>;
  
  /** Close transport */
  close(): Promise<void>;
}

/**
 * MCP server interface
 */
export interface MCPServer {
  /** Server configuration */
  config: MCPServerConfig;
  
  /** Start server (transport provided externally) */
  start(transport: MCPTransport): Promise<void>;
  
  /** Stop server */
  stop(): Promise<void>;
  
  /** Handle incoming request */
  handle(request: MCPRequest): Promise<MCPResponse | null>;
}
