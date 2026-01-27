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
import * as fs from 'fs/promises';
import * as path from 'path';
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
export class ScreenshotAnnotator {
    constructor(config) {
        this.config = {
            fullPage: true,
            includeInvisible: false,
            minElementSize: 5,
            detectNavigation: true,
            captureLoadMetrics: true,
            ...config,
        };
    }
    /**
     * Capture annotated screenshot for a page.
     *
     * @param page - Playwright page instance
     * @param route - Route being captured
     * @param viewportName - Optional viewport name for responsive testing
     * @returns Annotated screenshot
     */
    async capture(page, route, viewportName) {
        const startTime = Date.now();
        // Ensure output directory exists
        await fs.mkdir(this.config.outputDir, { recursive: true });
        // Capture screenshot
        const screenshotFilename = this.generateScreenshotFilename(route, viewportName);
        const screenshotPath = path.join(this.config.outputDir, screenshotFilename);
        const screenshot = await page.screenshot({
            path: screenshotPath,
            fullPage: this.config.fullPage,
            type: 'png',
        });
        // Extract element annotations (single-pass DOM traversal)
        const annotations = await this.extractAnnotations(page);
        // Extract page metadata
        const pageMetadata = await this.extractPageMetadata(page);
        const result = {
            route,
            screenshot: Buffer.from(screenshot),
            screenshotPath,
            annotations,
            pageMetadata,
            timestamp: new Date(),
        };
        // Save annotation JSON
        const annotationFilename = screenshotFilename.replace('.png', '.json');
        const annotationPath = path.join(this.config.outputDir, annotationFilename);
        await fs.writeFile(annotationPath, JSON.stringify(result, null, 2));
        console.log(`Captured screenshot in ${Date.now() - startTime}ms: ${screenshotPath}`);
        console.log(`  Annotations: ${annotations.length}`);
        console.log(`  Annotation JSON: ${annotationPath}`);
        return result;
    }
    /**
     * Extract element annotations via single-pass DOM traversal.
     *
     * @param page - Playwright page instance
     * @returns Array of element annotations
     */
    async extractAnnotations(page) {
        const config = this.config;
        // Single-pass DOM traversal in browser context
        const rawAnnotations = await page.evaluate(({ includeInvisible, minElementSize, detectNavigation }) => {
            const annotations = [];
            const elementMap = new Map(); // Element -> ID mapping
            let idCounter = 0;
            // Get all elements
            const allElements = Array.from(document.querySelectorAll('*'));
            for (const element of allElements) {
                // Generate unique ID
                const elementId = `elem-${idCounter++}`;
                elementMap.set(element, elementId);
                // Get bounding box
                const rect = element.getBoundingClientRect();
                // Skip elements below minimum size
                if (rect.width < minElementSize || rect.height < minElementSize) {
                    continue;
                }
                // Get computed styles
                const computedStyle = window.getComputedStyle(element);
                // Check visibility
                const isVisible = computedStyle.visibility !== 'hidden' &&
                    computedStyle.display !== 'none' &&
                    parseFloat(computedStyle.opacity) > 0 &&
                    rect.width > 0 &&
                    rect.height > 0;
                // Skip invisible elements if configured
                if (!includeInvisible && !isVisible) {
                    continue;
                }
                // Get viewport bounding box
                const boundingBox = {
                    x: rect.left,
                    y: rect.top,
                    width: rect.width,
                    height: rect.height,
                };
                // Get page bounding box (for full-page screenshots)
                const pageBoundingBox = {
                    x: rect.left + window.scrollX,
                    y: rect.top + window.scrollY,
                    width: rect.width,
                    height: rect.height,
                };
                // Get attributes
                const attributes = {};
                for (const attr of Array.from(element.attributes)) {
                    attributes[attr.name] = attr.value;
                }
                // Get ARIA attributes
                const ariaAttributes = {};
                for (const attr of Array.from(element.attributes)) {
                    if (attr.name.startsWith('aria-')) {
                        ariaAttributes[attr.name] = attr.value;
                    }
                }
                // Detect interaction capabilities
                const interactions = [];
                const tagName = element.tagName.toLowerCase();
                // Clickable elements
                if (tagName === 'button' ||
                    tagName === 'a' ||
                    attributes.role === 'button' ||
                    attributes.onclick ||
                    computedStyle.cursor === 'pointer') {
                    interactions.push({ type: 'click', hasHandler: !!attributes.onclick });
                }
                // Input elements
                if (tagName === 'input' ||
                    tagName === 'textarea' ||
                    attributes.contenteditable === 'true') {
                    interactions.push({ type: 'input', hasHandler: true });
                }
                // Select elements
                if (tagName === 'select') {
                    interactions.push({ type: 'select', hasHandler: true });
                }
                // Focusable elements
                if (element.hasAttribute('tabindex') ||
                    ['input', 'button', 'a', 'select', 'textarea'].includes(tagName)) {
                    interactions.push({ type: 'focus', hasHandler: true });
                }
                // Hoverable elements (with hover effects)
                const hoverSelector = `:hover`;
                if (attributes.onmouseover || attributes.onmouseenter) {
                    interactions.push({ type: 'hover', hasHandler: true });
                }
                // Detect navigation targets
                let navigationTarget = undefined;
                if (detectNavigation && tagName === 'a' && attributes.href) {
                    navigationTarget = {
                        target: attributes.href,
                        method: 'link',
                        href: attributes.href,
                        opensInNewTab: attributes.target === '_blank',
                    };
                }
                // Get parent ID
                let parentId = undefined;
                if (element.parentElement) {
                    parentId = elementMap.get(element.parentElement);
                }
                // Get child IDs
                const childIds = [];
                for (const child of Array.from(element.children)) {
                    const childId = elementMap.get(child);
                    if (childId) {
                        childIds.push(childId);
                    }
                }
                // Build annotation
                const annotation = {
                    id: elementId,
                    selector: getCssSelector(element),
                    testId: attributes['data-testid'],
                    tagName,
                    boundingBox,
                    pageBoundingBox,
                    computedStyles: {
                        backgroundColor: computedStyle.backgroundColor,
                        color: computedStyle.color,
                        fontFamily: computedStyle.fontFamily,
                        fontSize: computedStyle.fontSize,
                        fontWeight: computedStyle.fontWeight,
                        display: computedStyle.display,
                        position: computedStyle.position,
                        opacity: computedStyle.opacity,
                        visibility: computedStyle.visibility,
                        border: computedStyle.border,
                        borderRadius: computedStyle.borderRadius,
                        padding: computedStyle.padding,
                        margin: computedStyle.margin,
                    },
                    textContent: element.textContent?.trim().substring(0, 200) || undefined,
                    attributes,
                    isInteractive: interactions.length > 0,
                    interactions,
                    navigationTarget,
                    parentId,
                    childIds,
                    ariaAttributes,
                    isVisible,
                    zIndex: parseInt(computedStyle.zIndex) || 0,
                };
                annotations.push(annotation);
            }
            // Helper: Generate CSS selector for element
            function getCssSelector(element) {
                if (element.id) {
                    return `#${element.id}`;
                }
                if (element.getAttribute('data-testid')) {
                    return `[data-testid="${element.getAttribute('data-testid')}"]`;
                }
                const path = [];
                let current = element;
                while (current && current.nodeType === Node.ELEMENT_NODE) {
                    let selector = current.tagName.toLowerCase();
                    if (current.id) {
                        selector += `#${current.id}`;
                        path.unshift(selector);
                        break;
                    }
                    const siblings = current.parentElement
                        ? Array.from(current.parentElement.children)
                        : [];
                    if (siblings.length > 1) {
                        const index = siblings.indexOf(current) + 1;
                        selector += `:nth-child(${index})`;
                    }
                    path.unshift(selector);
                    current = current.parentElement;
                }
                return path.join(' > ');
            }
            return annotations;
        }, {
            includeInvisible: this.config.includeInvisible || false,
            minElementSize: this.config.minElementSize || 5,
            detectNavigation: this.config.detectNavigation !== false,
        });
        return rawAnnotations;
    }
    /**
     * Extract page metadata.
     *
     * @param page - Playwright page instance
     * @returns Page metadata
     */
    async extractPageMetadata(page) {
        const pageData = await page.evaluate(() => {
            // Get meta tags
            const metaTags = {};
            const metaElements = Array.from(document.querySelectorAll('meta'));
            for (const meta of metaElements) {
                const name = meta.getAttribute('name') || meta.getAttribute('property') || '';
                const content = meta.getAttribute('content') || '';
                if (name) {
                    metaTags[name] = content;
                }
            }
            // Get page size
            const pageSize = {
                width: Math.max(document.body.scrollWidth, document.documentElement.scrollWidth, document.body.offsetWidth, document.documentElement.offsetWidth, document.documentElement.clientWidth),
                height: Math.max(document.body.scrollHeight, document.documentElement.scrollHeight, document.body.offsetHeight, document.documentElement.offsetHeight, document.documentElement.clientHeight),
            };
            // Get load metrics
            const perfData = performance.getEntriesByType('navigation')[0];
            const loadMetrics = perfData
                ? {
                    domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                    loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
                }
                : undefined;
            return {
                title: document.title,
                url: window.location.href,
                metaTags,
                pageSize,
                loadMetrics,
            };
        });
        const viewport = page.viewportSize() || { width: 1280, height: 720 };
        return {
            ...pageData,
            viewport,
        };
    }
    /**
     * Generate screenshot filename from route and viewport.
     *
     * @param route - Route path
     * @param viewportName - Optional viewport name
     * @returns Sanitized filename
     */
    generateScreenshotFilename(route, viewportName) {
        // Sanitize route for filename
        let filename = route.replace(/^\//, '').replace(/\//g, '-') || 'home';
        // Remove query params and hash
        filename = filename.split('?')[0].split('#')[0];
        // Add viewport name if provided
        if (viewportName) {
            filename = `${filename}-${viewportName}`;
        }
        // Add timestamp
        const timestamp = Date.now();
        return `${filename}-${timestamp}.png`;
    }
}
//# sourceMappingURL=ScreenshotAnnotator.js.map