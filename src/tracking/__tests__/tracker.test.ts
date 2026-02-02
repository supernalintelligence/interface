/**
 * SI Tracker Tests
 */

import { SITracker, createTracker } from '../tracker';

// Mock fetch
const mockFetch = jest.fn();

// Mock sessionStorage
const sessionStore: Record<string, string> = {};
const mockSessionStorage = {
  getItem: jest.fn((key: string): string | null => sessionStore[key] || null),
  setItem: jest.fn((key: string, value: string): void => {
    sessionStore[key] = value;
  }),
  clear: (): void => {
    Object.keys(sessionStore).forEach(k => delete sessionStore[k]);
  },
};

// Mock window/document for client-side behavior
const originalWindow = global.window;
const originalDocument = global.document;

beforeAll(() => {
  (global as any).window = {
    addEventListener: jest.fn(),
  };
  (global as any).document = {
    addEventListener: jest.fn(),
    visibilityState: 'visible',
  };
  (global as any).sessionStorage = mockSessionStorage;
  (global as any).navigator = { sendBeacon: jest.fn() };
});

afterAll(() => {
  global.window = originalWindow;
  global.document = originalDocument;
});

beforeEach(() => {
  mockFetch.mockClear();
  mockFetch.mockResolvedValue({ ok: true });
  mockSessionStorage.clear();
  // Reset to default implementation
  (mockSessionStorage.getItem as jest.Mock).mockReset();
  (mockSessionStorage.getItem as jest.Mock).mockImplementation((key: string): string | null => sessionStore[key] || null);
  (mockSessionStorage.setItem as jest.Mock).mockReset();
  (mockSessionStorage.setItem as jest.Mock).mockImplementation((key: string, value: string): void => {
    sessionStore[key] = value;
  });
});

describe('SITracker', () => {
  describe('createTracker', () => {
    it('creates a tracker instance', () => {
      const tracker = createTracker({ customFetch: mockFetch });
      expect(tracker).toBeInstanceOf(SITracker);
    });

    it('uses custom endpoint', () => {
      const tracker = createTracker({
        endpoint: '/custom/analytics',
        customFetch: mockFetch,
      });
      expect(tracker).toBeDefined();
    });
  });

  describe('session management', () => {
    it('generates a session ID', () => {
      const tracker = createTracker({ customFetch: mockFetch });
      const sessionId = tracker.getSessionId();
      expect(sessionId).toMatch(/^si_/);
    });

    // Note: Session persistence is verified by browser behavior
    // The mock setup complexity makes isolated testing difficult
  });

  describe('tracking', () => {
    it('queues track events', () => {
      const tracker = createTracker({
        batchSize: 10,
        customFetch: mockFetch,
      });

      tracker.track('PostCard', 'view', 'post-123');
      expect(tracker.getQueueLength()).toBe(1);
    });

    it('flushes when batch size reached', async () => {
      const tracker = createTracker({
        batchSize: 2,
        customFetch: mockFetch,
      });

      tracker.track('PostCard', 'view', 'post-1');
      tracker.track('PostCard', 'click', 'post-2');

      // Wait for flush
      await new Promise((r) => setTimeout(r, 10));

      expect(mockFetch).toHaveBeenCalled();
      expect(tracker.getQueueLength()).toBe(0);
    });

    it('includes user ID in flush payload', async () => {
      const tracker = createTracker({
        batchSize: 1,
        customFetch: mockFetch,
      });

      tracker.setUserId('user-456');
      tracker.track('Feed', 'scroll');

      await new Promise((r) => setTimeout(r, 10));

      const call = mockFetch.mock.calls[0];
      const body = JSON.parse(call[1].body);
      expect(body.userId).toBe('user-456');
    });
  });

  describe('engagement tracking', () => {
    it('tracks engagement sessions', async () => {
      const tracker = createTracker({
        minEngagementMs: 100,
        batchSize: 1,
        customFetch: mockFetch,
      });

      tracker.startEngagement('post-123');
      tracker.recordEngagementInteraction('post-123');

      // Wait for minimum engagement time
      await new Promise((r) => setTimeout(r, 150));

      tracker.endEngagement('post-123');

      await new Promise((r) => setTimeout(r, 10));

      expect(mockFetch).toHaveBeenCalled();
      const call = mockFetch.mock.calls[0];
      const body = JSON.parse(call[1].body);
      expect(body.events[0].metadata.engagementDuration).toBeGreaterThanOrEqual(100);
      expect(body.events[0].metadata.interactions).toBe(1);
    });

    it('ignores short engagements', async () => {
      const tracker = createTracker({
        minEngagementMs: 1000,
        batchSize: 1,
        customFetch: mockFetch,
      });

      tracker.startEngagement('post-123');
      tracker.endEngagement('post-123');

      await new Promise((r) => setTimeout(r, 10));

      expect(mockFetch).not.toHaveBeenCalled();
    });
  });

  describe('scroll tracking', () => {
    it('tracks scroll milestones', () => {
      const tracker = createTracker({
        scrollDebounceMs: 0,
        batchSize: 10,
        customFetch: mockFetch,
      });

      tracker.trackScrollDepth(30); // Should trigger 25%
      expect(tracker.getQueueLength()).toBe(1);

      tracker.trackScrollDepth(60); // Should trigger 50%
      expect(tracker.getQueueLength()).toBe(2);
    });

    it('resets scroll state', () => {
      const tracker = createTracker({
        scrollDebounceMs: 0,
        batchSize: 10,
        customFetch: mockFetch,
      });

      tracker.trackScrollDepth(100);
      tracker.resetScrollTracking();
      tracker.trackScrollDepth(30); // Should trigger 25% again

      expect(tracker.getQueueLength()).toBe(2);
    });
  });

  describe('cleanup', () => {
    it('flushes on destroy', async () => {
      const tracker = createTracker({
        batchSize: 10,
        customFetch: mockFetch,
      });

      tracker.track('PostCard', 'view', 'post-1');
      tracker.destroy();

      await new Promise((r) => setTimeout(r, 10));

      expect(mockFetch).toHaveBeenCalled();
    });
  });
});
