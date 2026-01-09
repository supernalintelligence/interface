/**
 * useNavigationHandler - React Hook for Automatic Navigation Setup
 * 
 * Single-line hook that sets up navigation for any page.
 * Now also tracks location in LocationContext for location-aware tools.
 * 
 * This hook:
 * 1. Tracks current page/route in LocationContext
 * 2. Sets up navigation handler in NavigationGraph
 * 3. Updates location when route changes
 */

import { useEffect } from 'react';
import { NavigationGraph } from '../background/navigation/NavigationGraph';
import { LocationContext } from '../background/location/LocationContext';

/**
 * Set up automatic navigation handler for the current page
 * 
 * This hook:
 * 1. Tracks current page/route in LocationContext for location-aware tools
 * 2. Gets routes from NavigationGraph (populated by container definitions)
 * 3. Creates a handler that resolves page names → routes
 * 4. Registers the handler with NavigationGraph
 * 5. Supports dynamic routes (e.g., "blog/post-slug")
 * 
 * @param router - Next.js router or any router with `push`, `pathname`, `route`
 * @param options - Optional configuration
 * @param options.components - Currently mounted component IDs
 * @param options.elements - Currently visible element IDs
 * @param options.metadata - Additional location metadata
 * 
 * @example
 * ```typescript
 * import { useRouter } from 'next/router';
 * import { useNavigationHandler } from '@supernal-interface/core/react';
 * 
 * export default function MyPage() {
 *   const router = useRouter();
 *   // Track location automatically
 *   useNavigationHandler(router);
 *   
 *   return <div>...</div>;
 * }
 * ```
 * 
 * @example
 * ```typescript
 * // With component tracking
 * useNavigationHandler(router, {
 *   components: ['blog-header', 'blog-editor'],
 *   metadata: { userRole: 'editor' }
 * });
 * ```
 */
export function useNavigationHandler(
  router?: { 
    push: (route: string) => any;
    pathname?: string;
    route?: string;
  },
  options?: {
    components?: string[];
    elements?: string[];
    metadata?: Record<string, any>;
  }
): void {
  useEffect(() => {
    const graph = NavigationGraph.getInstance();
    
    // Update LocationContext with current page/route
    if (router) {
      const page = router.pathname || '/';
      const route = router.route || router.pathname || '/';
      
      LocationContext.setCurrent({
        page,
        route,
        components: options?.components,
        elements: options?.elements,
        metadata: options?.metadata
      });
    }
    
    const handler = (pageNameOrRoute: string | any) => {
      const pageName = typeof pageNameOrRoute === 'string' ? pageNameOrRoute : pageNameOrRoute?.name || pageNameOrRoute?.path;
      if (!pageName) return;
      
      console.log(`🗺️  [Navigation] Request: ${pageName}`);
      
      // Use NavigationGraph to resolve route
      let route = graph.getRouteByName(pageName);
      
      if (!route) {
        console.warn(`⚠️  [Navigation] No exact route found for: ${pageName}`);
        
        // Try treating as a path (e.g., "blog/type-safe" → "/blog/type-safe")
        if (pageName.includes('/')) {
          const routePath = pageName.startsWith('/') ? pageName : `/${pageName}`;
          console.log(`🗺️  [Navigation] Attempting dynamic path: ${routePath}`);
          
          // Navigate using provided router or fallback to window.location
          if (router?.push) {
            router.push(routePath);
          } else if (typeof window !== 'undefined') {
            window.location.href = routePath;
          }
          
          // Update location after navigation
          LocationContext.setCurrent({
            page: routePath,
            route: routePath,
            components: options?.components,
            elements: options?.elements,
            metadata: options?.metadata
          });
        }
        return;
      }
      
      // Extract path from RouteInfo
      const routePath = route.path || route.name || pageName;
      console.log(`🗺️  [Navigation] Resolved: ${pageName} → ${routePath}`);
      
      // Navigate using provided router or fallback to window.location
      if (router?.push) {
        router.push(routePath);
      } else if (typeof window !== 'undefined') {
        window.location.href = routePath;
      }
      
      // Update location after navigation
      LocationContext.setCurrent({
        page: routePath,
        route: routePath,
        components: options?.components,
        elements: options?.elements,
        metadata: options?.metadata
      });
    };
    
    graph.setNavigationHandler(handler);
    
    return () => {
      // Clean up handler on unmount
      graph.setNavigationHandler(() => {});
    };
  }, [router, options?.components, options?.elements, options?.metadata]);
}

