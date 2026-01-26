/**
 * Visual regression testing mode.
 *
 * Captures screenshots with element annotations for visual regression testing and AI analysis.
 *
 * @packageDocumentation
 */

import type { Page } from '@playwright/test';
import { TestFunction } from '../core/TestFunction';
import type { TestContext, TestResult } from '../core/types';
import {
  ScreenshotAnnotator,
  HTMLAnnotationRenderer,
  type ScreenshotAnnotatorConfig,
  type HTMLRendererConfig,
} from '../screenshot';
import * as path from 'path';

/**
 * Configuration for visual regression mode.
 */
export interface VisualRegressionConfig {
  /** Output directory for screenshots */
  outputDir: string;

  /** Whether to capture full page (default: true) */
  fullPage?: boolean;

  /** Whether to annotate elements (default: true) */
  annotate?: boolean;

  /** Whether to generate HTML overlay (default: true) */
  generateHTML?: boolean;

  /** Whether to include invisible elements (default: false) */
  includeInvisible?: boolean;

  /** Minimum element size to annotate (default: 5px) */
  minElementSize?: number;

  /** Whether to enable AI analysis (enterprise only, default: false) */
  aiAnalyze?: boolean;

  /** Custom screenshot annotator config */
  annotatorConfig?: Partial<ScreenshotAnnotatorConfig>;

  /** Custom HTML renderer config */
  htmlRendererConfig?: Partial<HTMLRendererConfig>;
}

/**
 * Visual regression testing mode.
 *
 * Captures full-page screenshots with element annotations, bounding boxes,
 * and generates interactive HTML overlays for review.
 *
 * @example
 * ```typescript
 * const mode = new VisualRegressionMode({
 *   outputDir: './screenshots',
 *   annotate: true,
 *   generateHTML: true
 * });
 *
 * const tester = new GraphTester({
 *   baseUrl: 'http://localhost:3000',
 *   routes: [{ route: '/' }],
 *   modes: []
 * });
 *
 * tester.registerTestFunction(mode);
 * const results = await tester.runTests();
 * ```
 */
export class VisualRegressionMode extends TestFunction {
  readonly mode = 'visual';
  readonly name = 'Visual Regression';
  readonly description = 'Captures screenshots with element annotations for visual regression testing';

  private config: VisualRegressionConfig;
  private annotator: ScreenshotAnnotator | null = null;

  constructor(config: VisualRegressionConfig) {
    super();
    this.config = {
      fullPage: true,
      annotate: true,
      generateHTML: true,
      includeInvisible: false,
      minElementSize: 5,
      aiAnalyze: false,
      ...config,
    };
  }

  /**
   * Setup: Initialize screenshot annotator.
   */
  async setup?(page: Page): Promise<void> {
    if (this.config.annotate) {
      this.annotator = new ScreenshotAnnotator({
        outputDir: this.config.outputDir,
        fullPage: this.config.fullPage,
        includeInvisible: this.config.includeInvisible,
        minElementSize: this.config.minElementSize,
        ...this.config.annotatorConfig,
      });
    }
  }

  /**
   * Execute: Capture screenshot and annotations.
   */
  async execute(page: Page, context: TestContext): Promise<TestResult> {
    const startTime = Date.now();
    const errors: TestResult['errors'] = [];
    const metadata: Record<string, any> = {};

    try {
      // Capture annotated screenshot
      if (this.annotator) {
        const viewportLabel = context.viewport ? ` [${context.viewport.name}]` : '';
        console.log(`Capturing annotated screenshot for ${context.route}${viewportLabel}...`);

        const annotatedScreenshot = await this.annotator.capture(
          page,
          context.route,
          context.viewport?.name
        );

        metadata.screenshot = {
          path: annotatedScreenshot.screenshotPath,
          annotationCount: annotatedScreenshot.annotations.length,
          interactiveElementCount: annotatedScreenshot.annotations.filter((a) => a.isInteractive)
            .length,
          pageSize: annotatedScreenshot.pageMetadata.pageSize,
          viewport: annotatedScreenshot.pageMetadata.viewport,
        };

        // Generate HTML overlay
        if (this.config.generateHTML) {
          const htmlPath = annotatedScreenshot.screenshotPath.replace('.png', '.html');

          const renderer = new HTMLAnnotationRenderer({
            outputPath: htmlPath,
            includeSidebar: true,
            enableHover: true,
            enableClickToHighlight: true,
            ...this.config.htmlRendererConfig,
          });

          const renderResult = await renderer.render(annotatedScreenshot);
          metadata.htmlOverlay = {
            path: renderResult.outputPath,
            fileSize: renderResult.fileSize,
            duration: renderResult.duration,
          };

          console.log(`Generated HTML overlay: ${renderResult.outputPath}`);
        }

        // AI analysis (enterprise only)
        if (this.config.aiAnalyze) {
          errors.push({
            severity: 'info',
            message: 'AI analysis requires @supernalintelligence/interface-enterprise',
          });
        }
      } else {
        // Simple screenshot without annotations
        const screenshotPath = path.join(this.config.outputDir, `${this.sanitizeRoute(context.route)}.png`);
        await page.screenshot({
          path: screenshotPath,
          fullPage: this.config.fullPage,
        });

        metadata.screenshot = {
          path: screenshotPath,
        };
      }

      return {
        passed: true,
        duration: Date.now() - startTime,
        errors,
        metadata,
      };
    } catch (error) {
      errors.push({
        severity: 'critical',
        message: `Visual regression failed: ${error instanceof Error ? error.message : String(error)}`,
        stack: error instanceof Error ? error.stack : undefined,
      });

      return {
        passed: false,
        duration: Date.now() - startTime,
        errors,
        metadata,
      };
    }
  }

  /**
   * Sanitize route for filename.
   */
  private sanitizeRoute(route: string): string {
    return route.replace(/^\//, '').replace(/\//g, '-') || 'home';
  }

  /**
   * Validate configuration.
   */
  validate(): string[] {
    const errors = super.validate();

    if (!this.config.outputDir) {
      errors.push('outputDir is required');
    }

    return errors;
  }
}
