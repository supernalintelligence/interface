/**
 * SI Tracking Provider Component
 *
 * React component that provides the tracker instance to the component tree.
 *
 * @packageDocumentation
 */

'use client';

import React, { useMemo, useEffect } from 'react';
import { SITracker, SITrackerConfig, createTracker } from './tracker';
import { SITrackerProvider, useSITrackingInit, useTracker } from './hooks';

export interface SITrackingProviderProps {
  children: React.ReactNode;
  /** Tracker configuration */
  config?: SITrackerConfig;
  /** Pre-created tracker instance (overrides config) */
  tracker?: SITracker;
  /** Current user ID for tracking */
  userId?: string | null;
  /** Callback when tracker is created */
  onTrackerCreated?: (tracker: SITracker) => void;
}

/**
 * Provider component that initializes SI tracking for your app
 *
 * @example
 * ```tsx
 * // With config
 * function App() {
 *   const { user } = useAuth();
 *   return (
 *     <SITrackingProvider
 *       config={{ endpoint: '/api/analytics' }}
 *       userId={user?.id}
 *     >
 *       <YourApp />
 *     </SITrackingProvider>
 *   );
 * }
 *
 * // With existing tracker
 * const tracker = createTracker({ endpoint: '/api/analytics' });
 *
 * function App() {
 *   return (
 *     <SITrackingProvider tracker={tracker}>
 *       <YourApp />
 *     </SITrackingProvider>
 *   );
 * }
 * ```
 */
export function TrackingProvider({
  children,
  config,
  tracker: externalTracker,
  userId,
  onTrackerCreated,
}: SITrackingProviderProps) {
  // Create or use provided tracker
  const tracker = useMemo(() => {
    if (externalTracker) return externalTracker;
    const newTracker = createTracker(config);
    onTrackerCreated?.(newTracker);
    return newTracker;
  }, [externalTracker, config, onTrackerCreated]);

  // Sync user ID
  useSITrackingInit(tracker, userId);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Only destroy if we created the tracker
      if (!externalTracker) {
        tracker.destroy();
      }
    };
  }, [tracker, externalTracker]);

  return <SITrackerProvider value={tracker}>{children}</SITrackerProvider>;
}

/**
 * Higher-order component to inject tracker
 *
 * @example
 * ```tsx
 * const TrackedComponent = withTracking(MyComponent);
 * // MyComponent receives `tracker` prop
 * ```
 */
export function withTracking<P extends { tracker?: SITracker | null }>(
  WrappedComponent: React.ComponentType<P>
): React.FC<Omit<P, 'tracker'>> {
  // Inner component that uses the hook
  function WithTrackingInner(props: Omit<P, 'tracker'>) {
    const tracker = useTracker();
    return <WrappedComponent {...(props as P)} tracker={tracker} />;
  }

  WithTrackingInner.displayName = `withTracking(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return WithTrackingInner;
}
