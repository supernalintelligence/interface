---
id: examples-overview
title: Examples Overview
sidebar_label: Examples
sidebar_position: 1
---

# Examples Overview

This section provides practical examples and implementation guides for using Supernal Coding across different scenarios, frameworks, and integrations.

## Quick Start Examples

### Basic Project Setup

```bash
# Initialize a new project
sc init --name="my-project" --framework=iso13485

# Generate initial requirements
sc req generate --count=10

# Validate requirements
sc req validate --all
```

### Multi-Framework Project

```bash
# Initialize with multiple frameworks
sc init --framework=iso13485,gdpr,soc2

# Generate framework-specific requirements
sc req generate --framework=iso13485 --category=design-controls
sc req generate --framework=gdpr --category=privacy
sc req generate --framework=soc2 --category=security
```

## Framework-Specific Examples

### ISO 13485 Medical Device Example

- Design control implementation
- Risk management integration
- Quality management system setup
- Regulatory submission preparation

### FDA 21 CFR Part 11 Example

- Computer system validation (CSV)
- Electronic signature implementation
- Audit trail configuration
- Validation protocol generation

### GDPR Compliance Example

- Privacy by design implementation
- Data subject rights management
- Consent management system
- Data breach notification procedures

### SOC 2 Security Example

- Security control implementation
- Trust service criteria mapping
- Incident response procedures
- Continuous monitoring setup

## Integration Examples

### CI/CD Integration

```yaml
# .github/workflows/compliance.yml
name: Compliance Validation
on: [push, pull_request]
jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Validate Requirements
        run: |
          npm install -g supernal-coding
          sc req validate --all
          sc compliance report
```

### Dashboard Integration

```typescript
// Dashboard monitoring example
import { SupernalCoding } from 'supernal-coding';

const sc = new SupernalCoding({
  project: 'my-medical-device',
  frameworks: ['iso13485', 'fda21cfr11'],
});

// Real-time compliance monitoring
const metrics = await sc.compliance.getMetrics();
console.log(`Compliance Score: ${metrics.overallScore}%`);
```

## Development Workflow Examples

### Requirement-Driven Development

1. Generate requirements from specifications
2. Implement features following requirements
3. Validate implementation against requirements
4. Generate compliance evidence

### Git Integration Example

```bash
# Create feature branch with requirement tracking
sc git-smart branch --requirement=REQ-001

# Implement feature with automatic validation
git commit -m "REQ-001: Implement user authentication"

# Merge with compliance validation
sc git-smart merge --validate-compliance
```

## Testing Examples

### Automated Compliance Testing

```typescript
// Jest test example
describe('Compliance Requirements', () => {
  test('REQ-ISO-001: Quality Management System', async () => {
    const result = await sc.req.validate('REQ-ISO-001');
    expect(result.status).toBe('compliant');
    expect(result.evidence).toBeDefined();
  });
});
```

### Validation Pipeline

```bash
#!/bin/bash
# validation-pipeline.sh

echo "Running compliance validation..."

# Validate all requirements
sc req validate --all --format=json > validation-results.json

# Generate compliance report
sc compliance report --output=compliance-report.pdf

# Check for critical issues
if sc compliance check --critical; then
  echo "✅ All critical compliance requirements met"
  exit 0
else
  echo "❌ Critical compliance issues found"
  exit 1
fi
```

## Advanced Examples

### Custom Framework Integration

```typescript
// Custom compliance framework
const customFramework = {
  name: 'HIPAA',
  requirements: [
    {
      id: 'REQ-HIPAA-001',
      title: 'Administrative Safeguards',
      description: 'Implement administrative safeguards for PHI',
    },
  ],
};

sc.frameworks.register(customFramework);
```

### API Integration Example

```typescript
// REST API integration
const express = require('express');
const app = express();

app.get('/compliance/status', async (req, res) => {
  const status = await sc.compliance.getStatus();
  res.json(status);
});

app.post('/requirements/validate', async (req, res) => {
  const result = await sc.req.validate(req.body.requirementId);
  res.json(result);
});
```

## Best Practices

### Project Structure

```
project/
├── requirements/
│   ├── iso13485/
│   ├── fda21cfr11/
│   └── gdpr/
├── compliance/
│   ├── evidence/
│   ├── reports/
│   └── audits/
└── .supernal/
    ├── config.json
    └── validation-rules.json
```

### Configuration Management

```json
{
  "project": {
    "name": "Medical Device Software",
    "version": "1.0.0",
    "frameworks": ["iso13485", "fda21cfr11"]
  },
  "validation": {
    "autoValidate": true,
    "strictMode": true,
    "evidenceCollection": true
  },
  "reporting": {
    "format": "pdf",
    "includeEvidence": true,
    "schedule": "weekly"
  }
}
```

## Related Documentation

- [CLI Commands](../cli-commands/index.md) - Complete command reference
- [Integration Guide](./index.md) - Integration documentation
- [Dashboard Guide](./index.md) - Dashboard configuration and usage

---

_These examples provide practical guidance for implementing Supernal Coding in real-world projects across different compliance frameworks and development scenarios._
