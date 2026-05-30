---
id: supernal-ai-deployment
title: Supernal.ai Integration Deployment Guide
description: Technical deployment guide for code.supernal.ai using GitHub Pages and Vercel
category: deployment
tags: [deployment, github-pages, vercel, production]
status: active
created: 2025-11-22
lastUpdated: 2025-11-22
---

# Supernal.ai Integration Deployment Guide

This guide outlines the technical steps to deploy the Supernal Coding documentation to `code.supernal.ai` using **GitHub Pages** for static hosting and **Vercel** for API services.

## 🏗️ Architecture Overview

**Recommended Architecture: GitHub Pages + Vercel**

```
┌─────────────────────────────────────────────────────────┐
│                 code.supernal.ai                        │
│              (GitHub Pages - Static)                   │
│  • Documentation (Docusaurus)                          │
│  • Blog posts                                          │
│  • Static assets                                       │
└─────────────────────┬───────────────────────────────────┘
                      │
┌─────────────────────┼───────────────────────────────────┐
│              api.code.supernal.ai                       │
│               (Vercel - APIs)                           │
│  • Dashboard API (Port 3001 → Serverless)              │
│  • Requirements API                                     │
│  • Premium Features API                                 │
│  • Analytics & Insights                                 │
└─────────────────────┴───────────────────────────────────┘
```

**Benefits of This Approach:**

- **GitHub Pages**: Free, reliable hosting for static sites
- **Vercel**: Excellent for APIs, serverless functions, auto-scaling
- **Cost Effective**: Free tiers for both platforms
- **Easy CI/CD**: GitHub Actions for docs, Vercel for APIs
- **Performance**: CDN included with both platforms

## 🚀 Phase 1: GitHub Pages Documentation Setup

### 1.1 DNS Configuration

```bash
# Add CNAME record to your DNS provider
# Type: CNAME
# Name: code
# Value: supernalintelligence.github.io
# TTL: 300 (5 minutes)
```

### 1.2 GitHub Pages Setup

```bash
# In your repository settings:
# 1. Go to Settings → Pages
# 2. Source: Deploy from a branch
# 3. Branch: gh-pages (will be created by GitHub Actions)
# 4. Custom domain: code.supernal.ai
```

### 1.3 GitHub Actions Workflow

Create `.github/workflows/deploy-docs.yml`:

```yaml
name: Deploy Documentation to GitHub Pages

on:
  push:
    branches: [main]
    paths: ['documentation/**']
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: 'pages'
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: documentation/package-lock.json

      - name: Install dependencies
        run: |
          cd documentation
          npm ci

      - name: Build documentation
        run: |
          cd documentation
          npm run build

      - name: Setup Pages
        uses: actions/configure-pages@v3

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v2
        with:
          path: documentation/build

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v2
```

## 🚀 Phase 2: Vercel API Setup

### 2.1 Vercel Project Setup

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy API from project root
vercel --prod

# Configure custom domain
vercel domains add api.code.supernal.ai
vercel alias api.code.supernal.ai
```

### 2.2 Vercel Configuration (`vercel.json`)

Create in project root:

```json
{
  "version": 2,
  "name": "supernal-coding-api",
  "builds": [
    {
      "src": "dashboard/server.js",
      "use": "@vercel/node"
    },
    {
      "src": "dashboard/routes/*.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/dashboard/server.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  },
  "functions": {
    "dashboard/server.js": {
      "maxDuration": 10
    }
  }
}
```

### 2.3 API Structure for Vercel

#### 2.3.1 Open Source APIs (Free for all users)

```javascript
// Available at https://api.code.supernal.ai
GET / api / requirements; // Project requirements data
GET / api / stats; // Basic project statistics
GET / api / health; // Health check endpoint
GET / api / kanban; // Kanban board data
GET / api / hierarchy; // Requirement-task hierarchy
GET / api / features; // Available features by auth status
```

#### 2.3.2 Premium APIs (Supernal.ai subscription required)

```javascript
// Available at https://api.code.supernal.ai (with auth)
GET /api/analytics/advanced    // Advanced project analytics
GET /api/team/sync            // Team collaboration features
POST /api/export/advanced     // Premium export formats
POST /api/ai/insights         // AI-powered suggestions
GET /api/usage/stats          // Usage analytics
```

### 2.4 Serverless Functions Structure

```
dashboard/
├── api/
│   ├── requirements.js      // GET /api/requirements
│   ├── stats.js            // GET /api/stats
│   ├── health.js           // GET /api/health
│   ├── features.js         // GET /api/features
│   └── premium/
│       ├── analytics.js    // GET /api/analytics/advanced
│       ├── export.js       // POST /api/export/advanced
│       └── ai-insights.js  // POST /api/ai/insights
├── routes/
│   └── premium-api.js      // Premium route handlers
└── server.js               // Main server entry point
```

## Phase 3: Progressive Enhancement Strategy

### 3.1 Open Source First Approach

- Full functionality available without registration
- Clear value demonstration
- Gradual premium feature introduction

### 3.2 Premium Feature Integration

```javascript
// Example: Progressive enhancement in dashboard
if (user.isAuthenticated && user.hasSubscription) {
  // Show advanced analytics
  showPremiumAnalytics();
} else {
  // Show basic stats with upgrade prompt
  showBasicStatsWithUpgrade();
}
```

## Phase 4: Environment Configuration

### 4.1 Environment Variables

```bash
# Production (.env.production)
NODE_ENV=production
SUPERNAL_API_BASE_URL=https://api.code.supernal.ai
SUPERNAL_AUTH_URL=https://auth.supernal.ai
ENABLE_PREMIUM_FEATURES=true

# Development (.env.local)
NODE_ENV=development
SUPERNAL_API_BASE_URL=http://localhost:8000
SUPERNAL_AUTH_URL=http://localhost:8001
ENABLE_PREMIUM_FEATURES=false
```

### 4.2 Build Configuration

```javascript
// documentation/docusaurus.config.ts
const isProd = process.env.NODE_ENV === 'production';

const config = {
  url: isProd ? 'https://code.supernal.ai' : 'http://localhost:3002',
  baseUrl: '/',
  // ... rest of config
};
```

## 🔄 Integration Testing Plan

### Testing Checklist

- [ ] Documentation builds successfully
- [ ] All internal links work
- [ ] API endpoints respond correctly
- [ ] Premium feature prompts display appropriately
- [ ] Mobile responsiveness verified
- [ ] SSL certificate working
- [ ] Analytics tracking implemented

### Testing Commands

```bash
# Local testing
cd documentation
npm run start

# Production build testing
npm run build
npm run serve

# API endpoint testing
curl https://code.supernal.ai/api/health
curl https://code.supernal.ai/api/stats
```

## 📊 Analytics and Monitoring

### Key Metrics to Track

- Documentation page views
- API endpoint usage
- Premium feature click-through rates
- User registration conversion
- Documentation search queries

### Implementation

```javascript
// Google Analytics 4 + Custom Events
gtag('event', 'premium_feature_clicked', {
  feature_name: 'advanced_analytics',
  user_type: 'anonymous',
});
```

## 🚦 Launch Sequence

### Pre-Launch (T-7 days)

- [ ] DNS propagation complete
- [ ] SSL certificate active
- [ ] All links tested
- [ ] Analytics configured
- [ ] Error monitoring setup

### Launch Day (T-0)

- [ ] Final deployment to production
- [ ] DNS switching
- [ ] Monitoring dashboard active
- [ ] Team notification
- [ ] Social media announcement

### Post-Launch (T+1 week)

- [ ] Performance monitoring review
- [ ] User feedback collection
- [ ] Conversion rate analysis
- [ ] Bug fixes and optimizations

## 🔒 Security Considerations

### API Security

- Rate limiting on all endpoints
- CORS configuration for allowed origins
- Authentication for premium features
- Input validation and sanitization

### Documentation Security

- Content Security Policy (CSP) headers
- HTTPS everywhere
- Regular dependency updates
- Security headers configuration

## 💰 Revenue Integration Points

### Conversion Opportunities

1. **Dashboard Premium Features**: "Unlock Advanced Analytics"
2. **Export Options**: "Export to PDF/Excel requires Premium"
3. **Team Features**: "Invite Team Members with Premium"
4. **AI Insights**: "Get AI-powered suggestions with Premium"

### Implementation Example

```javascript
// Premium feature gate
function showExportOptions() {
  if (user.isPremium) {
    return ['JSON', 'Markdown', 'PDF', 'Excel', 'Word'];
  } else {
    return ['JSON', 'Markdown', 'PDF (Premium)', 'Excel (Premium)'];
  }
}
```

---

This deployment strategy ensures a smooth transition from open source to premium features while maintaining the full value of the open source offering.
