/**
 * Canvas annotation renderer (stub - to be implemented in Phase 3).
 *
 * Will render bounding boxes directly on screenshot canvas.
 *
 * @packageDocumentation
 */

import type {
  AnnotatedScreenshot,
  CanvasRendererConfig,
  AnnotationRenderResult,
} from './types';

/**
 * Canvas annotation renderer (stub).
 *
 * @example
 * ```typescript
 * const renderer = new CanvasAnnotationRenderer({
 *   drawLabels: true,
 *   outputPath: './screenshots/dashboard-annotated.png'
 * });
 *
 * const result = await renderer.render(annotatedScreenshot);
 * ```
 */
export class CanvasAnnotationRenderer {
  private config: CanvasRendererConfig;

  constructor(config: CanvasRendererConfig) {
    this.config = {
      drawLabels: true,
      labelFontSize: 12,
      boundingBoxColor: '#00ff00',
      boundingBoxWidth: 2,
      ...config,
    };
  }

  /**
   * Render annotated screenshot with canvas overlay.
   *
   * @param screenshot - Annotated screenshot
   * @returns Render result
   */
  async render(screenshot: AnnotatedScreenshot): Promise<AnnotationRenderResult> {
    // TODO: Implement in Phase 3
    // Will use canvas/sharp to draw bounding boxes on screenshot
    throw new Error('CanvasAnnotationRenderer not yet implemented (Phase 3)');
  }
}
