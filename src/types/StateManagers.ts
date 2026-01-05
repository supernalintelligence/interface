/**
 * State Manager Names
 * 
 * Enum defining named StateManager instances for multi-context support.
 * Each name represents an isolated state tree for specific use cases.
 * 
 * @example
 * ```typescript
 * const coreState = StateManager.getInstance(StateManagers.SupernalCoreV1, adapter);
 * const userState = StateManager.getInstance(StateManagers.UserSession, adapter);
 * ```
 */
export enum StateManagers {
  /**
   * Core application state manager (v1)
   * Used for fundamental system state
   */
  SupernalCoreV1 = 'supernal_core_v1',
  
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
}

