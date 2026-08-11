/**
 * EventRegistry — typed, namespace-scoped DOM CustomEvent name factory.
 *
 * Sibling of KeyRegistry (storage keys) and createNames (component names) —
 * same "typed contract instead of a magic string" shape, applied to
 * `window.dispatchEvent`/`addEventListener` event names.
 *
 * `defineEvents()` is a PURE function with no import-time side effects
 * (same shape as `defineStaticKeys`, not `createNames`'s side-effecting
 * `architectureRegistry` registration — nothing in this package's tooling
 * reads a runtime event registry, so paying for one would be dead weight).
 *
 * @example
 * ```typescript
 * import { defineEvents, event } from '@supernal/interface';
 *
 * const ChatEvents = defineEvents('chat', {
 *   viewModeChanged: event<{ mode: 'compact' | 'full' }>('view-mode-change'),
 *   panelHidden: event<{ hidden: boolean }>('panel-hidden-change'),
 *   // A pre-existing/legacy name that doesn't follow the colon-namespaced
 *   // convention (e.g. migrating an old raw-literal event onto defineEvents()
 *   // without changing the string other listeners still check for):
 *   legacyRefresh: event.raw<{ force: boolean }>('legacy-refresh-event'),
 * });
 *
 * ChatEvents.viewModeChanged.name              // → 'chat:view-mode-change'
 * ChatEvents.legacyRefresh.name                // → 'legacy-refresh-event' (verbatim, no prefix)
 * ChatEvents.viewModeChanged.dispatch({ mode: 'full' });
 * const unsubscribe = ChatEvents.viewModeChanged.listen((detail) => { ... });
 * ```
 */

/** Phantom-type tag: attaches a payload type `T` to an event's base name at zero runtime cost. */
export interface EventDef<T> {
  readonly baseName: string;
  /**
   * Internal: when true, `defineEvents()` uses `baseName` as the final event
   * name VERBATIM — no `${namespace}:` prefix is applied. Set only via
   * `event.raw()`, never by hand.
   */
  readonly __raw?: boolean;
  /** Phantom field — never assigned, exists only so TypeScript can infer `T` from an `EventDef<T>`. */
  readonly __payloadType?: T;
}

/**
 * Declare one event's base name and payload type.
 *
 * @param name  Base event name, WITHOUT the namespace prefix (e.g. 'view-mode-change').
 *              `defineEvents()` prepends `${namespace}:` to produce the final event name.
 *              To preserve an exact pre-existing name with NO namespace prefix (e.g. a
 *              legacy bare kebab-case string during a migration), use `event.raw()` instead.
 */
export function event<T = void>(name: string): EventDef<T> {
  return { baseName: name };
}

// "function + namespace" merge, giving `event.raw<T>()` a real, independently
// generic call signature (not a bolted-on `as any` static property).
export namespace event {
  /**
   * Declare an event whose final name is used EXACTLY as `fullName` — no
   * `${namespace}:` prefix is applied by `defineEvents()`, regardless of the
   * namespace it was called with.
   *
   * For preserving a pre-existing/legacy event-name string BYTE-IDENTICALLY
   * while migrating it onto `defineEvents()` — most commonly a bare
   * kebab-case string (no colon) that other, not-yet-migrated call sites
   * still dispatch/listen for directly. Using `event()` instead here would
   * silently change the runtime string and break that shared literal match.
   */
  export function raw<T = void>(fullName: string): EventDef<T> {
    return { baseName: fullName, __raw: true };
  }
}

type EventSchema = Record<string, EventDef<any>>;

/** A single resolved, dispatchable/listenable event within a `defineEvents()` registry. */
export interface ResolvedEvent<T> {
  /**
   * Fully-qualified event name — namespace-prefixed (e.g. 'chat:view-mode-change')
   * for an `event()` entry, or used verbatim for an `event.raw()` entry.
   */
  readonly name: string;
  /**
   * Dispatch this event with a typed payload. Browser-only — throws if called
   * outside a browser context (SSR/RSC) rather than surfacing a bare
   * `ReferenceError: window is not defined` from inside a shared package.
   */
  dispatch(detail: T, target?: EventTarget): void;
  /**
   * Listen for this event with a typed handler. Browser-only — throws if
   * called outside a browser context. Returns an unsubscribe function.
   */
  listen(
    handler: (detail: T, event: CustomEvent<T>) => void,
    target?: EventTarget
  ): () => void;
}

type ResolvedEventSchema<NS extends string, S extends EventSchema> = {
  [K in keyof S]: S[K] extends EventDef<infer T> ? ResolvedEvent<T> : never;
} & { readonly namespace: `${NS}:` };

function assertBrowserContext(fnName: string): void {
  if (typeof window === 'undefined') {
    throw new Error(
      `EventRegistry: ${fnName}() called outside a browser context (window is undefined) — ` +
        'this usually means it ran during SSR/RSC. Guard the call site with a browser check, ' +
        'or call it only from an effect/event handler.'
    );
  }
}

/**
 * Define a namespace-scoped, typed event registry.
 *
 * @param namespace  Short string prefix (e.g. 'chat', 'voice', 'openclaw').
 *                   Automatically prepended, colon-separated, to every `event()` entry's
 *                   name — formalizes the `supernal:`/`voice:`/`openclaw:` convention
 *                   already in live use across the dashboard. An `event.raw()` entry
 *                   ignores this prefix entirely (see `event.raw()`'s own doc comment).
 * @param schema     Object of `event<T>(baseName)`/`event.raw<T>(fullName)` declarations.
 * @returns          A registry object with the same keys as `schema`, each now a
 *                    `ResolvedEvent<T>` with `.name`/`.dispatch()`/`.listen()`, plus a
 *                    `namespace` property.
 */
export function defineEvents<NS extends string, S extends EventSchema>(
  namespace: NS,
  schema: S
): ResolvedEventSchema<NS, S> {
  const result: Record<string, unknown> = {};

  for (const [key, def] of Object.entries(schema)) {
    const name = def.__raw ? def.baseName : `${namespace}:${def.baseName}`;

    const resolved: ResolvedEvent<unknown> = {
      name,
      dispatch(detail, target) {
        assertBrowserContext('dispatch');
        const eventTarget = target ?? window;
        eventTarget.dispatchEvent(new CustomEvent(name, { detail }));
      },
      listen(handler, target) {
        assertBrowserContext('listen');
        const eventTarget = target ?? window;
        const domHandler = (evt: Event) => {
          const customEvent = evt as CustomEvent<unknown>;
          handler(customEvent.detail, customEvent as CustomEvent<any>);
        };
        eventTarget.addEventListener(name, domHandler);
        return () => eventTarget.removeEventListener(name, domHandler);
      },
    };

    result[key] = resolved;
  }

  Object.defineProperty(result, 'namespace', {
    value: `${namespace}:` as const,
    enumerable: true,
    writable: false,
  });

  return result as ResolvedEventSchema<NS, S>;
}
