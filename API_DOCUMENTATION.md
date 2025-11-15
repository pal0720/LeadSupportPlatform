# AI-Driven GTM Platform - API Documentation

**Version:** 2.0.0 (Multi-Tenant SaaS)
**Last Updated:** 2025-11-15

## Table of Contents

1. [Authentication](#authentication)
2. [Workspaces & Multi-Tenancy](#workspaces--multi-tenancy)
3. [AI Agents & Orchestration](#ai-agents--orchestration)
4. [Deals & CRM](#deals--crm)
5. [Marketing Journeys](#marketing-journeys)
6. [Campaigns & Content](#campaigns--content)
7. [Integrations](#integrations)
8. [Common Patterns](#common-patterns)

---

## Authentication

All API requests require authentication via JWT tokens (to be implemented).

### Endpoints

```
POST   /api/v1/auth/register    - Register new user
POST   /api/v1/auth/login       - Login and get JWT token
POST   /api/v1/auth/refresh     - Refresh JWT token
POST   /api/v1/auth/logout      - Logout (invalidate token)
GET    /api/v1/users/me         - Get current user profile
```

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

---

## Workspaces & Multi-Tenancy

### Overview
All resources are isolated by workspace. Users can be members of multiple workspaces with different roles.

### Workspace Endpoints

#### Create Workspace
```http
POST /api/v1/workspaces/
```

**Request Body:**
```json
{
  "name": "Acme Corp Marketing",
  "slug": "acme-marketing",
  "billing_email": "billing@acme.com"
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "name": "Acme Corp Marketing",
  "slug": "acme-marketing",
  "subscription_tier": "free",
  "status": "trial",
  "trial_ends_at": "2025-11-29T00:00:00",
  "max_users": 2,
  "max_contacts": 1000,
  "max_ai_requests_per_month": 100,
  "created_at": "2025-11-15T10:00:00"
}
```

#### List Workspaces
```http
GET /api/v1/workspaces/
```

Returns all workspaces the current user is a member of.

#### Get Workspace
```http
GET /api/v1/workspaces/{workspace_id}
```

#### Update Workspace
```http
PATCH /api/v1/workspaces/{workspace_id}
```

**Required Role:** Owner or Admin

**Request Body:**
```json
{
  "name": "Updated Name",
  "brand_voice": "Professional, friendly, and data-driven",
  "settings": {
    "timezone": "America/New_York",
    "business_hours": {"start": "09:00", "end": "17:00"}
  }
}
```

#### Delete Workspace
```http
DELETE /api/v1/workspaces/{workspace_id}
```

**Required Role:** Owner only

### Workspace Members

#### List Members
```http
GET /api/v1/workspaces/{workspace_id}/members
```

**Response:**
```json
[
  {
    "id": "uuid",
    "user_id": "uuid",
    "role": "owner",
    "joined_at": "2025-11-15T10:00:00",
    "user": {
      "email": "john@acme.com",
      "full_name": "John Doe"
    }
  }
]
```

#### Add Member
```http
POST /api/v1/workspaces/{workspace_id}/members
```

**Request Body:**
```json
{
  "user_id": "uuid",
  "role": "sales_rep"
}
```

**Roles:**
- `owner` - Full access including billing
- `admin` - Full access except billing
- `marketing_manager` - Marketing campaigns and content
- `sales_rep` - Leads, deals, and sequences
- `support_agent` - Tickets and support
- `executive` - Read-only dashboards
- `guest` - Limited read-only access

#### Update Member
```http
PATCH /api/v1/workspaces/{workspace_id}/members/{member_id}
```

#### Remove Member
```http
DELETE /api/v1/workspaces/{workspace_id}/members/{member_id}
```

### Brand Kit

#### Get Brand Kit
```http
GET /api/v1/workspaces/{workspace_id}/brand-kit
```

#### Update Brand Kit
```http
PATCH /api/v1/workspaces/{workspace_id}/brand-kit
```

**Request Body:**
```json
{
  "logo_url": "https://cdn.acme.com/logo.png",
  "primary_color": "#FF6B6B",
  "secondary_color": "#4ECDC4",
  "accent_color": "#FFE66D",
  "font_heading": "Montserrat",
  "font_body": "Open Sans",
  "brand_voice_tone": "professional",
  "brand_voice_description": "We speak with authority but remain approachable",
  "messaging_guidelines": {
    "dos": ["Use data to support claims", "Be concise"],
    "donts": ["Use jargon", "Make unsupported claims"]
  }
}
```

---

## AI Agents & Orchestration

### Overview
The platform includes 7 specialized AI agents:
- **Orchestrator** - Routes requests to appropriate agents
- **CRM Data** - Data entry, enrichment, deduplication
- **Marketing** - Campaign optimization, A/B testing
- **Content** - Multimodal content generation
- **Lead Gen** - Lead scoring, personalization
- **Support** - Ticket handling, knowledge base
- **Analytics** - Insights, forecasting

### AI Agent Endpoints

#### Create AI Agent
```http
POST /api/v1/ai-agents/{workspace_id}/agents
```

**Request Body:**
```json
{
  "agent_type": "marketing",
  "name": "Marketing Optimizer",
  "description": "Optimizes campaign performance",
  "system_prompt": "You are a marketing expert...",
  "model": "gpt-4-turbo-preview",
  "temperature": 0.7,
  "config": {
    "max_iterations": 5,
    "tools": ["web_search", "calculator"]
  }
}
```

#### List AI Agents
```http
GET /api/v1/ai-agents/{workspace_id}/agents?agent_type=marketing&status=idle
```

#### Get AI Agent
```http
GET /api/v1/ai-agents/{workspace_id}/agents/{agent_id}
```

#### Update AI Agent
```http
PATCH /api/v1/ai-agents/{workspace_id}/agents/{agent_id}
```

#### Delete AI Agent
```http
DELETE /api/v1/ai-agents/{workspace_id}/agents/{agent_id}
```

### Agent Tasks

#### Create Agent Task
```http
POST /api/v1/ai-agents/{workspace_id}/tasks
```

**Request Body:**
```json
{
  "agent_type": "content",
  "task_type": "generate_blog_post",
  "priority": "high",
  "input_data": {
    "topic": "AI in Marketing",
    "target_length": 1500,
    "keywords": ["AI", "automation", "ROI"]
  }
}
```

**Note:** If `agent_type` is omitted, the Orchestrator agent will automatically route to the appropriate specialized agent.

**Response:**
```json
{
  "id": "uuid",
  "agent_id": "uuid",
  "task_type": "generate_blog_post",
  "status": "pending",
  "input_data": {...},
  "created_at": "2025-11-15T10:00:00"
}
```

#### List Agent Tasks
```http
GET /api/v1/ai-agents/{workspace_id}/tasks?status=pending&limit=50
```

#### Get Agent Task
```http
GET /api/v1/ai-agents/{workspace_id}/tasks/{task_id}
```

#### Update Agent Task
```http
PATCH /api/v1/ai-agents/{workspace_id}/tasks/{task_id}
```

**Request Body:**
```json
{
  "status": "completed",
  "output_data": {
    "content": "Generated blog post...",
    "word_count": 1523
  }
}
```

### Agent Conversations

#### Create Conversation
```http
POST /api/v1/ai-agents/{workspace_id}/conversations
```

**Request Body:**
```json
{
  "agent_id": "uuid",
  "title": "Campaign Strategy Discussion",
  "context": {
    "campaign_id": "uuid",
    "goal": "increase_conversions"
  }
}
```

#### List Conversations
```http
GET /api/v1/ai-agents/{workspace_id}/conversations?agent_id=uuid
```

#### Send Message
```http
POST /api/v1/ai-agents/{workspace_id}/conversations/{conversation_id}/messages
```

**Request Body:**
```json
{
  "role": "user",
  "content": "What are the best times to post on LinkedIn?",
  "metadata": {
    "source": "dashboard"
  }
}
```

### Agent Knowledge Base (RAG)

#### Add Knowledge
```http
POST /api/v1/ai-agents/{workspace_id}/knowledge
```

**Request Body:**
```json
{
  "knowledge_type": "faq",
  "title": "How to calculate CAC",
  "content": "Customer Acquisition Cost (CAC) is calculated by...",
  "agent_types": ["marketing", "analytics"],
  "metadata": {
    "category": "metrics",
    "difficulty": "intermediate"
  }
}
```

#### List Knowledge
```http
GET /api/v1/ai-agents/{workspace_id}/knowledge?agent_type=marketing&limit=100
```

#### Search Knowledge (Semantic Search)
```http
GET /api/v1/ai-agents/{workspace_id}/knowledge/search?q=customer+retention&limit=10
```

---

## Deals & CRM

### Pipelines

#### Create Pipeline
```http
POST /api/v1/deals/{workspace_id}/pipelines
```

**Request Body:**
```json
{
  "name": "Sales Pipeline",
  "is_default": true,
  "stages": [
    {"name": "Prospecting", "probability": 10, "color": "#E3F2FD"},
    {"name": "Qualification", "probability": 25, "color": "#BBDEFB"},
    {"name": "Proposal", "probability": 50, "color": "#90CAF9"},
    {"name": "Negotiation", "probability": 75, "color": "#64B5F6"},
    {"name": "Closed Won", "probability": 100, "color": "#4CAF50"},
    {"name": "Closed Lost", "probability": 0, "color": "#F44336"}
  ]
}
```

#### List Pipelines
```http
GET /api/v1/deals/{workspace_id}/pipelines
```

### Deals/Opportunities

#### Create Deal
```http
POST /api/v1/deals/{workspace_id}/deals
```

**Request Body:**
```json
{
  "company_id": "uuid",
  "primary_contact_id": "uuid",
  "pipeline_id": "uuid",
  "name": "Enterprise Package - Acme Corp",
  "stage": "qualification",
  "amount": 50000,
  "currency": "USD",
  "probability": 25,
  "expected_close_date": "2025-12-31",
  "description": "50 user licenses, premium support",
  "tags": ["enterprise", "high-value"],
  "custom_fields": {
    "contract_length": "12 months",
    "payment_terms": "net 30"
  }
}
```

#### List Deals
```http
GET /api/v1/deals/{workspace_id}/deals?stage=qualification&company_id=uuid&limit=100
```

**Filters:**
- `stage` - Filter by deal stage
- `pipeline_id` - Filter by pipeline
- `company_id` - Filter by company
- `owner_id` - Filter by deal owner
- `limit` / `offset` - Pagination

#### Get Deal
```http
GET /api/v1/deals/{workspace_id}/deals/{deal_id}
```

**Response includes:**
- Deal details
- Related company
- Primary contact
- Deal owner
- Activities
- Notes

#### Update Deal
```http
PATCH /api/v1/deals/{workspace_id}/deals/{deal_id}
```

**Request Body:**
```json
{
  "stage": "proposal",
  "probability": 50,
  "amount": 55000,
  "expected_close_date": "2025-12-15"
}
```

**Note:** Updates automatically create timeline events.

#### Delete Deal
```http
DELETE /api/v1/deals/{workspace_id}/deals/{deal_id}
```

### Activities

#### Create Activity
```http
POST /api/v1/deals/{workspace_id}/activities
```

**Request Body:**
```json
{
  "activity_type": "meeting",
  "title": "Product Demo with Acme Corp",
  "description": "Demonstrate new AI features",
  "due_date": "2025-11-20T14:00:00Z",
  "duration_minutes": 60,
  "company_id": "uuid",
  "contact_id": "uuid",
  "deal_id": "uuid",
  "assigned_to": "uuid"
}
```

**Activity Types:**
- `task` - To-do item
- `call` - Phone call
- `meeting` - In-person or virtual meeting
- `email` - Email activity
- `note` - General note

#### List Activities
```http
GET /api/v1/deals/{workspace_id}/activities?deal_id=uuid&status=pending
```

**Filters:**
- `activity_type` - Filter by type
- `status` - pending, completed, cancelled
- `assigned_to` - Filter by assignee
- `company_id`, `contact_id`, `deal_id` - Filter by entity

#### Update Activity
```http
PATCH /api/v1/deals/{workspace_id}/activities/{activity_id}
```

**Request Body:**
```json
{
  "status": "completed",
  "completed_at": "2025-11-20T15:00:00Z"
}
```

### Notes

#### Create Note
```http
POST /api/v1/deals/{workspace_id}/notes
```

**Request Body:**
```json
{
  "content": "Client expressed interest in annual contract for cost savings",
  "company_id": "uuid",
  "deal_id": "uuid",
  "is_pinned": true
}
```

#### List Notes
```http
GET /api/v1/deals/{workspace_id}/notes?deal_id=uuid
```

### Unified Timeline

#### Get Timeline
```http
GET /api/v1/deals/{workspace_id}/timeline?company_id=uuid&limit=100
```

**Filters:**
- `company_id` - Company timeline
- `contact_id` - Contact timeline
- `deal_id` - Deal timeline
- `event_type` - Filter by event type

**Response:**
```json
[
  {
    "id": "uuid",
    "event_type": "deal_created",
    "title": "Deal created: Enterprise Package",
    "description": null,
    "company_id": "uuid",
    "deal_id": "uuid",
    "actor_type": "user",
    "actor_id": "uuid",
    "data": {"amount": 50000, "stage": "qualification"},
    "occurred_at": "2025-11-15T10:00:00"
  },
  {
    "event_type": "note_added",
    "title": "Note added",
    "description": "Client expressed interest...",
    "occurred_at": "2025-11-15T14:30:00"
  }
]
```

### Pipeline Analytics

#### Get Pipeline Analytics
```http
GET /api/v1/deals/{workspace_id}/deals/analytics/pipeline?pipeline_id=uuid
```

**Response:**
```json
[
  {
    "stage": "prospecting",
    "count": 15,
    "total_value": 750000,
    "avg_probability": 10
  },
  {
    "stage": "qualification",
    "count": 8,
    "total_value": 420000,
    "avg_probability": 25
  }
]
```

---

## Marketing Journeys

### Journey Endpoints

#### Create Journey
```http
POST /api/v1/journeys/{workspace_id}/journeys
```

**Request Body:**
```json
{
  "name": "Welcome Email Sequence",
  "description": "Onboard new leads",
  "trigger": {
    "type": "lead_created",
    "filters": {"source": "website"}
  },
  "steps": [
    {
      "type": "wait",
      "duration_hours": 1
    },
    {
      "type": "email",
      "template_id": "uuid",
      "subject": "Welcome to Acme!"
    },
    {
      "type": "wait",
      "duration_hours": 48
    },
    {
      "type": "email",
      "template_id": "uuid",
      "subject": "Getting Started Guide"
    },
    {
      "type": "condition",
      "field": "email_opened",
      "operator": "equals",
      "value": true,
      "yes_path": [...],
      "no_path": [...]
    }
  ],
  "goal": "demo_scheduled",
  "status": "draft"
}
```

#### List Journeys
```http
GET /api/v1/journeys/{workspace_id}/journeys?status=active
```

#### Get Journey
```http
GET /api/v1/journeys/{workspace_id}/journeys/{journey_id}
```

#### Update Journey
```http
PATCH /api/v1/journeys/{workspace_id}/journeys/{journey_id}
```

#### Delete Journey
```http
DELETE /api/v1/journeys/{workspace_id}/journeys/{journey_id}
```

### Journey Enrollments

#### Enroll Contact
```http
POST /api/v1/journeys/{workspace_id}/journeys/{journey_id}/enroll
```

**Request Body:**
```json
{
  "contact_id": "uuid",
  "lead_id": "uuid"
}
```

#### List Enrollments
```http
GET /api/v1/journeys/{workspace_id}/enrollments?journey_id=uuid&status=active
```

#### Get Enrollment
```http
GET /api/v1/journeys/{workspace_id}/enrollments/{enrollment_id}
```

#### Update Enrollment
```http
PATCH /api/v1/journeys/{workspace_id}/enrollments/{enrollment_id}
```

**Request Body:**
```json
{
  "status": "paused",
  "current_step_index": 3
}
```

### Journey Analytics

#### Get Journey Analytics
```http
GET /api/v1/journeys/{workspace_id}/journeys/{journey_id}/analytics
```

**Response:**
```json
{
  "journey_id": "uuid",
  "total_enrolled": 500,
  "active_enrollments": 120,
  "completed_enrollments": 350,
  "goal_achievements": 175,
  "completion_rate": 0.70,
  "goal_achievement_rate": 0.50,
  "avg_completion_time_hours": 120
}
```

#### Get All Journeys Analytics
```http
GET /api/v1/journeys/{workspace_id}/journeys/analytics
```

---

## Campaigns & Content

### Campaigns

#### Create Campaign
```http
POST /api/v1/campaigns/{workspace_id}/campaigns
```

**Request Body:**
```json
{
  "name": "Q4 Product Launch",
  "description": "Launch new AI features",
  "campaign_type": "product_launch",
  "status": "draft",
  "budget": 50000,
  "target_audience": {
    "industries": ["technology", "saas"],
    "company_size": ["50-200", "200-1000"],
    "job_titles": ["CMO", "VP Marketing"]
  },
  "scheduled_at": "2025-12-01T09:00:00Z"
}
```

**Campaign Types:**
- `product_launch`
- `lead_generation`
- `brand_awareness`
- `customer_retention`
- `event_promotion`

#### List Campaigns
```http
GET /api/v1/campaigns/{workspace_id}/campaigns?campaign_type=product_launch&status=active
```

#### Get Campaign
```http
GET /api/v1/campaigns/{workspace_id}/campaigns/{campaign_id}
```

#### Update Campaign
```http
PATCH /api/v1/campaigns/{workspace_id}/campaigns/{campaign_id}
```

#### Get Campaign Analytics
```http
GET /api/v1/campaigns/{workspace_id}/campaigns/{campaign_id}/analytics
```

**Response:**
```json
{
  "campaign_id": "uuid",
  "impressions": 50000,
  "clicks": 2500,
  "conversions": 125,
  "ctr": 0.05,
  "conversion_rate": 0.05,
  "cost_per_click": 1.25,
  "cost_per_lead": 25.00,
  "roi": 2.5,
  "revenue_generated": 125000
}
```

### Content Assets

#### Create Content Asset
```http
POST /api/v1/campaigns/{workspace_id}/content-assets
```

**Request Body:**
```json
{
  "campaign_id": "uuid",
  "asset_type": "image",
  "name": "Hero Image - Product Launch",
  "generation_prompt": "Modern tech product hero image with blue and white color scheme",
  "generation_model": "dall-e-3",
  "ai_generated": true,
  "metadata": {
    "size": "1920x1080",
    "format": "png"
  }
}
```

**Asset Types:**
- `text` - Blog posts, emails, ad copy
- `image` - Images, graphics
- `video` - Videos
- `audio` - Podcasts, voiceovers

#### List Content Assets
```http
GET /api/v1/campaigns/{workspace_id}/content-assets?asset_type=image&ai_generated=true
```

#### Get Content Asset
```http
GET /api/v1/campaigns/{workspace_id}/content-assets/{asset_id}
```

### Social Posts

#### Create Social Post
```http
POST /api/v1/campaigns/{workspace_id}/social-posts
```

**Request Body:**
```json
{
  "campaign_id": "uuid",
  "platform": "linkedin",
  "content": "Excited to announce our new AI features! 🚀\n\n#AI #ProductLaunch",
  "media_urls": ["https://cdn.acme.com/hero.png"],
  "scheduled_for": "2025-12-01T10:00:00Z"
}
```

**Platforms:**
- `linkedin`
- `twitter`
- `facebook`
- `instagram`

#### List Social Posts
```http
GET /api/v1/campaigns/{workspace_id}/social-posts?platform=linkedin&status=scheduled
```

#### Bulk Schedule Posts
```http
POST /api/v1/campaigns/{workspace_id}/social-posts/bulk-schedule
```

**Request Body:**
```json
{
  "posts": [
    {
      "platform": "linkedin",
      "content": "...",
      "scheduled_for": "2025-12-01T10:00:00Z"
    },
    {
      "platform": "twitter",
      "content": "...",
      "scheduled_for": "2025-12-01T10:15:00Z"
    }
  ]
}
```

---

## Integrations

### Integration Management

#### Create Integration
```http
POST /api/v1/integrations/{workspace_id}/integrations
```

**Request Body:**
```json
{
  "integration_type": "crm",
  "provider": "hubspot",
  "name": "HubSpot CRM Sync",
  "auth_type": "oauth2",
  "sync_direction": "bidirectional",
  "sync_frequency": "hourly",
  "field_mappings": {
    "contact.email": "properties.email",
    "contact.first_name": "properties.firstname",
    "company.name": "properties.name"
  }
}
```

**Integration Types:**
- `crm` - HubSpot, Salesforce
- `email` - Gmail, Outlook
- `calendar` - Google Calendar, Outlook Calendar
- `social` - LinkedIn, Twitter
- `ads` - Google Ads, LinkedIn Ads
- `enrichment` - Clearbit, ZoomInfo
- `payment` - Stripe, PayPal
- `analytics` - Google Analytics, Mixpanel
- `communication` - Slack, Microsoft Teams
- `storage` - Dropbox, Google Drive

#### List Integrations
```http
GET /api/v1/integrations/{workspace_id}/integrations?integration_type=crm&status=active
```

#### Get Integration
```http
GET /api/v1/integrations/{workspace_id}/integrations/{integration_id}
```

**Note:** Sensitive credentials are filtered from response.

#### Trigger Sync
```http
POST /api/v1/integrations/{workspace_id}/integrations/{integration_id}/sync
```

#### Get OAuth URL
```http
GET /api/v1/integrations/{workspace_id}/integrations/{integration_id}/oauth-url
```

**Response:**
```json
{
  "authorization_url": "https://app.hubspot.com/oauth/authorize?...",
  "state": "random_state_token"
}
```

### Webhooks

#### Create Webhook
```http
POST /api/v1/integrations/{workspace_id}/webhooks
```

**Request Body:**
```json
{
  "integration_id": "uuid",
  "webhook_type": "outbound",
  "url": "https://api.partner.com/webhook",
  "events": ["deal.created", "deal.updated", "lead.converted"],
  "headers": {
    "X-API-Key": "secret_key"
  }
}
```

#### List Webhooks
```http
GET /api/v1/integrations/{workspace_id}/webhooks?webhook_type=outbound
```

#### Test Webhook
```http
POST /api/v1/integrations/{workspace_id}/webhooks/{webhook_id}/test
```

**Request Body:**
```json
{
  "payload": {
    "event": "deal.created",
    "data": {...}
  }
}
```

#### Get Webhook Logs
```http
GET /api/v1/integrations/{workspace_id}/webhooks/{webhook_id}/logs?limit=100
```

#### Get Webhook Analytics
```http
GET /api/v1/integrations/{workspace_id}/webhooks/{webhook_id}/analytics
```

---

## Common Patterns

### Pagination

All list endpoints support pagination via `limit` and `offset`:

```http
GET /api/v1/deals/{workspace_id}/deals?limit=50&offset=100
```

**Default limit:** 100
**Maximum limit:** 500

### Filtering

Most list endpoints support filtering. Combine multiple filters:

```http
GET /api/v1/deals/{workspace_id}/deals?stage=qualification&owner_id=uuid&limit=20
```

### Soft Deletes

Resources are soft-deleted (not permanently removed). Deleted resources:
- Are not returned in list endpoints
- Can still be retrieved by ID (shows `deleted_at` timestamp)
- Can be restored by clearing `deleted_at`

### Error Responses

#### 400 Bad Request
```json
{
  "detail": "Validation error: slug already taken"
}
```

#### 401 Unauthorized
```json
{
  "detail": "Not authenticated"
}
```

#### 403 Forbidden
```json
{
  "detail": "Insufficient permissions"
}
```

#### 404 Not Found
```json
{
  "detail": "Deal not found"
}
```

#### 500 Internal Server Error
```json
{
  "detail": "Internal server error"
}
```

### Rate Limiting

Rate limits are enforced per workspace based on subscription tier:

- **Free:** 100 requests/hour
- **Starter:** 500 requests/hour
- **Professional:** 2000 requests/hour
- **Enterprise:** 10000 requests/hour

Rate limit headers:
```
X-RateLimit-Limit: 500
X-RateLimit-Remaining: 487
X-RateLimit-Reset: 1700000000
```

---

## Subscription Tiers

| Feature | Free | Starter | Professional | Enterprise |
|---------|------|---------|--------------|------------|
| Max Users | 2 | 10 | 50 | Unlimited |
| Max Contacts | 1,000 | 10,000 | 100,000 | Unlimited |
| AI Requests/Month | 100 | 1,000 | 10,000 | Unlimited |
| Workspaces | 1 | 3 | 10 | Unlimited |
| API Rate Limit | 100/hr | 500/hr | 2,000/hr | 10,000/hr |
| Custom Integrations | ❌ | ❌ | ✅ | ✅ |
| Advanced Analytics | ❌ | ❌ | ✅ | ✅ |
| White Label | ❌ | ❌ | ❌ | ✅ |
| SSO | ❌ | ❌ | ❌ | ✅ |

---

## Webhooks (Inbound)

The platform can receive webhooks from external systems:

```http
POST /api/v1/webhooks/{workspace_id}/inbound/{webhook_id}
```

Webhook signature verification is performed using `X-Webhook-Signature` header.

---

## Changelog

### Version 2.0.0 (2025-11-15)
- ✨ Multi-tenant workspace architecture
- ✨ AI agents and orchestration system
- ✨ Enhanced CRM with deals and pipeline management
- ✨ Unified timeline across all entities
- ✨ Marketing journey builder
- ✨ Campaign and content management
- ✨ Comprehensive integrations framework
- ✨ Multimodal content generation (text, image, video, audio)
- ✨ Advanced RBAC with 6 user roles
- ✨ Brand kit for AI-consistent content
- ✨ Webhook management and monitoring

### Version 1.0.0 (2025-11-13)
- 🎉 Initial release
- Basic lead management
- Email sequences
- Support tickets
- Knowledge base
- Account health scoring

---

## Support

For API support, contact: api-support@platform.com

API Status Page: https://status.platform.com

Developer Forum: https://community.platform.com/developers
