/**
 * @jest-environment node
 */
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { installSkill } = require('../../scripts/postinstall.js');

const OLD = '# si\n\nold bundled copy\n';
const NEW = '# si\n\n## Journey graph\n\nnewer repo copy\n';

describe('si postinstall skill copy', () => {
  let root: string;
  let home: string;
  let src: string;

  beforeEach(() => {
    root = fs.mkdtempSync(path.join(os.tmpdir(), 'si-postinstall-'));
    home = path.join(root, 'home');
    src = path.join(root, 'pkg', 'skill');
    fs.mkdirSync(home, { recursive: true });
    fs.mkdirSync(src, { recursive: true });
    fs.writeFileSync(path.join(src, 'SKILL.md'), OLD);
  });

  afterEach(() => {
    fs.rmSync(root, { recursive: true, force: true });
  });

  it('never writes through a symlinked ~/.openclaw/skills into the repo checkout', () => {
    const repoSkills = path.join(root, 'repo', 'skills');
    fs.mkdirSync(path.join(repoSkills, 'si'), { recursive: true });
    const repoFile = path.join(repoSkills, 'si', 'SKILL.md');
    fs.writeFileSync(repoFile, NEW);
    fs.mkdirSync(path.join(home, '.openclaw'));
    fs.symlinkSync(repoSkills, path.join(home, '.openclaw', 'skills'));
    const inode = fs.statSync(repoFile).ino;

    const result = installSkill({ src, home });

    expect(result.action).toBe('skipped');
    expect(fs.readFileSync(repoFile, 'utf-8')).toBe(NEW);
    expect(fs.statSync(repoFile).ino).toBe(inode);
    expect(fs.existsSync(path.join(repoSkills, 'si', '.bundled-sha256'))).toBe(false);
  });

  it('never overwrites a SKILL.md it did not write', () => {
    const dest = path.join(home, '.openclaw', 'skills', 'si');
    fs.mkdirSync(dest, { recursive: true });
    fs.writeFileSync(path.join(dest, 'SKILL.md'), NEW);

    expect(installSkill({ src, home }).action).toBe('skipped');
    expect(fs.readFileSync(path.join(dest, 'SKILL.md'), 'utf-8')).toBe(NEW);
  });

  it('installs on a fresh machine and refreshes its own untouched copy on upgrade', () => {
    const destMd = path.join(home, '.openclaw', 'skills', 'si', 'SKILL.md');
    expect(installSkill({ src, home }).action).toBe('installed');
    expect(fs.readFileSync(destMd, 'utf-8')).toBe(OLD);

    fs.writeFileSync(path.join(src, 'SKILL.md'), NEW);
    expect(installSkill({ src, home }).action).toBe('updated');
    expect(fs.readFileSync(destMd, 'utf-8')).toBe(NEW);
    expect(installSkill({ src, home }).action).toBe('unchanged');
  });
});
