/**
 * Background Detection Utility
 *
 * Detects page background brightness and determines optimal glassmorphism theme
 * for maximum contrast and readability.
 */

export interface BackgroundContext {
  pageTheme: 'light' | 'dark';
  glassTheme: 'light' | 'dark';
  luminance: number;
}

/**
 * Calculate luminance (perceived brightness) from RGB color
 *
 * Uses the standard luminance formula:
 * L = 0.299*R + 0.587*G + 0.114*B
 *
 * @param rgbColor - RGB color string (e.g., "rgb(255, 255, 255)")
 * @returns Luminance value between 0 (dark) and 1 (light)
 */
export function calculateLuminance(rgbColor: string): number {
  // Extract RGB values from string (supports rgb(), rgba(), and hex)
  const rgb = rgbColor.match(/\d+/g)?.map(Number);

  if (!rgb || rgb.length < 3) {
    console.warn('Invalid RGB color format, defaulting to 0.5 luminance');
    return 0.5; // Neutral fallback
  }

  // Normalize to 0-1 range and apply luminance formula
  const r = rgb[0] / 255;
  const g = rgb[1] / 255;
  const b = rgb[2] / 255;

  return 0.299 * r + 0.587 * g + 0.114 * b;
}

/**
 * Sample background color at a specific viewport position
 *
 * @param x - X coordinate
 * @param y - Y coordinate
 * @returns Background color string or null if detection fails
 */
function sampleBackgroundColor(x: number, y: number): string | null {
  if (typeof window === 'undefined') return null;

  const element = document.elementFromPoint(x, y);
  if (!element) return null;

  return getComputedStyle(element).backgroundColor;
}

/**
 * Detect background context and recommend glassmorphism theme
 *
 * Strategy:
 * 1. Check explicit theme attribute (data-theme)
 * 2. Sample background color behind overlay position
 * 3. Calculate luminance to determine light/dark
 * 4. INVERT glass theme for contrast (light page → dark glass)
 *
 * @returns Background context with page theme, glass theme, and luminance
 */
export function detectBackgroundContext(): BackgroundContext {
  if (typeof window === 'undefined') {
    return {
      pageTheme: 'light',
      glassTheme: 'dark',
      luminance: 0.5
    };
  }

  // 1. Check explicit theme attribute first
  const explicitTheme = document.documentElement.getAttribute('data-theme');

  // 2. Sample background color behind overlay position (bottom center)
  const overlayY = window.innerHeight - 100; // Bottom area where overlay sits
  const overlayX = window.innerWidth / 2;    // Center

  const bgColor = sampleBackgroundColor(overlayX, overlayY);

  // 3. Calculate luminance
  const luminance = bgColor ? calculateLuminance(bgColor) : 0.5;

  // 4. Determine themes
  // - Page theme: Use explicit if available, otherwise sample
  // - Glass theme: INVERT page theme for contrast
  const sampledTheme: 'light' | 'dark' = luminance > 0.5 ? 'light' : 'dark';
  const pageTheme = (explicitTheme === 'dark' || explicitTheme === 'light')
    ? explicitTheme
    : sampledTheme;

  const glassTheme: 'light' | 'dark' = sampledTheme === 'light' ? 'dark' : 'light';

  return {
    pageTheme,
    glassTheme,
    luminance
  };
}

/**
 * Create throttled version of background detection
 *
 * Prevents excessive re-computation during scroll/resize events
 *
 * @param wait - Minimum milliseconds between detections
 * @returns Throttled detection function
 */
export function createThrottledDetection(wait: number = 500) {
  let lastRun = 0;
  let lastResult: BackgroundContext | null = null;

  return (): BackgroundContext => {
    const now = Date.now();

    if (now - lastRun >= wait || !lastResult) {
      lastResult = detectBackgroundContext();
      lastRun = now;
    }

    return lastResult;
  };
}
