/**
 * Stdio Transport for MCP
 * 
 * Implements MCP transport over stdin/stdout for integration with
 * Claude Desktop, Cursor, and other MCP clients.
 */

import { createInterface, Interface as ReadlineInterface } from 'readline';
import type { MCPTransport, MCPRequest, MCPResponse } from './types';

/**
 * Stdio transport implementation
 * 
 * Reads JSON-RPC messages from stdin (one per line)
 * Writes JSON-RPC responses to stdout (one per line)
 */
export class StdioTransport implements MCPTransport {
  private readline?: ReadlineInterface;
  private messageQueue: MCPRequest[] = [];
  private waitingResolvers: Array<(message: MCPRequest) => void> = [];
  private closed: boolean = false;

  constructor() {
    this.setupReadline();
  }

  /**
   * Setup readline interface for stdin
   */
  private setupReadline(): void {
    this.readline = createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false
    });

    this.readline.on('line', (line: string) => {
      try {
        const message = JSON.parse(line) as MCPRequest;
        
        // If someone is waiting for a message, give it to them immediately
        if (this.waitingResolvers.length > 0) {
          const resolve = this.waitingResolvers.shift()!;
          resolve(message);
        } else {
          // Otherwise queue it
          this.messageQueue.push(message);
        }
      } catch (error) {
        console.error('[Stdio Transport] Failed to parse message:', error);
        console.error('[Stdio Transport] Line:', line);
      }
    });

    this.readline.on('close', () => {
      this.closed = true;
      
      // Reject all waiting resolvers
      for (const resolve of this.waitingResolvers) {
        resolve({ 
          jsonrpc: '2.0', 
          method: '__transport_closed__' 
        } as any);
      }
      this.waitingResolvers = [];
    });
  }

  /**
   * Send message to client (write to stdout)
   */
  async send(message: MCPResponse): Promise<void> {
    if (this.closed) {
      throw new Error('Transport is closed');
    }

    const json = JSON.stringify(message);
    process.stdout.write(json + '\n');
  }

  /**
   * Receive message from client (read from stdin)
   */
  async receive(): Promise<MCPRequest> {
    if (this.closed) {
      throw new Error('Transport is closed');
    }

    // If we have queued messages, return the first one
    if (this.messageQueue.length > 0) {
      return this.messageQueue.shift()!;
    }

    // Otherwise wait for the next message
    return new Promise<MCPRequest>((resolve) => {
      this.waitingResolvers.push(resolve);
    });
  }

  /**
   * Close transport
   */
  async close(): Promise<void> {
    if (this.closed) return;

    this.closed = true;

    if (this.readline) {
      this.readline.close();
      this.readline = undefined;
    }

    // Reject all waiting resolvers
    for (const resolve of this.waitingResolvers) {
      resolve({ 
        jsonrpc: '2.0', 
        method: '__transport_closed__' 
      } as any);
    }
    this.waitingResolvers = [];
    this.messageQueue = [];
  }
}

/**
 * Create stdio transport
 * 
 * @returns Stdio transport instance
 * 
 * @example
 * ```typescript
 * import { createSupernalMCPServer, createStdioTransport } from '@supernal/interface';
 * 
 * const server = createSupernalMCPServer();
 * const transport = createStdioTransport();
 * 
 * await server.start(transport);
 * ```
 */
export function createStdioTransport(): StdioTransport {
  return new StdioTransport();
}
