/**
 * SI Tracking React Hooks
 *
 * React hooks for integrating Supernal Interface tracking into components.
 *
 * @packageDocumentation
 */

'use client';

import { useCallback, useEffect, useRef, useContext, createContext } from 'react';
import type { SITracker, SIBaseAction } from './tracker';

// Context for providing tracker instance
const SITrackerContext = createContext<SITracker | null>(null);

export const SITrackerProvider = SITrackerContext.Provider;

/**
 * Get the tracker instance from context
 */
export function useTracker<TAction extends string = SIBaseAction>(): SITracker<TAction> | null {
  return useContext(SITrackerContext) as SITracker<TAction> | null;
}

/**
 * Hook to sync auth state with tracker
 * Place this once in your app layout
 *
 * @example
 * ```tsx
 * function App() {
 *   const { user } = useAuth();
 *   useSITrackingInit(tracker, user?.id);
 *   return <div>...</div>;
 * }
 * ```
 */
export function useSITrackingInit(
  tracker: SITracker | null,
  userId: string | null | undefined
): void {
  useEffect(() => {
    if (tracker) {
      tracker.setUserId(userId ?? null);
    }
  }, [tracker, userId]);
}

/**
 * Hook for tracking click events
 *
 * @example
 * ```tsx
 * const trackClick = useTrackClick(tracker, 'PostCard');
 * <button onClick={() => trackClick('like', postId)}>Like</button>
 * ```
 */
export function useTrackClick<TAction extends string = SIBaseAction>(
  tracker: SITracker<TAction> | null,
  componentId: string
) {
  return useCallback(
    (action: TAction, targetId?: string, metadata?: Record<string, unknown>) => {
      if (tracker) {
        tracker.trackClick(componentId, action, targetId, metadata);
      }
    },
    [tracker, componentId]
  );
}

/**
 * Hook for tracking component views (impressions)
 * Automatically tracks when component mounts
 *
 * @example
 * ```tsx
 * useTrackView(tracker, 'PostCard', post.id);
 * ```
 */
export function useTrackView(
  tracker: SITracker | null,
  componentId: string,
  targetId?: string,
  options?: { trackOnMount?: boolean }
): void {
  const { trackOnMount = true } = options ?? {};

  useEffect(() => {
    if (tracker && trackOnMount) {
      tracker.trackView(componentId, targetId);
    }
  }, [tracker, componentId, targetId, trackOnMount]);
}

/**
 * Hook for tracking engagement time on a specific target
 * Automatically handles start/end of engagement session
 *
 * @example
 * ```tsx
 * const { recordInteraction } = useTrackEngagement(tracker, post.id);
 * <button onClick={recordInteraction}>Interact</button>
 * ```
 */
export function useTrackEngagement(
  tracker: SITracker | null,
  targetId: string,
  componentId = 'Content'
): {
  recordInteraction: () => void;
} {
  const engagementStarted = useRef(false);

  useEffect(() => {
    if (!tracker || !targetId) return;

    // Start engagement tracking
    tracker.startEngagement(targetId);
    engagementStarted.current = true;

    return () => {
      // End engagement tracking on unmount
      if (engagementStarted.current && tracker) {
        tracker.endEngagement(targetId, componentId);
        engagementStarted.current = false;
      }
    };
  }, [tracker, targetId, componentId]);

  const recordInteraction = useCallback(() => {
    if (tracker) {
      tracker.recordEngagementInteraction(targetId);
    }
  }, [tracker, targetId]);

  return { recordInteraction };
}

/**
 * Hook for tracking scroll depth in feed
 * Attach to a scrollable container
 *
 * @example
 * ```tsx
 * const { handleScroll, resetScroll } = useTrackScrollDepth(tracker);
 * <div onScroll={handleScroll}>...</div>
 * ```
 */
export function useTrackScrollDepth(
  tracker: SITracker | null,
  componentId = 'Feed'
): {
  handleScroll: (event: React.UIEvent<HTMLElement>) => void;
  resetScroll: () => void;
} {
  const handleScroll = useCallback(
    (event: React.UIEvent<HTMLElement>) => {
      if (!tracker) return;

      const target = event.currentTarget;
      const scrollHeight = target.scrollHeight - target.clientHeight;

      if (scrollHeight <= 0) return;

      const scrollPercent = Math.round((target.scrollTop / scrollHeight) * 100);
      tracker.trackScrollDepth(scrollPercent, componentId);
    },
    [tracker, componentId]
  );

  const resetScroll = useCallback(() => {
    if (tracker) {
      tracker.resetScrollTracking();
    }
  }, [tracker]);

  // Reset on mount
  useEffect(() => {
    if (tracker) {
      tracker.resetScrollTracking();
    }
  }, [tracker]);

  return { handleScroll, resetScroll };
}

/**
 * Hook for tracking intersection observer visibility
 * Useful for tracking when components come into view in feed
 *
 * @example
 * ```tsx
 * const ref = useTrackVisibility(tracker, 'PostCard', post.id);
 * <div ref={ref}>...</div>
 * ```
 */
export function useTrackVisibility(
  tracker: SITracker | null,
  componentId: string,
  targetId?: string,
  options?: { threshold?: number }
): React.RefCallback<HTMLElement> {
  const { threshold = 0.5 } = options ?? {};
  const hasTracked = useRef(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const refCallback = useCallback(
    (element: HTMLElement | null) => {
      // Cleanup previous observer
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }

      if (!element || !tracker) return;

      // Create new observer
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !hasTracked.current) {
              tracker.trackView(componentId, targetId);
              hasTracked.current = true;
            }
          });
        },
        { threshold }
      );

      observerRef.current.observe(element);
    },
    [tracker, componentId, targetId, threshold]
  );

  // Reset tracking flag when targetId changes
  useEffect(() => {
    hasTracked.current = false;
  }, [targetId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return refCallback;
}

/**
 * Create a component-specific tracking hook factory
 *
 * @example
 * ```typescript
 * // Define your actions
 * type PostActions = 'like' | 'unlike' | 'share' | 'bookmark';
 *
 * // Create hooks for PostCard
 * export function usePostCardTracking(tracker: SITracker<PostActions>, postId: string) {
 *   const trackClick = useTrackClick(tracker, 'PostCard');
 *   const visibilityRef = useTrackVisibility(tracker, 'PostCard', postId);
 *
 *   return {
 *     trackLike: () => trackClick('like', postId),
 *     trackShare: () => trackClick('share', postId),
 *     visibilityRef,
 *   };
 * }
 * ```
 */
export function createComponentTrackingHook<TAction extends string, TReturn>(
  componentId: string,
  factory: (
    trackClick: (action: TAction, targetId?: string, metadata?: Record<string, unknown>) => void,
    tracker: SITracker<TAction>,
    targetId: string
  ) => TReturn
) {
  return function useComponentTracking(
    tracker: SITracker<TAction> | null,
    targetId: string
  ): TReturn | null {
    const trackClick = useTrackClick(tracker, componentId);

    if (!tracker) return null;

    return factory(trackClick, tracker, targetId);
  };
}
