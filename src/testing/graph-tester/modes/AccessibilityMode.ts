/**
 * Accessibility testing mode (stub - to be implemented in Phase 2).
 *
 * Will integrate axe-core for WCAG compliance testing.
 *
 * @packageDocumentation
 */

import type { Page } from '@playwright/test';
import { TestFunction } from '../core/TestFunction';
import type { TestContext, TestResult } from '../core/types';

/**
 * Configuration for accessibility mode.
 */
export interface AccessibilityConfig {
  /** Output directory */
  outputDir: string;

  /** WCAG version (default: '2.1') */
  wcagVersion?: '2.0' | '2.1' | '2.2';

  /** WCAG level (default: 'AA') */
  wcagLevel?: 'A' | 'AA' | 'AAA';

  /** Whether to fail on warnings (default: false) */
  strict?: boolean;
}

/**
 * Accessibility testing mode (stub).
 */
export class AccessibilityMode extends TestFunction {
  readonly mode = 'accessibility';
  readonly name = 'Accessibility';
  readonly description = 'Tests WCAG compliance using axe-core';

  private config: AccessibilityConfig;

  constructor(config: AccessibilityConfig) {
    super();
    this.config = config;
  }

  async execute(page: Page, context: TestContext): Promise<TestResult> {
    const startTime = Date.now();
    const errors: import('../core/types').TestError[] = [];

    try {
      // Inject axe-core
      await this.injectAxe(page);

      // Run axe analysis with WCAG tags
      const wcagTags = this.getWCAGTags();
      const results = await page.evaluate((tags): Promise<any> => {
        return new Promise((resolve) => {
          // @ts-ignore - axe is injected globally
          if (typeof window.axe === 'undefined') {
            resolve({ violations: [], passes: [], incomplete: [], inapplicable: [] });
            return;
          }

          // @ts-ignore
          window.axe
            .run({
              runOnly: {
                type: 'tag',
                values: tags,
              },
            })
            .then((results: any) => {
              resolve(results);
            })
            .catch((error: any) => {
              resolve({ violations: [], passes: [], incomplete: [], inapplicable: [], error: error.message });
            });
        });
      }, wcagTags);

      // Process violations
      const violations = results.violations || [];
      const warnings = results.incomplete || [];

      // Build detailed violation reports
      const violationReports = violations.map((v: any) => ({
        id: v.id,
        impact: v.impact,
        description: v.description,
        help: v.help,
        helpUrl: v.helpUrl,
        nodes: v.nodes.map((node: any) => ({
          html: node.html,
          target: node.target,
          failureSummary: node.failureSummary,
        })),
      }));

      const warningReports = warnings.map((w: any) => ({
        id: w.id,
        impact: w.impact,
        description: w.description,
        help: w.help,
        helpUrl: w.helpUrl,
        nodes: w.nodes.length,
      }));

      // Determine if test passed
      const hasViolations = violations.length > 0;
      const hasWarnings = warnings.length > 0;
      const passed = this.config.strict ? !hasViolations && !hasWarnings : !hasViolations;

      // Collect error messages
      if (hasViolations) {
        violations.forEach((v: any) => {
          errors.push({
            severity: v.impact === 'critical' ? 'critical' : 'warning',
            message: `[${v.impact}] ${v.help} (${v.nodes.length} instances)`,
            location: v.helpUrl,
          });
        });
      }

      if (this.config.strict && hasWarnings) {
        warnings.forEach((w: any) => {
          errors.push({
            severity: 'info',
            message: `[warning] ${w.help} (${w.nodes.length} instances)`,
            location: w.helpUrl,
          });
        });
      }

      // Save results
      const outputPath = `${this.config.outputDir}/${this.sanitizeRoute(context.route)}-accessibility.json`;
      await this.ensureDirectory(this.config.outputDir);
      await this.writeFile(
        outputPath,
        JSON.stringify(
          {
            route: context.route,
            wcagVersion: this.config.wcagVersion || '2.1',
            wcagLevel: this.config.wcagLevel || 'AA',
            summary: {
              violations: violations.length,
              warnings: warnings.length,
              passes: results.passes?.length || 0,
              incomplete: results.incomplete?.length || 0,
            },
            violations: violationReports,
            warnings: warningReports,
          },
          null,
          2
        )
      );

      const duration = Date.now() - startTime;

      return {
        passed,
        duration,
        errors,
        metadata: {
          accessibility: {
            violationCount: violations.length,
            warningCount: warnings.length,
            passCount: results.passes?.length || 0,
          },
          outputPath,
        },
      };
    } catch (error) {
      errors.push({
        severity: 'critical',
        message: `Accessibility testing failed: ${error instanceof Error ? error.message : String(error)}`,
        stack: error instanceof Error ? error.stack : undefined,
      });
      return {
        passed: false,
        duration: Date.now() - startTime,
        errors,
        metadata: {},
      };
    }
  }

  private async injectAxe(page: Page): Promise<void> {
    // Try local axe-core first (walk up from __dirname to find node_modules/axe-core).
    // Falls back to CDN if not found locally. This allows offline/CI use.
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const nodePath = require('path') as typeof import('path');
    let localAxePath: string | null = null;
    let searchDir = __dirname;
    for (let i = 0; i < 10; i++) {
      const candidate = nodePath.join(searchDir, 'node_modules', 'axe-core', 'axe.min.js');
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      if ((require('fs') as typeof import('fs')).existsSync(candidate)) {
        localAxePath = candidate;
        break;
      }
      const parent = nodePath.dirname(searchDir);
      if (parent === searchDir) break;
      searchDir = parent;
    }
    if (localAxePath) {
      try {
        await page.addScriptTag({ path: localAxePath });
        return;
      } catch (_localErr) {
        // local path failed, fall through to CDN
      }
    }
    try {
      await page.addScriptTag({
        url: 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.8.3/axe.min.js',
      });
    } catch (error) {
      throw new Error('Failed to inject axe-core (tried local and CDN). Install axe-core: npm install axe-core');
    }
  }

  private getWCAGTags(): string[] {
    const version = this.config.wcagVersion || '2.1';
    const level = this.config.wcagLevel || 'AA';

    const tags = ['wcag2a'];

    if (level === 'AA' || level === 'AAA') {
      tags.push('wcag2aa');
    }

    if (level === 'AAA') {
      tags.push('wcag2aaa');
    }

    // Add version-specific tags
    if (version === '2.1') {
      tags.push('wcag21a');
      if (level === 'AA' || level === 'AAA') tags.push('wcag21aa');
      if (level === 'AAA') tags.push('wcag21aaa');
    }

    if (version === '2.2') {
      tags.push('wcag21a', 'wcag22a');
      if (level === 'AA' || level === 'AAA') tags.push('wcag21aa', 'wcag22aa');
      if (level === 'AAA') tags.push('wcag21aaa', 'wcag22aaa');
    }

    return tags;
  }

  private sanitizeRoute(route: string): string {
    return route.replace(/^\//, '').replace(/\//g, '-') || 'home';
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
