---
id: traceability
title: traceability
sidebar_label: traceability
---

# `traceability`

Comprehensive traceability matrix for compliance and requirement tracking

## Overview

The traceability system provides bidirectional linking between compliance frameworks, requirements, git branches, tests, and implementation code. It generates audit-ready reports for regulatory compliance and identifies coverage gaps in real-time.

## Usage

```bash
sc traceability <action> [options]
```

## Actions

### `generate`

Generate comprehensive traceability matrix

```bash
sc traceability generate [options]
```

**Options:**

- `-f, --format <type>` - Output format (json, html, csv)
- `-o, --output <path>` - Output file or directory
- `-v, --verbose` - Verbose output

**Examples:**

```bash
# Generate full traceability matrix
sc traceability generate

# Generate with specific format
sc traceability generate --format=html --output=./reports/

# Verbose generation
sc traceability generate --verbose
```

### `validate`

Validate traceability for specific requirement

```bash
sc traceability validate <requirement-id> [options]
```

**Parameters:**

- `<requirement-id>` - Requirement ID (e.g., REQ-070)

**Options:**

- `-v, --verbose` - Show detailed validation information

**Examples:**

```bash
# Validate specific requirement
sc traceability validate REQ-070

# Detailed validation
sc traceability validate REQ-020 --verbose
```

### `audit-export`

Generate regulatory audit package

```bash
sc traceability audit-export [options]
```

**Options:**

- `-o, --output <path>` - Output directory (default: ./audit-export)
- `-f, --format <type>` - Export format (regulatory, standard)

**Examples:**

```bash
# Generate audit package
sc traceability audit-export

# Custom output directory
sc traceability audit-export --output=./compliance-audit

# Regulatory format
sc traceability audit-export --format=regulatory
```

### `coverage`

Show coverage metrics and gap analysis

```bash
sc traceability coverage [options]
```

**Options:**

- `-f, --format <type>` - Output format (table, json, csv)
- `--framework <name>` - Filter by compliance framework

**Examples:**

```bash
# Show all coverage metrics
sc traceability coverage

# JSON format
sc traceability coverage --format=json

# Specific framework
sc traceability coverage --framework=iso13485
```

## What It Tracks

### Requirements

- Scans `supernal-coding/requirements/` for REQ-XXX files
- Extracts frontmatter metadata (status, priority, compliance standards)
- Links to compliance framework clauses

### Tests

- Scans `tests/` directory for test files
- Identifies REQ-XXX references in test content
- Tracks test coverage per requirement

### Git Branches

- Scans git branches for `feature/req-xxx-*` pattern
- Links branches to specific requirements
- Tracks development progress

### Compliance Frameworks

- Loads mappings from `supernal-coding/compliance/mappings/`
- Supports: 21 CFR Part 11, ISO 13485, GDPR, SOC 2
- Calculates framework coverage percentages

## Generated Reports

### Traceability Matrix (JSON)

Complete data structure with all relationships:

```json
{
  "requirements": { "REQ-070": { ... } },
  "tests": { "path/to/test.js": { ... } },
  "gitBranches": { "REQ-070": ["feature/req-070-*"] },
  "traceabilityLinks": { "REQ-070": { ... } },
  "coverage": { ... },
  "auditTrail": { "signature": "sha256:...", ... }
}
```

### HTML Report

Visual dashboard with:

- Coverage summary tables
- Color-coded coverage levels (high/medium/low)
- Clickable requirement details
- Gap identification

### CSV Export

Spreadsheet-compatible format:

```csv
Requirement ID,Title,Status,Tests,Branches,Compliance Frameworks,Coverage %
REQ-070,Traceability Matrix Implementation,In Progress,1,1,2,75%
```

### Compliance Summary (Markdown)

Executive summary for auditors:

```markdown
# Compliance Traceability Summary

## Coverage Overview

- Total Requirements: 68
- Requirements with Tests: 15 (22%)

## Compliance Framework Coverage

### 21-CFR-Part-11

- Covered Clauses: 3/15 (20%)
```

## Integration Points

### Git Workflow

- Automatic branch detection via `feature/req-xxx-*` pattern
- Commit message parsing for REQ-XXX references
- Integration with `sc git-smart branch` for feature branches

### Compliance System

- Links to existing compliance configuration
- Uses `supernal-coding/compliance/mappings/req-to-compliance.json`
- Supports multiple framework standards

### Testing Framework

- Scans all test files for requirement references
- Integrates with existing test structure
- Validates test coverage completeness

## Coverage Calculation

The system calculates coverage based on four criteria:

1. **Test Coverage** (25%) - Has linked test files
2. **Git Branch Tracking** (25%) - Has associated git branches
3. **Implementation Files** (25%) - Has identified implementation code
4. **Compliance Mapping** (25%) - Has compliance framework links

**Coverage Levels:**

- **High (80-100%)** - Green, audit-ready
- **Medium (50-79%)** - Yellow, needs attention
- **Low (0-49%)** - Red, significant gaps

## Audit Trail

All traceability operations include:

- **Cryptographic Signatures** - SHA-256 hash for integrity
- **Timestamps** - ISO 8601 format for all operations
- **Immutable Logs** - Stored in `.supernal-code/traceability-matrix.json`
- **Version Tracking** - Matrix version and generation metadata

## Performance

- **Generation Time** - < 10 seconds for 1000 requirements
- **File Scanning** - Efficient pattern matching for large codebases
- **Memory Usage** - Optimized for large project structures
- **Incremental Updates** - Only rescans changed files

## Compliance Standards

### 21 CFR Part 11 (FDA Electronic Records)

- Electronic signature validation
- Audit trail requirements
- Data integrity (ALCOA+)
- Access control verification

### ISO 13485 (Medical Device QMS)

- Design control traceability
- Risk management integration
- Document control procedures
- Management review requirements

### GDPR (Data Protection)

- Data processing lawfulness
- Privacy by design validation
- Subject rights implementation
- Breach notification procedures

### SOC 2 (Security Controls)

- Access control policies
- System monitoring
- Incident response procedures
- Change management controls

## Examples

### Complete Workflow

```bash
# 1. Generate initial matrix
sc traceability generate

# 2. Check specific requirement
sc traceability validate REQ-070

# 3. Generate audit package
sc traceability audit-export --output=./audit-2025-11

# 4. Monitor coverage
sc traceability coverage --format=table
```

### Integration with Requirements

```bash
# Create branch and mark in-progress
sc git-smart branch --branch=feature/req-070-title
sc req update 070 --status=in-progress

# Implement and test
# ... development work ...

# Validate traceability
sc traceability validate REQ-070

# Generate updated matrix
sc traceability generate
```

### Compliance Reporting

```bash
# Framework-specific coverage
sc traceability coverage --framework=iso13485

# Full audit export
sc traceability audit-export --format=regulatory

# Validate all requirements
for req in $(sc req list --format=ids); do
  sc traceability validate $req
done
```

## File Locations

- **Matrix Storage**: `.supernal-code/traceability-matrix.json`
- **Audit Exports**: `./audit-export/` (configurable)
- **Requirements**: `supernal-coding/requirements/`
- **Tests**: `tests/`
- **Compliance Mappings**: `supernal-coding/compliance/mappings/`

## Category

**Compliance & Auditing**

---

_This documentation is automatically generated from the live CLI system._
