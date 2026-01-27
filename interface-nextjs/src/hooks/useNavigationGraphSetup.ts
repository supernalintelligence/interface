'use client';

/**
 * NavigationGraph Auto-Setup Hook
 *
 * Automatically configures NavigationGraph to work with Next.js router:
 * - Sets up navigation handler
 * - Updates current context on route changes
 * - Handles initialization state
 *
 * Called automatically by SupernalProvider - no manual setup needed!
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

/**
 * Hook to auto-setup NavigationGraph with Next.js router
 *
 * This eliminates boilerplate by automatically:
 * 1. Creating a navigation handler from Next.js router
 * 2. Setting it on NavigationGraph
 * 3. Updating context when routes change
 *
 * Called automatically by SupernalProvider.
 */
export function useNavigationGraphSetup() {
  const router = useRouter();
  const [isInitialized, setIsInitialized] = useState(false);

  // Setup navigation handler on mount
  useEffect(() => {
    // Dynamically import NavigationGraph to avoid SSR issues
    import('@supernal/interface/browser').then(({ NavigationGraph }) => {
      const graph = NavigationGraph.getInstance();

      // Create navigation handler from Next.js router
      const handler = {
        navigate: (path: string) => {
          router.push(path);
        },
        back: () => {
          router.back();
        },
        forward: () => {
          router.forward();
        },
        refresh: () => {
          router.reload();
        },
      };

      // Set the handler
      graph.setNavigationHandler(handler);

      // Set initial context
      graph.setCurrentContext(router.asPath);

      setIsInitialized(true);

      console.log('[NavigationGraphSetup] Auto-configured with Next.js router');
    });
  }, [router]);

  // Update context on route changes (only after initialization)
  useEffect(() => {
    if (!isInitialized) return;

    import('@supernal/interface/browser').then(({ NavigationGraph }) => {
      const graph = NavigationGraph.getInstance();
      graph.setCurrentContext(router.asPath);

      console.log(`[NavigationGraphSetup] Context updated: ${router.asPath}`);
    });
  }, [router.asPath, isInitialized]);
}
