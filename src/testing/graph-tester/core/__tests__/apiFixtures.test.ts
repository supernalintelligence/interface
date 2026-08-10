/**
 * Unit tests for the API-fixture load/write round-trip (D2). Uses a real
 * temp directory on disk (not mocked fs) -- this module's whole job is
 * filesystem I/O, so testing against a real (throwaway) directory is more
 * honest than mocking fs and risking the mock drifting from real behavior.
 */

import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs/promises';
import {
  loadApiFixtures,
  writeApiFixture,
  fixtureKey,
  type ApiFixture,
} from '../apiFixtures';

describe('fixtureKey', () => {
  it('combines an uppercased method and a pathname', () => {
    expect(fixtureKey('get', '/api/faq')).toBe('GET /api/faq');
    expect(fixtureKey('POST', '/api/demo/access')).toBe(
      'POST /api/demo/access'
    );
  });
});

describe('loadApiFixtures / writeApiFixture round-trip', () => {
  let dir: string;

  beforeEach(async () => {
    dir = await fs.mkdtemp(path.join(os.tmpdir(), 'api-fixtures-test-'));
  });

  afterEach(async () => {
    await fs.rm(dir, { recursive: true, force: true });
  });

  it('returns an empty Map for a directory that does not exist yet — never throws', async () => {
    const fixtures = await loadApiFixtures(path.join(dir, 'does-not-exist'));
    expect(fixtures.size).toBe(0);
  });

  it('writes then loads back a single fixture, exactly as written', async () => {
    const fixture: ApiFixture = {
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ items: ['a', 'b'] }),
    };
    await writeApiFixture(dir, 'GET', '/api/faq', fixture);

    const loaded = await loadApiFixtures(dir);
    expect(loaded.get(fixtureKey('GET', '/api/faq'))).toEqual(fixture);
  });

  it('handles a nested path (multiple slashes) round-trip correctly', async () => {
    const fixture: ApiFixture = {
      status: 200,
      contentType: 'text/plain',
      body: 'ok',
    };
    await writeApiFixture(dir, 'GET', '/account/api/profile/settings', fixture);

    const loaded = await loadApiFixtures(dir);
    expect(
      loaded.get(fixtureKey('GET', '/account/api/profile/settings'))
    ).toEqual(fixture);
  });

  it('distinguishes fixtures by method for the same path', async () => {
    const getFixture: ApiFixture = {
      status: 200,
      contentType: 'application/json',
      body: '{"ok":true}',
    };
    const postFixture: ApiFixture = {
      status: 201,
      contentType: 'application/json',
      body: '{"created":true}',
    };
    await writeApiFixture(dir, 'GET', '/api/faq', getFixture);
    await writeApiFixture(dir, 'POST', '/api/faq', postFixture);

    const loaded = await loadApiFixtures(dir);
    expect(loaded.get(fixtureKey('GET', '/api/faq'))).toEqual(getFixture);
    expect(loaded.get(fixtureKey('POST', '/api/faq'))).toEqual(postFixture);
    expect(loaded.size).toBe(2);
  });

  it('ignores non-JSON files in the fixtures directory', async () => {
    await writeApiFixture(dir, 'GET', '/api/faq', {
      status: 200,
      contentType: 'application/json',
      body: '{}',
    });
    await fs.writeFile(path.join(dir, 'README.md'), '# notes');

    const loaded = await loadApiFixtures(dir);
    expect(loaded.size).toBe(1);
  });
});
