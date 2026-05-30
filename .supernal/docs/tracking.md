# SI Tracking Module

Interaction tracking for Supernal Interface applications. Automatically batches events, handles offline scenarios, and provides React hooks for easy integration.

## Installation

```bash
npm install @supernal/interface
```

## Quick Start

```typescript
import { createTracker, TrackingProvider, useTrackClick } from '@supernal/interface';

// 1. Create tracker instance
const tracker = createTracker({
  endpoint: '/api/v1/analytics',
  batchSize: 10,
  debug: process.env.NODE_ENV === 'development',
});

// 2. Wrap your app
function App() {
  const { user } = useAuth();
  return (
    <TrackingProvider tracker={tracker} userId={user?.id}>
      <YourApp />
    </TrackingProvider>
  );
}

// 3. Track in components
function PostCard({ post }) {
  const tracker = useTracker();
  const trackClick = useTrackClick(tracker, 'PostCard');
  const visibilityRef = useTrackVisibility(tracker, 'PostCard', post.id);

  return (
    <div ref={visibilityRef}>
      <button onClick={() => trackClick('like', post.id)}>Like</button>
    </div>
  );
}
```

## Configuration

```typescript
interface SITrackerConfig {
  /** API endpoint for logging events (default: '/api/v1/analytics') */
  endpoint?: string;
  
  /** Maximum events before auto-flush (default: 10) */
  batchSize?: number;
  
  /** Milliseconds between auto-flushes (default: 5000) */
  flushIntervalMs?: number;
  
  /** Minimum engagement time to track (default: 3000ms) */
  minEngagementMs?: number;
  
  /** Scroll depth debounce (default: 500ms) */
  scrollDebounceMs?: number;
  
  /** Enable debug logging (default: false) */
  debug?: boolean;
}
```

## Core Tracker API

```typescript
const tracker = createTracker(config);

// Basic tracking
tracker.track(componentId, action, targetId?, metadata?);
tracker.trackClick(componentId, action, targetId?, metadata?);
tracker.trackView(componentId, targetId?);

// Engagement tracking
tracker.startEngagement(targetId);
tracker.recordEngagementInteraction(targetId);
tracker.endEngagement(targetId, componentId?);

// Scroll tracking
tracker.trackScrollDepth(depth, componentId?);
tracker.resetScrollTracking();

// User management
tracker.setUserId(userId);
tracker.getSessionId();

// Lifecycle
tracker.flush();
tracker.destroy();
```

## React Hooks

### `useTracker()`
Get tracker instance from context.

### `useTrackClick(tracker, componentId)`
Returns a function to track click events.

```tsx
const trackClick = useTrackClick(tracker, 'PostCard');
<button onClick={() => trackClick('like', postId)}>Like</button>
```

### `useTrackView(tracker, componentId, targetId?, options?)`
Automatically tracks view on mount.

```tsx
useTrackView(tracker, 'PostCard', post.id);
```

### `useTrackEngagement(tracker, targetId, componentId?)`
Tracks time spent and interactions.

```tsx
const { recordInteraction } = useTrackEngagement(tracker, post.id);
```

### `useTrackScrollDepth(tracker, componentId?)`
Tracks scroll depth milestones (25%, 50%, 75%, 100%).

```tsx
const { handleScroll, resetScroll } = useTrackScrollDepth(tracker);
<div onScroll={handleScroll}>...</div>
```

### `useTrackVisibility(tracker, componentId, targetId?, options?)`
Uses IntersectionObserver to track when elements enter viewport.

```tsx
const ref = useTrackVisibility(tracker, 'PostCard', post.id);
<div ref={ref}>...</div>
```

## Base Action Types

```typescript
type SIBaseAction =
  | 'view' | 'click' | 'expand' | 'collapse' | 'copy' | 'share'
  | 'like' | 'unlike' | 'bookmark' | 'unbookmark' | 'submit' | 'helpful' | 'challenge'
  | 'navigate' | 'scroll' | 'refresh' | 'search';
```

Extend with app-specific actions:

```typescript
type MyAction = SIBaseAction | 'custom_action' | 'another_action';
const tracker = createTracker<MyAction>(config);
```

## Server-Side API

Create an endpoint to receive events:

```typescript
// app/api/v1/analytics/route.ts
export async function POST(request: Request) {
  const { events, userId } = await request.json();
  
  // Validate events
  // Store in database
  // Return success
  
  return Response.json({ success: true, logged: events.length });
}
```

## Event Structure

```typescript
interface SIInteraction {
  componentId: string;
  action: string;
  targetId?: string;
  metadata?: Record<string, unknown>;
  timestamp: number;
  sessionId: string;
}
```

## Best Practices

1. **Create one tracker per app** - Use singleton pattern
2. **Set user ID after auth** - Call `tracker.setUserId()` when user logs in
3. **Use visibility tracking** - More accurate than mount-based tracking
4. **Track meaningful engagements** - Set appropriate `minEngagementMs`
5. **Handle cleanup** - Call `tracker.destroy()` on app unmount

## Analytics Visualization

For dashboard integration, see the analytics API responses:

```typescript
// GET /api/v1/analytics?view=summary
{
  period: { start, end },
  totals: {
    interactions: number,
    byComponent: Record<string, number>,
    byAction: Record<string, number>,
  }
}

// GET /api/v1/analytics?view=posts
{ posts: [{ id, views, likes, shares, avgEngagementMs }] }

// GET /api/v1/analytics?view=scroll
{ scrollStats: [{ date, depth25, depth50, depth75, depth100 }] }
```
