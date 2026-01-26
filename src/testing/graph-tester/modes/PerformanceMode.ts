/**
 * Performance testing mode (stub - to be implemented in Phase 2).
 *
 * Will collect Core Web Vitals and Lighthouse metrics.
 *
 * @packageDocumentation
 */

import type { Page } from '@playwright/test';
import { TestFunction } from '../core/TestFunction';
import type { TestContext, TestResult } from '../core/types';

/**
 * Configuration for performance mode.
 */
export interface PerformanceConfig {
  /** Output directory */
  outputDir: string;

  /** Whether to run Lighthouse (default: false) */
  lighthouse?: boolean;

  /** Performance thresholds */
  thresholds?: {
    fcp?: number;
    lcp?: number;
    cls?: number;
    tti?: number;
    tbt?: number;
  };
}

/**
 * Performance testing mode (stub).
 */
export class PerformanceMode extends TestFunction {
  readonly mode = 'performance';
  readonly name = 'Performance';
  readonly description = 'Collects Core Web Vitals and performance metrics';

  private config: PerformanceConfig;

  constructor(config: PerformanceConfig) {
    super();
    this.config = config;
  }

  async execute(page: Page, context: TestContext): Promise<TestResult> {
    const startTime = Date.now();
    const errors: import('../core/types').TestError[] = [];

    try {
      // Collect Core Web Vitals and performance metrics
      const metrics = await page.evaluate((): Promise<any> => {
        return new Promise((resolve) => {
          const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            // Process entries as they come
          });

          // Use performance API to get navigation timing
          const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
          const paintEntries = performance.getEntriesByType('paint');

          const fcp = paintEntries.find((entry) => entry.name === 'first-contentful-paint')?.startTime;

          // Get layout shift metrics
          const layoutShifts = performance.getEntriesByType('layout-shift') as any[];
          const cls = layoutShifts.reduce((sum, entry) => sum + (entry.value || 0), 0);

          // Calculate TTI approximation (when main thread is idle)
          const tti = perfData ? perfData.domInteractive : 0;

          // Get resource timing
          const resources = performance.getEntriesByType('resource');
          const totalSize = resources.reduce((sum: number, r: any) => sum + (r.transferSize || 0), 0);

          resolve({
            // Core Web Vitals
            fcp: fcp || 0,
            lcp: 0, // Will be collected via observer
            cls: cls || 0,
            tti: tti || 0,
            tbt: 0, // Total Blocking Time - approximation

            // Additional metrics
            domContentLoaded: perfData?.domContentLoadedEventEnd || 0,
            loadComplete: perfData?.loadEventEnd || 0,
            totalResourceSize: totalSize,
            resourceCount: resources.length,

            // Timing breakdown
            dns: perfData ? perfData.domainLookupEnd - perfData.domainLookupStart : 0,
            tcp: perfData ? perfData.connectEnd - perfData.connectStart : 0,
            ttfb: perfData ? perfData.responseStart - perfData.requestStart : 0,
          });
        });
      });

      // Check thresholds
      const thresholdViolations: import('../core/types').TestError[] = [];
      if (this.config.thresholds) {
        if (this.config.thresholds.fcp && metrics.fcp > this.config.thresholds.fcp) {
          thresholdViolations.push({
            severity: 'warning',
            message: `FCP ${metrics.fcp.toFixed(2)}ms exceeds threshold ${this.config.thresholds.fcp}ms`,
          });
        }
        if (this.config.thresholds.lcp && metrics.lcp > this.config.thresholds.lcp) {
          thresholdViolations.push({
            severity: 'warning',
            message: `LCP ${metrics.lcp.toFixed(2)}ms exceeds threshold ${this.config.thresholds.lcp}ms`,
          });
        }
        if (this.config.thresholds.cls && metrics.cls > this.config.thresholds.cls) {
          thresholdViolations.push({
            severity: 'warning',
            message: `CLS ${metrics.cls.toFixed(3)} exceeds threshold ${this.config.thresholds.cls}`,
          });
        }
        if (this.config.thresholds.tti && metrics.tti > this.config.thresholds.tti) {
          thresholdViolations.push({
            severity: 'warning',
            message: `TTI ${metrics.tti.toFixed(2)}ms exceeds threshold ${this.config.thresholds.tti}ms`,
          });
        }
      }

      // Save results
      const outputPath = `${this.config.outputDir}/${this.sanitizeRoute(context.route)}-performance.json`;
      await this.ensureDirectory(this.config.outputDir);
      await this.writeFile(outputPath, JSON.stringify({ route: context.route, metrics, thresholdViolations }, null, 2));

      const duration = Date.now() - startTime;

      return {
        passed: thresholdViolations.length === 0,
        duration,
        errors: thresholdViolations,
        metadata: {
          performance: metrics,
          outputPath,
        },
      };
    } catch (error) {
      errors.push({
        severity: 'critical',
        message: `Performance collection failed: ${error instanceof Error ? error.message : String(error)}`,
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
