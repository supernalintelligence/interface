---
type: sop
category: phase-workflow
sop_id: SOP-1.01
title: Business Vision & Problem Definition
phase: 1
group: null
part_number: null
audience: [business, product-owners]
read_time: 45
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
related_sops: [SOP-0, SOP-1.02]
prerequisites: []
tags: [discovery, business, vision, problem, icp]
---

# SOP-1.01: Business Vision & Problem Definition

**Location**: `docs/workflow/sops/phase-1-discovery/SOP-1.01-business-vision-and-problem.md`  
**Phase**: 1 - Discovery  
**Purpose**: Transform business idea into validated problem statement with ICP  
**Prerequisites**: None (starting point)

---

## Overview

This is **Step 1** of development: articulating your business vision clearly and validating the problem exists.

**Goal**: Move from "I have an idea" to "I have validated problem X for customer Y"

---

## File Structure for This Phase

```
docs/research_and_analysis/evidence/
└── {YYYY-MM-DD}-{project-name}/
    ├── 00-business-vision.md          # This SOP's output
    ├── 01-problem-statement.md         # Refined problem
    ├── 02-icp-profile.md               # Ideal Customer Profile
    └── validation/
        ├── customer-interviews.md
        └── problem-validation-notes.md
```

**Naming Convention**:

- Date prefix: `YYYY-MM-DD` (when started)
- Descriptive name: `project-name` (kebab-case)
- Numbered files: `00-`, `01-`, `02-` (sequence matters)

---

## Step 1: Articulate Your Vision

### What You Start With

```
You: "I want to solve X because I think it's a problem"
```

### AI Helps You Articulate

```
AI: "Let's clarify your vision. I'll ask questions to help you articulate this clearly:

**Understanding the Problem**:
1. What specific problem are you trying to solve?
2. Why do you believe this is a problem?
3. Who experiences this problem?
4. How are they solving it today (if at all)?
5. What makes their current solution inadequate?

**Your Motivation**:
6. Why are you personally motivated to solve this?
7. What unique insight or experience do you have?
8. What makes this the right time to solve it?

**Success Vision**:
9. What does success look like in 1 year?
10. How will you measure success?
11. What changes in the world if you succeed?

Take your time answering. I'll help refine as we go."
```

### Example Conversation

```
You: "I want to solve data access for ML teams because I think it's too slow"

AI: "Good start. Let me help you be more specific:

**Question 1**: What specifically is too slow?
- Finding datasets?
- Getting approval?
- Receiving access?
- All of the above?

You: "Getting approval and receiving access. Can take weeks."

AI: "Excellent. That's specific.

**Question 2**: Why do you think this is weeks instead of minutes?
- Legal/compliance review?
- Manual processes?
- Multiple approval layers?
- Technical complexity?

You: "Mostly manual approvals and contract negotiations"

AI: "Now we're getting somewhere.

**Question 3**: Who specifically experiences this?
- Data scientists?
- ML engineers?
- Data analysts?
- Research teams?

You: "ML engineers doing experiments. They need data for 1-2 weeks, but the approval process assumes permanent access."

AI: "Aha! The mismatch is:
- **Need**: Temporary access (1-2 weeks)
- **Process**: Built for permanent access

Is that the core insight?"

You: "Yes, exactly!"

AI: "Perfect. Let me draft your problem statement..."
```

---

## Step 2: Draft Problem Statement

### AI Synthesizes

```
AI: "Based on our conversation, here's your problem statement:

---

**Problem**: ML engineers need temporary access to external datasets for experiments (1-2 weeks), but current procurement processes are designed for permanent data purchases, causing 2-3 week delays that block rapid experimentation.

**Why It Matters**: ML experimentation requires trying multiple datasets quickly. Current delays make this impossible, forcing teams to:
- Use suboptimal data
- Skip experiments
- Maintain expensive permanent data they rarely use

**Your Unique Insight**: The mismatch between temporary need and permanent process is the bottleneck, not technical access.

---

Does this capture your vision? Any adjustments?"
```

### You Refine

```
You: "Close, but add: compliance teams also slow down because they review as if it's permanent data storage"

AI: "Updated:

**Problem**: ML engineers need temporary access to external datasets for experiments (1-2 weeks), but current procurement AND compliance processes are designed for permanent data purchases/storage, causing 2-3 week delays.

**Compliance Angle**: Compliance teams perform full audits (data residency, retention policies, security reviews) for what should be a temporary rental, adding 1-2 weeks to approval.

Better?"

You: "Perfect"
```

---

## Step 3: Define Ideal Customer Profile (ICP)

### AI Asks Discovery Questions

```
AI: "Now let's define who experiences this problem most acutely.

**Company Characteristics**:
1. Company size (employees)?
2. Industry/sector?
3. Tech maturity (engineering-driven, traditional, etc.)?
4. Annual revenue range?
5. Geographic location?

**Team Characteristics**:
6. Team size experiencing problem?
7. Their role/title?
8. Their technical sophistication?
9. Budget authority?
10. Decision-making process?

**Problem Intensity**:
11. How often do they face this problem?
12. What's the cost of the problem (time, money, opportunity)?
13. Have they tried to solve it already?
14. What alternatives are they using?

Let's start with company characteristics. What size companies?"
```

### Example ICP Development

```
You: "Mid-size tech companies, 100-1000 employees, engineering-driven"

AI: "Good. Let's get more specific:

**Industry focus?**
- All tech companies?
- Specific verticals (fintech, healthcare, e-commerce)?

You: "Start with fintech and e-commerce - they experiment with data constantly"

AI: "Excellent. Those are data-intensive.

**Geography?**
- US only?
- US + Europe?
- Global?

You: "US first, but solution should work for EU (GDPR compliance)"

AI: "Important constraint noted.

Now, the team:

**Who on the team feels this pain most?**

You: "ML engineers and data scientists on experimentation teams"

AI: "Let me get specific about them:

**Their day-to-day**:
- Building production ML models?
- Research/experimentation?
- Both?

You: "Mostly research and experimentation. Production teams have permanent data."

AI: "So the pain is specifically for **experimentation teams**, not production.

**Team size?**

You: "Usually 3-10 ML engineers per company"

AI: "Got it. Small, specialized teams.

**Do they have budget authority?**

You: "Usually need manager approval, but under $10K they can move fast"

AI: "Critical insight! Sub-$10K is your sweet spot for fast deals.

Let me draft the ICP..."
```

---

## Step 4: ICP Document

### AI Synthesizes

```
AI: "Here's your Ideal Customer Profile:

---

**Company Profile**:
- **Size**: 100-1,000 employees
- **Industry**: Fintech, E-commerce (data-intensive)
- **Culture**: Engineering-driven, fast-moving
- **Geography**: US (initially), EU-ready (GDPR)
- **Tech Stack**: Cloud-native (AWS/GCP)

**Team Profile**:
- **Role**: ML Engineer / Data Scientist
- **Team**: Experimentation/Research (3-10 people)
- **Manager**: Head of ML or VP Engineering
- **Budget**: $5K-$50K/year for experiments
- **Fast Path**: < $10K purchases (manager approval)
- **Pain Point**: 2-3 week data access delays

**Behavioral Characteristics**:
- Experiment with 5-10 datasets per quarter
- Need data for 1-2 weeks per experiment
- Currently: Buy permanent access (wasteful) or skip experiments
- Tech-savvy: Can use APIs, S3, etc.
- Compliance-aware: Need GDPR, SOC2 basics

**Decision Criteria**:
1. Speed (hours, not weeks)
2. Cost (pay for what you use)
3. Compliance (automatic, not manual review)
4. Ease of use (self-service)

**Red Flags** (not your ICP):
- Large enterprises (too slow)
- Traditional companies (not experimenting)
- Production ML teams (need permanent data)
- Research institutions (no budget)

---

Does this match who you're building for?"
```

### You Validate

```
You: "Yes, but add: They're currently using AWS for infrastructure"

AI: "Updated Company Profile:
- **Cloud**: AWS-native (leverage existing tools)

This is important - means we can integrate with their existing AWS setup.

Should I also note:
- Familiar with S3, IAM?
- Using SageMaker or similar?
- Comfortable with APIs?

These would inform technical design."

You: "Yes to all three"

AI: "Updated ICP with technical sophistication notes.

Ready to save this?"
```

---

## Step 5: Document and Save

### File Creation

```
AI: "I'll create the evidence documents:

Creating:
docs/research_and_analysis/evidence/2025-11-22-data-marketplace-mvp/

Files:
1. 00-business-vision.md
2. 01-problem-statement.md
3. 02-icp-profile.md

Should I also create:
4. 03-success-metrics.md (how you'll measure success)?
5. validation/ folder (for future validation notes)?
```

### Document Structure

**File: `00-business-vision.md`**

```markdown
---
created: 2025-11-22
updated: 2025-11-22
status: needs_approval
author: [your name]
validation_required: true
---

# Business Vision: Temporary Data Marketplace

## The Big Idea

Enable ML engineers to rent external datasets for experimentation (1-2 weeks) without procurement delays.

## Why This Matters

Current 2-3 week delays block rapid experimentation, forcing teams to use suboptimal data or skip experiments entirely.

## Unique Insight

The bottleneck isn't technical access - it's the mismatch between temporary needs and permanent processes (procurement + compliance).

## Success Vision (1 Year)

- 50+ companies using platform
- Avg time to data: < 1 hour (vs 2-3 weeks)
- 1000+ experiments enabled
- $500K ARR

## Next Steps

- [ ] Validate problem with 10 target customers
- [ ] Research existing solutions
- [ ] Define MVP scope
```

**File: `02-icp-profile.md`**

```markdown
---
created: 2025-11-22
icp_version: 1.0
validation_status: needs_approval
---

# Ideal Customer Profile

[Full ICP from above]

## Validation Plan

- [ ] Interview 5 ML engineers at target companies
- [ ] Survey 20+ via LinkedIn
- [ ] Join ML communities (Reddit, Discord)
- [ ] Analyze competitor customer bases

## Assumptions to Test

1. Is 2-3 weeks actually the delay? (verify)
2. Is < $10K the fast-path budget? (verify)
3. Do they experiment 5-10 times/quarter? (verify)
4. Is this fintech/ecommerce specific? (test other verticals)
```

---

## Verification: How Do I Know This Is Right?

### ✅ Good Vision Statement

**Has**:

- [ ] Specific problem (not "data is hard")
- [ ] Target customer (not "everyone")
- [ ] Unique insight (not obvious)
- [ ] Measurable success criteria
- [ ] Why now? (timing/context)

**Doesn't Have**:

- [ ] Solution details (those come later)
- [ ] Technical specifications
- [ ] Vague phrases ("revolutionize", "disrupt")

### ✅ Good ICP

**Has**:

- [ ] Specific company size (not "SMB to Enterprise")
- [ ] 2-3 industries maximum (not "all industries")
- [ ] Specific roles/titles
- [ ] Budget range
- [ ] Decision-making process
- [ ] Current alternatives (what they do today)

**Doesn't Have**:

- [ ] "Anyone who needs X"
- [ ] Too many customer segments
- [ ] Unrealistic characteristics

---

## Multi-Agent Validation Strategy

### Validation Prompt (New Chat/AI)

```
"I'm building a product. Review this business vision and ICP for:
1. Specificity - Is the problem concrete?
2. Market size - Does this ICP = viable market?
3. Assumptions - What assumptions need testing?
4. Red flags - Any warning signs?

[Paste vision + ICP]

Be critical. What could go wrong?"
```

### Example Validation

```
Validation AI: "I see several strengths and concerns:

**Strengths**:
✅ Specific problem (2-3 week delays)
✅ Clear target (ML experimentation teams)
✅ Unique angle (temporary vs permanent)

**Concerns**:
⚠️  Market size: 100-1000 employee companies with ML teams = maybe 500-1000 companies in US. That's small.
⚠️  Assumption: Do they really pay per experiment? Or is procurement overhead the same regardless?
⚠️  Competition: AWS Data Exchange, Snowflake Marketplace already exist. Why aren't they solving this?

**Assumptions to Test Urgently**:
1. Will companies use self-service for $5K+ purchases?
2. Can you actually simplify compliance review?
3. Is 2-3 weeks consistent or just one bad experience?

**Recommendation**: Talk to 10 ML engineers BEFORE building anything."
```

### Incorporate Feedback

```
You: [Back to original AI]

"Validation agent raised concerns about:
1. Market size (500-1000 companies = small)
2. Why AWS Data Exchange doesn't solve this
3. Need to validate 2-3 week delay is consistent

Thoughts?"

AI: "Excellent feedback. Let's address:

**Market Size**: You're right - might be small. Should we:
A) Expand ICP (larger companies, more industries)?
B) Validate 500-1000 is enough for $10M ARR?
C) Find adjacent markets?

**AWS Data Exchange**: I should research why they don't solve this. Let me investigate...

[Researches]

Found: AWS Data Exchange is for permanent datasets, minimum 1-year licenses. Confirms your insight about temporary vs permanent gap!

**2-3 Week Validation**: Critical to test. Should I draft interview questions?"

You: "B and yes to interview questions"

AI: "Calculating: 500 companies × $10K/year = $5M TAM. Need 20% penetration for $1M ARR. Achievable but tight.

Should we expand to include:
- Data analysts? (broader than just ML)
- Companies 50-100 employees? (small startups)
- Healthcare/pharma? (also data-intensive)

Each could 2-3x the market."
```

---

## AI Questions to Expect at This Stage

**Problem Clarity**:

- "Can you give me a specific example of someone experiencing this?"
- "What's the cost of this problem (time, money, opportunity)?"
- "Why hasn't someone solved this already?"

**Customer Understanding**:

- "Who's the economic buyer vs the user?"
- "What's their budget process?"
- "How do they evaluate new tools?"

**Validation Planning**:

- "How will you test these assumptions?"
- "Who should we talk to first?"
- "What would invalidate this idea?"

**Scoping**:

- "Is this a $1M problem or $100M problem?"
- "Are you solving just this or a platform?"
- "What's the MVP vs full vision?"

---

## Common Pitfalls

### ❌ Pitfall 1: Solution in Search of Problem

```
Bad: "I want to build a blockchain-based data marketplace"
     (Solution first)

Good: "ML teams waste 2-3 weeks getting data access"
      (Problem first)
```

### ❌ Pitfall 2: Everyone is the Customer

```
Bad: "Anyone who needs data"

Good: "ML engineers at 100-1000 person fintech companies"
```

### ❌ Pitfall 3: Unvalidated Assumptions

```
Bad: "I know this is a problem because I experienced it once"

Good: "I experienced it, and I'll validate by interviewing 10 others"
```

---

## Success Criteria for This SOP

Before moving to SOP-003 (Competitor Intelligence), you should have:

- [ ] **Business Vision Document** (00-business-vision.md)
  - Clear problem statement
  - Why it matters
  - Success metrics

- [ ] **ICP Document** (02-icp-profile.md)
  - Specific company profile
  - Specific buyer/user profile
  - Budget and decision-making process

- [ ] **Validation Plan**
  - 5-10 customers to interview
  - Key assumptions to test
  - Timeline for validation

- [ ] **Multi-Agent Validation**
  - Second AI reviewed and raised concerns
  - Concerns addressed or added to validation plan

- [ ] **Founder Clarity**
  - You can explain the problem in 2 sentences
  - You can describe your ICP in 1 minute
  - You know your riskiest assumptions

---

## Next SOP

**SOP-0.02: Competitor Intelligence** →  
Research existing solutions (open source, closed source, packages, patterns)

---

## Expected Documentation

### Architecture/Planning (Broad-scale)

- **Vision Document**: `docs/planning/vision.md` - High-level business vision and strategy
- **Problem Statement**: `docs/planning/problem-statement.md` - Core problem definition
- **Business Case**: `docs/planning/business-case.md` - ROI justification

### Feature-Specific

- **Feature Folder**: `docs/features/\{domain\}/{feature-name}/` (phase: backlog)
  - `strategy.md` - Feature-level vision and business case
  - `problem.md` - Problem this feature solves

### Small Changes

- Problem statements can be documented in issue descriptions or requirement frontmatter

---

## Related SOPs

- [SOP-0: Complete Development Workflow](../SOP-0-overview-complete-workflow.md)
- [SOP-0.1: AI-Driven Development Principles](../SOP-0.1-ai-accelerated-workflow-overview.md)
- [SOP-1.02: Solution & Technology Analysis](./SOP-1.02-solution-technology-analysis.md)
