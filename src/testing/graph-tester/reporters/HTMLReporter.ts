/**
 * HTML reporter (stub - to be implemented in Phase 2).
 *
 * Will generate interactive dashboard with charts and drill-down.
 *
 * @packageDocumentation
 */

import type { AggregatedTestResults, Reporter } from '../core/types';

/**
 * Configuration for HTML reporter.
 */
export interface HTMLReporterConfig {
  /** Output directory */
  outputDir: string;

  /** Output filename (default: 'index.html') */
  filename?: string;

  /** Whether to include charts (default: true) */
  includeCharts?: boolean;
}

/**
 * HTML reporter (stub).
 */
export class HTMLReporter implements Reporter {
  readonly name = 'HTML Reporter';

  private config: HTMLReporterConfig;

  constructor(config: HTMLReporterConfig) {
    this.config = config;
  }

  async generate(results: AggregatedTestResults): Promise<void> {
    // TODO: Implement in Phase 2
    // Will generate interactive HTML dashboard
    throw new Error('HTMLReporter not yet implemented (Phase 2)');
  }
}
