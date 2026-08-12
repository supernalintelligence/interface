import fs from 'fs';
import os from 'os';
import path from 'path';
import { NextjsDynamicScanner } from '../NextjsDynamicScanner';

let tmpDir: string;

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'si-nextjs-scanner-test-'));
});

afterEach(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

function writeRoute(relDir: string): void {
  const dir = path.join(tmpDir, relDir);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(
    path.join(dir, 'route.ts'),
    'export async function GET() { return new Response("ok"); }\n'
  );
}

describe('NextjsDynamicScanner — API route prefix', () => {
  it('restores the URL segment between the app root and scanPaths.routes (e.g. "api")', async () => {
    writeRoute('src/app/api/users');
    writeRoute('src/app/api/[repoId]/agent-rules');

    const scanner = new NextjsDynamicScanner({
      routingSystem: 'nextjs-name-extraction',
      scanPaths: {
        routes: [path.join(tmpDir, 'src/app/api')],
      },
      output: { contractsPath: 'unused.ts', moduleFormat: 'esm' },
    } as any);

    const result = await scanner.scan();
    const patterns = result.routes.map((r) => r.pattern);

    expect(patterns).toContain('/api/users');
    expect(patterns).toContain('/api/:repoId/agent-rules');
    // Guard against regressing to the old bug where the 'api' segment was
    // silently dropped, producing '/users' instead of '/api/users'.
    expect(patterns).not.toContain('/users');
    expect(patterns).not.toContain('/:repoId/agent-rules');
  });

  it('produces no prefix when scanPaths.routes has no segment after "app"', async () => {
    writeRoute('app/users');

    const scanner = new NextjsDynamicScanner({
      routingSystem: 'nextjs-name-extraction',
      scanPaths: {
        routes: [path.join(tmpDir, 'app')],
      },
      output: { contractsPath: 'unused.ts', moduleFormat: 'esm' },
    } as any);

    const result = await scanner.scan();
    expect(result.routes.map((r) => r.pattern)).toContain('/users');
  });
});
