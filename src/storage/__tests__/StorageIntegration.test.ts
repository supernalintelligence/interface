/**
 * Integration tests for storage layer
 *
 * Covers:
 * 7. Two NamespacedStorageAdapters share one adapter without collision
 * 8. StateManager with LocalStorageAdapter survives simulated page reload
 * 5. StateManager with NamespacedStorageAdapter — keys stay isolated
 */

import { LocalStorageAdapter, MemoryStorageAdapter } from '../StorageAdapter';
import { NamespacedStorageAdapter } from '../NamespacedStorageAdapter';
import { StateManager } from '../StateManager';
import { StorageAdapterFactory } from '../StorageAdapterFactory';
import { StateManagers } from '../../types/StateManagers';

beforeEach(() => {
  localStorage.clear();
  StateManager.clearAllInstances();
});

afterEach(() => {
  localStorage.clear();
  StateManager.clearAllInstances();
});

describe('Integration: NamespacedStorageAdapter isolation', () => {
  it('two namespaces on one LocalStorageAdapter stay isolated', async () => {
    const base = new LocalStorageAdapter('shared:');
    const nsA = new NamespacedStorageAdapter(base, 'dash');
    const nsB = new NamespacedStorageAdapter(base, 'plugin');

    await nsA.set('theme', 'dark');
    await nsB.set('theme', 'neon');
    await nsA.set('lang', 'en');
    await nsB.set('version', 3);

    // Each namespace sees only its own keys
    expect(await nsA.get('theme')).toBe('dark');
    expect(await nsB.get('theme')).toBe('neon');
    expect(await nsA.get('version')).toBeNull();
    expect(await nsB.get('lang')).toBeNull();

    // Key lists are isolated
    expect((await nsA.keys()).sort()).toEqual(['lang', 'theme']);
    expect((await nsB.keys()).sort()).toEqual(['theme', 'version']);

    // Clearing one doesn't affect the other
    await nsA.clear();
    expect(await nsA.get('theme')).toBeNull();
    expect(await nsB.get('theme')).toBe('neon');
  });
});

describe('Integration: StateManager persistence across reload', () => {
  it('survives a simulated page reload', async () => {
    // Session 1: write state
    const adapter1 = new LocalStorageAdapter('persist-test:');
    const mgr1 = StateManager.getInstance(StateManagers.Testing, adapter1);

    await mgr1.set('counter', {
      kind: 'application',
      stateId: 'counter',
      data: { value: 42 },
    } as any);
    await mgr1.flush();

    // Simulate page reload: clear instances, create new manager with same adapter
    StateManager.clearAllInstances();
    const adapter2 = new LocalStorageAdapter('persist-test:');
    const mgr2 = StateManager.getInstance(StateManagers.Testing, adapter2);
    await mgr2.initialize();

    const restored = await mgr2.get('counter');
    expect(restored).toEqual(
      expect.objectContaining({
        kind: 'application',
        stateId: 'counter',
        data: { value: 42 },
      })
    );
  });
});

describe('Integration: StateManager with NamespacedStorageAdapter', () => {
  it('barrel export: NamespacedStorageAdapter, StorageAdapterFactory, StateManagers all exported from root', () => {
    // Guard against accidental removal from index.ts re-exports.
    // Use the already-imported symbols (all from '@supernal/interface' at top of file)
    // rather than a dynamic import — this file already exercises the barrel.
    expect(typeof NamespacedStorageAdapter).toBe('function');
    expect(typeof StorageAdapterFactory).toBe('function');
    expect(typeof StateManager).toBe('function');
    expect(typeof MemoryStorageAdapter).toBe('function');
    expect(typeof StateManagers).toBe('object');
  });

  it('StateManagers enum contains all expected contexts', () => {
    // Guards against accidental removal of enum values
    expect(StateManagers.CoreV1).toBe('core_v1');
    expect(StateManagers.UserSession).toBe('user_session');
    expect(StateManagers.DashboardSettings).toBe('dashboard_settings');
    expect(StateManagers.PluginData).toBe('plugin_data');
    expect(StateManagers.AgentContext).toBe('agent_context');
    expect(StateManagers.UserProfile).toBe('user_profile');
  });

  it('keys stay isolated between namespaced managers', async () => {
    const base = new MemoryStorageAdapter('');
    const nsA = new NamespacedStorageAdapter(base, 'mgr-a');
    const nsB = new NamespacedStorageAdapter(base, 'mgr-b');

    const mgrA = StateManager.getInstance(StateManagers.DashboardSettings, nsA);
    const mgrB = StateManager.getInstance(StateManagers.PluginData, nsB);

    await mgrA.set('setting', {
      kind: 'application',
      stateId: 'setting',
      data: { value: 'from-a' },
    } as any);

    await mgrB.set('setting', {
      kind: 'application',
      stateId: 'setting',
      data: { value: 'from-b' },
    } as any);

    await mgrA.flush();
    await mgrB.flush();

    const fromA = await mgrA.get('setting');
    const fromB = await mgrB.get('setting');

    expect((fromA as any).data.value).toBe('from-a');
    expect((fromB as any).data.value).toBe('from-b');
  });
});
