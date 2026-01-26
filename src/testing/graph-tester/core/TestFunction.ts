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
import type {
  TestContext,
  TestResult,
  TestMode,
  SetupOptions,
  TeardownOptions,
  ExecuteOptions,
} from './types';

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
export abstract class TestFunction {
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
  async setup?(page: Page): Promise<void>;

  /**
   * Optional teardown hook called after execute().
   * Use for cleanup that should happen once per route.
   *
   * @param page - Playwright page instance
   */
  async teardown?(page: Page): Promise<void>;

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
  async run(page: Page, context: TestContext): Promise<TestResult> {
    const startTime = Date.now();
    const errors: TestResult['errors'] = [];

    try {
      // Check if we should test this route
      if (this.shouldTest && !this.shouldTest(context)) {
        return {
          passed: true,
          duration: Date.now() - startTime,
          errors: [],
          metadata: {
            skipped: true,
            reason: 'Skipped by shouldTest() predicate',
          },
          mode: this.mode,
          route: context.route,
        };
      }

      // Setup
      if (this.setup) {
        try {
          await this.setup(page);
        } catch (error) {
          errors.push({
            severity: 'critical',
            message: `Setup failed: ${error instanceof Error ? error.message : String(error)}`,
            stack: error instanceof Error ? error.stack : undefined,
          });

          return {
            passed: false,
            duration: Date.now() - startTime,
            errors,
            metadata: {},
            mode: this.mode,
            route: context.route,
          };
        }
      }

      // Execute
      let result: TestResult;
      try {
        result = await this.execute(page, context);
      } catch (error) {
        errors.push({
          severity: 'critical',
          message: `Execution failed: ${error instanceof Error ? error.message : String(error)}`,
          stack: error instanceof Error ? error.stack : undefined,
        });

        result = {
          passed: false,
          duration: Date.now() - startTime,
          errors,
          metadata: {},
        };
      }

      // Teardown
      if (this.teardown) {
        try {
          await this.teardown(page);
        } catch (error) {
          errors.push({
            severity: 'warning',
            message: `Teardown failed: ${error instanceof Error ? error.message : String(error)}`,
            stack: error instanceof Error ? error.stack : undefined,
          });
        }
      }

      // Merge errors and add metadata
      return {
        ...result,
        errors: [...errors, ...result.errors],
        mode: this.mode,
        route: context.route,
      };
    } catch (error) {
      // Catch-all for unexpected errors
      return {
        passed: false,
        duration: Date.now() - startTime,
        errors: [
          ...errors,
          {
            severity: 'critical',
            message: `Unexpected error: ${error instanceof Error ? error.message : String(error)}`,
            stack: error instanceof Error ? error.stack : undefined,
          },
        ],
        metadata: {},
        mode: this.mode,
        route: context.route,
      };
    }
  }

  /**
   * Validate test function configuration.
   * Override to add custom validation logic.
   *
   * @returns Array of validation errors (empty if valid)
   */
  validate(): string[] {
    const errors: string[] = [];

    if (!this.mode) {
      errors.push('mode is required');
    }

    if (!this.name) {
      errors.push('name is required');
    }

    if (!this.description) {
      errors.push('description is required');
    }

    return errors;
  }

  /**
   * Get test function info for reporting.
   */
  getInfo(): {
    mode: TestMode;
    name: string;
    description: string;
  } {
    return {
      mode: this.mode,
      name: this.name,
      description: this.description,
    };
  }
}

/**
 * Type guard to check if an object is a TestFunction.
 */
export function isTestFunction(obj: any): obj is TestFunction {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.mode === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.description === 'string' &&
    typeof obj.execute === 'function'
  );
}
