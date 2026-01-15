/**
 * LocalStorageAdapter - Browser-only storage using localStorage
 * 
 * Safe for browser bundling - no Node.js dependencies
 */

export interface StorageAdapter {
  get(key: string): Promise<any>;
  set(key: string, value: any): Promise<void>;
  delete(key: string): Promise<void>;
  clear(): Promise<void>;
  has(key: string): Promise<boolean>;
  keys(): Promise<string[]>;
}

/**
 * Storage adapter using browser localStorage
 * Compatible with SSR - checks for window availability
 */
export class LocalStorageAdapter implements StorageAdapter {
  private prefix: string;

  constructor(prefix: string = 'app_') {
    this.prefix = prefix;
  }

  private getKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  async get(key: string): Promise<any> {
    if (typeof window === 'undefined') return null;
    
    try {
      const item = localStorage.getItem(this.getKey(key));
      return item ? JSON.parse(item) : null;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('[LocalStorageAdapter] Failed to get:', key, e);
      return null;
    }
  }

  async set(key: string, value: any): Promise<void> {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(this.getKey(key), JSON.stringify(value));
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('[LocalStorageAdapter] Failed to set:', key, e);
      throw e;
    }
  }

  async delete(key: string): Promise<void> {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.removeItem(this.getKey(key));
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('[LocalStorageAdapter] Failed to delete:', key, e);
    }
  }

  async clear(): Promise<void> {
    if (typeof window === 'undefined') return;
    
    try {
      const keys = await this.keys();
      keys.forEach(key => localStorage.removeItem(this.getKey(key)));
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('[LocalStorageAdapter] Failed to clear:', e);
    }
  }

  async has(key: string): Promise<boolean> {
    if (typeof window === 'undefined') return false;
    
    return localStorage.getItem(this.getKey(key)) !== null;
  }

  async keys(): Promise<string[]> {
    if (typeof window === 'undefined') return [];
    
    const allKeys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.prefix)) {
        allKeys.push(key.substring(this.prefix.length));
      }
    }
    return allKeys;
  }
}

