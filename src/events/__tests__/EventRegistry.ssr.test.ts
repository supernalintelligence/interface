/**
 * @jest-environment node
 *
 * SSR guard tests for EventRegistry — run under Jest's `node` environment
 * (not jsdom), where `window` genuinely does not exist, matching a real
 * Next.js SSR/RSC module-eval context. A jsdom test can't validate this:
 * jsdom's `window` is non-configurable, so `delete global.window` silently
 * no-ops there instead of actually removing it.
 */

import { defineEvents, event } from '../EventRegistry';

describe('defineEvents — SSR guard (node environment, no window)', () => {
  it('defineEvents() itself does not throw outside a browser context', () => {
    expect(() =>
      defineEvents('chat', {
        viewModeChanged: event<{ mode: 'compact' | 'full' }>(
          'view-mode-change'
        ),
      })
    ).not.toThrow();
  });

  it('dispatch() throws a named error outside a browser context', () => {
    const ChatEvents = defineEvents('chat', {
      viewModeChanged: event<{ mode: 'compact' | 'full' }>('view-mode-change'),
    });

    expect(() => ChatEvents.viewModeChanged.dispatch({ mode: 'full' })).toThrow(
      /EventRegistry: dispatch\(\) called outside a browser context/
    );
  });

  it('listen() throws a named error outside a browser context', () => {
    const ChatEvents = defineEvents('chat', {
      viewModeChanged: event<{ mode: 'compact' | 'full' }>('view-mode-change'),
    });

    expect(() => ChatEvents.viewModeChanged.listen(() => {})).toThrow(
      /EventRegistry: listen\(\) called outside a browser context/
    );
  });
});
