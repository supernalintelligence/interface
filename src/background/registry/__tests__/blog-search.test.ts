/**
 * Test to reproduce blog search issue
 */
import { ToolRegistry } from '../ToolRegistry';

describe('Blog Search Tool Registration', () => {
  beforeEach(() => {
    // Clear registry before each test
    ToolRegistry.getAllTools().clear();
  });

  it('should find tools with containerId="Blog"', () => {
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
      containerId: 'Blog', // This should match!
      actionType: 'navigation' as const,
      toolType: 'navigation' as const,
      instance: {
        searchInBlog: async () => ({ success: true, message: 'test' })
      }
    } as any);

    // Now search with container="Blog"
    const results = ToolRegistry.searchScoped('open your users', 'Blog');

    console.log('Search results:', results.map(t => ({
      name: t.name,
      containerId: t.containerId,
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
      containerId: 'Blog',
      instance: {
        searchInBlog: async () => ({ success: true, message: 'test' })
      }
    } as any);

    const results = ToolRegistry.searchScoped('open your users', 'Blog');

    expect(results.length).toBe(1);
    expect(results[0].name).toBe('Search Blog');
  });
});
