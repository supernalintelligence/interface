import { NavigationGraph } from '../NavigationGraph';
import { ToolRegistry } from '../../registry/ToolRegistry';
import { LocationContext } from '../../location/LocationContext';

describe('NavigationGraph (Open-Source)', () => {
  beforeEach(() => {
    // Reset LocationContext first (single source of truth)
    LocationContext.reset();

    // Reset singleton state
    const instance = NavigationGraph.getInstance();
    (instance as any).currentContext = undefined;
    (instance as any).contextTools.clear();
  });

  describe('Basic Context Management', () => {
    it('should store and retrieve current context', () => {
      const nav = NavigationGraph.getInstance();
      
      nav.setCurrentContext('blog');
      expect(nav.getCurrentContext()).toBe('blog');
      
      nav.setCurrentContext('dashboard');
      expect(nav.getCurrentContext()).toBe('dashboard');
    });

    it('should return "global" when no context is set', () => {
      const nav = NavigationGraph.getInstance();
      expect(nav.getCurrentContext()).toBe('global');
    });

    it('should handle empty string context', () => {
      const nav = NavigationGraph.getInstance();
      nav.setCurrentContext('');
      expect(nav.getCurrentContext()).toBe('');
    });
  });

  describe('Tool Registration', () => {
    it('should register tools for a context', () => {
      const nav = NavigationGraph.getInstance();
      
      nav.registerToolInContext('createPost', 'blog');
      nav.registerToolInContext('editPost', 'blog');
      
      const blogContext = nav.getToolContext('createPost');
      expect(blogContext).toBe('blog');
    });

    it('should return null for unregistered tools', () => {
      const nav = NavigationGraph.getInstance();
      const context = nav.getToolContext('nonexistent');
      expect(context).toBeNull();
    });

    it('should allow tools to be registered in multiple contexts', () => {
      const nav = NavigationGraph.getInstance();
      
      nav.registerToolInContext('search', 'blog');
      nav.registerToolInContext('search', 'dashboard');
      
      // Should return the last registered context (Map behavior)
      expect(nav.getToolContext('search')).toBe('dashboard');
    });
  });

  describe('Singleton Pattern', () => {
    it('should return the same instance', () => {
      const nav1 = NavigationGraph.getInstance();
      const nav2 = NavigationGraph.getInstance();

      expect(nav1).toBe(nav2);
    });

    it('should maintain state across getInstance calls', () => {
      const nav1 = NavigationGraph.getInstance();
      nav1.setCurrentContext('test-context');

      const nav2 = NavigationGraph.getInstance();
      expect(nav2.getCurrentContext()).toBe('test-context');
    });
  });

  describe('LocationContext Integration', () => {
    it('setCurrentContext updates LocationContext', () => {
      const graph = NavigationGraph.getInstance();
      graph.setCurrentContext('blog');

      expect(LocationContext.getCurrent()?.page).toBe('blog');
    });

    it('getCurrentContext reads from LocationContext', () => {
      LocationContext.setCurrent({ page: '/dashboard', route: '/dashboard' });

      const graph = NavigationGraph.getInstance();
      expect(graph.getCurrentContext()).toBe('/dashboard');
    });

    it('onContextChange fires when LocationContext changes', () => {
      const graph = NavigationGraph.getInstance();

      // Manually trigger setupLocationSync since reset() cleared listeners
      (graph as any).locationUnsubscribe = null;
      (graph as any).setupLocationSync();

      const callback = jest.fn();
      graph.onContextChange(callback);
      LocationContext.setCurrent({ page: '/settings', route: '/settings' });

      expect(callback).toHaveBeenCalledWith('/settings');
    });
  });
});
