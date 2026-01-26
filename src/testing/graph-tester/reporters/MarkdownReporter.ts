/**
 * Markdown reporter (stub - to be implemented in Phase 2).
 *
 * Will generate GitHub-friendly markdown reports.
 *
 * @packageDocumentation
 */

import type { AggregatedTestResults, Reporter } from '../core/types';

/**
 * Configuration for Markdown reporter.
 */
export interface MarkdownReporterConfig {
  /** Output directory */
  outputDir: string;

  /** Output filename (default: 'TEST_RESULTS.md') */
  filename?: string;

  /** Whether to include detailed error stacks */
  includeErrorStacks?: boolean;
}

/**
 * Markdown reporter (stub).
 */
export class MarkdownReporter implements Reporter {
  readonly name = 'Markdown Reporter';

  private config: MarkdownReporterConfig;

  constructor(config: MarkdownReporterConfig) {
    this.config = config;
  }

  async generate(results: AggregatedTestResults): Promise<void> {
    // TODO: Implement in Phase 2
    // Will generate markdown report
    throw new Error('MarkdownReporter not yet implemented (Phase 2)');
  }
}
