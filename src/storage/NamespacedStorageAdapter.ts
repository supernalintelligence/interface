/**
 * NamespacedStorageAdapter
 *
 * Wraps any StorageAdapter with automatic key prefixing.
 * Allows multiple logical stores (dashboard settings, user session, plugin data)
 * to share one physical adapter without key collisions.
 *
 * @example
 * ```typescript
 * const base = new LocalStorageAdapter();
 * const dashSettings = new NamespacedStorageAdapter(base, 'dash');
 * const pluginData = new NamespacedStorageAdapter(base, 'plugin');
 *
 * // These write to different keys: "dash:theme" vs "plugin:theme"
 * await dashSettings.set('theme', 'dark');
 * await pluginData.set('theme', 'light');
 * ```
 */

import { StorageAdapter } from './StorageAdapter';

export class NamespacedStorageAdapter implements StorageAdapter {
  private readonly adapter: StorageAdapter;
  private readonly prefix: string;

  constructor(adapter: StorageAdapter, namespace: string) {
    this.adapter = adapter;
    this.prefix = `${namespace}:`;
  }

  async get(key: string): Promise<any> {
    return this.adapter.get(this.prefix + key);
  }

  async set(key: string, value: any): Promise<void> {
    return this.adapter.set(this.prefix + key, value);
  }

  async delete(key: string): Promise<void> {
    return this.adapter.delete(this.prefix + key);
  }

  async keys(): Promise<string[]> {
    const allKeys = await this.adapter.keys();
    return allKeys
      .filter(k => k.startsWith(this.prefix))
      .map(k => k.substring(this.prefix.length));
  }

  async clear(): Promise<void> {
    const namespacedKeys = await this.keys();
    for (const key of namespacedKeys) {
      await this.adapter.delete(this.prefix + key);
    }
  }

  async getMultiple(keys: string[]): Promise<Record<string, any>> {
    if (this.adapter.getMultiple) {
      const prefixedKeys = keys.map(k => this.prefix + k);
      const result = await this.adapter.getMultiple(prefixedKeys);
      const unprefixed: Record<string, any> = {};
      for (const [key, value] of Object.entries(result)) {
        if (key.startsWith(this.prefix)) {
          unprefixed[key.substring(this.prefix.length)] = value;
        }
      }
      return unprefixed;
    }
    // Fallback: sequential gets
    const result: Record<string, any> = {};
    for (const key of keys) {
      const value = await this.get(key);
      if (value !== null) {
        result[key] = value;
      }
    }
    return result;
  }

  async setMultiple(entries: Record<string, any>): Promise<void> {
    if (this.adapter.setMultiple) {
      const prefixed: Record<string, any> = {};
      for (const [key, value] of Object.entries(entries)) {
        prefixed[this.prefix + key] = value;
      }
      return this.adapter.setMultiple(prefixed);
    }
    // Fallback: sequential sets
    for (const [key, value] of Object.entries(entries)) {
      await this.set(key, value);
    }
  }
}
