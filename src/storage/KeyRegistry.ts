/**
 * KeyRegistry — typed, namespace-scoped cache/storage key factory.
 *
 * Prevents unbounded cache key cardinality caused by embedding full query
 * strings into cache keys. Every key is a typed function that accepts only
 * the specific bounded parameters that actually drive its computation.
 *
 * Works with any storage or cache system (localStorage, getOrCompute, Redis, etc.)
 * — it only constructs strings; it has no storage dependencies.
 *
 * @example
 * ```typescript
 * const InboxKeys = defineKeyRegistry('inbox', {
 *   raw:   (sessionToken: string) => `${sessionToken}:raw`,
 *   notes: ()                     => 'notes:raw',
 * });
 *
 * InboxKeys.raw('abc123')  // → 'inbox:abc123:raw'
 * InboxKeys.notes()        // → 'inbox:notes:raw'
 * InboxKeys.prefix         // → 'inbox:'
 * ```
 */

type KeySchema = Record<string, (...args: any[]) => string>;

type PrefixedKeySchema<NS extends string, S extends KeySchema> = {
  [K in keyof S]: (...args: Parameters<S[K]>) => `${NS}:${ReturnType<S[K]>}`;
} & { readonly prefix: `${NS}:` };

/**
 * Define a namespace-scoped key registry.
 *
 * @param namespace  Short string prefix (e.g. 'inbox', 'search', 'unified').
 *                   Automatically prepended to every generated key.
 * @param schema     Object of key-generating functions.
 *                   Each function must accept only bounded parameters —
 *                   never raw query strings or URLSearchParams.
 * @returns          A registry object with the same keys as `schema`,
 *                   each function now prepending `namespace:`, plus
 *                   a `prefix` property for use with prefix-based invalidation.
 */
export function defineKeyRegistry<NS extends string, S extends KeySchema>(
  namespace: NS,
  schema: S
): PrefixedKeySchema<NS, S> {
  const result: Record<string, unknown> = {};

  for (const [key, fn] of Object.entries(schema)) {
    result[key] = (...args: unknown[]) => `${namespace}:${fn(...args)}`;
  }

  Object.defineProperty(result, 'prefix', {
    value: `${namespace}:` as const,
    enumerable: true,
    writable: false,
  });

  return result as PrefixedKeySchema<NS, S>;
}

/**
 * Convenience: define a static (no-argument) key registry.
 * For namespaces where every key is a single global value.
 *
 * @example
 * ```typescript
 * const GlobalKeys = defineStaticKeys({
 *   agentsList:   'agents:list',
 *   pluginsList:  'plugins:list',
 * });
 * GlobalKeys.agentsList  // → 'agents:list'
 * ```
 */
export function defineStaticKeys<T extends Record<string, string>>(keys: T): Readonly<T> {
  return Object.freeze({ ...keys });
}
