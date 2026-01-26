/**
 * Graph-Based Testing Framework
 *
 * A comprehensive testing framework that systematically applies different testing functions
 * (visual regression, performance, accessibility, SEO) to all routes in your application.
 *
 * ## Features
 *
 * - **Screenshot Annotation**: Capture screenshots with element bounding boxes, testids, and interaction capabilities
 * - **Multiple Test Modes**: Visual regression, performance, accessibility, SEO
 * - **AI-Ready Output**: JSON + PNG format optimized for multimodal AI analysis
 * - **Multi-Format Reporting**: HTML (interactive), JSON (CI/CD), Markdown (docs)
 * - **Parallel Testing**: Port pool fixture for running tests in parallel
 * - **Pluggable Architecture**: Create custom test modes by extending TestFunction
 *
 * ## Usage
 *
 * ```typescript
 * import { GraphTester, VisualRegressionMode, JSONReporter } from '@supernal/interface/testing/graph-tester';
 *
 * const tester = new GraphTester({
 *   baseUrl: 'http://localhost:3000',
 *   routes: [
 *     { route: '/', metadata: { name: 'Home' } },
 *     { route: '/dashboard', metadata: { name: 'Dashboard' } }
 *   ],
 *   modes: ['visual'],
 *   output: {
 *     dir: './test-results',
 *     formats: ['json', 'html']
 *   }
 * });
 *
 * // Register test modes
 * tester.registerTestFunction(new VisualRegressionMode({
 *   outputDir: './screenshots',
 *   annotate: true,
 *   generateHTML: true
 * }));
 *
 * // Run tests
 * const results = await tester.runTests();
 * console.log(`Pass rate: ${results.passRate}%`);
 *
 * // Generate reports
 * const reporter = new JSONReporter({ outputDir: './test-results' });
 * await reporter.generate(results);
 * ```
 *
 * ## Enterprise Features
 *
 * For automatic route discovery via NavigationGraph, CLI commands, and AI analysis,
 * see `@supernalintelligence/interface-enterprise/testing/graph-tester`.
 *
 * @packageDocumentation
 */

// ==================== Core ====================

export { TestFunction, isTestFunction } from './core/TestFunction';
export { GraphTester } from './core/GraphTester';
export type * from './core/types';
export { ViewportPresets } from './core/types';

// ==================== Screenshot Annotation ====================

export { ScreenshotAnnotator } from './screenshot/ScreenshotAnnotator';
export type { ScreenshotAnnotatorConfig } from './screenshot/ScreenshotAnnotator';

export { HTMLAnnotationRenderer } from './screenshot/HTMLAnnotationRenderer';
export { CanvasAnnotationRenderer } from './screenshot/CanvasAnnotationRenderer';

export type * from './screenshot/types';

// ==================== Test Modes ====================

export { VisualRegressionMode } from './modes/VisualRegressionMode';
export type { VisualRegressionConfig } from './modes/VisualRegressionMode';

export { PerformanceMode } from './modes/PerformanceMode';
export type { PerformanceConfig } from './modes/PerformanceMode';

export { AccessibilityMode } from './modes/AccessibilityMode';
export type { AccessibilityConfig } from './modes/AccessibilityMode';

export { SEOMode } from './modes/SEOMode';
export type { SEOConfig } from './modes/SEOMode';

// ==================== Reporters ====================

export { UnifiedReporter } from './reporters/UnifiedReporter';
export type { UnifiedReporterConfig } from './reporters/UnifiedReporter';

export { JSONReporter } from './reporters/JSONReporter';
export type { JSONReporterConfig } from './reporters/JSONReporter';

export { HTMLReporter } from './reporters/HTMLReporter';
export type { HTMLReporterConfig } from './reporters/HTMLReporter';

export { MarkdownReporter } from './reporters/MarkdownReporter';
export type { MarkdownReporterConfig } from './reporters/MarkdownReporter';

// ==================== Fixtures ====================

export { test as testWithPortPool, expect, cleanupPortPool } from './fixtures/portPool';
export type { PortPoolFixture } from './fixtures/portPool';
