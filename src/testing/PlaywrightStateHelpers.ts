/**
 * Playwright Test Helpers for Browser State Injection
 * 
 * Utilities for E2E tests to interact with component state
 * using the browser state injection system.
 * 
 * @module PlaywrightStateHelpers
 */

import { Page } from '@playwright/test';

/**
 * Set component state in the browser
 * 
 * @param page - Playwright page object
 * @param componentName - Component name from @Component decorator
 * @param state - Partial state to merge
 * 
 * @example
 * ```typescript
 * await setComponentState(page, 'counter', { count: 5 });
 * ```
 */
export async function setComponentState(
  page: Page,
  componentName: string,
  state: any
): Promise<void> {
  await page.evaluate(
    ({ component, newState }) => {
      if (!window.__testState__) {
        throw new Error('Test state manager not initialized. Did you forget to call initializeTestStateManager()?');
      }
      window.__testState__.setState(component, newState);
    },
    { component: componentName, newState: state }
  );
}

/**
 * Get component state from the browser
 * 
 * @param page - Playwright page object
 * @param componentName - Component name from @Component decorator
 * @returns Current component state or undefined
 * 
 * @example
 * ```typescript
 * const state = await getComponentState(page, 'counter');
 * expect(state.count).toBe(5);
 * ```
 */
export async function getComponentState<TState = any>(
  page: Page,
  componentName: string
): Promise<TState | undefined> {
  return await page.evaluate(
    (component) => {
      if (!window.__testState__) {
        throw new Error('Test state manager not initialized');
      }
      return window.__testState__.getState(component);
    },
    componentName
  );
}

/**
 * Reset component to initial state
 * 
 * @param page - Playwright page object
 * @param componentName - Component name from @Component decorator
 * 
 * @example
 * ```typescript
 * await resetComponentState(page, 'counter');
 * ```
 */
export async function resetComponentState(
  page: Page,
  componentName: string
): Promise<void> {
  await page.evaluate(
    (component) => {
      if (!window.__testState__) {
        throw new Error('Test state manager not initialized');
      }
      window.__testState__.resetState(component);
    },
    componentName
  );
}

/**
 * Wait for component to be available in the DOM
 * 
 * @param page - Playwright page object
 * @param componentName - Component name from @Component decorator
 * @param timeoutMs - Timeout in milliseconds (default: 5000)
 * 
 * @example
 * ```typescript
 * await waitForComponent(page, 'counter');
 * ```
 */
export async function waitForComponent(
  page: Page,
  componentName: string,
  timeoutMs: number = 5000
): Promise<void> {
  await page.evaluate(
    async ({ component, timeout }) => {
      if (!window.__testState__) {
        throw new Error('Test state manager not initialized');
      }
      await window.__testState__.waitForComponent(component, timeout);
    },
    { component: componentName, timeout: timeoutMs }
  );
}

/**
 * Check if component is available
 * 
 * @param page - Playwright page object
 * @param componentName - Component name from @Component decorator
 * @returns True if component is rendered and available
 * 
 * @example
 * ```typescript
 * const isAvailable = await hasComponent(page, 'counter');
 * ```
 */
export async function hasComponent(
  page: Page,
  componentName: string
): Promise<boolean> {
  return await page.evaluate(
    (component) => {
      if (!window.__testState__) {
        return false;
      }
      return window.__testState__.hasComponent(component);
    },
    componentName
  );
}

/**
 * Set component state from a data contract
 * 
 * @param page - Playwright page object
 * @param componentName - Component name
 * @param dataContract - Data contract object (e.g., ExamplesData.counter.state.five)
 * 
 * @example
 * ```typescript
 * import { ExamplesData } from '@supernal-interface/core';
 * 
 * await setComponentStateFromContract(
 *   page,
 *   'counter',
 *   ExamplesData.counter.state.five
 * );
 * ```
 */
export async function setComponentStateFromContract(
  page: Page,
  componentName: string,
  dataContract: any
): Promise<void> {
  await setComponentState(page, componentName, dataContract);
}

/**
 * Assert component state matches data contract
 * 
 * @param page - Playwright page object
 * @param componentName - Component name
 * @param expectedContract - Expected data contract
 * 
 * @example
 * ```typescript
 * await assertComponentStateMatches(
 *   page,
 *   'counter',
 *   ExamplesData.counter.state.five
 * );
 * ```
 */
export async function assertComponentStateMatches(
  page: Page,
  componentName: string,
  expectedContract: any
): Promise<void> {
  const actualState = await getComponentState(page, componentName);
  
  if (!actualState) {
    throw new Error(`Component '${componentName}' state is undefined`);
  }

  // Deep equality check
  const actualJson = JSON.stringify(actualState);
  const expectedJson = JSON.stringify(expectedContract);

  if (actualJson !== expectedJson) {
    throw new Error(
      `Component '${componentName}' state does not match.\n` +
      `Expected: ${expectedJson}\n` +
      `Actual: ${actualJson}`
    );
  }
}

/**
 * Get component element by name
 * 
 * @param page - Playwright page object
 * @param componentName - Component name
 * @returns Locator for the component element
 * 
 * @example
 * ```typescript
 * const counter = getComponentElement(page, 'counter');
 * await expect(counter).toBeVisible();
 * ```
 */
export function getComponentElement(page: Page, componentName: string) {
  return page.locator(`[data-component="${componentName}"]`);
}

/**
 * Initialize test state manager in the browser
 * Call this in beforeEach or at the start of tests
 * 
 * @param page - Playwright page object
 * 
 * @example
 * ```typescript
 * test.beforeEach(async ({ page }) => {
 *   await initializeTestState(page);
 * });
 * ```
 */
export async function initializeTestState(page: Page): Promise<void> {
  await page.evaluate(() => {
    // Force initialize test state manager regardless of NODE_ENV
    if (typeof window !== 'undefined' && !(window as any).__testState__) {
      // Create a minimal test state manager
      (window as any).__testState__ = {
        states: new Map(),
        getState(component: string) {
          return this.states.get(component);
        },
        setState(component: string, state: any) {
          const current = this.states.get(component) || {};
          this.states.set(component, { ...current, ...state });
        },
        resetState(component: string) {
          this.states.delete(component);
        }
      };
      console.log('[TEST] Test state manager initialized in browser');
    }
  });
}

/**
 * Batch state operations
 * Useful for setting up complex test scenarios
 * 
 * @param page - Playwright page object
 * @param operations - Array of state operations
 * 
 * @example
 * ```typescript
 * await batchStateOperations(page, [
 *   { type: 'set', component: 'counter', state: { count: 5 } },
 *   { type: 'set', component: 'chat', state: { messages: [] } },
 *   { type: 'reset', component: 'form' },
 * ]);
 * ```
 */
export async function batchStateOperations(
  page: Page,
  operations: Array<
    | { type: 'set'; component: string; state: any }
    | { type: 'reset'; component: string }
  >
): Promise<void> {
  await page.evaluate((ops) => {
    if (!window.__testState__) {
      throw new Error('Test state manager not initialized');
    }

    for (const op of ops) {
      if (op.type === 'set') {
        window.__testState__.setState(op.component, op.state);
      } else if (op.type === 'reset') {
        window.__testState__.resetState(op.component);
      }
    }
  }, operations);
}

