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
 *
 * Compatible with both Next.js App Router and Pages Router.
 * Uses browser APIs to avoid SSR/SSG issues with Next.js hooks.
 */

import { useEffect, useRef } from 'react';
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
 * Compare two arrays for equality
 */
function arraysEqual(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  const sortedA = [...a].sort();
  const sortedB = [...b].sort();
  return sortedA.every((val, idx) => val === sortedB[idx]);
}

/**
 * Hook to track current location and visible elements
 *
 * This enables zero-config tool scoping - tools with elementId
 * are automatically scoped based on DOM element visibility.
 *
 * Called automatically by SupernalProvider - no need for manual setup.
 *
 * Uses browser APIs directly to ensure compatibility with both
 * App Router and Pages Router, and to avoid SSR/SSG issues.
 */
export function useLocationTracking() {
  const lastLocationRef = useRef<string>('');
  const lastElementsRef = useRef<string[]>([]);

  useEffect(() => {
    // Only run on client
    if (typeof window === 'undefined') return;

    const updateLocation = () => {
      // Get current location from browser
      const pathname = window.location.pathname;
      const search = window.location.search;
      const asPath = pathname + search;

      // Scan DOM for visible elements
      const visibleElements = getVisibleElements();

      // Check if anything has actually changed
      const locationChanged = lastLocationRef.current !== pathname;
      const elementsChanged = !arraysEqual(lastElementsRef.current, visibleElements);

      // Only update and log if something changed
      if (locationChanged || elementsChanged) {
        LocationContext.setCurrent({
          page: pathname,
          route: pathname,
          elements: visibleElements,
          metadata: {
            search,
            asPath,
          },
        });

        // Only log if there's an actual change
        if (locationChanged) {
          console.log(`[LocationTracking] Updated location: ${pathname}`);
        }
        if (elementsChanged) {
          console.log(`[LocationTracking] Visible elements changed: ${visibleElements.length} elements`);
        }

        // Update refs
        lastLocationRef.current = pathname;
        lastElementsRef.current = visibleElements;
      }
    };

    // Set initial location after a brief delay to ensure DOM is ready
    const initialTimer = setTimeout(updateLocation, 100);

    // Periodically re-scan for elements (handles dynamic content)
    const intervalId = setInterval(updateLocation, 1000);

    // Listen for browser navigation events
    window.addEventListener('popstate', updateLocation);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(intervalId);
      window.removeEventListener('popstate', updateLocation);
    };
  }, []);
}
