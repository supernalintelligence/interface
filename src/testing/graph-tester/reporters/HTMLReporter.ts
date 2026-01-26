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
    const html = this.generateHTML(results);
    const outputPath = `${this.config.outputDir}/${this.config.filename || 'index.html'}`;

    await this.ensureDirectory(this.config.outputDir);
    await this.writeFile(outputPath, html);

    console.log(`📊 HTML report generated: ${outputPath}`);
  }

  private generateHTML(results: AggregatedTestResults): string {
    const includeCharts = this.config.includeCharts !== false;

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Graph-Based Testing Report</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      background: #f5f5f5;
      padding: 20px;
    }
    .container { max-width: 1400px; margin: 0 auto; }
    header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px;
      border-radius: 8px;
      margin-bottom: 30px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    h1 { font-size: 2em; margin-bottom: 10px; }
    .summary {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }
    .stat-card {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      transition: transform 0.2s;
    }
    .stat-card:hover { transform: translateY(-2px); box-shadow: 0 4px 8px rgba(0,0,0,0.15); }
    .stat-card h3 { color: #666; font-size: 0.9em; text-transform: uppercase; margin-bottom: 10px; }
    .stat-card .value { font-size: 2.5em; font-weight: bold; color: #667eea; }
    .stat-card .label { color: #999; font-size: 0.9em; }
    .pass-rate { color: #10b981 !important; }
    .fail-rate { color: #ef4444 !important; }
    .section {
      background: white;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      margin-bottom: 30px;
    }
    .section h2 {
      font-size: 1.5em;
      margin-bottom: 20px;
      color: #667eea;
      border-bottom: 2px solid #f0f0f0;
      padding-bottom: 10px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }
    th, td {
      text-align: left;
      padding: 12px;
      border-bottom: 1px solid #e0e0e0;
    }
    th {
      background: #f8f9fa;
      font-weight: 600;
      color: #666;
      text-transform: uppercase;
      font-size: 0.85em;
    }
    tr:hover { background: #f8f9fa; }
    .badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 0.85em;
      font-weight: 600;
    }
    .badge-success { background: #d1fae5; color: #065f46; }
    .badge-error { background: #fee2e2; color: #991b1b; }
    .badge-warning { background: #fef3c7; color: #92400e; }
    .mode-visual { color: #8b5cf6; }
    .mode-performance { color: #f59e0b; }
    .mode-accessibility { color: #10b981; }
    .mode-seo { color: #3b82f6; }
    .chart-container {
      width: 100%;
      height: 300px;
      margin: 20px 0;
      position: relative;
    }
    .bar-chart {
      display: flex;
      align-items: flex-end;
      justify-content: space-around;
      height: 250px;
      gap: 10px;
      padding: 20px;
      background: #f8f9fa;
      border-radius: 8px;
    }
    .bar {
      flex: 1;
      background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
      border-radius: 4px 4px 0 0;
      position: relative;
      min-height: 20px;
      display: flex;
      align-items: flex-end;
      justify-content: center;
      color: white;
      font-weight: bold;
      padding-bottom: 5px;
    }
    .bar-label {
      text-align: center;
      margin-top: 10px;
      font-size: 0.85em;
      color: #666;
    }
    .details {
      display: none;
      padding: 15px;
      background: #f8f9fa;
      border-radius: 4px;
      margin-top: 10px;
    }
    .details.show { display: block; }
    .expand-btn {
      background: none;
      border: none;
      color: #667eea;
      cursor: pointer;
      font-weight: 600;
      padding: 4px 8px;
      border-radius: 4px;
      transition: background 0.2s;
    }
    .expand-btn:hover { background: #f0f0f0; }
    .error-list {
      list-style: none;
      padding: 0;
    }
    .error-list li {
      padding: 8px;
      background: #fee2e2;
      border-left: 3px solid #ef4444;
      margin-bottom: 8px;
      border-radius: 4px;
      color: #991b1b;
    }
    footer {
      text-align: center;
      color: #999;
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e0e0e0;
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>📊 Graph-Based Testing Report</h1>
      <p>Generated on ${new Date().toLocaleString()}</p>
    </header>

    ${this.generateSummarySection(results)}
    ${includeCharts ? this.generateChartsSection(results) : ''}
    ${this.generateResultsTable(results)}
    ${this.generateModeBreakdown(results)}

    <footer>
      <p>Generated by Supernal Interface Graph-Based Testing Framework</p>
    </footer>
  </div>

  <script>
    function toggleDetails(id) {
      const element = document.getElementById(id);
      element.classList.toggle('show');
    }
  </script>
</body>
</html>`;
  }

  private generateSummarySection(results: AggregatedTestResults): string {
    return `
    <div class="summary">
      <div class="stat-card">
        <h3>Routes Tested</h3>
        <div class="value">${results.routeCount}</div>
      </div>
      <div class="stat-card">
        <h3>Total Tests</h3>
        <div class="value">${results.testCount}</div>
      </div>
      <div class="stat-card">
        <h3>Passed</h3>
        <div class="value pass-rate">${results.passedCount}</div>
      </div>
      <div class="stat-card">
        <h3>Failed</h3>
        <div class="value fail-rate">${results.failedCount}</div>
      </div>
      <div class="stat-card">
        <h3>Pass Rate</h3>
        <div class="value ${results.passRate >= 90 ? 'pass-rate' : 'fail-rate'}">${results.passRate}%</div>
      </div>
      <div class="stat-card">
        <h3>Duration</h3>
        <div class="value">${(results.totalDuration / 1000).toFixed(1)}s</div>
      </div>
    </div>`;
  }

  private generateChartsSection(results: AggregatedTestResults): string {
    const modeData: { mode: string; passed: number; failed: number }[] = [];

    for (const [mode, modeResults] of results.resultsByMode) {
      const passed = modeResults.filter((r) => r.passed).length;
      const failed = modeResults.filter((r) => !r.passed).length;
      modeData.push({ mode, passed, failed });
    }

    const maxCount = Math.max(...modeData.map((d) => d.passed + d.failed));

    return `
    <div class="section">
      <h2>Results by Test Mode</h2>
      <div class="bar-chart">
        ${modeData
          .map((data) => {
            const total = data.passed + data.failed;
            const height = (total / maxCount) * 100;
            return `
              <div style="flex: 1;">
                <div class="bar" style="height: ${height}%">
                  ${total}
                </div>
                <div class="bar-label">
                  <strong>${data.mode}</strong><br>
                  ✓ ${data.passed} / ✗ ${data.failed}
                </div>
              </div>
            `;
          })
          .join('')}
      </div>
    </div>`;
  }

  private generateResultsTable(results: AggregatedTestResults): string {
    const rows: string[] = [];

    for (const [route, routeResults] of results.resultsByRoute) {
      for (const result of routeResults) {
        rows.push(`
          <tr>
            <td><strong>${route}</strong></td>
            <td><span class="mode-${result.mode}">${result.mode}</span></td>
            <td><span class="badge ${result.passed ? 'badge-success' : 'badge-error'}">${result.passed ? 'PASS' : 'FAIL'}</span></td>
            <td>${result.duration}ms</td>
            <td>
              ${
                result.errors.length > 0
                  ? `
                <button class="expand-btn" onclick="toggleDetails('errors-${this.generateId(route || 'unknown', result.mode || 'unknown')}')">
                  View ${result.errors.length} error(s)
                </button>
                <div id="errors-${this.generateId(route || 'unknown', result.mode || 'unknown')}" class="details">
                  <ul class="error-list">
                    ${result.errors.map((err) => `<li>${this.escapeHtml(typeof err === 'string' ? err : err.message)}</li>`).join('')}
                  </ul>
                </div>
              `
                  : '<span class="badge badge-success">No errors</span>'
              }
            </td>
          </tr>
        `);
      }
    }

    return `
    <div class="section">
      <h2>Test Results by Route</h2>
      <table>
        <thead>
          <tr>
            <th>Route</th>
            <th>Mode</th>
            <th>Status</th>
            <th>Duration</th>
            <th>Errors</th>
          </tr>
        </thead>
        <tbody>
          ${rows.join('')}
        </tbody>
      </table>
    </div>`;
  }

  private generateModeBreakdown(results: AggregatedTestResults): string {
    const sections: string[] = [];

    for (const [mode, modeResults] of results.resultsByMode) {
      const passed = modeResults.filter((r) => r.passed).length;
      const failed = modeResults.filter((r) => !r.passed).length;
      const avgDuration = modeResults.reduce((sum, r) => sum + r.duration, 0) / modeResults.length;

      sections.push(`
        <div class="section">
          <h2><span class="mode-${mode}">${mode.toUpperCase()}</span> Mode Results</h2>
          <div class="summary" style="grid-template-columns: repeat(3, 1fr);">
            <div class="stat-card">
              <h3>Passed</h3>
              <div class="value pass-rate">${passed}</div>
            </div>
            <div class="stat-card">
              <h3>Failed</h3>
              <div class="value fail-rate">${failed}</div>
            </div>
            <div class="stat-card">
              <h3>Avg Duration</h3>
              <div class="value">${avgDuration.toFixed(0)}ms</div>
            </div>
          </div>
        </div>
      `);
    }

    return sections.join('');
  }

  private generateId(route: string, mode: string): string {
    return `${route.replace(/\//g, '-')}-${mode}`.replace(/[^a-z0-9-]/gi, '');
  }

  private escapeHtml(text: string): string {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
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
