/**
 * Main orchestrator for graph-based testing.
 *
 * GraphTester coordinates:
 * 1. Route discovery (manual or via NavigationGraph)
 * 2. Test function execution across all routes
 * 3. Result aggregation and reporting
 *
 * @packageDocumentation
 */

import { chromium, type Browser, type Page, type BrowserContext } from '@playwright/test';
import type {
  GraphTesterConfig,
  RouteDescriptor,
  TestContext,
  TestResult,
  AggregatedTestResults,
  TestMode,
  RouteDiscoveryConfig,
  ViewportConfig,
} from './types';
import { TestFunction, isTestFunction } from './TestFunction';
import { ViewportPresets } from './types';

/**
 * Main orchestrator for graph-based testing.
 *
 * @example
 * ```typescript
 * const tester = new GraphTester({
 *   baseUrl: 'http://localhost:3000',
 *   routes: [
 *     { route: '/', metadata: { name: 'Home' } },
 *     { route: '/dashboard', metadata: { name: 'Dashboard' } }
 *   ],
 *   modes: ['visual', 'performance'],
 *   output: {
 *     dir: './test-results',
 *     formats: ['html', 'json']
 *   }
 * });
 *
 * const results = await tester.runTests();
 * console.log(`Pass rate: ${results.passRate}%`);
 * ```
 */
export class GraphTester {
  private config: GraphTesterConfig;
  private testFunctions: Map<TestMode, TestFunction> = new Map();
  private browser: Browser | null = null;
  private context: BrowserContext | null = null;

  /**
   * Create a new GraphTester instance.
   *
   * @param config - Configuration for the tester
   */
  constructor(config: GraphTesterConfig) {
    this.config = this.validateConfig(config);
  }

  /**
   * Validate and normalize configuration.
   */
  private validateConfig(config: GraphTesterConfig): GraphTesterConfig {
    if (!config.baseUrl) {
      throw new Error('baseUrl is required');
    }

    if (!config.modes || config.modes.length === 0) {
      throw new Error('At least one test mode is required');
    }

    // Normalize routes configuration
    if (!config.routes) {
      config.routes = {
        strategy: 'manual',
      };
    }

    // Normalize output configuration
    if (!config.output) {
      config.output = {
        dir: './test-results',
        formats: ['json', 'html'],
      };
    }

    // Normalize execution configuration
    if (!config.execution) {
      config.execution = {
        parallel: 1,
        timeout: 30000,
        retries: 0,
        failFast: false,
      };
    }

    return config;
  }

  /**
   * Register a test function.
   *
   * @param testFunction - Test function to register
   */
  registerTestFunction(testFunction: TestFunction): void {
    if (!isTestFunction(testFunction)) {
      throw new Error('Invalid test function');
    }

    const validationErrors = testFunction.validate();
    if (validationErrors.length > 0) {
      throw new Error(`Test function validation failed: ${validationErrors.join(', ')}`);
    }

    this.testFunctions.set(testFunction.mode, testFunction);
  }

  /**
   * Discover routes to test.
   *
   * @returns Array of route descriptors
   */
  private async discoverRoutes(): Promise<RouteDescriptor[]> {
    const routesConfig = this.config.routes;

    // Manual routes provided as array
    if (Array.isArray(routesConfig)) {
      return routesConfig;
    }

    // Route discovery configuration
    const discoveryConfig = routesConfig as RouteDiscoveryConfig;

    if (discoveryConfig.strategy === 'manual') {
      throw new Error('Manual strategy requires routes array');
    }

    if (discoveryConfig.strategy === 'navigation-graph') {
      throw new Error(
        'NavigationGraph discovery is only available in @supernalintelligence/interface-enterprise'
      );
    }

    if (discoveryConfig.strategy === 'custom' && discoveryConfig.discoveryFn) {
      return discoveryConfig.discoveryFn();
    }

    throw new Error(`Unknown discovery strategy: ${discoveryConfig.strategy}`);
  }

  /**
   * Filter routes based on include/exclude patterns.
   *
   * @param routes - Routes to filter
   * @returns Filtered routes
   */
  private filterRoutes(routes: RouteDescriptor[]): RouteDescriptor[] {
    const routesConfig = this.config.routes;
    if (Array.isArray(routesConfig)) {
      return routes;
    }

    const discoveryConfig = routesConfig as RouteDiscoveryConfig;
    const { include, exclude } = discoveryConfig;

    let filtered = routes;

    // Apply include patterns
    if (include && include.length > 0) {
      filtered = filtered.filter((r) =>
        include.some((pattern) => this.matchPattern(r.route, pattern))
      );
    }

    // Apply exclude patterns
    if (exclude && exclude.length > 0) {
      filtered = filtered.filter(
        (r) => !exclude.some((pattern) => this.matchPattern(r.route, pattern))
      );
    }

    return filtered;
  }

  /**
   * Simple pattern matching for route filtering.
   * Supports basic glob patterns with *.
   *
   * @param route - Route to match
   * @param pattern - Pattern to match against
   * @returns Whether route matches pattern
   */
  private matchPattern(route: string, pattern: string): boolean {
    // Convert glob pattern to regex
    const regexPattern = pattern
      .replace(/\*/g, '.*')
      .replace(/\?/g, '.')
      .replace(/\//g, '\\/');

    const regex = new RegExp(`^${regexPattern}$`);
    return regex.test(route);
  }

  /**
   * Initialize browser and context.
   */
  private async initBrowser(): Promise<void> {
    const browserConfig = this.config.browser || {};

    this.browser = await chromium.launch({
      headless: browserConfig.headless !== false,
      ...browserConfig.launchOptions,
    });

    this.context = await this.browser.newContext({
      viewport: browserConfig.viewport || { width: 1280, height: 720 },
    });
  }

  /**
   * Close browser and context.
   */
  private async closeBrowser(): Promise<void> {
    if (this.context) {
      await this.context.close();
      this.context = null;
    }

    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  /**
   * Apply a test function to a route with optional viewport.
   *
   * @param route - Route descriptor
   * @param testFunction - Test function to apply
   * @param viewport - Viewport configuration (optional)
   * @returns Test result
   */
  private async applyTestFunction(
    route: RouteDescriptor,
    testFunction: TestFunction,
    viewport?: ViewportConfig
  ): Promise<TestResult> {
    if (!this.context) {
      throw new Error('Browser context not initialized');
    }

    const page = await this.context.newPage();

    try {
      // Set viewport if provided
      if (viewport) {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });

        // Note: Device scale factor and mobile emulation would require creating
        // a new context per viewport for full mobile emulation.
        // For now, we just set viewport size which covers most responsive testing needs.
      }

      // Navigate to route
      const url = `${this.config.baseUrl}${route.route}`;
      await page.goto(url, { waitUntil: 'networkidle', timeout: this.config.execution?.timeout });

      // Create test context
      const testContext: TestContext = {
        route: route.route,
        contextId: route.contextId,
        metadata: route.metadata,
        baseUrl: this.config.baseUrl,
        viewport,
      };

      // Run test function
      const result = await testFunction.run(page, testContext);

      return result;
    } catch (error) {
      return {
        passed: false,
        duration: 0,
        errors: [
          {
            severity: 'critical',
            message: `Failed to test route: ${error instanceof Error ? error.message : String(error)}`,
            stack: error instanceof Error ? error.stack : undefined,
          },
        ],
        metadata: {},
        mode: testFunction.mode,
        route: route.route,
      };
    } finally {
      await page.close();
    }
  }

  /**
   * Run all tests across all routes.
   *
   * @returns Aggregated test results
   */
  async runTests(): Promise<AggregatedTestResults> {
    const startTime = Date.now();

    try {
      // Discover and filter routes
      const allRoutes = await this.discoverRoutes();
      const routes = this.filterRoutes(allRoutes);

      if (routes.length === 0) {
        throw new Error('No routes to test');
      }

      console.log(`Discovered ${routes.length} routes to test`);

      // Get viewports to test
      const browserConfig = this.config.browser || {};
      const viewports: ViewportConfig[] = browserConfig.viewports || [
        browserConfig.viewport
          ? { name: 'default', ...browserConfig.viewport }
          : ViewportPresets.Desktop
      ];

      console.log(`Testing with ${viewports.length} viewport(s): ${viewports.map(v => v.name).join(', ')}`);

      // Initialize browser
      await this.initBrowser();

      // Execute tests
      const resultsByRoute = new Map<string, TestResult[]>();
      const resultsByMode = new Map<TestMode, TestResult[]>();
      const allErrors: TestResult['errors'] = [];

      // Test each viewport
      for (const viewport of viewports) {
        console.log(`\n📱 Testing viewport: ${viewport.name} (${viewport.width}x${viewport.height})`);

        for (const route of routes) {
          const routeKey = viewports.length > 1
            ? `${route.route} [${viewport.name}]`
            : route.route;

          console.log(`  Testing route: ${routeKey}`);

          const routeResults: TestResult[] = [];

          for (const [mode, testFunction] of this.testFunctions) {
            console.log(`    Running ${mode} test...`);

            const result = await this.applyTestFunction(route, testFunction, viewport);
            routeResults.push(result);

            // Aggregate by mode
            if (!resultsByMode.has(mode)) {
              resultsByMode.set(mode, []);
            }
            resultsByMode.get(mode)!.push(result);

            // Collect errors
            allErrors.push(...result.errors);
          }

          resultsByRoute.set(routeKey, routeResults);
        }
      }

      // Calculate statistics
      const testCount = routes.length * this.testFunctions.size * viewports.length;
      const passedCount = Array.from(resultsByRoute.values())
        .flat()
        .filter((r) => r.passed).length;
      const failedCount = testCount - passedCount;
      const passRate = testCount > 0 ? Math.round((passedCount / testCount) * 100) : 0;

      return {
        routeCount: routes.length,
        testCount,
        passedCount,
        failedCount,
        passRate,
        totalDuration: Date.now() - startTime,
        resultsByRoute,
        resultsByMode,
        errors: allErrors,
        timestamp: new Date(),
        config: this.config,
      };
    } finally {
      await this.closeBrowser();
    }
  }

  /**
   * Get registered test functions.
   */
  getTestFunctions(): TestFunction[] {
    return Array.from(this.testFunctions.values());
  }

  /**
   * Get configuration.
   */
  getConfig(): GraphTesterConfig {
    return this.config;
  }
}
