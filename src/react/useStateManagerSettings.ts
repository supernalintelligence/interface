/**
 * useStateManagerSettings — Generic React hook bridging typed settings to StateManager
 *
 * SSR-safe. Subscribes to StateManager for cross-component reactivity:
 * when one component writes a setting, all other components watching the
 * same key re-render automatically.
 *
 * @example
 * ```typescript
 * const manager = StateManager.getInstance(StateManagers.DashboardSettings, adapter);
 * const [theme, setTheme] = useStateManagerSettings(manager, 'theme', 'dark');
 * ```
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { StateManager } from '../storage/StateManager';
import type { ApplicationState } from '../types/ComponentState';

/**
 * Hook that reads/writes a single key through a StateManager instance.
 *
 * @param manager - StateManager instance (or null for SSR)
 * @param key - The setting key (used as componentId in StateManager)
 * @param defaultValue - Fallback value when key is absent
 * @returns [value, setValue] tuple
 */
export function useStateManagerSettings<T>(
  manager: StateManager | null,
  key: string,
  defaultValue: T
): [T, (value: T) => void] {
  const [value, setValueState] = useState<T>(defaultValue);
  const isHydratedRef = useRef(false);

  // Hydrate from StateManager on mount + subscribe to changes
  useEffect(() => {
    if (!manager) return;

    let cancelled = false;

    // Hydrate
    (async () => {
      try {
        const stored = await manager.get<ApplicationState>(key);
        if (!cancelled && stored && stored.kind === 'application' && stored.data) {
          setValueState(stored.data.value as T);
        }
      } catch {
        // Ignore hydration errors — keep default
      }
      if (!cancelled) {
        isHydratedRef.current = true;
      }
    })();

    // Subscribe to external changes
    const handle = manager.subscribe<ApplicationState>(key, (state) => {
      if (state && state.kind === 'application' && state.data) {
        setValueState(state.data.value as T);
      }
    });

    return () => {
      cancelled = true;
      handle.unsubscribe();
    };
  }, [manager, key]);

  // Write to StateManager immediately
  const setValue = useCallback(
    (newValue: T) => {
      setValueState(newValue);
      if (manager) {
        const state: ApplicationState = {
          kind: 'application',
          stateId: key,
          data: { value: newValue },
          lastUpdated: Date.now(),
        };
        manager.set(key, state).catch(() => {
          // Write failure — value already updated in local state
        });
      }
    },
    [manager, key]
  );

  return [value, setValue];
}
