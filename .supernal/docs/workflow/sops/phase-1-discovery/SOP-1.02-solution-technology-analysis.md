---
type: sop
category: phase-workflow
sop_id: SOP-1.02
title: Solution & Technology Landscape Analysis
phase: 1
group: null
part_number: null
audience: [architects, product-owners, developers]
read_time: 60
created: 2025-11-21
updated: 2025-11-28
status: needs_approval
version: '1.0'
author: Supernal Coding Team
template_source: https://github.com/supernalintelligence/supernal-coding
template_version: 'main@130c177'
project_name: '@supernal/interface'
reviewedBy: []
reviewDates: []
related_sops: [SOP-0, SOP-1.01]
prerequisites: [SOP-1.01]
tags: [discovery, solution, technology, analysis, competitive]
---

# SOP-1.02: Solution & Technology Landscape Analysis

**Location**: `docs/workflow/sops/phase-1-discovery/SOP-1.02-solution-technology-analysis.md`  
**Phase**: 1 - Discovery  
**Purpose**: Compare existing solutions, technologies, and approaches before designing your own  
**Prerequisites**: SOP-1.01 (Business Vision & Problem Definition)

---

## Overview

**Critical Principle**: Never build without understanding what already exists.

Before designing your solution, you must understand:

1. **Existing solutions** - What's already solving this problem?
2. **Available technologies** - What tools, libraries, and services exist?
3. **Feature comparisons** - What do they do well? What's missing?
4. **Implementation patterns** - How do others approach this?

**Goal**: Move from "I need to build X" to "I will build X using approaches Y and Z, avoiding problems A and B"

---

## Why This Matters

### Common Pitfalls Without This Analysis

❌ Reinventing the wheel (poorly)  
❌ Choosing wrong tech stack  
❌ Missing critical features  
❌ Underestimating complexity  
❌ Building what already exists (better)

### Benefits of Thorough Analysis

✅ Learn from others' mistakes  
✅ Adopt proven patterns  
✅ Make informed technology choices  
✅ Avoid common pitfalls  
✅ Identify gaps in existing solutions  
✅ Set realistic expectations

---

## File Structure for This Phase

```
docs/research_and_analysis/evidence/{YYYY-MM-DD}-{project-name}/
├── 00-business-vision.md              # From SOP-0.01
├── 01-problem-statement.md            # From SOP-0.01
├── 02-icp-profile.md                  # From SOP-0.01
└── competitive-analysis/              # This SOP's outputs
    ├── 03-existing-solutions.md       # Competitive analysis
    ├── 04-technology-comparison.md    # Tech stack comparison
    ├── 05-feature-matrix.md           # Feature comparison chart
    ├── 06-implementation-patterns.md  # How others build this
    └── 07-decision-summary.md         # Your conclusions
```

---

## Step 1: Existing Solutions Analysis

### AI Research Prompt

```
AI: "Let me research existing solutions for [your problem].

I'll analyze:
1. **Commercial products** (SaaS, paid tools)
2. **Open source projects** (GitHub, GitLab)
3. **Similar platforms** (indirect competitors)
4. **Alternative approaches** (different paradigms)

For each, I'll document:
- What it does
- Target users
- Key features
- Pricing/licensing
- Strengths
- Weaknesses
- Why users choose it
- Common complaints

This will take a few minutes. I'll use Perplexity/research to get current information."
```

### Example Output: `03-existing-solutions.md`

```markdown
# Existing Solutions: Data Access Marketplace

## Commercial Products

### 1. Databricks Marketplace

**What**: Data sharing platform for Databricks ecosystem
**Target**: Enterprise ML teams using Databricks
**License**: Commercial (part of Databricks)

**Key Features**:

- Built into Databricks lakehouse
- Delta Sharing protocol
- Direct data access (no copying)
- Enterprise governance

**Strengths**:

- ✅ Seamless Databricks integration
- ✅ Real-time data access
- ✅ Strong governance
- ✅ Established user base

**Weaknesses**:

- ❌ Databricks-only
- ❌ Expensive (enterprise tier)
- ❌ Limited to Delta format
- ❌ Not multi-cloud

**User Feedback**:

- "Great if you're all-in on Databricks"
- "Too expensive for small teams"
- "Vendor lock-in concerns"

**Why This Matters for Us**:

- Shows demand for data access platforms
- Delta Sharing is a proven protocol
- Need multi-cloud support to compete
- Opportunity: serve non-Databricks users

---

### 2. Snowflake Data Marketplace

[Similar analysis...]

---

## Open Source Projects

### 1. DataHub (LinkedIn)

**What**: Metadata management and discovery
**Target**: Data engineers, platform teams
**License**: Apache 2.0

[Detailed analysis...]

---

## Summary Comparison Table

| Solution   | Cloud  | Cost | Integration | Governance | Our Gap        |
| ---------- | ------ | ---- | ----------- | ---------- | -------------- |
| Databricks | Single | $$$$ | Excellent   | Strong     | Multi-cloud    |
| Snowflake  | Multi  | $$$  | Good        | Strong     | OSS needed     |
| DataHub    | Any    | Free | Medium      | Basic      | No marketplace |
| Atlan      | Any    | $$$  | Good        | Medium     | Too expensive  |

## Key Insights

1. All commercial solutions are cloud-specific or expensive
2. OSS solutions lack marketplace features
3. Governance is table stakes
4. Multi-cloud is a differentiator
5. Small teams underserved
```

---

## Step 2: Technology Stack Comparison

### Categories to Analyze

1. **Frontend**
   - Frameworks (React, Vue, Svelte, etc.)
   - State management
   - UI component libraries
   - Build tools

2. **Backend**
   - Languages (Go, Python, Node.js, etc.)
   - Frameworks (FastAPI, Express, Gin, etc.)
   - API patterns (REST, GraphQL, gRPC, tRPC)
   - Authentication/authorization

3. **Database**
   - Relational (PostgreSQL, MySQL, etc.)
   - NoSQL (MongoDB, DynamoDB, etc.)
   - Search (Elasticsearch, Typesense, etc.)
   - Caching (Redis, Memcached, etc.)

4. **Infrastructure**
   - Cloud providers (AWS, GCP, Azure)
   - Container orchestration (Kubernetes, ECS, etc.)
   - CDN and edge
   - Monitoring and observability

5. **Data Processing**
   - ETL/ELT tools
   - Stream processing
   - Batch processing
   - Data formats

### AI Comparison Prompt

```
You: "Compare [Category] technologies for [Use Case]:

**Requirements**:
- [Requirement 1]
- [Requirement 2]
- [Requirement 3]

**Constraints**:
- [Constraint 1]
- [Constraint 2]

Please create a comparison table with:
- Technology options
- Strengths/weaknesses
- Use case fit
- Learning curve
- Community support
- Ecosystem maturity
- Cost considerations

Use research to get current information and real-world experience."
```

### Example Output: `04-technology-comparison.md`

```markdown
# Technology Stack Comparison

## Frontend Framework

### Requirements

- Fast development
- Strong TypeScript support
- Component reusability
- Good performance
- Rich ecosystem

### Comparison

| Framework | Learning Curve | Performance | Ecosystem | TypeScript | Our Fit      |
| --------- | -------------- | ----------- | --------- | ---------- | ------------ |
| **React** | Medium         | Good        | Excellent | Excellent  | ✅ Best      |
| Next.js   | Medium-High    | Excellent   | Excellent | Excellent  | ✅ Ideal     |
| Vue 3     | Easy           | Good        | Good      | Good       | ⚠️ Smaller   |
| Svelte    | Easy           | Excellent   | Growing   | Good       | ⚠️ Early     |
| Angular   | Hard           | Good        | Large     | Native     | ❌ Too heavy |

### Analysis

**React + Next.js**: ✅ RECOMMENDED

- **Why**:
  - Largest talent pool
  - Best TypeScript integration
  - Next.js adds SSR, API routes, static gen
  - Vercel deployment (easy)
  - Rich component libraries (shadcn/ui, Radix)
- **Trade-offs**:
  - More boilerplate than Svelte
  - Need to learn Next.js conventions
- **Evidence**:
  - Used by top companies
  - Active development
  - Strong AI tooling support

---

## Backend Language

| Language | Performance | Productivity | Ecosystem | Deployment | Our Fit     |
| -------- | ----------- | ------------ | --------- | ---------- | ----------- |
| **Go**   | Excellent   | Good         | Good      | Excellent  | ✅ Best     |
| Python   | Good        | Excellent    | Excellent | Good       | ⚠️ Slower   |
| Node.js  | Good        | Excellent    | Excellent | Excellent  | ⚠️ Types    |
| Rust     | Excellent   | Hard         | Growing   | Good       | ❌ Too hard |

**Go**: ✅ RECOMMENDED

- Fast performance
- Simple deployment (single binary)
- Great for APIs and microservices
- Strong standard library
- Excellent concurrency

---

## Database

| Database       | Use Case    | Scalability | Query Flexibility | Ops Complexity | Our Fit               |
| -------------- | ----------- | ----------- | ----------------- | -------------- | --------------------- |
| **PostgreSQL** | Primary     | Excellent   | Excellent         | Medium         | ✅ Best               |
| MongoDB        | Documents   | Excellent   | Good              | Medium         | ⚠️ If needed          |
| Redis          | Cache/Queue | Excellent   | Limited           | Low            | ✅ For cache          |
| Elasticsearch  | Search      | Excellent   | Excellent         | High           | ⚠️ Consider Typesense |

**PostgreSQL**: ✅ RECOMMENDED

- ACID compliance
- JSON support (flexible schema when needed)
- Full-text search (basic)
- Proven reliability
- Wide hosting support

---

## Recommendation Summary

### Proposed Stack

- **Frontend**: Next.js (React + TypeScript)
- **Backend**: Go + Gin framework
- **Database**: PostgreSQL + Redis
- **Search**: Typesense (lighter than Elasticsearch)
- **Infrastructure**: AWS (ECS + RDS + ElastiCache)
- **CDN**: CloudFront
- **Monitoring**: DataDog or Grafana Cloud

### Why This Stack

✅ **Performance**: Go backend, efficient caching
✅ **Developer Experience**: TypeScript everywhere possible
✅ **Reliability**: Proven technologies
✅ **Cost-effective**: No expensive services
✅ **Scalable**: Can grow to millions of users
✅ **Maintainable**: Good tooling and debugging
```

---

## Step 3: Feature Matrix & Gap Analysis

### AI Feature Comparison Prompt

```
You: "Create a detailed feature comparison matrix for:

**Solutions**: [List of competitors]

**Categories**:
1. Core Features
2. User Management
3. Data Access & Security
4. Integration & APIs
5. Monitoring & Analytics
6. Developer Experience

For each feature, indicate:
- ✅ Fully supported
- ⚠️ Partially supported
- ❌ Not supported
- 🔮 Roadmap/beta

Then identify:
- Common features (everyone has)
- Differentiators (only some have)
- Gaps (nobody has well)
- Our opportunities"
```

### Example Output: `05-feature-matrix.md`

```markdown
# Feature Comparison Matrix

## Core Data Access Features

| Feature                  | Databricks | Snowflake | DataHub | Atlan | **Our Opportunity** |
| ------------------------ | ---------- | --------- | ------- | ----- | ------------------- |
| **Discovery**            |
| Search datasets          | ✅         | ✅        | ✅      | ✅    | ⚠️ Table stakes     |
| Semantic search          | ⚠️         | ⚠️        | ✅      | ✅    | ✅ AI-powered       |
| Lineage tracking         | ✅         | ✅        | ✅      | ✅    | ⚠️ Table stakes     |
| Data preview             | ✅         | ✅        | ❌      | ⚠️    | ✅ Better UX        |
| **Access Control**       |
| Role-based access        | ✅         | ✅        | ⚠️      | ✅    | ⚠️ Table stakes     |
| Attribute-based          | ⚠️         | ✅        | ❌      | ⚠️    | ✅ Differentiator   |
| Time-limited access      | ❌         | ❌        | ❌      | ❌    | 🔥 UNIQUE           |
| Auto-expiring tokens     | ⚠️         | ⚠️        | ❌      | ❌    | 🔥 UNIQUE           |
| **Marketplace**          |
| Buy/sell datasets        | ✅         | ✅        | ❌      | ❌    | ✅ Copy best        |
| Subscription model       | ✅         | ✅        | ❌      | ❌    | ✅ Essential        |
| Usage-based pricing      | ✅         | ✅        | ❌      | ❌    | ✅ Essential        |
| Revenue sharing          | ⚠️         | ⚠️        | ❌      | ❌    | ✅ Better terms     |
| **Developer Experience** |
| Python SDK               | ✅         | ✅        | ✅      | ⚠️    | ✅ Must have        |
| REST API                 | ✅         | ✅        | ✅      | ✅    | ✅ Must have        |
| GraphQL API              | ❌         | ❌        | ✅      | ❌    | ✅ Differentiator   |
| CLI tool                 | ✅         | ✅        | ⚠️      | ⚠️    | ✅ Better UX        |
| Local testing            | ❌         | ❌        | ⚠️      | ❌    | 🔥 UNIQUE           |

## Key Insights

### Table Stakes (Everyone Has)

Must implement to be competitive:

- ✅ Dataset search and discovery
- ✅ Basic access control (RBAC)
- ✅ Python SDK
- ✅ REST API
- ✅ Data lineage

### Differentiators (Some Have)

Nice to have, builds competitive advantage:

- ⚠️ Semantic/AI-powered search
- ⚠️ GraphQL API
- ⚠️ Good CLI tooling

### Unique Opportunities (Nobody Has Well)

Our chance to stand out:

- 🔥 **Time-limited access** (auto-expiring datasets)
- 🔥 **Local testing environment** (dev/staging data access)
- 🔥 **Auto-expiring access tokens** (security)
- 🔥 **Better revenue sharing** (80/20 vs 70/30)
- 🔥 **True multi-cloud** (not just AWS or just Snowflake)

### Must Avoid

Features that would be mistakes:

- ❌ Custom query language (SQL is fine)
- ❌ Proprietary data format (use standard formats)
- ❌ Vendor lock-in (support export)
```

---

## Step 4: Implementation Patterns Research

### AI Implementation Research Prompt

```
You: "Research how [companies/projects] implement [specific feature]:

Examples:
- "How does Stripe implement API versioning?"
- "How does GitHub handle real-time notifications?"
- "How does Snowflake implement data sharing?"
- "How does Auth0 handle multi-tenancy?"

For each, document:
1. The approach they use
2. Why they chose it
3. Trade-offs they made
4. What they'd do differently
5. Relevant blog posts, talks, documentation

Use research to find current best practices."
```

### Example Output: `06-implementation-patterns.md`

````markdown
# Implementation Patterns Research

## API Design Patterns

### 1. Versioning Strategy

**Stripe's Approach**: ✅ RECOMMENDED

- Date-based versioning in header
- `Stripe-Version: 2024-11-22`
- No breaking changes in same version
- Long deprecation windows (12-24 months)
- Excellent API changelog

**Why This Works**:

- No `/v1/` `/v2/` URL mess
- Clients control upgrade timing
- Backward compatible
- Easy to test multiple versions

**Our Implementation**:

```typescript
// API middleware
const API_VERSION_HEADER = 'X-API-Version';
const DEFAULT_VERSION = '2024-11-22';

// Client specifies version
headers: {
  'X-API-Version': '2024-11-22'
}
```
````

---

### 2. Authentication Patterns

**Auth0's Multi-Tenancy**: ✅ RECOMMENDED

- Separate database per tenant (data isolation)
- Shared auth infrastructure
- JWT with tenant claim
- Per-tenant API keys

**Our Adaptation**:

```go
type JWTClaims struct {
    UserID   string `json:"user_id"`
    TenantID string `json:"tenant_id"` // Organization
    Role     string `json:"role"`
    jwt.RegisteredClaims
}
```

---

## Data Access Patterns

### 1. Direct Access vs Proxy

**Snowflake's Delta Sharing**: ✅ STUDY THIS

- Uses pre-signed URLs (S3, GCS, Azure Blob)
- No data proxy (performance)
- Time-limited tokens
- Audit logging at source

**Why This Works**:

- Fast (no middleman)
- Scalable (no bottleneck)
- Cost-effective (no bandwidth cost)
- Secure (short-lived tokens)

**Our Implementation**:

```go
// Generate pre-signed URL
func (s *DataAccessService) GenerateAccessURL(
    datasetID string,
    userID string,
    expiresIn time.Duration,
) (string, error) {
    // 1. Verify user permission
    // 2. Generate pre-signed URL (S3/GCS)
    // 3. Log access request
    // 4. Return URL with expiry
}
```

---

### 2. Access Revocation

**GitHub's Token Patterns**: ✅ RECOMMENDED

- Short-lived access tokens (1 hour)
- Long-lived refresh tokens (90 days)
- Token can be revoked instantly
- Separate "fine-grained" tokens for specific resources

**Our Pattern**:

- Access token: 1 hour (dataset access)
- Refresh token: 7 days (renew access)
- Per-dataset tokens (not global)
- Instant revocation in database

---

## Real-Time Updates

### 1. Change Notifications

**GitHub's Approach**: Webhooks + Polling  
**Vercel's Approach**: SSE (Server-Sent Events)  
**Supabase's Approach**: WebSocket subscriptions

**Our Recommendation**: Start simple, grow as needed

- **Phase 1**: Polling (good enough)
- **Phase 2**: Webhooks (scale to thousands)
- **Phase 3**: WebSocket (if real-time chat needed)

---

## Security Patterns

### 1. Rate Limiting

**Stripe's Pattern**: ✅ COPY THIS

- Per-endpoint rate limits
- Per-user limits
- Per-IP limits (unauthenticated)
- Gradual backoff
- Clear error messages

```
HTTP 429 Too Many Requests
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1700000000
Retry-After: 60
```

---

### 2. API Key Management

**SendGrid's Pattern**: ✅ EXCELLENT

- Scoped API keys (read-only, write, admin)
- Per-resource keys (for specific datasets)
- Key rotation without downtime
- Usage tracking per key

---

## Key Takeaways

### Adopt These Patterns

1. ✅ **Stripe-style versioning** (date-based headers)
2. ✅ **Pre-signed URLs** (for data access, like Snowflake)
3. ✅ **Short-lived tokens** (1 hour access, 7 day refresh)
4. ✅ **Scoped API keys** (per-dataset, like SendGrid)
5. ✅ **Clear rate limits** (with helpful headers, like Stripe)

### Avoid These Mistakes

1. ❌ Don't proxy data (use pre-signed URLs)
2. ❌ Don't use URL versioning (`/v1/`, `/v2/`)
3. ❌ Don't use long-lived access tokens
4. ❌ Don't build custom auth (use OAuth2/JWT standards)
5. ❌ Don't skip rate limiting (learned the hard way)

### Research Sources

- Stripe API Documentation
- Snowflake Delta Sharing spec
- Auth0 architecture blog
- SendGrid API key management
- GitHub token docs

````

---

## Step 5: Decision Summary & Technology Decisions

### Final Output: `07-decision-summary.md`

```markdown
# Technology Decisions Summary

## Problem We're Solving
[From SOP-0.01]

## Competitive Landscape
**Existing Solutions**: 5 major competitors
**Market Gap**: Multi-cloud, affordable, dev-friendly
**Our Differentiators**: Time-limited access, local testing, better revenue share

## Technology Stack Decisions

### Frontend: Next.js + TypeScript ✅
**Why**:
- Best DX and ecosystem
- Great TypeScript support
- Built-in API routes (backend-for-frontend)
- Easy deployment (Vercel)

**Alternatives Considered**:
- Vue 3: Smaller ecosystem
- Svelte: Too early, smaller talent pool

---

### Backend: Go + Gin ✅
**Why**:
- Excellent performance
- Simple deployment (single binary)
- Great for APIs
- Strong concurrency

**Alternatives Considered**:
- Python: Slower, packaging complexity
- Node.js: Tried it, TypeScript in backend is messy

---

### Database: PostgreSQL + Redis ✅
**Why**:
- ACID compliance critical for marketplace
- JSON support for flexibility
- Redis for caching and queues

**Alternatives Considered**:
- MongoDB: Don't need document model
- MySQL: PostgreSQL has better JSON support

---

### Data Access: Pre-signed URLs ✅
**Why**:
- No bandwidth bottleneck
- Scalable (S3/GCS handle load)
- Fast (direct access)
- Secure (time-limited)

**Pattern**: Snowflake Delta Sharing approach

---

### Authentication: JWT + OAuth2 ✅
**Why**:
- Industry standard
- Short-lived access tokens (1 hour)
- Refresh tokens (7 days)
- Per-dataset scopes

**Pattern**: Auth0 multi-tenancy + GitHub token model

---

## Implementation Patterns We'll Adopt

1. **API Versioning**: Stripe's date-based headers
2. **Rate Limiting**: Per-endpoint + per-user
3. **Data Access**: Pre-signed URLs (Snowflake pattern)
4. **Token Management**: Short-lived + scoped (GitHub pattern)
5. **API Keys**: Scoped per-dataset (SendGrid pattern)

## Features We'll Build

### MVP (Must Have)
- [x] Dataset discovery (search)
- [x] RBAC (role-based access)
- [x] Python SDK
- [x] REST API
- [x] Basic marketplace

### Phase 2 (Differentiators)
- [ ] Time-limited dataset access (UNIQUE)
- [ ] Local testing environment (UNIQUE)
- [ ] GraphQL API
- [ ] AI-powered search

### Phase 3 (Advanced)
- [ ] Real-time notifications
- [ ] Advanced analytics
- [ ] ML model marketplace

## Risk Mitigation

### Technical Risks
| Risk | Mitigation |
|------|------------|
| Scaling data access | Pre-signed URLs + CDN |
| Database performance | Redis caching + read replicas |
| API rate abuse | Multi-layer rate limiting |
| Security breaches | Short-lived tokens + audit logs |

### Competition Risks
| Risk | Mitigation |
|------|------------|
| Databricks locks us out | Multi-cloud from day 1 |
| Price war | Lower ops cost (Go + efficient design) |
| Feature parity | Focus on unique features first |

## Next Steps

1. **Architecture Design** (SOP Phase 3)
   - System architecture diagram
   - API design
   - Database schema
   - Security model

2. **Technology Validation** (2-week spike)
   - Build proof-of-concept with chosen stack
   - Validate pre-signed URL approach
   - Test authentication flow
   - Measure performance

3. **Requirements Refinement** (SOP Phase 2)
   - Convert insights into user stories
   - Define MVP scope clearly
   - Create acceptance criteria

---

**Date**: 2024-11-22
**Next SOP**: Phase 1 - Requirements Definition
**Key Decision**: Go + Next.js + PostgreSQL + Pre-signed URLs
````

---

## Verification Checklist

Before moving to Phase 1, verify:

### ✅ Research Completeness

- [ ] Analyzed at least 3-5 existing solutions
- [ ] Compared technology options in each category
- [ ] Created feature comparison matrix
- [ ] Researched implementation patterns from industry leaders
- [ ] Documented all decisions with rationale

### ✅ Quality Checks

- [ ] **Multi-Agent Validation**: Had another AI review the research
- [ ] **Second Opinion**: Asked "What did I miss?" or "What's risky?"
- [ ] **Contrarian View**: Explored "Why NOT [chosen technology]?"
- [ ] **Evidence-Based**: All decisions backed by research, not assumptions

### ✅ Documentation

- [ ] All artifacts in `evidence/{date}-{project}/competitive-analysis/`
- [ ] Clear decision summary with rationales
- [ ] Trade-offs explicitly documented
- [ ] Risk mitigation strategies defined

### ✅ Stakeholder Review

- [ ] Technical team reviewed and approved stack
- [ ] Product team agreed on differentiation strategy
- [ ] Security reviewed auth/access patterns
- [ ] Cost analysis completed

---

## Common Mistakes to Avoid

### ❌ Analysis Paralysis

**Don't**: Spend months researching every option  
**Do**: Time-box research (1-2 weeks), make decisions, validate with POC

### ❌ Cargo Cult Engineering

**Don't**: "Google uses X, so we must use X"  
**Do**: Understand WHY they use it and if it fits YOUR context

### ❌ Resume-Driven Development

**Don't**: Choose tech because you want to learn it  
**Do**: Choose based on project needs and team skills

### ❌ Not Invented Here Syndrome

**Don't**: Reject good solutions because they're not your idea  
**Do**: Embrace proven patterns and technologies

### ❌ Hype-Driven Development

**Don't**: Use newest, shiniest tech without validation  
**Do**: Choose mature, proven technologies for critical paths

---

## AI Tips for Better Analysis

### Effective Research Prompts

```
✅ GOOD: "Compare authentication approaches for multi-tenant SaaS:
- Requirements: [specific list]
- Constraints: [specific list]
- Research real-world implementations
- Include trade-offs and gotchas"

❌ BAD: "What's the best auth for SaaS?"
```

### Get Real-World Examples

```
"Find 3 blog posts about companies migrating from X to Y
- Why they migrated
- What problems they hit
- What they'd do differently
- Would they recommend it?"
```

### Challenge Your Assumptions

```
"I'm thinking of using [Technology X].
Play devil's advocate:
- What could go wrong?
- What am I not considering?
- What would make this a bad choice?
- What's the strongest argument AGAINST it?"
```

### Validate Decisions

```
"I've decided on [Stack]. Review my reasoning:
[paste decision summary]

Questions:
1. What did I miss?
2. What's risky?
3. What would you do differently?
4. Rate my reasoning 1-10 and explain"
```

---

## Expected Documentation

### Architecture/Planning

- **Technology Assessment**: `docs/planning/technology-assessment.md` - Comparative analysis of technology options
- **Solution Comparison**: `docs/architecture/system/solution-comparison.md` - Technical evaluation of approaches

### Feature-Specific

- **Feature Folder**: `docs/features/\{domain\}/{feature-name}/technology-options.md` (phase: backlog) - Technology choices for specific features

---

## Navigation

← Previous: See SOP-0.01 (Business Vision See SOP-0.01 (Business Vision [SOP-0.01: Business Vision & Problem][archived] Problem) Problem)  
→ Next: SOP-1.XX: Requirements Definition (Phase 1 - To be created)

[Back to Main Overview](../SOP-0.1-ai-accelerated-workflow-overview.md)
