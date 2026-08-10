import { waitForDevCompileIdle, type PollablePage } from '../devCompileWait';

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
  it('returns immediately, not compiling, when the indicator never appears', async () => {
    const { page } = fakePage([false]);
    const result = await waitForDevCompileIdle(page, 20000);
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
    const result = await waitForDevCompileIdle(advancing, 20000, clock);
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
    const result = await waitForDevCompileIdle(advancing, 12000, clock);
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
    const result = await waitForDevCompileIdle(page, 20000);
    expect(result.settled).toBe(true);
    expect(result.wasCompiling).toBe(false);
  });
});
