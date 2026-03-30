/**
 * Tests for NamespacedStorageAdapter
 *
 * Covers:
 * 1. Key prefixing on get/set/delete
 * 2. Key isolation between namespaces
 * 3. keys() returns only namespace-scoped keys
 * 4. clear() removes only namespace-scoped keys
 * 5. getMultiple/setMultiple passthrough when adapter supports them
 * 6. getMultiple/setMultiple fallback when adapter doesn't support them
 */

import { MemoryStorageAdapter } from '../StorageAdapter';
import { NamespacedStorageAdapter } from '../NamespacedStorageAdapter';

describe('NamespacedStorageAdapter', () => {
  let base: MemoryStorageAdapter;

  beforeEach(() => {
    base = new MemoryStorageAdapter('');
  });

  // ── Key prefixing ────────────────────────────────────────────────────

  it('prefixes keys on set and get', async () => {
    const ns = new NamespacedStorageAdapter(base, 'app');
    await ns.set('theme', 'dark');

    // The underlying adapter should have the prefixed key
    expect(await base.get('app:theme')).toBe('dark');

    // Reading through the namespace returns the value
    expect(await ns.get('theme')).toBe('dark');
  });

  it('prefixes keys on delete', async () => {
    const ns = new NamespacedStorageAdapter(base, 'app');
    await ns.set('theme', 'dark');
    await ns.delete('theme');

    expect(await base.get('app:theme')).toBeNull();
    expect(await ns.get('theme')).toBeNull();
  });

  // ── Key isolation ────────────────────────────────────────────────────

  it('isolates keys between namespaces', async () => {
    const nsA = new NamespacedStorageAdapter(base, 'dash');
    const nsB = new NamespacedStorageAdapter(base, 'plugin');

    await nsA.set('theme', 'dark');
    await nsB.set('theme', 'light');

    expect(await nsA.get('theme')).toBe('dark');
    expect(await nsB.get('theme')).toBe('light');
  });

  it('keys() returns only keys in this namespace', async () => {
    const nsA = new NamespacedStorageAdapter(base, 'a');
    const nsB = new NamespacedStorageAdapter(base, 'b');

    await nsA.set('x', 1);
    await nsA.set('y', 2);
    await nsB.set('z', 3);

    const keysA = await nsA.keys();
    const keysB = await nsB.keys();

    expect(keysA.sort()).toEqual(['x', 'y']);
    expect(keysB).toEqual(['z']);
  });

  it('clear() removes only keys in this namespace', async () => {
    const nsA = new NamespacedStorageAdapter(base, 'a');
    const nsB = new NamespacedStorageAdapter(base, 'b');

    await nsA.set('x', 1);
    await nsB.set('y', 2);

    await nsA.clear();

    expect(await nsA.get('x')).toBeNull();
    expect(await nsB.get('y')).toBe(2);
  });

  // ── getMultiple/setMultiple passthrough ──────────────────────────────

  it('passes through getMultiple when underlying adapter supports it', async () => {
    const ns = new NamespacedStorageAdapter(base, 'ns');
    await ns.set('a', 1);
    await ns.set('b', 2);
    await ns.set('c', 3);

    const result = await ns.getMultiple(['a', 'c']);
    expect(result).toEqual({ a: 1, c: 3 });
  });

  it('passes through setMultiple when underlying adapter supports it', async () => {
    const ns = new NamespacedStorageAdapter(base, 'ns');
    await ns.setMultiple({ x: 10, y: 20 });

    expect(await ns.get('x')).toBe(10);
    expect(await ns.get('y')).toBe(20);
  });

  // ── getMultiple/setMultiple fallback ─────────────────────────────────

  it('falls back to sequential gets when adapter lacks getMultiple', async () => {
    // Create a minimal adapter without getMultiple
    const minimal = {
      storage: new Map<string, any>(),
      async get(key: string) { return this.storage.get(key) ?? null; },
      async set(key: string, value: any) { this.storage.set(key, value); },
      async delete(key: string) { this.storage.delete(key); },
      async keys() { return Array.from(this.storage.keys()); },
    };

    const ns = new NamespacedStorageAdapter(minimal, 'ns');
    await ns.set('a', 1);
    await ns.set('b', 2);

    const result = await ns.getMultiple(['a', 'b']);
    expect(result).toEqual({ a: 1, b: 2 });
  });

  it('falls back to sequential sets when adapter lacks setMultiple', async () => {
    const minimal = {
      storage: new Map<string, any>(),
      async get(key: string) { return this.storage.get(key) ?? null; },
      async set(key: string, value: any) { this.storage.set(key, value); },
      async delete(key: string) { this.storage.delete(key); },
      async keys() { return Array.from(this.storage.keys()); },
    };

    const ns = new NamespacedStorageAdapter(minimal, 'ns');
    await ns.setMultiple({ x: 10, y: 20 });

    expect(await ns.get('x')).toBe(10);
    expect(await ns.get('y')).toBe(20);
  });

  // ── Complex values ───────────────────────────────────────────────────

  it('handles complex JSON values', async () => {
    const ns = new NamespacedStorageAdapter(base, 'ns');
    const obj = { nested: { arr: [1, 2, 3] }, flag: true };
    await ns.set('config', obj);

    expect(await ns.get('config')).toEqual(obj);
  });

  it('returns null for missing keys', async () => {
    const ns = new NamespacedStorageAdapter(base, 'ns');
    expect(await ns.get('nonexistent')).toBeNull();
  });
});
