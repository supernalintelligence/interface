# BUILDME.sh and TESTME.sh Standards

**Standardized Build and Test Interfaces for Supernal Coding Projects**

## Overview

The `BUILDME.sh` and `TESTME.sh` scripts provide standardized, agent-friendly interfaces for building and testing across all supernal coding projects. These scripts are designed to:

- **Provide consistent interfaces** across different project types
- **Enable easy agent usage** with predictable commands and outputs
- **Support multiple environments** (development, CI/CD, production)
- **Offer comprehensive reporting** and intelligent test discovery
- **Allow configuration flexibility** while maintaining standards

## 🏗️ BUILDME.sh Standard

### Purpose

`BUILDME.sh` is the **primary build interface** that all supernal coding projects should implement. It provides a unified way to build, validate, and prepare projects regardless of their underlying technology stack.

### Standard Location

```
./BUILDME.sh  # Always at project root
```

### Standard Interface

```bash
# Basic usage
./BUILDME.sh              # Default build
./BUILDME.sh --help       # Show help and options
./BUILDME.sh --quiet      # Silent mode for automation
./BUILDME.sh --validate   # Build + validation
./BUILDME.sh --clean      # Clean build
./BUILDME.sh --production # Production build
```

### Configuration

The script should be configurable via:

- **Environment variables** (for CI/CD)
- **Command line flags** (for interactive use)
- **Configuration files** (project-specific)

### Agent Usage Guidelines

**Agents should prefer `BUILDME.sh` over direct commands** like `npm run build`, `make`, etc. because:

- ✅ **Consistent interface** across all projects
- ✅ **Intelligent error handling** and reporting
- ✅ **Environment detection** and optimization
- ✅ **Validation integration** (linting, testing, security)
- ✅ **Standardized output** for parsing

### Example Agent Commands

```bash
# Recommended agent usage
./BUILDME.sh --quiet      # For automation/scripts
./BUILDME.sh --validate   # For comprehensive building
./BUILDME.sh --help       # To understand project-specific options

# Avoid direct commands when BUILDME.sh exists
npm run build             # ❌ Not standardized
make build               # ❌ Not consistent
cargo build              # ❌ Technology-specific
```

## 🧪 TESTME.sh Standard

### Purpose

`TESTME.sh` is the **primary testing interface** that provides comprehensive test discovery, execution, and reporting across all test types and frameworks.

### Standard Location

```
./TESTME.sh  # Always at project root
```

### Standard Interface

```bash
# Basic usage
./TESTME.sh                    # Run all tests
./TESTME.sh unit              # Unit tests only
./TESTME.sh e2e               # E2E tests only
./TESTME.sh requirements      # Requirements tests
./TESTME.sh specific REQ-011  # Specific requirement
./TESTME.sh map               # Generate test map
./TESTME.sh --help            # Show comprehensive help
```

### Key Features

- **Intelligent test discovery** using test mapper
- **Multi-framework support** (Jest, Playwright, Cypress, etc.)
- **Requirements traceability** with REQ-specific testing
- **Comprehensive reporting** with test maps and coverage
- **Agent-friendly output** with structured results

### Agent Usage Guidelines

**Agents should prefer `TESTME.sh` over direct test commands** because:

- ✅ **Unified test interface** across all frameworks
- ✅ **Intelligent test discovery** finds all tests automatically
- ✅ **Requirements mapping** shows test coverage
- ✅ **Comprehensive reporting** with actionable insights
- ✅ **Configurable execution** (parallel, coverage, timeouts)

### Example Agent Commands

```bash
# Recommended agent usage
./TESTME.sh map              # Understand test landscape
./TESTME.sh requirements     # Test requirements coverage
./TESTME.sh specific REQ-011 # Test specific functionality
./TESTME.sh --e2e --verbose  # Comprehensive testing

# Avoid direct commands when TESTME.sh exists
npm test                     # ❌ Limited to npm projects
jest                         # ❌ Framework-specific
playwright test              # ❌ Single framework only
```

## 🧀 Swiss Cheese Quality Model

### Multi-Layer Defense for Functional Works

The "swiss cheese" model provides multiple overlapping layers of quality assurance, where each layer catches different types of issues. Like Swiss cheese, each layer has holes, but when stacked together, they provide comprehensive coverage.

#### Quality Layers

**🎯 Layer 1: Good Requirements**

- Clear, testable acceptance criteria
- Proper requirement traceability (REQ-XXX format)
- Stakeholder validation and sign-off
- Risk assessment and compliance mapping

**🧪 Layer 2: Good Tests**

- Comprehensive test coverage (unit, integration, e2e)
- Requirements-based test scenarios
- Anti-BS testing (meaningful assertions)
- Automated test execution and reporting

**🔒 Layer 3: Good Pre-commit Hooks**

- Code quality validation (linting, formatting)
- Security scanning and vulnerability checks
- Test execution on changed code
- Requirement traceability validation

**🚀 Layer 4: Good Pre-push Hooks**

- Full test suite execution
- Build validation and artifact generation
- Integration testing with dependencies
- Performance regression detection

**⚙️ Layer 5: Good Workflow CI/CD**

- Automated build and deployment pipelines
- Multi-environment testing (dev, staging, prod)
- GitHub Actions workflow monitoring
- Automated rollback on failure detection

**👥 Layer 6: Good Reviews (Human)**

- Code review by qualified team members
- Architecture and design validation
- Security and compliance review
- Knowledge transfer and mentoring

**📊 Layer 7: Good Monitoring and Feedback**

- Real-time system health monitoring
- User feedback collection and analysis
- Performance metrics and alerting
- Continuous improvement loops

#### Implementation Strategy

```bash
# Enable all quality layers
sc git-hooks install          # Layers 3 & 4: Pre-commit/push hooks
sc workflow setup             # Layer 5: CI/CD workflows
sc monitor enable             # Layer 7: Monitoring setup
sc test validate              # Layer 2: Test quality validation
sc requirement validate       # Layer 1: Requirements validation
```

#### Layer Effectiveness Matrix

| Layer        | Catches                        | Misses                     | Automation Level   |
| ------------ | ------------------------------ | -------------------------- | ------------------ |
| Requirements | Logic errors, missing features | Implementation bugs        | Manual/AI-assisted |
| Tests        | Functional bugs, regressions   | Integration issues         | Fully automated    |
| Pre-commit   | Style, basic errors            | Complex logic bugs         | Fully automated    |
| Pre-push     | Build failures, test failures  | Environment issues         | Fully automated    |
| CI/CD        | Integration failures           | Production-specific issues | Fully automated    |
| Reviews      | Architecture issues, security  | Runtime edge cases         | Manual             |
| Monitoring   | Production issues              | Silent failures            | Fully automated    |

#### Quality Metrics

- **Coverage Overlap**: Measure how many issues are caught by multiple layers
- **Escape Rate**: Track issues that reach production despite all layers
- **Layer Effectiveness**: Monitor which layers catch the most critical issues
- **Feedback Loop Speed**: Measure time from issue detection to resolution

## 📊 Test Mapping and Discovery

### Test Mapper Integration

Both scripts integrate with the comprehensive test mapping system that:

- **Discovers all test files** across the project
- **Categorizes tests** by type, framework, and requirement
- **Maps requirements to tests** for traceability
- **Generates execution commands** for different scenarios
- **Provides recommendations** for test improvements

### Example Test Map Output

```bash
./TESTME.sh map
```

```
📊 Comprehensive Test Mapping Report
====================================
Generated: 1/20/2025, 12:00:00 AM

📈 Summary Statistics
   Test Files: 27
   Test Cases: 156
   Requirements Coverage: 11/29 (38%)

🔧 Test Frameworks
   jest: 25 files
   playwright: 2 files

📂 Test Categories
   requirement-011: 2 files
   requirement-003: 2 files
   other: 1 files

📋 Requirements Test Coverage
   ✅ REQ-011: 2 test files (comprehensive)
   ✅ REQ-003: 2 test files (comprehensive)
   ❌ REQ-001: 0 test files (none)

💡 Recommendations
   1. [HIGH] 18 requirements have no tests
   2. [MEDIUM] 0 tests use mocks instead of real implementation
```

## 🤖 Agent Integration Examples

### Building a Project

```bash
# Agent workflow for building
if [[ -f "./BUILDME.sh" ]]; then
    echo "Using standardized build interface..."
    ./BUILDME.sh --quiet --validate
else
    echo "No BUILDME.sh found, falling back to package.json..."
    npm run build 2>/dev/null || echo "No standard build method found"
fi
```

### Testing a Project

```bash
# Agent workflow for testing
if [[ -f "./TESTME.sh" ]]; then
    echo "Using standardized test interface..."

    # Discover tests first
    ./TESTME.sh map

    # Run specific requirement tests
    ./TESTME.sh specific REQ-011

    # Run comprehensive tests if needed
    ./TESTME.sh --e2e --coverage-threshold 80
else
    echo "No TESTME.sh found, falling back to npm test..."
    npm test 2>/dev/null || echo "No standard test method found"
fi
```

### Understanding Project Test Landscape

```bash
# Agent workflow for test discovery
./TESTME.sh discover | jq .  # Parse JSON output for automation
./TESTME.sh map             # Human-readable test report
```

## 📋 Configuration Standards

### Environment Variables

Both scripts support standardized environment variables:

#### BUILDME.sh Configuration

```bash
# Build configuration
BUILD_MODE=production     # development, testing, production
BUILD_VERBOSE=false       # Enable verbose output
BUILD_CLEAN=false         # Clean build
BUILD_VALIDATE=true       # Run validation
BUILD_TIMEOUT=600         # Build timeout in seconds
```

#### TESTME.sh Configuration

```bash
# Test configuration
COVERAGE_THRESHOLD=80     # Coverage threshold percentage
PARALLEL_TESTS=true       # Enable parallel execution
RUN_E2E=false            # Include E2E tests by default
VERBOSE=false            # Enable verbose output
BAIL_ON_FAILURE=true     # Stop on first failure
TEST_TIMEOUT=300         # Test timeout in seconds
GENERATE_REPORTS=true    # Generate test reports
```

### Project-Specific Configuration

Projects can include configuration files that the scripts automatically detect:

```bash
# Configuration file locations (in order of precedence)
supernal.yaml    # Supernal coding configuration
.buildme.config.json          # Build-specific configuration
.testme.config.json           # Test-specific configuration
package.json                  # NPM configuration
pyproject.toml               # Python configuration
```

## 🚀 Implementation Guidelines

### For Project Creators

1. **Always include BUILDME.sh and TESTME.sh** at project root
2. **Use the template versions** from supernal-coding templates
3. **Customize for your technology stack** while maintaining interface
4. **Test with the provided examples** to ensure agent compatibility
5. **Document any project-specific options** in help text

### For Agents

1. **Always check for BUILDME.sh/TESTME.sh first** before using direct commands
2. **Use `--help` to understand project-specific options**
3. **Parse structured output** (JSON) for automation
4. **Handle timeout and error conditions** gracefully
5. **Generate reports** for human review when appropriate

### For Teams

1. **Standardize across all repositories** in your organization
2. **Include in project templates and scaffolding**
3. **Train team members** on the standard interfaces
4. **Monitor usage and effectiveness** through automation
5. **Contribute improvements** back to the supernal-coding ecosystem

## 📈 Benefits

### For Development Teams

- **Consistent workflows** across all projects
- **Faster onboarding** with standardized interfaces
- **Better automation** with predictable commands
- **Comprehensive testing** with intelligent discovery

### For AI Agents

- **Reliable interfaces** that work across project types
- **Rich information** about project capabilities
- **Standardized error handling** and reporting
- **Configurable behavior** for different scenarios

### For Organizations

- **Reduced maintenance** through standardization
- **Better quality assurance** with comprehensive testing
- **Improved productivity** with automation-friendly interfaces
- **Knowledge sharing** across teams and projects

## 🔄 Migration Strategy

### For Existing Projects

1. **Add BUILDME.sh** that wraps existing build commands
2. **Add TESTME.sh** that discovers and runs existing tests
3. **Gradually enhance** with additional features
4. **Test with agents** to ensure compatibility
5. **Update documentation** to reference new standards

### Example Migration

```bash
# Legacy build command
npm run build

# Migrated BUILDME.sh (initial version)
#!/bin/bash
case "${1:-build}" in
    build) npm run build ;;
    clean) npm run clean ;;
    help) echo "Usage: $0 [build|clean|help]" ;;
esac

# Enhanced BUILDME.sh (full template)
# Use the comprehensive template from supernal-coding
```

## 📚 Templates and Resources

### Available Templates

- **Full BUILDME.sh template**: `templates/buildme/BUILDME.sh`
- **Full TESTME.sh template**: `templates/buildme/TESTME.sh`
- **Configuration examples**: `templates/buildme/configs/`
- **Agent integration examples**: `docs/examples/`

### Getting Started

```bash
# Install supernal-coding globally
npm install -g supernal-coding

# Initialize project with standards
sc init --include-build-scripts

# Or copy templates manually
cp templates/buildme/BUILDME.sh ./
cp templates/buildme/TESTME.sh ./
chmod +x BUILDME.sh TESTME.sh
```

---

**Remember**: These standards are designed to make development more predictable and automation-friendly while maintaining flexibility for different project needs. Always prioritize the standardized interfaces (`BUILDME.sh`, `TESTME.sh`) over direct technology-specific commands when they are available.
