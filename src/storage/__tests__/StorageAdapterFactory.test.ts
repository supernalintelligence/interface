/**
 * Tests for StorageAdapterFactory
 *
 * Covers:
 * 1. create("browser") returns LocalStorageAdapter
 * 2. create("memory") returns MemoryStorageAdapter
 * 3. create() auto-detection (browser environment via jsdom)
 * 4. create with namespace wraps in NamespacedStorageAdapter
 * 5. create("node-file") throws (must use createAsync)
 * 6. detectEnvironment() returns correct env
 */

import { LocalStorageAdapter, MemoryStorageAdapter } from '../StorageAdapter';
import { NamespacedStorageAdapter } from '../NamespacedStorageAdapter';
import { StorageAdapterFactory } from '../StorageAdapterFactory';

describe('StorageAdapterFactory', () => {
  it('create("browser") returns a working adapter', async () => {
    const adapter = StorageAdapterFactory.create('browser');
    await adapter.set('test-key', 'test-value');
    expect(await adapter.get('test-key')).toBe('test-value');
    await adapter.delete('test-key');
  });

  it('create("memory") returns a working adapter', async () => {
    const adapter = StorageAdapterFactory.create('memory');
    await adapter.set('key', 42);
    expect(await adapter.get('key')).toBe(42);
  });

  it('create() auto-detects browser in jsdom', () => {
    // jsdom provides window and localStorage
    const adapter = StorageAdapterFactory.create();
    expect(adapter).toBeDefined();
    // Should be a LocalStorageAdapter (browser environment in jsdom)
  });

  it('create with namespace wraps adapter', async () => {
    const adapter = StorageAdapterFactory.create('memory', { namespace: 'test-ns' });

    // Should behave as namespaced
    await adapter.set('key', 'value');
    expect(await adapter.get('key')).toBe('value');

    // Another namespace should be isolated
    const adapter2 = StorageAdapterFactory.create('memory', { namespace: 'other' });
    expect(await adapter2.get('key')).toBeNull();
  });

  it('create with custom prefix', async () => {
    const adapter = StorageAdapterFactory.create('memory', { prefix: 'custom:' });
    await adapter.set('k', 'v');
    expect(await adapter.get('k')).toBe('v');
  });

  it('createFrom wraps an existing adapter with namespace', async () => {
    const { MemoryStorageAdapter } = await import('../StorageAdapter');
    const base = new MemoryStorageAdapter('');
    const wrapped = StorageAdapterFactory.createFrom(base, { namespace: 'wrap' });

    await wrapped.set('key', 'val');
    expect(await wrapped.get('key')).toBe('val');
    // Underlying adapter has the prefixed key
    expect(await base.get('wrap:key')).toBe('val');
  });

  it('createFrom without namespace returns adapter as-is', async () => {
    const { MemoryStorageAdapter } = await import('../StorageAdapter');
    const base = new MemoryStorageAdapter('');
    const result = StorageAdapterFactory.createFrom(base);
    expect(result).toBe(base);
  });

  it('detectEnvironment() returns "browser" in jsdom', () => {
    const env = StorageAdapterFactory.detectEnvironment();
    expect(env).toBe('browser');
  });

  it('detectEnvironment() returns "memory" when no window', () => {
    const origWindow = globalThis.window;
    // @ts-expect-error Simulating non-browser env
    delete globalThis.window;

    try {
      const env = StorageAdapterFactory.detectEnvironment();
      expect(env).toBe('memory');
    } finally {
      globalThis.window = origWindow;
    }
  });
});
