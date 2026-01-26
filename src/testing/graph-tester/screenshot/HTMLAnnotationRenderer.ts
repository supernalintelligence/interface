/**
 * HTML annotation renderer.
 *
 * Generates interactive HTML overlay with:
 * - Hoverable bounding boxes
 * - Sidebar with annotation details
 * - Click-to-highlight functionality
 * - Search/filter capabilities
 *
 * @packageDocumentation
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import type {
  AnnotatedScreenshot,
  ElementAnnotation,
  HTMLRendererConfig,
  AnnotationRenderResult,
} from './types';

/**
 * HTML annotation renderer.
 *
 * @example
 * ```typescript
 * const renderer = new HTMLAnnotationRenderer({
 *   includeSidebar: true,
 *   enableHover: true,
 *   outputPath: './screenshots/dashboard.html'
 * });
 *
 * const result = await renderer.render(annotatedScreenshot);
 * console.log(`HTML rendered: ${result.outputPath}`);
 * ```
 */
export class HTMLAnnotationRenderer {
  private config: HTMLRendererConfig;

  constructor(config: HTMLRendererConfig) {
    this.config = {
      includeSidebar: true,
      enableHover: true,
      enableClickToHighlight: true,
      boundingBoxColor: '#00ff00',
      boundingBoxWidth: 2,
      ...config,
    };
  }

  /**
   * Render annotated screenshot as interactive HTML.
   *
   * @param screenshot - Annotated screenshot
   * @returns Render result
   */
  async render(screenshot: AnnotatedScreenshot): Promise<AnnotationRenderResult> {
    const startTime = Date.now();

    // Generate HTML
    const html = this.generateHTML(screenshot);

    // Write to file
    await fs.writeFile(this.config.outputPath, html, 'utf-8');

    const stats = await fs.stat(this.config.outputPath);

    return {
      outputPath: this.config.outputPath,
      rendererType: 'html',
      fileSize: stats.size,
      duration: Date.now() - startTime,
    };
  }

  /**
   * Generate complete HTML document.
   *
   * @param screenshot - Annotated screenshot
   * @returns HTML string
   */
  private generateHTML(screenshot: AnnotatedScreenshot): string {
    const { annotations, pageMetadata } = screenshot;

    // Convert screenshot buffer to base64 data URL
    const screenshotDataUrl = `data:image/png;base64,${screenshot.screenshot.toString('base64')}`;

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Annotated Screenshot: ${screenshot.route}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #1e1e1e;
      color: #d4d4d4;
      overflow: hidden;
    }

    .container {
      display: flex;
      height: 100vh;
    }

    .screenshot-container {
      flex: 1;
      position: relative;
      overflow: auto;
      background: #2d2d2d;
    }

    .screenshot {
      position: relative;
      display: inline-block;
    }

    .screenshot img {
      display: block;
      max-width: 100%;
      height: auto;
    }

    .annotation-box {
      position: absolute;
      border: ${this.config.boundingBoxWidth}px solid ${this.config.boundingBoxColor};
      pointer-events: ${this.config.enableHover ? 'auto' : 'none'};
      cursor: ${this.config.enableClickToHighlight ? 'pointer' : 'default'};
      transition: border-color 0.2s, box-shadow 0.2s;
      z-index: 1;
    }

    .annotation-box:hover {
      border-color: #ff00ff;
      box-shadow: 0 0 0 2px rgba(255, 0, 255, 0.3);
      z-index: 100;
    }

    .annotation-box.highlighted {
      border-color: #ffff00;
      box-shadow: 0 0 0 4px rgba(255, 255, 0, 0.5);
      z-index: 200;
    }

    .annotation-label {
      position: absolute;
      top: -24px;
      left: 0;
      background: rgba(0, 255, 0, 0.9);
      color: #000;
      padding: 2px 6px;
      border-radius: 3px;
      font-size: 11px;
      font-weight: 600;
      white-space: nowrap;
      display: none;
      z-index: 2;
    }

    .annotation-box:hover .annotation-label {
      display: block;
    }

    ${this.config.includeSidebar ? this.getSidebarStyles() : ''}
  </style>
</head>
<body>
  <div class="container">
    <div class="screenshot-container">
      <div class="screenshot" style="width: ${pageMetadata.pageSize.width}px; height: ${pageMetadata.pageSize.height}px;">
        <img src="${screenshotDataUrl}" alt="Screenshot" />
        ${this.renderAnnotationBoxes(annotations, pageMetadata)}
      </div>
    </div>
    ${this.config.includeSidebar ? this.renderSidebar(screenshot) : ''}
  </div>

  <script>
    ${this.generateJavaScript(annotations)}
  </script>
</body>
</html>`;
  }

  /**
   * Get sidebar CSS styles.
   */
  private getSidebarStyles(): string {
    return `
    .sidebar {
      width: 400px;
      background: #252526;
      border-left: 1px solid #3e3e42;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .sidebar-header {
      padding: 16px;
      border-bottom: 1px solid #3e3e42;
    }

    .sidebar-header h2 {
      font-size: 16px;
      margin-bottom: 8px;
    }

    .sidebar-stats {
      display: flex;
      gap: 16px;
      font-size: 13px;
      color: #858585;
    }

    .sidebar-stat {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .sidebar-stat-value {
      font-size: 20px;
      font-weight: 600;
      color: #d4d4d4;
    }

    .sidebar-search {
      padding: 12px 16px;
      border-bottom: 1px solid #3e3e42;
    }

    .search-input {
      width: 100%;
      padding: 8px 12px;
      background: #3c3c3c;
      border: 1px solid #3e3e42;
      border-radius: 4px;
      color: #d4d4d4;
      font-size: 13px;
    }

    .search-input:focus {
      outline: none;
      border-color: #007acc;
    }

    .sidebar-content {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
    }

    .annotation-item {
      background: #2d2d2d;
      border: 1px solid #3e3e42;
      border-radius: 4px;
      padding: 12px;
      margin-bottom: 8px;
      cursor: pointer;
      transition: background 0.2s, border-color 0.2s;
    }

    .annotation-item:hover {
      background: #37373d;
      border-color: #007acc;
    }

    .annotation-item.active {
      background: #37373d;
      border-color: #ffff00;
    }

    .annotation-item-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }

    .annotation-item-tag {
      font-size: 13px;
      font-weight: 600;
      color: #4ec9b0;
    }

    .annotation-item-badge {
      background: #007acc;
      color: #fff;
      padding: 2px 6px;
      border-radius: 3px;
      font-size: 10px;
      font-weight: 600;
    }

    .annotation-item-testid {
      color: #ce9178;
      font-size: 12px;
      margin-bottom: 4px;
    }

    .annotation-item-interactions {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      margin-top: 8px;
    }

    .interaction-badge {
      background: #3e3e42;
      color: #d4d4d4;
      padding: 2px 6px;
      border-radius: 3px;
      font-size: 10px;
    }

    .annotation-details {
      display: none;
      margin-top: 12px;
      padding-top: 12px;
      border-top: 1px solid #3e3e42;
      font-size: 12px;
      color: #858585;
    }

    .annotation-item.active .annotation-details {
      display: block;
    }

    .detail-row {
      display: flex;
      gap: 8px;
      margin-bottom: 4px;
    }

    .detail-label {
      font-weight: 600;
      color: #d4d4d4;
    }

    .detail-value {
      flex: 1;
      word-break: break-all;
    }`;
  }

  /**
   * Render annotation bounding boxes.
   */
  private renderAnnotationBoxes(
    annotations: ElementAnnotation[],
    pageMetadata: AnnotatedScreenshot['pageMetadata']
  ): string {
    return annotations
      .filter((a) => a.isVisible)
      .map((annotation) => {
        const box = annotation.pageBoundingBox || annotation.boundingBox;
        const label = annotation.testId || annotation.tagName;

        return `
        <div
          class="annotation-box"
          data-annotation-id="${annotation.id}"
          style="
            left: ${box.x}px;
            top: ${box.y}px;
            width: ${box.width}px;
            height: ${box.height}px;
          "
          title="${annotation.selector}"
        >
          <div class="annotation-label">${label}</div>
        </div>`;
      })
      .join('\n');
  }

  /**
   * Render sidebar with annotation list.
   */
  private renderSidebar(screenshot: AnnotatedScreenshot): string {
    const { annotations, pageMetadata } = screenshot;
    const visibleAnnotations = annotations.filter((a) => a.isVisible);
    const interactiveCount = visibleAnnotations.filter((a) => a.isInteractive).length;

    return `
    <div class="sidebar">
      <div class="sidebar-header">
        <h2>${screenshot.route}</h2>
        <div class="sidebar-stats">
          <div class="sidebar-stat">
            <div class="sidebar-stat-value">${visibleAnnotations.length}</div>
            <div>Elements</div>
          </div>
          <div class="sidebar-stat">
            <div class="sidebar-stat-value">${interactiveCount}</div>
            <div>Interactive</div>
          </div>
        </div>
      </div>

      <div class="sidebar-search">
        <input
          type="text"
          class="search-input"
          placeholder="Search by tag, testid, or selector..."
          id="search-input"
        />
      </div>

      <div class="sidebar-content" id="annotation-list">
        ${visibleAnnotations.map((a) => this.renderAnnotationItem(a)).join('\n')}
      </div>
    </div>`;
  }

  /**
   * Render annotation item for sidebar.
   */
  private renderAnnotationItem(annotation: ElementAnnotation): string {
    const interactions = annotation.interactions.map((i) => i.type).join(', ');

    return `
    <div class="annotation-item" data-annotation-id="${annotation.id}">
      <div class="annotation-item-header">
        <div class="annotation-item-tag">&lt;${annotation.tagName}&gt;</div>
        ${annotation.isInteractive ? '<div class="annotation-item-badge">Interactive</div>' : ''}
      </div>
      ${annotation.testId ? `<div class="annotation-item-testid">data-testid="${annotation.testId}"</div>` : ''}
      ${
        annotation.interactions.length > 0
          ? `
        <div class="annotation-item-interactions">
          ${annotation.interactions.map((i) => `<div class="interaction-badge">${i.type}</div>`).join('')}
        </div>
      `
          : ''
      }
      <div class="annotation-details">
        <div class="detail-row">
          <div class="detail-label">Selector:</div>
          <div class="detail-value">${annotation.selector}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">Size:</div>
          <div class="detail-value">${Math.round(annotation.boundingBox.width)}×${Math.round(annotation.boundingBox.height)}px</div>
        </div>
        ${
          annotation.textContent
            ? `
          <div class="detail-row">
            <div class="detail-label">Text:</div>
            <div class="detail-value">${this.escapeHtml(annotation.textContent.substring(0, 100))}</div>
          </div>
        `
            : ''
        }
      </div>
    </div>`;
  }

  /**
   * Generate JavaScript for interactivity.
   */
  private generateJavaScript(annotations: ElementAnnotation[]): string {
    return `
    const annotations = ${JSON.stringify(annotations, null, 2)};

    // Click to highlight
    ${
      this.config.enableClickToHighlight
        ? `
    document.querySelectorAll('.annotation-box').forEach(box => {
      box.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = box.dataset.annotationId;

        // Remove previous highlights
        document.querySelectorAll('.annotation-box.highlighted').forEach(b => {
          b.classList.remove('highlighted');
        });
        document.querySelectorAll('.annotation-item.active').forEach(item => {
          item.classList.remove('active');
        });

        // Highlight this annotation
        box.classList.add('highlighted');
        const sidebarItem = document.querySelector(\`.annotation-item[data-annotation-id="\${id}"]\`);
        if (sidebarItem) {
          sidebarItem.classList.add('active');
          sidebarItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
    });

    // Sidebar item click
    document.querySelectorAll('.annotation-item').forEach(item => {
      item.addEventListener('click', () => {
        const id = item.dataset.annotationId;

        // Remove previous highlights
        document.querySelectorAll('.annotation-box.highlighted').forEach(b => {
          b.classList.remove('highlighted');
        });
        document.querySelectorAll('.annotation-item.active').forEach(i => {
          i.classList.remove('active');
        });

        // Highlight this annotation
        item.classList.add('active');
        const box = document.querySelector(\`.annotation-box[data-annotation-id="\${id}"]\`);
        if (box) {
          box.classList.add('highlighted');
          box.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
    });
    `
        : ''
    }

    // Search functionality
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const items = document.querySelectorAll('.annotation-item');

        items.forEach(item => {
          const annotation = annotations.find(a => a.id === item.dataset.annotationId);
          if (!annotation) return;

          const searchText = [
            annotation.tagName,
            annotation.testId,
            annotation.selector,
            annotation.textContent
          ].filter(Boolean).join(' ').toLowerCase();

          if (searchText.includes(query)) {
            item.style.display = '';
          } else {
            item.style.display = 'none';
          }
        });
      });
    }

    // Clear highlights on background click
    document.querySelector('.screenshot-container').addEventListener('click', (e) => {
      if (e.target.classList.contains('screenshot-container') || e.target.tagName === 'IMG') {
        document.querySelectorAll('.annotation-box.highlighted').forEach(b => {
          b.classList.remove('highlighted');
        });
        document.querySelectorAll('.annotation-item.active').forEach(item => {
          item.classList.remove('active');
        });
      }
    });
    `;
  }

  /**
   * Escape HTML entities.
   */
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
}
