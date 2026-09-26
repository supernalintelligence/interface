#!/usr/bin/env node
/**
 * Postinstall script - copies the bundled skill to ~/.openclaw/skills/si/
 * so the 'si' skill is discoverable by OpenClaw agents.
 *
 * It never overwrites content it did not write itself:
 * - If ~/.openclaw/skills (or any part of the destination path) is a symlink,
 *   the skill already comes from a checkout (the dev setup links
 *   ~/.openclaw/skills to families/supernal-coding/skills). Writing through
 *   the link would replace the repo's SKILL.md with this package's copy.
 * - An existing SKILL.md is replaced only when it is byte-identical to what a
 *   previous install of this package wrote (recorded in .bundled-sha256), so
 *   a package upgrade still refreshes it but a newer or hand-edited copy is
 *   left alone.
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');

const SKILL_NAME = 'si';
const MARKER = '.bundled-sha256';

function sha256(buf) {
  return crypto.createHash('sha256').update(buf).digest('hex');
}

/** First symlinked component of `rel` under `base`, or null. */
function findSymlink(base, rel) {
  let current = base;
  for (const part of rel.split(path.sep)) {
    current = path.join(current, part);
    const stat = fs.lstatSync(current, { throwIfNoEntry: false });
    if (!stat) return null;
    if (stat.isSymbolicLink()) return current;
  }
  return null;
}

/**
 * Install the bundled skill. Returns { action, reason } where action is
 * 'installed' | 'updated' | 'unchanged' | 'skipped'.
 */
function installSkill({ src, home }) {
  const skillMd = path.join(src, 'SKILL.md');
  if (!fs.existsSync(skillMd)) {
    return { action: 'skipped', reason: 'no bundled SKILL.md' };
  }

  const rel = path.join('.openclaw', 'skills', SKILL_NAME);
  const dest = path.join(home, rel);

  const link = findSymlink(home, rel);
  if (link) {
    return {
      action: 'skipped',
      reason: `${link} is a symlink to ${fs.realpathSync(link)}; that checkout is the source of the skill`,
    };
  }

  const bundled = fs.readFileSync(skillMd);
  const bundledHash = sha256(bundled);
  const destMd = path.join(dest, 'SKILL.md');
  const markerPath = path.join(dest, MARKER);

  let action = 'installed';
  if (fs.existsSync(destMd)) {
    const currentHash = sha256(fs.readFileSync(destMd));
    if (currentHash === bundledHash) {
      return { action: 'unchanged', reason: 'already current' };
    }
    const recorded = fs.existsSync(markerPath)
      ? fs.readFileSync(markerPath, 'utf-8').trim()
      : null;
    if (recorded !== currentHash) {
      return {
        action: 'skipped',
        reason: `${destMd} was not written by this package (or was edited since); left untouched`,
      };
    }
    action = 'updated';
  }

  fs.mkdirSync(dest, { recursive: true });
  for (const file of fs.readdirSync(src)) {
    const srcFile = path.join(src, file);
    const destFile = path.join(dest, file);
    if (fs.statSync(srcFile).isDirectory()) {
      fs.cpSync(srcFile, destFile, { recursive: true });
    } else {
      fs.copyFileSync(srcFile, destFile);
    }
  }
  fs.writeFileSync(markerPath, `${bundledHash}\n`);
  return { action, reason: destMd };
}

function main() {
  if (process.env.CI || process.env.GITHUB_ACTIONS) return;

  try {
    const result = installSkill({
      src: path.join(__dirname, '..', 'skill'),
      home: os.homedir(),
    });
    if (result.action === 'installed' || result.action === 'updated') {
      console.log(
        `✓ ${result.action} ${SKILL_NAME} skill at ~/.openclaw/skills/${SKILL_NAME}`
      );
    } else if (result.action === 'skipped') {
      console.log(`${SKILL_NAME} skill not installed: ${result.reason}`);
    }
  } catch (err) {
    // A failed skill copy must not fail the package install; say why.
    console.warn(`${SKILL_NAME} skill not installed: ${err.message}`);
  }
}

if (require.main === module) {
  main();
}

module.exports = { installSkill };
