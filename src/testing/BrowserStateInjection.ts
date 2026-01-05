/**
 * Browser State Injection - Test Utilities
 * 
 * Provides mechanism for E2E tests to set and read component state
 * in the browser context. Only active in test environments.
 * 
 * @module BrowserStateInjection
 */

/**
 * Global test state interface
 * Exposed on window for Playwright tests to access
 */
export interface TestStateManager {
  /**
   * Set component state via custom event
   * @param component - Component name (from @Component decorator)
   * @param state - Partial state to merge
   */
  setState(component: string, state: any): void;

  /**
   * Get component state by reading data-state attribute
   * @param component - Component name
   * @returns Current component state or undefined
   */
  getState(component: string): any | undefined;

  /**
   * Wait for component to be ready (registered and rendered)
   * @param component - Component name
   * @param timeoutMs - Timeout in milliseconds (default: 5000)
   */
  waitForComponent(component: string, timeoutMs?: number): Promise<void>;

  /**
   * Reset component to initial state
   * @param component - Component name
   */
  resetState(component: string): void;

  /**
   * Check if component is registered and available
   * @param component - Component name
   */
  hasComponent(component: string): boolean;
}

/**
 * Custom event detail for state updates
 */
export interface StateUpdateEvent {
  component: string;
  state: any;
}

/**
 * Custom event detail for state reset
 */
export interface StateResetEvent {
  component: string;
}

/**
 * Test state manager implementation
 * Available as window.__testState__ in test environments
 */
class BrowserTestStateManager implements TestStateManager {
  private readonly eventPrefix = 'test:';

  setState(component: string, state: any): void {
    if (typeof window === 'undefined') {
      throw new Error('setState can only be called in browser context');
    }

    const event = new CustomEvent<StateUpdateEvent>(`${this.eventPrefix}setState`, {
      detail: { component, state },
      bubbles: false,
      cancelable: false,
    });

    window.dispatchEvent(event);

    // Also log for debugging
    if (process.env.NODE_ENV === 'test') {
      console.log(`[TEST] setState: ${component}`, state);
    }
  }

  getState(component: string): any | undefined {
    if (typeof window === 'undefined') {
      throw new Error('getState can only be called in browser context');
    }

    // Find element by component name
    const element = document.querySelector(`[data-component="${component}"]`);
    if (!element) {
      return undefined;
    }

    // Read state from data-state attribute
    const stateAttr = element.getAttribute('data-state');
    if (!stateAttr) {
      return undefined;
    }

    try {
      return JSON.parse(stateAttr);
    } catch (error) {
      console.error(`[TEST] Failed to parse state for ${component}:`, error);
      return undefined;
    }
  }

  async waitForComponent(component: string, timeoutMs: number = 5000): Promise<void> {
    if (typeof window === 'undefined') {
      throw new Error('waitForComponent can only be called in browser context');
    }

    const startTime = Date.now();

    while (Date.now() - startTime < timeoutMs) {
      const element = document.querySelector(`[data-component="${component}"]`);
      if (element) {
        // Component element exists, wait a bit for React to initialize
        await new Promise(resolve => setTimeout(resolve, 100));
        return;
      }
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    throw new Error(`Component '${component}' not found after ${timeoutMs}ms`);
  }

  resetState(component: string): void {
    if (typeof window === 'undefined') {
      throw new Error('resetState can only be called in browser context');
    }

    const event = new CustomEvent<StateResetEvent>(`${this.eventPrefix}resetState`, {
      detail: { component },
      bubbles: false,
      cancelable: false,
    });

    window.dispatchEvent(event);

    if (process.env.NODE_ENV === 'test') {
      console.log(`[TEST] resetState: ${component}`);
    }
  }

  hasComponent(component: string): boolean {
    if (typeof window === 'undefined') {
      return false;
    }

    const element = document.querySelector(`[data-component="${component}"]`);
    return !!element;
  }
}

/**
 * Initialize test state manager on window
 * Only runs in test environment
 */
export function initializeTestStateManager(): void {
  if (typeof window === 'undefined') {
    return;
  }

  // Only initialize in test environment
  if (process.env.NODE_ENV !== 'test') {
    return;
  }

  // Check if already initialized
  if ((window as any).__testState__) {
    return;
  }

  // Create and expose test state manager
  (window as any).__testState__ = new BrowserTestStateManager();

  console.log('[TEST] Browser state injection initialized');
}

/**
 * Get test state manager from window
 * Returns undefined if not in browser or not test environment
 */
export function getTestStateManager(): TestStateManager | undefined {
  if (typeof window === 'undefined') {
    return undefined;
  }

  return (window as any).__testState__;
}

// Auto-initialize in test environment
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'test') {
  initializeTestStateManager();
}

/**
 * Type augmentation for Window interface
 */
declare global {
  interface Window {
    __testState__?: TestStateManager;
  }
}

