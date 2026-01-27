/**
 * Abstract base class for all test functions.
 *
 * Test functions implement specific testing modes (visual regression, performance, accessibility, etc.).
 * Each test function:
 * 1. Receives a Playwright page and test context
 * 2. Performs its testing logic
 * 3. Returns a TestResult with pass/fail status and metadata
 *
 * @packageDocumentation
 */
import type { Page } from '@playwright/test';
import type { TestContext, TestResult, TestMode } from './types';
/**
 * Abstract base class for test functions.
 *
 * @example
 * ```typescript
 * class VisualRegressionMode extends TestFunction {
 *   mode = 'visual';
 *
 *   async execute(page: Page, context: TestContext): Promise<TestResult> {
 *     const startTime = Date.now();
 *     const screenshot = await page.screenshot({ fullPage: true });
 *
 *     return {
 *       passed: true,
 *       duration: Date.now() - startTime,
 *       errors: [],
 *       metadata: {
 *         screenshot,
 *         screenshotPath: './screenshots/example.png'
 *       }
 *     };
 *   }
 * }
 * ```
 */
export declare abstract class TestFunction {
    /**
     * Test mode identifier.
     * Must be unique across all test functions.
     */
    abstract readonly mode: TestMode;
    /**
     * Human-readable name for this test function.
     */
    abstract readonly name: string;
    /**
     * Description of what this test function does.
     */
    abstract readonly description: string;
    /**
     * Execute the test function.
     *
     * @param page - Playwright page instance
     * @param context - Test context (route, metadata)
     * @returns Test result with pass/fail status and metadata
     */
    abstract execute(page: Page, context: TestContext): Promise<TestResult>;
    /**
     * Optional setup hook called before execute().
     * Use for initialization that should happen once per route.
     *
     * @param page - Playwright page instance
     */
    setup?(page: Page): Promise<void>;
    /**
     * Optional teardown hook called after execute().
     * Use for cleanup that should happen once per route.
     *
     * @param page - Playwright page instance
     */
    teardown?(page: Page): Promise<void>;
    /**
     * Optional predicate to determine if this test should run for a given context.
     * Return false to skip testing this route with this test function.
     *
     * @param context - Test context
     * @returns Whether to test this route
     *
     * @example
     * ```typescript
     * // Only test authenticated routes
     * shouldTest(context: TestContext): boolean {
     *   return context.metadata?.requiresAuth === true;
     * }
     * ```
     */
    shouldTest?(context: TestContext): boolean;
    /**
     * Execute the full test lifecycle: setup, execute, teardown.
     * This method handles the orchestration and error handling.
     *
     * @param page - Playwright page instance
     * @param context - Test context
     * @returns Test result
     */
    run(page: Page, context: TestContext): Promise<TestResult>;
    /**
     * Validate test function configuration.
     * Override to add custom validation logic.
     *
     * @returns Array of validation errors (empty if valid)
     */
    validate(): string[];
    /**
     * Get test function info for reporting.
     */
    getInfo(): {
        mode: TestMode;
        name: string;
        description: string;
    };
}
/**
 * Type guard to check if an object is a TestFunction.
 */
export declare function isTestFunction(obj: any): obj is TestFunction;
//# sourceMappingURL=TestFunction.d.ts.map