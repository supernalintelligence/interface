/**
 * LocationContext - Core SDK location tracking
 * 
 * This is the foundation of location-aware tools. It tracks where the user
 * currently is in the application (page, route, components, etc.) and allows
 * tools to declare which locations they're available in.
 * 
 * ALL consumers (MCP, CopilotKit, Tests, etc.) use this to filter tools.
 */

/**
 * Complete application location state
 */
export interface AppLocation {
  /** Current page path (e.g., '/blog', '/dashboard') */
  page: string;
  
  /** Route pattern (e.g., '/blog/[slug]', '/examples') */
  route?: string;
  
  /** Currently mounted component IDs */
  components?: string[];
  
  /** Visible element IDs (CSS selectors or data-testid values) */
  elements?: string[];
  
  /** App-specific metadata */
  metadata?: Record<string, any>;
}

/**
 * Tool location scope definition
 */
export interface LocationScope {
  /** Tool is available everywhere */
  global?: boolean;
  
  /** Required page(s) - tool only available on these pages */
  pages?: string[];
  
  /** Required route pattern(s) */
  routes?: string[];
  
  /** Required component(s) - tool only available when these are mounted */
  components?: string[];
  
  /** Required element(s) - tool only available when these are visible */
  elements?: string[];
  
  /** Custom matcher function */
  custom?: (location: AppLocation) => boolean;
}

/**
 * Location change listener
 */
export type LocationChangeListener = (
  oldLocation: AppLocation | null,
  newLocation: AppLocation
) => void;

/**
 * Unsubscribe function
 */
export type UnsubscribeFn = () => void;

/**
 * LocationContext - Global singleton for application location tracking
 * 
 * This is SDK core functionality. All location-aware features use this.
 */
export class LocationContext {
  private static current: AppLocation | null = null;
  private static listeners: Set<LocationChangeListener> = new Set();
  
  /**
   * Set the current application location
   * 
   * Apps should call this on route changes:
   * 
   * ```typescript
   * // In Next.js app
   * useEffect(() => {
   *   LocationContext.setCurrent({
   *     page: router.pathname,
   *     route: router.route,
   *     components: ['blog-header', 'blog-content']
   *   });
   * }, [router.pathname]);
   * ```
   */
  static setCurrent(location: AppLocation): void {
    const old = this.current;
    this.current = location;
    
    // Notify all listeners
    this.notifyListeners(old, location);
  }
  
  /**
   * Get the current application location
   * 
   * Returns null if no location has been set yet.
   */
  static getCurrent(): AppLocation | null {
    return this.current;
  }
  
  /**
   * Subscribe to location changes
   * 
   * Returns an unsubscribe function.
   * 
   * ```typescript
   * const unsub = LocationContext.onLocationChange((old, newLoc) => {
   *   console.log('Moved from', old, 'to', newLoc);
   * });
   * 
   * // Later: cleanup
   * unsub();
   * ```
   */
  static onLocationChange(listener: LocationChangeListener): UnsubscribeFn {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
  
  /**
   * Check if a location scope matches the current location
   * 
   * @param scope - Location scope to check
   * @param location - Location to check against (defaults to current)
   * @returns true if scope matches location
   * 
   * ```typescript
   * const scope = { pages: ['/blog', '/posts'] };
   * const matches = LocationContext.matchesScope(scope);
   * ```
   */
  static matchesScope(
    scope: LocationScope,
    location: AppLocation | null = this.current
  ): boolean {
    // Global tools always match
    if (scope.global) {
      return true;
    }
    
    // If scope has no constraints, treat as global
    const hasConstraints = scope.pages || scope.routes || scope.components || 
                          scope.elements || scope.custom;
    if (!hasConstraints) {
      return true;
    }
    
    // No location set yet - only global/unconstrained tools match
    if (!location) {
      return false;
    }
    
    // Check pages
    if (scope.pages && scope.pages.length > 0) {
      if (!scope.pages.includes(location.page)) {
        return false;
      }
    }
    
    // Check routes
    if (scope.routes && scope.routes.length > 0) {
      if (!location.route || !scope.routes.includes(location.route)) {
        return false;
      }
    }
    
    // Check components (all required components must be present)
    if (scope.components && scope.components.length > 0) {
      if (!location.components) {
        return false;
      }
      for (const required of scope.components) {
        if (!location.components.includes(required)) {
          return false;
        }
      }
    }
    
    // Check elements (all required elements must be present)
    if (scope.elements && scope.elements.length > 0) {
      if (!location.elements) {
        return false;
      }
      for (const required of scope.elements) {
        if (!location.elements.includes(required)) {
          return false;
        }
      }
    }
    
    // Custom matcher
    if (scope.custom) {
      return scope.custom(location);
    }
    
    // If no constraints specified, tool is available everywhere
    return true;
  }
  
  /**
   * Reset location context (useful for tests)
   */
  static reset(): void {
    this.current = null;
    this.listeners.clear();
  }
  
  /**
   * Notify all listeners of location change
   */
  private static notifyListeners(
    old: AppLocation | null,
    newLocation: AppLocation
  ): void {
    this.listeners.forEach(listener => {
      try {
        listener(old, newLocation);
      } catch (error) {
        console.error('[LocationContext] Listener error:', error);
      }
    });
  }
}
