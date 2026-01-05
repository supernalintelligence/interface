/**
 * NavigationGraph - Enterprise Feature Stub
 * 
 * This is a stub implementation for the open source edition.
 * Full runtime navigation tracking available in @supernal/interface-enterprise.
 * 
 * Visit https://supernal.ai/enterprise for more information.
 */

export interface NavigationNode {
  id: string;
  type: string;
  children?: NavigationNode[];
}

export interface RouteInfo {
  path?: string;
  name?: string;
  from?: string;
  to?: string;
  navigationTool?: string;
  cost?: number;
  metadata?: unknown;
}

export interface ContextData {
  id: string;
  name?: string;
  parent?: string;
  children?: unknown[];
  tools?: string[];
  metadata?: unknown;
}

export class NavigationGraph {
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
  
  setNavigationHandler(handler: (path: string | RouteInfo) => void): void {
    this.warnOnce();
  }
}
