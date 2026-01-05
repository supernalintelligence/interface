/**
 * Storage Adapter Interface
 * 
 * Defines the contract for environment-specific persistence.
 * Implementations include:
 * - LocalStorageAdapter (browser)
 * - ChromeStorageAdapter (Chrome MV3)
 * - FileStorageAdapter (Node.js)
 * - MemoryStorageAdapter (testing)
 */

/**
 * Storage adapter interface for environment-agnostic persistence
 */
export interface StorageAdapter {
  /**
   * Get a value by key
   * @param key The storage key
   * @returns The stored value or null if not found
   */
  get(key: string): Promise<any>;
  
  /**
   * Set a value for a key
   * @param key The storage key
   * @param value The value to store
   */
  set(key: string, value: any): Promise<void>;
  
  /**
   * Delete a key
   * @param key The storage key
   */
  delete(key: string): Promise<void>;
  
  /**
   * Get all keys
   * @returns Array of all storage keys
   */
  keys(): Promise<string[]>;
  
  /**
   * Clear all storage
   */
  clear?(): Promise<void>;
  
  /**
   * Get multiple keys at once (optional optimization)
   */
  getMultiple?(keys: string[]): Promise<Record<string, any>>;
  
  /**
   * Set multiple keys at once (optional optimization)
   */
  setMultiple?(entries: Record<string, any>): Promise<void>;
}

/**
 * LocalStorage adapter for browser environments
 */
export class LocalStorageAdapter implements StorageAdapter {
  private prefix: string;
  
  constructor(prefix: string = 'supernal:') {
    this.prefix = prefix;
  }
  
  async get(key: string): Promise<any> {
    const item = localStorage.getItem(this.prefix + key);
    if (item === null) return null;
    try {
      return JSON.parse(item);
    } catch {
      return item;
    }
  }
  
  async set(key: string, value: any): Promise<void> {
    localStorage.setItem(this.prefix + key, JSON.stringify(value));
  }
  
  async delete(key: string): Promise<void> {
    localStorage.removeItem(this.prefix + key);
  }
  
  async keys(): Promise<string[]> {
    const allKeys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.prefix)) {
        allKeys.push(key.substring(this.prefix.length));
      }
    }
    return allKeys;
  }
  
  async clear(): Promise<void> {
    const keysToRemove = await this.keys();
    keysToRemove.forEach(key => localStorage.removeItem(this.prefix + key));
  }
}

/**
 * Chrome Storage adapter for Chrome Extension MV3
 * CRITICAL: Must be imported only in extension context
 */
export class ChromeStorageAdapter implements StorageAdapter {
  private prefix: string;
  
  constructor(prefix: string = 'supernal:') {
    this.prefix = prefix;
  }
  
  async get(key: string): Promise<any> {
    // Type assertion for chrome global
    const chromeAPI = (globalThis as any).chrome;
    const result = await chromeAPI.storage.local.get(this.prefix + key);
    return result[this.prefix + key] ?? null;
  }
  
  async set(key: string, value: any): Promise<void> {
    const chromeAPI = (globalThis as any).chrome;
    await chromeAPI.storage.local.set({ [this.prefix + key]: value });
  }
  
  async delete(key: string): Promise<void> {
    const chromeAPI = (globalThis as any).chrome;
    await chromeAPI.storage.local.remove(this.prefix + key);
  }
  
  async keys(): Promise<string[]> {
    const chromeAPI = (globalThis as any).chrome;
    const result = await chromeAPI.storage.local.get(null);
    return Object.keys(result)
      .filter(k => k.startsWith(this.prefix))
      .map(k => k.substring(this.prefix.length));
  }
  
  async clear(): Promise<void> {
    const keysToRemove = (await this.keys()).map(k => this.prefix + k);
    const chromeAPI = (globalThis as any).chrome;
    await chromeAPI.storage.local.remove(keysToRemove);
  }
  
  async getMultiple(keys: string[]): Promise<Record<string, any>> {
    const prefixedKeys = keys.map(k => this.prefix + k);
    const chromeAPI = (globalThis as any).chrome;
    const result = await chromeAPI.storage.local.get(prefixedKeys);
    
    // Remove prefix from keys in result
    const unprefixed: Record<string, any> = {};
    for (const [key, value] of Object.entries(result)) {
      const unprefixedKey = key.substring(this.prefix.length);
      unprefixed[unprefixedKey] = value;
    }
    return unprefixed;
  }
  
  async setMultiple(entries: Record<string, any>): Promise<void> {
    const prefixed: Record<string, any> = {};
    for (const [key, value] of Object.entries(entries)) {
      prefixed[this.prefix + key] = value;
    }
    const chromeAPI = (globalThis as any).chrome;
    await chromeAPI.storage.local.set(prefixed);
  }
}

/**
 * Memory Storage adapter for testing
 * In-memory implementation that doesn't persist
 * Deep clones values to prevent mutations
 */
export class MemoryStorageAdapter implements StorageAdapter {
  private storage: Map<string, any> = new Map();
  private prefix: string;
  
  constructor(prefix: string = 'supernal:') {
    this.prefix = prefix;
  }
  
  async get(key: string): Promise<any> {
    const value = this.storage.get(this.prefix + key);
    if (value === undefined) return null;
    // Deep clone to prevent mutations
    return JSON.parse(JSON.stringify(value));
  }
  
  async set(key: string, value: any): Promise<void> {
    // Deep clone to prevent mutations
    this.storage.set(this.prefix + key, JSON.parse(JSON.stringify(value)));
  }
  
  async delete(key: string): Promise<void> {
    this.storage.delete(this.prefix + key);
  }
  
  async keys(): Promise<string[]> {
    const allKeys: string[] = [];
    for (const key of this.storage.keys()) {
      if (key.startsWith(this.prefix)) {
        allKeys.push(key.substring(this.prefix.length));
      }
    }
    return allKeys;
  }
  
  async clear(): Promise<void> {
    const keysToRemove = await this.keys();
    keysToRemove.forEach(key => this.storage.delete(this.prefix + key));
  }
  
  async getMultiple(keys: string[]): Promise<Record<string, any>> {
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
    for (const [key, value] of Object.entries(entries)) {
      await this.set(key, value);
    }
  }
}

