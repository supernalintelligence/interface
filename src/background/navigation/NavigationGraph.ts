/**
 * NavigationGraph - Enterprise Feature Stub
 *
 * This is a stub implementation for the open source edition.
 * Full runtime navigation tracking available in @supernal/interface-enterprise.
 *
 * Context tracking is unified with LocationContext - NavigationGraph delegates
 * to LocationContext for the single source of truth about current location.
 *
 * Visit https://supernal.ai/enterprise for more information.
 */

import { INavigationGraph, NavigationNode, RouteInfo, ContextData } from './INavigationGraph';

// Type import to avoid circular deps at load time
import type { AppLocation } from '../location/LocationContext';

// Lazy getter for LocationContext to avoid circular dependency at module load
function getLocationContext() {
  return require('../location/LocationContext').LocationContext;
}

// Global singleton key to ensure cross-package singleton behavior
const GLOBAL_SINGLETON_KEY = '__SUPERNAL_NAVIGATION_GRAPH__';

// Extend Window interface for TypeScript
declare global {
  interface Window {
    [GLOBAL_SINGLETON_KEY]?: INavigationGraph;
  }
}

export { NavigationNode, RouteInfo, ContextData } from './INavigationGraph';

export class NavigationGraph implements INavigationGraph {
  private static instance: NavigationGraph | null = null;
  private warned = false;

  // Basic context tracking for location-aware tools
  private currentContext: string | undefined;
  private contextTools: Map<string, string> = new Map(); // toolId -> contextId
  private navigationHandler: ((path: string | RouteInfo) => void | Promise<void>) | null = null;

  // Context change listeners
  private contextListeners = new Set<(ctx: string) => void>();
  private locationUnsubscribe: (() => void) | null = null;

  private warnOnce() {
    if (!this.warned && typeof console !== 'undefined') {
      console.warn(
        '⚠️  Advanced NavigationGraph features are enterprise-only. ' +
        'Full runtime tracking available at https://supernal.ai/enterprise'
      );
      this.warned = true;
    }
  }

  /**
   * Set up synchronization with LocationContext
   * This ensures NavigationGraph stays in sync when LocationContext changes
   */
  private setupLocationSync(): void {
    if (this.locationUnsubscribe) return; // Already set up

    try {
      const LocationContext = getLocationContext();
      this.locationUnsubscribe = LocationContext.onLocationChange(
        (old: AppLocation | null, newLoc: AppLocation) => {
          const ctx = newLoc.page || 'global';
          this.currentContext = ctx; // Keep in sync
          this.contextListeners.forEach(fn => {
            try {
              fn(ctx);
            } catch (e) {
              console.error('[NavigationGraph] Context listener error:', e);
            }
          });
        }
      );
    } catch (e) {
      // LocationContext may not be available in all environments
      console.warn('[NavigationGraph] Could not set up LocationContext sync:', e);
    }
  }

  static getInstance(): NavigationGraph {
    // Check global singleton first (browser environment)
    // If enterprise version already created a singleton, use that!
    if (typeof window !== 'undefined') {
      if (!window[GLOBAL_SINGLETON_KEY]) {
        const instance = new NavigationGraph();
        window[GLOBAL_SINGLETON_KEY] = instance;
        instance.setupLocationSync();
        console.log('🌍 [NavigationGraph] Created GLOBAL singleton instance (open-source stub)');
      }
      return window[GLOBAL_SINGLETON_KEY] as NavigationGraph;
    }

    // Fallback to module-level singleton (Node.js/SSR environment)
    if (!this.instance) {
      this.instance = new NavigationGraph();
      this.instance.setupLocationSync();
    }
    return this.instance;
  }
  
  // Stub methods - no-op implementations
  trackComponent(id: string, parent?: string): void {
    this.warnOnce();
  }
  
  getTree(): NavigationNode[] {
    this.warnOnce();
    return [];
  }
  
  trackNavigation(from: string, to: string): void {
    this.warnOnce();
  }
  
  reset(): void {
    this.warnOnce();
  }
  
  // Accept object or string for registerContext
  registerContext(idOrData: string | ContextData, data?: unknown): void {
    this.warnOnce();
  }
  
  // Accept multiple types for registerEdge - very flexible signature
  registerEdge(from: string | RouteInfo, to?: string | RouteInfo, metadata?: unknown): void {
    this.warnOnce();
  }
  
  getContext(id: string): ContextData {
    this.warnOnce();
    return { id, tools: [] };
  }
  
  registerToolInContext(toolId: string, contextId?: string, extra?: unknown): void {
    // Basic implementation: store tool-to-context mapping
    if (contextId) {
      this.contextTools.set(toolId, contextId);
    }
  }
  
  getRouteByName(name: string): RouteInfo | undefined {
    this.warnOnce();
    return undefined;
  }
  
  setCurrentContext(contextId: string | RouteInfo): void {
    // Extract context ID from string or RouteInfo
    let id: string;
    if (typeof contextId === 'string') {
      id = contextId;
    } else if (contextId && typeof contextId === 'object' && 'path' in contextId && contextId.path) {
      id = contextId.path;
    } else {
      id = 'global';
    }

    // Update LocationContext (single source of truth)
    try {
      const LocationContext = getLocationContext();
      LocationContext.setCurrent({
        page: id,
        route: id,
      });
    } catch (e) {
      // LocationContext may not be available in all environments
    }

    // Keep local state for backward compat (redundant but safe)
    this.currentContext = id;

    // Notify listeners
    this.contextListeners.forEach(fn => {
      try {
        fn(id);
      } catch (e) {
        console.error('[NavigationGraph] Context listener error:', e);
      }
    });
  }

  /**
   * Subscribe to context changes
   * @param fn Callback invoked when context changes
   * @returns Unsubscribe function
   */
  onContextChange(fn: (ctx: string) => void): () => void {
    this.contextListeners.add(fn);
    return () => this.contextListeners.delete(fn);
  }
  
  setNavigationHandler(handler: (path: string | RouteInfo) => void | Promise<void>): void {
    this.navigationHandler = handler;
  }
  
  getNavigationHandler(): ((pageName: string) => void | Promise<void>) | null {
    return this.navigationHandler;
  }
  
  /**
   * Navigate to a path using the registered navigation handler
   * This is the method tools should call to trigger navigation
   */
  navigate(path: string | RouteInfo): void {
    if (this.navigationHandler) {
      const result = this.navigationHandler(path);
      // Handle async handlers
      if (result && typeof result.then === 'function') {
        result.catch((error: any) => {
          console.error('[NavigationGraph] Navigation failed:', error);
        });
      }
    } else {
      console.warn('[NavigationGraph] No navigation handler registered. Call setNavigationHandler() first.');
    }
  }
  
  async navigateToContext(contextId: string): Promise<boolean> {
    this.warnOnce();
    return false;
  }
  
  getRouteForContext(contextId: string): string | undefined {
    this.warnOnce();
    return undefined;
  }
  
  getAllRoutes(): Record<string, string> {
    this.warnOnce();
    return {};
  }
  
  getCurrentContext(): string {
    // Read from LocationContext as authoritative source
    try {
      const LocationContext = getLocationContext();
      const location = LocationContext.getCurrent();
      if (location?.page) {
        return location.page;
      }
    } catch (e) {
      // LocationContext may not be available in all environments
    }

    // Fallback to local state or 'global' as default
    return this.currentContext !== undefined ? this.currentContext : 'global';
  }

  /**
   * Get current route (stub implementation - returns same as context)
   * Enterprise version will return the actual route path
   */
  getCurrentRoute(): string | undefined {
    return this.getCurrentContext();
  }
  
  getAllContexts(): any[] {
    this.warnOnce();
    return [];
  }
  
  getAllEdges(): any[] {
    this.warnOnce();
    return [];
  }
  
  getToolContext(toolId: string): string | null {
    // Return the context for a tool, or null if not registered (matches interface)
    return this.contextTools.get(toolId) || null;
  }
  
  clear(): void {
    this.warnOnce();
  }
  
  clearPathCache(): void {
    this.warnOnce();
  }
  
  toMermaid(): string {
    this.warnOnce();
    return '';
  }
  
  toJSON(): any {
    this.warnOnce();
    return { nodes: [], edges: [] };
  }
}
