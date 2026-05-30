---
id: git-smart-merge
title: Git Smart Merge Workflow
sidebar_label: Smart Merge
sidebar_position: 7
---

# Git Smart Merge Workflow Guide

## Overview

This guide describes the safe merge workflow implemented in the Supernal Coding system for merging feature branches into main with proper validation and automation.

## Quick Start

### Basic Merge Commands

```bash
# Simple merge from current branch
sc merge

# Merge specific branch
sc merge feature/req-043-security

# Full automation (push and cleanup)
sc merge --push --delete-local

# Interactive mode
sc merge -i
```

### Git-Smart Integration

```bash
# Via git-smart (same functionality)
sc git-smart merge
sc git-smart merge --branch feature/req-043-security --push --delete-local
```

## Workflow Steps

The safe merge process follows these automated steps:

### 1. **Pre-Merge Validation** 🔍

- ✅ Verify git repository status
- ✅ Check for uncommitted changes
- ✅ Validate branch exists and is accessible
- ✅ Ensure not merging from main/master

### 2. **Main Branch Update** 📥

- Switch to main branch
- Pull latest changes from remote
- Handle offline scenarios gracefully

### 3. **Rebase Operation** 🔄

- Switch back to feature branch
- Rebase feature branch on updated main
- **Pause for manual conflict resolution if needed**
- Provide clear guidance for conflict resolution

### 4. **Safe Merge** 🚀

- Switch to main branch
- Perform merge with `--no-ff` flag (preserves feature branch history)
- Maintain clean merge commit

### 5. **Post-Merge Automation** 🧹

- **Optional**: Push to remote (`--push` flag)
- **Optional**: Delete local feature branch (`--delete-local` flag)
- **Automatic**: Update requirement status if branch follows naming convention
- **Automatic**: Backup feature branch to remote before deletion

## Command Options

### Basic Options

| Option              | Description                     | Example                             |
| ------------------- | ------------------------------- | ----------------------------------- |
| `[branch]`          | Specific branch to merge        | `sc merge feature/req-043-security` |
| `--push`            | Push to remote after merge      | `sc merge --push`                   |
| `--delete-local`    | Delete local branch after merge | `sc merge --delete-local`           |
| `--quiet, -q`       | Minimize output                 | `sc merge -q`                       |
| `--interactive, -i` | Interactive prompts             | `sc merge -i`                       |

### Combined Usage

```bash
# Complete automation
sc merge feature/req-043-security --push --delete-local

# Interactive safety check
sc merge -i

# Quiet merge with cleanup
sc merge --quiet --delete-local
```

## Safety Features

### Conflict Detection & Resolution

When conflicts are detected during rebase:

```
🚨 MERGE CONFLICTS DETECTED
   Please resolve conflicts manually:
   1. Edit conflicted files
   2. git add <resolved-files>
   3. git rebase --continue
   4. Re-run merge command when rebase is complete

   To abort rebase: git rebase --abort
```

### Error Recovery

If merge fails, the system provides recovery options:

```
❌ MERGE FAILED
   Error: <specific error message>

🔧 Recovery options:
   - Fix issues and retry merge
   - git checkout main && git reset --hard HEAD~1 (if merge was completed but failed post-processing)
   - git rebase --abort (if stuck in rebase)
```

### Requirement Integration

For branches following the `feature/req-XXX-*` pattern:

- Automatically extracts requirement ID
- Updates requirement status to "implemented" after successful merge
- Links merge completion to requirement tracking

## Best Practices

### Before Merging

1. **Test thoroughly** - Ensure all tests pass
2. **Review changes** - Use `git log` or `git diff main` to review
3. **Update documentation** - Include any necessary docs
4. **Validate requirement** - Run `sc req validate XXX` if applicable

### Branch Naming Convention

Follow the standard pattern for automatic requirement tracking:

```bash
feature/req-043-description-of-work
hotfix/critical-issue-description
docs/update-description
```

### Automation Strategy

**Conservative Approach** (Manual control):

```bash
sc merge                    # Basic merge only
# Then manually: git push origin main
```

**Balanced Approach** (Backup but keep local):

```bash
sc merge --push            # Merge and push, keep local branch
```

**Full Automation** (Complete cleanup):

```bash
sc merge --push --delete-local    # Full automation
```

## Integration with Development Workflow

### With Requirements System

```bash
# Complete requirement workflow
sc git-smart branch --branch=feature/req-043-title
sc req update 043 --status=in-progress
# ... development work ...
sc req validate 043
sc merge --push --delete-local
# Requirement automatically marked as implemented
```

### With Git-Smart

```bash
# Check status before merging
sc git-smart status

# Perform merge
sc git-smart merge --push --delete-local

# Verify post-merge status
sc git-smart status
```

## Troubleshooting

### Common Issues

**Issue**: "Cannot merge from main/master branch"

```bash
# Solution: Switch to feature branch first
git checkout feature/req-043-security
sc merge
```

**Issue**: "Uncommitted changes detected"

```bash
# Solution: Commit or stash changes
git add .
git commit -m "WIP: Save current progress"
sc merge
```

**Issue**: "Feature branch does not exist"

```bash
# Solution: Check branch name
git branch -a
sc merge correct-branch-name
```

### Recovery Commands

**Undo last merge** (if not pushed):

```bash
git checkout main
git reset --hard HEAD~1
```

**Abort rebase** (if stuck in conflict resolution):

```bash
git rebase --abort
```

**Check merge status**:

```bash
sc git-smart status
```

## Advanced Usage

### Custom Merge Scripts

The merge system integrates with existing git hooks and can be extended with custom validation:

```bash
# Pre-merge custom validation
sc validate --requirements    # Validate all requirements
sc git-smart check-branch     # Validate branch compliance
```

### Batch Operations

For multiple feature branches:

```bash
# Merge multiple features (manual approach)
for branch in feature/req-043-security feature/req-044-performance; do
  sc merge $branch --push
done
```

## Related Documentation

- **Git Smart Rules** - Git safety guidelines (see project rules)
- **Git Merge Strategy** - Comprehensive merge strategy (see project rules)
- **Requirements System** - Requirement tracking integration (see project CLI documentation)
- **Development Workflow** - Overall development process (see project documentation)

---

_Last Updated: 2025-01-21_  
_Related Requirements: REQ-043 (Security), Git workflow improvements_
