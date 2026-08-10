/**
 * Unit tests for the pure, DOM-independent liveness-diff logic. The
 * DOM-dependent halves (discoverInteractiveElements, captureLivenessSnapshot)
 * are `page.evaluate()`-only functions verified separately via a real
 * Playwright run against a fixture page (see InteractionMode's own
 * verification) -- jsdom can't meaningfully exercise real click/render
 * behavior, so this file covers exactly the part that's a pure function.
 */

import {
  hasObservableChange,
  type LivenessSnapshot,
} from '../interactiveElements';

function snapshot(overrides: Partial<LivenessSnapshot> = {}): LivenessSnapshot {
  return {
    url: 'https://example.com/',
    bodyHash: 12345,
    interactiveElementCount: 3,
    ...overrides,
  };
}

describe('hasObservableChange', () => {
  it('returns false when before and after are identical', () => {
    const before = snapshot();
    const after = snapshot();
    expect(hasObservableChange(before, after)).toBe(false);
  });

  it('returns true when the URL changed', () => {
    const before = snapshot({ url: 'https://example.com/' });
    const after = snapshot({ url: 'https://example.com/next' });
    expect(hasObservableChange(before, after)).toBe(true);
  });

  it('returns true when the body markup hash changed (DOM mutation, new element, or class/aria change)', () => {
    const before = snapshot({ bodyHash: 111 });
    const after = snapshot({ bodyHash: 222 });
    expect(hasObservableChange(before, after)).toBe(true);
  });

  it('returns true when the interactive-element count changed (a modal opened/closed)', () => {
    const before = snapshot({ interactiveElementCount: 3 });
    const after = snapshot({ interactiveElementCount: 5 });
    expect(hasObservableChange(before, after)).toBe(true);
  });

  it('returns true when ANY single signal differs, even if the others match', () => {
    // Regression guard: this must be OR logic across all three signals, not
    // AND -- a dead-button repro only needs ONE thing to differ to prove
    // liveness, and requiring all three would produce false "dead" verdicts
    // for elements that only mutate the DOM without also changing the URL
    // or the interactive-element count (e.g. a text update).
    const before = snapshot({
      url: 'https://example.com/',
      bodyHash: 1,
      interactiveElementCount: 3,
    });
    const after = snapshot({
      url: 'https://example.com/',
      bodyHash: 2,
      interactiveElementCount: 3,
    });
    expect(hasObservableChange(before, after)).toBe(true);
  });
});
