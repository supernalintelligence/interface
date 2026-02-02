# Analytics Integration Guide

How to integrate SI tracking with your analytics infrastructure, similar to Google Analytics (gtag).

## Architecture Overview

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Your App      │────▶│  SI Tracker      │────▶│ Analytics API   │
│   (React)       │     │  (batched)       │     │ (your backend)  │
└─────────────────┘     └──────────────────┘     └─────────────────┘
                                                          │
                                                          ▼
                                                 ┌─────────────────┐
                                                 │   Dashboard     │
                                                 │  (Supernal or   │
                                                 │   your own)     │
                                                 └─────────────────┘
```

## Option 1: Self-Hosted Analytics

### Setup Endpoint

```typescript
// app/api/v1/analytics/route.ts
import { NextRequest } from 'next/server';

// Your API key validation
const VALID_API_KEYS = new Set([
  process.env.SI_ANALYTICS_API_KEY,
]);

export async function POST(request: NextRequest) {
  // Validate API key
  const apiKey = request.headers.get('x-si-api-key');
  if (!VALID_API_KEYS.has(apiKey)) {
    return Response.json({ error: 'Invalid API key' }, { status: 401 });
  }

  const { events, userId } = await request.json();

  // Store events in your database
  await db.si_interactions.insertMany(
    events.map(event => ({
      ...event,
      user_id: userId,
      api_key: apiKey,
      created_at: new Date(),
    }))
  );

  return Response.json({ success: true, logged: events.length });
}
```

### Configure Tracker with API Key

```typescript
// lib/analytics.ts
import { createTracker } from '@supernal/interface';

export const tracker = createTracker({
  endpoint: '/api/v1/analytics',
  customFetch: async (url, options) => {
    return fetch(url, {
      ...options,
      headers: {
        ...options?.headers,
        'x-si-api-key': process.env.NEXT_PUBLIC_SI_API_KEY!,
      },
    });
  },
});
```

## Option 2: Supernal Analytics Service

Send events to Supernal's hosted analytics service:

```typescript
import { createTracker } from '@supernal/interface';

export const tracker = createTracker({
  endpoint: 'https://analytics.supernal.ai/v1/events',
  customFetch: async (url, options) => {
    return fetch(url, {
      ...options,
      headers: {
        ...options?.headers,
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPERNAL_API_KEY}`,
        'X-App-Id': process.env.NEXT_PUBLIC_SUPERNAL_APP_ID!,
      },
    });
  },
});
```

## Visualization Options

### 1. Built-in Dashboard Component

```tsx
import { AnalyticsDashboard } from '@supernal/interface/analytics';

function AdminPage() {
  return (
    <AnalyticsDashboard
      apiKey={process.env.SUPERNAL_API_KEY}
      dateRange={{ start: '2024-01-01', end: '2024-01-31' }}
      metrics={['views', 'engagement', 'scrollDepth']}
    />
  );
}
```

### 2. API for Custom Dashboards

```typescript
// Fetch aggregated metrics
const metrics = await fetch('/api/v1/analytics?view=summary', {
  headers: { 'x-si-api-key': apiKey },
}).then(r => r.json());

// Response structure
{
  period: { start: '2024-01-01', end: '2024-01-31' },
  totals: {
    interactions: 15420,
    uniqueSessions: 3200,
    byComponent: {
      PostCard: 8500,
      Feed: 4200,
      EvaluationCard: 2720,
    },
    byAction: {
      view: 10000,
      click: 3000,
      scroll: 1500,
      like: 920,
    },
  },
  engagement: {
    avgDurationMs: 45000,
    avgScrollDepth: 68,
    bounceRate: 0.23,
  },
}
```

### 3. Export to External Analytics

Forward events to your existing analytics:

```typescript
const tracker = createTracker({
  endpoint: '/api/v1/analytics',
  customFetch: async (url, options) => {
    const body = JSON.parse(options?.body as string);
    
    // Also send to Google Analytics
    body.events.forEach(event => {
      gtag('event', event.action, {
        event_category: event.componentId,
        event_label: event.targetId,
      });
    });
    
    // Send to your backend
    return fetch(url, options);
  },
});
```

## Database Schema

Recommended schema for storing events:

```sql
CREATE TABLE si_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  api_key TEXT NOT NULL,
  session_id TEXT NOT NULL,
  user_id TEXT,
  component_id TEXT NOT NULL,
  action TEXT NOT NULL,
  target_id TEXT,
  metadata JSONB DEFAULT '{}',
  client_timestamp TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX idx_si_interactions_session ON si_interactions(session_id);
CREATE INDEX idx_si_interactions_action ON si_interactions(action);
CREATE INDEX idx_si_interactions_created ON si_interactions(created_at);
CREATE INDEX idx_si_interactions_target ON si_interactions(target_id) WHERE target_id IS NOT NULL;

-- Materialized view for daily aggregates
CREATE MATERIALIZED VIEW si_daily_stats AS
SELECT
  DATE(created_at) as date,
  component_id,
  action,
  COUNT(*) as count,
  COUNT(DISTINCT session_id) as unique_sessions
FROM si_interactions
GROUP BY DATE(created_at), component_id, action;
```

## Environment Variables

```bash
# .env.local
NEXT_PUBLIC_SI_API_KEY=si_xxx         # Client-side key (limited permissions)
SI_ANALYTICS_API_KEY=si_admin_xxx     # Server-side key (full access)
SUPERNAL_APP_ID=app_xxx               # If using Supernal hosted service
```

## Rate Limiting

Implement rate limiting on your analytics endpoint:

```typescript
const rateLimiter = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(apiKey: string, limit = 1000, windowMs = 60000) {
  const now = Date.now();
  const entry = rateLimiter.get(apiKey) || { count: 0, resetAt: now + windowMs };
  
  if (now > entry.resetAt) {
    entry.count = 0;
    entry.resetAt = now + windowMs;
  }
  
  if (entry.count >= limit) {
    return false;
  }
  
  entry.count++;
  rateLimiter.set(apiKey, entry);
  return true;
}
```

## Privacy Considerations

1. **IP Anonymization**: Hash or truncate IP addresses
2. **User Consent**: Integrate with cookie consent banners
3. **Data Retention**: Set automatic deletion policies
4. **GDPR Export**: Include analytics in data export requests

```typescript
// Disable tracking if no consent
if (!hasAnalyticsConsent()) {
  tracker.setUserId(null);
  // Optionally disable entirely:
  // tracker.destroy();
}
```
