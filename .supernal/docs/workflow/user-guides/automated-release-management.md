---
id: automated-release-management
title: Automated Release Management
sidebar_label: Release Automation
sidebar_position: 6
---

# Automated Release Management Guide

## Overview

The Supernal Coding system includes intelligent automated release management that handles version bumping, changelog generation, git tagging, and npm publishing automatically. This guide explains how the system works and how to use it effectively.

## 🚀 How It Works

### Automatic Detection

The system automatically triggers when you push to the `main` branch and analyzes:

1. **Significant Changes**: Commits affecting core code, tests, or package files
2. **Commit Message Patterns**: Conventional commit format for semantic versioning
3. **Version State**: Current package.json version vs. last git release tag

### Version Bump Detection Matrix

| Commit Pattern                  | Version Bump              | Example                               |
| ------------------------------- | ------------------------- | ------------------------------------- |
| `feat:` or `feature`            | **MINOR** (1.2.3 → 1.3.0) | `feat: add user authentication`       |
| `fix:` or `bug`                 | **PATCH** (1.2.3 → 1.2.4) | `fix: resolve security vulnerability` |
| `BREAKING CHANGE` or `breaking` | **MAJOR** (1.2.3 → 2.0.0) | `feat!: remove deprecated API`        |
| Other changes                   | **PATCH** (1.2.3 → 1.2.4) | `docs: update README`                 |

## 🔄 Workflow Options

### Option 1: Fully Automated (Recommended)

**Use conventional commit messages and let the system handle everything:**

```bash
# Your development workflow
git add .
git commit -m "feat: add dashboard analytics"
git push origin main

# System automatically:
# ✅ Detects "feat:" → minor version bump (1.2.3 → 1.3.0)
# ✅ Creates git tag v1.3.0
# ✅ Generates changelog from commits
# ✅ Creates GitHub release
# ✅ Publishes to npm
```

### Option 2: Manual Version Override

**When you want to control the exact version:**

```bash
# Manual version bump
npm version patch  # or minor, major
git push origin main

# System automatically:
# ✅ Detects manual version change
# ✅ Creates release for your chosen version
# ✅ Skips automatic version calculation
# ✅ Handles tagging and publishing
```

### Option 3: Mixed Workflow

**Combine both approaches as needed:**

```bash
# Some releases: let system decide
git commit -m "fix: resolve login issue"
git push origin main  # → automatic patch bump

# Other releases: manual control
npm version minor
git push origin main  # → uses your manual version
```

## 📋 Conventional Commit Examples

### Feature Additions (Minor Bump)

```bash
git commit -m "feat: add user dashboard"
git commit -m "feature: implement real-time notifications"
```

### Bug Fixes (Patch Bump)

```bash
git commit -m "fix: resolve authentication timeout"
git commit -m "bug: correct calculation error in reports"
```

### Breaking Changes (Major Bump)

```bash
git commit -m "feat!: redesign API with new authentication"
git commit -m "BREAKING CHANGE: remove support for Node 16"
```

### Other Changes (Patch Bump)

```bash
git commit -m "docs: update installation guide"
git commit -m "refactor: improve error handling"
git commit -m "test: add unit tests for dashboard"
```

## 🔍 Monitoring Releases

### Check Release Status

```bash
# View recent CI/CD status
sc monitor ci

# Detailed failure analysis if needed
sc monitor diagnose
```

### Manual Release Verification

```bash
# Check current published version
npm view supernal-coding version

# View recent GitHub releases
gh release list

# Check git tags
git tag --sort=-version:refname | head -5
```

## 🛠️ Troubleshooting

### Common Issues

#### Issue: "No significant changes detected"

```bash
# Only documentation or config files changed
# Solution: System correctly skips release - no action needed
```

#### Issue: Release created but npm publish failed

```bash
# Check authentication
npm whoami

# Manual publish if needed
npm publish
```

#### Issue: Version conflicts

```bash
# System detects existing version
# Solution: Bump version manually and push
npm version patch
git push origin main
```

### Emergency Procedures

#### Skip Automated Release

```bash
# Push without triggering release workflow
git push origin main --no-verify
```

#### Force Release for Current Version

```bash
# Manually trigger release workflow
gh workflow run release.yml
```

## 📊 Release Artifacts

Each release automatically creates:

1. **Git Tag**: `vX.Y.Z` format (e.g., `v1.2.3`)
2. **GitHub Release**: With generated changelog
3. **NPM Package**: Published to registry
4. **Changelog**: Generated from commit history

## 🔒 Security & Authentication

The release system requires:

- **GitHub Token**: Automatically provided by GitHub Actions
- **NPM Token**: Configured in repository secrets as `NPM_TOKEN`

## 🎯 Best Practices

### Commit Message Guidelines

- Use conventional commit format for automatic detection
- Be descriptive: `feat: add user authentication` not `feat: auth`
- Group related changes in single commits when possible

### Version Management

- Let the system handle versioning for most releases
- Use manual versions for special releases (hotfixes, major announcements)
- Test locally before pushing to main

### Monitoring

- Check `sc monitor ci` after pushes to main
- Investigate failures immediately with `sc monitor diagnose`
- Verify published packages periodically

## 📚 Related Documentation

- **REQ-058: Automated Release Management** - Full technical specification (see project requirements)
- **CI/CD Monitoring Guide** - Failure prevention and diagnosis (see project documentation)
- **Git Workflow Guide** - Safe merge practices (see project documentation)

---

## 🆘 Need Help?

If you encounter issues:

1. Check `sc monitor diagnose` for specific error details
2. Review recent commits for format issues
3. Verify authentication tokens are current
4. Consult the troubleshooting section above

The automated release system is designed to "just work" - if it's not working, there's usually a simple fix in the troubleshooting guide.
