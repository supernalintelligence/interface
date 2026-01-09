---
id: ci-cd-monitoring
title: CI/CD Intelligent Monitoring
sidebar_label: CI/CD Monitoring
sidebar_position: 8
---

# CI/CD Intelligent Monitoring Guide

## 🚨 Problem: The Confusing CI/CD Loop

**Scenario**: Tests pass locally, pre-push hook passes, but CI fails with the same tests.

**Why This Happens**:

- **Environment Differences**: Local (Node 20+) vs CI (Node 16.20.2, 18.20.8, 20.18.0)
- **Working Directory**: Different paths between local and CI
- **Dependencies**: Subtle version differences
- **Configuration**: Missing files in CI environment

## 🛡️ Prevention Strategy

### **1. Enhanced Pre-Push Hook** ✅ IMPLEMENTED

Our `.git/hooks/pre-push` now:

- ✅ Simulates CI environment (`CI=true`, `NODE_ENV=test`)
- ✅ Tests critical failing test first
- ✅ Shows Node version differences
- ✅ Provides detailed debugging info on failure
- ✅ Validates environment configuration

### **2. Developer Tools** ✅ IMPLEMENTED

**Quick Commands**:

```bash
# Test critical test with CI environment
npm run test:critical

# Full CI environment simulation
npm run test:ci

# Manual CI environment test
CI=true NODE_ENV=test npm test
```

**CI Simulation Script**:

```bash
# Runs full CI environment simulation
bash scripts/test-ci-environment.sh
```

### **3. Before Every Push - Developer Checklist**

**ALWAYS run before pushing**:

```bash
# 1. Quick critical test
npm run test:critical

# 2. If you have time, full CI simulation
npm run test:ci

# 3. Standard tests
npm test
```

**If ANY of these fail** → **DO NOT PUSH** → Fix the issue first.

## 🔧 Common Environment Issues & Fixes

### **Node Version Differences**

**Problem**: Local Node 20+, CI uses Node 16.20.2
**Detection**: `node --version` vs CI matrix
**Fix**: Use Node features compatible with 16.20.2+

### **Path Resolution Issues**

**Problem**: Different working directories
**Detection**: `pwd` differences in logs
**Fix**: Use absolute paths or proper config files

### **Missing Configuration**

**Problem**: `supernal.yaml` not found in CI
**Detection**: Warning in pre-push hook
**Fix**: Ensure config files are committed and not in `.gitignore`

### **Dependency Differences**

**Problem**: `package-lock.json` vs `npm ci` differences
**Detection**: Different package versions
**Fix**: Use `npm ci` consistently, commit `package-lock.json`

## 🎯 How Our Prevention Works

### **Enhanced Pre-Push Hook Flow**

```bash
🎯 CI Environment Simulation...
   Local Node: v20.19.4
   CI Matrix: Node 16.20.2, 18.20.8, 20.18.0

🎯 Running critical CI test (req-052-testing-guidance)...
✅ Critical test passed with Node v20.19.4

🔍 Environment validation...
⚠️  Warning: Check for potential Node version incompatibilities

🧪 Running full test suite...
✅ All tests passed

✅ Pre-push validation complete - safe to push!
```

### **What Triggers the Safety Net**

1. **Any test failure** → Push blocked immediately
2. **Critical test failure** → Specific CI failure prevention
3. **Environment mismatch** → Warning about potential issues
4. **Missing config** → Alert about CI environment problems

## 📋 Developer Workflow

### **Standard Development**

```bash
# Make changes
git add .
git commit -m "Your changes"

# Pre-push hook automatically runs and validates
git push  # Safe if hook passes
```

### **When Hook Fails**

```bash
# Hook blocks push and shows exact error
❌ CRITICAL TEST FAILED - This exact test failed in CI!

# Debug with provided info
cat .git/logs/pre-push-tests-YYYYMMDD-HHMMSS.log

# Fix the issue
# Commit the fix
# Try pushing again
```

### **Extra Validation (Optional)**

```bash
# Before major changes
npm run test:ci

# Quick validation
npm run test:critical
```

## 🎯 Future Improvements

### **Planned Enhancements**

- [ ] **Multi-Node Testing**: Test against Node 16, 18, 20 locally if available
- [ ] **Docker CI Simulation**: Exact Ubuntu environment replication
- [ ] **Automated Fix Suggestions**: Common problem detection and fixes
- [ ] **Team Notifications**: Slack/Discord alerts for CI failures

### **Configuration Options**

- [ ] `SC_STRICT_CI_CHECK=true` - Require exact CI environment match
- [ ] `SC_SKIP_CRITICAL_TEST=true` - Skip specific test pre-check
- [ ] `SC_CI_NODE_VERSION=16.20.2` - Test against specific Node version

## 🚨 Emergency Bypass (Use Sparingly)

**When CI is broken and you need to push a fix**:

```bash
# Bypass pre-push hook (DANGEROUS)
git push --no-verify

# OR bypass via environment
SC_SKIP_PRE_PUSH=true git push
```

**⚠️ Warning**: Only use for hotfixes when CI is broken and you're fixing the CI issue itself.

## 📊 Success Metrics

**Target**: Zero CI failures caused by environment differences

**Monitoring**:

- Track CI failure rate before/after prevention measures
- Monitor pre-push hook effectiveness
- Developer adoption of `npm run test:ci`

**Expected Results**:

- 📉 **CI Failures**: Down 90%+ for environment issues
- 📈 **Developer Confidence**: No more "tests pass locally but fail in CI"
- ⚡ **Faster Iteration**: Catch issues before pushing
