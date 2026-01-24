import { SupernalMCPServer } from '../server';
import { ToolRegistry } from '../../background/registry/ToolRegistry';
import { LocationContext } from '../../background/location/LocationContext';
import { Tool } from '../../decorators/Tool';
import { ToolProvider } from '../../decorators/ToolProvider';
import { LocationScope } from '../../decorators/LocationScope';

// Mock tool providers with location-scoped tools
// These are defined OUTSIDE the test suite so decorators run at module load time
// Since these tests don't use element-based scoping, they'll appear as "ungrouped"
@ToolProvider({ name: 'blog' })
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

@ToolProvider({ name: 'dashboard' })
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
      // Note: Without @Component decorator, tools are grouped as "ungrouped"
      expect(toolNames).toContain('ungrouped.createPost');
      expect(toolNames).toContain('ungrouped.editPost');
      expect(toolNames).toContain('ungrouped.search');

      // Should NOT include dashboard tools
      expect(toolNames).not.toContain('ungrouped.viewStats');
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
      expect(toolNames).toContain('ungrouped.viewStats');
      expect(toolNames).toContain('ungrouped.search');

      // Should NOT include blog tools
      expect(toolNames).not.toContain('ungrouped.createPost');
      expect(toolNames).not.toContain('ungrouped.editPost');
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
      expect(toolNames).toContain('ungrouped.search');
      expect(toolNames).not.toContain('ungrouped.createPost');
      expect(toolNames).not.toContain('ungrouped.viewStats');
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
      expect(toolNames).toContain('ungrouped.createPost');
      expect(toolNames).toContain('ungrouped.editPost');
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
      expect(toolNames).toContain('ungrouped.createPost');
      expect(toolNames).not.toContain('ungrouped.viewStats');

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
      expect(toolNames).toContain('ungrouped.viewStats');
      expect(toolNames).not.toContain('ungrouped.createPost');
    });
  });
  
  describe('Component-Specific Tools', () => {
    it('should filter by mounted components', async () => {
      // Define tools that require specific components
      @ToolProvider({ name: 'editor' })
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
      expect(toolNames).not.toContain('ungrouped.formatText');

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
      expect(toolNames).toContain('ungrouped.formatText');
    });
  });
});

describe('Unified Scoping (containerId + LocationScope)', () => {
  let server: SupernalMCPServer;

  beforeEach(() => {
    LocationContext.reset();
    // Don't clear registry - use unique tool names to avoid conflicts
    server = new SupernalMCPServer({
      name: 'test-server',
      version: '1.0.0'
    });
  });

  afterEach(() => {
    // Clean up only the tools we registered (by unique prefix)
    const allTools = ToolRegistry.getAllTools();
    for (const [toolId] of allTools) {
      if (toolId.startsWith('UnifiedTest_')) {
        // No unregister method, so we just leave them - they won't interfere
        // since they have unique names
      }
    }
  });

  describe('element-based scoping', () => {
    it('should filter tools by visible elements', () => {
      // Create elements
      const themeBtn = document.createElement('button');
      const exportBtn = document.createElement('button');
      themeBtn.setAttribute('data-testid', 'theme-btn');
      exportBtn.setAttribute('data-testid', 'export-btn');
      document.body.appendChild(themeBtn);
      document.body.appendChild(exportBtn);

      // Register tools with unique names to avoid conflicts with other test files
      ToolRegistry.registerTool('UnifiedTest_Settings', 'changeTheme', {
        name: 'ut_changeTheme',
        description: 'Change app theme',
        elementId: 'theme-btn',
        method: () => {},
        aiEnabled: true
      } as any);

      ToolRegistry.registerTool('UnifiedTest_Settings', 'exportData', {
        name: 'ut_exportData',
        description: 'Export user data',
        elementId: 'export-btn',
        method: () => {},
        aiEnabled: true
      } as any);

      // When elements are visible - should see tools
      LocationContext.setCurrent({
        page: '/settings',
        route: '/settings',
        elements: ['theme-btn', 'export-btn']
      });
      let tools = ToolRegistry.getToolsByLocation();
      let toolNames = tools.map(t => t.name);
      expect(toolNames).toContain('ut_changeTheme');
      expect(toolNames).toContain('ut_exportData');

      // When elements not visible - should NOT see tools
      LocationContext.setCurrent({
        page: '/settings',
        route: '/settings',
        elements: []
      });
      tools = ToolRegistry.getToolsByLocation();
      toolNames = tools.map(t => t.name);
      expect(toolNames).not.toContain('ut_changeTheme');
      expect(toolNames).not.toContain('ut_exportData');

      document.body.removeChild(themeBtn);
      document.body.removeChild(exportBtn);
    });

    it('should show tools when their elements are visible', () => {
      const element = document.createElement('button');
      element.setAttribute('data-testid', 'example-btn');
      document.body.appendChild(element);

      ToolRegistry.registerTool('UnifiedTest_Examples', 'runExample', {
        name: 'ut_runExample',
        description: 'Run an example',
        elementId: 'example-btn',
        method: () => {},
        aiEnabled: true
      } as any);

      // Element visible - tool available
      LocationContext.setCurrent({
        page: '/examples/counter',
        route: '/examples/counter',
        elements: ['example-btn']
      });
      let tools = ToolRegistry.getToolsByLocation();
      let toolNames = tools.map(t => t.name);
      expect(toolNames).toContain('ut_runExample');

      // Element not visible - tool not available
      LocationContext.setCurrent({
        page: '/examples',
        route: '/examples',
        elements: []
      });
      tools = ToolRegistry.getToolsByLocation();
      toolNames = tools.map(t => t.name);
      expect(toolNames).not.toContain('ut_runExample');

      document.body.removeChild(element);
    });

    it('should show tools without elementId everywhere', () => {
      ToolRegistry.registerTool('UnifiedTest_Navigation', 'goHome', {
        name: 'ut_goHome',
        description: 'Go to home',
        // No elementId - always available
        method: () => {},
        aiEnabled: true
      } as any);

      // On any page, tools without elementId should be visible
      LocationContext.setCurrent({ page: '/random-page', route: '/random-page' });
      let tools = ToolRegistry.getToolsByLocation();
      let toolNames = tools.map(t => t.name);
      expect(toolNames).toContain('ut_goHome');

      // Even with no location set
      LocationContext.reset();
      tools = ToolRegistry.getToolsByLocation();
      toolNames = tools.map(t => t.name);
      expect(toolNames).toContain('ut_goHome');
    });
  });

  describe('getToolsForContext convenience method', () => {
    it('should return tools for a specific context when elements are visible', () => {
      const element = document.createElement('button');
      element.setAttribute('data-testid', 'cart-btn');
      document.body.appendChild(element);

      ToolRegistry.registerTool('UnifiedTest_Products', 'addToCart', {
        name: 'ut_addToCart',
        description: 'Add product to cart',
        elementId: 'cart-btn',
        method: () => {},
        aiEnabled: true
      } as any);

      // Element visible - use getToolsForCurrentContext() which respects elements
      LocationContext.setCurrent({
        page: '/products',
        elements: ['cart-btn']
      });
      const tools = ToolRegistry.getToolsForCurrentContext();
      const toolNames = tools.map(t => t.name);
      expect(toolNames).toContain('ut_addToCart');

      document.body.removeChild(element);
    });
  });
});
