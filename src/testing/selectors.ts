/**
 * Testing Selector Helpers
 * 
 * Utilities for converting component name contracts to test selectors.
 * Reduces boilerplate and ensures consistency across test files.
 */

/**
 * Convert a component name (from name contracts) to a data-testid selector
 * 
 * @example
 * ```typescript
 * import { Chat } from '../architecture/ComponentNames';
 * import { testId } from '@supernal-interface/core/testing';
 *
 * const input = page.locator(testId(Chat.input));
 * // Equivalent to: page.locator('[data-testid="chat-input"]')
 * ```
 */
export function testId(componentId: string): string {
  return `[data-testid="${componentId}"]`;
}

/**
 * Create multiple selectors at once
 * 
 * @example
 * ```typescript
 * const selectors = testIds({
 *   input: Chat.input,
 *   button: Chat.sendButton
 * });
 * 
 * await page.locator(selectors.input).fill('hello');
 * await page.locator(selectors.button).click();
 * ```
 */
export function testIds<T extends Record<string, string>>(
  ids: T
): { [K in keyof T]: string } {
  return Object.entries(ids).reduce((acc, [key, value]) => {
    acc[key as keyof T] = testId(value);
    return acc;
  }, {} as { [K in keyof T]: string });
}

/**
 * Alias for testId - shorter for repetitive use
 */
export const tid = testId;

/**
 * Create a selector for elements with partial testid match
 * 
 * @example
 * ```typescript
 * // Find all chat messages
 * const messages = page.locator(testIdContains('chat-message'));
 * ```
 */
export function testIdContains(partial: string): string {
  return `[data-testid*="${partial}"]`;
}

/**
 * Create a selector for elements with testid starting with prefix
 * 
 * @example
 * ```typescript
 * // Find all navigation elements
 * const navElements = page.locator(testIdStartsWith('nav-'));
 * ```
 */
export function testIdStartsWith(prefix: string): string {
  return `[data-testid^="${prefix}"]`;
}

/**
 * Create a selector for elements with testid ending with suffix
 */
export function testIdEndsWith(suffix: string): string {
  return `[data-testid$="${suffix}"]`;
}

