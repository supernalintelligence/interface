/**
 * Unified reporter - orchestrates multiple reporters and correlates results across modes.
 *
 * @packageDocumentation
 */

import type { AggregatedTestResults, Reporter } from '../core/types';
import { JSONReporter } from './JSONReporter';
import { HTMLReporter } from './HTMLReporter';
import { MarkdownReporter } from './MarkdownReporter';

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
    console.log(`\n📊 Generating unified reports in ${this.config.formats.length} format(s)...\n`);

    const reporters: Reporter[] = [];

    // Create reporters based on requested formats
    if (this.config.formats.includes('json')) {
      reporters.push(
        new JSONReporter({
          outputDir: this.config.outputDir,
          filename: 'results.json',
          pretty: true,
        })
      );
    }

    if (this.config.formats.includes('html')) {
      reporters.push(
        new HTMLReporter({
          outputDir: this.config.outputDir,
          filename: 'index.html',
          includeCharts: true,
        })
      );
    }

    if (this.config.formats.includes('markdown')) {
      reporters.push(
        new MarkdownReporter({
          outputDir: this.config.outputDir,
          filename: 'TEST_RESULTS.md',
          includeErrorStacks: this.config.includeDetailedLogs,
        })
      );
    }

    if (this.config.formats.includes('csv')) {
      reporters.push({
        name: 'CSV Reporter',
        generate: async (results: AggregatedTestResults) => {
          await this.generateCSV(results);
        },
      });
    }

    // Generate all reports in parallel
    await Promise.all(reporters.map((reporter) => reporter.generate(results)));

    console.log(`✅ Unified report generation complete\n`);
  }

  private async generateCSV(results: AggregatedTestResults): Promise<void> {
    const rows: string[] = [];

    // CSV header
    rows.push('Route,Mode,Status,Duration (ms),Errors');

    // CSV data
    for (const [route, routeResults] of results.resultsByRoute) {
      for (const result of routeResults) {
        const status = result.passed ? 'PASS' : 'FAIL';
        const errors = result.errors.length > 0 ? `"${result.errors.join('; ')}"` : '';
        rows.push(`"${route}",${result.mode},${status},${result.duration},${errors}`);
      }
    }

    const csv = rows.join('\n');
    const outputPath = `${this.config.outputDir}/results.csv`;

    await this.ensureDirectory(this.config.outputDir);
    await this.writeFile(outputPath, csv);

    console.log(`📊 CSV report generated: ${outputPath}`);
  }

  private async ensureDirectory(dir: string): Promise<void> {
    const fs = await import('fs/promises');
    await fs.mkdir(dir, { recursive: true });
  }

  private async writeFile(path: string, content: string): Promise<void> {
    const fs = await import('fs/promises');
    await fs.writeFile(path, content, 'utf-8');
  }
}
