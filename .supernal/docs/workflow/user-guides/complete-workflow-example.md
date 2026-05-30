# Complete Workflow Example: Building a Compliant User Management System

This guide demonstrates a complete end-to-end workflow using Supernal Coding to build a user management system that meets ISO 13485 compliance requirements.

## Project Overview

We'll build a medical device software component with:

- User authentication and authorization
- Role-based access control
- Audit logging
- Data encryption
- Compliance validation

**Compliance Target**: ISO 13485 (Medical Device Quality Management)

---

## Phase 1: Discovery & Setup

### 1.1 Initialize the Project

```bash
# Create project directory
mkdir medical-user-management
cd medical-user-management
git init

# Initialize with Supernal Coding
sc init --standard \
  --name="Medical User Management System" \
  --compliance="iso-13485" \
  --testing="jest,playwright"
```

**Output:**

```
✅ Supernal Coding initialized successfully
✅ ISO 13485 compliance framework configured
✅ Git hooks installed
✅ Testing framework configured
✅ Dashboard components ready

Next steps:
- Run 'sc dashboard' to launch visual interface
- Run 'sc req new' to create your first requirement
```

### 1.2 Launch Dashboard

```bash
sc dashboard
```

Opens dashboard at `http://localhost:3001` showing:

- Empty requirements by phase
- Compliance framework status
- Project initialization complete

### 1.3 Create Epic Structure

```bash
# Create main epics
sc req new "User Authentication System" \
  --priority=critical \
  --epic=authentication \
  --compliance="iso-13485" \
  --phase=discovery

sc req new "Role-Based Access Control" \
  --priority=high \
  --epic=authorization \
  --compliance="iso-13485" \
  --phase=discovery

sc req new "Audit Logging System" \
  --priority=high \
  --epic=audit \
  --compliance="iso-13485" \
  --phase=discovery

sc req new "Data Security & Encryption" \
  --priority=critical \
  --epic=security \
  --compliance="iso-13485" \
  --phase=discovery
```

**Dashboard Update:**

- Discovery phase now shows 4 requirements
- Compliance mapping established
- Epic organization visible

---

## Phase 2: Foundation & Planning

### 2.1 Expand Requirements into Detailed Tasks

```bash
# Expand authentication requirement
sc req expand REQ-001 --detailed

# Generate test plans
sc req generate-tests REQ-001
```

**Generated Subtasks for REQ-001:**

- REQ-001.1: User registration with email validation
- REQ-001.2: Secure password hashing (bcrypt)
- REQ-001.3: JWT token generation and validation
- REQ-001.4: Session management
- REQ-001.5: Password reset functionality
- REQ-001.6: Account lockout after failed attempts

### 2.2 Set Up Project Infrastructure

```bash
# Move infrastructure requirements to foundation phase
sc req update REQ-001.1 --phase=foundation
sc req update REQ-001.2 --phase=foundation

# Create foundation requirements
sc req new "Database schema for user management" \
  --priority=high \
  --epic=infrastructure \
  --phase=foundation \
  --compliance="iso-13485"

sc req new "API endpoint structure and validation" \
  --priority=high \
  --epic=infrastructure \
  --phase=foundation

sc req new "Security middleware implementation" \
  --priority=critical \
  --epic=security \
  --phase=foundation \
  --compliance="iso-13485"
```

### 2.3 Generate Compliance Documentation

```bash
# Generate compliance mapping
sc compliance map --framework=iso-13485

# Create compliance documentation
sc docs generate --type=compliance --include-requirements
```

**Generated Files:**

- `docs/compliance/iso-13485-mapping.md`
- `docs/compliance/requirement-traceability.md`
- `docs/compliance/validation-plan.md`

---

## Phase 3: Implementation

### 3.1 Start First Implementation Cycle

```bash
# Start work on user registration
sc git-smart branch --branch=feature/req-001.1-user-registration
sc req update REQ-001.1 --status=in-progress
```

**Git Actions:**

- Creates branch: `feature/req-001.1-user-registration`
- Updates requirement status to "in-progress"

### 3.2 Implement User Registration

Create the implementation files:

```javascript
// src/models/User.js
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

class User {
  constructor(email, password, role = 'user') {
    this.id = uuidv4();
    this.email = email;
    this.passwordHash = bcrypt.hashSync(password, 12);
    this.role = role;
    this.createdAt = new Date();
    this.isActive = true;
    this.failedLoginAttempts = 0;
    this.lockedUntil = null;
  }

  validatePassword(password) {
    return bcrypt.compareSync(password, this.passwordHash);
  }

  lockAccount() {
    this.failedLoginAttempts = 0;
    this.lockedUntil = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
  }
}

module.exports = User;
```

```javascript
// src/controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { auditLog } = require('../utils/auditLogger');

class AuthController {
  async register(req, res) {
    try {
      const { email, password } = req.body;

      // Validate input
      if (!email || !password) {
        auditLog('REGISTRATION_FAILED', {
          email,
          reason: 'Missing credentials',
        });
        return res.status(400).json({ error: 'Email and password required' });
      }

      // Check if user exists
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        auditLog('REGISTRATION_FAILED', {
          email,
          reason: 'User already exists',
        });
        return res.status(409).json({ error: 'User already exists' });
      }

      // Create user
      const user = new User(email, password);
      await user.save();

      auditLog('USER_REGISTERED', { userId: user.id, email });

      res.status(201).json({
        message: 'User registered successfully',
        userId: user.id,
      });
    } catch (error) {
      auditLog('REGISTRATION_ERROR', { error: error.message });
      res.status(500).json({ error: 'Registration failed' });
    }
  }
}

module.exports = new AuthController();
```

### 3.3 Create Tests

```javascript
// tests/unit/models/User.test.js
const User = require('../../../src/models/User');

describe('User Model', () => {
  describe('constructor', () => {
    it('should create user with hashed password', () => {
      const user = new User('test@example.com', 'password123');

      expect(user.email).toBe('test@example.com');
      expect(user.passwordHash).toBeDefined();
      expect(user.passwordHash).not.toBe('password123');
      expect(user.role).toBe('user');
      expect(user.isActive).toBe(true);
    });
  });

  describe('validatePassword', () => {
    it('should validate correct password', () => {
      const user = new User('test@example.com', 'password123');
      expect(user.validatePassword('password123')).toBe(true);
    });

    it('should reject incorrect password', () => {
      const user = new User('test@example.com', 'password123');
      expect(user.validatePassword('wrongpassword')).toBe(false);
    });
  });
});
```

```javascript
// tests/e2e/auth.spec.js
const { test, expect } = require('@playwright/test');

test.describe('User Registration', () => {
  test('should register new user successfully', async ({ request }) => {
    const response = await request.post('/api/auth/register', {
      data: {
        email: 'newuser@example.com',
        password: 'SecurePass123!',
      },
    });

    expect(response.status()).toBe(201);
    const data = await response.json();
    expect(data.message).toBe('User registered successfully');
    expect(data.userId).toBeDefined();
  });

  test('should reject duplicate email registration', async ({ request }) => {
    // First registration
    await request.post('/api/auth/register', {
      data: {
        email: 'duplicate@example.com',
        password: 'SecurePass123!',
      },
    });

    // Duplicate registration
    const response = await request.post('/api/auth/register', {
      data: {
        email: 'duplicate@example.com',
        password: 'AnotherPass123!',
      },
    });

    expect(response.status()).toBe(409);
    const data = await response.json();
    expect(data.error).toBe('User already exists');
  });
});
```

### 3.4 Validate Implementation

```bash
# Run tests
sc test run unit
sc test run e2e

# Validate requirement
sc req validate REQ-001.1 --include-tests --include-compliance

# Update requirement status
sc req update REQ-001.1 --status=done --notes="User registration implemented with bcrypt hashing and validation"
```

**Test Results:**

```
✅ Unit Tests: 15/15 passed
✅ E2E Tests: 8/8 passed
✅ Code Coverage: 95%
✅ Compliance Validation: Passed
✅ Security Scan: No vulnerabilities
```

### 3.5 Merge Implementation

```bash
# Safe merge with validation
sc git-smart merge --push --delete-local
```

**Merge Process:**

1. ✅ Pre-merge validation passed
2. ✅ All tests passing
3. ✅ Compliance requirements met
4. ✅ Code quality checks passed
5. ✅ Merged to main branch
6. ✅ Feature branch deleted

---

## Phase 4: Validation & Testing

### 4.1 Comprehensive Testing

```bash
# Move completed requirements to validation phase
sc req update REQ-001.1 --phase=validation

# Run comprehensive validation
sc test validate REQ-001.1 --strict

# Generate test coverage report
sc test run all --coverage --reporter=html
```

### 4.2 Security Validation

```bash
# Run security tests
sc test run security

# Validate encryption implementation
sc compliance validate --framework=iso-13485 --focus=security
```

### 4.3 Performance Testing

```bash
# Run performance tests
sc test run performance --load=1000

# Generate performance report
sc test report --type=performance --output=performance-report.html
```

**Performance Results:**

- Registration endpoint: 50ms average response time
- Password validation: 100ms average (bcrypt overhead)
- Concurrent users: 1000 users/second supported
- Memory usage: 45MB under load

---

## Phase 5: Compliance & Documentation

### 5.1 Generate Compliance Documentation

```bash
# Generate complete compliance report
sc compliance report --framework=iso-13485 --format=html --output=iso-13485-compliance.html

# Generate audit trail
sc docs generate --type=audit --include-git-history

# Create validation documentation
sc docs generate --type=validation --include-test-results
```

### 5.2 Compliance Validation

```bash
# Validate all compliance requirements
sc compliance validate --framework=iso-13485 --strict

# Generate compliance matrix
sc compliance map --detailed --output=compliance-matrix.xlsx
```

**Compliance Results:**

```
ISO 13485 Compliance Status:
✅ 4.1 General Requirements: 100% compliant
✅ 4.2 Documentation Requirements: 100% compliant
✅ 7.3 Design and Development: 95% compliant
✅ 8.2 Monitoring and Measurement: 100% compliant

Overall Compliance: 98.75%
Critical Gaps: None
Recommendations: 2 minor improvements
```

### 5.3 Final Documentation

```bash
# Generate user documentation
sc docs generate --type=user --format=html

# Generate API documentation
sc docs generate --type=api --format=openapi

# Generate deployment guide
sc docs generate --type=deployment --include-compliance
```

---

## Phase 6: Deployment & Monitoring

### 6.1 Production Deployment

```bash
# Validate production readiness
sc deployment validate --environment=production

# Deploy with compliance validation
sc git-smart deploy --environment=production --validate-compliance
```

### 6.2 Monitoring Setup

```bash
# Set up compliance monitoring
sc monitoring setup --compliance=iso-13485

# Configure audit log monitoring
sc monitoring audit --real-time
```

---

## Project Summary

### Final Status

```bash
sc status --format=detailed --include-all
```

**Project Metrics:**

- **Requirements**: 15 total (15 completed, 0 pending)
- **Test Coverage**: 98% (245 tests passing)
- **Compliance**: ISO 13485 - 98.75% compliant
- **Security**: No vulnerabilities detected
- **Performance**: All benchmarks met
- **Documentation**: 100% complete

### Deliverables Generated

1. **Source Code**: Complete user management system
2. **Test Suite**: Unit, integration, and E2E tests
3. **Documentation**: User guides, API docs, compliance docs
4. **Compliance Reports**: ISO 13485 validation and audit trails
5. **Deployment Artifacts**: Production-ready builds
6. **Monitoring**: Real-time compliance and audit monitoring

### Compliance Artifacts

- ✅ Design History File (DHF)
- ✅ Risk Management File (ISO 14971)
- ✅ Software Lifecycle Processes (IEC 62304)
- ✅ Validation and Verification Documentation
- ✅ Audit Trail and Change Control
- ✅ User Training Documentation

---

## Key Workflow Benefits

### 1. **Requirement Traceability**

Every line of code traces back to a specific requirement, ensuring complete coverage and compliance validation.

### 2. **Automated Compliance**

Compliance validation happens automatically at every step, preventing non-compliant code from reaching production.

### 3. **Comprehensive Testing**

Multi-layer testing strategy ensures quality and reliability while maintaining compliance requirements.

### 4. **Audit Trail**

Complete audit trail from requirement creation through deployment, meeting regulatory documentation needs.

### 5. **Visual Progress Tracking**

Dashboard provides real-time visibility into project status, compliance gaps, and completion metrics.

---

## Next Steps

This workflow can be adapted for:

- **Different Compliance Frameworks**: FDA 21 CFR Part 11, SOC2, GDPR
- **Various Project Types**: Web applications, mobile apps, embedded systems
- **Team Collaboration**: Multi-developer teams with role-based access
- **CI/CD Integration**: Automated deployment with compliance validation

### Advanced Features

Explore these advanced Supernal Coding features:

- **Multi-Repository Management**: Manage compliance across multiple projects
- **Custom Compliance Frameworks**: Define organization-specific requirements
- **Advanced Analytics**: Deep insights into development patterns and compliance trends
- **Integration APIs**: Connect with existing tools and workflows

Ready to implement your own compliant system? Start with `sc init --interactive` and follow this workflow pattern!
