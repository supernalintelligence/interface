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
 *
 * Uses browser APIs directly to ensure compatibility with both
 * App Router and Pages Router, and to avoid SSR/SSG issues.
 */

import { useEffect, useState, useCallback } from 'react';

/**
 * Hook to auto-setup NavigationGraph with Next.js router
 *
 * This eliminates boilerplate by automatically:
 * 1. Creating a navigation handler
 * 2. Setting it on NavigationGraph
 * 3. Updating context when routes change
 *
 * Called automatically by SupernalProvider.
 *
 * Uses browser navigation APIs for maximum compatibility.
 */
export function useNavigationGraphSetup() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentPath, setCurrentPath] = useState('/');

  // Initialize on client mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Set current path
    setCurrentPath(window.location.pathname + window.location.search);

    // Listen for route changes
    const handleRouteChange = () => {
      setCurrentPath(window.location.pathname + window.location.search);
    };

    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, []);

  // Create navigation handler using browser APIs
  const navigate = useCallback((path: string) => {
    if (typeof window === 'undefined') return;
    
    // Normalize path: ensure it starts with / to make it absolute
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    window.location.href = normalizedPath;
  }, []);

  // Setup navigation handler on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Dynamically import NavigationGraph to avoid SSR issues
    import('@supernal/interface/browser').then(({ NavigationGraph }) => {
      const graph = NavigationGraph.getInstance();

      // Set the navigation handler
      graph.setNavigationHandler(navigate);

      // Set router for browser tools (back/forward/refresh)
      const browserRouter = {
        push: navigate,
        back: () => window.history.back(),
        forward: () => window.history.forward(),
        refresh: () => window.location.reload(),
      };
      graph.setRouter(browserRouter);

      // Set initial context
      graph.setCurrentContext(currentPath);

      setIsInitialized(true);

      console.log('[NavigationGraphSetup] Auto-configured with browser APIs');
    }).catch(err => {
      console.warn('[NavigationGraphSetup] Failed to setup:', err);
    });
  }, [navigate, currentPath]);

  // Update context on route changes (only after initialization)
  useEffect(() => {
    if (!isInitialized || typeof window === 'undefined') return;

    import('@supernal/interface/browser').then(({ NavigationGraph }) => {
      const graph = NavigationGraph.getInstance();
      graph.setCurrentContext(currentPath);

      console.log(`[NavigationGraphSetup] Context updated: ${currentPath}`);
    });
  }, [currentPath, isInitialized]);
}
