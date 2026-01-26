/**
 * JSON reporter for CI/CD integration.
 *
 * Generates machine-readable JSON output with complete test results.
 *
 * @packageDocumentation
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import type { AggregatedTestResults, Reporter } from '../core/types';

/**
 * Configuration for JSON reporter.
 */
export interface JSONReporterConfig {
  /** Output directory */
  outputDir: string;

  /** Output filename (default: 'test-results.json') */
  filename?: string;

  /** Whether to pretty-print JSON (default: true) */
  pretty?: boolean;

  /** Whether to include detailed error stacks (default: true) */
  includeErrorStacks?: boolean;
}

/**
 * JSON reporter.
 *
 * Generates structured JSON output suitable for CI/CD pipelines and
 * programmatic analysis.
 *
 * @example
 * ```typescript
 * const reporter = new JSONReporter({
 *   outputDir: './test-results',
 *   filename: 'results.json',
 *   pretty: true
 * });
 *
 * await reporter.generate(results);
 * ```
 */
export class JSONReporter implements Reporter {
  readonly name = 'JSON Reporter';

  private config: Required<JSONReporterConfig>;

  constructor(config: JSONReporterConfig) {
    this.config = {
      filename: 'test-results.json',
      pretty: true,
      includeErrorStacks: true,
      ...config,
    };
  }

  /**
   * Generate JSON report.
   *
   * @param results - Aggregated test results
   */
  async generate(results: AggregatedTestResults): Promise<void> {
    const startTime = Date.now();

    // Ensure output directory exists
    await fs.mkdir(this.config.outputDir, { recursive: true });

    // Convert Map to plain objects for JSON serialization
    const serializable = {
      summary: {
        routeCount: results.routeCount,
        testCount: results.testCount,
        passedCount: results.passedCount,
        failedCount: results.failedCount,
        passRate: results.passRate,
        totalDuration: results.totalDuration,
        timestamp: results.timestamp.toISOString(),
      },
      config: results.config,
      resultsByRoute: Array.from(results.resultsByRoute.entries()).map(([route, testResults]) => ({
        route,
        results: testResults.map((r) => ({
          ...r,
          errors: this.config.includeErrorStacks
            ? r.errors
            : r.errors.map((e) => ({ ...e, stack: undefined })),
        })),
      })),
      resultsByMode: Array.from(results.resultsByMode.entries()).map(([mode, testResults]) => ({
        mode,
        results: testResults.map((r) => ({
          ...r,
          errors: this.config.includeErrorStacks
            ? r.errors
            : r.errors.map((e) => ({ ...e, stack: undefined })),
        })),
      })),
      errors: this.config.includeErrorStacks
        ? results.errors
        : results.errors.map((e) => ({ ...e, stack: undefined })),
    };

    // Write JSON file
    const outputPath = path.join(this.config.outputDir, this.config.filename);
    const json = this.config.pretty
      ? JSON.stringify(serializable, null, 2)
      : JSON.stringify(serializable);

    await fs.writeFile(outputPath, json, 'utf-8');

    const duration = Date.now() - startTime;
    console.log(`JSON report generated in ${duration}ms: ${outputPath}`);
  }
}
