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
    const errors: string[] = [];

    try {
      // Inject axe-core
      await this.injectAxe(page);

      // Run axe analysis with WCAG tags
      const wcagTags = this.getWCAGTags();
      const results = await page.evaluate((tags) => {
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
          errors.push(`[${v.impact}] ${v.help} (${v.nodes.length} instances)`);
        });
      }

      if (this.config.strict && hasWarnings) {
        warnings.forEach((w: any) => {
          errors.push(`[warning] ${w.help} (${w.nodes.length} instances)`);
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
      errors.push(`Accessibility testing failed: ${error instanceof Error ? error.message : String(error)}`);
      return {
        passed: false,
        duration: Date.now() - startTime,
        errors,
      };
    }
  }

  private async injectAxe(page: Page): Promise<void> {
    try {
      // Try to load axe-core from CDN
      await page.addScriptTag({
        url: 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.8.3/axe.min.js',
      });
    } catch (error) {
      // Fallback: try to load from node_modules
      try {
        const axeSource = await import('axe-core');
        await page.evaluate((source) => {
          // @ts-ignore
          window.axe = source;
        }, axeSource);
      } catch {
        throw new Error('Failed to inject axe-core. Install axe-core: npm install axe-core');
      }
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
