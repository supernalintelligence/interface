#!/usr/bin/env node
/**
 * si-upgrade - Upgrade from open-source to enterprise
 *
 * Handles:
 * 1. GitHub authentication check
 * 2. npm registry configuration for @supernalintelligence scope
 * 3. Enterprise package installation
 * 4. Claude Code setup
 *
 * Usage:
 *   npx @supernal/interface upgrade
 *   # or if installed globally:
 *   si-oss upgrade
 */

import { execSync, spawnSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

const ENTERPRISE_PACKAGE = '@supernalintelligence/interface-enterprise';
const REGISTRY = 'https://npm.pkg.github.com';

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function print(message: string) {
  console.log(message);
}

function printHeader(message: string) {
  print(`\n${colors.bold}${colors.cyan}${message}${colors.reset}\n`);
}

function printSuccess(message: string) {
  print(`${colors.green}✓${colors.reset} ${message}`);
}

function printError(message: string) {
  print(`${colors.red}✗${colors.reset} ${message}`);
}

function printWarning(message: string) {
  print(`${colors.yellow}⚠${colors.reset} ${message}`);
}

function printInfo(message: string) {
  print(`${colors.blue}→${colors.reset} ${message}`);
}

function commandExists(cmd: string): boolean {
  try {
    execSync(`which ${cmd}`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function runCommand(cmd: string, silent = false): { success: boolean; output: string } {
  try {
    const output = execSync(cmd, {
      encoding: 'utf-8',
      stdio: silent ? 'pipe' : 'inherit',
    });
    return { success: true, output: output || '' };
  } catch (error: any) {
    return { success: false, output: error.message || '' };
  }
}

async function prompt(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function checkGitHubAuth(): Promise<boolean> {
  printInfo('Checking GitHub authentication...');

  if (!commandExists('gh')) {
    printWarning('GitHub CLI (gh) not found.');
    print('');
    print('  Install it:');
    print('    macOS:   brew install gh');
    print('    Windows: winget install GitHub.cli');
    print('    Linux:   https://cli.github.com/manual/installation');
    print('');
    return false;
  }

  const result = runCommand('gh auth status', true);
  if (result.success) {
    printSuccess('GitHub CLI authenticated');
    return true;
  }

  printWarning('GitHub CLI not authenticated');
  print('');
  const answer = await prompt('Would you like to authenticate now? (y/n): ');

  if (answer.toLowerCase() === 'y') {
    printInfo('Starting GitHub authentication...');
    const authResult = spawnSync('gh', ['auth', 'login'], {
      stdio: 'inherit',
    });

    if (authResult.status === 0) {
      printSuccess('GitHub authentication successful');
      return true;
    } else {
      printError('GitHub authentication failed');
      return false;
    }
  }

  return false;
}

async function configureNpmRegistry(): Promise<boolean> {
  printInfo('Configuring npm for GitHub Packages...');

  // Check if already configured
  try {
    const npmrc = fs.readFileSync(path.join(process.env.HOME || '', '.npmrc'), 'utf-8');
    if (npmrc.includes('@supernalintelligence:registry=')) {
      printSuccess('npm already configured for @supernalintelligence');
      return true;
    }
  } catch {
    // .npmrc doesn't exist, we'll create it
  }

  // Get GitHub token
  let token = '';
  try {
    token = execSync('gh auth token', { encoding: 'utf-8' }).trim();
  } catch {
    printError('Could not get GitHub token. Please run: gh auth login');
    return false;
  }

  // Configure npm
  const npmrcPath = path.join(process.env.HOME || '', '.npmrc');
  const npmrcContent = `
//npm.pkg.github.com/:_authToken=${token}
@supernalintelligence:registry=${REGISTRY}
`.trim();

  try {
    let existingContent = '';
    try {
      existingContent = fs.readFileSync(npmrcPath, 'utf-8');
    } catch {
      // File doesn't exist
    }

    // Append if not already present
    if (!existingContent.includes('@supernalintelligence:registry=')) {
      fs.appendFileSync(npmrcPath, '\n' + npmrcContent + '\n');
      printSuccess('npm configured for GitHub Packages');
    }
    return true;
  } catch (error: any) {
    printError(`Failed to configure npm: ${error.message}`);
    return false;
  }
}

async function installEnterprise(): Promise<boolean> {
  printInfo(`Installing ${ENTERPRISE_PACKAGE}...`);

  const result = spawnSync('npm', ['install', '-D', ENTERPRISE_PACKAGE], {
    stdio: 'inherit',
  });

  if (result.status === 0) {
    printSuccess('Enterprise package installed');
    return true;
  } else {
    printError('Failed to install enterprise package');
    return false;
  }
}

async function runSetup(): Promise<void> {
  printInfo('Running enterprise setup...');

  // Run si setup-claude
  const setupResult = spawnSync('npx', ['si', 'setup-claude', '--force'], {
    stdio: 'inherit',
  });

  if (setupResult.status === 0) {
    printSuccess('Claude Code skills and agents installed');
  } else {
    printWarning('Claude Code setup had issues (you can run it manually later)');
  }
}

async function main() {
  print('');
  print(`${colors.bold}${colors.cyan}╔════════════════════════════════════════════════════════════╗${colors.reset}`);
  print(`${colors.bold}${colors.cyan}║       Supernal Interface - Upgrade to Enterprise           ║${colors.reset}`);
  print(`${colors.bold}${colors.cyan}╚════════════════════════════════════════════════════════════╝${colors.reset}`);
  print('');

  print('This will upgrade your project from the free open-source package');
  print('to the full enterprise edition with:');
  print('');
  print(`  ${colors.green}+${colors.reset} 15 CLI commands (si init, si validate, etc.)`);
  print(`  ${colors.green}+${colors.reset} 12 Claude Code skills`);
  print(`  ${colors.green}+${colors.reset} 3 specialized AI agents`);
  print(`  ${colors.green}+${colors.reset} Story System (6,000x faster E2E tests)`);
  print(`  ${colors.green}+${colors.reset} Auto-generated tests from Gherkin and @Tool`);
  print(`  ${colors.green}+${colors.reset} Navigation graph validation`);
  print('');

  const proceed = await prompt('Continue with upgrade? (y/n): ');
  if (proceed.toLowerCase() !== 'y') {
    print('Upgrade cancelled.');
    process.exit(0);
  }

  // Step 1: Check GitHub auth
  printHeader('Step 1/4: GitHub Authentication');
  const authOk = await checkGitHubAuth();
  if (!authOk) {
    printError('GitHub authentication required for enterprise package.');
    print('');
    print('Run this command to authenticate:');
    print('  gh auth login');
    print('');
    print('Then run the upgrade again.');
    process.exit(1);
  }

  // Step 2: Configure npm registry
  printHeader('Step 2/4: Configure npm Registry');
  const npmOk = await configureNpmRegistry();
  if (!npmOk) {
    printError('Failed to configure npm for GitHub Packages.');
    process.exit(1);
  }

  // Step 3: Install enterprise package
  printHeader('Step 3/4: Install Enterprise Package');
  const installOk = await installEnterprise();
  if (!installOk) {
    printError('Failed to install enterprise package.');
    print('');
    print('You can try manually:');
    print(`  npm install -D ${ENTERPRISE_PACKAGE}`);
    process.exit(1);
  }

  // Step 4: Run setup
  printHeader('Step 4/4: Setup Claude Code Integration');
  await runSetup();

  // Done!
  printHeader('Upgrade Complete!');
  print('Your project now has the full enterprise edition.');
  print('');
  print(`${colors.bold}Available commands:${colors.reset}`);
  print('  npx si --help              Show all CLI commands');
  print('  npx si init .              Initialize contracts');
  print('  npx si validate --all      Validate everything');
  print('  npx si generate-tests      Generate tests');
  print('');
  print(`${colors.bold}Claude Code skills:${colors.reset}`);
  print('  /si-init, /si-validate, /si-generate-tests, and 9 more');
  print('');
  print(`${colors.bold}Next steps:${colors.reset}`);
  print('  1. Run: npx si init . --output src/architecture');
  print('  2. Run: npx si validate --all');
  print('');
}

// Run
main().catch((error) => {
  printError(`Upgrade failed: ${error.message}`);
  process.exit(1);
});
