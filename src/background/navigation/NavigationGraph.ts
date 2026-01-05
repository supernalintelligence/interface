/**
 * NavigationGraph - Enterprise Feature Stub
 * 
 * This is a stub implementation for the open source edition.
 * Full runtime navigation tracking available in @supernal/interface-enterprise.
 * 
 * Visit https://supernal.ai/enterprise for more information.
 */

import { INavigationGraph, NavigationNode, RouteInfo, ContextData } from './INavigationGraph';

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
  
  private warnOnce() {
    if (!this.warned && typeof console !== 'undefined') {
      console.warn(
        '⚠️  NavigationGraph is an enterprise feature. ' +
        'Full runtime tracking available at https://supernal.ai/enterprise'
      );
      this.warned = true;
    }
  }
  
  static getInstance(): NavigationGraph {
    // Check global singleton first (browser environment)
    // If enterprise version already created a singleton, use that!
    if (typeof window !== 'undefined') {
      if (!window[GLOBAL_SINGLETON_KEY]) {
        window[GLOBAL_SINGLETON_KEY] = new NavigationGraph();
        console.log('🌍 [NavigationGraph] Created GLOBAL singleton instance (open-source stub)');
      }
      return window[GLOBAL_SINGLETON_KEY] as NavigationGraph;
    }
    
    // Fallback to module-level singleton (Node.js/SSR environment)
    if (!this.instance) {
      this.instance = new NavigationGraph();
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
    this.warnOnce();
  }
  
  getRouteByName(name: string): RouteInfo | undefined {
    this.warnOnce();
    return undefined;
  }
  
  setCurrentContext(contextId: string | RouteInfo): void {
    this.warnOnce();
  }
  
  setNavigationHandler(handler: (path: string | RouteInfo) => void | Promise<void>): void {
    this.warnOnce();
  }
  
  getNavigationHandler(): ((pageName: string) => void | Promise<void>) | null {
    this.warnOnce();
    return null;
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
    this.warnOnce();
    return 'global';
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
    this.warnOnce();
    return null;
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
