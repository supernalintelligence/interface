/**
 * Navigation Graph Types (REQ-005)
 * 
 * Production-quality types for context-aware tool discovery and navigation.
 */

/**
 * Represents a context in the application (page, modal, tab, etc)
 */
export interface NavigationContext {
  /** Unique context identifier (e.g., 'dashboard', 'settings', 'settings.profile') */
  id: string;
  
  /** Display name */
  name: string;
  
  /** Parent context (if nested) */
  parent?: string;
  
  /** Child contexts */
  children: string[];
  
  /** Tools available in this context */
  tools: string[];
  
  /** How to navigate TO this context from parent */
  enterAction?: {
    /** Tool to execute (e.g., 'nav-settings-button') */
    toolId: string;
    
    /** Parameters for the tool (if any) */
    parameters?: Record<string, any>;
  };
  
  /** Optional metadata */
  metadata?: {
    path?: string;
    url?: string;
    component?: string;
    [key: string]: any;
  };
}

/**
 * Edge in the navigation graph
 */
export interface NavigationEdge {
  /** Source context */
  from: string;
  
  /** Target context */
  to: string;
  
  /** Tool that performs the navigation */
  navigationTool: string;
  
  /** Optional parameters */
  parameters?: Record<string, any>;
  
  /** Estimated cost/weight (for pathfinding) */
  cost?: number;
}

/**
 * Navigation path from A to B
 */
export interface NavigationPath {
  /** Starting context */
  from: string;
  
  /** Ending context */
  to: string;
  
  /** Ordered list of steps */
  steps: NavigationEdge[];
  
  /** Total cost */
  totalCost: number;
  
  /** Estimated time (ms) */
  estimatedTime: number;
}

/**
 * Options for computing navigation paths
 */
export interface PathComputeOptions {
  /** Maximum path length (default: 10) */
  maxDepth?: number;
  
  /** Prefer shorter paths vs. faster paths (default: true) */
  preferShorterPaths?: boolean;
  
  /** Avoid certain contexts */
  avoidContexts?: string[];
}

/**
 * Context detection strategy
 */
export type ContextDetectionStrategy = 
  | 'convention' // File path based
  | 'react-tree' // React component tree
  | 'dom-observation' // DOM mutation observation
  | 'manual'; // Explicit configuration

/**
 * Context detection metadata
 */
export interface ContextDetection {
  /** Which strategy was used */
  strategy: ContextDetectionStrategy;
  
  /** Detected context ID */
  contextId: string;
  
  /** Confidence level (0-1) */
  confidence: number;
  
  /** Additional metadata */
  metadata?: {
    filePath?: string;
    componentName?: string;
    domPath?: string;
    [key: string]: any;
  };
}


