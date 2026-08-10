/**
 * Regression test for a real cross-mode context-bleed bug found in
 * adversarial review of the first implementation: before this fix,
 * GraphTester.initBrowser() called every registered mode's
 * configureContext() on the SAME shared BrowserContext every other mode's
 * newPage() also drew from -- so InteractionMode's network-interception
 * rules (block cross-origin, fixture-substitute /api/**, auth-invariant)
 * silently applied to every other mode's page loads too when run together
 * (e.g. `--modes all,interaction`), contradicting the explicit "every other
 * mode is completely unaffected" design guarantee.
 *
 * Mocks `@playwright/test`'s `chromium` so this proves the CONTEXT-ROUTING
 * logic itself -- which context a given mode's pages are created from --
 * without needing a real browser or a live page.
 */

import type { BrowserContext, Page } from '@playwright/test';
import { GraphTester } from '../GraphTester';
import { TestFunction } from '../TestFunction';
import type {
  TestContext,
  TestResult,
  GraphTesterConfig,
  TestMode,
} from '../types';

let contextCounter = 0;

function makeFakeContext(): BrowserContext {
  const id = ++contextCounter;
  const pages: Page[] = [];
  return {
    __id: id,
    newPage: jest.fn(async () => {
      const page = {
        __contextId: id,
        setViewportSize: jest.fn(async () => {}),
        goto: jest.fn(async () => {}),
        close: jest.fn(async () => {}),
      } as unknown as Page;
      pages.push(page);
      return page;
    }),
    close: jest.fn(async () => {}),
    route: jest.fn(async () => {}),
    routeWebSocket: jest.fn(async () => {}),
  } as unknown as BrowserContext;
}

jest.mock('@playwright/test', () => {
  const contexts: BrowserContext[] = [];
  return {
    chromium: {
      launch: jest.fn(async () => ({
        newContext: jest.fn(async () => {
          const ctx = makeFakeContext();
          contexts.push(ctx);
          return ctx;
        }),
        close: jest.fn(async () => {}),
      })),
    },
    __getCreatedContexts: () => contexts,
  };
});

/** A plain read-only mode (visual/perf/seo/accessibility shape) -- never defines configureContext(). */
class PlainMode extends TestFunction {
  readonly mode: TestMode = 'plain';
  readonly name = 'Plain';
  readonly description =
    'A mode with no configureContext -- must use the shared context.';
  contextIdsSeenViaExecute: number[] = [];

  async execute(page: Page, _context: TestContext): Promise<TestResult> {
    this.contextIdsSeenViaExecute.push((page as any).__contextId);
    return { passed: true, duration: 0, errors: [], metadata: {} };
  }
}

/** A mode that DOES define configureContext() -- must get its own dedicated context (InteractionMode's shape). */
class IsolatedMode extends TestFunction {
  readonly mode: TestMode = 'isolated';
  readonly name = 'Isolated';
  readonly description =
    'A mode with configureContext -- must get its own dedicated context.';
  configuredContext: BrowserContext | null = null;
  contextIdsSeenViaExecute: number[] = [];

  async configureContext(
    context: BrowserContext,
    _config: GraphTesterConfig
  ): Promise<void> {
    this.configuredContext = context;
  }

  async execute(page: Page, _context: TestContext): Promise<TestResult> {
    this.contextIdsSeenViaExecute.push((page as any).__contextId);
    return { passed: true, duration: 0, errors: [], metadata: {} };
  }
}

describe('GraphTester — per-mode context isolation (configureContext gets its own BrowserContext)', () => {
  it('a mode with configureContext() never shares its context with a mode that has none', async () => {
    const plain = new PlainMode();
    const isolated = new IsolatedMode();

    const tester = new GraphTester({
      baseUrl: 'https://example.test',
      routes: [{ route: '/' }, { route: '/about' }],
      modes: ['plain', 'isolated'],
      output: { dir: '/tmp/does-not-matter' },
    });
    tester.registerTestFunction(plain);
    tester.registerTestFunction(isolated);

    await tester.runTests();

    // The isolated mode's configureContext() must have been called with a
    // REAL context object (not undefined/null).
    expect(isolated.configuredContext).not.toBeNull();

    // Every page PlainMode ever ran on, and every page IsolatedMode ever ran
    // on, must come from DIFFERENT context ids -- proving they never shared
    // a BrowserContext across the two routes tested.
    expect(plain.contextIdsSeenViaExecute.length).toBeGreaterThan(0);
    expect(isolated.contextIdsSeenViaExecute.length).toBeGreaterThan(0);
    const plainIds = new Set(plain.contextIdsSeenViaExecute);
    const isolatedIds = new Set(isolated.contextIdsSeenViaExecute);
    for (const id of isolatedIds) {
      expect(plainIds.has(id)).toBe(false);
    }

    // PlainMode's own pages across BOTH routes should all share the SAME
    // context id (the single shared context, exactly as before this fix) --
    // confirming the fix didn't accidentally also isolate unrelated modes.
    expect(plainIds.size).toBe(1);

    // The context IsolatedMode's pages were created from must be the exact
    // same object configureContext() was handed -- not some third context.
    const isolatedContextId = (isolated.configuredContext as any).__id;
    expect(Array.from(isolatedIds)).toEqual([isolatedContextId]);
  });

  it('a run with ONLY plain (no configureContext) modes creates no dedicated contexts at all', async () => {
    const plainA = new PlainMode();
    (plainA as any).mode = 'plainA';
    const plainB = new PlainMode();
    (plainB as any).mode = 'plainB';

    const tester = new GraphTester({
      baseUrl: 'https://example.test',
      routes: [{ route: '/' }],
      modes: ['plainA', 'plainB'],
      output: { dir: '/tmp/does-not-matter' },
    });
    tester.registerTestFunction(plainA);
    tester.registerTestFunction(plainB);

    await tester.runTests();

    // Both modes' single page must come from the SAME (shared) context --
    // no per-mode dedication should happen when nothing defines
    // configureContext().
    expect(plainA.contextIdsSeenViaExecute).toEqual(
      plainB.contextIdsSeenViaExecute
    );
  });
});
