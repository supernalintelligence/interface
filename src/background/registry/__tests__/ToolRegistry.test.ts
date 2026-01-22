import { ToolRegistry } from '../ToolRegistry';
import { LocationContext } from '../../location/LocationContext';
import { ToolMetadata } from '../../../decorators/Tool';
import { ToolCategory } from '../../../types/Tool';
import { ToolComplexity, ToolFrequency } from '../../../types/ClassifiedTool';

describe('ToolRegistry', () => {
  beforeEach(() => {
    ToolRegistry.clear();
    LocationContext.reset();
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
    it('filters by containerId when on matching page', () => {
      ToolRegistry.registerTool('Blog', 'createPost', createTool({
        name: 'createPost',
        containerId: '/blog',
        toolId: 'Blog.createPost',
        methodName: 'createPost',
        providerClass: 'Blog',
      }));

      LocationContext.setCurrent({ page: '/blog', route: '/blog' });
      const tools = ToolRegistry.getToolsForCurrentContext();

      expect(tools.find(t => t.name === 'createPost')).toBeDefined();
    });

    it('filters out non-matching containerId tools', () => {
      ToolRegistry.registerTool('Blog', 'createPost', createTool({
        name: 'createPost',
        containerId: '/blog',
        toolId: 'Blog.createPost',
        methodName: 'createPost',
        providerClass: 'Blog',
      }));

      LocationContext.setCurrent({ page: '/dashboard', route: '/dashboard' });
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

    it('global tools always available', () => {
      ToolRegistry.registerTool('Nav', 'goHome', createTool({
        name: 'goHome',
        containerId: 'global',
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
});
