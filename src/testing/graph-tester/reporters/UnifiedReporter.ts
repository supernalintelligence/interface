/**
 * Unified reporter (stub - to be implemented in Phase 2).
 *
 * Will orchestrate multiple reporters and correlate results across modes.
 *
 * @packageDocumentation
 */

import type { AggregatedTestResults, Reporter } from '../core/types';

/**
 * Configuration for unified reporter.
 */
export interface UnifiedReporterConfig {
  /** Output directory */
  outputDir: string;

  /** Report formats to generate */
  formats: ('json' | 'html' | 'markdown' | 'csv')[];

  /** Whether to include detailed logs */
  includeDetailedLogs?: boolean;
}

/**
 * Unified reporter (stub).
 */
export class UnifiedReporter implements Reporter {
  readonly name = 'Unified Reporter';

  private config: UnifiedReporterConfig;

  constructor(config: UnifiedReporterConfig) {
    this.config = config;
  }

  async generate(results: AggregatedTestResults): Promise<void> {
    // TODO: Implement in Phase 2
    // Will orchestrate JSON, HTML, Markdown reporters
    throw new Error('UnifiedReporter not yet implemented (Phase 2)');
  }
}
