---
id: date-validate
title: date-validate
sidebar_label: date-validate
---

# `date-validate`

Detect and fix hardcoded dates that don't match actual file dates

## Usage

```bash
sc date-validate --file <path> --fix --dry-run --verbose, -v
```

## Examples

```bash
sc date-validate
```

```bash
sc date-validate --fix
```

```bash
sc date-validate --file=README.md
```

```bash
sc date-validate --dry-run --fix
```

## Implementation Details

**Implementation Notes**: SC Date Validation Command

Provides the `sc date-validate` command interface for detecting and fixing
hardcoded dates that don't match actual file creation/modification dates.

## Category

**General**

---

_This documentation is automatically generated from the live CLI system._
