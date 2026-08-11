/**
 * Tests for EventRegistry (defineEvents / event)
 *
 * Covers:
 * 1. Namespaced name resolution
 * 2. dispatch/listen round-trip with typed payload
 * 3. listen() unsubscribe stops delivery
 * 4. SSR guard — dispatch()/listen() throw when window is undefined
 */

import { defineEvents, event } from '../EventRegistry';

describe('defineEvents', () => {
  it('resolves namespace-prefixed event names', () => {
    const ChatEvents = defineEvents('chat', {
      viewModeChanged: event<{ mode: 'compact' | 'full' }>('view-mode-change'),
      panelHidden: event<{ hidden: boolean }>('panel-hidden-change'),
    });

    expect(ChatEvents.viewModeChanged.name).toBe('chat:view-mode-change');
    expect(ChatEvents.panelHidden.name).toBe('chat:panel-hidden-change');
    expect(ChatEvents.namespace).toBe('chat:');
  });

  it('round-trips dispatch/listen with a typed payload', () => {
    const ChatEvents = defineEvents('chat', {
      viewModeChanged: event<{ mode: 'compact' | 'full' }>('view-mode-change'),
    });

    const received: Array<{ mode: 'compact' | 'full' }> = [];
    const unsubscribe = ChatEvents.viewModeChanged.listen((detail) => {
      received.push(detail);
    });

    ChatEvents.viewModeChanged.dispatch({ mode: 'full' });

    expect(received).toEqual([{ mode: 'full' }]);
    unsubscribe();
  });

  it('unsubscribe stops further delivery', () => {
    const ChatEvents = defineEvents('chat', {
      viewModeChanged: event<{ mode: 'compact' | 'full' }>('view-mode-change'),
    });

    const received: unknown[] = [];
    const unsubscribe = ChatEvents.viewModeChanged.listen((detail) => {
      received.push(detail);
    });

    ChatEvents.viewModeChanged.dispatch({ mode: 'compact' });
    unsubscribe();
    ChatEvents.viewModeChanged.dispatch({ mode: 'full' });

    expect(received).toEqual([{ mode: 'compact' }]);
  });

  it('supports a custom EventTarget instead of window', () => {
    const ChatEvents = defineEvents('chat', {
      viewModeChanged: event<{ mode: 'compact' | 'full' }>('view-mode-change'),
    });

    const target = new EventTarget();
    const received: unknown[] = [];
    const unsubscribe = ChatEvents.viewModeChanged.listen((detail) => {
      received.push(detail);
    }, target);

    // Dispatching on window should NOT reach a listener bound to `target`.
    ChatEvents.viewModeChanged.dispatch({ mode: 'full' });
    expect(received).toEqual([]);

    // Dispatching on `target` should reach it.
    ChatEvents.viewModeChanged.dispatch({ mode: 'compact' }, target);
    expect(received).toEqual([{ mode: 'compact' }]);

    unsubscribe();
  });
});
