/**
 * Core screenshot annotation capture logic.
 *
 * Captures full-page screenshots with element annotations including:
 * - Bounding boxes (viewport and page coordinates)
 * - Element metadata (testid, tag, attributes, styles)
 * - Interaction capabilities
 * - Element hierarchy (parent/child relationships)
 * - ARIA attributes for accessibility analysis
 *
 * Uses single-pass DOM traversal for efficiency.
 *
 * @packageDocumentation
 */
import type { Page } from '@playwright/test';
import type { AnnotatedScreenshot } from './types';
/**
 * Configuration for screenshot annotator.
 */
export interface ScreenshotAnnotatorConfig {
    /** Output directory for screenshots */
    outputDir: string;
    /** Whether to capture full page (default: true) */
    fullPage?: boolean;
    /** Whether to include invisible elements (default: false) */
    includeInvisible?: boolean;
    /** Minimum element size to annotate (default: 5px) */
    minElementSize?: number;
    /** Whether to detect navigation targets (default: true) */
    detectNavigation?: boolean;
    /** Whether to capture page load metrics (default: true) */
    captureLoadMetrics?: boolean;
}
/**
 * Screenshot annotator.
 *
 * @example
 * ```typescript
 * const annotator = new ScreenshotAnnotator({
 *   outputDir: './screenshots',
 *   fullPage: true
 * });
 *
 * const result = await annotator.capture(page, '/dashboard');
 * console.log(`Captured ${result.annotations.length} annotations`);
 * ```
 */
export declare class ScreenshotAnnotator {
    private config;
    constructor(config: ScreenshotAnnotatorConfig);
    /**
     * Capture annotated screenshot for a page.
     *
     * @param page - Playwright page instance
     * @param route - Route being captured
     * @param viewportName - Optional viewport name for responsive testing
     * @returns Annotated screenshot
     */
    capture(page: Page, route: string, viewportName?: string): Promise<AnnotatedScreenshot>;
    /**
     * Extract element annotations via single-pass DOM traversal.
     *
     * @param page - Playwright page instance
     * @returns Array of element annotations
     */
    private extractAnnotations;
    /**
     * Extract page metadata.
     *
     * @param page - Playwright page instance
     * @returns Page metadata
     */
    private extractPageMetadata;
    /**
     * Generate screenshot filename from route and viewport.
     *
     * @param route - Route path
     * @param viewportName - Optional viewport name
     * @returns Sanitized filename
     */
    private generateScreenshotFilename;
}
//# sourceMappingURL=ScreenshotAnnotator.d.ts.map