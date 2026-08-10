/**
 * Unit tests for classifyInterceptedRequest -- the safety-critical decision
 * logic behind freeform interaction mode's D2 (fixture substitution)/D3
 * (cross-origin block)/D4 (auth invariant). Pure function, no Playwright/DOM
 * dependency -- see interceptionPolicy.ts's own module doc for why this is
 * split out this way.
 */

import {
  classifyInterceptedRequest,
  type ClassifyRequestParams,
} from '../interceptionPolicy';
import type { ApiFixture } from '../apiFixtures';

const TARGET_ORIGIN = 'https://si42.ai';
const AUTH_COOKIE = 'si42-access-token';

function baseParams(
  overrides: Partial<ClassifyRequestParams> = {}
): ClassifyRequestParams {
  return {
    requestUrl: `${TARGET_ORIGIN}/`,
    method: 'GET',
    cookieHeader: '',
    targetOrigin: TARGET_ORIGIN,
    apiPathPrefixes: ['/api/', '/account/api/'],
    authCookieName: AUTH_COOKIE,
    fixtures: new Map<string, ApiFixture>(),
    ...overrides,
  };
}

describe('classifyInterceptedRequest — D4 auth invariant (checked first, always)', () => {
  it('blocks a request carrying the auth cookie', () => {
    const result = classifyInterceptedRequest(
      baseParams({ cookieHeader: `si42-access-token=abc123; other=1` })
    );
    expect(result.action).toBe('block-auth-violation');
  });

  it('blocks even when the cookie is not the first in the header', () => {
    const result = classifyInterceptedRequest(
      baseParams({ cookieHeader: `theme=dark; si42-access-token=abc123` })
    );
    expect(result.action).toBe('block-auth-violation');
  });

  it('does NOT false-positive on a cookie name that merely CONTAINS the auth cookie name as a substring', () => {
    // e.g. "not-si42-access-token=x" or "si42-access-token-old=x" must not match
    const result = classifyInterceptedRequest(
      baseParams({ cookieHeader: `si42-access-token-old=abc123` })
    );
    expect(result.action).not.toBe('block-auth-violation');
  });

  it('takes priority over D3 cross-origin block — auth leak on a cross-origin request is still caught', () => {
    const result = classifyInterceptedRequest(
      baseParams({
        requestUrl: 'https://evil.example.com/track',
        cookieHeader: `si42-access-token=abc123`,
      })
    );
    // Must report the auth violation specifically, not just "cross-origin blocked"
    expect(result.action).toBe('block-auth-violation');
  });

  it('takes priority over D2 fixture fulfillment — an authenticated same-origin API call is still caught, not fulfilled', () => {
    const fixtures = new Map<string, ApiFixture>([
      [
        'GET /api/faq',
        { status: 200, contentType: 'application/json', body: '{}' },
      ],
    ]);
    const result = classifyInterceptedRequest(
      baseParams({
        requestUrl: `${TARGET_ORIGIN}/api/faq`,
        cookieHeader: `si42-access-token=abc123`,
        fixtures,
      })
    );
    expect(result.action).toBe('block-auth-violation');
  });

  it('does not fire when the auth cookie is absent', () => {
    const result = classifyInterceptedRequest(
      baseParams({ cookieHeader: 'theme=dark' })
    );
    expect(result.action).not.toBe('block-auth-violation');
  });
});

describe('classifyInterceptedRequest — D3 cross-origin block', () => {
  it('blocks a different-origin request', () => {
    const result = classifyInterceptedRequest(
      baseParams({ requestUrl: 'https://thirdparty-chat.example.com/socket' })
    );
    expect(result.action).toBe('block-cross-origin');
  });

  it('blocks a same-hostname-but-different-scheme/port request (different origin)', () => {
    const result = classifyInterceptedRequest(
      baseParams({
        requestUrl: 'http://si42.ai/',
        targetOrigin: 'https://si42.ai',
      })
    );
    expect(result.action).toBe('block-cross-origin');
  });

  it('allows a same-origin request through this check', () => {
    const result = classifyInterceptedRequest(
      baseParams({ requestUrl: `${TARGET_ORIGIN}/about` })
    );
    expect(result.action).not.toBe('block-cross-origin');
  });
});

describe('classifyInterceptedRequest — D2 same-origin /api/** fixture substitution', () => {
  it('passes through a same-origin non-API request unmodified (page assets, HTML)', () => {
    const result = classifyInterceptedRequest(
      baseParams({ requestUrl: `${TARGET_ORIGIN}/_next/static/chunk.js` })
    );
    expect(result).toEqual({ action: 'continue' });
  });

  it('fulfills a same-origin /api/** request from a matching fixture', () => {
    const fixture: ApiFixture = {
      status: 200,
      contentType: 'application/json',
      body: '{"items":[]}',
    };
    const fixtures = new Map<string, ApiFixture>([['GET /api/faq', fixture]]);
    const result = classifyInterceptedRequest(
      baseParams({ requestUrl: `${TARGET_ORIGIN}/api/faq`, fixtures })
    );
    expect(result).toEqual({ action: 'fulfill', fixture });
  });

  it('blocks (deny-by-default) a same-origin /api/** request with NO matching fixture — never silently passes through', () => {
    const result = classifyInterceptedRequest(
      baseParams({ requestUrl: `${TARGET_ORIGIN}/api/some-new-route` })
    );
    expect(result).toEqual({
      action: 'block-unstubbed',
      key: 'GET /api/some-new-route',
    });
  });

  it('covers the second API tree (app/account/api/**), not just app/api/**', () => {
    const fixture: ApiFixture = {
      status: 200,
      contentType: 'application/json',
      body: '{}',
    };
    const fixtures = new Map<string, ApiFixture>([
      ['GET /account/api/profile', fixture],
    ]);
    const result = classifyInterceptedRequest(
      baseParams({
        requestUrl: `${TARGET_ORIGIN}/account/api/profile`,
        fixtures,
      })
    );
    expect(result).toEqual({ action: 'fulfill', fixture });
  });

  it('matches fixtures by METHOD, not just path — a POST to a GET-only-fixtured route is unstubbed, not silently fulfilled', () => {
    const fixtures = new Map<string, ApiFixture>([
      [
        'GET /api/faq',
        { status: 200, contentType: 'application/json', body: '{}' },
      ],
    ]);
    const result = classifyInterceptedRequest(
      baseParams({
        requestUrl: `${TARGET_ORIGIN}/api/faq`,
        method: 'POST',
        fixtures,
      })
    );
    expect(result.action).toBe('block-unstubbed');
  });
});
