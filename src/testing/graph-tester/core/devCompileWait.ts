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
 * A SECOND, more subtle race surfaced verifying the first version of this
 * fix live: the toast doesn't always exist in the DOM the instant `load`
 * fires -- a compile that starts a beat AFTER navigation (e.g. triggered by
 * the app's own first data fetch) can render its toast a moment after an
 * immediate single isVisible() check already returned "not visible" and
 * declared victory. `waitForSettleMs` (default 300ms) gives a delayed-onset
 * compile time to actually appear before the poll loop starts checking for
 * its absence -- this is the near-zero-cost floor for every navigation
 * (dev or not), not a per-poll cost, so it stays cheap.
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
const DEFAULT_SETTLE_MS = 300;

/**
 * Polls for absence of Next.js's dev-mode compiling toast. Takes a `now`
 * function so it stays deterministic/testable without real timers.
 */
export async function waitForDevCompileIdle(
  page: PollablePage,
  timeoutMs: number,
  now: () => number = Date.now,
  waitForSettleMs: number = DEFAULT_SETTLE_MS
): Promise<DevCompileWaitResult> {
  const start = now();
  const deadline = start + timeoutMs;
  const locator = page.getByText(COMPILING_PATTERN);

  // Give a delayed-onset compile a chance to render its toast before the
  // very first check -- see the "second race" note above.
  if (waitForSettleMs > 0) {
    await page.waitForTimeout(waitForSettleMs);
  }

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

/**
 * Waits for a page's body content to STOP CHANGING before a capture
 * proceeds -- catches a second, separate class of blank/incomplete capture
 * that devCompileWait alone does not: an app whose real content (e.g. a
 * fetched list) arrives asynchronously after mount, AFTER the static shell
 * (a header, a subheading) has already rendered.
 *
 * Real incident this closes: live-verifying the compile-wait fix against
 * apps/supernal-dashboard's /agency-ops, a raw unthrottled page.screenshot()
 * taken ~2s after navigation showed the real, fully-populated company list
 * (confirmed identical to what the app's own author sees in a live browser)
 * -- but GraphTester's own capture path, which has no wait for this at all,
 * would still be racing that same async fetch on a fast machine. A single
 * "is body non-empty" check is NOT enough: the static header text alone
 * makes the body non-empty almost immediately, well before the async
 * company list actually renders -- so this requires the body's TEXT LENGTH
 * to be unchanged across `requiredStablePolls` consecutive checks (default
 * 2, i.e. ~400ms of no growth) before declaring the page settled, not just
 * present.
 *
 * KNOWN LIMIT, not a bug to chase further here: a page with multiple
 * DISTINCT async phases separated by a genuine pause longer than the
 * stability window (verified live: /agency-ops's terminal panel opens a
 * WebSocket and only renders its real content several seconds AFTER the
 * company list has already stabilized) will still capture too early --
 * content-length stability cannot distinguish "fully loaded" from "paused
 * between two unrelated async phases." No fixed default here is
 * simultaneously fast for ordinary pages and correct for this class of
 * page. For a route known to need more settle time, pass GraphTesterConfig's
 * existing `waitAfter` explicitly (e.g. `--waitAfter 5000`) -- that field
 * already exists for exactly this case ("apps that render content in
 * useEffect hooks").
 */

export interface ContentPollablePage {
  locator(selector: string): { textContent(): Promise<string | null> };
  waitForTimeout(ms: number): Promise<void>;
}

export interface ContentSettleResult {
  /** Final observed body text length. */
  finalLength: number;
  /** True if length stabilized within the timeout; false = gave up while still growing. */
  settled: boolean;
  waitedMs: number;
}

const DEFAULT_CONTENT_TIMEOUT_MS = 8000;
const CONTENT_POLL_INTERVAL_MS = 200;
const DEFAULT_REQUIRED_STABLE_POLLS = 2;

export async function waitForContentSettle(
  page: ContentPollablePage,
  timeoutMs: number = DEFAULT_CONTENT_TIMEOUT_MS,
  now: () => number = Date.now,
  requiredStablePolls: number = DEFAULT_REQUIRED_STABLE_POLLS
): Promise<ContentSettleResult> {
  const start = now();
  const deadline = start + timeoutMs;
  const bodyLocator = page.locator('body');

  let lastLength = -1;
  let stableStreak = 0;
  for (;;) {
    const text = await bodyLocator.textContent().catch(() => null);
    const length = (text ?? '').trim().length;
    if (length === lastLength) {
      stableStreak++;
    } else {
      stableStreak = 1; // this poll itself counts as the first observation of the new length
      lastLength = length;
    }
    if (stableStreak >= requiredStablePolls) {
      return { finalLength: length, settled: true, waitedMs: now() - start };
    }
    if (now() >= deadline) {
      return { finalLength: length, settled: false, waitedMs: now() - start };
    }
    await page.waitForTimeout(CONTENT_POLL_INTERVAL_MS);
  }
}
