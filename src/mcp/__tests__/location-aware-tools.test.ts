import { SupernalMCPServer } from '../server';
import { ToolRegistry } from '../../background/registry/ToolRegistry';
import { NavigationGraph } from '../../background/navigation/NavigationGraph';
import { Tool } from '../../decorators/Tool';
import { ToolProvider } from '../../decorators/ToolProvider';

// Mock tool providers with context-specific tools
// These are defined OUTSIDE the test suite so decorators run at module load time
@ToolProvider('blog')
class BlogTools {
  @Tool({ name: 'createPost', description: 'Create blog post' })
  async createPost() {
    return { success: true };
  }
  
  @Tool({ name: 'editPost', description: 'Edit blog post' })
  async editPost() {
    return { success: true };
  }
}

@ToolProvider('dashboard')
class DashboardTools {
  @Tool({ name: 'viewStats', description: 'View dashboard stats' })
  async viewStats() {
    return { success: true };
  }
}

class GlobalTools {
  @Tool({ name: 'search', description: 'Global search' })
  async search() {
    return { success: true };
  }
}

describe('Location-Aware MCP Server', () => {
  let server: SupernalMCPServer;
  
  beforeEach(() => {
    // Clear NavigationGraph state
    const nav = NavigationGraph.getInstance();
    (nav as any).currentContext = undefined;
    (nav as any).contextTools.clear();
    
    // Register tools instances (decorators already ran at module load)
    new BlogTools();
    new DashboardTools();
    new GlobalTools();
    
    // Register tool contexts
    nav.registerToolInContext('createPost', 'blog');
    nav.registerToolInContext('editPost', 'blog');
    nav.registerToolInContext('viewStats', 'dashboard');
    // search is global (no context)
    
    // Create server
    server = new SupernalMCPServer({
      name: 'test-server',
      version: '1.0.0'
    });
  });
  
  describe('Context-Based Tool Filtering', () => {
    it('should show only blog tools when context is "blog"', async () => {
      const nav = NavigationGraph.getInstance();
      nav.setCurrentContext('blog');
      
      const response = await server.handle({
        jsonrpc: '2.0',
        id: 1,
        method: 'tools/list',
        params: {}
      });
      
      expect(response).not.toBeNull();
      if (!response) return;
      
      const tools = (response.result as any).tools;
      const toolNames = tools.map((t: any) => t.name);
      
      // Should include blog-specific tools + global tools
      expect(toolNames).toContain('blog.createPost');
      expect(toolNames).toContain('blog.editPost');
      expect(toolNames).toContain('global.search');
      
      // Should NOT include dashboard tools
      expect(toolNames).not.toContain('dashboard.viewStats');
    });
    
    it('should show only dashboard tools when context is "dashboard"', async () => {
      const nav = NavigationGraph.getInstance();
      nav.setCurrentContext('dashboard');
      
      const response = await server.handle({
        jsonrpc: '2.0',
        id: 1,
        method: 'tools/list',
        params: {}
      });
      
      expect(response).not.toBeNull();
      if (!response) return;
      
      const tools = (response.result as any).tools;
      const toolNames = tools.map((t: any) => t.name);
      
      // Should include dashboard-specific tools + global tools
      expect(toolNames).toContain('dashboard.viewStats');
      expect(toolNames).toContain('global.search');
      
      // Should NOT include blog tools
      expect(toolNames).not.toContain('blog.createPost');
      expect(toolNames).not.toContain('blog.editPost');
    });
    
    it('should show all tools when context is "global"', async () => {
      const nav = NavigationGraph.getInstance();
      nav.setCurrentContext('global');
      
      const response = await server.handle({
        jsonrpc: '2.0',
        id: 1,
        method: 'tools/list',
        params: {}
      });
      
      expect(response).not.toBeNull();
      if (!response) return;
      
      const tools = (response.result as any).tools;
      const toolNames = tools.map((t: any) => t.name);
      
      // Global context shows all tools
      expect(toolNames).toContain('blog.createPost');
      expect(toolNames).toContain('blog.editPost');
      expect(toolNames).toContain('dashboard.viewStats');
      expect(toolNames).toContain('global.search');
    });
  });
  
  describe('Dynamic Context Switching', () => {
    it('should update available tools when context changes', async () => {
      const nav = NavigationGraph.getInstance();
      
      // Start in blog context
      nav.setCurrentContext('blog');
      let response = await server.handle({
        jsonrpc: '2.0',
        id: 1,
        method: 'tools/list',
        params: {}
      });
      
      let tools = (response?.result as any)?.tools || [];
      let toolNames = tools.map((t: any) => t.name);
      expect(toolNames).toContain('blog.createPost');
      expect(toolNames).not.toContain('dashboard.viewStats');
      
      // Switch to dashboard context
      nav.setCurrentContext('dashboard');
      response = await server.handle({
        jsonrpc: '2.0',
        id: 2,
        method: 'tools/list',
        params: {}
      });
      
      tools = (response?.result as any)?.tools || [];
      toolNames = tools.map((t: any) => t.name);
      expect(toolNames).toContain('dashboard.viewStats');
      expect(toolNames).not.toContain('blog.createPost');
    });
  });
});
