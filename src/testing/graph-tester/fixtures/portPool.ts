/**
 * Port pool fixture for parallel testing.
 *
 * Automatically assigns unique ports to each test worker to avoid conflicts.
 *
 * @packageDocumentation
 */

import { test as base, expect as baseExpect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

/**
 * Port pool fixture interface.
 */
export interface PortPoolFixture {
  /** Assigned port for this test */
  port: number;

  /** Base URL with assigned port */
  baseURL: string;
}

/**
 * Port pool manager (singleton across workers).
 */
class PortPoolManager {
  private availablePorts: number[] = [];
  private usedPorts: Set<number> = new Set();
  private lockFile = path.join(os.tmpdir(), 'supernal-port-pool.lock');
  private lockFd: number | null = null;

  constructor(startPort: number = 3020, poolSize: number = 10) {
    // Initialize pool: 3020-3029 by default
    for (let i = 0; i < poolSize; i++) {
      this.availablePorts.push(startPort + i);
    }
  }

  /**
   * Acquire a port from the pool (with cross-worker coordination).
   */
  async acquirePort(): Promise<number> {
    await this.acquireLock();
    try {
      if (this.availablePorts.length === 0) {
        throw new Error('No available ports in pool. Increase pool size or reduce parallel workers.');
      }
      const port = this.availablePorts.shift()!;
      this.usedPorts.add(port);
      return port;
    } finally {
      await this.releaseLock();
    }
  }

  /**
   * Release a port back to the pool.
   */
  async releasePort(port: number): Promise<void> {
    await this.acquireLock();
    try {
      if (this.usedPorts.has(port)) {
        this.usedPorts.delete(port);
        this.availablePorts.push(port);
      }
    } finally {
      await this.releaseLock();
    }
  }

  /**
   * Acquire file-based lock for cross-worker coordination.
   */
  private async acquireLock(): Promise<void> {
    const maxRetries = 100;
    const retryDelay = 50; // ms

    for (let i = 0; i < maxRetries; i++) {
      try {
        // Try to create lock file with exclusive flag
        this.lockFd = fs.openSync(this.lockFile, fs.constants.O_CREAT | fs.constants.O_EXCL | fs.constants.O_RDWR);
        return; // Lock acquired
      } catch (error: any) {
        if (error.code === 'EEXIST') {
          // Lock file exists, wait and retry
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
        } else {
          throw error;
        }
      }
    }

    throw new Error('Failed to acquire port pool lock after retries');
  }

  /**
   * Release file-based lock.
   */
  private async releaseLock(): Promise<void> {
    if (this.lockFd !== null) {
      try {
        fs.closeSync(this.lockFd);
        fs.unlinkSync(this.lockFile);
      } catch (error) {
        // Ignore errors (file might already be deleted)
      }
      this.lockFd = null;
    }
  }

  /**
   * Cleanup all resources.
   */
  async cleanup(): Promise<void> {
    try {
      if (fs.existsSync(this.lockFile)) {
        fs.unlinkSync(this.lockFile);
      }
    } catch {
      // Ignore
    }
  }
}

// Global port pool instance
const portPool = new PortPoolManager();

/**
 * Playwright test fixture with automatic port assignment.
 *
 * @example
 * ```typescript
 * import { test, expect } from '@supernal/interface/testing/graph-tester/fixtures';
 *
 * test('visual regression', async ({ page, port, baseURL }) => {
 *   console.log(`Test running on port ${port}`);
 *   await page.goto(baseURL);
 *   // Test automatically gets unique port!
 * });
 * ```
 */
export const test = base.extend<PortPoolFixture>({
  port: async ({}, use) => {
    const port = await portPool.acquirePort();
    await use(port);
    await portPool.releasePort(port);
  },

  baseURL: async ({ port }, use) => {
    await use(`http://localhost:${port}`);
  },
});

/**
 * Re-export expect from Playwright.
 */
export const expect = baseExpect;

/**
 * Cleanup port pool (call at end of test suite).
 */
export async function cleanupPortPool(): Promise<void> {
  await portPool.cleanup();
}
