/**
 * MCP Server Tests
 * 
 * Tests for the Supernal MCP server implementation.
 */

import { SupernalMCPServer, createSupernalMCPServer } from '../server';
import { MCPRequest, MCPResponse, MCPErrorCode, MCPTransport } from '../types';
import { ToolRegistry } from '../../background/registry/ToolRegistry';
import { Tool } from '../../decorators/Tool';
import { Component } from '../../decorators/Component';

// Mock transport for testing
class MockTransport implements MCPTransport {
  public messages: MCPResponse[] = [];
  public requests: MCPRequest[] = [];
  private currentRequestIndex = 0;

  async send(message: MCPResponse): Promise<void> {
    this.messages.push(message);
  }

  async receive(): Promise<MCPRequest> {
    if (this.currentRequestIndex >= this.requests.length) {
      // Wait indefinitely (transport closed)
      return new Promise(() => {});
    }
    return this.requests[this.currentRequestIndex++];
  }

  async close(): Promise<void> {
    // Noop
  }

  // Helper: Add request to queue
  addRequest(request: MCPRequest): void {
    this.requests.push(request);
  }
}

// Test tools
@Component({
  name: 'test-component',
  containerId: 'TestContainer'
})
class TestComponent {
  @Tool({ name: 'greet', description: 'Say hello' })
  greet(name: string): string {
    return `Hello, ${name}!`;
  }

  @Tool({ name: 'add', description: 'Add two numbers' })
  add(a: number, b: number): number {
    return a + b;
  }

  @Tool({ name: 'fail', description: 'Always fails' })
  fail(): void {
    throw new Error('Intentional failure');
  }
}

describe('MCP Server', () => {
  let server: SupernalMCPServer;
  let transport: MockTransport;

  beforeEach(() => {
    // Clear registry using the global registry
    const globalRegistry = (typeof global !== 'undefined' ? global : globalThis) as any;
    if (globalRegistry.__SUPERNAL_TOOL_REGISTRY__) {
      globalRegistry.__SUPERNAL_TOOL_REGISTRY__.clear();
    }

    // Register test component (triggers tool registration)
    const instance = new TestComponent();

    // Create server
    server = createSupernalMCPServer({
      name: 'test-server',
      version: '1.0.0'
    });

    transport = new MockTransport();
  });

  afterEach(() => {
    // Clean up using the global registry
    const globalRegistry = (typeof global !== 'undefined' ? global : globalThis) as any;
    if (globalRegistry.__SUPERNAL_TOOL_REGISTRY__) {
      globalRegistry.__SUPERNAL_TOOL_REGISTRY__.clear();
    }
  });

  describe('createSupernalMCPServer', () => {
    it('should create server with default config', () => {
      const defaultServer = createSupernalMCPServer();
      
      expect(defaultServer).toBeInstanceOf(SupernalMCPServer);
      expect(defaultServer.config.name).toBe('supernal-interface');
      expect(defaultServer.config.version).toBe('1.0.0');
    });

    it('should create server with custom config', () => {
      const customServer = createSupernalMCPServer({
        name: 'custom-server',
        version: '2.0.0',
        description: 'Custom MCP server'
      });

      expect(customServer.config.name).toBe('custom-server');
      expect(customServer.config.version).toBe('2.0.0');
      expect(customServer.config.description).toBe('Custom MCP server');
    });
  });

  describe('handle', () => {
    describe('initialize', () => {
      it('should handle initialize request', async () => {
        const request: MCPRequest = {
          jsonrpc: '2.0',
          id: 1,
          method: 'initialize',
          params: {}
        };

        const response = await server.handle(request);

        expect(response).toBeDefined();
        expect(response!.jsonrpc).toBe('2.0');
        expect(response!.id).toBe(1);
        expect(response!.result).toMatchObject({
          protocolVersion: '2024-11-05',
          serverInfo: {
            name: 'test-server',
            version: '1.0.0'
          },
          capabilities: {
            tools: true,
            resources: false,
            prompts: false
          }
        });
      });
    });

    describe('tools/list', () => {
      it('should list all registered tools', async () => {
        const request: MCPRequest = {
          jsonrpc: '2.0',
          id: 1,
          method: 'tools/list'
        };

        const response = await server.handle(request);

        expect(response).toBeDefined();
        expect(response!.jsonrpc).toBe('2.0');
        expect(response!.id).toBe(1);
        expect(response!.result).toHaveProperty('tools');
        
        const { tools } = response!.result as any;
        expect(Array.isArray(tools)).toBe(true);
        expect(tools.length).toBeGreaterThan(0);
        
        // Find greet tool
        const greetTool = tools.find((t: any) => t.name === 'TestContainer.greet');
        expect(greetTool).toBeDefined();
        expect(greetTool.description).toBe('Say hello');
      });

      it('should include tool annotations', async () => {
        const request: MCPRequest = {
          jsonrpc: '2.0',
          id: 1,
          method: 'tools/list'
        };

        const response = await server.handle(request);
        expect(response).toBeDefined();
        const { tools } = response!.result as any;

        const greetTool = tools.find((t: any) => t.name === 'TestContainer.greet');
        expect(greetTool.annotations).toMatchObject({
          container: 'TestContainer',
          componentName: 'test-component'
        });
      });
    });

    describe('tools/call', () => {
      it('should execute tool successfully', async () => {
        const request: MCPRequest = {
          jsonrpc: '2.0',
          id: 1,
          method: 'tools/call',
          params: {
            name: 'TestContainer.greet',
            arguments: { 0: 'World' }
          }
        };

        const response = await server.handle(request);

        expect(response).toBeDefined();
        expect(response!.jsonrpc).toBe('2.0');
        expect(response!.id).toBe(1);
        expect(response!.error).toBeUndefined();
        expect(response!.result).toHaveProperty('content');
        
        const { content } = response!.result as any;
        expect(content).toHaveLength(1);
        expect(content[0].type).toBe('text');
        
        const resultData = JSON.parse(content[0].text);
        expect(resultData.success).toBe(true);
        expect(resultData.result).toBe('Hello, World!');
      });

      it('should execute tool with multiple arguments', async () => {
        const request: MCPRequest = {
          jsonrpc: '2.0',
          id: 1,
          method: 'tools/call',
          params: {
            name: 'TestContainer.add',
            arguments: { 0: 5, 1: 3 }
          }
        };

        const response = await server.handle(request);
        expect(response).toBeDefined();
        const { content } = response!.result as any;
        const resultData = JSON.parse(content[0].text);

        expect(resultData.success).toBe(true);
        expect(resultData.result).toBe(8);
      });

      it('should return error for missing tool name', async () => {
        const request: MCPRequest = {
          jsonrpc: '2.0',
          id: 1,
          method: 'tools/call',
          params: {
            name: '',
            arguments: {}
          }
        };

        const response = await server.handle(request);

        expect(response).toBeDefined();
        expect(response!.error).toBeDefined();
        expect(response!.error!.code).toBe(MCPErrorCode.INVALID_PARAMS);
        expect(response!.error!.message).toContain('Missing tool name');
      });

      it('should return error for tool not found', async () => {
        const request: MCPRequest = {
          jsonrpc: '2.0',
          id: 1,
          method: 'tools/call',
          params: {
            name: 'NonExistent.tool',
            arguments: {}
          }
        };

        const response = await server.handle(request);

        expect(response).toBeDefined();
        expect(response!.error).toBeDefined();
        expect(response!.error!.code).toBe(MCPErrorCode.TOOL_NOT_FOUND);
      });

      it('should return error for tool execution failure', async () => {
        const request: MCPRequest = {
          jsonrpc: '2.0',
          id: 1,
          method: 'tools/call',
          params: {
            name: 'TestContainer.fail',
            arguments: {}
          }
        };

        const response = await server.handle(request);

        expect(response).toBeDefined();
        expect(response!.error).toBeDefined();
        expect(response!.error!.code).toBe(MCPErrorCode.TOOL_EXECUTION_FAILED);
      });
    });

    describe('unknown method', () => {
      it('should return METHOD_NOT_FOUND error', async () => {
        const request: MCPRequest = {
          jsonrpc: '2.0',
          id: 1,
          method: 'unknown/method'
        };

        const response = await server.handle(request);

        expect(response).toBeDefined();
        expect(response!.error).toBeDefined();
        expect(response!.error!.code).toBe(MCPErrorCode.METHOD_NOT_FOUND);
      });
    });
  });

  describe('Tool name format', () => {
    it('should use container.toolName format', async () => {
      const request: MCPRequest = {
        jsonrpc: '2.0',
        id: 1,
        method: 'tools/list'
      };

      const response = await server.handle(request);
      expect(response).toBeDefined();
      const { tools } = response!.result as any;

      tools.forEach((tool: any) => {
        expect(tool.name).toMatch(/^.+\..+$/); // Should contain dot
        const [container, toolName] = tool.name.split('.');
        expect(container).toBeTruthy();
        expect(toolName).toBeTruthy();
      });
    });
  });
});
