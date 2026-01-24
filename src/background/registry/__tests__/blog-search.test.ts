/**
 * Test to reproduce blog search issue
 */
import { ToolRegistry } from '../ToolRegistry';

describe('Blog Search Tool Registration', () => {
  beforeEach(() => {
    // Clear registry before each test
    ToolRegistry.getAllTools().clear();
  });

  it('should find navigation tools (no element-based scoping)', () => {
    // Simulate how NavigationGraph registers the blog search tool
    ToolRegistry.registerTool('NavigationTools', 'searchInBlog', {
      name: 'Search Blog',
      methodName: 'searchInBlog',
      description: 'Search and navigate within Blog',
      aiEnabled: true,
      dangerLevel: 'safe' as const,
      examples: [
        'open blog {query}',
        'show blog {query}',
        'blog {query}',
        'search blog {query}',
        'find blog {query}',
        'open {query}',
        'show {query}',
        'search {query}',
        'find {query}',
      ],
      // No elementId - navigation tools are always available
      actionType: 'navigation' as const,
      toolType: 'navigation' as const,
      instance: {
        searchInBlog: async () => ({ success: true, message: 'test' })
      }
    } as any);

    // Search globally (no container needed)
    const results = ToolRegistry.searchScoped('open your users');

    console.log('Search results:', results.map(t => ({
      name: t.name,
      examples: t.examples?.slice(0, 3)
    })));

    // Should find the tool
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].name).toBe('Search Blog');
  });

  it('should match "open your users" against "open {query}" example', () => {
    ToolRegistry.registerTool('NavigationTools', 'searchInBlog', {
      name: 'Search Blog',
      methodName: 'searchInBlog',
      description: 'Search and navigate within Blog',
      aiEnabled: true,
      dangerLevel: 'safe' as const,
      examples: ['open {query}'],
      // No elementId - navigation tools are always available
      instance: {
        searchInBlog: async () => ({ success: true, message: 'test' })
      }
    } as any);

    const results = ToolRegistry.searchScoped('open your users');

    expect(results.length).toBe(1);
    expect(results[0].name).toBe('Search Blog');
  });
});
