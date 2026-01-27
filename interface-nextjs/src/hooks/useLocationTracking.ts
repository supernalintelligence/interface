'use client';

/**
 * Location Tracking Hook - Auto-populates LocationContext with visible elements
 *
 * Zero-config tool scoping: Automatically tracks:
 * - Current page/route
 * - Visible DOM elements (by data-testid)
 * - Navigation context
 *
 * CRITICAL: This must be called in SupernalProvider to enable tool scoping!
 */

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { LocationContext } from '@supernal/interface/browser';

/**
 * Scan the DOM for visible elements with data-testid attributes
 * and return their IDs for LocationContext tracking
 */
function getVisibleElements(): string[] {
  if (typeof document === 'undefined') return [];

  const elements = document.querySelectorAll('[data-testid]');
  return Array.from(elements).map(el => el.getAttribute('data-testid')).filter(Boolean) as string[];
}

/**
 * Hook to track current location and visible elements
 *
 * This enables zero-config tool scoping - tools with elementId
 * are automatically scoped based on DOM element visibility.
 *
 * Called automatically by SupernalProvider - no need for manual setup.
 */
export function useLocationTracking() {
  const router = useRouter();

  useEffect(() => {
    const updateLocation = () => {
      // Scan DOM for visible elements
      const visibleElements = getVisibleElements();

      LocationContext.setCurrent({
        page: router.pathname,
        route: router.route,
        elements: visibleElements,
        metadata: {
          query: router.query,
          asPath: router.asPath,
        },
      });

      console.log(`[LocationTracking] Updated location: ${router.pathname}`);
      console.log(`[LocationTracking] Visible elements (${visibleElements.length}):`, visibleElements.slice(0, 10));
    };

    // Set initial location after a brief delay to ensure DOM is ready
    const initialTimer = setTimeout(updateLocation, 100);

    // Periodically re-scan for elements (handles dynamic content)
    const intervalId = setInterval(updateLocation, 1000);

    // Subscribe to route changes
    const handleRouteChange = () => {
      // Delay to ensure new page DOM is rendered
      setTimeout(updateLocation, 100);
    };

    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(intervalId);
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.pathname, router.route, router.asPath]);
}
