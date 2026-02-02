/**
 * Supernal Interface Interaction Tracking
 *
 * Tracks user interactions with SI components for analytics and AI analysis.
 * Batches events to minimize network requests and handles offline gracefully.
 *
 * @packageDocumentation
 */

/**
 * Base action types for tracking
 * Apps can extend these with custom actions via generics
 */
export type SIBaseAction =
  // Core interactions
  | 'view'
  | 'click'
  | 'expand'
  | 'collapse'
  | 'copy'
  | 'share'
  // Engagement
  | 'like'
  | 'unlike'
  | 'bookmark'
  | 'unbookmark'
  | 'submit'
  | 'helpful'
  | 'challenge'
  // Navigation
  | 'navigate'
  | 'scroll'
  | 'refresh'
  | 'search';

/**
 * Interaction event structure
 */
export interface SIInteraction<TAction extends string = SIBaseAction> {
  /** Component that triggered the event */
  componentId: string;
  /** Action performed */
  action: TAction;
  /** Target entity ID (post, user, etc.) */
  targetId?: string;
  /** Additional event metadata */
  metadata?: Record<string, unknown>;
  /** Client-side timestamp */
  timestamp: number;
  /** Session identifier */
  sessionId: string;
}

/**
 * Tracker configuration options
 */
export interface SITrackerConfig {
  /** API endpoint for logging events (default: '/api/v1/analytics') */
  endpoint?: string;
  /** Maximum events before auto-flush (default: 10) */
  batchSize?: number;
  /** Milliseconds between auto-flushes (default: 5000) */
  flushIntervalMs?: number;
  /** Minimum engagement time to track (default: 3000) */
  minEngagementMs?: number;
  /** Scroll depth debounce (default: 500) */
  scrollDebounceMs?: number;
  /** Enable debug logging (default: false) */
  debug?: boolean;
  /** Custom fetch implementation for testing */
  customFetch?: typeof fetch;
}

/** Engagement session tracking */
interface EngagementSession {
  targetId: string;
  startTime: number;
  scrollDepth: number;
  interactions: number;
}

/** Scroll depth tracking state */
interface ScrollState {
  maxDepth: number;
  lastReportedDepth: number;
  lastUpdateTime: number;
}

/**
 * SI Tracker - Core tracking class
 *
 * @example
 * ```typescript
 * const tracker = new SITracker({ endpoint: '/api/analytics' });
 * tracker.track('PostCard', 'view', 'post-123');
 * ```
 */
export class SITracker<TAction extends string = SIBaseAction> {
  private queue: SIInteraction<TAction>[] = [];
  private sessionId: string;
  private flushInterval: ReturnType<typeof setInterval> | null = null;
  private engagementSessions: Map<string, EngagementSession> = new Map();
  private scrollState: ScrollState = {
    maxDepth: 0,
    lastReportedDepth: 0,
    lastUpdateTime: Date.now(),
  };
  private isClient: boolean;
  private userId: string | null = null;
  private config: Required<SITrackerConfig>;

  constructor(config: SITrackerConfig = {}) {
    this.config = {
      endpoint: config.endpoint ?? '/api/v1/analytics',
      batchSize: config.batchSize ?? 10,
      flushIntervalMs: config.flushIntervalMs ?? 5000,
      minEngagementMs: config.minEngagementMs ?? 3000,
      scrollDebounceMs: config.scrollDebounceMs ?? 500,
      debug: config.debug ?? false,
      customFetch: config.customFetch ?? fetch,
    };

    this.isClient = typeof window !== 'undefined';
    this.sessionId = this.generateSessionId();

    if (this.isClient) {
      this.startFlushInterval();
      this.setupBeforeUnload();
    }
  }

  /** Generate a unique session ID */
  private generateSessionId(): string {
    if (!this.isClient) return 'server-session';

    // Try to reuse session ID from sessionStorage
    const stored = sessionStorage.getItem('si_session_id');
    if (stored) return stored;

    const id = `si_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`;
    sessionStorage.setItem('si_session_id', id);
    return id;
  }

  /** Log debug message */
  private log(...args: unknown[]): void {
    if (this.config.debug) {
      console.log('[SI Tracking]', ...args);
    }
  }

  /** Set the current user ID for tracking */
  setUserId(userId: string | null): void {
    this.userId = userId;
  }

  /** Get current session ID */
  getSessionId(): string {
    return this.sessionId;
  }

  /** Get queue length (for testing) */
  getQueueLength(): number {
    return this.queue.length;
  }

  /**
   * Track an interaction
   */
  track(
    componentId: string,
    action: TAction,
    targetId?: string,
    metadata?: Record<string, unknown>
  ): void {
    if (!this.isClient) return;

    const interaction: SIInteraction<TAction> = {
      componentId,
      action,
      targetId,
      metadata,
      timestamp: Date.now(),
      sessionId: this.sessionId,
    };

    this.queue.push(interaction);
    this.log('Queued:', action, targetId);

    // Flush if queue is full
    if (this.queue.length >= this.config.batchSize) {
      this.flush();
    }
  }

  /** Alias for track - for click events */
  trackClick(
    componentId: string,
    action: TAction,
    targetId?: string,
    metadata?: Record<string, unknown>
  ): void {
    this.track(componentId, action, targetId, metadata);
  }

  /** Track view (impression) of a component */
  trackView(componentId: string, targetId?: string): void {
    this.track(componentId, 'view' as TAction, targetId);
  }

  /** Start engagement tracking for a target */
  startEngagement(targetId: string): void {
    if (!this.isClient) return;

    this.engagementSessions.set(targetId, {
      targetId,
      startTime: Date.now(),
      scrollDepth: 0,
      interactions: 0,
    });
    this.log('Engagement started:', targetId);
  }

  /** Record an interaction during engagement */
  recordEngagementInteraction(targetId: string): void {
    const session = this.engagementSessions.get(targetId);
    if (session) {
      session.interactions++;
    }
  }

  /** Update scroll depth for engagement session */
  updateEngagementScrollDepth(targetId: string, depth: number): void {
    const session = this.engagementSessions.get(targetId);
    if (session && depth > session.scrollDepth) {
      session.scrollDepth = depth;
    }
  }

  /** End engagement tracking and log the session */
  endEngagement(targetId: string, componentId = 'Content'): void {
    if (!this.isClient) return;

    const session = this.engagementSessions.get(targetId);
    if (!session) return;

    const duration = Date.now() - session.startTime;

    // Only track if engagement was meaningful
    if (duration >= this.config.minEngagementMs) {
      this.track(componentId, 'view' as TAction, targetId, {
        engagementDuration: duration,
        scrollDepth: session.scrollDepth,
        interactions: session.interactions,
      });
      this.log('Engagement ended:', targetId, { duration, ...session });
    }

    this.engagementSessions.delete(targetId);
  }

  /** Track scroll depth in feed */
  trackScrollDepth(depth: number, componentId = 'Feed'): void {
    if (!this.isClient) return;

    const now = Date.now();

    // Only update if depth increased
    if (depth > this.scrollState.maxDepth) {
      this.scrollState.maxDepth = depth;
    }

    // Debounce reporting
    if (now - this.scrollState.lastUpdateTime < this.config.scrollDebounceMs) {
      return;
    }

    // Report at 25%, 50%, 75%, 100% milestones
    const milestones = [25, 50, 75, 100];
    const currentMilestone = milestones.find(
      (m) => this.scrollState.maxDepth >= m && this.scrollState.lastReportedDepth < m
    );

    if (currentMilestone) {
      this.track(componentId, 'scroll' as TAction, undefined, {
        depth: currentMilestone,
        maxDepth: this.scrollState.maxDepth,
      });
      this.scrollState.lastReportedDepth = currentMilestone;
      this.log('Scroll milestone:', currentMilestone);
    }

    this.scrollState.lastUpdateTime = now;
  }

  /** Reset scroll tracking (e.g., on page navigation) */
  resetScrollTracking(): void {
    this.scrollState = {
      maxDepth: 0,
      lastReportedDepth: 0,
      lastUpdateTime: Date.now(),
    };
  }

  /** Start periodic flush interval */
  private startFlushInterval(): void {
    if (this.flushInterval) return;

    this.flushInterval = setInterval(() => {
      this.flush();
    }, this.config.flushIntervalMs);
  }

  /** Stop flush interval */
  private stopFlushInterval(): void {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
      this.flushInterval = null;
    }
  }

  /** Setup beforeunload handler to flush remaining events */
  private setupBeforeUnload(): void {
    window.addEventListener('beforeunload', () => {
      // End all engagement sessions
      for (const targetId of this.engagementSessions.keys()) {
        this.endEngagement(targetId);
      }

      // Use sendBeacon for reliable delivery
      this.flushWithBeacon();
    });

    // Also handle visibility change for mobile
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.flushWithBeacon();
      }
    });
  }

  /** Flush queued events to the API */
  async flush(): Promise<void> {
    if (!this.isClient || this.queue.length === 0) return;

    const events = [...this.queue];
    this.queue = [];

    this.log('Flushing', events.length, 'events');

    try {
      const response = await this.config.customFetch(this.config.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          events,
          userId: this.userId,
        }),
      });

      if (!response.ok) {
        // Re-queue events on failure (with limit to prevent infinite growth)
        if (this.queue.length < this.config.batchSize * 3) {
          this.queue.unshift(...events);
        }
        this.log('Flush failed, re-queued');
      }
    } catch (error) {
      // Re-queue events on network error
      if (this.queue.length < this.config.batchSize * 3) {
        this.queue.unshift(...events);
      }
      console.warn('[SI Tracking] Failed to flush events:', error);
    }
  }

  /** Flush using sendBeacon (for unload events) */
  private flushWithBeacon(): void {
    if (!this.isClient || this.queue.length === 0) return;

    const events = [...this.queue];
    this.queue = [];

    try {
      const blob = new Blob([JSON.stringify({ events, userId: this.userId })], {
        type: 'application/json',
      });
      navigator.sendBeacon(this.config.endpoint, blob);
      this.log('Beacon sent', events.length, 'events');
    } catch (error) {
      console.warn('[SI Tracking] Beacon failed:', error);
    }
  }

  /** Cleanup (for testing or unmounting) */
  destroy(): void {
    this.stopFlushInterval();
    this.flush();
    this.engagementSessions.clear();
  }
}

/**
 * Create a singleton tracker instance
 *
 * @example
 * ```typescript
 * export const tracker = createTracker({ endpoint: '/api/analytics' });
 * ```
 */
export function createTracker<TAction extends string = SIBaseAction>(
  config?: SITrackerConfig
): SITracker<TAction> {
  return new SITracker<TAction>(config);
}
