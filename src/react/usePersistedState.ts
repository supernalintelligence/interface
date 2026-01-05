/**
 * usePersistedState - SSR-safe state persistence hook
 * 
 * Like useState, but persists using StateManager and handles hydration properly.
 * Uses the storage adapter pattern for pluggable persistence.
 * 
 * @example
 * ```tsx
 * const [count, setCount] = usePersistedState('my-count', 0);
 * ```
 */

import { useState, useEffect } from 'react';
import { StateManager } from '../storage/StateManager';
import { LocalStorageAdapter } from '../storage/LocalStorageAdapter';
import { StateManagers } from '../types/StateManagers';
import type { ComponentState } from '../types/ComponentState';

// Get or create a singleton StateManager for browser usage
let browserStateManager: StateManager | null = null;

function getBrowserStateManager(): StateManager {
  if (!browserStateManager && typeof window !== 'undefined') {
    browserStateManager = StateManager.getInstance(
      StateManagers.SupernalCoreV1,
      new LocalStorageAdapter()
    );
  }
  return browserStateManager!;
}

export function usePersistedState<T>(
  key: string,
  defaultValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  // Always start with default value (matches SSR)
  const [state, setState] = useState<T>(defaultValue);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate from storage after mount (client-only)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const stateManager = getBrowserStateManager();
    
    (async () => {
      try {
        await stateManager.initialize();
        const stored = await stateManager.get<ComponentState & { value: T }>(key);
        if (stored && 'value' in stored) {
          setState(stored.value);
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn(`[usePersistedState] Failed to load "${key}":`, e);
      }
      
      setIsHydrated(true);
    })();
  }, [key]);

  // Persist to storage on changes (but only after hydration)
  useEffect(() => {
    if (!isHydrated || typeof window === 'undefined') return;
    
    const stateManager = getBrowserStateManager();
    
    (async () => {
      try {
        await stateManager.set<ComponentState & { value: T }>(key, {
          kind: 'ui-component',
          componentId: key,
          value: state
        } as any);  // Type assertion needed as we're adding custom 'value' field
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn(`[usePersistedState] Failed to save "${key}":`, e);
      }
    })();
  }, [key, state, isHydrated]);

  return [state, setState];
}

