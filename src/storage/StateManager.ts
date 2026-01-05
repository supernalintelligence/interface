/**
 * State Manager
 * 
 * Hierarchical state management with named instances and pluggable storage adapters.
 * 
 * Key Features:
 * - Named instances for multi-context support
 * - Plugin storage adapters (MV3-safe)
 * - Path-based state access
 * - Subscription system
 * - No default adapter (must be injected)
 * 
 * @example
 * ```typescript
 * // Browser
 * const state = StateManager.getInstance(
 *   StateManagers.SupernalCoreV1,
 *   new LocalStorageAdapter()
 * );
 * 
 * // Chrome Extension MV3
 * const state = StateManager.getInstance(
 *   StateManagers.SupernalCoreV1,
 *   new ChromeStorageAdapter()
 * );
 * 
 * // Testing
 * const state = StateManager.getInstance(
 *   StateManagers.Testing,
 *   new MemoryStorageAdapter()
 * );
 * ```
 */

import { StateManagers } from '../types/StateManagers';
import { ComponentState } from '../types/ComponentState';
import { StorageAdapter } from './StorageAdapter';

/**
 * Subscription callback type
 */
export type StateSubscriber<T = any> = (state: T, prevState: T | null) => void;

/**
 * Subscription handle for cleanup
 */
export interface SubscriptionHandle {
  unsubscribe: () => void;
}

/**
 * State Manager Options
 */
export interface StateManagerOptions {
  /**
   * Whether to auto-save on state changes
   * @default true
   */
  autoSave?: boolean;
  
  /**
   * Debounce time for auto-save (ms)
   * @default 100
   */
  saveDebounce?: number;
  
  /**
   * Whether to enable verbose logging
   * @default false
   */
  debug?: boolean;
}

/**
 * Named State Manager with plugin storage
 */
export class StateManager {
  /**
   * Registry of named StateManager instances
   */
  private static instances = new Map<StateManagers, StateManager>();
  
  /**
   * Instance name (from StateManagers enum)
   */
  private readonly name: StateManagers;
  
  /**
   * Storage adapter (injected, no default)
   */
  private readonly adapter: StorageAdapter;
  
  /**
   * In-memory state cache
   */
  private state: Map<string, ComponentState> = new Map();
  
  /**
   * Subscribers for state changes
   */
  private subscribers: Map<string, Set<StateSubscriber>> = new Map();
  
  /**
   * Options
   */
  private options: Required<StateManagerOptions>;
  
  /**
   * Save timeout for debouncing
   */
  private saveTimeout: NodeJS.Timeout | null = null;
  
  /**
   * Private constructor (use getInstance)
   */
  private constructor(
    name: StateManagers,
    adapter: StorageAdapter,
    options: StateManagerOptions = {}
  ) {
    this.name = name;
    this.adapter = adapter;
    this.options = {
      autoSave: options.autoSave ?? true,
      saveDebounce: options.saveDebounce ?? 100,
      debug: options.debug ?? false,
    };
  }
  
  /**
   * Get or create a named StateManager instance
   * 
   * CRITICAL: Storage adapter MUST be provided. No default adapter.
   * 
   * @param name The StateManager name
   * @param adapter The storage adapter to use
   * @param options Optional configuration
   */
  static getInstance(
    name: StateManagers,
    adapter: StorageAdapter,
    options?: StateManagerOptions
  ): StateManager {
    if (!StateManager.instances.has(name)) {
      StateManager.instances.set(name, new StateManager(name, adapter, options));
    }
    return StateManager.instances.get(name)!;
  }
  
  /**
   * Clear all instances (useful for testing)
   */
  static clearAllInstances(): void {
    StateManager.instances.clear();
  }
  
  /**
   * Get instance name
   */
  getName(): StateManagers {
    return this.name;
  }
  
  /**
   * Initialize from storage
   * Loads persisted state into memory
   */
  async initialize(): Promise<void> {
    try {
      const keys = await this.adapter.keys();
      const stateKeys = keys.filter(k => k.startsWith(`${this.name}:state:`));
      
      for (const key of stateKeys) {
        const componentId = key.replace(`${this.name}:state:`, '');
        const state = await this.adapter.get(key);
        if (state) {
          this.state.set(componentId, state);
        }
      }
      
      if (this.options.debug) {
        console.log(`[StateManager:${this.name}] Initialized with ${this.state.size} states`);
      }
    } catch (err) {
      console.error(`[StateManager:${this.name}] Failed to initialize:`, err);
      throw err;
    }
  }
  
  /**
   * Get component state by ID
   */
  async get<T extends ComponentState = ComponentState>(componentId: string): Promise<T | null> {
    // Check memory cache first
    if (this.state.has(componentId)) {
      return this.state.get(componentId) as T;
    }
    
    // Check storage
    const key = `${this.name}:state:${componentId}`;
    const state = await this.adapter.get(key);
    
    if (state) {
      this.state.set(componentId, state);
      return state as T;
    }
    
    return null;
  }
  
  /**
   * Set component state
   */
  async set<T extends ComponentState = ComponentState>(
    componentId: string,
    state: T
  ): Promise<void> {
    const prevState = this.state.get(componentId) ?? null;
    
    // Update memory cache
    this.state.set(componentId, state);
    
    // Notify subscribers
    this.notifySubscribers(componentId, state, prevState);
    
    // Auto-save if enabled
    if (this.options.autoSave) {
      this.scheduleSave(componentId, state);
    }
    
    if (this.options.debug) {
      console.log(`[StateManager:${this.name}] Set state for ${componentId}`, state);
    }
  }
  
  /**
   * Merge partial state (shallow merge)
   */
  async merge<T extends ComponentState = ComponentState>(
    componentId: string,
    partialState: Partial<T>
  ): Promise<void> {
    const currentState = await this.get<T>(componentId);
    
    if (!currentState) {
      throw new Error(`Cannot merge: no state found for component ${componentId}`);
    }
    
    const newState = { ...currentState, ...partialState } as T;
    await this.set(componentId, newState);
  }
  
  /**
   * Delete component state
   */
  async delete(componentId: string): Promise<void> {
    const prevState = this.state.get(componentId) ?? null;
    
    // Remove from memory
    this.state.delete(componentId);
    
    // Remove from storage
    const key = `${this.name}:state:${componentId}`;
    await this.adapter.delete(key);
    
    // Notify subscribers
    this.notifySubscribers(componentId, null as any, prevState);
    
    if (this.options.debug) {
      console.log(`[StateManager:${this.name}] Deleted state for ${componentId}`);
    }
  }
  
  /**
   * Restore state from storage (force refresh)
   */
  async restore(componentId: string): Promise<ComponentState | null> {
    const key = `${this.name}:state:${componentId}`;
    const state = await this.adapter.get(key);
    
    if (state) {
      this.state.set(componentId, state);
      this.notifySubscribers(componentId, state, null);
    }
    
    return state;
  }
  
  /**
   * Subscribe to state changes for a component
   */
  subscribe<T extends ComponentState = ComponentState>(
    componentId: string,
    callback: StateSubscriber<T>
  ): SubscriptionHandle {
    if (!this.subscribers.has(componentId)) {
      this.subscribers.set(componentId, new Set());
    }
    
    this.subscribers.get(componentId)!.add(callback as StateSubscriber);
    
    if (this.options.debug) {
      console.log(`[StateManager:${this.name}] Subscribed to ${componentId}`);
    }
    
    return {
      unsubscribe: () => {
        const subs = this.subscribers.get(componentId);
        if (subs) {
          subs.delete(callback as StateSubscriber);
          if (subs.size === 0) {
            this.subscribers.delete(componentId);
          }
        }
      },
    };
  }
  
  /**
   * Get all component IDs
   */
  async keys(): Promise<string[]> {
    return Array.from(this.state.keys());
  }
  
  /**
   * Get all states
   */
  async getAll(): Promise<Map<string, ComponentState>> {
    return new Map(this.state);
  }
  
  /**
   * Clear all state (memory + storage)
   */
  async clear(): Promise<void> {
    const keys = await this.adapter.keys();
    const stateKeys = keys.filter(k => k.startsWith(`${this.name}:state:`));
    
    for (const key of stateKeys) {
      await this.adapter.delete(key);
    }
    
    this.state.clear();
    this.subscribers.clear();
    
    if (this.options.debug) {
      console.log(`[StateManager:${this.name}] Cleared all state`);
    }
  }
  
  /**
   * Notify subscribers of state changes
   */
  private notifySubscribers(
    componentId: string,
    state: ComponentState | null,
    prevState: ComponentState | null
  ): void {
    const subs = this.subscribers.get(componentId);
    if (subs) {
      subs.forEach(callback => {
        try {
          callback(state as any, prevState);
        } catch (err) {
          console.error(`[StateManager:${this.name}] Subscriber error:`, err);
        }
      });
    }
  }
  
  /**
   * Schedule a save with debouncing
   */
  private scheduleSave(componentId: string, state: ComponentState): void {
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }
    
    this.saveTimeout = setTimeout(async () => {
      const key = `${this.name}:state:${componentId}`;
      try {
        await this.adapter.set(key, state);
        if (this.options.debug) {
          console.log(`[StateManager:${this.name}] Saved state for ${componentId}`);
        }
      } catch (err) {
        console.error(`[StateManager:${this.name}] Failed to save state:`, err);
      }
    }, this.options.saveDebounce);
  }
  
  /**
   * Flush pending saves immediately
   */
  async flush(): Promise<void> {
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
      this.saveTimeout = null;
    }
    
    // Save all current states
    const saves = Array.from(this.state.entries()).map(async ([componentId, state]) => {
      const key = `${this.name}:state:${componentId}`;
      await this.adapter.set(key, state);
    });
    
    await Promise.all(saves);
    
    if (this.options.debug) {
      console.log(`[StateManager:${this.name}] Flushed ${saves.length} states`);
    }
  }
}

