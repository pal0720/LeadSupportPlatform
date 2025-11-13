# System Architecture & Design

## Overview

The GTM Platform is an AI-driven, enterprise-grade customer lifecycle platform built using a **modular monolith architecture** optimized for a 1-2 person engineering team.

## Architecture Principles

1. **Modular Monolith**: Single codebase with clear module boundaries
2. **API-First**: RESTful APIs with OpenAPI documentation
3. **Event-Driven**: Event sourcing for analytics and auditing
4. **AI-Native**: AI capabilities integrated at every layer
5. **Cloud-Native**: Containerized, horizontally scalable
6. **Cost-Effective**: Minimal infrastructure, serverless where possible

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                            │
│                  Next.js 15 (App Router)                    │
│              Tailwind CSS + shadcn/ui                       │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTPS
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                      API Gateway                            │
│                    FastAPI Backend                          │
│                                                             │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────┐      │
│  │   Leads     │  │  Sequences   │  │   Support   │      │
│  │   Module    │  │    Module    │  │   Module    │      │
│  └─────────────┘  └──────────────┘  └─────────────┘      │
│                                                             │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────┐      │
│  │  Companies  │  │    Success   │  │  Analytics  │      │
│  │   Module    │  │    Module    │  │   Module    │      │
│  └─────────────┘  └──────────────┘  └─────────────┘      │
└──────────────────────┬──────────────────────────────────────┘
                       │
         ┌─────────────┼─────────────┐
         ▼             ▼             ▼
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│   AI        │ │  PostgreSQL │ │    Redis    │
│  Service    │ │  + pgvector │ │   Cache     │
└─────────────┘ └─────────────┘ └─────────────┘
         │
         ▼
┌─────────────────────┐
│  External AI APIs   │
│  OpenAI, Anthropic  │
└─────────────────────┘
```

## Technology Stack

### Frontend Layer
- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: Zustand + React Query
- **Data Fetching**: TanStack Query (React Query)
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts

### Backend Layer
- **Framework**: FastAPI (Python 3.12)
- **ORM**: SQLAlchemy 2.0 with async support
- **Validation**: Pydantic v2
- **Authentication**: JWT tokens with refresh
- **Background Tasks**: Celery + Redis
- **API Docs**: OpenAPI/Swagger auto-generated

### Database Layer
- **Primary DB**: PostgreSQL 15+
- **Vector Search**: pgvector extension
- **Caching**: Redis 7+
- **Migrations**: Alembic

### AI Layer
- **Providers**: OpenAI, Anthropic (Claude)
- **Embeddings**: text-embedding-3-small (1536 dimensions)
- **Vector DB**: pgvector (PostgreSQL extension)
- **Orchestration**: Custom provider abstraction

### Infrastructure
- **Frontend Hosting**: Vercel
- **Backend Hosting**: Railway/Fly.io/Render
- **Containers**: Docker + Docker Compose
- **CI/CD**: GitHub Actions
- **Monitoring**: Sentry + OpenTelemetry
- **Logging**: Structured JSON logs

## Module Architecture

### Core Modules

#### 1. Authentication & Authorization
- JWT-based authentication
- Role-based access control (RBAC)
- User management
- Team management

#### 2. Lead Generation Module
**Responsibilities:**
- Lead capture (forms, chat, API)
- Lead enrichment (Clearbit, Hunter)
- Lead scoring (AI + rules)
- Website tracking
- Progressive profiling

**Key Models:**
- Lead
- Company
- Event (website activity)

**AI Features:**
- Automatic lead scoring
- Intent analysis
- Fit prediction
- Email finder

#### 3. Sales Engagement Module
**Responsibilities:**
- Email sequences
- Multi-channel orchestration
- Email tracking (opens, clicks)
- Reply detection
- Meeting scheduling

**Key Models:**
- Sequence
- SequenceStep
- SequenceEnrollment
- Email
- EmailTemplate

**AI Features:**
- Email generation
- Personalization
- Send time optimization
- A/B testing suggestions

#### 4. Customer Support Module
**Responsibilities:**
- Ticket management
- Support inbox
- SLA tracking
- Team routing
- Customer portal
- Live chat

**Key Models:**
- Ticket
- TicketMessage
- Article (knowledge base)

**AI Features:**
- Auto-classification
- Sentiment analysis
- Auto-reply suggestions
- Smart routing
- Article recommendations

#### 5. Customer Success Module
**Responsibilities:**
- Account health scoring
- Churn prediction
- Expansion detection
- Playbook automation
- QBR generation

**Key Models:**
- AccountHealth
- ExpansionSignal

**AI Features:**
- Health score calculation
- Churn prediction ML model
- Expansion signal detection
- QBR auto-generation

#### 6. Analytics & Data Platform
**Responsibilities:**
- Event tracking
- Custom dashboards
- Predictive analytics
- Data warehouse
- ETL pipelines

**Key Models:**
- Event (append-only log)
- Dashboard
- Metric

**AI Features:**
- Anomaly detection
- Predictive modeling
- Natural language BI
- Auto-insights

## Data Flow Architecture

### 1. Lead Capture Flow
```
User fills form → Frontend validates → API endpoint
    → Create Lead record → Trigger enrichment job
    → Enrich data (async) → Calculate AI score
    → Update Lead → Send webhook → Log event
```

### 2. Email Sequence Flow
```
User creates sequence → Define steps → Enroll leads
    → Schedule next step → Background worker processes
    → Generate personalized email (AI) → Send via SMTP
    → Track delivery → Track opens/clicks → Detect replies
    → Update enrollment status → Log all events
```

### 3. Support Ticket Flow
```
Email received → Parse and create ticket
    → AI classification → AI sentiment analysis
    → Route to team/agent → Generate AI response suggestion
    → Agent reviews/edits → Send response
    → Track SLA → Update metrics → Log events
```

### 4. Customer Health Flow
```
Daily job triggers → Aggregate usage data
    → Aggregate support data → Aggregate engagement data
    → Calculate component scores → AI health prediction
    → Update AccountHealth → Detect expansion signals
    → Alert CSM if at-risk → Log health change event
```

## AI Architecture

### Provider Abstraction Layer
```python
AIProviderManager
    ├── OpenAIProvider
    │   ├── generate_completion()
    │   └── generate_embeddings()
    └── AnthropicProvider
        ├── generate_completion()
        └── generate_embeddings()
```

### AI Use Cases

#### 1. Lead Scoring
- **Input**: Lead + Company + Behavioral data
- **Model**: GPT-4 or Claude
- **Output**: Score (0-100) + reasoning + factors
- **Latency**: < 2 seconds

#### 2. Email Generation
- **Input**: Lead profile + sequence context + prompt
- **Model**: GPT-4 or Claude
- **Output**: Personalized email
- **Latency**: < 3 seconds

#### 3. Ticket Classification
- **Input**: Ticket subject + description
- **Model**: GPT-3.5-turbo (fast)
- **Output**: Category + sentiment + urgency
- **Latency**: < 1 second

#### 4. Semantic Search (Knowledge Base)
- **Input**: Query text
- **Process**: Generate embedding → Vector similarity search
- **Model**: text-embedding-3-small
- **Output**: Ranked articles
- **Latency**: < 500ms

#### 5. Churn Prediction
- **Input**: Account health metrics + usage patterns
- **Model**: Scikit-learn Random Forest + GPT-4 reasoning
- **Output**: Churn probability + risk factors
- **Latency**: < 1 second (batch daily)

## Security Architecture

### Authentication
- JWT access tokens (30 min expiry)
- JWT refresh tokens (30 day expiry)
- Secure token storage
- Token rotation on refresh

### Authorization
- Role-Based Access Control (RBAC)
- Resource-level permissions
- Row-Level Security (RLS) in database
- API rate limiting

### Data Protection
- Encryption at rest (PostgreSQL TDE)
- Encryption in transit (TLS 1.3)
- Secrets management (environment variables)
- Input validation and sanitization
- SQL injection prevention (ORM)
- XSS protection (Content Security Policy)

### API Security
- Rate limiting (Redis-based)
- CORS configuration
- Request validation (Pydantic)
- API key authentication for integrations
- Webhook signature verification

## Scalability Strategy

### Horizontal Scaling
- **Frontend**: Serverless (Vercel) - auto-scales
- **Backend API**: Stateless - can run multiple instances
- **Background Workers**: Celery - add more workers
- **Database**: PostgreSQL read replicas
- **Cache**: Redis cluster

### Vertical Optimization
- Database indexing strategy
- Query optimization
- Caching layer (Redis)
- CDN for static assets
- Connection pooling

### Performance Targets
- API response time: < 200ms (p95)
- Page load time: < 2 seconds
- AI operations: < 5 seconds
- Background jobs: Process within 5 minutes

## Monitoring & Observability

### Application Monitoring
- **Error Tracking**: Sentry
- **Performance**: OpenTelemetry traces
- **Logs**: Structured JSON logs
- **Metrics**: Prometheus-compatible

### Key Metrics
- Request rate and latency
- Error rate
- Database query performance
- Cache hit rate
- AI API usage and costs
- Background job queue length

### Alerting
- API error rate > 1%
- Response time p95 > 500ms
- Database connection pool exhausted
- Celery queue length > 1000
- SLA breaches

## Deployment Architecture

### Environments
1. **Development**: Local Docker Compose
2. **Staging**: Railway/Fly.io
3. **Production**: Railway/Fly.io (or AWS/GCP)

### CI/CD Pipeline
```
Git Push → GitHub Actions
    → Run tests → Build Docker images
    → Push to registry → Deploy to environment
    → Run smoke tests → Notify team
```

### Infrastructure as Code
- Docker Compose for local
- Terraform for cloud resources (optional)
- Environment-specific configs

## Cost Optimization

### Strategy
- Use managed services (lower ops overhead)
- Serverless frontend (Vercel)
- Single database instance initially
- Redis for caching (reduce AI calls)
- Batch AI operations where possible
- Monitor AI API costs closely

### Estimated Monthly Costs (Small Scale)
- **Frontend**: $0-20 (Vercel free tier)
- **Backend**: $5-15 (Railway/Fly.io)
- **Database**: $0-10 (included or small instance)
- **Redis**: $0-5 (included or small instance)
- **AI APIs**: $50-200 (depends on usage)
- **Monitoring**: $0-29 (Sentry free tier)

**Total**: ~$50-280/month for small-medium scale

## Future Enhancements

### Phase 2
- WebSocket support for real-time updates
- Advanced workflow automation
- Custom AI model fine-tuning
- Multi-tenancy support

### Phase 3
- GraphQL API
- Mobile apps (React Native)
- Advanced integrations (Zapier, Make)
- White-label support

### Phase 4
- Microservices extraction (if needed)
- Multi-region deployment
- Advanced ML models
- Marketplace for extensions

## Development Guidelines

### Code Organization
```
apps/
  backend/
    api/          # API endpoints
    core/         # Core utilities
    models/       # Database models
    schemas/      # Pydantic schemas
    services/     # Business logic
    tasks/        # Background tasks
  frontend/
    app/          # Next.js App Router pages
    components/   # React components
    lib/          # Utilities
    hooks/        # Custom hooks
  ai_service/
    api/          # AI endpoints
    services/     # AI logic
    core/         # Configuration
```

### Best Practices
1. Follow REST conventions
2. Use async/await consistently
3. Write comprehensive tests
4. Document all endpoints
5. Use type hints (Python) / TypeScript (Frontend)
6. Keep modules decoupled
7. Cache aggressively
8. Monitor everything

## Conclusion

This architecture provides a solid foundation for an AI-driven GTM platform that can scale from MVP to enterprise while remaining manageable by a small team. The modular monolith approach allows for future extraction of services if needed, while keeping complexity low initially.
