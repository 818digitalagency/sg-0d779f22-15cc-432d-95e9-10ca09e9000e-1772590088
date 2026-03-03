# Opportunity Finder - System Architecture

## 🏗️ Overview

Opportunity Finder is an enterprise-grade lead intelligence and outreach automation platform designed specifically for New Brunswick businesses. The system ethically aggregates publicly available business data, enriches it with intelligence metrics, and provides powerful tools for discovery, engagement, and conversion.

---

## 📐 Technical Stack

### Frontend
- **Framework**: Next.js 15.2 (Pages Router)
- **Language**: TypeScript
- **UI Library**: React 18.3
- **Styling**: Tailwind CSS v3.4
- **Components**: Shadcn/UI
- **Forms**: React Hook Form + Zod validation
- **Animations**: Framer Motion
- **Icons**: Lucide React

### Backend (To Implement)
- **API Framework**: Node.js with NestJS or Django
- **Database**: PostgreSQL
- **Search Engine**: Elasticsearch or Meilisearch
- **Queue System**: Redis + BullMQ
- **Email Service**: SendGrid, AWS SES, or Postmark
- **Maps**: Google Maps API or Mapbox
- **Authentication**: JWT + OAuth (Google)

### Infrastructure
- **Hosting**: AWS / GCP / Azure
- **CDN**: CloudFront or Cloudflare
- **Monitoring**: Sentry + CloudWatch
- **CI/CD**: GitHub Actions

---

## 🗂️ Database Schema

### Core Tables

#### `businesses` (Lead Data)
```sql
CREATE TABLE businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name VARCHAR(255) NOT NULL,
  contact_name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  postal_code VARCHAR(10) NOT NULL,
  website TEXT,
  description TEXT,
  category VARCHAR(100) NOT NULL,
  estimated_age INTEGER,
  google_rating DECIMAL(2,1),
  review_count INTEGER,
  social_media JSONB,
  data_source VARCHAR(100) NOT NULL,
  lead_score INTEGER NOT NULL CHECK (lead_score >= 0 AND lead_score <= 100),
  website_quality INTEGER CHECK (website_quality >= 0 AND website_quality <= 100),
  engagement_status VARCHAR(50) NOT NULL DEFAULT 'Not Contacted',
  tags TEXT[],
  last_contact_date TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_businesses_city ON businesses(city);
CREATE INDEX idx_businesses_category ON businesses(category);
CREATE INDEX idx_businesses_lead_score ON businesses(lead_score DESC);
CREATE INDEX idx_businesses_engagement ON businesses(engagement_status);
CREATE INDEX idx_businesses_tags ON businesses USING GIN(tags);
```

#### `users`
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  company_name VARCHAR(255),
  role VARCHAR(50) NOT NULL DEFAULT 'sales_user',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

#### `email_campaigns`
```sql
CREATE TABLE email_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  body_html TEXT NOT NULL,
  body_text TEXT NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'draft',
  scheduled_date TIMESTAMP,
  recipients_count INTEGER NOT NULL DEFAULT 0,
  sent_count INTEGER NOT NULL DEFAULT 0,
  opened_count INTEGER NOT NULL DEFAULT 0,
  clicked_count INTEGER NOT NULL DEFAULT 0,
  replied_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

#### `email_campaign_recipients`
```sql
CREATE TABLE email_campaign_recipients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES email_campaigns(id) ON DELETE CASCADE,
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  sent_at TIMESTAMP,
  opened_at TIMESTAMP,
  clicked_at TIMESTAMP,
  replied_at TIMESTAMP,
  bounced_at TIMESTAMP,
  unsubscribed_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_campaign_recipients_campaign ON email_campaign_recipients(campaign_id);
CREATE INDEX idx_campaign_recipients_business ON email_campaign_recipients(business_id);
```

#### `data_scraping_logs`
```sql
CREATE TABLE data_scraping_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL,
  records_found INTEGER NOT NULL DEFAULT 0,
  records_created INTEGER NOT NULL DEFAULT 0,
  records_updated INTEGER NOT NULL DEFAULT 0,
  errors TEXT[],
  started_at TIMESTAMP NOT NULL,
  completed_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

---

## 🔄 Data Collection Engine

### Modular Scraping Architecture

```
┌─────────────────────────────────────┐
│     Scraping Orchestrator           │
│  (Redis Queue + BullMQ Workers)     │
└─────────────────────────────────────┘
                  │
      ┌───────────┴───────────┐
      │                       │
┌─────▼─────┐         ┌──────▼──────┐
│  Source   │         │   Source    │
│ Adapters  │         │  Adapters   │
└───────────┘         └─────────────┘
      │                       │
┌─────▼─────────────────────▼─────┐
│    Data Validation Layer         │
│  (Schema + Deduplication)        │
└──────────────────────────────────┘
                  │
┌─────────────────▼─────────────────┐
│     PostgreSQL Database           │
└───────────────────────────────────┘
```

### Data Sources
1. **Government Registries**
   - NB Corporate Registry (official API if available)
   - Public business license databases

2. **Business Directories**
   - Chamber of Commerce listings
   - Industry-specific directories
   - Municipal business databases

3. **Google Business**
   - Google Places API (official, compliant)
   - Extract: ratings, reviews, hours, categories

4. **Public Web Data**
   - Respect robots.txt
   - Rate limiting (1-2 req/sec per domain)
   - Rotating IP pools
   - User-agent identification

### Compliance Rules
- ✅ Only public data
- ✅ Respect robots.txt
- ✅ Rate limiting
- ✅ Log all sources
- ✅ Unsubscribe mechanisms
- ✅ CASL compliance

---

## 🧠 Lead Scoring Algorithm

```typescript
function calculateLeadScore(business: Business): number {
  let score = 0;
  
  // Business Age (max 20 points)
  if (business.estimatedAge) {
    if (business.estimatedAge >= 5 && business.estimatedAge <= 15) score += 20;
    else if (business.estimatedAge > 15) score += 15;
    else score += 10;
  }
  
  // Google Rating (max 25 points)
  if (business.googleRating) {
    score += Math.round(business.googleRating * 5);
  }
  
  // Review Count (max 15 points)
  if (business.reviewCount) {
    if (business.reviewCount >= 50) score += 15;
    else if (business.reviewCount >= 20) score += 10;
    else if (business.reviewCount >= 5) score += 5;
  }
  
  // Website Quality (max 20 points)
  if (business.websiteQuality) {
    score += Math.round(business.websiteQuality * 0.2);
  }
  
  // Digital Presence (max 10 points)
  if (business.website) score += 5;
  if (business.socialMedia) {
    const platforms = Object.keys(business.socialMedia).length;
    score += Math.min(platforms * 2, 5);
  }
  
  // Contact Availability (max 10 points)
  if (business.email) score += 5;
  if (business.phone) score += 5;
  
  return Math.min(score, 100);
}
```

---

## 📧 Email Automation System

### Campaign Workflow
```
Create Campaign → Select Recipients → Schedule/Send → Track Engagement → Auto Follow-up
```

### Email Tracking
- **Open Tracking**: Invisible 1x1 pixel image
- **Click Tracking**: URL rewrites with tracking parameters
- **Reply Detection**: SMTP webhook listeners
- **Bounce Handling**: Parse SMTP bounce codes

### CASL Compliance
- Explicit consent checkboxes
- Clear identification of sender
- Unsubscribe link in every email
- Unsubscribe processed within 10 business days
- Audit trail of all communications

---

## 🗺️ Interactive Map Implementation

### Technology Options

**Option A: Google Maps**
```typescript
// Google Maps with clustering
import { GoogleMap, MarkerClusterer, InfoWindow } from '@react-google-maps/api';

const markers = leads.map(lead => ({
  position: { lat: lead.latitude, lng: lead.longitude },
  data: lead
}));
```

**Option B: Mapbox**
```typescript
// Mapbox GL with custom styling
import mapboxgl from 'mapbox-gl';

map.addLayer({
  id: 'leads',
  type: 'circle',
  source: 'leads',
  paint: {
    'circle-color': ['get', 'scoreColor'],
    'circle-radius': 8
  }
});
```

### Map Features
- Cluster markers by municipality
- Color-coded by lead score
- Click marker → side panel with full details
- Filter by category, city, score
- Export visible leads

---

## 🔐 Security Architecture

### Authentication
- JWT tokens (access + refresh)
- OAuth 2.0 (Google login)
- Password hashing with bcrypt (10 rounds)
- MFA support (TOTP)

### Authorization
- Role-based access control (RBAC)
- Admin vs Sales User permissions
- API rate limiting per user tier

### Data Protection
- Encryption at rest (AES-256)
- TLS 1.3 for data in transit
- Regular security audits
- GDPR-ready data export/deletion

---

## 📊 Analytics & Reporting

### Dashboard Metrics
- Total leads by category/city
- Lead score distribution
- Email campaign performance
- Conversion funnel
- Geographic heat maps
- Time-series growth charts

### Export Formats
- CSV (Excel-compatible)
- Excel (.xlsx) with formatting
- PDF summary reports
- JSON API responses

---

## 🚀 Deployment Strategy

### Production Environment
```yaml
services:
  web:
    image: opportunity-finder/web:latest
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://...
      - REDIS_URL=redis://...
    
  worker:
    image: opportunity-finder/worker:latest
    replicas: 3
    
  postgres:
    image: postgres:15
    volumes:
      - postgres_data:/var/lib/postgresql/data
    
  redis:
    image: redis:7-alpine
    
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
```

### CI/CD Pipeline
1. **Git Push** → GitHub Actions trigger
2. **Test Suite** → Unit + Integration tests
3. **Build** → Docker images
4. **Deploy Staging** → Smoke tests
5. **Deploy Production** → Blue-green deployment
6. **Monitor** → Sentry + CloudWatch alerts

---

## 🔮 Phase 2 Roadmap

### AI Enhancement Features
- **AI-Generated Proposals**: GPT-4 integration for personalized emails
- **Predictive Lead Scoring**: ML model trained on conversion data
- **Smart Follow-up Timing**: AI determines optimal send times
- **Lead Insights**: Natural language summaries of business opportunities
- **Chatbot Support**: AI assistant for users

### Expansion Features
- Multi-province support (Nova Scotia, PEI, etc.)
- CRM integrations (Salesforce, HubSpot)
- Mobile apps (iOS/Android)
- API marketplace
- White-label solution

---

## 📞 Support & Maintenance

### Monitoring
- Application performance (response times, errors)
- Database health (query performance, replication lag)
- Scraping jobs (success rate, data quality)
- Email deliverability (bounce rates, spam scores)

### Backup Strategy
- Database: Daily full + hourly incremental
- File storage: Real-time replication
- Retention: 30 days rolling

### Support Channels
- In-app chat
- Email support (support@opportunityfinder.ca)
- Knowledge base
- Video tutorials

---

**Last Updated**: March 3, 2026  
**Version**: 1.0.0  
**Status**: Development