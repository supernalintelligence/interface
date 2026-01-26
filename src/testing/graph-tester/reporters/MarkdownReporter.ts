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
    const markdown = this.generateMarkdown(results);
    const outputPath = `${this.config.outputDir}/${this.config.filename || 'TEST_RESULTS.md'}`;

    await this.ensureDirectory(this.config.outputDir);
    await this.writeFile(outputPath, markdown);

    console.log(`📝 Markdown report generated: ${outputPath}`);
  }

  private generateMarkdown(results: AggregatedTestResults): string {
    const sections: string[] = [];

    // Header
    sections.push('# Graph-Based Testing Report\n');
    sections.push(`> Generated on ${new Date().toLocaleString()}\n`);

    // Summary
    sections.push('## Summary\n');
    sections.push('| Metric | Value |');
    sections.push('|--------|-------|');
    sections.push(`| Routes Tested | ${results.routeCount} |`);
    sections.push(`| Total Tests | ${results.testCount} |`);
    sections.push(`| Passed | ${results.passedCount} ✅ |`);
    sections.push(`| Failed | ${results.failedCount} ❌ |`);
    sections.push(`| Pass Rate | ${results.passRate}% |`);
    sections.push(`| Total Duration | ${(results.totalDuration / 1000).toFixed(2)}s |`);
    sections.push('');

    // Status badge
    const status = results.passRate === 100 ? '✅ All tests passed' : `⚠️ ${results.failedCount} test(s) failed`;
    sections.push(`**Status:** ${status}\n`);

    // Results by mode
    sections.push('## Results by Test Mode\n');
    for (const [mode, modeResults] of results.resultsByMode) {
      const passed = modeResults.filter((r) => r.passed).length;
      const failed = modeResults.filter((r) => !r.passed).length;
      const icon = this.getModeIcon(mode);

      sections.push(`### ${icon} ${mode.toUpperCase()}\n`);
      sections.push(`- **Passed:** ${passed} ✅`);
      sections.push(`- **Failed:** ${failed} ❌`);
      sections.push(`- **Total:** ${modeResults.length}`);
      sections.push('');
    }

    // Results by route
    sections.push('## Test Results by Route\n');
    for (const [route, routeResults] of results.resultsByRoute) {
      sections.push(`### \`${route}\`\n`);
      sections.push('| Mode | Status | Duration | Errors |');
      sections.push('|------|--------|----------|--------|');

      for (const result of routeResults) {
        const status = result.passed ? '✅ PASS' : '❌ FAIL';
        const errors = result.errors.length > 0 ? result.errors.length : '-';
        sections.push(`| ${result.mode} | ${status} | ${result.duration}ms | ${errors} |`);
      }

      // Show errors if any
      const failedResults = routeResults.filter((r) => !r.passed);
      if (failedResults.length > 0) {
        sections.push('\n**Errors:**\n');
        for (const result of failedResults) {
          if (result.errors.length > 0) {
            sections.push(`<details>`);
            sections.push(`<summary><strong>${result.mode}</strong> - ${result.errors.length} error(s)</summary>\n`);
            sections.push('```');
            result.errors.forEach((err) => sections.push(typeof err === 'string' ? err : err.message));
            sections.push('```');
            sections.push('</details>\n');
          }
        }
      }

      sections.push('');
    }

    // Detailed mode breakdown
    sections.push('## Detailed Mode Analysis\n');

    for (const [mode, modeResults] of results.resultsByMode) {
      const icon = this.getModeIcon(mode);
      sections.push(`### ${icon} ${mode.toUpperCase()} Mode\n`);

      const passed = modeResults.filter((r) => r.passed).length;
      const failed = modeResults.filter((r) => !r.passed).length;
      const avgDuration = modeResults.reduce((sum, r) => sum + r.duration, 0) / modeResults.length;

      sections.push(`**Performance:**`);
      sections.push(`- Average Duration: ${avgDuration.toFixed(2)}ms`);
      sections.push(`- Success Rate: ${((passed / modeResults.length) * 100).toFixed(1)}%`);
      sections.push('');

      // Show failed routes for this mode
      const failures = modeResults.filter((r) => !r.passed);
      if (failures.length > 0) {
        sections.push('**Failed Routes:**\n');
        for (const result of failures) {
          sections.push(`- \`${result.route || 'unknown'}\``);
          if (this.config.includeErrorStacks && result.errors.length > 0) {
            sections.push('  ```');
            result.errors.forEach((err) => sections.push(`  ${typeof err === 'string' ? err : err.message}`));
            sections.push('  ```');
          }
        }
        sections.push('');
      }
    }

    // Footer
    sections.push('---\n');
    sections.push('_Generated by Supernal Interface Graph-Based Testing Framework_');

    return sections.join('\n');
  }

  private getModeIcon(mode: string): string {
    const icons: Record<string, string> = {
      visual: '👁️',
      performance: '⚡',
      accessibility: '♿',
      seo: '🔍',
    };
    return icons[mode] || '📊';
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
