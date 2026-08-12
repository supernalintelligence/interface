import { RouteContractGenerator } from '../RouteContractGenerator';
import type { RouteInfo, RouteScanResult } from '../scanners/RouteScanner';

function scanResult(routes: RouteInfo[]): RouteScanResult {
  return {
    routes,
    metadata: {
      timestamp: '2026-01-01T00:00:00.000Z',
      scannedPaths: [],
      routingSystem: 'test',
    },
  };
}

const apiRoute: RouteInfo = {
  id: 'api-Users',
  pattern: '/api/users',
  params: [],
  metadata: { category: 'api', source: 'file-structure', methods: ['GET'] },
};

const viewRoute: RouteInfo = {
  id: 'view-overview',
  pattern: '/:repo/:branch/overview',
  params: ['repo', 'branch'],
  metadata: { category: 'view', source: 'VALID_VIEWS' },
};

describe('RouteContractGenerator — wrapper validity across empty sections', () => {
  it('emits a single valid Routes wrapper when only API routes are present (zero views)', () => {
    const content = new RouteContractGenerator().generate(
      scanResult([apiRoute])
    );

    // Exactly one opening and one closing of the wrapper — not zero (dropped
    // entirely, the pre-fix bug when views is empty) and not duplicated.
    expect((content.match(/export const Routes = \{/g) || []).length).toBe(1);
    expect((content.match(/\} as const;/g) || []).length).toBe(1);
    expect(content).toContain('API: {');
    expect(content).toContain("pattern: '/api/users'");
    // The API block must be nested INSIDE the Routes wrapper, not standing
    // alone as a bare object literal (invalid syntax).
    const wrapperStart = content.indexOf('export const Routes = {');
    const apiStart = content.indexOf('API: {');
    const wrapperEnd = content.indexOf('} as const;');
    expect(apiStart).toBeGreaterThan(wrapperStart);
    expect(apiStart).toBeLessThan(wrapperEnd);
  });

  it('emits a single valid Routes wrapper when only view routes are present (zero API routes)', () => {
    const content = new RouteContractGenerator().generate(
      scanResult([viewRoute])
    );

    expect((content.match(/export const Routes = \{/g) || []).length).toBe(1);
    expect((content.match(/\} as const;/g) || []).length).toBe(1);
    expect(content).toContain('Views: {');
  });

  it('emits a single valid Routes wrapper when both sections are present', () => {
    const content = new RouteContractGenerator().generate(
      scanResult([viewRoute, apiRoute])
    );

    expect((content.match(/export const Routes = \{/g) || []).length).toBe(1);
    expect((content.match(/\} as const;/g) || []).length).toBe(1);
    expect(content).toContain('Views: {');
    expect(content).toContain('API: {');
  });

  it('produces syntactically parseable output for the zero-views case (regression guard)', () => {
    const content = new RouteContractGenerator().generate(
      scanResult([apiRoute])
    );
    // A minimal structural check standing in for a real TS parse: every
    // opening brace in the Routes object must have a matching close before
    // `} as const;` — catches the exact pre-fix failure (an unopened/
    // unclosed object literal) without pulling in a full TS compiler.
    const body = content.slice(
      content.indexOf('export const Routes = {') +
        'export const Routes = {'.length,
      content.indexOf('} as const;')
    );
    let depth = 0;
    for (const ch of body) {
      if (ch === '{') depth++;
      if (ch === '}') depth--;
      expect(depth).toBeGreaterThanOrEqual(0);
    }
    expect(depth).toBe(0);
  });
});

describe('RouteContractGenerator — name collisions across path shapes', () => {
  it('disambiguates two different routes that PascalCase to the same name', () => {
    // A hyphenated single segment and a nested directory pair can both
    // collapse to 'ChatSessions' — a real, observed case in
    // apps/supernal-dashboard: /api/chat/sessions vs /api/chat-sessions.
    const nested: RouteInfo = {
      id: 'api-ChatSessions',
      pattern: '/api/chat/sessions',
      params: [],
      metadata: { category: 'api', source: 'file-structure', methods: ['GET'] },
    };
    const hyphenated: RouteInfo = {
      id: 'api-Chat-sessions',
      pattern: '/api/chat-sessions',
      params: [],
      metadata: {
        category: 'api',
        source: 'file-structure',
        methods: ['GET', 'POST'],
      },
    };

    const content = new RouteContractGenerator().generate(
      scanResult([nested, hyphenated])
    );

    // Both real patterns must be present, and no duplicate key — a
    // duplicate object key is a TypeScript compile error (TS1117), not a
    // warning, so a collision anywhere makes the WHOLE file unusable.
    expect(content).toContain("pattern: '/api/chat/sessions'");
    expect(content).toContain("pattern: '/api/chat-sessions'");
    expect(content).toContain('ChatSessions:');
    expect(content).toContain('ChatSessions_2:');

    const body = content.slice(
      content.indexOf('export const Routes = {') +
        'export const Routes = {'.length,
      content.indexOf('} as const;')
    );
    let depth = 0;
    for (const ch of body) {
      if (ch === '{') depth++;
      if (ch === '}') depth--;
    }
    expect(depth).toBe(0);
  });

  it('leaves non-colliding names untouched', () => {
    const content = new RouteContractGenerator().generate(
      scanResult([apiRoute])
    );
    expect(content).toContain('Users:');
    expect(content).not.toContain('Users_2:');
  });
});
