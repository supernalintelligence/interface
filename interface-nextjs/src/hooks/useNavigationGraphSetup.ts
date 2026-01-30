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
 * Compatible with both Next.js App Router and Pages Router.
 */

import { useEffect, useState, useCallback } from 'react';

// Try to import App Router hooks
let useAppRouter: (() => { push: (path: string) => void; back: () => void; forward: () => void; refresh: () => void }) | undefined;
let usePathname: (() => string) | undefined;

try {
  const navigation = require('next/navigation');
  useAppRouter = navigation.useRouter;
  usePathname = navigation.usePathname;
} catch {
  // App Router not available
}

/**
 * Hook to auto-setup NavigationGraph with Next.js router
 *
 * This eliminates boilerplate by automatically:
 * 1. Creating a navigation handler from Next.js router
 * 2. Setting it on NavigationGraph
 * 3. Updating context when routes change
 *
 * Called automatically by SupernalProvider.
 *
 * Works with both App Router (next/navigation) and Pages Router (next/router).
 */
export function useNavigationGraphSetup() {
  const [isInitialized, setIsInitialized] = useState(false);

  // Try to use App Router hooks
  let router: { push: (path: string) => void; back: () => void; forward: () => void; refresh: () => void } | null = null;
  let pathname: string | null = null;

  try {
    if (useAppRouter) {
      router = useAppRouter();
    }
    if (usePathname) {
      pathname = usePathname();
    }
  } catch {
    // Hooks not available in this context
  }

  // Create navigation handler that works with any router
  const navigate = useCallback((path: string) => {
    // Normalize path: ensure it starts with / to make it absolute
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;

    if (router?.push) {
      router.push(normalizedPath);
    } else if (typeof window !== 'undefined') {
      // Fallback to browser navigation
      window.location.href = normalizedPath;
    }
  }, [router]);

  // Get current path
  const currentPath = pathname ?? (typeof window !== 'undefined' ? window.location.pathname + window.location.search : '/');

  // Setup navigation handler on mount
  useEffect(() => {
    // Dynamically import NavigationGraph to avoid SSR issues
    import('@supernal/interface/browser').then(({ NavigationGraph }) => {
      const graph = NavigationGraph.getInstance();

      // Set the navigation handler
      graph.setNavigationHandler(navigate);

      // Set router for browser tools (back/forward/refresh)
      const browserRouter = {
        push: navigate,
        back: () => router?.back?.() ?? window.history.back(),
        forward: () => router?.forward?.() ?? window.history.forward(),
        refresh: () => router?.refresh?.() ?? window.location.reload(),
      };
      graph.setRouter(browserRouter);

      // Set initial context
      graph.setCurrentContext(currentPath);

      setIsInitialized(true);

      console.log('[NavigationGraphSetup] Auto-configured with Next.js router');
    });
  }, [navigate, currentPath]);

  // Update context on route changes (only after initialization)
  useEffect(() => {
    if (!isInitialized) return;

    import('@supernal/interface/browser').then(({ NavigationGraph }) => {
      const graph = NavigationGraph.getInstance();
      graph.setCurrentContext(currentPath);

      console.log(`[NavigationGraphSetup] Context updated: ${currentPath}`);
    });
  }, [currentPath, isInitialized]);
}
