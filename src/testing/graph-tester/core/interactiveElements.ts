/**
 * Generic, selector-free interactive-element discovery + state-diff primitives.
 *
 * Extracted from ScreenshotAnnotator.extractAnnotations()'s inline interaction-
 * detection heuristic (screenshot/ScreenshotAnnotator.ts) so InteractionMode
 * (modes/InteractionMode.ts) does not reimplement it. ScreenshotAnnotator still
 * has its own parallel inline copy for its full annotation schema (bounding
 * boxes, computed styles, ARIA, parent/child ids) -- migrating it to call this
 * shared primitive is a reasonable follow-up but out of scope here, since that
 * component's existing evaluate() call is tested and this file only needs the
 * narrower "is this clickable, what's its selector" slice of that logic.
 *
 * `discoverInteractiveElements` is passed DIRECTLY as a `page.evaluate()`
 * argument (not stringified/wrapped) -- it must stay a fully self-contained
 * function with no closure over anything outside the browser's DOM globals,
 * since Playwright serializes the function body verbatim to run in-page.
 *
 * @packageDocumentation
 */

import type { Page } from '@playwright/test';

/**
 * A single interactive element discovered on the page, with just enough
 * identity to re-locate and click it -- not the full ScreenshotAnnotator
 * annotation schema.
 */
export interface DiscoveredElement {
  /** CSS selector this element can be re-located by. */
  selector: string;
  tagName: string;
  interactionType: 'click' | 'input' | 'select';
  /** Trimmed visible text, for readable reporting (e.g. "next", "Submit"). */
  textContent?: string;
  /**
   * True for a link that opens a new browsing context (target="_blank") or
   * triggers a file download (a `download` attribute) -- clicking it is
   * expected to produce NO same-page/same-tab observable change, so a
   * liveness diff against the current page cannot tell live from dead for
   * it. Callers should skip diffing (and skip clicking, to avoid opening
   * real tabs/downloads during an automated run) rather than risk a false
   * "dead" flag on a working link. Found during self-critique of the first
   * implementation.
   */
  opensNewContext?: boolean;
}

/**
 * Self-contained browser-side function: scans the current DOM for visible,
 * interactive elements using the same heuristic ScreenshotAnnotator uses
 * (button/link/role=button/onclick/cursor:pointer for click; input/textarea/
 * contenteditable for input; select for select) and returns a lightweight
 * descriptor for each, generating a stable CSS selector per element.
 *
 * MUST remain self-contained (no outer closures) -- see file header.
 */
export function discoverInteractiveElements(): DiscoveredElement[] {
  function getCssSelector(element: Element): string {
    if (element.id) return `#${element.id}`;
    const testId = element.getAttribute('data-testid');
    if (testId) return `[data-testid="${testId}"]`;

    const path: string[] = [];
    let current: Element | null = element;
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

  const results: DiscoveredElement[] = [];
  const allElements = Array.from(document.querySelectorAll('*'));

  for (const element of allElements) {
    const rect = element.getBoundingClientRect();
    if (rect.width < 5 || rect.height < 5) continue;

    const computedStyle = window.getComputedStyle(element);
    const isVisible =
      computedStyle.visibility !== 'hidden' &&
      computedStyle.display !== 'none' &&
      parseFloat(computedStyle.opacity) > 0 &&
      rect.width > 0 &&
      rect.height > 0;
    if (!isVisible) continue;

    const tagName = element.tagName.toLowerCase();
    const role = element.getAttribute('role');

    let interactionType: DiscoveredElement['interactionType'] | null = null;
    if (
      tagName === 'button' ||
      tagName === 'a' ||
      role === 'button' ||
      element.hasAttribute('onclick') ||
      computedStyle.cursor === 'pointer'
    ) {
      interactionType = 'click';
    } else if (
      tagName === 'input' ||
      tagName === 'textarea' ||
      element.getAttribute('contenteditable') === 'true'
    ) {
      interactionType = 'input';
    } else if (tagName === 'select') {
      interactionType = 'select';
    }

    if (!interactionType) continue;

    const opensNewContext =
      tagName === 'a' &&
      (element.getAttribute('target') === '_blank' ||
        element.hasAttribute('download'));

    results.push({
      selector: getCssSelector(element),
      tagName,
      interactionType,
      textContent: element.textContent?.trim().slice(0, 80) || undefined,
      opensNewContext: opensNewContext || undefined,
    });
  }

  return results;
}

/** Discover interactive elements on `page`'s current state. */
export async function findInteractiveElements(
  page: Page
): Promise<DiscoveredElement[]> {
  return page.evaluate(discoverInteractiveElements);
}

// ==================== Liveness oracle ====================

/**
 * A cheap, observable snapshot of page state, taken immediately before and
 * after an interaction. Every field is a coarse, comparable primitive (never
 * the full DOM) so `hasObservableChange` can run as a pure, unit-testable
 * function with no DOM/browser dependency.
 */
export interface LivenessSnapshot {
  url: string;
  /** A simple, fast non-cryptographic hash of document.body.outerHTML. */
  bodyHash: number;
  /** Count of currently-visible interactive elements (a modal appearing, or one closing, changes this). */
  interactiveElementCount: number;
}

/**
 * Self-contained browser-side function computing a LivenessSnapshot for the
 * current page. Self-contained for the same page.evaluate() reason as
 * discoverInteractiveElements above -- do not add outer closures.
 */
export function captureLivenessSnapshot(): LivenessSnapshot {
  // Simple 32-bit rolling hash (djb2). Not cryptographic -- collision
  // resistance doesn't matter here, only "did the string change" does, and
  // any real DOM mutation (class/attribute/text/new-element) changes
  // outerHTML, so a false negative (missed a real change) is far less likely
  // than the alternative failure mode this guards against: comparing full
  // HTML strings across page.evaluate() round-trips is far more expensive
  // and no more correct.
  function hashString(s: string): number {
    let hash = 5381;
    for (let i = 0; i < s.length; i++) {
      hash = (hash * 33) ^ s.charCodeAt(i);
    }
    return hash >>> 0;
  }

  const interactiveCount = document.querySelectorAll(
    'button, a, [role="button"], input, textarea, select, [onclick]'
  ).length;

  return {
    url: window.location.href,
    bodyHash: hashString(document.body.outerHTML),
    interactiveElementCount: interactiveCount,
  };
}

/** Capture a LivenessSnapshot of `page`'s current state. */
export async function snapshotLiveness(page: Page): Promise<LivenessSnapshot> {
  return page.evaluate(captureLivenessSnapshot);
}

/**
 * Pure comparison, no DOM dependency -- unit-testable directly.
 *
 * Returns true if ANY of the observable liveness signals differ between
 * `before` and `after`: URL changed, the page's body markup changed (covers
 * DOM mutation, a new element appearing such as a modal/panel, or an
 * existing element's class/aria-state changing -- all of these change
 * body.outerHTML), or the count of interactive elements changed (covers a
 * modal opening/closing even in the rare case its content happens to hash
 * to the same value as unrelated surrounding markup, and elements being
 * added/removed as siblings).
 */
export function hasObservableChange(
  before: LivenessSnapshot,
  after: LivenessSnapshot
): boolean {
  return (
    before.url !== after.url ||
    before.bodyHash !== after.bodyHash ||
    before.interactiveElementCount !== after.interactiveElementCount
  );
}
