/**
 * MCP (Model Context Protocol) Module
 * 
 * Exports MCP server, transport, and types for exposing Supernal Interface
 * tools to external AI agents.
 */

export { SupernalMCPServer, createSupernalMCPServer } from './server';
export { StdioTransport, createStdioTransport } from './transport';
export type {
  MCPServer,
  MCPServerConfig,
  MCPTransport,
  MCPRequest,
  MCPResponse,
  MCPTool,
  MCPToolsListResponse,
  MCPToolCallRequest,
  MCPToolCallResponse,
  MCPError,
  MCPErrorCode,
  MCPContent,
  MCPTextContent,
  MCPImageContent,
  MCPResourceContent,
  MCPToolParameter
} from './types';
