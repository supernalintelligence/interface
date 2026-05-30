# Getting Started with Supernal Coding

This guide will walk you through setting up Supernal Coding and creating your first compliant project from scratch.

## Prerequisites

- **Node.js** 18+ and npm
- **Git** for version control
- **Modern terminal** (bash, zsh, or PowerShell)
- **Code editor** (VS Code recommended for best integration)

## Installation

### 1. Install the Global CLI

```bash
npm install -g supernal-code
```

Verify installation:

```bash
sc --version
sc --help
```

### 2. Verify System Requirements

```bash
sc doctor  # Check system compatibility
```

## Quick Start (5 Minutes)

### 1. Create a New Project

```bash
mkdir my-compliant-app
cd my-compliant-app
git init
```

### 2. Equip with Supernal Coding

```bash
sc init --standard
```

This will:

- ✅ Install Supernal Coding configuration
- ✅ Set up git hooks for validation
- ✅ Create requirement tracking system
- ✅ Configure testing framework
- ✅ Initialize dashboard components

### 3. Launch the Dashboard

```bash
sc dashboard
```

Opens at `http://localhost:3001` showing:

- Project overview
- Requirements by phase
- Compliance status
- Testing results

### 4. Create Your First Requirement

```bash
sc req new "User authentication system" --priority=high --epic=auth
```

### 5. Start Development

```bash
sc git-smart branch --branch=feature/req-001-auth  # Creates feature branch
sc req update REQ-001 --status=in-progress         # Mark as in-progress
# Implement your feature
sc test                    # Run validation
sc git-smart merge         # Safe merge to main
```

## Detailed Setup Guide

### Project Initialization Options

#### Standard Setup (Recommended)

```bash
sc init --standard
```

- Complete feature set
- All compliance frameworks
- Full testing suite
- Dashboard integration

#### Minimal Setup

```bash
sc init --minimal
```

- Basic requirement tracking
- Essential git hooks
- Lightweight configuration

#### Development Setup

```bash
sc init --development
```

- All features plus development tools
- Enhanced debugging
- Contributor documentation

#### Interactive Setup

```bash
sc init --interactive
```

- Guided configuration
- Custom compliance selection
- Tailored to your needs

### Configuration Options

During initialization, you can specify:

```bash
sc init --standard \
  --name="My Project" \
  --compliance="iso-13485,fda-21-cfr" \
  --testing="playwright,jest" \
  --git-hooks \
  --dashboard
```

## Understanding the File Structure

After initialization, your project will have:

```
my-compliant-app/
├── .supernal-coding/           # Supernal Coding configuration
│   ├── config.json            # Main configuration
│   ├── requirements/          # Requirement files
│   ├── compliance/            # Compliance mappings
│   └── state/                 # Project state tracking
├── .cursor/                   # AI agent rules (if using Cursor)
│   └── rules/                 # Development guidelines
├── tests/                     # Test suites
│   ├── unit/                  # Unit tests
│   ├── integration/           # Integration tests
│   └── e2e/                   # End-to-end tests
├── docs/                      # Generated documentation
├── scripts/                   # Automation scripts
├── .gitignore                 # Enhanced git ignore
├── package.json               # Project dependencies
└── supernal.yaml              # Supernal YAML configuration
```

## Core Concepts

### Requirements Lifecycle

1. **Creation**: `sc req new "Feature description"`
2. **Planning**: `sc req expand REQ-001` (break into subtasks)
3. **Development**: `sc git-smart branch` + `sc req update --status=in-progress`
4. **Testing**: `sc test validate REQ-001`
5. **Completion**: `sc req update REQ-001 --status=done`

### Development Phases

Your project progresses through phases:

- **Discovery**: Problem definition and planning
- **Foundation**: Infrastructure and setup
- **Implementation**: Feature development
- **Validation**: Testing and quality assurance
- **Compliance**: Regulatory validation

### Git Workflow Integration

Supernal Coding enhances your git workflow:

```bash
# Create feature branch
sc git-smart branch --req=REQ-001

# Safe merge with validation
sc git-smart merge --push --delete-local

# Automated compliance checks
git commit -m "REQ-001: Implement user auth"
```

## First Development Cycle

Let's create a complete feature from start to finish:

### 1. Define the Requirement

```bash
sc req new "User login with email and password" \
  --priority=high \
  --epic=authentication \
  --compliance="iso-13485"
```

### 2. Plan the Implementation

```bash
sc req show REQ-001           # View requirement details
sc req expand REQ-001         # Break into subtasks
sc req generate-tests REQ-001 # Create test framework
```

### 3. Start Development

```bash
sc git-smart branch --branch=feature/req-001-user-login  # Create feature branch
sc req update REQ-001 --status=in-progress               # Mark as in-progress
```

### 4. Implement the Feature

Create your login component, API endpoints, etc.

### 5. Validate Implementation

```bash
sc test run unit              # Run unit tests
sc test run e2e               # Run end-to-end tests
sc req validate REQ-001       # Validate requirement completion
```

### 6. Complete the Requirement

```bash
sc req update REQ-001 --status=done
sc git-smart merge --push --delete-local
```

### 7. Monitor Progress

```bash
sc dashboard                  # View progress
sc compliance report         # Check compliance status
```

## Dashboard Overview

The Supernal Coding dashboard provides:

### Phase View

- **Discovery**: Requirements in planning
- **Foundation**: Infrastructure tasks
- **Implementation**: Active development
- **Validation**: Testing and QA
- **Compliance**: Regulatory validation

### Requirement Cards

Each requirement shows:

- Status and priority
- Compliance mapping
- Test coverage
- Implementation progress

### Compliance Monitor

- Framework compliance percentage
- Critical gaps identification
- Audit trail status

## Common Commands

### Requirement Management

```bash
sc req list                   # List all requirements
sc req show REQ-001          # Show requirement details
sc req new "Description"     # Create new requirement
sc req update REQ-001 --status=done
```

### Testing

```bash
sc test guide               # Show testing guidance
sc test run unit            # Run unit tests
sc test validate REQ-001    # Validate specific requirement
```

### Git Operations

```bash
sc git-smart branch         # Create feature branch
sc git-smart merge          # Safe merge with validation
sc git-hooks install        # Install git hooks
```

### Dashboard & Monitoring

```bash
sc dashboard               # Launch dashboard
sc compliance report      # Generate compliance report
sc docs generate          # Update documentation
```

## Next Steps

Now that you have Supernal Coding set up:

1. **Explore the Dashboard** - Familiarize yourself with the visual interface
2. **Create More Requirements** - Build out your project requirements
3. **Set Up Compliance** - Configure your specific compliance frameworks
4. **Customize Workflows** - Adapt the system to your team's needs
5. **Integrate with CI/CD** - Set up automated validation

## Getting Help

- **Built-in Help**: `sc help` or `sc <command> --help`
- **Documentation**: Browse these docs for detailed guides
- **Examples**: Check the `examples/` directory in your project
- **Community**: Join our community for support and best practices

## Troubleshooting

### Common Issues

**Command not found: sc**

```bash
npm install -g supernal-code
# or
npx supernal-code --version
```

**Git hooks not working**

```bash
sc git-hooks install
sc git-hooks status
```

**Dashboard not loading**

```bash
sc dashboard --port=3002  # Try different port
```

**Tests failing**

```bash
sc test doctor           # Diagnose test issues
sc test setup           # Reconfigure testing
```

Ready to build compliant, AI-maintained software? Let's dive deeper into the [CLI Commands](../cli-commands/index.md) or explore the [Workflow Guide](./index.md).
