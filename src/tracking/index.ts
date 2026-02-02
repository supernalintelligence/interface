/**
 * Supernal Interface Tracking Module
 *
 * Analytics and interaction tracking for SI-enabled applications.
 * Automatically batches events, handles offline scenarios, and provides
 * React hooks for easy integration.
 *
 * @packageDocumentation
 *
 * @example
 * ```typescript
 * // Create a tracker
 * import { createTracker, TrackingProvider, useTrackClick } from '@supernal/interface/tracking';
 *
 * const tracker = createTracker({
 *   endpoint: '/api/v1/analytics',
 *   batchSize: 10,
 *   debug: process.env.NODE_ENV === 'development',
 * });
 *
 * // Provide to React tree
 * function App() {
 *   const { user } = useAuth();
 *   return (
 *     <TrackingProvider tracker={tracker} userId={user?.id}>
 *       <YourApp />
 *     </TrackingProvider>
 *   );
 * }
 *
 * // Use in components
 * function PostCard({ post }) {
 *   const tracker = useTracker();
 *   const trackClick = useTrackClick(tracker, 'PostCard');
 *   const visibilityRef = useTrackVisibility(tracker, 'PostCard', post.id);
 *
 *   return (
 *     <div ref={visibilityRef}>
 *       <button onClick={() => trackClick('like', post.id)}>Like</button>
 *     </div>
 *   );
 * }
 * ```
 */

// Core tracker
export {
  SITracker,
  createTracker,
  type SITrackerConfig,
  type SIInteraction,
  type SIBaseAction,
} from './tracker';

// React hooks
export {
  SITrackerProvider,
  useTracker,
  useSITrackingInit,
  useTrackClick,
  useTrackView,
  useTrackEngagement,
  useTrackScrollDepth,
  useTrackVisibility,
  createComponentTrackingHook,
} from './hooks';

// React provider component
export { TrackingProvider, withTracking, type SITrackingProviderProps } from './SITrackingProvider';
