---
id: doc-validate
title: doc-validate
sidebar_label: doc-validate
---

# `doc-validate`

Validate documentation organization and enforce proper file placement

## Usage

```bash
sc doc-validate --file <path> --fix --dry-run --verbose, -v
```

## Examples

```bash
sc doc-validate
```

```bash
sc doc-validate --fix
```

```bash
sc doc-validate --file=README.md
```

```bash
sc doc-validate --dry-run
```

## Implementation Details

**Implementation Notes**: Documentation Validation CLI Command

Provides command-line interface for validating documentation structure
against .template.md files (template-driven validation)

## Category

**General**

---

_This documentation is automatically generated from the live CLI system._
