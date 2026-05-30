# Supernal Coding CLI Usage Guide

## Overview

The Supernal Coding CLI (`sc`) provides comprehensive development workflow management. This guide documents all available commands with practical examples.

## 🚀 Getting Started

### Installation and Setup

```bash
# Initialize in any git repository
sc init [directory]

# Validate your installation
sc validate-installation --all
```

### Basic Usage Pattern

```bash
sc <command> [subcommand] [options]
```

## 📋 Available Commands

### 1. **Initialization & Setup**

#### `sc init [directory]`

Initialize Supernal Coding in a repository with intelligent configuration.

```bash
# Initialize in current directory
sc init

# Initialize in specific directory
sc init /path/to/project

# Non-interactive setup
sc init --yes
```

**What it does:**

- Detects git repository root
- Analyzes repository structure
- Creates `supernal.yaml` (YAML configuration)
- Sets up required directories
- Installs templates and configuration

### 2. **Validation & Health Checks**

#### `sc validate-installation [options]`

Validate your Supernal Coding installation and configuration.

```bash
# Validate everything
sc validate-installation --all

# Validate specific components
sc validate-installation --requirements
sc validate-installation --tests
sc validate-installation --config

# Verbose output
sc validate-installation --verbose
```

### 3. **Agent Workflow Management**

#### `sc agent <action> [options]`

Manage agent handoffs and workflow coordination.

```bash
# Onboard a new agent
sc agent onboard --interactive

# Create a handoff document
sc agent handoff --title "feature-implementation-complete"

# Check agent status
sc agent status --branch feature/new-feature
```

### 4. **Priority Management**

#### `sc priority [action] [options]`

Manage requirements and task priorities.

```bash
# Show priority summary
sc priority show

# Show high priority items
sc priority show --priority high

# Update priorities
sc priority update --file req-020.md

# Validate priorities
sc priority validate
```

### 5. **Git Workflow Utilities**

#### `sc git-smart <action> [options]`

Smart git workflow utilities with validation.

```bash
# Check branch naming
sc git-smart check-branch --branch feature/req-020

# Get git status
sc git-smart status --verbose

# Sync with remote
sc git-smart sync
```

#### `sc git-assess [options]`

Comprehensive git repository assessment.

```bash
# Full repository assessment
sc git-assess

# Assess specific aspects
sc git-assess --branch-naming
sc git-assess --commit-messages
sc git-assess --workflow-compliance
```

### 6. **Kanban Task Management**

#### `sc kanban [action] [options]`

Manage tasks in the Kanban system.

```bash
# List all tasks
sc kanban list

# Create new task
sc kanban todo "Implement user authentication"

# Move task to doing
sc kanban move "Implement user authentication" doing

# Filter tasks
sc kanban list --filter todo
sc kanban list --priority high
```

### 7. **Documentation Management**

#### `sc docs <action> [options]`

Manage project documentation.

```bash
# Generate documentation
sc docs generate

# Update documentation
sc docs update

# Validate documentation
sc docs validate
```

### 8. **Development Tools**

#### `sc dev <action> [options]`

Development utilities and tools.

```bash
# Generate project files
sc dev generate

# Run development scripts
sc dev scripts

# Health check
sc dev health
```

### 9. **Testing**

#### `sc test [options] [type] [target]`

Run tests using standardized interface.

```bash
# Run all tests
sc test

# Run specific test type
sc test unit
sc test e2e
sc test integration

# Run tests for specific requirement
sc test req-020
sc test req-003
```

### 10. **Git Hooks Management**

#### `sc git-hooks <action>`

Manage git hooks for workflow enforcement.

```bash
# Install git hooks
sc git-hooks install

# Validate hooks
sc git-hooks validate

# Remove hooks
sc git-hooks remove
```

### 11. **Requirements Tracking**

#### `sc init-req-tracking [options]`

Initialize git tracking for requirement files.

```bash
# Initialize tracking
sc init-req-tracking

# Validate tracking
sc init-req-tracking --validate
```

### 12. **Git Validation**

#### `sc git-validate [type] [value]`

Validate git workflow compliance.

```bash
# Validate branch name
sc git-validate branch feature/req-020

# Validate commit message
sc git-validate commit "REQ-020: Implement user authentication"
```

### 13. **Suggestion System**

#### `sc suggest <feedback> [options]`

Create GitHub issues with context.

```bash
# Create general suggestion
sc suggest "Add dark mode support"

# Create bug report
sc suggest-bug "Login fails on Safari"

# Create feature request
sc suggest-feature "Add export to PDF functionality"
```

### 14. **Handoff Management**

#### `sc handoff [action] [options]`

Manage agent handoffs with proper naming.

```bash
# Create handoff
sc handoff create --title "feature-complete"

# List handoffs
sc handoff list

# Show handoff details
sc handoff show <id>
```

### 15. **Test Mapping**

#### `sc test-map [options]`

Generate comprehensive test mapping.

```bash
# Generate test map
sc test-map

# Show test coverage
sc test-map --coverage

# Analyze test structure
sc test-map --analyze
```

## 🔧 Configuration

### Configuration File: `supernal.yaml`

The system uses a YAML configuration file for all settings:

```yaml
[project]
name = "your-project"
type = "standard"
git_root = "/path/to/git/root"

[paths]
requirements = "supernal-coding/requirements"
kanban = "supernal-coding/kanban"
workflow_rules = "supernal-coding/workflow-rules"

[compatibility]
multi_repo_support = true
dynamic_path_resolution = true
```

## 🧪 Testing Examples

### Running Tests

```bash
# Run all tests
npm test

# Run specific test suite
npm test -- tests/requirements/req-003/

# Run with coverage
npm test -- --coverage

# Run specific test file
npm test -- tests/requirements/req-020/req-020.e2e.test.js
```

### Test Structure

Tests are organized by requirement:

```
tests/
├── requirements/
│   ├── req-003/
│   │   ├── req-003.e2e.test.js
│   │   ├── req-003.unit.test.js
│   │   └── req-003.feature
│   ├── req-020/
│   │   ├── req-020.e2e.test.js
│   │   └── req-020.unit.test.js
│   └── req-011/
│       ├── req-011.e2e.test.js
│       └── req-011.unit.test.js
└── e2e/
    ├── lib/
    └── scenarios/
```

## 🎯 Best Practices

### 1. **Always Initialize First**

```bash
# Start with initialization
sc init --yes
sc validate-installation --all
```

### 2. **Use Configuration System**

- All commands automatically use `supernal.yaml`
- No hardcoded paths needed
- Works in any git repository

### 3. **Validate Regularly**

```bash
# Regular health checks
sc validate-installation --all
sc git-assess
```

### 4. **Follow Git Workflow**

```bash
# Check branch naming
sc git-smart check-branch

# Validate commit messages
sc git-validate commit "REQ-020: Implement feature"
```

### 5. **Use Agent Handoffs**

```bash
# Create handoffs for work transitions
sc agent handoff --title "phase-complete"
```

## 🔍 Troubleshooting

### Common Issues

**Command not found:**

```bash
# Ensure you're in the right directory
pwd
ls -la cli/index.js

# Run with node
node cli/index.js --help
```

**Configuration errors:**

```bash
# Reinitialize
sc init --yes

# Validate configuration
sc validate-installation --config
```

**Git issues:**

```bash
# Assess git repository
sc git-assess

# Check git hooks
sc git-hooks validate
```

## 📚 Additional Resources

- **Configuration Guide**: `docs/CONFIGURATION_SYSTEM_GUIDE.md`
- **Implementation Plan**: `docs/SUPERNAL_CODE_IMPLEMENTATION_PLAN.md`
- **Test Documentation**: See test files for usage examples
- **Git Workflow**: See `docs/USAGE_SHORTCUTS.md`

## 🚀 Getting Help

```bash
# Show all commands
sc --help

# Show command help
sc <command> --help

# Show subcommand help
sc <command> <subcommand> --help
```

This CLI provides a comprehensive development workflow system that adapts to your repository structure and provides intelligent automation for common development tasks.
