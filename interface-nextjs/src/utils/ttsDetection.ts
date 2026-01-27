/**
 * TTS Detection Utility
 *
 * Detects existing TTS widget instances on the page
 * for the TTS playlist feature.
 */

export interface TTSWidgetInstance {
  id: string;
  element: HTMLElement;
  label?: string; // Optional label for the widget
}

/**
 * Wait for TTS widget to be fully initialized
 *
 * @param timeout - Maximum time to wait in milliseconds (default: 5000ms)
 * @returns Promise that resolves to true when ready, false on timeout
 */
export function waitForTTSReady(timeout = 5000): Promise<boolean> {
  return new Promise((resolve) => {
    // Check if already initialized
    if (typeof window !== 'undefined' && (window as any).SupernalTTSStatus?.initialized) {
      console.log('[TTS Detection] Widget already initialized');
      resolve(true);
      return;
    }

    // Listen for ready event
    const handler = () => {
      console.log('[TTS Detection] Widget ready event received');
      resolve(true);
      cleanup();
    };

    const timeoutId = setTimeout(() => {
      console.warn('[TTS Detection] Timeout waiting for widget initialization');
      resolve(false);
      cleanup();
    }, timeout);

    const cleanup = () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('supernal-tts-ready', handler);
      }
      clearTimeout(timeoutId);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('supernal-tts-ready', handler);
    } else {
      resolve(false);
      cleanup();
    }
  });
}

/**
 * Detect if page has TTS widgets
 *
 * Looks for:
 * - TTSButton components (data-testid="tts-button")
 * - Supernal TTS widgets (.supernal-tts-widget)
 * - Any elements with tts-related classes/attributes
 *
 * Now waits for widget initialization before checking for play buttons
 * to avoid false negatives from timing issues.
 *
 * @returns Promise that resolves to true if page has TTS widget instances
 */
export async function detectTTSWidgets(): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  // Look for Supernal TTS widget wrappers with data-text attribute (enabled widgets)
  const widgetWrappers = document.querySelectorAll('.supernal-tts-widget[data-text]');

  // Debug logging
  console.log('[TTS Detection] Found widget wrappers:', widgetWrappers.length);

  if (widgetWrappers.length === 0) {
    console.log('[TTS Detection] No widget wrappers found');
    return false;
  }

  // Wait for widget initialization (with 5 second timeout)
  const ready = await waitForTTSReady(5000);

  if (!ready) {
    console.warn('[TTS Detection] Widget not ready after 5s timeout');
    return false;
  }

  // Now check for play buttons after initialization
  const hasPlayButtons = Array.from(widgetWrappers).some(wrapper => {
    const hasButton = wrapper.querySelector('.supernal-tts-play') !== null;
    const isVisible = (wrapper as HTMLElement).offsetParent !== null;
    return hasButton && isVisible;
  });

  console.log('[TTS Detection] Widget ready:', ready);
  console.log('[TTS Detection] Has play buttons:', hasPlayButtons);

  if (widgetWrappers.length > 0) {
    console.log('[TTS Detection] First wrapper visible?', (widgetWrappers[0] as HTMLElement).offsetParent !== null);
    console.log('[TTS Detection] First wrapper has play button?', !!widgetWrappers[0].querySelector('.supernal-tts-play'));
  }

  return hasPlayButtons;
}

/**
 * Extract a meaningful label for a TTS widget from surrounding context
 */
function extractWidgetLabel(element: Element, fallbackIndex: number): string {
  // Strategy 1: Check explicit attributes
  const ariaLabel = element.getAttribute('aria-label');
  if (ariaLabel && ariaLabel.trim()) return ariaLabel.trim();

  const dataLabel = element.getAttribute('data-label');
  if (dataLabel && dataLabel.trim()) return dataLabel.trim();

  // Strategy 2: Look for nearby headings (H1-H6)
  const parent = element.closest('section, article, div, p');
  if (parent) {
    // Check for heading in same parent
    const heading = parent.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading?.textContent?.trim()) {
      return heading.textContent.trim();
    }

    // Check for previous sibling heading
    let sibling = parent.previousElementSibling;
    while (sibling) {
      if (sibling.matches('h1, h2, h3, h4, h5, h6')) {
        return sibling.textContent?.trim() || `Readable Section ${fallbackIndex}`;
      }
      sibling = sibling.previousElementSibling;
    }
  }

  // Strategy 3: Check parent's heading
  const parentSection = element.closest('section, article');
  if (parentSection) {
    const sectionHeading = parentSection.querySelector('h1, h2, h3, h4, h5, h6');
    if (sectionHeading?.textContent?.trim()) {
      return sectionHeading.textContent.trim();
    }
  }

  // Strategy 4: Use first text content from parent (limited)
  if (parent?.textContent) {
    const text = parent.textContent.trim().slice(0, 50);
    if (text.length > 10) return text; // Only if meaningful length
  }

  // Fallback: Numbered section
  return `Readable Section ${fallbackIndex}`;
}

/**
 * Extract TTS widget instances from the page
 *
 * Finds all TTS widgets and returns their information with meaningful labels
 *
 * @returns Array of TTS widget instances
 */
export function extractTTSWidgets(): TTSWidgetInstance[] {
  if (typeof window === 'undefined') return [];

  const widgets: TTSWidgetInstance[] = [];

  // Find Supernal TTS widget wrappers with data-text (enabled widgets)
  const ttsWidgets = document.querySelectorAll('.supernal-tts-widget[data-text]');
  ttsWidgets.forEach((wrapper, idx) => {
    const element = wrapper as HTMLElement;

    // Only include visible widgets
    if (element.offsetParent === null) {
      console.log('[TTS Extract] Skipping hidden widget:', wrapper);
      return;
    }

    const label = extractWidgetLabel(wrapper, widgets.length + 1);

    // Look for the actual play button injected by the widget library
    const playButton = element.querySelector('.supernal-tts-play') as HTMLElement;

    // Add data-testid to wrapper for named element support
    const widgetId = `tts-widget-${idx}`;
    if (!element.hasAttribute('data-testid')) {
      element.setAttribute('data-testid', widgetId);
    }

    // Add data-testid to play button for direct control
    if (playButton && !playButton.hasAttribute('data-testid')) {
      playButton.setAttribute('data-testid', `${widgetId}-play`);
    }

    console.log('[TTS Extract] Widget:', {
      id: widgetId,
      label,
      hasButton: !!playButton,
      wrapper: element,
      playButton,
      testId: element.getAttribute('data-testid')
    });

    widgets.push({
      id: widgetId,
      element: wrapper as HTMLElement, // Always use wrapper as the element to scroll to
      label
    });
  });

  console.log('[TTS Extract] Total widgets found:', widgets.length);
  return widgets;
}
