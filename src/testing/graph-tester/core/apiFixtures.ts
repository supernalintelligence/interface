/**
 * Captured API-response fixtures for freeform interaction mode's same-origin
 * `/api/**` substitution (D2). Freeform mode never talks to a target's real
 * backend -- every same-origin `/api/**` request during a run is answered
 * from a fixture captured HERE, once, from a real response.
 *
 * Fixtures are CAPTURED, not hand-authored: `captureApiFixtures()` visits a
 * set of real pages against a LIVE target and records every real `/api/**`
 * response it observes, writing one JSON file per (method, path) pair. This
 * is a deliberate design choice (not laziness) -- hand-authoring a fixture
 * from reading a route's own `NextResponse.json(...)` call sites was tried
 * and found unreliable: several routes degrade gracefully on a
 * plausible-but-wrong shape (an empty array silently hides a whole UI
 * section instead of visibly breaking), so a wrong hand-written fixture can
 * silently under-test a page with no visible signal anything is wrong. A
 * captured real response doesn't have this failure mode.
 *
 * @packageDocumentation
 */

import * as fs from 'fs/promises';
import * as path from 'path';

/** One captured (or authored) fixture response. */
export interface ApiFixture {
  status: number;
  contentType: string;
  /** Raw response body text, exactly as captured -- never re-serialized/guessed. */
  body: string;
}

/** Build the lookup key for a (method, pathname) pair. Pathname must already exclude the origin/query string. */
export function fixtureKey(method: string, pathname: string): string {
  return `${method.toUpperCase()} ${pathname}`;
}

/** Build the on-disk filename for a fixture (one JSON file per method+path). */
function fixtureFilename(method: string, pathname: string): string {
  const safePath = pathname.replace(/^\//, '').replace(/\//g, '__') || 'root';
  return `${method.toUpperCase()}__${safePath}.json`;
}

/**
 * Loads every fixture in `dir` into a Map keyed by `fixtureKey()`. Returns
 * an empty Map (not an error) if `dir` doesn't exist yet -- the caller
 * (InteractionMode) is responsible for treating "no fixture for this
 * request" as a fail-loud condition, not this loader silently tolerating a
 * missing directory as if it were a valid empty fixture set for a target
 * that was never captured.
 */
export async function loadApiFixtures(
  dir: string
): Promise<Map<string, ApiFixture>> {
  const fixtures = new Map<string, ApiFixture>();
  let entries: string[];
  try {
    entries = await fs.readdir(dir);
  } catch {
    return fixtures;
  }

  for (const entry of entries) {
    if (!entry.endsWith('.json')) continue;
    const match = entry.match(/^([A-Z]+)__(.+)\.json$/);
    if (!match) continue;
    const [, method, safePath] = match;
    const pathname = '/' + safePath.replace(/__/g, '/');
    const raw = await fs.readFile(path.join(dir, entry), 'utf-8');
    const parsed = JSON.parse(raw) as ApiFixture;
    fixtures.set(fixtureKey(method, pathname), parsed);
  }

  return fixtures;
}

/**
 * Writes one captured fixture to disk. Exposed separately from
 * `captureApiFixtures()` so a caller with its own capture loop (e.g. a CLI
 * command driving a real browser against a live target) can persist
 * fixtures incrementally as it discovers them.
 */
export async function writeApiFixture(
  dir: string,
  method: string,
  pathname: string,
  fixture: ApiFixture
): Promise<void> {
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(
    path.join(dir, fixtureFilename(method, pathname)),
    JSON.stringify(fixture, null, 2),
    'utf-8'
  );
}

/**
 * HUMAN-RUN CAPTURE STEP -- this does NOT run as part of a normal freeform
 * test run. It must be run ONCE (and re-run whenever the target's real
 * `/api/**` surface changes) against a LIVE, running instance of the target
 * to populate `outputDir` with real fixtures. This function only WATCHES
 * (via Playwright's own `page.on('response', ...)`) responses that occur
 * naturally while `routes` are visited in a real browser -- it never invents
 * or guesses a response shape.
 *
 * NOT invoked automatically by this package. A caller (e.g. an `si` CLI
 * command, built as a thin wrapper over this function) is responsible for
 * launching a real Playwright browser/page pointed at a live `baseUrl`,
 * visiting each of `routes`, and letting this listener capture whatever
 * `/api/**` responses those page visits naturally trigger. See this
 * repo's own CLI command scaffolding (`enterprise/src/cli/commands/`) for
 * the wiring convention -- deliberately NOT duplicated here, this module
 * stays framework-agnostic (core, not enterprise).
 *
 * @param page - An already-navigated-capable Playwright Page, pointed at a LIVE target.
 * @param apiPathPrefixes - Same-origin path prefixes to capture (e.g. ['/api/', '/account/api/']).
 * @param outputDir - Where to write captured fixtures.
 * @returns The list of (method, pathname) pairs actually captured, for a human to review.
 */
export function attachFixtureCapture(
  page: import('@playwright/test').Page,
  apiPathPrefixes: string[],
  outputDir: string
): {
  captured: Array<{ method: string; pathname: string }>;
  detach: () => void;
} {
  const captured: Array<{ method: string; pathname: string }> = [];

  const listener = async (response: import('@playwright/test').Response) => {
    const url = new URL(response.url());
    const isApiPath = apiPathPrefixes.some((prefix) =>
      url.pathname.startsWith(prefix)
    );
    if (!isApiPath) return;

    const method = response.request().method();
    let body: string;
    try {
      body = await response.text();
    } catch {
      return; // response body no longer available (navigated away) -- skip, don't fabricate
    }

    await writeApiFixture(outputDir, method, url.pathname, {
      status: response.status(),
      contentType: response.headers()['content-type'] ?? 'application/json',
      body,
    });
    captured.push({ method, pathname: url.pathname });
  };

  page.on('response', listener);
  return {
    captured,
    detach: () => page.off('response', listener),
  };
}
