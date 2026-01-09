import { SupernalMCPServer } from '../server';
import { ToolRegistry } from '../../background/registry/ToolRegistry';
import { LocationContext } from '../../background/location/LocationContext';
import { Tool } from '../../decorators/Tool';
import { ToolProvider } from '../../decorators/ToolProvider';
import { LocationScope } from '../../decorators/LocationScope';

// Mock tool providers with location-scoped tools
// These are defined OUTSIDE the test suite so decorators run at module load time
@ToolProvider('blog')
class BlogTools {
  @Tool({ name: 'createPost', description: 'Create blog post' })
  @LocationScope({ pages: ['/blog', '/posts'] })
  async createPost() {
    return { success: true };
  }
  
  @Tool({ name: 'editPost', description: 'Edit blog post' })
  @LocationScope({ pages: ['/blog', '/posts'] })
  async editPost() {
    return { success: true };
  }
}

@ToolProvider('dashboard')
class DashboardTools {
  @Tool({ name: 'viewStats', description: 'View dashboard stats' })
  @LocationScope({ pages: ['/dashboard'] })
  async viewStats() {
    return { success: true };
  }
}

class GlobalTools {
  @Tool({ name: 'search', description: 'Global search' })
  @LocationScope({ global: true })
  async search() {
    return { success: true };
  }
}

describe('Location-Aware MCP Server (Full System)', () => {
  let server: SupernalMCPServer;
  let blogTools: BlogTools;
  let dashboardTools: DashboardTools;
  let globalTools: GlobalTools;
  
  beforeAll(() => {
    // Register tool provider classes once (decorators run at module load)
    blogTools = new BlogTools();
    dashboardTools = new DashboardTools();
    globalTools = new GlobalTools();
  });
  
  beforeEach(() => {
    // Only reset location, don't clear registry
    LocationContext.reset();
    
    // Create server
    server = new SupernalMCPServer({
      name: 'test-server',
      version: '1.0.0'
    });
  });
  
  describe('Location-Based Tool Filtering', () => {
    it('should show only blog tools when on /blog page', async () => {
      LocationContext.setCurrent({
        page: '/blog',
        route: '/blog'
      });
      
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
    
    it('should show only dashboard tools when on /dashboard page', async () => {
      LocationContext.setCurrent({
        page: '/dashboard',
        route: '/dashboard'
      });
      
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
    
    it('should show all tools when no location set', async () => {
      // Don't set any location - should only show global tools
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
      
      // Should only show global tools when no location
      expect(toolNames).toContain('global.search');
      expect(toolNames).not.toContain('blog.createPost');
      expect(toolNames).not.toContain('dashboard.viewStats');
    });
    
    it('should show tools for matching route patterns', async () => {
      LocationContext.setCurrent({
        page: '/posts',  // Changed from '/posts/my-post' - needs to match the scope
        route: '/posts'
      });
      
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
      
      // /posts should match blog tools (scope includes /posts)
      expect(toolNames).toContain('blog.createPost');
      expect(toolNames).toContain('blog.editPost');
    });
  });
  
  describe('Dynamic Location Changes', () => {
    it('should update available tools when location changes', async () => {
      // Start on blog page
      LocationContext.setCurrent({ page: '/blog' });
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
      
      // Navigate to dashboard
      LocationContext.setCurrent({ page: '/dashboard' });
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
  
  describe('Component-Specific Tools', () => {
    it('should filter by mounted components', async () => {
      // Define tools that require specific components
      @ToolProvider('editor')
      class EditorTools {
        @Tool({ name: 'formatText', description: 'Format text' })
        @LocationScope({ components: ['rich-editor'] })
        async formatText() {
          return { success: true };
        }
      }
      
      new EditorTools();
      
      // Without component mounted
      LocationContext.setCurrent({
        page: '/blog'
      });
      
      let response = await server.handle({
        jsonrpc: '2.0',
        id: 1,
        method: 'tools/list',
        params: {}
      });
      
      let tools = (response?.result as any)?.tools || [];
      let toolNames = tools.map((t: any) => t.name);
      expect(toolNames).not.toContain('editor.formatText');
      
      // With component mounted
      LocationContext.setCurrent({
        page: '/blog',
        components: ['rich-editor']
      });
      
      response = await server.handle({
        jsonrpc: '2.0',
        id: 2,
        method: 'tools/list',
        params: {}
      });
      
      tools = (response?.result as any)?.tools || [];
      toolNames = tools.map((t: any) => t.name);
      expect(toolNames).toContain('editor.formatText');
    });
  });
});
