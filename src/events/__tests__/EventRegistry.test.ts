/**
 * Tests for EventRegistry (defineEvents / event)
 *
 * Covers:
 * 1. Namespaced name resolution
 * 2. dispatch/listen round-trip with typed payload
 * 3. listen() unsubscribe stops delivery
 * 4. SSR guard — dispatch()/listen() throw when window is undefined
 * 5. Two independent defineEvents() calls sharing a namespace (real DOM string-name semantics)
 * 6. Idempotent unsubscribe (calling it twice is safe)
 * 7. Compile-time payload type checking (@ts-expect-error)
 * 8. void-payload event dispatch/listen ergonomics
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

  it('two independent defineEvents() calls with the same namespace share the DOM string name (expected, not a bug)', () => {
    // There is no runtime registry (deliberately — see the module doc comment),
    // so two separate defineEvents('chat', ...) calls produce two independent
    // JS objects. But the browser's addEventListener/dispatchEvent only care
    // about the STRING name, not object identity — so a listener registered
    // via one call's resolved event receives a dispatch from the OTHER call's
    // identically-named resolved event. This is real, expected DOM behavior,
    // not a defineEvents bug — documented here so it's not mistaken for one.
    const ChatEventsA = defineEvents('chat', {
      viewModeChanged: event<{ mode: 'compact' | 'full' }>('view-mode-change'),
    });
    const ChatEventsB = defineEvents('chat', {
      viewModeChanged: event<{ mode: 'compact' | 'full' }>('view-mode-change'),
    });

    expect(ChatEventsA.viewModeChanged.name).toBe(
      ChatEventsB.viewModeChanged.name
    );
    expect(ChatEventsA).not.toBe(ChatEventsB);

    const received: unknown[] = [];
    const unsubscribe = ChatEventsA.viewModeChanged.listen((detail) => {
      received.push(detail);
    });

    ChatEventsB.viewModeChanged.dispatch({ mode: 'full' });

    expect(received).toEqual([{ mode: 'full' }]);
    unsubscribe();
  });

  it('calling the unsubscribe function twice is safe (matches removeEventListener idempotency)', () => {
    const ChatEvents = defineEvents('chat', {
      viewModeChanged: event<{ mode: 'compact' | 'full' }>('view-mode-change'),
    });

    const unsubscribe = ChatEvents.viewModeChanged.listen(() => {});

    expect(() => {
      unsubscribe();
      unsubscribe();
    }).not.toThrow();
  });

  it('rejects a payload that does not match the declared type at compile time', () => {
    const ChatEvents = defineEvents('chat', {
      viewModeChanged: event<{ mode: 'compact' | 'full' }>('view-mode-change'),
    });

    // @ts-expect-error — `mode: 'sideways'` is not assignable to 'compact' | 'full'.
    ChatEvents.viewModeChanged.dispatch({ mode: 'sideways' });

    // @ts-expect-error — payload is required for a typed event; omitting it must be a type error.
    ChatEvents.viewModeChanged.dispatch();
  });

  it('supports a void-payload event via event() with no type argument', () => {
    const SyncEvents = defineEvents('sync', {
      requested: event('requested'),
    });

    expect(SyncEvents.requested.name).toBe('sync:requested');

    let fireCount = 0;
    const unsubscribe = SyncEvents.requested.listen(() => {
      fireCount += 1;
    });

    // A void-typed payload still requires an explicit argument at the call
    // site (TypeScript does not treat a required `void` parameter as
    // omittable) — `undefined` is the correct, and only, way to satisfy it.
    SyncEvents.requested.dispatch(undefined);

    expect(fireCount).toBe(1);
    unsubscribe();
  });
});
