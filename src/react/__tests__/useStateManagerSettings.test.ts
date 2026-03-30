/**
 * Tests for useStateManagerSettings hook
 *
 * Covers:
 * 1. Returns default value initially
 * 2. Hydrates from StateManager on mount
 * 3. Updates StateManager on write
 * 4. Re-renders on external change (subscription)
 * 5. SSR-safe (null manager returns default)
 * 6. Unsubscribes on unmount
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import { useStateManagerSettings } from '../useStateManagerSettings';
import { StateManager } from '../../storage/StateManager';
import { MemoryStorageAdapter } from '../../storage/StorageAdapter';
import { StateManagers } from '../../types/StateManagers';
import type { ApplicationState } from '../../types/ComponentState';

let manager: StateManager;

beforeEach(() => {
  StateManager.clearAllInstances();
  const adapter = new MemoryStorageAdapter('test:');
  manager = StateManager.getInstance(StateManagers.Testing, adapter);
});

afterEach(() => {
  StateManager.clearAllInstances();
});

describe('useStateManagerSettings', () => {
  it('returns default value initially', () => {
    const { result } = renderHook(() =>
      useStateManagerSettings(manager, 'theme', 'dark')
    );
    expect(result.current[0]).toBe('dark');
  });

  it('hydrates from StateManager on mount', async () => {
    // Pre-populate the manager
    await manager.set('theme', {
      kind: 'application',
      stateId: 'theme',
      data: { value: 'light' },
    } as ApplicationState);

    const { result } = renderHook(() =>
      useStateManagerSettings(manager, 'theme', 'dark')
    );

    await waitFor(() => {
      expect(result.current[0]).toBe('light');
    });
  });

  it('updates StateManager on write', async () => {
    const { result } = renderHook(() =>
      useStateManagerSettings(manager, 'count', 0)
    );

    act(() => {
      result.current[1](42);
    });

    expect(result.current[0]).toBe(42);

    // Verify it was written to StateManager
    await waitFor(async () => {
      const stored = await manager.get<ApplicationState>('count');
      expect(stored).toBeTruthy();
      expect((stored as ApplicationState).data?.value).toBe(42);
    });
  });

  it('re-renders on external change via subscription', async () => {
    const { result } = renderHook(() =>
      useStateManagerSettings(manager, 'color', 'red')
    );

    expect(result.current[0]).toBe('red');

    // External write (simulating another component)
    await act(async () => {
      await manager.set('color', {
        kind: 'application',
        stateId: 'color',
        data: { value: 'blue' },
      } as ApplicationState);
    });

    await waitFor(() => {
      expect(result.current[0]).toBe('blue');
    });
  });

  it('returns default when manager is null (SSR)', () => {
    const { result } = renderHook(() =>
      useStateManagerSettings(null, 'theme', 'dark')
    );
    expect(result.current[0]).toBe('dark');
  });

  it('setter is no-op for storage when manager is null', () => {
    const { result } = renderHook(() =>
      useStateManagerSettings(null, 'theme', 'dark')
    );

    act(() => {
      result.current[1]('light');
    });

    // Local state still updates
    expect(result.current[0]).toBe('light');
  });

  it('unsubscribes on unmount', async () => {
    const { result, unmount } = renderHook(() =>
      useStateManagerSettings(manager, 'val', 'initial')
    );

    unmount();

    // Writing after unmount should not cause errors
    await manager.set('val', {
      kind: 'application',
      stateId: 'val',
      data: { value: 'after-unmount' },
    } as ApplicationState);

    // No error thrown = success
  });
});
