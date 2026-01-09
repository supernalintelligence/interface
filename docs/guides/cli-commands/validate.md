---
id: validate
title: validate
sidebar_label: validate
---

# `validate`

Validate project structure and requirements

## Usage

```bash
sc validate --requirements --tests --config --all
```

## Examples

```bash
sc validate --all
```

```bash
sc validate --requirements
```

```bash
sc validate --tests
```

## Implementation Details

**Implementation Notes**: Validation System
REQ-003: NPM Package Foundation - Validate Command

This is a wrapper that provides the validate command interface
expected by REQ-003 tests while delegating to the comprehensive
validation system implemented in development/validate.js (901 lines).

## Category

**General**

---

_This documentation is automatically generated from the live CLI system._
