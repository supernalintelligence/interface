/**
 * StorageAdapterFactory
 *
 * Environment-aware factory for creating the right StorageAdapter.
 * Auto-detects environment if not specified.
 *
 * @example
 * ```typescript
 * // Auto-detect environment
 * const adapter = StorageAdapterFactory.create();
 *
 * // Explicit environment with namespace
 * const adapter = StorageAdapterFactory.create('browser', { namespace: 'dash' });
 *
 * // Node.js file-based storage (provide your own FileStorageAdapter)
 * import { FileStorageAdapter } from '@supernal/interface-enterprise';
 * const adapter = StorageAdapterFactory.createFrom(new FileStorageAdapter('./state.json'), { namespace: 'data' });
 * ```
 */

import { StorageAdapter, LocalStorageAdapter, MemoryStorageAdapter, ChromeStorageAdapter } from './StorageAdapter';
import { NamespacedStorageAdapter } from './NamespacedStorageAdapter';

export type StorageEnvironment = 'browser' | 'chrome-mv3' | 'memory';

export interface StorageAdapterFactoryOptions {
  /** Wrap the adapter in a NamespacedStorageAdapter with this namespace */
  namespace?: string;
  /** Prefix for the underlying adapter (default varies by adapter) */
  prefix?: string;
}

export class StorageAdapterFactory {
  /**
   * Create a StorageAdapter for the given (or auto-detected) environment.
   */
  static create(
    env?: StorageEnvironment,
    options: StorageAdapterFactoryOptions = {}
  ): StorageAdapter {
    const resolved = env ?? StorageAdapterFactory.detectEnvironment();

    let adapter: StorageAdapter;

    switch (resolved) {
      case 'browser':
        adapter = new LocalStorageAdapter(options.prefix ?? 'supernal:');
        break;
      case 'chrome-mv3':
        adapter = new ChromeStorageAdapter(options.prefix ?? 'supernal:');
        break;
      case 'memory':
        adapter = new MemoryStorageAdapter(options.prefix ?? 'supernal:');
        break;
      default:
        adapter = new MemoryStorageAdapter(options.prefix ?? 'supernal:');
        break;
    }

    if (options.namespace) {
      adapter = new NamespacedStorageAdapter(adapter, options.namespace);
    }

    return adapter;
  }

  /**
   * Wrap an existing StorageAdapter with optional namespacing.
   * Useful for adapters that require special construction (e.g., FileStorageAdapter
   * from the enterprise package, or custom adapters).
   */
  static createFrom(
    adapter: StorageAdapter,
    options: Pick<StorageAdapterFactoryOptions, 'namespace'> = {}
  ): StorageAdapter {
    if (options.namespace) {
      return new NamespacedStorageAdapter(adapter, options.namespace);
    }
    return adapter;
  }

  /**
   * Detect the current runtime environment.
   */
  static detectEnvironment(): StorageEnvironment {
    // Chrome extension MV3
    if (
      typeof globalThis !== 'undefined' &&
      (globalThis as any).chrome?.storage?.local
    ) {
      return 'chrome-mv3';
    }

    // Browser with localStorage
    if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
      return 'browser';
    }

    // Fallback: memory (SSR, test, or unknown)
    return 'memory';
  }
}
