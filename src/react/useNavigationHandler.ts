/**
 * useNavigationHandler - React Hook for Automatic Navigation Setup
 * 
 * Single-line hook that sets up navigation for any page.
 * Uses NavigationGraph to automatically resolve routes from container definitions.
 * 
 * This eliminates the need for manual route maps in every page component.
 */

import { useEffect } from 'react';
import { NavigationGraph } from '../background/navigation/NavigationGraph';

/**
 * Set up automatic navigation handler for the current page
 * 
 * This hook:
 * 1. Gets routes from NavigationGraph (populated by container definitions)
 * 2. Creates a handler that resolves page names → routes
 * 3. Registers the handler with NavigationGraph
 * 4. Supports dynamic routes (e.g., "blog/post-slug")
 * 
 * @param router - Next.js router or any router with a `push` method
 * 
 * @example
 * ```typescript
 * import { useRouter } from 'next/router';
 * import { useNavigationHandler } from '@supernal-interface/core/react';
 * 
 * export default function MyPage() {
 *   const router = useRouter();
 *   useNavigationHandler(router); // ← ONE LINE!
 *   
 *   return <div>...</div>;
 * }
 * ```
 * 
 * @example
 * ```typescript
 * // Without a router (uses window.location as fallback)
 * useNavigationHandler();
 * ```
 */
export function useNavigationHandler(
  router?: { push: (route: string) => any }
): void {
  useEffect(() => {
    const graph = NavigationGraph.getInstance();
    
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
    };
    
    graph.setNavigationHandler(handler);
    
    return () => {
      // Clean up handler on unmount
      graph.setNavigationHandler(() => {});
    };
  }, [router]);
}

