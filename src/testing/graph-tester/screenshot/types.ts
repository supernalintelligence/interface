/**
 * Types for screenshot annotation system.
 *
 * This defines the structure of annotated screenshots with element metadata,
 * bounding boxes, and AI-ready output format.
 *
 * @packageDocumentation
 */

// ==================== Screenshot Annotation Types ====================

/**
 * Complete annotated screenshot with metadata and element annotations.
 */
export interface AnnotatedScreenshot {
  /** Route that was captured */
  route: string;

  /** Screenshot buffer (PNG) */
  screenshot: Buffer;

  /** Path where screenshot was saved */
  screenshotPath: string;

  /** Array of element annotations */
  annotations: ElementAnnotation[];

  /** Page metadata */
  pageMetadata: PageMetadata;

  /** Timestamp */
  timestamp: Date;

  /** AI analysis results (if analyzed) */
  aiAnalysis?: AIAnalysisResults;
}

/**
 * Annotation for a single element.
 */
export interface ElementAnnotation {
  /** Unique identifier for this element */
  id: string;

  /** Element selector (CSS selector or XPath) */
  selector: string;

  /** data-testid attribute value (if present) */
  testId?: string;

  /** Element tag name (div, button, input, etc.) */
  tagName: string;

  /** Bounding box in viewport coordinates */
  boundingBox: BoundingBox;

  /** Bounding box in page coordinates (for full-page screenshots) */
  pageBoundingBox?: BoundingBox;

  /** Computed styles relevant for AI analysis */
  computedStyles: ComputedStyles;

  /** Element text content */
  textContent?: string;

  /** Element attributes */
  attributes: Record<string, string>;

  /** Whether element is interactive (clickable, focusable) */
  isInteractive: boolean;

  /** Interaction capabilities */
  interactions: InteractionCapability[];

  /** Navigation target (if element triggers navigation) */
  navigationTarget?: NavigationTarget;

  /** Parent element ID (for hierarchy) */
  parentId?: string;

  /** Child element IDs (for hierarchy) */
  childIds: string[];

  /** ARIA attributes for accessibility analysis */
  ariaAttributes: Record<string, string>;

  /** Whether element is visible */
  isVisible: boolean;

  /** Z-index for layering analysis */
  zIndex: number;
}

/**
 * Bounding box coordinates.
 */
export interface BoundingBox {
  /** X coordinate (left edge) */
  x: number;

  /** Y coordinate (top edge) */
  y: number;

  /** Width */
  width: number;

  /** Height */
  height: number;
}

/**
 * Computed styles relevant for AI analysis.
 */
export interface ComputedStyles {
  /** Background color (RGB) */
  backgroundColor: string;

  /** Text color (RGB) */
  color: string;

  /** Font family */
  fontFamily: string;

  /** Font size (px) */
  fontSize: string;

  /** Font weight */
  fontWeight: string;

  /** Display type */
  display: string;

  /** Position type */
  position: string;

  /** Opacity */
  opacity: string;

  /** Visibility */
  visibility: string;

  /** Border */
  border?: string;

  /** Border radius */
  borderRadius?: string;

  /** Padding */
  padding?: string;

  /** Margin */
  margin?: string;
}

/**
 * Interaction capability for an element.
 */
export interface InteractionCapability {
  /** Type of interaction */
  type: 'click' | 'hover' | 'focus' | 'input' | 'select' | 'drag' | 'scroll';

  /** Event handler attached (if detectable) */
  hasHandler: boolean;

  /** Description of what happens on interaction */
  description?: string;
}

/**
 * Navigation target if element triggers navigation.
 */
export interface NavigationTarget {
  /** Target URL or route */
  target: string;

  /** Navigation method */
  method: 'link' | 'button' | 'form' | 'javascript';

  /** href attribute (for links) */
  href?: string;

  /** Whether navigation opens in new tab */
  opensInNewTab: boolean;
}

/**
 * Page metadata.
 */
export interface PageMetadata {
  /** Page title */
  title: string;

  /** Page URL */
  url: string;

  /** Viewport size */
  viewport: {
    width: number;
    height: number;
  };

  /** Full page size (for scroll) */
  pageSize: {
    width: number;
    height: number;
  };

  /** Page meta tags */
  metaTags: Record<string, string>;

  /** Page load metrics */
  loadMetrics?: {
    /** DOM content loaded (ms) */
    domContentLoaded: number;

    /** Load complete (ms) */
    loadComplete: number;
  };
}

// ==================== AI Analysis Types ====================

/**
 * AI analysis results for annotated screenshot.
 */
export interface AIAnalysisResults {
  /** Layout analysis */
  layout: LayoutAnalysis;

  /** Accessibility analysis */
  accessibility: AccessibilityAnalysis;

  /** Design analysis */
  design: DesignAnalysis;

  /** Navigation analysis */
  navigation: NavigationAnalysis;

  /** Overall suggestions */
  suggestions: Suggestion[];

  /** AI model used */
  model: string;

  /** Timestamp */
  timestamp: Date;
}

/**
 * Layout analysis.
 */
export interface LayoutAnalysis {
  /** Grid detection */
  hasGrid: boolean;

  /** Grid type (if detected) */
  gridType?: 'css-grid' | 'flexbox' | 'table' | 'float';

  /** Symmetry score (0-100) */
  symmetryScore: number;

  /** Whitespace usage score (0-100) */
  whitespaceScore: number;

  /** Visual hierarchy clarity (0-100) */
  hierarchyScore: number;

  /** Issues detected */
  issues: string[];
}

/**
 * Accessibility analysis.
 */
export interface AccessibilityAnalysis {
  /** WCAG compliance level */
  wcagLevel?: 'A' | 'AA' | 'AAA';

  /** Contrast ratio violations */
  contrastViolations: ContrastViolation[];

  /** Missing ARIA labels */
  missingAriaLabels: string[];

  /** Interactive elements without labels */
  unlabeledInteractiveElements: string[];

  /** Keyboard navigation issues */
  keyboardNavigationIssues: string[];

  /** Screen reader issues */
  screenReaderIssues: string[];

  /** Overall accessibility score (0-100) */
  accessibilityScore: number;
}

/**
 * Contrast violation.
 */
export interface ContrastViolation {
  /** Element selector */
  selector: string;

  /** Foreground color */
  foregroundColor: string;

  /** Background color */
  backgroundColor: string;

  /** Contrast ratio */
  contrastRatio: number;

  /** Required ratio for WCAG level */
  requiredRatio: number;

  /** WCAG level */
  wcagLevel: 'AA' | 'AAA';
}

/**
 * Design analysis.
 */
export interface DesignAnalysis {
  /** Color palette detected */
  colorPalette: string[];

  /** Color harmony score (0-100) */
  colorHarmonyScore: number;

  /** Typography consistency score (0-100) */
  typographyScore: number;

  /** Visual consistency score (0-100) */
  consistencyScore: number;

  /** Spacing consistency score (0-100) */
  spacingScore: number;

  /** Design issues */
  issues: string[];
}

/**
 * Navigation analysis.
 */
export interface NavigationAnalysis {
  /** User flow clarity score (0-100) */
  flowClarityScore: number;

  /** CTA detection */
  callToActionElements: string[];

  /** Navigation patterns detected */
  navigationPatterns: string[];

  /** Breadcrumb navigation detected */
  hasBreadcrumbs: boolean;

  /** Back button detected */
  hasBackButton: boolean;

  /** Navigation issues */
  issues: string[];
}

/**
 * Actionable suggestion.
 */
export interface Suggestion {
  /** Suggestion priority */
  priority: 'critical' | 'high' | 'medium' | 'low';

  /** Category */
  category: 'layout' | 'accessibility' | 'design' | 'navigation' | 'performance';

  /** Suggestion title */
  title: string;

  /** Detailed description */
  description: string;

  /** Element selector (if applicable) */
  selector?: string;

  /** Remediation steps */
  remediation?: string[];
}

// ==================== Renderer Types ====================

/**
 * Configuration for HTML annotation renderer.
 */
export interface HTMLRendererConfig {
  /** Whether to include sidebar with annotation details */
  includeSidebar?: boolean;

  /** Whether to make bounding boxes hoverable */
  enableHover?: boolean;

  /** Whether to allow click-to-highlight */
  enableClickToHighlight?: boolean;

  /** Bounding box color */
  boundingBoxColor?: string;

  /** Bounding box width (px) */
  boundingBoxWidth?: number;

  /** Output file path */
  outputPath: string;
}

/**
 * Configuration for canvas annotation renderer.
 */
export interface CanvasRendererConfig {
  /** Whether to draw element labels */
  drawLabels?: boolean;

  /** Label font size (px) */
  labelFontSize?: number;

  /** Bounding box color */
  boundingBoxColor?: string;

  /** Bounding box width (px) */
  boundingBoxWidth?: number;

  /** Output file path */
  outputPath: string;
}

/**
 * Annotation rendering result.
 */
export interface AnnotationRenderResult {
  /** Output file path */
  outputPath: string;

  /** Renderer type */
  rendererType: 'html' | 'canvas';

  /** File size (bytes) */
  fileSize: number;

  /** Rendering duration (ms) */
  duration: number;
}
