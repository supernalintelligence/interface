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
export class TestFunction {
    /**
     * Execute the full test lifecycle: setup, execute, teardown.
     * This method handles the orchestration and error handling.
     *
     * @param page - Playwright page instance
     * @param context - Test context
     * @returns Test result
     */
    async run(page, context) {
        const startTime = Date.now();
        const errors = [];
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
                }
                catch (error) {
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
            let result;
            try {
                result = await this.execute(page, context);
            }
            catch (error) {
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
                }
                catch (error) {
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
        }
        catch (error) {
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
    validate() {
        const errors = [];
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
    getInfo() {
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
export function isTestFunction(obj) {
    return (obj &&
        typeof obj === 'object' &&
        typeof obj.mode === 'string' &&
        typeof obj.name === 'string' &&
        typeof obj.description === 'string' &&
        typeof obj.execute === 'function');
}
//# sourceMappingURL=TestFunction.js.map