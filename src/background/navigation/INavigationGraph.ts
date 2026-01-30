/**
 * INavigationGraph - Shared interface between open-source and enterprise
 * 
 * This ensures both implementations have compatible signatures for the global singleton.
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

/**
 * Shared interface that both stub and full implementation must satisfy
 */
export interface INavigationGraph {
  // Navigation handler
  setNavigationHandler(handler: (path: string | RouteInfo) => void | Promise<void>): void;
  getNavigationHandler?(): ((pageName: string) => void | Promise<void>) | null;
  
  // Context management
  registerContext(idOrData: string | ContextData | any, data?: unknown): void;
  getContext(id: string): ContextData | any;
  setCurrentContext(contextId: string | RouteInfo): void;
  getCurrentContext?(): string;
  getAllContexts?(): any[];
  
  // Edge/Route management
  registerEdge(from: string | RouteInfo | any, to?: string | RouteInfo, metadata?: unknown): void;
  getRouteByName(name: string): RouteInfo | string | undefined;
  getRouteForContext?(contextId: string): string | undefined;
  getAllRoutes?(): Record<string, string>;
  getAllEdges?(): any[];
  
  // Tool management
  registerToolInContext(toolId: string, contextId?: string, extra?: unknown): void;
  getToolContext?(toolId: string): string | null;
  
  // Navigation
  navigate?(path: string | RouteInfo): void;
  navigateToContext?(contextId: string): Promise<boolean>;

  // Browser router (back/forward/refresh)
  setRouter?(router: { push?: (path: string) => void; back?: () => void; forward?: () => void; refresh?: () => void }): void;
  getRouter?(): { push?: (path: string) => void; back?: () => void; forward?: () => void; refresh?: () => void } | null;
  back?(): void;
  forward?(): void;
  refresh?(): void;
  
  // Tree tracking (open-source stubs only)
  trackComponent?(id: string, parent?: string): void;
  getTree?(): NavigationNode[];
  trackNavigation?(from: string, to: string): void;
  
  // Utility
  reset?(): void;
  clear?(): void;
  clearPathCache?(): void;
  
  // Export
  toMermaid?(): string;
  toJSON?(): any;
}

