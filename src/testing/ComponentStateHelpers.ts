/**
 * Generalized State-Based Test Helpers
 * 
 * Utilities for testing ANY component using data contracts instead of UI text.
 * These helpers provide a component-agnostic way to assert state.
 * 
 * @module tests/generalized-state-helpers
 */

import { Page, expect } from '@playwright/test';

/**
 * Base state accessor interface
 * Components expose their state via window.__componentState__[componentId]
 */
interface ComponentStateAccessor {
  get: () => any;
  update?: (updates: any) => void;
}

/**
 * Get state from any component that exposes it
 * 
 * @param page - Playwright page
 * @param componentId - Component identifier (e.g., 'demo-widgets', 'chat', 'counter')
 * 
 * @example
 * ```typescript
 * const state = await getComponentState(page, 'demo-widgets');
 * ```
 */
export async function getComponentState<TState = any>(
  page: Page,
  componentId: string
): Promise<TState> {
  return await page.evaluate((id) => {
    if ((window as any).__componentState__?.[id]) {
      return (window as any).__componentState__[id].get();
    }
    throw new Error(
      `Component state not exposed for: ${id}\n` +
      `Available components: ${Object.keys((window as any).__componentState__ || {}).join(', ')}\n` +
      `Make sure the component exposes state via window.__componentState__['${id}']`
    );
  }, componentId);
}

/**
 * Assert component state matches expected values
 * 
 * @param page - Playwright page
 * @param componentId - Component identifier
 * @param expected - Partial state to match
 * 
 * @example
 * ```typescript
 * await assertComponentState(page, 'demo-widgets', { menuOpen: true });
 * await assertComponentState(page, 'counter', { count: 5 });
 * await assertComponentState(page, 'chat', { isMinimized: false });
 * ```
 */
export async function assertComponentState<TState = any>(
  page: Page,
  componentId: string,
  expected: Partial<TState>
): Promise<void> {
  const actual = await getComponentState<TState>(page, componentId);
  
  // Check each expected key matches
  for (const key of Object.keys(expected)) {
    const expectedValue = (expected as any)[key];
    const actualValue = (actual as any)[key];
    
    if (JSON.stringify(actualValue) !== JSON.stringify(expectedValue)) {
      throw new Error(
        `State mismatch for component "${componentId}".\n` +
        `Field: ${key}\n` +
        `Expected: ${JSON.stringify(expectedValue)}\n` +
        `Actual: ${JSON.stringify(actualValue)}\n` +
        `Full state: ${JSON.stringify(actual, null, 2)}`
      );
    }
  }
}

/**
 * Set component state (if component supports it)
 * 
 * @param page - Playwright page
 * @param componentId - Component identifier
 * @param updates - Partial state to set
 * 
 * @example
 * ```typescript
 * await setComponentState(page, 'demo-widgets', { theme: 'dark' });
 * ```
 */
export async function setComponentState<TState = any>(
  page: Page,
  componentId: string,
  updates: Partial<TState>
): Promise<void> {
  await page.evaluate(
    ({ id, state }) => {
      if ((window as any).__componentState__?.[id]?.update) {
        (window as any).__componentState__[id].update(state);
      } else {
        throw new Error(
          `Component ${id} does not support state updates or is not exposed`
        );
      }
    },
    { id: componentId, state: updates }
  );
}

/**
 * Wait for component state to match condition
 * 
 * @param page - Playwright page
 * @param componentId - Component identifier
 * @param condition - Function that returns true when state is ready
 * @param options - Timeout and polling options
 * 
 * @example
 * ```typescript
 * await waitForComponentState(page, 'chat', 
 *   state => state.messages.length > 0
 * );
 * ```
 */
export async function waitForComponentState<TState = any>(
  page: Page,
  componentId: string,
  condition: (state: TState) => boolean,
  options: { timeout?: number; pollInterval?: number } = {}
): Promise<void> {
  const { timeout = 5000, pollInterval = 100 } = options;
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    const state = await getComponentState<TState>(page, componentId);
    if (condition(state)) {
      return;
    }
    await page.waitForTimeout(pollInterval);
  }

  const currentState = await getComponentState<TState>(page, componentId);
  throw new Error(
    `Timeout waiting for component state condition after ${timeout}ms.\n` +
    `Component: ${componentId}\n` +
    `Current state: ${JSON.stringify(currentState, null, 2)}`
  );
}

/**
 * Assert state via data-state attributes (alternative approach)
 * Useful when component doesn't expose JS state but adds data attributes
 * 
 * @param page - Playwright page
 * @param selector - CSS selector for component
 * @param attribute - data-state-* attribute name
 * @param expectedValue - Expected attribute value
 * 
 * @example
 * ```typescript
 * await assertStateAttribute(page, '[data-testid="menu"]', 'data-state-open', 'true');
 * ```
 */
export async function assertStateAttribute(
  page: Page,
  selector: string,
  attribute: string,
  expectedValue: string
): Promise<void> {
  const element = page.locator(selector);
  await expect(element).toHaveAttribute(attribute, expectedValue);
}

/**
 * Get all registered component state IDs
 * Useful for debugging
 * 
 * @param page - Playwright page
 * @returns Array of component IDs that expose state
 * 
 * @example
 * ```typescript
 * const components = await getRegisteredComponents(page);
 * console.log('Available:', components); // ['demo-widgets', 'chat', 'counter']
 * ```
 */
export async function getRegisteredComponents(page: Page): Promise<string[]> {
  return await page.evaluate(() => {
    return Object.keys((window as any).__componentState__ || {});
  });
}

/**
 * Debug helper: Print current state of a component
 * 
 * @param page - Playwright page
 * @param componentId - Component identifier
 * 
 * @example
 * ```typescript
 * await debugComponentState(page, 'demo-widgets');
 * ```
 */
export async function debugComponentState(
  page: Page,
  componentId: string
): Promise<void> {
  const state = await getComponentState(page, componentId);
  console.log(`=== ${componentId} State ===`);
  console.log(JSON.stringify(state, null, 2));
  console.log('========================');
}

/**
 * Debug helper: Print all component states
 * 
 * @param page - Playwright page
 * 
 * @example
 * ```typescript
 * await debugAllComponentStates(page);
 * ```
 */
export async function debugAllComponentStates(page: Page): Promise<void> {
  const components = await getRegisteredComponents(page);
  console.log(`\n=== All Component States (${components.length} found) ===`);
  
  for (const id of components) {
    try {
      const state = await getComponentState(page, id);
      console.log(`\n[${id}]:`);
      console.log(JSON.stringify(state, null, 2));
    } catch (error) {
      console.log(`\n[${id}]: Error - ${error}`);
    }
  }
  
  console.log('\n========================================\n');
}

