/**
 * MCP Server Entry Point (Node.js only)
 * 
 * This file should ONLY be used in Node.js environments (MCP servers).
 * DO NOT import this in browser code.
 * 
 * For browser usage, import from '@supernal/interface' (without /mcp)
 */

export {
  createSupernalMCPServer,
  createStdioTransport,
  SupernalMCPServer,
  StdioTransport,
  type MCPServer,
  type MCPServerConfig,
  type MCPTransport,
  type MCPRequest,
  type MCPResponse,
  type MCPTool,
  type MCPToolsListResponse,
  type MCPToolCallRequest,
  type MCPToolCallResponse
} from './mcp';
