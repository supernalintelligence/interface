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
    // TODO: Implement in Phase 2
    // Will collect Core Web Vitals via Performance API
    throw new Error('PerformanceMode not yet implemented (Phase 2)');
  }
}
