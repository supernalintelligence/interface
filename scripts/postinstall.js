#!/usr/bin/env node
/**
 * Postinstall script - copies bundled skill to ~/.openclaw/skills/
 * This makes the 'si' skill discoverable by OpenClaw agents.
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

const SKILL_NAME = 'si';

function main() {
  // Skip in CI environments
  if (process.env.CI || process.env.GITHUB_ACTIONS) {
    return;
  }

  const src = path.join(__dirname, '..', 'skill');
  const dest = path.join(os.homedir(), '.openclaw', 'skills', SKILL_NAME);

  // Check if source exists
  if (!fs.existsSync(src)) {
    return; // No skill bundled, skip silently
  }

  // Check if SKILL.md exists in source
  const skillMd = path.join(src, 'SKILL.md');
  if (!fs.existsSync(skillMd)) {
    return;
  }

  try {
    // Create destination directory
    fs.mkdirSync(dest, { recursive: true });

    // Copy all files from skill/ to destination
    const files = fs.readdirSync(src);
    for (const file of files) {
      const srcFile = path.join(src, file);
      const destFile = path.join(dest, file);
      
      const stat = fs.statSync(srcFile);
      if (stat.isDirectory()) {
        // Recursively copy directories
        fs.cpSync(srcFile, destFile, { recursive: true });
      } else {
        fs.copyFileSync(srcFile, destFile);
      }
    }

    console.log(`✓ Installed ${SKILL_NAME} skill to ~/.openclaw/skills/${SKILL_NAME}`);
  } catch (err) {
    // Fail silently - skill installation is optional
    if (process.env.DEBUG) {
      console.warn(`Note: Could not install skill: ${err.message}`);
    }
  }
}

main();
