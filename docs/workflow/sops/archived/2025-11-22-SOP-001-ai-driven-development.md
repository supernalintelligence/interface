# SOP-001: AI-Driven Development

**Purpose**: Complete guide to working with AI from initial business idea through production  
**Scope**: All development work using AI as collaborative partner  
**Based on**: AWS AI-DLC adapted for Supernal Coding + evidence-based development

---

## Overview

This SOP guides you through **the entire development journey** with AI, starting from anywhere between "I have a business idea" to "Feature is in production "

**Core Principle**: Build evidence (validate with multiple perspectives) → Generate plans → (validate with multiple perspectives)s → Implement → Deploy Evaluate

---

## The Complete Journey

### Stage 0: Discovery - "What Should We Build?"

**Goal**: Gather evidence about market, competitors, user needs

#### Step 0.1: Market Research (AI-Assisted)

**You start**:

```
You: "I'm thinking about building a data marketplace platform"
```

**AI investigates with you**:

```
AI: "Let me help you research this space. I'll investigate:

1. Existing solutions:
   - What are the major data marketplace platforms?
   - Open source alternatives?
   - Closed source commercial products?

2. Market landscape:
   - Who are the key players?
   - What problems do they solve well?
   - What gaps exist?

3. Technical approaches:
   - Common architectures?
   - Technology stacks?
   - Integration patterns?

Should I start researching? This will take 5-10 minutes."
```

**You approve**:

```
You: "Yes, research all three areas"
```

**AI researches** (using web search, documentation, papers):

```
AI: [After researching]

"Here's what I found:

**Existing Solutions**:
1. AWS Data Exchange - Enterprise, $$$, full AWS integration
2. Snowflake Marketplace - Data sharing focused
3. Dawex - European, compliance-heavy
4. Open source: Apache DataHub (metadata), Delta Sharing (data)

**Market Gaps I Identified**:
- Most are vendor-locked
- Limited support for cross-cloud data sharing
- Complex pricing models
- Poor support for temporary/rental access

**Technical Patterns**:
- Metadata catalogs (critical)
- Proxy/staging patterns for data access
- Usage-based billing
- Step Functions for workflows

**Questions for you**:
1. Which gap resonates with your vision?
2. Any specific compliance needs (GDPR, HIPAA)?
3. Target customers (enterprises, SMBs, developers)?
4. Cloud preference (AWS, multi-cloud)?

Want me to dive deeper into any area?"
```

**You refine**:

```
You: "Focus on gap #3 and #4 - temporary data access for ML teams.
Target: ML engineers at tech companies.
AWS-first but not locked in."
```

**AI creates evidence document**:

```
AI: "I'll document this evidence in:
docs/research_and_analysis/evidence/2025-11-22-data-marketplace-research.md

Created with:
- Competitor analysis (6 platforms)
- Gap analysis (temporary access opportunity)
- Target persona (ML engineers)
- Technical patterns discovered
- Market size estimates
- All sources cited

Should I also:
1. Research existing open source components we can leverage?
2. Find case studies of similar products?
3. Identify potential technical risks early?"
```

**You expand**:

```
You: "Yes to all three"
```

#### Step 0.2: User Research (AI-Assisted)

```
AI: "Now let's understand user needs. I can help by:

1. Generating interview questions for ML engineers
2. Analyzing existing user feedback (if you have any)
3. Researching common pain points in data access
4. Creating user personas

Where should I start?"

You: "Generate interview questions"

AI: "Here are 15 questions organized by topic:

**Current Workflow**:
1. How do you currently access external datasets?
2. What tools do you use?
3. Biggest pain points?

**Temporary Access Needs**:
4. How often do you need temporary data?
5. For how long typically?
6. What happens when access expires?

**Decision Making**:
7. How do you evaluate dataset quality?
8. What metadata do you need?
9. Budget approval process?

[... 6 more questions]

Want me to:
A) Create a survey form?
B) Generate follow-up questions?
C) Research industry benchmarks?"

You: "B and C"

AI: [Generates follow-ups and researches]

"Follow-up questions ready. Also found:
- 73% of ML teams report data access delays
- Average wait time: 2-3 weeks for external data
- Manual contracts slow things down

This validates the temporary access opportunity.
Should I create user stories based on this evidence?"
```

#### Step 0.3: Evidence Compilation

**AI synthesizes**:

```
AI: "I've compiled all evidence. Summary:

**Opportunity**: Temporary data marketplace for ML teams
**Gap**: No easy way to rent data for experiments
**User Pain**: 2-3 week delays, manual contracts
**Competitors**: Focus on permanent access
**Our Angle**: Self-service, temporary, usage-based

**Evidence Documents Created**:
1. Market research (docs/research_and_analysis/evidence/)
2. User interview questions
3. Competitor analysis
4. Technical patterns

Ready to move to user story generation?"
```

---

### Stage 1: Inception - "What Exactly Should We Build?"

**Goal**: Transform evidence into actionable user stories and features

#### Step 1.1: Generate User Stories (AI-Driven)

```
You: "Generate user stories based on the evidence"

AI: "Before I generate stories, let me clarify:

1. **Scope**: Are we building MVP or full platform?
2. **Prioritization**: What's the #1 user pain to solve first?
3. **Constraints**: Timeline? Team size? Budget?
4. **Compliance**: Any regulatory requirements?

For a data marketplace, I'm thinking about:
- GDPR (data privacy)
- SOC2 (security)
- Data residency requirements

Should I research these compliance needs first?"

You: "MVP scope. #1 pain: accessing data for 7-day experiment.
Just me + AI for now. Research GDPR basics."

AI: [Researches GDPR for data marketplaces]

"GDPR Key Points for Data Marketplace:
- Need user consent mechanisms
- Data processing agreements required
- Right to access/delete
- Data breach notification (72 hours)

Now generating user stories with GDPR in mind..."
```

**AI generates stories**:

```
AI: "Generated 15 user stories. Here are the top 5 for MVP:

**US-001: Dataset Discovery**
As an ML engineer
I want to search for datasets by domain/topic
So that I can find relevant data for my project

Acceptance Criteria:
- Search by keywords
- Filter by data type, size, price
- Preview sample data
- See dataset metadata

**US-002: Temporary Access Request**
As an ML engineer
I want to rent a dataset for 7 days
So that I can experiment without long-term commitment

Acceptance Criteria:
- Select rental duration (1-30 days)
- See pricing for duration
- Click-to-approve rental
- Immediate access upon payment

**US-003: Secure Data Access**
As an ML engineer
I want to access rented data via API
So that I can integrate into my ML pipeline

Acceptance Criteria:
- Temporary API credentials
- Auto-revoke after rental expires
- Usage tracking
- Rate limiting

**US-004: Dataset Preview** [non-MVP]
**US-005: Usage Analytics** [non-MVP]
...

**Questions**:
1. Does US-001, 002, 003 cover the MVP scope?
2. Any stories missing?
3. Should I break these down further?
4. Want me to generate technical requirements next?"
```

**You validate and refine**:

```
You: "US-001 and 002 good. For US-003, also need:
- Support for bulk download (not just API)
- Access via S3 bucket (not just API)"

AI: "Updated US-003 with:
- Access methods: API, S3, Bulk Download
- Let user choose preferred method

This adds complexity. Should I:
A) Create separate stories for each access method?
B) Keep as options in US-003?
C) Research which is most common in competitors?"

You: "C first, then decide"

AI: [Researches]

"Competitor analysis shows:
- 60% offer S3 access (most common)
- 30% offer API only
- 10% offer bulk download

Recommendation: Start with S3 (US-003a), add API later (US-003b).
Simpler MVP, covers majority use case.

Should I split the story?"

You: "Yes, split"

AI: "Split into:
- US-003a: S3 Access (MVP)
- US-003b: API Access (Post-MVP)

MVP stories finalized: US-001, US-002, US-003a

Ready for domain modeling?"
```

#### Step 1.2: Domain Modeling (AI-Driven)

```
AI: "Based on user stories, I need to model the domain.

Let me ask clarifying questions first:

**Data Model Questions**:
1. Is a 'Dataset' a single file or a collection?
2. Can datasets have multiple versions?
3. How do sellers list datasets (manual, automated)?
4. Can sellers update datasets during active rentals?

**Rental Model Questions**:
5. Can users extend rentals?
6. What happens to data when rental expires?
7. Can users download data or only access via S3?
8. Refund policy?

**Access Control Questions**:
9. Separate AWS accounts per user?
10. Shared account with IAM roles?
11. VPC requirements?

I'll research industry patterns while you answer."
```

**You answer + AI researches**:

```
You: [Provides answers]

AI: [After research]

"Based on your answers + industry research, here's the domain model:

**Core Entities**:

1. **Dataset**
   - Attributes: id, name, description, category, size, price_per_day
   - Owned by Seller
   - Has Versions (support updates)

2. **Rental**
   - Attributes: id, dataset_id, buyer_id, start_date, end_date, status
   - Links Dataset to Buyer
   - Manages access lifecycle

3. **AccessCredentials**
   - Attributes: id, rental_id, s3_bucket, iam_role, expires_at
   - Temporary credentials
   - Auto-revoked on expiry

4. **User** (Buyer & Seller)
   - Attributes: id, email, aws_account_id, stripe_customer_id
   - Can be both buyer and seller

**Domain Events**:
- RentalCreated → Generate AccessCredentials
- RentalExpired → Revoke AccessCredentials
- DatasetUpdated → Notify active renters

**Questions for you**:
1. Does this capture the business logic?
2. Any missing entities or relationships?
3. Should I research common marketplace patterns for payments?

Also, I found AWS Data Exchange uses a similar model.
Should I analyze their approach?"
```

#### Step 1.3: Multi-Agent Validation (Your Strategy)

**You validate with multiple perspectives**:

```
You: [Opens new chat with clean context]

"Review this domain model for a data marketplace.
Look for: missing entities, scaling issues, security concerns:
[pastes domain model]"

New AI Agent: "I see potential issues:

1. **Missing Entity**: DatasetMetadata
   - Current model lacks schema, quality metrics
   - ML users need this for evaluation

2. **Scaling Concern**: AccessCredentials per rental
   - Could be millions of records
   - Suggest TTL-based cleanup

3. **Security**: User entity stores aws_account_id
   - Risk: exposes AWS accounts
   - Recommend: Store account ID hashed

Want detailed analysis?"

You: [Takes feedback back to original chat]

"The validation agent identified 3 issues:
1. Missing DatasetMetadata entity
2. AccessCredentials scaling
3. AWS account ID security

Can you address these?"

Original AI: "Good catches! Updated model:

1. Added **DatasetMetadata** entity:
   - schema, column_descriptions, quality_score, sample_data

2. AccessCredentials:
   - Added TTL (7 days after rental end)
   - Auto-cleanup via DynamoDB TTL

3. Security:
   - Hash aws_account_id in storage
   - Only decrypt when creating credentials

Want me to research other security best practices?"
```

#### Step 1.4: Feature Decomposition (AI-Driven)

```
AI: "Now let's break this into features (Units in AI-DLC).

I propose 4 features for MVP:

**Feature 1: Dataset Catalog** (US-001)
- Search & discovery
- Metadata display
- Sample data preview
- Complexity: Medium (3-5 days)

**Feature 2: Rental Management** (US-002)
- Rental request flow
- Payment processing
- Rental lifecycle
- Complexity: High (5-7 days)

**Feature 3: Access Provisioning** (US-003a)
- S3 bucket setup
- IAM role creation
- Temporary credential generation
- Complexity: High (5-7 days)

**Feature 4: Seller Onboarding** (new)
- Dataset upload
- Metadata entry
- Pricing setup
- Complexity: Medium (3-5 days)

**Questions**:
1. Is Feature 4 needed for MVP or can I manually onboard sellers?
2. Should I research simpler alternatives for Feature 3?
3. Any features missing?
4. Want me to generate requirements for each feature?"

You: "Feature 4 can be manual. Research Feature 3 alternatives."

AI: [Researches]

"Feature 3 alternatives found:

**Option A**: AWS IAM (current proposal)
- Pros: Native, secure, granular
- Cons: Complex, 1000+ IAM roles could be issue

**Option B**: Pre-signed S3 URLs
- Pros: Simple, no IAM needed
- Cons: Time-limited (7 days max), URL sharing risk

**Option C**: S3 Access Points
- Pros: Simpler than IAM, per-dataset control
- Cons: Newer feature, less tested

For 7-day rentals, I recommend **Option B** for MVP simplicity.
Upgrade to Option A for production.

Sound good?"

You: "Yes, Option B for MVP"

AI: "Updated Feature 3:
- **Access Provisioning** (Simplified)
- Use pre-signed S3 URLs
- 7-day expiry
- Complexity: Low (2-3 days)

MVP timeline estimate: 13-18 days (3 weeks)
With 2-4 features per day velocity: ~1 week actual

Ready to generate detailed requirements?"
```

---

### Stage 2: Requirements - "What Exactly Should Each Feature Do?"

#### Step 2.1: Generate Requirements (AI-Driven, per Feature)

```
You: "Generate requirements for Feature 1: Dataset Catalog"

AI: "Before generating requirements, let me research:
1. Best practices for dataset search UIs
2. Metadata standards for datasets
3. Preview mechanisms (security implications)

Also, should I check our existing patterns for:
- Search functionality?
- API design?
- Frontend components?

This will ensure consistency."

You: "Research 1 and 2. Check existing API patterns."

AI: [Researches, checks codebase]

"Research findings:
- DCAT (Data Catalog Vocabulary) is W3C standard for metadata
- Google Dataset Search uses schema.org/Dataset
- AWS Data Exchange shows: name, description, tags, preview

Our existing patterns (from docs/architecture/):
- REST API with OpenAPI spec
- Elasticsearch for search
- React + TailwindCSS for UI

Generating requirements using these patterns..."
```

**AI generates requirement**:

```
AI: "Created REQ-042: Dataset Catalog Search

**Title**: Dataset Catalog Search and Discovery

**User Story**: US-001

**Description**:
Implement search and discovery interface for datasets with
metadata display and sample preview.

**Acceptance Criteria** (Given/When/Then):

Scenario: Search by keyword
  Given I am on the dataset catalog page
  When I enter "financial data" in the search box
  Then I see all datasets tagged with "financial"
  And results show name, description, size, price

Scenario: Filter by category
  Given I see search results
  When I select "Healthcare" category filter
  Then results show only healthcare datasets
  And filter count updates

Scenario: Preview sample data
  Given I click "Preview" on a dataset
  When the preview modal opens
  Then I see first 10 rows
  And I see column names and types
  And download sample button is disabled (security)

**Technical Specifications**:

API Endpoints:
- GET /api/v1/datasets?q=keyword&category=filter&page=1
- GET /api/v1/datasets/\{id\}/sample (authenticated)

Data Model:
- Use DCAT metadata standard
- Elasticsearch for full-text search
- S3 for sample data storage

Frontend:
- React component: DatasetSearchBar
- TailwindCSS styling
- Debounced search (300ms)

**Security Requirements**:
- Sample data: max 10 rows, no PII
- Rate limiting: 100 requests/minute
- Authentication required for preview

**Compliance**:
- GDPR: No PII in samples
- Data attribution required

**Non-Functional Requirements**:
- Search response < 200ms (p95)
- Support 10,000+ datasets
- Mobile responsive

**Dependencies**:
- Elasticsearch cluster (ops setup)
- S3 bucket for samples (ops setup)

**Questions for you**:
1. Does this cover US-001 completely?
2. Any missing scenarios?
3. Should I add more security controls?
4. Ready for test generation?"

You: "Add scenario for 'no results found'. Otherwise good."

AI: "Added:

Scenario: No results found
  Given I search for \"nonexistent-data\"
  When no datasets match
  Then I see helpful message
  And I see suggested searches
  And I can clear filters

Updated REQ-042. Validating..."
```

#### Step 2.2: Validate Requirement (AI-Driven)

```
AI: "Running validation:

sc req validate 042

Results:
✅ Frontmatter valid
✅ 4 Gherkin scenarios found
✅ All scenarios well-formed
✅ Security requirements present
✅ NFRs defined
⚠️  Warning: No error handling scenarios

Should I add error handling scenarios (API failures, timeouts)?"

You: "Yes, add them"

AI: "Added 2 more scenarios:

Scenario: Search API timeout
  Given the search API is slow
  When request exceeds 5 seconds
  Then I see \"Search is taking longer than usual\"
  And I can retry

Scenario: Search API error
  Given the search API returns 500 error
  When the error occurs
  Then I see user-friendly error message
  And error is logged for debugging
  And I can retry

Re-validating... ✅ All checks pass

Ready to generate tests?"
```

---

### Stage 3: Test Planning - "How Do We Test This?"

#### Step 3.1: Generate Tests (AI-Driven)

```
AI: "Before generating tests, should I:
1. Research testing best practices for search UIs?
2. Check our existing test patterns?
3. Look for edge cases I might miss?

Also, test types needed:
- Unit tests (services, utilities)
- Integration tests (API endpoints)
- E2E tests (user flows)
- All three?"

You: "All three. Research 1 and 3."

AI: [Researches]

"Research findings:

**Search UI Testing Best Practices**:
- Test debouncing behavior
- Test with special characters
- Test pagination edge cases
- Test filter combinations

**Edge Cases Found**:
- Empty search query
- Very long search query (>1000 chars)
- SQL injection attempts
- Unicode in search
- Simultaneous filter changes

Generating tests with these in mind..."
```

**AI generates tests**:

```
AI: sc req generate-tests 042

Created test files:
📁 tests/requirements/req-042/
  ├── e2e/
  │   ├── dataset-search.spec.js (6 scenarios)
  │   ├── dataset-preview.spec.js (4 scenarios)
  │   └── error-handling.spec.js (3 scenarios)
  ├── integration/
  │   ├── search-api.test.js (15 tests)
  │   └── preview-api.test.js (8 tests)
  ├── unit/
  │   ├── search-service.test.js (20 tests)
  │   ├── debounce.test.js (5 tests)
  │   └── filter-builder.test.js (12 tests)
  └── fixtures/
      ├── sample-datasets.json
      └── search-responses.json

Total: 73 tests generated

**Special tests added** (from research):
- SQL injection prevention
- XSS in search results
- Unicode handling
- Debounce timing
- Error retry logic

Running tests (should all fail - no implementation yet)...

Results: 0/73 passing ✅ (Expected)

Ready for implementation?"
```

---

### Stage 4: Implementation - "Build It!"

**[Continue to next message due to length...]**

Should I continue with the implementation, deployment, and monitoring stages?
