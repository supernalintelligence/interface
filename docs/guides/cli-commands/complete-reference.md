# Complete CLI Commands Reference

This is the comprehensive reference for all Supernal Coding CLI commands. Each command includes syntax, options, examples, and use cases.

## CLI Command Flow Overview

### 🗺️ **Command Decision Tree**

<SimpleMermaid
title="CLI Command Decision Flow"
description="Interactive flowchart showing how to choose the right Supernal Coding command based on your current needs and project state."
chart={`
flowchart TD
Start(["🚀 Start Here<br/>What do you want to do?"]) --> Init{"🏗️ New Project?"}
Start --> Existing{"📁 Existing Project?"}

    Init -->|Yes| InitCmd["sc init --interactive"]
    InitCmd --> InitDone["✅ Project Ready<br/>Basic structure created"]

    Existing -->|Requirements| ReqFlow["📋 Requirements"]
    Existing -->|Testing| TestFlow["🧪 Testing"]
    Existing -->|Git Operations| GitFlow["🌿 Git Operations"]
    Existing -->|Dashboard| DashFlow["🎛️ Dashboard"]

    ReqFlow --> ReqNew["sc req new 'Feature'"]
    ReqFlow --> ReqList["sc req list"]
    ReqFlow --> ReqValidate["sc req validate REQ-001"]
    ReqFlow --> ReqStart["sc git-smart branch + sc req update"]

    TestFlow --> TestAll["sc test"]
    TestFlow --> TestReq["sc test --requirement REQ-001"]
    TestFlow --> TestGuide["sc test --guide"]

    GitFlow --> GitMerge["sc git-smart merge"]
    GitFlow --> GitBranch["sc git-smart branch"]
    GitFlow --> GitCheck["sc git-smart check-context"]

    DashFlow --> DashStart["sc dashboard"]
    DashFlow --> DashDeploy["sc dashboard --deploy"]

    InitDone --> ReqFlow

    style Start fill:#e1f5fe
    style InitDone fill:#e8f5e8
    style ReqFlow fill:#f3e5f5
    style TestFlow fill:#fff3e0
    style GitFlow fill:#e8f5e8
    style DashFlow fill:#f3e5f5

`}
/>

### 🔄 **Requirements Lifecycle**

<SimpleMermaid
title="Requirements State Management"
description="State diagram showing the complete lifecycle of requirements from creation to completion, including validation gates and quality checkpoints."
chart={`
stateDiagram-v2
[*] --> Draft : sc req new
Draft --> InProgress : sc req update --status=in-progress
InProgress --> Testing : Code complete
Testing --> Review : sc req validate
Review --> InProgress : Validation fails
Review --> Approved : Validation passes
Approved --> Merged : sc git-smart merge
Merged --> [*] : Complete

    InProgress --> Blocked : Dependencies
    Blocked --> InProgress : Dependencies resolved

    Draft --> Cancelled : Not needed
    InProgress --> Cancelled : Scope change

    note right of Testing
        Automated validation:
        Tests pass
        Coverage meets threshold
        Compliance checks
    end note

    note right of Review
        Quality gates:
        Code review
        Documentation
        Traceability
    end note

`}
/>

### 🧪 **Testing Strategy Flow**

<SimpleMermaid
title="Testing Execution Strategy"
description="Comprehensive testing workflow showing different test execution paths, result handling, and quality gate validation for continuous integration."
chart={`
graph TD
A["🧪 sc test<br/>Entry point"] --> B{"📋 Scope Selection"}

    B -->|All Tests| C["🌐 Full Suite<br/>sc test"]
    B -->|Specific Requirement| D["🎯 Requirement Tests<br/>sc test --requirement REQ-001"]
    B -->|Test Guidance| E["📚 Test Guide<br/>sc test --guide"]
    B -->|Structure Analysis| F["🏗️ Test Structure<br/>sc test --structure"]

    C --> G["⚡ Execution<br/>Run all test suites"]
    D --> H["🔍 Filtered Execution<br/>Run requirement-specific tests"]
    E --> I["📖 Documentation<br/>Show testing guidance"]
    F --> J["📊 Analysis<br/>Show test structure"]

    G --> K{"📈 Results"}
    H --> K

    K -->|✅ Pass| L["🎉 Success<br/>All tests passing"]
    K -->|❌ Fail| M["🔧 Fix Required<br/>Address failures"]

    M --> N["🛠️ Debug & Fix<br/>Investigate failures"]
    N --> O["🔄 Re-run<br/>Test again"]
    O --> K

    L --> P["📊 Coverage Report<br/>Generate coverage data"]
    P --> Q["✅ Ready for Merge<br/>Quality gates passed"]

    style A fill:#e1f5fe
    style L fill:#e8f5e8
    style M fill:#ffebee
    style Q fill:#e8f5e8

`}
/>

## Command Categories

- [Project Management](#project-management)
- [Requirements](#requirements)
- [Testing](#testing)
- [Git Operations](#git-operations)
- [Dashboard & Monitoring](#dashboard--monitoring)
- [Compliance](#compliance)
- [Documentation](#documentation)
- [Development Tools](#development-tools)

---

## Project Management

### `sc init`

Initialize a repository with Supernal Coding capabilities.

**Syntax:**

```bash
sc init [options] [directory]
```

**Options:**

- `--minimal` - Install minimal preset (just essentials)
- `--standard` - Install standard preset (recommended)
- `--full` - Install full preset (complete ecosystem)
- `--development` - Install development preset (for contributors)
- `--interactive` - Interactive setup mode
- `--dry-run` - Show what would be installed without doing it
- `--overwrite` - Overwrite existing files without confirmation
- `--skip-upgrade-check` - Skip checking for package upgrades
- `--merge` - Merge with existing installation
- `--yes` - Skip confirmations and use defaults
- `--name <name>` - Project name
- `--alias <alias>` - Command alias
- `-t, --template <name>` - Template to use
- `--force` - Overwrite existing files
- `-v, --verbose` - Verbose output

**Examples:**

```bash
# Standard setup (recommended)
sc init --standard

# Development setup with dry run
sc init --development --dry-run

# Interactive setup
sc init --interactive

# Initialize specific directory
sc init --standard ./my-project

# Custom project name
sc init --name="My Compliant App" --standard
```

**Use Cases:**

- Setting up new projects
- Adding Supernal Coding to existing repositories
- Configuring development environments
- Template-based project creation

---

### `sc sync`

Synchronize local repository state with global sc installation.

**Syntax:**

```bash
sc sync [action] [options]
```

**Actions:**

- `check` - Check version sync between local repo and global sc (default)
- `report` - Same as check - shows version comparison
- `update` - Update global sc to match local repository version

**Options:**

- `--force` - Force synchronization
- `-v, --verbose` - Verbose output

**Examples:**

```bash
# Check sync status
sc sync
sc sync check

# Update global installation
sc sync update --force

# Verbose sync report
sc sync report --verbose
```

**Use Cases:**

- Keeping global CLI in sync with project requirements
- Troubleshooting version mismatches
- Team environment consistency

---

## Requirements

### `sc req new`

Create a new requirement.

**Syntax:**

```bash
sc req new "requirement description" [options]
```

**Options:**

- `--priority <level>` - Priority: critical, high, medium, low
- `--epic <name>` - Epic/feature group name
- `--compliance <frameworks>` - Compliance frameworks (comma-separated)
- `--assignee <name>` - Assigned developer
- `--due-date <date>` - Due date (YYYY-MM-DD)
- `--tags <tags>` - Tags (comma-separated)
- `-v, --verbose` - Verbose output

**Examples:**

```bash
# Basic requirement
sc req new "User authentication system"

# High priority with epic
sc req new "Login with OAuth" --priority=high --epic=auth

# With compliance mapping
sc req new "Data encryption" --compliance="iso-13485,fda-21-cfr"

# Complete specification
sc req new "User profile management" \
  --priority=medium \
  --epic=user-management \
  --assignee="john.doe" \
  --due-date="2024-12-31" \
  --tags="frontend,api"
```

### `sc req list`

List requirements with filtering options.

**Syntax:**

```bash
sc req list [options]
```

**Options:**

- `--status <status>` - Filter by status (pending, in-progress, done, blocked)
- `--priority <level>` - Filter by priority
- `--epic <name>` - Filter by epic
- `--assignee <name>` - Filter by assignee
- `--compliance <framework>` - Filter by compliance framework
- `--phase <phase>` - Filter by development phase
- `--format <format>` - Output format (table, json, markdown)
- `--limit <number>` - Limit number of results

**Examples:**

```bash
# List all requirements
sc req list

# High priority requirements
sc req list --priority=high

# Requirements in progress
sc req list --status=in-progress

# Authentication epic requirements
sc req list --epic=auth

# JSON output for automation
sc req list --format=json --limit=10
```

### `sc req show`

Show detailed information about a requirement.

**Syntax:**

```bash
sc req show <req-id> [options]
```

**Options:**

- `--format <format>` - Output format (detailed, json, markdown)
- `--include-tests` - Include related test information
- `--include-commits` - Include related git commits
- `--include-compliance` - Include compliance mapping details

**Examples:**

```bash
# Basic requirement details
sc req show REQ-001

# Detailed view with tests
sc req show REQ-001 --include-tests

# JSON format for automation
sc req show REQ-001 --format=json

# Complete information
sc req show REQ-001 --include-tests --include-commits --include-compliance
```

### `sc req update`

Update requirement properties.

**Syntax:**

```bash
sc req update <req-id> [options]
```

**Options:**

- `--status <status>` - Update status
- `--priority <level>` - Update priority
- `--assignee <name>` - Update assignee
- `--due-date <date>` - Update due date
- `--description <text>` - Update description
- `--add-tags <tags>` - Add tags (comma-separated)
- `--remove-tags <tags>` - Remove tags (comma-separated)
- `--add-compliance <frameworks>` - Add compliance frameworks
- `--notes <text>` - Add implementation notes

**Examples:**

```bash
# Mark as done
sc req update REQ-001 --status=done

# Change priority and assignee
sc req update REQ-001 --priority=critical --assignee="jane.smith"

# Add implementation notes
sc req update REQ-001 --notes="Implemented using JWT tokens"

# Add compliance framework
sc req update REQ-001 --add-compliance="sox,pci-dss"
```

### `sc req start-work` ⚠️ DEPRECATED

> **Deprecated for multi-agent workflows.** Use separate branch and status commands instead.

**Recommended Alternative:**

```bash
# Create feature branch
sc git-smart branch --branch=feature/req-001-description

# Mark requirement as in-progress
sc req update REQ-001 --status=in-progress
```

This two-step approach supports multiple agents working in the same repository without branch conflicts.

### `sc req validate`

Validate requirement completion and quality.

**Syntax:**

```bash
sc req validate <req-id> [options]
```

**Options:**

- `--include-tests` - Validate test coverage
- `--include-docs` - Validate documentation
- `--include-compliance` - Validate compliance requirements
- `--strict` - Strict validation mode
- `--fix` - Auto-fix issues where possible

**Examples:**

```bash
# Basic validation
sc req validate REQ-001

# Complete validation
sc req validate REQ-001 --include-tests --include-docs --include-compliance

# Strict mode with auto-fix
sc req validate REQ-001 --strict --fix
```

---

## Testing

### `sc test`

Testing guidance and execution system.

**Syntax:**

```bash
sc test [action] [target] [options]
```

**Actions:**

- `guide` - Show testing guidance
- `setup` - Setup testing environment
- `validate` - Validate test quality
- `plan` - Generate test plan for requirement
- `run` - Run tests (unit, e2e, integration)
- `doctor` - Diagnose testing issues
- `map` - Generate test mapping
- `structure` - Show test structure guidance

**Options:**

- `--framework <framework>` - Testing framework (playwright, jest, cypress)
- `--watch` - Watch mode
- `--coverage` - Generate coverage report
- `--fix` - Auto-fix test issues where possible
- `-v, --verbose` - Verbose output

**Examples:**

```bash
# Show testing guidance
sc test guide

# Setup Playwright testing
sc test setup --framework playwright

# Validate test quality
sc test validate

# Generate test plan for requirement
sc test plan REQ-003

# Run unit tests with coverage
sc test run unit --coverage

# Diagnose test issues
sc test doctor

# Generate test mapping
sc test map

# Show test structure guidance
sc test structure
```

### `sc test run`

Execute specific test suites.

**Syntax:**

```bash
sc test run [type] [options]
```

**Types:**

- `unit` - Unit tests
- `integration` - Integration tests
- `e2e` - End-to-end tests
- `all` - All test types
- `req:<req-id>` - Tests for specific requirement

**Options:**

- `--watch` - Watch mode
- `--coverage` - Generate coverage report
- `--reporter <reporter>` - Test reporter (json, html, junit)
- `--parallel` - Run tests in parallel
- `--timeout <ms>` - Test timeout
- `--grep <pattern>` - Run tests matching pattern

**Examples:**

```bash
# Run all unit tests
sc test run unit

# Run with coverage
sc test run unit --coverage

# Run specific requirement tests
sc test run req:REQ-001

# Watch mode for development
sc test run unit --watch

# Parallel execution with custom timeout
sc test run e2e --parallel --timeout=30000
```

---

## Git Operations

### `sc git-smart`

Intelligent git operations with validation.

**Syntax:**

```bash
sc git-smart <operation> [options]
```

**Operations:**

- `branch` - Create feature branch
- `merge` - Safe merge with validation
- `check-branch` - Validate branch naming
- `check-context` - Check git context
- `deploy` - Deploy with validation

**Options:**

- `--req <req-id>` - Associate with requirement
- `--push` - Push after merge
- `--delete-local` - Delete local branch after merge
- `--no-verify` - Skip git hooks
- `-v, --verbose` - Verbose output

**Examples:**

```bash
# Create feature branch for requirement
sc git-smart branch --req=REQ-001

# Safe merge with cleanup
sc git-smart merge --push --delete-local

# Check branch naming
sc git-smart check-branch

# Deploy with validation
sc git-smart deploy --verbose
```

### `sc git-hooks`

Manage git hooks for validation.

**Syntax:**

```bash
sc git-hooks <action> [options]
```

**Actions:**

- `install` - Install git hooks
- `uninstall` - Remove git hooks
- `status` - Show hook status
- `test` - Test hook functionality
- `update` - Update hooks to latest version

**Options:**

- `--force` - Force installation/removal
- `--backup` - Backup existing hooks
- `-v, --verbose` - Verbose output

**Examples:**

```bash
# Install git hooks
sc git-hooks install

# Check hook status
sc git-hooks status

# Test hook functionality
sc git-hooks test

# Update to latest version
sc git-hooks update --force
```

---

## Dashboard & Monitoring

### `sc dashboard`

Launch the Supernal Coding dashboard.

**Syntax:**

```bash
sc dashboard [options]
```

**Options:**

- `--port <port>` - Port number (default: 3001)
- `--host <host>` - Host address (default: localhost)
- `--open` - Open browser automatically
- `--no-open` - Don't open browser
- `--dev` - Development mode
- `--build` - Build for production

**Examples:**

```bash
# Launch dashboard
sc dashboard

# Custom port
sc dashboard --port=3002

# Development mode
sc dashboard --dev --open

# Build for production
sc dashboard --build
```

### `sc status`

Show comprehensive project status.

**Syntax:**

```bash
sc status [options]
```

**Options:**

- `--format <format>` - Output format (summary, detailed, json)
- `--include-git` - Include git status
- `--include-tests` - Include test results
- `--include-compliance` - Include compliance status
- `--include-requirements` - Include requirements summary

**Examples:**

```bash
# Basic status
sc status

# Detailed status
sc status --format=detailed

# Complete status
sc status --include-git --include-tests --include-compliance

# JSON for automation
sc status --format=json
```

---

## Compliance

### `sc compliance`

Manage compliance frameworks and validation.

**Syntax:**

```bash
sc compliance <action> [options]
```

**Actions:**

- `list` - List available frameworks
- `add` - Add compliance framework
- `remove` - Remove compliance framework
- `validate` - Validate compliance
- `report` - Generate compliance report
- `map` - Map requirements to compliance

**Options:**

- `--framework <name>` - Specific framework
- `--output <file>` - Output file for reports
- `--format <format>` - Report format (html, pdf, json)
- `--strict` - Strict validation mode

**Examples:**

```bash
# List available frameworks
sc compliance list

# Add ISO 13485 framework
sc compliance add --framework=iso-13485

# Generate compliance report
sc compliance report --format=html --output=compliance-report.html

# Validate specific framework
sc compliance validate --framework=fda-21-cfr --strict
```

---

## Documentation

### `sc docs`

Generate and manage documentation.

**Syntax:**

```bash
sc docs <action> [options]
```

**Actions:**

- `generate` - Generate documentation
- `serve` - Serve documentation locally
- `build` - Build documentation for production
- `validate` - Validate documentation quality
- `update` - Update documentation

**Options:**

- `--type <type>` - Documentation type (api, user, compliance)
- `--output <dir>` - Output directory
- `--format <format>` - Output format (html, pdf, markdown)
- `--include-requirements` - Include requirements documentation
- `--include-tests` - Include test documentation

**Examples:**

```bash
# Generate all documentation
sc docs generate

# Serve documentation locally
sc docs serve --port=3000

# Build for production
sc docs build --output=./dist/docs

# Generate API documentation
sc docs generate --type=api --format=html
```

---

## Development Tools

### `sc dev`

Development utilities and tools.

**Syntax:**

```bash
sc dev <tool> [options]
```

**Tools:**

- `watch` - Watch for changes and auto-rebuild
- `lint` - Run linting checks
- `format` - Format code
- `analyze` - Analyze code quality
- `profile` - Performance profiling

**Options:**

- `--fix` - Auto-fix issues where possible
- `--watch` - Watch mode
- `--config <file>` - Configuration file
- `-v, --verbose` - Verbose output

**Examples:**

```bash
# Watch for changes
sc dev watch

# Lint with auto-fix
sc dev lint --fix

# Format code
sc dev format

# Analyze code quality
sc dev analyze --verbose
```

### `sc help`

Show help information.

**Syntax:**

```bash
sc help [command]
```

**Examples:**

```bash
# General help
sc help

# Command-specific help
sc help req
sc help test
sc help git-smart

# Show all available commands
sc help --all
```

---

## Global Options

These options work with most commands:

- `-v, --verbose` - Verbose output
- `--dry-run` - Show what would happen without executing
- `--config <file>` - Use specific configuration file
- `--no-color` - Disable colored output
- `--quiet` - Suppress non-essential output
- `--help` - Show command help

## Environment Variables

Configure Supernal Coding behavior:

```bash
# Set default configuration
export SC_CONFIG_PATH="/path/to/config"

# Enable debug mode
export SC_DEBUG=true

# Set default compliance frameworks
export SC_COMPLIANCE_FRAMEWORKS="iso-13485,fda-21-cfr"

# Configure dashboard port
export SC_DASHBOARD_PORT=3001
```

## Configuration Files

Supernal Coding uses several configuration files:

- `supernal.yaml` - Main YAML configuration
- `.supernal-coding/config.json` - Project-specific settings
- `package.json` - NPM integration
- `.gitignore` - Enhanced git ignore patterns

## Exit Codes

Supernal Coding commands return standard exit codes:

- `0` - Success
- `1` - General error
- `2` - Configuration error
- `3` - Validation error
- `4` - Network error
- `5` - Permission error

## Next Steps

- [Workflow Guide](./index.md) - Complete development workflow
- [Dashboard Guide](./index.md) - Visual interface overview
- [Compliance Guide](./index.md) - Framework implementation
- [Examples](../examples/index.md) - Real-world usage examples
