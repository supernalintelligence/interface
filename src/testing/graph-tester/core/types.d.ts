/**
 * Core types for the graph-based testing framework.
 *
 * This file is the contract between all packages - changes require consensus.
 *
 * @packageDocumentation
 */
import type { Page } from '@playwright/test';
/**
 * Context provided to test functions during execution.
 * Contains route information and optional metadata.
 */
export interface TestContext {
    /** The route being tested (e.g., '/', '/dashboard', '/blog/:slug') */
    route: string;
    /** Unique identifier for this navigation context (enterprise only) */
    contextId?: string;
    /** Additional metadata about the route (tools, parent/child, custom data) */
    metadata?: RouteMetadata;
    /** Base URL for the application under test */
    baseUrl?: string;
    /** Current viewport being tested (for responsive testing) */
    viewport?: ViewportConfig;
}
/**
 * Metadata associated with a route.
 * Enterprise users get richer metadata via NavigationGraph.
 */
export interface RouteMetadata {
    /** Human-readable name for the route */
    name?: string;
    /** Tools available on this route (enterprise only) */
    tools?: string[];
    /** Parent route in navigation hierarchy (enterprise only) */
    parent?: string;
    /** Child routes (enterprise only) */
    children?: string[];
    /** Navigation paths to other routes (enterprise only) */
    navigationPaths?: NavigationPath[];
    /** Custom user-defined metadata */
    [key: string]: any;
}
/**
 * Navigation path between routes (enterprise only).
 */
export interface NavigationPath {
    /** Target route */
    target: string;
    /** Navigation method (link, button, programmatic) */
    method: 'link' | 'button' | 'programmatic' | 'other';
    /** Element selector that triggers navigation (if applicable) */
    selector?: string;
}
/**
 * Result of a test function execution.
 */
export interface TestResult {
    /** Whether the test passed */
    passed: boolean;
    /** Duration in milliseconds */
    duration: number;
    /** Errors encountered during testing */
    errors: TestError[];
    /** Additional test-specific metadata (screenshots, metrics, violations, etc.) */
    metadata: Record<string, any>;
    /** Test mode that produced this result */
    mode?: TestMode;
    /** Route that was tested */
    route?: string;
}
/**
 * Error encountered during testing.
 */
export interface TestError {
    /** Error severity */
    severity: 'critical' | 'warning' | 'info';
    /** Error message */
    message: string;
    /** Location where error occurred (file:line, selector, etc.) */
    location?: string;
    /** Stack trace (if available) */
    stack?: string;
    /** Additional error context */
    context?: Record<string, any>;
}
/**
 * Descriptor for a route to be tested.
 * Open-source users provide these manually.
 * Enterprise users get these automatically via NavigationGraph.
 */
export interface RouteDescriptor {
    /** The route path */
    route: string;
    /** Unique identifier (enterprise only) */
    contextId?: string;
    /** Route metadata */
    metadata?: RouteMetadata;
}
/**
 * Configuration for route discovery.
 */
export interface RouteDiscoveryConfig {
    /** Discovery strategy ('manual', 'navigation-graph', 'custom') */
    strategy: 'manual' | 'navigation-graph' | 'custom';
    /** Routes to include (glob patterns) */
    include?: string[];
    /** Routes to exclude (glob patterns) */
    exclude?: string[];
    /** Custom discovery function */
    discoveryFn?: () => Promise<RouteDescriptor[]>;
}
/**
 * Available test modes.
 */
export type TestMode = 'visual' | 'performance' | 'accessibility' | 'seo' | string;
/**
 * Configuration for a test mode.
 */
export interface TestModeConfig {
    /** Mode identifier */
    mode: TestMode;
    /** Whether this mode is enabled */
    enabled?: boolean;
    /** Mode-specific options */
    options?: Record<string, any>;
}
/**
 * Configuration for GraphTester.
 */
export interface GraphTesterConfig {
    /** Base URL for the application under test */
    baseUrl: string;
    /** Routes to test (manual mode) or discovery config */
    routes?: RouteDescriptor[] | RouteDiscoveryConfig;
    /** Test modes to run */
    modes: TestMode[] | TestModeConfig[];
    /** Output configuration */
    output?: OutputConfig;
    /** Execution configuration */
    execution?: ExecutionConfig;
    /** Browser configuration */
    browser?: BrowserConfig;
}
/**
 * Output configuration.
 */
export interface OutputConfig {
    /** Output directory */
    dir: string;
    /** Output formats ('json', 'html', 'markdown', 'csv') */
    formats?: ('json' | 'html' | 'markdown' | 'csv')[];
    /** Whether to include screenshots */
    includeScreenshots?: boolean;
    /** Whether to include detailed logs */
    includeDetailedLogs?: boolean;
}
/**
 * Execution configuration.
 */
export interface ExecutionConfig {
    /** Number of parallel workers */
    parallel?: number;
    /** Timeout per test (ms) */
    timeout?: number;
    /** Number of retries on failure */
    retries?: number;
    /** Whether to fail fast on first error */
    failFast?: boolean;
}
/**
 * Viewport configuration for responsive testing.
 */
export interface ViewportConfig {
    /** Viewport name (e.g., 'desktop', 'tablet', 'mobile') */
    name: string;
    /** Width in pixels */
    width: number;
    /** Height in pixels */
    height: number;
    /** Device scale factor (default: 1) */
    deviceScaleFactor?: number;
    /** Whether this is a mobile device (default: false) */
    isMobile?: boolean;
    /** Whether device has touch support (default: false) */
    hasTouch?: boolean;
    /** User agent override */
    userAgent?: string;
}
/**
 * Predefined viewport presets.
 */
export declare const ViewportPresets: {
    readonly Desktop: {
        readonly name: "desktop";
        readonly width: 1920;
        readonly height: 1080;
    };
    readonly DesktopSmall: {
        readonly name: "desktop-small";
        readonly width: 1366;
        readonly height: 768;
    };
    readonly Laptop: {
        readonly name: "laptop";
        readonly width: 1280;
        readonly height: 720;
    };
    readonly TabletLandscape: {
        readonly name: "tablet-landscape";
        readonly width: 1024;
        readonly height: 768;
        readonly isMobile: true;
        readonly hasTouch: true;
    };
    readonly TabletPortrait: {
        readonly name: "tablet-portrait";
        readonly width: 768;
        readonly height: 1024;
        readonly isMobile: true;
        readonly hasTouch: true;
    };
    readonly MobileLarge: {
        readonly name: "mobile-large";
        readonly width: 414;
        readonly height: 896;
        readonly isMobile: true;
        readonly hasTouch: true;
    };
    readonly Mobile: {
        readonly name: "mobile";
        readonly width: 375;
        readonly height: 812;
        readonly isMobile: true;
        readonly hasTouch: true;
    };
    readonly MobileSmall: {
        readonly name: "mobile-small";
        readonly width: 320;
        readonly height: 568;
        readonly isMobile: true;
        readonly hasTouch: true;
    };
};
/**
 * Browser configuration.
 */
export interface BrowserConfig {
    /** Browser type ('chromium', 'firefox', 'webkit') */
    browserType?: 'chromium' | 'firefox' | 'webkit';
    /** Single viewport size (legacy - use viewports for responsive testing) */
    viewport?: {
        width: number;
        height: number;
    };
    /** Multiple viewports for responsive testing */
    viewports?: ViewportConfig[];
    /** Whether to run headless */
    headless?: boolean;
    /** Additional launch options */
    launchOptions?: Record<string, any>;
}
/**
 * Aggregated results from all test executions.
 */
export interface AggregatedTestResults {
    /** Total number of routes tested */
    routeCount: number;
    /** Total number of tests run */
    testCount: number;
    /** Number of passed tests */
    passedCount: number;
    /** Number of failed tests */
    failedCount: number;
    /** Pass rate percentage */
    passRate: number;
    /** Total duration (ms) */
    totalDuration: number;
    /** Results grouped by route */
    resultsByRoute: Map<string, TestResult[]>;
    /** Results grouped by mode */
    resultsByMode: Map<TestMode, TestResult[]>;
    /** All errors */
    errors: TestError[];
    /** Timestamp */
    timestamp: Date;
    /** Configuration used */
    config: GraphTesterConfig;
}
/**
 * Reporter interface.
 */
export interface Reporter {
    /** Generate report from aggregated results */
    generate(results: AggregatedTestResults): Promise<void>;
    /** Reporter name */
    name: string;
}
/**
 * Report format options.
 */
export type ReportFormat = 'json' | 'html' | 'markdown' | 'csv';
/**
 * Test function execution options.
 */
export interface ExecuteOptions {
    /** Playwright page instance */
    page: Page;
    /** Test context */
    context: TestContext;
    /** Timeout (ms) */
    timeout?: number;
}
/**
 * Test function setup options.
 */
export interface SetupOptions {
    /** Playwright page instance */
    page: Page;
    /** Test context */
    context?: TestContext;
}
/**
 * Test function teardown options.
 */
export interface TeardownOptions {
    /** Playwright page instance */
    page: Page;
    /** Test context */
    context?: TestContext;
}
//# sourceMappingURL=types.d.ts.map