# Git Hooks & Workflow Comprehensive Guide

[![Git Safety](https://img.shields.io/badge/git-safety%20hooks-brightgreen)](https://code.supernal.ai/docs/git-hooks)
[![Pre-commit](https://img.shields.io/badge/pre--commit-type%20checking-blue)](https://code.supernal.ai/docs/git-hooks#pre-commit)
[![Pre-push](https://img.shields.io/badge/pre--push-test%20validation-orange)](https://code.supernal.ai/docs/git-hooks#pre-push)

**Complete guide to Supernal Coding's git hooks, workflows, and safety features.**

## 🎯 Quick Overview

Supernal Coding provides **three main git hooks** that ensure code quality and workflow safety:

| Hook           | Purpose             | What It Does                                                                                        | Bypass Method            |
| -------------- | ------------------- | --------------------------------------------------------------------------------------------------- | ------------------------ |
| **Pre-commit** | Code Quality        | Date validation, documentation organization, type duplication checking, branch protection, CLI sync | `git commit --no-verify` |
| **Pre-push**   | Test Validation     | Full test suite, date validation, documentation organization, build validation, final checks        | `git push --no-verify`   |
| **Git Safety** | Workflow Protection | Main/master branch protection, naming conventions                                                   | `git commit --no-verify` |

## 🚀 Installation

### Automatic Installation (Recommended)

```bash
# Install all git hooks
sc git-hooks install

# Install specific hooks
sc git-hooks install pre-commit
sc git-hooks install pre-push
sc git-hooks install all
```

### Manual Installation

```bash
# Install pre-commit hooks
bash archive/2025-08-08/cli-commands/git/git-hooks-scripts/setup-pre-commit-hooks.sh

# Install pre-push hooks
bash archive/2025-08-08/cli-commands/git/git-hooks-scripts/setup-pre-push-hooks.sh

# Install git safety hooks
bash archive/2025-08-08/cli-commands/git/git-hooks-scripts/install-git-hooks.sh
```

### Verification

```bash
# Check hook installation status
sc git-hooks status

# List installed hooks
ls -la .git/hooks/
```

## 🔍 Pre-Commit Hook Details

### **What It Does:**

1. **Date Validation**: Detects hardcoded dates that don't match actual file dates
2. **Branch Protection**: Prevents direct commits to `main`/`master`
3. **Type Duplication Checking**: Scans for duplicate TypeScript/JavaScript types
4. **CLI Documentation Sync**: Updates agent rules with latest CLI commands
5. **Branch Naming Validation**: Suggests proper naming conventions

### **Implementation:**

```bash
# Location: .git/hooks/pre-commit
#!/bin/bash
# Supernal Coding Git Safety Hook

# Prevent commits to main/master
if [[ "$branch" == "main" || "$branch" == "master" ]]; then
    echo "❌ Direct commits to '$branch' are not allowed!"
    exit 1
fi

# Check branch naming convention
if [[ "$branch" =~ ^feature/ ]]; then
    echo "✅ Working on feature branch: $branch"
else
    echo "⚠️  Branch '$branch' doesn't follow recommended naming"
fi

# Run type duplication checker
if [ -f "scripts/check-type-duplicates.cjs" ]; then
    node scripts/check-type-duplicates.cjs
fi

# Sync CLI documentation
if [ -f "supernal-code-package/lib/cli/commands/sync/sync-cli-in-rules.js" ]; then
    node supernal-code-package/lib/cli/commands/sync/sync-cli-in-rules.js
fi
```

### **Branch Naming Conventions:**

```bash
# ✅ Recommended patterns:
feature/req-001-user-authentication
feature/dashboard-improvements
hotfix/critical-security-patch
bugfix/login-form-validation
docs/api-documentation-update
test/integration-test-coverage

# ⚠️  Allowed but not recommended:
develop
staging
my-feature

# ❌ Blocked patterns:
main
master
```

## 📁 Documentation Organization System

**Purpose**: Enforces proper documentation organization and prevents documentation sprawl by validating file locations against whitelisted directories.

**What It Detects**:

- Documentation files in non-whitelisted directories
- Files that should be moved to appropriate locations
- Temporary documentation that has exceeded age limits
- Missing frontmatter markers for exceptional cases

**Whitelisted Directories** (configurable):

- `docs/**` - Main documentation directory
- `documentation/**` - Alternative documentation directory
- `*.md` - Root level markdown files (README, CHANGELOG, etc.)
- `supernal-coding/**/*.md` - Project-specific documentation
- `templates/**/*.md` - Template documentation
- `archive/**/*.md` - Archived documentation
- `temp-docs/**` - Temporary documentation (with age limits)
- `reports/**` - Generated reports

**Allow Markers** (for exceptions):

- `#sc-allow-non-appropriate-position` - Comment marker
- `sc-allow-non-appropriate-position: true` - YAML frontmatter
- `#sc-temporary-doc` - For temporary documentation
- `#sc-scratch` - For scratch/working files

**Validation Process**:

1. Scans all `.md`, `.mdx`, `.rst` files in the project
2. Checks if each file is in a whitelisted directory
3. Parses frontmatter for allow markers
4. Validates temporary documentation age limits
5. Provides fix suggestions for non-compliant files

**Manual Usage**:

```bash
# Validate all documentation
sc doc-validate

# Validate specific file
sc doc-validate --file=README.md

# Show what would be fixed (dry run)
sc doc-validate --dry-run

# Interactive fixes
sc doc-validate --fix

# Verbose output
sc doc-validate --verbose
```

**Bypass Options**:

- `SC_SKIP_DOC_VALIDATION=true git commit ...`
- `git commit --no-verify` (bypasses all hooks)

**Example Output**:

```
❌ reports/analysis/my-analysis.md
   Documentation file in non-whitelisted directory

💡 Suggestions:
  move_to_docs: Move to appropriate documentation directory
    # Move to docs directory:
    mkdir -p docs/
    mv "reports/analysis/my-analysis.md" docs/my-analysis.md

  add_allow_marker: Add frontmatter to allow current location
    # Add to top of file:
    ---
    sc-allow-non-appropriate-position: true
    reason: "Analysis report that belongs with generated reports"
    ---
```

## 📅 Date Validation System

### **Purpose**

The date validation system prevents "hallucinated" timestamps in documentation by ensuring that hardcoded dates in files match their actual creation or modification dates from git history. Additionally, it enforces **ISO 8601 UTC format standardization** to eliminate timezone ambiguity and ensure regulatory compliance.

### **What It Detects & Standardizes**

The system scans for date patterns and enforces **ISO 8601 UTC format** (`YYYY-MM-DDTHH:MM:SS.sssZ`):

**✅ Standard Formats (Compliant):**

- `2024-11-03T14:30:45.123Z` - ISO 8601 UTC (score: 10/10)
- `2024-11-03T14:30:45Z` - ISO 8601 UTC without milliseconds (score: 10/10)

**⚠️ Problematic Formats (Standardized):**

- `2024-11-03` - Date-only (score: 6/10)
- `11/03/2024` - US format (score: 3/10)
- `03.11.2024` - European format (score: 3/10)
- `November 3, 2024` - Human readable (score: 4/10)
- `1699024245` - Unix timestamp (score: 2/10)

**Detection Sources:**

- **YAML frontmatter**: `created`, `updated`, `createdAt`, `updatedAt`, `date`, `modified`
- **JSON fields**: `"createdAt"`, `"created"`, `"updatedAt"`, `"updated"`, `"publishedAt"`
- **Markdown patterns**: `created: DATE`, `updated: DATE`, `Last updated: DATE`
- **Standalone dates**: Any date format found in content

### **Validation Process**

1. **Extract dates** from staged markdown and JSON files using comprehensive pattern matching
2. **Categorize formats** and assign compliance scores (1-10)
3. **Get actual dates** from git history and filesystem
4. **Validate both date accuracy** (24-hour tolerance) **and format compliance**
5. **Generate standardized fixes** using ISO 8601 UTC format
6. **Report issues** with format upgrade explanations

### **Manual Usage**

```bash
# Validate all files
sc date-validate

# Validate specific file
sc date-validate --file=README.md

# Fix all issues automatically
sc date-validate --fix

# Preview fixes without applying
sc date-validate --dry-run --fix

# Verbose output
sc date-validate --verbose
```

### **Bypass Options**

```bash
# Skip date validation for single commit
SC_SKIP_DATE_VALIDATION=true git commit

# Skip all pre-commit validation
git commit --no-verify
```

### **Example Output**

```bash
📊 Date Validation & Format Standardization Report
==================================================

Total files: 15
✅ Valid (date + format): 8
❌ Invalid: 7
⚠️  Errors: 0

📊 Issue Breakdown:
  🎯 Format standardization needed: 4
  📅 Date correction needed: 2
  🔄 Both format + date issues: 1

🔧 Detailed Issues:

📄 README.md:
  📍 created: "2024-01-01" (line 5)
     Format: ❌ Non-standard (date_only, score: 6/10)
     Issue: Non-standard date format (date_only, score: 6/10); Date does not match any actual file dates
     🔧 Fix: 2024-03-15T10:30:45.123Z
     📝 Standardizing to ISO 8601 UTC format and correcting date to match file history

  📍 updated: "11/03/2024" (line 6)
     Format: ❌ Non-standard (us_format, score: 3/10)
     Issue: Non-standard date format (us_format, score: 3/10)
     🔧 Fix: 2024-11-03T14:22:10.456Z
     📝 Upgrading from us_format to ISO 8601 UTC standard for unambiguous timezone handling

🎯 Standardization Benefits:
  • ISO 8601 UTC format eliminates timezone ambiguity
  • Sortable and parseable by all systems
  • Internationally regulated standard (ISO 8601)
  • Prevents date interpretation errors

🚀 Quick fix all issues:
sc date-validate --fix
This will standardize all dates to ISO 8601 UTC format
```

## 🧪 Pre-Push Hook Details

### **What It Does:**

1. **Full Test Suite**: Runs `npm test` and blocks push if tests fail
2. **Date Validation**: Validates document dates using `sc date-validate --max-files=50`
3. **Type Duplication Check**: Final scan for type duplications (warning only)
4. **Build Validation**: Runs `npm run build` if build script exists
5. **Branch Status Display**: Shows current branch and validation progress

### **Implementation:**

```bash
# Location: .git/hooks/pre-push
#!/bin/bash
# Supernal Coding Pre-Push Safety Hook

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "🚀 SUPERNAL CODING: Pre-push validation starting..."

# Get current branch
branch=$(git branch --show-current)
echo "${BLUE}📋 Current branch: $branch${NC}"

# Check for skip environment variable
if [ "${SC_SKIP_PRE_PUSH}" = "true" ]; then
    echo "${YELLOW}⚠️  Pre-push validation skipped${NC}"
    exit 0
fi

# Run full test suite
echo "${BLUE}🧪 Running test suite...${NC}"
if npm test; then
    echo "${GREEN}✅ All tests passed${NC}"
else
    echo "${RED}❌ TESTS FAILED - Push blocked!${NC}"
    exit 1
fi

# Optional: Type duplication check (warning only)
if [ -f "scripts/check-type-duplicates.cjs" ]; then
    echo "${BLUE}🔍 Checking for type duplications...${NC}"
    if node scripts/check-type-duplicates.cjs; then
        echo "${GREEN}✅ No type duplications found${NC}"
    else
        echo "${YELLOW}⚠️  Type duplications detected (warning only)${NC}"
    fi
fi

# Optional: Build validation
if npm run --silent build > /dev/null 2>&1; then
    echo "${BLUE}🏗️  Validating build...${NC}"
    if npm run build; then
        echo "${GREEN}✅ Build validated successfully${NC}"
    else
        echo "${YELLOW}⚠️  Build validation failed${NC}"
    fi
fi

echo "${GREEN}✅ Pre-push validation complete. Push allowed.${NC}"
```

### **Test Integration:**

- **Runs full test suite**: All 285+ tests must pass
- **Blocks on failures**: Push prevented if any test fails
- **Shows detailed output**: Clear feedback on what failed
- **Respects test configuration**: Uses project's Jest/test setup

## 🔒 Git Safety Hook Details

### **What It Does:**

1. **Main Branch Protection**: Absolute prevention of direct commits to main/master
2. **Educational Messaging**: Guides users toward proper workflow
3. **Emergency Bypass Information**: Shows how to bypass safely when needed

### **Common Scenarios:**

#### **✅ Proper Workflow:**

```bash
# 1. Create feature branch
git checkout -b feature/req-001-user-auth

# 2. Make changes and commit
git add src/auth.js
git commit -m "REQ-001: Implement JWT authentication"

# 3. Push feature branch
git push origin feature/req-001-user-auth

# 4. Create PR/merge request
# (Merge happens via GitHub/GitLab interface)
```

#### **❌ Blocked Actions:**

```bash
# Direct commits to main
git checkout main
git commit -m "Quick fix"  # ❌ BLOCKED

# Response:
# ❌ SUPERNAL CODING: Direct commits to 'main' are not allowed!
# 🚀 To work safely:
#    1. Create a feature branch: git checkout -b feature/req-XXX-description
#    2. Or work on existing branch: git checkout feature/your-branch-name
```

## 🚨 Emergency Bypass Methods

### **When to Use Bypasses:**

- **Critical hotfixes** requiring immediate main branch commits
- **CI/CD system commits** from automated processes
- **Repository maintenance** (initial setup, config changes)
- **Hook malfunction** preventing legitimate commits

### **Bypass Commands:**

#### **Pre-commit Bypass:**

```bash
# Skip pre-commit hook (use sparingly)
git commit --no-verify -m "Emergency hotfix"

# Reasons you might need this:
# - Type checker false positive
# - Urgent security patch
# - Hook script malfunction
```

#### **Pre-push Bypass:**

```bash
# Skip pre-push hook (use with extreme caution)
git push --no-verify

# Alternative: Environment variable bypass
SC_SKIP_PRE_PUSH=true git push

# Reasons you might need this:
# - Test infrastructure failure
# - Emergency deployment
# - Test false positives
```

#### **Complete Hook Bypass:**

```bash
# Skip ALL git hooks (nuclear option)
git -c core.hooksPath=/dev/null commit -m "Emergency commit"
git -c core.hooksPath=/dev/null push
```

### **⚠️ Bypass Safety Guidelines:**

1. **Document the reason** in commit message
2. **Fix the underlying issue** immediately after bypass
3. **Re-run validations** manually when possible
4. **Inform team members** about bypass usage
5. **Review bypass commits** in next team meeting

## 🔧 Type Duplication Integration

### **How It Works:**

The type duplication checker is deeply integrated into our git workflow:

1. **Pre-commit**: Blocks commits that introduce duplications
2. **Pre-push**: Final warning check (non-blocking)
3. **CLI Command**: `sc type-check` for manual checking

### **Configuration:**

```yaml
# supernal.yaml
[type_duplication]
enabled = true
scan_directories = ["src", "lib", "types"]
exclude_directories = ["node_modules", "dist", "build"]
pre_commit_hook = true
block_commits_on_duplications = true
allow_force_commits = true
ignore_auto_generated = true
```

### **Manual Usage:**

```bash
# Check for type duplications
sc type-check

# Check specific directories
sc type-check --scan src,lib

# Generate report
sc type-check --report

# Fix duplications automatically (future)
sc type-check --fix
```

## 🛠️ Troubleshooting

### **Common Issues:**

#### **Hook Not Running:**

```bash
# Check if hooks are executable
ls -la .git/hooks/
chmod +x .git/hooks/pre-commit
chmod +x .git/hooks/pre-push

# Verify git repository
git status
ls -la .git/
```

#### **Permission Denied:**

```bash
# Fix hook permissions
find .git/hooks -type f -exec chmod +x {} \;

# Fix script permissions
chmod +x scripts/check-type-duplicates.cjs
chmod +x supernal-code-package/lib/cli/commands/sync/sync-cli-in-rules.js
```

#### **Test Failures During Pre-push:**

```bash
# Debug test failures
npm test

# Run specific test files
npm test -- tests/requirements/req-003/

# Check test environment
NODE_ENV=test npm test

# Skip tests temporarily (emergency only)
SC_SKIP_PRE_PUSH=true git push
```

#### **Type Checker Issues:**

```bash
# Debug type checker
node scripts/check-type-duplicates.cjs

# Check configuration
yq '.type_duplication' supernal.yaml

# Update dependencies
npm install

# Regenerate config (if corrupted)
sc init --overwrite
```

#### **CLI Sync Failures:**

```bash
# Debug CLI sync
node supernal-code-package/lib/cli/commands/sync/sync-cli-in-rules.js

# Check command mapping
cat cli/command-mapping.json

# Verify rules directory
ls -la .cursor/rules/
```

### **Hook Conflicts:**

If you have existing git hooks:

```bash
# Backup existing hooks
cp -r .git/hooks .git/hooks.backup

# Install Supernal Coding hooks
sc git-hooks install

# Merge custom hooks manually
# (Add your custom logic to our hook scripts)
```

### **Debugging Commands:**

```bash
# Check git hook status
sc git-hooks status

# Validate installation
sc validate-installation --git-hooks

# Test hooks without committing
.git/hooks/pre-commit
.git/hooks/pre-push

# View hook logs
tail -f .git/hooks.log  # (if logging enabled)
```

## 📊 Monitoring & Metrics

### **Hook Performance:**

```bash
# Time hook execution
time .git/hooks/pre-commit
time .git/hooks/pre-push

# Monitor test suite performance
npm test -- --verbose

# Check type checker performance
time node scripts/check-type-duplicates.cjs
```

### **Usage Analytics:**

```bash
# View hook execution history
git log --oneline --grep="skip-verification"

# Count bypasses
git log --grep="--no-verify" --oneline | wc -l

# Analyze commit patterns
git shortlog -s -n --since="1 month ago"
```

## 🎯 Best Practices

### **Development Workflow:**

1. **Always work on feature branches**
2. **Use descriptive commit messages** with REQ-XXX references
3. **Run tests locally** before pushing
4. **Review type duplications** regularly
5. **Keep branches short-lived** and focused

### **Hook Management:**

1. **Install hooks in all repositories**
2. **Keep hooks updated** with `sc git-hooks update`
3. **Document bypass usage** when necessary
4. **Review hook failures** promptly
5. **Share configurations** across team

### **Emergency Procedures:**

1. **Use bypasses sparingly** and document reasons
2. **Fix underlying issues** immediately after bypass
3. **Communicate with team** about hook bypasses
4. **Re-run validations** manually when bypassing
5. **Review bypass commits** in code reviews

## 🔗 Related Documentation

- **[Git Smart Commands](https://code.supernal.ai/docs/cli-commands/git-smart)** - Higher-level git workflow automation
- **[Type Duplication Checker](https://code.supernal.ai/docs/type-checking)** - Detailed type checking documentation
- **[Testing Strategy](https://code.supernal.ai/docs/testing)** - How our test suite works
- **[CI/CD Integration](https://code.supernal.ai/docs/cicd)** - Continuous integration with hooks
- **[Troubleshooting Guide](https://code.supernal.ai/docs/troubleshooting)** - General troubleshooting help

## 📞 Support

- **Documentation**: [code.supernal.ai](https://code.supernal.ai)
- **Issues**: [GitHub Issues](https://github.com/supernalintelligence/supernal-coding/issues)
- **Discussions**: [GitHub Discussions](https://github.com/supernalintelligence/supernal-coding/discussions)
- **Email**: support@supernal.ai

---

_This guide covers the actual implementation of Supernal Coding's git hooks. For theoretical workflow examples, see the [Git Integration Workflow Guide](https://code.supernal.ai/docs/workflow/git-integration)._
