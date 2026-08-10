/**
 * Pure, DOM/browser-independent request-classification logic for freeform
 * interaction mode's network safety model (D2/D3/D4). Extracted from
 * InteractionMode.configureContext()'s inline `context.route()` handler so
 * this decision logic is directly unit-testable with plain objects, the
 * same "pure function, unit-tested separately from the Playwright-dependent
 * half" split this codebase already uses for `hasObservableChange()` in
 * interactiveElements.ts.
 *
 * @packageDocumentation
 */

import type { ApiFixture } from './apiFixtures';
import { fixtureKey } from './apiFixtures';

export type RequestClassification =
  | { action: 'block-auth-violation'; message: string }
  | { action: 'block-cross-origin' }
  | { action: 'continue' }
  | { action: 'fulfill'; fixture: ApiFixture }
  | { action: 'block-unstubbed'; key: string };

export interface ClassifyRequestParams {
  requestUrl: string;
  method: string;
  /** Raw `Cookie` request header value, or empty string if absent. */
  cookieHeader: string;
  targetOrigin: string;
  apiPathPrefixes: string[];
  authCookieName: string;
  fixtures: Map<string, ApiFixture>;
}

/** Escapes a string for safe embedding in a RegExp. */
function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Decides what to do with one intercepted request. Order matters and is
 * safety-load-bearing -- D4 (auth invariant) is checked FIRST, before even
 * knowing whether the request is same-origin, so an auth-cookie leak can
 * never be masked by an earlier same-origin/cross-origin branch.
 */
export function classifyInterceptedRequest(
  params: ClassifyRequestParams
): RequestClassification {
  const {
    requestUrl,
    method,
    cookieHeader,
    targetOrigin,
    apiPathPrefixes,
    authCookieName,
    fixtures,
  } = params;

  // D4 -- checked on EVERY request, before any other logic.
  const cookiePattern = new RegExp(`(^|;\\s*)${escapeRegExp(authCookieName)}=`);
  if (cookiePattern.test(cookieHeader)) {
    return {
      action: 'block-auth-violation',
      message: `Auth cookie "${authCookieName}" was observed on a request to ${requestUrl} -- freeform mode must never run authenticated.`,
    };
  }

  const url = new URL(requestUrl);

  // D3 -- block every cross-origin request, any method.
  if (url.origin !== targetOrigin) {
    return { action: 'block-cross-origin' };
  }

  // D2 -- same-origin /api/** substituted from a fixture; everything else
  // same-origin (the page's own HTML/JS/CSS/assets) passes through.
  const isApiPath = apiPathPrefixes.some((prefix) =>
    url.pathname.startsWith(prefix)
  );
  if (!isApiPath) {
    return { action: 'continue' };
  }

  const key = fixtureKey(method, url.pathname);
  const fixture = fixtures.get(key);
  if (!fixture) {
    return { action: 'block-unstubbed', key };
  }

  return { action: 'fulfill', fixture };
}
