// Generated from: 2025-12-27-implementation.md
// Generated on: 2025-12-28
// DO NOT EDIT - Regenerate from documentation if changes needed

/**
 * Abstract interface for route scanners
 * 
 * Each routing system (Next.js, React Router, etc.) implements this interface
 * to provide route discovery for that system.
 */

import { RouteContractsConfig } from '../RouteContractsConfig';

export interface RouteInfo {
  /** Unique route identifier (e.g., 'overview', 'requirements') */
  id: string;
  
  /** Route pattern (e.g., '/:repo/:branch/:view') */
  pattern: string;
  
  /** Parameter names in order (e.g., ['repo', 'branch', 'view']) */
  params: string[];
  
  /** Optional metadata */
  metadata?: {
    /** Category for grouping (e.g., 'view', 'api', 'admin') */
    category?: string;
    
    /** Description for JSDoc */
    description?: string;
    
    /** Example usage */
    example?: string;
    
    /** Default parameter values */
    defaults?: Record<string, any>;
    
    /** Source file where route was found */
    source?: string;
    
    /** HTTP methods supported by this route (GET, POST, etc.) */
    methods?: string[];
    
    /** Source file path (for API routes) */
    sourceFile?: string;
  };
}

export interface RouteScanResult {
  /** All discovered routes */
  routes: RouteInfo[];
  
  /** Route categories (optional, for organization) */
  categories?: Record<string, RouteInfo[]>;
  
  /** Metadata about the scan */
  metadata: {
    /** When the scan was performed */
    timestamp: string;
    
    /** What was scanned */
    scannedPaths: string[];
    
    /** Routing system detected */
    routingSystem: string;
  };
}

export abstract class RouteScanner {
  constructor(protected config: RouteContractsConfig) {}

  /**
   * Scan the routing system and discover all routes
   */
  abstract scan(): Promise<RouteScanResult>;

  /**
   * Validate that discovered routes are valid
   */
  abstract validate(routes: RouteInfo[]): Promise<boolean>;

  /**
   * Get scanner name for logging
   */
  abstract getName(): string;
}