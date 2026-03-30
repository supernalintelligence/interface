/**
 * State Manager Names
 *
 * Enum defining named StateManager instances for multi-context support.
 * Each name represents an isolated state tree for specific use cases.
 *
 * @example
 * ```typescript
 * const coreState = StateManager.getInstance(StateManagers.CoreV1, adapter);
 * const userState = StateManager.getInstance(StateManagers.UserSession, adapter);
 * ```
 */
export enum StateManagers {
  /**
   * Core application state manager (v1)
   * Used for fundamental system state
   */
  CoreV1 = 'core_v1',
  
  /**
   * User session state manager
   * Isolated user-specific data
   */
  UserSession = 'user_session',
  
  /**
   * Testing state manager
   * Used for test isolation
   */
  Testing = 'testing',
  
  /**
   * Demo state manager
   * For demo/example scenarios
   */
  Demo = 'demo',

  /**
   * Dashboard settings state manager
   * All dashboard UI preferences (panel sizes, theme, view modes)
   */
  DashboardSettings = 'dashboard_settings',

  /**
   * Plugin-isolated storage
   * Each plugin gets its own namespace within this manager
   */
  PluginData = 'plugin_data',

  /**
   * Agent session state
   * Tracks agent context, conversation state, tool usage
   */
  AgentContext = 'agent_context',

  /**
   * Cross-device user preferences
   * Settings that sync across devices via server
   */
  UserProfile = 'user_profile',
}

