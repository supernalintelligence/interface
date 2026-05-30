---
id: git-integration
title: Git Integration
sidebar_label: Git Integration
sidebar_position: 7
---

import InteractiveWorkflow from '@site/src/components/InteractiveWorkflow';

# Git Integration

## 🔄 **Live Git Workflow Status**

<InteractiveWorkflow type="git-workflow" projectData={{}} />

The Supernal Coding system provides seamless Git integration with automated branch management, commit tracking, and metadata updates to ensure complete traceability between requirements and code changes.

## 🌳 **Automated Branch Management**

### **Branch Naming Conventions**

```bash
# Feature branches for requirements
feature/req-001-user-authentication
feature/req-025-documentation-system

# Epic branches for large initiatives
epic/auth-system-implementation
epic/dashboard-system-redesign

# Hotfix branches for urgent fixes
hotfix/req-015-security-patch
hotfix/critical-login-bug

# Experiment branches
experiment/new-state-management
experiment/performance-optimization
```

### **Automated Branch Creation**

```bash
# Create branch for requirement
sc git branch REQ-001
# Creates: feature/req-001-user-authentication

# Create branch for epic
sc git branch epic auth-system
# Creates: epic/auth-system-implementation

# Create branch with custom naming
sc git branch REQ-025 --type=feature --custom-name="docs-system"
# Creates: feature/req-025-docs-system
```

## 📝 **Commit Message Standards**

### **Feature-Based Commit Format**

All commits use conventional commit format with **FEATURE name** as scope and REQ-XXX for traceability:

```bash
# Feature implementation (primary pattern - use feature name)
feat(auth): implement user login validation (REQ-001)

# Bug fix (feature name)
fix(auth): resolve login validation edge case (REQ-001)

# Test addition (feature name)
test(auth): add unit tests for login scenarios (REQ-001)

# Documentation update (feature name)
docs(cli-client): update documentation with new commands (REQ-025)

# Disambiguation (when feature name exists in multiple domains)
feat(workflow-management/planning): update workflow docs (REQ-042)
feat(dashboard-platform/planning): add planning view (REQ-043)
```

### **Scope Rules**

**IMPORTANT**: Scope should be the **FEATURE name**, not the domain:

- `feat(auth):` - Feature name (when unique)
- `feat(wip-registry):` - Feature name (when unique)
- `feat(workflow-management/planning):` - Domain/feature (ONLY when duplicate)
- `feat(workflow-management):` - Domain (ONLY for cross-feature work)
- `feat(api):` - Component (for infrastructure)

### **Automated Commit Linking**

```bash
# CLI helper for commit messages (uses feature-based format)
sc git commit smart \
  --feature auth \
  --message "Implement user registration form" \
  --req=REQ-001
# Generates: feat(auth): implement user registration form (REQ-001)

# Multi-requirement commits
sc git commit smart \
  --feature shared-utilities \
  --message "Update shared validation utilities" \
  --req=REQ-001,REQ-003
# Generates: feat(shared-utilities): update validation utilities (REQ-001, REQ-003)
```

## 🤖 **Automated Git Hooks**

### **Pre-Commit Hook**

Validates commits before they are created:

```bash
#!/bin/bash
# .git/hooks/pre-commit

# Validate commit message format
sc validate commit-message --staged

# Run requirement-specific tests for changed files
sc test affected --staged --requirements

# Update requirement file timestamps
sc update-requirements --git-staged

# Validate no broken requirement links
sc validate links --affected-only
```

### **Post-Commit Hook**

Updates metadata after successful commits:

```bash
#!/bin/bash
# .git/hooks/post-commit

# Update requirement git tracking metadata
sc update-git-metadata --last-commit

# Update requirement progress based on commit
sc update-progress --from-commit

# Generate requirement status report
sc report requirement-status --changed-only
```

### **Pre-Push Hook**

Final validation before pushing to remote:

```bash
#!/bin/bash
# .git/hooks/pre-push

# Run full test suite for affected requirements
sc test requirements --affected-by-push

# Validate requirement completeness before push
sc validate requirements --completion-check

# Generate updated documentation if needed
sc docs generate --if-changed
```

## 📊 **Git Metadata Tracking**

### **Automatic Metadata Updates**

The system automatically tracks git information in requirement files:

```yaml
git_tracking:
  previous_commit: '07f3f227f91212dc011bbf2a374294f23e5ff815'
  last_modified: '2025-07-21T18:51:46.3NZ'
  change_count: 15
  last_modified_by: 'Ian Derrington'
  branch_history:
    - 'feature/req-001-user-auth'
    - 'feature/req-001-testing'
  related_commits:
    - hash: '9d9a46c'
      message: 'REQ-001: Implement OAuth2 integration'
      date: '2025-07-20'
    - hash: 'ad426f5'
      message: 'REQ-001: Add login validation tests'
      date: '2025-07-21'
```

### **CLI Commands for Git Tracking**

```bash
# Initialize git tracking for requirement
sc init-git-tracking REQ-001

# Update git metadata manually
sc update-git-metadata REQ-001

# View git history for requirement
sc git history REQ-001 --detailed

# Generate git activity report
sc report git-activity --by-requirement
```

## 🔍 **Traceability and Linking**

### **Requirement-to-Commit Traceability**

```bash
# Find all commits for a requirement
sc git commits REQ-001

# Find requirements affected by commit
sc git requirements 9d9a46c

# View commit-to-requirement mapping
sc git traceability --visual

# Generate traceability report
sc report traceability --format=html
```

### **Branch-to-Requirement Mapping**

```bash
# View active branches and their requirements
sc git branches --with-requirements

# Check requirement coverage by branches
sc git coverage --by-requirement

# Identify orphaned branches
sc git orphans --cleanup-suggestions
```

## 🚀 **Git Workflow Automation**

### **Requirement Development Workflow**

```bash
# 1. Start work on requirement
sc start REQ-001
# - Creates feature branch
# - Updates requirement status to "in-progress"
# - Sets up git tracking

# 2. Make changes and commit
sc git commit "Implement login form validation" --req=REQ-001
# - Validates commit message format
# - Updates requirement metadata
# - Links commit to requirement

# 3. Complete requirement
sc complete REQ-001
# - Runs final validation
# - Updates requirement status to "done"
# - Prepares branch for merge

# 4. Merge to main
sc git merge REQ-001 --to=main
# - Validates all tests pass
# - Updates requirement completion status
# - Cleans up feature branch
```

### **Epic Development Workflow**

```bash
# 1. Start epic development
sc epic start auth-system
# - Creates epic branch
# - Sets up requirement tracking
# - Initializes epic metadata

# 2. Develop requirements within epic
sc start REQ-001 --epic=auth-system
# - Creates requirement branch from epic branch
# - Links requirement to epic
# - Sets up cross-requirement tracking

# 3. Merge requirements back to epic
sc merge REQ-001 --to-epic=auth-system
# - Validates requirement completion
# - Updates epic progress
# - Maintains requirement history

# 4. Complete epic
sc epic complete auth-system
# - Validates all requirements complete
# - Merges epic to main
# - Generates epic completion report
```

## 📈 **Git Metrics and Reporting**

### **Development Velocity Metrics**

```bash
# Commits per requirement
sc metrics commits --by-requirement --timeframe=sprint

# Lines of code per requirement
sc metrics loc --by-requirement --delta

# Development velocity trends
sc metrics velocity --requirements --chart

# Branch lifetime analysis
sc metrics branches --lifetime --efficiency
```

### **Quality Metrics**

```bash
# Commit message compliance
sc metrics commit-messages --compliance-rate

# Test coverage per commit
sc metrics test-coverage --by-commit --requirement=REQ-001

# Defect introduction rate
sc metrics defects --by-commit --correlation
```

### **Git Activity Reports**

```bash
# Daily activity summary
sc report git-daily --date=2025-07-21

# Weekly requirement progress
sc report git-weekly --by-requirement

# Monthly development summary
sc report git-monthly --metrics --charts

# Custom timeframe analysis
sc report git-custom --from=2025-07-01 --to=2025-07-21 --granular
```

## 🔧 **Git Hook Installation**

### **Automatic Hook Setup**

```bash
# Install all git hooks
sc git hooks install

# Install specific hooks
sc git hooks install --pre-commit --post-commit

# Update existing hooks
sc git hooks update

# Verify hook installation
sc git hooks verify
```

### **Hook Configuration**

```bash
# Configure hook behavior
sc git hooks config --pre-commit-validation=strict
sc git hooks config --post-commit-metadata=auto
sc git hooks config --pre-push-tests=affected-only

# View current hook configuration
sc git hooks config --show

# Reset hooks to default
sc git hooks config --reset
```

## 🚨 **Git Integration Best Practices**

### **Branch Management**

- **Short-Lived Branches**: Keep feature branches focused and short-lived
- **Regular Merging**: Merge completed requirements frequently
- **Clean History**: Use meaningful commit messages with requirement links
- **Branch Cleanup**: Delete merged branches promptly

### **Commit Practices**

- **Atomic Commits**: Each commit should represent a complete, working change
- **Requirement Linking**: Always link commits to requirements using REQ-XXX format
- **Descriptive Messages**: Write commit messages that explain the business value
- **Test Inclusion**: Include test updates with functional changes

### **Metadata Maintenance**

- **Automatic Updates**: Rely on git hooks for metadata updates
- **Regular Validation**: Run metadata validation commands regularly
- **Consistency Checks**: Verify requirement-to-commit links periodically
- **Backup Tracking**: Maintain git tracking metadata in version control

## 🔄 **Git Integration Troubleshooting**

### **Common Issues**

```bash
# Fix missing requirement links
sc git fix-links --scan-commits --update-requirements

# Repair git tracking metadata
sc git repair-metadata --validate --fix-timestamps

# Resolve branch conflicts
sc git resolve-conflicts --requirement=REQ-001 --strategy=merge

# Clean up orphaned branches
sc git cleanup --orphaned --older-than=30days
```

### **Validation Commands**

```bash
# Validate git integration
sc validate git --comprehensive

# Check requirement-commit consistency
sc validate git-links --fix-missing

# Verify hook functionality
sc validate git-hooks --test-run

# Generate integration health report
sc report git-health --detailed
```

## 🎯 **Next Steps**

- Explore [Task Lifecycle Management](./task-lifecycle) for complete development workflow
- Review [Agent Handoff Process](./agent-handoffs) for collaboration workflows
- Check [Architecture Overview](./architecture) for system integration patterns

---

This Git integration system ensures complete traceability between business requirements and code changes while automating routine development tasks and maintaining project consistency. The live workflow diagram above shows current branch and merge activity in real-time.
