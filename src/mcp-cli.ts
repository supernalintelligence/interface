/**
 * Supernal MCP CLI Entry Point
 * 
 * Starts the Supernal MCP server with stdio transport for use with
 * Claude Desktop, Cursor, and other MCP clients.
 * 
 * Usage:
 * ```bash
 * npx @supernal/interface-mcp
 * ```
 * 
 * Or in Claude Desktop config:
 * ```json
 * {
 *   "mcpServers": {
 *     "supernal": {
 *       "command": "npx",
 *       "args": ["@supernal/interface-mcp"]
 *     }
 *   }
 * }
 * ```
 */

import { createSupernalMCPServer, createStdioTransport } from './mcp';

async function main() {
  const server = createSupernalMCPServer({
    name: 'supernal-interface',
    version: '1.0.0',
    description: 'MCP server for Supernal Interface tools'
  });

  const transport = createStdioTransport();

  console.error('[Supernal MCP] Starting server...');

  try {
    await server.start(transport);
  } catch (error) {
    console.error('[Supernal MCP] Server error:', error);
    process.exit(1);
  }
}

// Handle shutdown gracefully
const handleShutdown = () => {
  console.error('[Supernal MCP] Shutting down...');
  process.exit(0);
};

process.on('SIGINT' as any, handleShutdown);
process.on('SIGTERM' as any, handleShutdown);

// Start server
main().catch((error) => {
  console.error('[Supernal MCP] Fatal error:', error);
  process.exit(1);
});
