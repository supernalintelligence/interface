/**
 * Waits out Next.js's own dev-mode "Compiling ..." indicator after a
 * navigation, before a test/capture proceeds.
 *
 * Real incident this closes: a `sc visual site-scan` run against a live
 * `next dev` server captured 97/97 routes as a clean pass, but every single
 * screenshot was actually a blank page with Next.js's dev toast reading
 * "Compiling .." in the corner -- `page.goto({ waitUntil: 'load' })` only
 * waits for the HTML shell's load event, not for the route's own JS chunk to
 * finish compiling server-side on first (or renewed) hit. The bug survived a
 * SECOND pass (all routes already visited once) because Turbopack can still
 * recompile a route on a fresh full navigation even after an earlier visit.
 *
 * The check is near-zero-cost when the indicator never appears (production
 * builds, non-Next.js targets): one `isVisible()` poll returns false
 * immediately and the wait returns without delay.
 */

export interface PollablePage {
  getByText(pattern: RegExp): { isVisible(): Promise<boolean> };
  waitForTimeout(ms: number): Promise<void>;
}

export interface DevCompileWaitResult {
  /** True if the indicator was seen at all (compiling did happen). */
  wasCompiling: boolean;
  /** True if it cleared within the timeout (or never appeared). False = gave up still compiling. */
  settled: boolean;
  /** How long the wait actually took, in ms. */
  waitedMs: number;
}

const COMPILING_PATTERN = /^\s*compiling\s*\.*\s*$/i;
const POLL_INTERVAL_MS = 250;

/**
 * Polls for absence of Next.js's dev-mode compiling toast. Takes a `now`
 * function so it stays deterministic/testable without real timers.
 */
export async function waitForDevCompileIdle(
  page: PollablePage,
  timeoutMs: number,
  now: () => number = Date.now
): Promise<DevCompileWaitResult> {
  const start = now();
  const deadline = start + timeoutMs;
  const locator = page.getByText(COMPILING_PATTERN);

  let wasCompiling = false;
  for (;;) {
    const visible = await locator.isVisible().catch(() => false);
    if (visible) wasCompiling = true;
    if (!visible) {
      return { wasCompiling, settled: true, waitedMs: now() - start };
    }
    if (now() >= deadline) {
      return { wasCompiling, settled: false, waitedMs: now() - start };
    }
    await page.waitForTimeout(POLL_INTERVAL_MS);
  }
}
