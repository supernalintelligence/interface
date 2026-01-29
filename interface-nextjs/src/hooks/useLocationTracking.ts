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
 */

import { useEffect, useRef } from 'react';
import { LocationContext } from '@supernal/interface/browser';

// Try to import App Router hooks (will be undefined in Pages Router)
let usePathname: (() => string) | undefined;
let useSearchParams: (() => URLSearchParams) | undefined;

try {
  // Dynamic import check for App Router
  const navigation = require('next/navigation');
  usePathname = navigation.usePathname;
  useSearchParams = navigation.useSearchParams;
} catch {
  // App Router not available, will use browser APIs
}

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
 * Get current location from browser
 */
function getCurrentLocation() {
  if (typeof window === 'undefined') {
    return { pathname: '/', search: '', asPath: '/' };
  }
  return {
    pathname: window.location.pathname,
    search: window.location.search,
    asPath: window.location.pathname + window.location.search,
  };
}

/**
 * Hook to track current location and visible elements
 *
 * This enables zero-config tool scoping - tools with elementId
 * are automatically scoped based on DOM element visibility.
 *
 * Called automatically by SupernalProvider - no need for manual setup.
 *
 * Works with both App Router (next/navigation) and Pages Router (next/router).
 */
export function useLocationTracking() {
  const lastLocationRef = useRef<string>('');
  const lastElementsRef = useRef<string[]>([]);

  // Try to use App Router hooks if available
  let pathname: string | null = null;
  let searchParams: URLSearchParams | null = null;

  try {
    if (usePathname) {
      pathname = usePathname();
    }
    if (useSearchParams) {
      searchParams = useSearchParams();
    }
  } catch {
    // Hooks not available in this context, will use browser APIs
  }

  useEffect(() => {
    const updateLocation = () => {
      // Get current location (prefer App Router hooks, fall back to browser)
      const location = pathname !== null
        ? { pathname, search: searchParams?.toString() || '', asPath: pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '') }
        : getCurrentLocation();

      // Scan DOM for visible elements
      const visibleElements = getVisibleElements();

      // Check if anything has actually changed
      const locationChanged = lastLocationRef.current !== location.pathname;
      const elementsChanged = !arraysEqual(lastElementsRef.current, visibleElements);

      // Only update and log if something changed
      if (locationChanged || elementsChanged) {
        LocationContext.setCurrent({
          page: location.pathname,
          route: location.pathname,
          elements: visibleElements,
          metadata: {
            search: location.search,
            asPath: location.asPath,
          },
        });

        // Only log if there's an actual change
        if (locationChanged) {
          console.log(`[LocationTracking] Updated location: ${location.pathname}`);
        }
        if (elementsChanged) {
          console.log(`[LocationTracking] Visible elements changed: ${visibleElements.length} elements`);
        }

        // Update refs
        lastLocationRef.current = location.pathname;
        lastElementsRef.current = visibleElements;
      }
    };

    // Set initial location after a brief delay to ensure DOM is ready
    const initialTimer = setTimeout(updateLocation, 100);

    // Periodically re-scan for elements (handles dynamic content)
    const intervalId = setInterval(updateLocation, 1000);

    // Listen for browser navigation events (works for both routers)
    const handleNavigation = () => {
      // Delay to ensure new page DOM is rendered
      setTimeout(updateLocation, 100);
    };

    window.addEventListener('popstate', handleNavigation);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(intervalId);
      window.removeEventListener('popstate', handleNavigation);
    };
  }, [pathname, searchParams]);
}
