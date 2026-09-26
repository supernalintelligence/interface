#!/usr/bin/env node
/**
 * Copy the canonical si skill into skill/SKILL.md before packing.
 *
 * The one source of the si skill is families/supernal-coding/skills/si/SKILL.md.
 * skill/SKILL.md is only the copy this package ships (installed by
 * scripts/postinstall.js); it must never be edited by hand or published stale.
 * Set SI_SKILL_SOURCE to point at the canonical file when it is not found by
 * walking up from this package.
 */

const fs = require('fs');
const path = require('path');

const REL = path.join('supernal-coding', 'skills', 'si', 'SKILL.md');

function findCanonical(startDir) {
  if (process.env.SI_SKILL_SOURCE) return process.env.SI_SKILL_SOURCE;
  let dir = startDir;
  for (;;) {
    const candidate = path.join(dir, REL);
    if (fs.existsSync(candidate)) return candidate;
    const parent = path.dirname(dir);
    if (parent === dir) return null;
    dir = parent;
  }
}

const canonical = findCanonical(path.join(__dirname, '..'));
if (!canonical || !fs.existsSync(canonical)) {
  console.error(
    `sync-skill: canonical si skill not found (looked for <ancestor>/${REL}). ` +
      'Set SI_SKILL_SOURCE to families/supernal-coding/skills/si/SKILL.md.',
  );
  process.exit(1);
}

const dest = path.join(__dirname, '..', 'skill', 'SKILL.md');
fs.mkdirSync(path.dirname(dest), { recursive: true });
fs.copyFileSync(canonical, dest);
console.log(`sync-skill: skill/SKILL.md <- ${canonical}`);
