import {
  waitForDevCompileIdle,
  waitForContentSettle,
  type PollablePage,
  type ContentPollablePage,
} from '../devCompileWait';

function fakePage(visibleSequence: boolean[]): {
  page: PollablePage;
  ticks: number;
} {
  let index = 0;
  const state = { ticks: 0 };
  const page: PollablePage = {
    getByText: () => ({
      isVisible: async () => {
        const v = visibleSequence[Math.min(index, visibleSequence.length - 1)];
        index++;
        return v;
      },
    }),
    waitForTimeout: async () => {
      state.ticks++;
    },
  };
  return { page, ticks: 0 } as any;
}

describe('waitForDevCompileIdle', () => {
  it('returns immediately, not compiling, when the indicator never appears (settle disabled)', async () => {
    const { page } = fakePage([false]);
    const result = await waitForDevCompileIdle(page, 20000, Date.now, 0);
    expect(result.wasCompiling).toBe(false);
    expect(result.settled).toBe(true);
    expect(result.waitedMs).toBe(0);
  });

  it('polls until the indicator clears, and reports it was compiling', async () => {
    const { page } = fakePage([true, true, false]);
    let now = 0;
    const clock = () => now;
    // waitForTimeout advances the fake clock so the deadline math is exercised for real.
    const advancing: PollablePage = {
      getByText: page.getByText,
      waitForTimeout: async () => {
        now += 250;
      },
    };
    const result = await waitForDevCompileIdle(advancing, 20000, clock, 0);
    expect(result.wasCompiling).toBe(true);
    expect(result.settled).toBe(true);
  });

  it('gives up when the indicator never clears within the timeout', async () => {
    const { page } = fakePage([true]);
    let now = 0;
    const clock = () => now;
    const advancing: PollablePage = {
      getByText: page.getByText,
      waitForTimeout: async () => {
        now += 5000;
      },
    };
    const result = await waitForDevCompileIdle(advancing, 12000, clock, 0);
    expect(result.wasCompiling).toBe(true);
    expect(result.settled).toBe(false);
  });

  it('treats an isVisible() error as not-visible (fail open, never hang)', async () => {
    const page: PollablePage = {
      getByText: () => ({
        isVisible: async () => {
          throw new Error('detached');
        },
      }),
      waitForTimeout: async () => {},
    };
    const result = await waitForDevCompileIdle(page, 20000, Date.now, 0);
    expect(result.settled).toBe(true);
    expect(result.wasCompiling).toBe(false);
  });

  describe('the settle window (the race a live run against apps/supernal-dashboard found)', () => {
    it('catches a compile that only starts AFTER the very first instant -- the race the first version of this fix missed live', async () => {
      // Simulates: page.goto() resolves ('load' fired), but the toast hasn't
      // rendered into the DOM yet -- it only appears once the settle wait has
      // elapsed. A version of this function with no settle window would
      // check once immediately, see "not visible", and declare victory while
      // a real compile is about to start.
      let elapsed = 0;
      const settleMs = 300;
      const compileClearsAt = 800; // toast appears at settleMs, clears later -- a real compile cycle
      const advancing: PollablePage = {
        getByText: () => ({
          isVisible: async () =>
            elapsed >= settleMs && elapsed < compileClearsAt,
        }),
        waitForTimeout: async (ms: number) => {
          elapsed += ms;
        },
      };
      const result = await waitForDevCompileIdle(
        advancing,
        20000,
        () => elapsed,
        settleMs
      );
      // The settle wait let the delayed toast actually appear, so it's
      // correctly recorded as having compiled -- not silently missed.
      expect(result.wasCompiling).toBe(true);
      expect(result.settled).toBe(true);
    });

    it('applies the default settle window when not explicitly overridden', async () => {
      const waits: number[] = [];
      const page: PollablePage = {
        getByText: () => ({ isVisible: async () => false }),
        waitForTimeout: async (ms: number) => {
          waits.push(ms);
        },
      };
      await waitForDevCompileIdle(page, 20000);
      expect(waits[0]).toBeGreaterThan(0); // the settle wait fired before the (only) check
    });
  });
});

describe('waitForContentSettle -- the real bug found live: a static shell renders instantly, real content arrives later', () => {
  function fakeContentPage(lengths: number[]): ContentPollablePage {
    let now = 0;
    let index = 0;
    return {
      locator: () => ({
        textContent: async () => {
          const len = lengths[Math.min(index, lengths.length - 1)];
          index++;
          return 'x'.repeat(len);
        },
      }),
      waitForTimeout: async (ms: number) => {
        now += ms;
      },
    };
  }

  it('settles immediately when the SAME length is observed on the first two consecutive polls', async () => {
    const page = fakeContentPage([50, 50]);
    const result = await waitForContentSettle(page, 8000, Date.now, 2);
    expect(result.settled).toBe(true);
    expect(result.finalLength).toBe(50);
  });

  it('does NOT settle on a non-empty body alone if the length is still growing -- the exact live bug', async () => {
    // Models the real /agency-ops finding: static shell renders at length 40,
    // then the async company list streams in, growing the body across
    // several polls before it finally stabilizes at 900.
    const page = fakeContentPage([40, 120, 400, 900, 900]);
    const result = await waitForContentSettle(page, 8000, Date.now, 2);
    expect(result.settled).toBe(true);
    expect(result.finalLength).toBe(900); // NOT 40 -- a naive "non-empty" check would have stopped there
  });

  it('gives up when the length never stops growing within the timeout', async () => {
    let now = 0;
    const clock = () => now;
    let n = 0;
    const page: ContentPollablePage = {
      locator: () => ({
        textContent: async () => {
          n += 10;
          return 'x'.repeat(n); // always growing, never stabilizes
        },
      }),
      waitForTimeout: async (ms: number) => {
        now += ms;
      },
    };
    const result = await waitForContentSettle(page, 1000, clock, 2);
    expect(result.settled).toBe(false);
  });

  it('treats a textContent() error as empty (fail open, never hang)', async () => {
    const page: ContentPollablePage = {
      locator: () => ({
        textContent: async () => {
          throw new Error('detached');
        },
      }),
      waitForTimeout: async () => {},
    };
    const result = await waitForContentSettle(page, 8000, Date.now, 2);
    expect(result.settled).toBe(true);
    expect(result.finalLength).toBe(0);
  });
});
