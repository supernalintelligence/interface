/**
 * Interaction / liveness testing mode.
 *
 * Generic, selector-free "does tapping this do anything" oracle. Discovers
 * every interactive element on a route via discoverInteractiveElements() (no
 * per-page authored selectors), clicks each one, and flags any element that
 * produces zero observable change (URL, DOM markup, or interactive-element
 * count) as dead.
 *
 * Built to close a real, confirmed gap in this codebase's testing tooling
 * (2026-08-09): neither `si story test` (requires hand-authored selectors
 * per step) nor GraphTester's other modes (visual/performance/accessibility/
 * seo -- all read-only, none of them click anything, verified via full grep
 * of GraphTester.ts) can catch a button that LOOKS fine and IS on the page
 * but silently does nothing when tapped -- the exact bug class that shipped
 * to a real customer that day (a cookie-consent banner overlapping and
 * swallowing every tap on a deck's own #next button).
 *
 * Deliberately NOT a vision/LLM-driven action-selection loop -- that's a
 * separate, much larger R&D effort. This mode's only "intelligence" is
 * generic discovery + a diff-based liveness check, no AI involved.
 *
 * @packageDocumentation
 */

import type { Page } from '@playwright/test';
import { TestFunction } from '../core/TestFunction';
import type { TestContext, TestResult, TestError } from '../core/types';
import {
  findInteractiveElements,
  snapshotLiveness,
  hasObservableChange,
  type DiscoveredElement,
} from '../core/interactiveElements';

/**
 * Configuration for interaction mode.
 */
export interface InteractionConfig {
  /** Output directory for per-route JSON results. */
  outputDir: string;

  /**
   * Max interactive elements to test PER STATE (the base route, or any state
   * revealed by a prior click). Bounds cost on pages with hundreds of
   * elements. Default: 25.
   */
  maxElementsPerState?: number;

  /**
   * Max recursion depth into newly-revealed states. depth 0 = only test
   * elements on the route's own base state. depth 1 (default) = also
   * recurse one level into whatever a click reveals (e.g. a nav button
   * revealing a new page section) to catch dead elements that only exist
   * after an earlier interaction. Bounded deliberately -- no unbounded
   * exploration.
   */
  maxDepth?: number;

  /** Ms to wait after a click before snapshotting "after" state. Default: 500. */
  settleMs?: number;

  /** Ms to wait after page.goto() before the first discovery pass. Default: 300. */
  initialSettleMs?: number;

  /**
   * Hard ceiling on TOTAL elements clicked across the whole route, across
   * every state and depth combined -- independent of maxElementsPerState /
   * maxDepth. Those two bound cost PER STATE and PER BRANCH, but their
   * product is multiplicative (e.g. 25 top-level x 25 per revealed state =
   * up to 650 clicks at maxDepth=1), which can be far too slow on a real
   * page with many interactive elements. This is the actual global budget.
   * Default: 60. Found during self-critique of the first implementation.
   */
  maxTotalInteractions?: number;
}

/** One tested element's outcome, for reporting. */
export interface InteractionFinding {
  selector: string;
  tagName: string;
  textContent?: string;
  depth: number;
  /** false = tapping this produced NO observable change anywhere -- likely dead. */
  live: boolean;
  error?: string;
  /**
   * True if this element was discovered but NOT clicked (and so has no
   * live/dead verdict -- `live` is meaningless when this is true). Used for
   * elements whose effect is inherently unobservable via same-page diffing
   * (a target="_blank" link, a download link) or for elements skipped once
   * maxTotalInteractions was reached.
   */
  skipped?: boolean;
  skipReason?: string;
}

/**
 * Interaction / liveness testing mode.
 */
export class InteractionMode extends TestFunction {
  readonly mode = 'interaction';
  readonly name = 'Interaction';
  readonly description =
    'Generic, selector-free liveness check: taps every discovered interactive element and flags any that produce no observable change';

  private config: Required<InteractionConfig>;

  constructor(config: InteractionConfig) {
    super();
    this.config = {
      outputDir: config.outputDir,
      maxElementsPerState: config.maxElementsPerState ?? 25,
      maxDepth: config.maxDepth ?? 1,
      settleMs: config.settleMs ?? 500,
      initialSettleMs: config.initialSettleMs ?? 300,
      maxTotalInteractions: config.maxTotalInteractions ?? 60,
    };
  }

  async execute(page: Page, context: TestContext): Promise<TestResult> {
    const startTime = Date.now();
    const errors: TestError[] = [];
    const findings: InteractionFinding[] = [];
    const budget = { remaining: this.config.maxTotalInteractions };

    const baseUrl = `${context.baseUrl ?? ''}${context.route}`;

    await page.waitForTimeout(this.config.initialSettleMs);
    const baseElements = await findInteractiveElements(page);
    const topLevelElements = baseElements.slice(
      0,
      this.config.maxElementsPerState
    );

    for (const element of topLevelElements) {
      if (budget.remaining <= 0) {
        findings.push({
          selector: element.selector,
          tagName: element.tagName,
          textContent: element.textContent,
          depth: 0,
          live: false,
          skipped: true,
          skipReason: `maxTotalInteractions (${this.config.maxTotalInteractions}) reached`,
        });
        continue;
      }

      // Reset to the route's base state before testing each TOP-LEVEL
      // element, so one element's side effects can't leak into the next
      // top-level element's test. This is a breadth-first pass across the
      // base state's own elements; depth-first recursion happens WITHIN
      // each element's own branch below, before the reset for the next one.
      try {
        await page.goto(baseUrl, { waitUntil: 'load' });
        await page.waitForTimeout(this.config.initialSettleMs);
      } catch (error) {
        errors.push({
          severity: 'warning',
          message: `Failed to reset to base state before testing ${element.selector}: ${
            error instanceof Error ? error.message : String(error)
          }`,
        });
        continue;
      }

      await this.testElementAndRecurse(
        page,
        element,
        0,
        findings,
        errors,
        budget
      );
    }

    // `skipped` findings carry live:false as a placeholder (no verdict was
    // ever computed for them) -- exclude them from the dead tally, or an
    // opensNewContext link or a maxTotalInteractions cutoff would wrongly
    // fail the whole route. Found during self-critique of the first
    // implementation, same pass as the opensNewContext/budget fixes above.
    const deadFindings = findings.filter((f) => !f.live && !f.skipped);
    const skippedFindings = findings.filter((f) => f.skipped);
    const passed = deadFindings.length === 0;

    for (const dead of deadFindings) {
      errors.push({
        severity: 'critical',
        message: `Dead element: tapping "${dead.textContent ?? dead.selector}" (${dead.selector}, depth ${dead.depth}) produced no observable change`,
        location: dead.selector,
      });
    }

    const outputPath = `${this.config.outputDir}/${this.sanitizeRoute(context.route)}-interaction.json`;
    try {
      await this.ensureDirectory(this.config.outputDir);
      await this.writeFile(
        outputPath,
        JSON.stringify(
          {
            route: context.route,
            summary: {
              tested: findings.length,
              dead: deadFindings.length,
              live:
                findings.length - deadFindings.length - skippedFindings.length,
              skipped: skippedFindings.length,
            },
            findings,
          },
          null,
          2
        )
      );
    } catch {
      // Non-fatal -- the in-memory result (and its pass/fail verdict) is
      // still correct even if the report file couldn't be written.
    }

    return {
      passed,
      duration: Date.now() - startTime,
      errors,
      metadata: {
        interaction: {
          tested: findings.length,
          deadCount: deadFindings.length,
          skippedCount: skippedFindings.length,
        },
        outputPath,
        findings,
      },
    };
  }

  /**
   * Test one element: click it, diff before/after, record the finding. If
   * the click revealed a genuinely new state (hasObservableChange) and
   * depth < maxDepth, recurse into THAT state's own interactive elements
   * before returning -- this is the depth-first branch exploration.
   */
  private async testElementAndRecurse(
    page: Page,
    element: DiscoveredElement,
    depth: number,
    findings: InteractionFinding[],
    errors: TestError[],
    budget: { remaining: number }
  ): Promise<void> {
    if (budget.remaining <= 0) {
      findings.push({
        selector: element.selector,
        tagName: element.tagName,
        textContent: element.textContent,
        depth,
        live: false,
        skipped: true,
        skipReason: `maxTotalInteractions (${this.config.maxTotalInteractions}) reached`,
      });
      return;
    }

    if (element.opensNewContext) {
      // Clicking would open a real new tab or trigger a real download --
      // neither is observable via same-page diffing, and both are unwanted
      // side effects of an automated test run. Record it as skipped, not
      // as a live/dead verdict.
      findings.push({
        selector: element.selector,
        tagName: element.tagName,
        textContent: element.textContent,
        depth,
        live: false,
        skipped: true,
        skipReason:
          'opens a new tab/download -- not observable via same-page diff',
      });
      return;
    }

    budget.remaining -= 1;
    const before = await snapshotLiveness(page);

    try {
      const locator = page.locator(element.selector).first();
      await locator.click({ timeout: 5000 });
    } catch (error) {
      findings.push({
        selector: element.selector,
        tagName: element.tagName,
        textContent: element.textContent,
        depth,
        live: false,
        error: error instanceof Error ? error.message : String(error),
      });
      return;
    }

    await page.waitForTimeout(this.config.settleMs);
    const after = await snapshotLiveness(page);
    const live = hasObservableChange(before, after);

    findings.push({
      selector: element.selector,
      tagName: element.tagName,
      textContent: element.textContent,
      depth,
      live,
    });

    if (live && depth < this.config.maxDepth) {
      const revealed = await findInteractiveElements(page);
      const newElements = revealed
        .filter((e) => !this.sameSelector(e, element))
        .slice(0, this.config.maxElementsPerState);

      for (const child of newElements) {
        await this.testElementAndRecurse(
          page,
          child,
          depth + 1,
          findings,
          errors,
          budget
        );
      }
    }
  }

  private sameSelector(a: DiscoveredElement, b: DiscoveredElement): boolean {
    return a.selector === b.selector;
  }

  private sanitizeRoute(route: string): string {
    return route.replace(/^\//, '').replace(/\//g, '-') || 'home';
  }

  private async ensureDirectory(dir: string): Promise<void> {
    const fs = await import('fs/promises');
    await fs.mkdir(dir, { recursive: true });
  }

  private async writeFile(path: string, content: string): Promise<void> {
    const fs = await import('fs/promises');
    await fs.writeFile(path, content, 'utf-8');
  }
}
