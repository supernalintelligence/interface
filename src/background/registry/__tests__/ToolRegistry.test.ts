import { ToolRegistry } from '../ToolRegistry';
import { LocationContext } from '../../location/LocationContext';
import { ContainerRegistry } from '../../architecture/Containers';
import { ToolMetadata } from '../../../decorators/Tool';
import { ToolCategory } from '../../../types/Tool';
import { ToolComplexity, ToolFrequency } from '../../../types/ClassifiedTool';

describe('ToolRegistry', () => {
  beforeEach(() => {
    ToolRegistry.clear();
    LocationContext.reset();
    ContainerRegistry.clear();
  });

  // Helper to create minimal tool metadata
  const createTool = (overrides: Partial<ToolMetadata>): ToolMetadata => ({
    name: 'testTool',
    description: 'Test tool',
    category: ToolCategory.SYSTEM,
    dangerLevel: 'safe',
    aiEnabled: true,
    examples: [],
    toolType: 'ai-safe',
    returnType: 'json',
    executionContext: 'ui',
    complexity: ToolComplexity.SIMPLE,
    frequency: ToolFrequency.MEDIUM,
    toolId: 'Test.testTool',
    methodName: 'testTool',
    providerClass: 'Test',
    supportsStreaming: false,
    requiresApproval: false,
    inputSchema: {},
    outputSchema: {},
    tags: [],
    keywords: [],
    ...overrides
  } as ToolMetadata);

  describe('Unified Scope Filtering', () => {
    it('filters by elementId when element is visible', () => {
      // Create and register element
      const element = document.createElement('button');
      element.setAttribute('data-testid', 'create-post-btn');
      document.body.appendChild(element);

      ToolRegistry.registerTool('Blog', 'createPost', createTool({
        name: 'createPost',
        elementId: 'create-post-btn',
        toolId: 'Blog.createPost',
        methodName: 'createPost',
        providerClass: 'Blog',
      }));

      LocationContext.setCurrent({
        page: '/blog',
        route: '/blog',
        elements: ['create-post-btn']
      });
      const tools = ToolRegistry.getToolsForCurrentContext();

      expect(tools.find(t => t.name === 'createPost')).toBeDefined();

      document.body.removeChild(element);
    });

    it('filters out tools when element is not visible', () => {
      ToolRegistry.registerTool('Blog', 'createPost', createTool({
        name: 'createPost',
        elementId: 'create-post-btn',
        toolId: 'Blog.createPost',
        methodName: 'createPost',
        providerClass: 'Blog',
      }));

      LocationContext.setCurrent({
        page: '/blog',
        route: '/blog',
        elements: [] // Element not visible
      });
      const tools = ToolRegistry.getToolsForCurrentContext();

      expect(tools.find(t => t.name === 'createPost')).toBeUndefined();
    });

    it('filters by LocationScope pages', () => {
      ToolRegistry.registerTool('Editor', 'save', createTool({
        name: 'save',
        locationScope: { pages: ['/blog', '/posts'] },
        toolId: 'Editor.save',
        methodName: 'save',
        providerClass: 'Editor',
      }));

      LocationContext.setCurrent({ page: '/blog', route: '/blog' });
      const tools = ToolRegistry.getToolsForCurrentContext();

      expect(tools.find(t => t.name === 'save')).toBeDefined();
    });

    it('filters out non-matching LocationScope tools', () => {
      ToolRegistry.registerTool('Editor', 'save', createTool({
        name: 'save',
        locationScope: { pages: ['/blog', '/posts'] },
        toolId: 'Editor.save',
        methodName: 'save',
        providerClass: 'Editor',
      }));

      LocationContext.setCurrent({ page: '/dashboard', route: '/dashboard' });
      const tools = ToolRegistry.getToolsForCurrentContext();

      expect(tools.find(t => t.name === 'save')).toBeUndefined();
    });

    it('tools without elementId always available', () => {
      ToolRegistry.registerTool('Nav', 'goHome', createTool({
        name: 'goHome',
        // No elementId - always available
        toolId: 'Nav.goHome',
        methodName: 'goHome',
        providerClass: 'Nav',
      }));

      LocationContext.setCurrent({ page: '/random-page', route: '/random-page' });
      const tools = ToolRegistry.getToolsForCurrentContext();

      expect(tools.find(t => t.name === 'goHome')).toBeDefined();
    });

    it('tools with no scope are available everywhere', () => {
      ToolRegistry.registerTool('Utils', 'format', createTool({
        name: 'format',
        // No containerId, no locationScope
        toolId: 'Utils.format',
        methodName: 'format',
        providerClass: 'Utils',
      }));

      LocationContext.setCurrent({ page: '/any-page', route: '/any-page' });
      const tools = ToolRegistry.getToolsForCurrentContext();

      expect(tools.find(t => t.name === 'format')).toBeDefined();
    });
  });

  describe('Element-based Scoping', () => {
    it('shows tools when element is in visible elements list', () => {
      // Create and register element
      const element = document.createElement('button');
      element.setAttribute('data-testid', 'increment-btn');
      document.body.appendChild(element);

      ToolRegistry.registerTool('Counter', 'increment', createTool({
        name: 'increment',
        elementId: 'increment-btn',
        toolId: 'Counter.increment',
        methodName: 'increment',
        providerClass: 'Counter',
      }));

      // Tool available when element is visible
      LocationContext.setCurrent({
        page: '/demo/simple',
        route: '/demo/simple',
        elements: ['increment-btn']
      });
      const toolsOnDemo = ToolRegistry.getToolsForCurrentContext();
      expect(toolsOnDemo.find(t => t.name === 'increment')).toBeDefined();

      // Tool NOT available when element is not visible
      LocationContext.setCurrent({
        page: '/demo/simple',
        route: '/demo/simple',
        elements: []
      });
      const toolsOnBlog = ToolRegistry.getToolsForCurrentContext();
      expect(toolsOnBlog.find(t => t.name === 'increment')).toBeUndefined();

      document.body.removeChild(element);
    });

    it('handles multiple visible elements', () => {
      // Create elements
      const btn1 = document.createElement('button');
      const btn2 = document.createElement('button');
      btn1.setAttribute('data-testid', 'action-btn');
      btn2.setAttribute('data-testid', 'reset-btn');
      document.body.appendChild(btn1);
      document.body.appendChild(btn2);

      // Register tools
      ToolRegistry.registerTool('Widget', 'action', createTool({
        name: 'action',
        elementId: 'action-btn',
        toolId: 'Widget.action',
        methodName: 'action',
        providerClass: 'Widget',
      }));

      ToolRegistry.registerTool('Widget', 'reset', createTool({
        name: 'reset',
        elementId: 'reset-btn',
        toolId: 'Widget.reset',
        methodName: 'reset',
        providerClass: 'Widget',
      }));

      // Both tools available when both elements visible
      LocationContext.setCurrent({
        page: '/demo',
        route: '/demo',
        elements: ['action-btn', 'reset-btn']
      });
      expect(ToolRegistry.getToolsForCurrentContext().find(t => t.name === 'action')).toBeDefined();
      expect(ToolRegistry.getToolsForCurrentContext().find(t => t.name === 'reset')).toBeDefined();

      // Only one tool available when only one element visible
      LocationContext.setCurrent({
        page: '/demo',
        route: '/demo',
        elements: ['action-btn']
      });
      expect(ToolRegistry.getToolsForCurrentContext().find(t => t.name === 'action')).toBeDefined();
      expect(ToolRegistry.getToolsForCurrentContext().find(t => t.name === 'reset')).toBeUndefined();

      document.body.removeChild(btn1);
      document.body.removeChild(btn2);
    });

    it('tools without elementId always available (backward compat)', () => {
      // Register tool without elementId
      ToolRegistry.registerTool('Legacy', 'oldTool', createTool({
        name: 'oldTool',
        // No elementId
        toolId: 'Legacy.oldTool',
        methodName: 'oldTool',
        providerClass: 'Legacy',
      }));

      // Tool should be available everywhere
      LocationContext.setCurrent({ page: '/any-page', route: '/any-page' });
      const tools = ToolRegistry.getToolsForCurrentContext();
      expect(tools.find(t => t.name === 'oldTool')).toBeDefined();
    });
  });
});
