# AI-Driven GTM Platform

> Enterprise-grade customer lifecycle platform unifying Lead Generation, Sales Engagement, Customer Support, Customer Success, and Revenue Operations with Advanced AI Automation.

## 🚀 Platform Overview

This platform is an **AI-first GTM system** designed to help companies:

- **Generate more leads** with intelligent capture and enrichment
- **Qualify leads automatically** using AI scoring and intent analysis
- **Engage prospects intelligently** with personalized multi-channel sequences
- **Close deals faster** with AI-assisted sales workflows
- **Support customers efficiently** with AI-powered ticket routing and auto-responses
- **Retain and expand accounts** through predictive health scoring
- **Understand customer health** with unified 360° profiles
- **Automate workflows** across the entire customer lifecycle

## 🏗️ Architecture

**Modular Monolith** design for cost-effectiveness and maintainability:

```
LeadSupportPlatform/
├── apps/
│   ├── frontend/         # Next.js 15 (App Router)
│   ├── backend/          # FastAPI (Python 3.12)
│   └── ai_service/       # AI microservice
├── modules/              # Shared business logic
│   ├── auth/
│   ├── leads/
│   ├── companies/
│   ├── enrichment/
│   ├── scoring/
│   ├── sequences/
│   ├── communications/
│   ├── support/
│   ├── success/
│   ├── analytics/
│   ├── knowledge_base/
│   ├── workflows/
│   └── data_platform/
├── infra/               # Infrastructure as Code
└── docs/                # Documentation
```

## 🛠️ Technology Stack

### Frontend
- **Next.js 15** with App Router & Server Components
- **Tailwind CSS** + **shadcn/ui** for beautiful, accessible UI
- **React Query** for data fetching
- **Recharts** for analytics visualization
- **Supabase Auth** for authentication

### Backend
- **FastAPI** (Python 3.12, async-first)
- **PostgreSQL** with **pgvector** for embeddings
- **Redis** for caching and rate limiting
- **Celery** for background tasks
- **SQLAlchemy 2.0** ORM

### AI Layer
- **OpenAI/Anthropic** provider abstraction
- **pgvector/Qdrant** for vector search
- **LangChain** for LLM orchestration
- **Custom pipelines** for:
  - Lead scoring
  - Email generation
  - Sequence personalization
  - Ticket classification
  - Sentiment analysis
  - Knowledge base generation
  - Customer health scoring
  - Conversational agents

### Infrastructure
- **Vercel** for frontend hosting
- **Railway/Fly.io** for backend
- **Docker** + Docker Compose for local development
- **GitHub Actions** for CI/CD
- **Sentry** + **OpenTelemetry** for monitoring

## 📦 Core Modules

### Phase 1: Lead Gen + Sales Core
- ✅ Lead capture (forms, chat widget, meeting scheduler)
- ✅ Data enrichment (firmographics, technographics)
- ✅ AI-powered lead scoring
- ✅ Email sequences & multi-channel outreach
- ✅ CRM integrations (HubSpot, Salesforce)
- ✅ Analytics dashboard

### Phase 2: Customer Support
- ✅ Unified support inbox
- ✅ AI auto-reply & suggested responses
- ✅ Live chat with AI agent
- ✅ Customer portal
- ✅ SLA tracking & team routing
- ✅ Support analytics

### Phase 3: Customer Success
- ✅ Account health scoring
- ✅ Churn prediction
- ✅ Expansion signals detection
- ✅ CS playbooks (onboarding, renewal, QBR)
- ✅ Usage analytics

### Advanced AI Capabilities
- 🤖 **AI Sales Agent**: Auto-writes outreach, optimizes sequences, books meetings
- 🤖 **AI Support Agent**: Classifies tickets, detects sentiment, suggests solutions
- 🤖 **AI Success Agent**: Monitors health, flags churn risk, identifies expansion
- 🤖 **Conversational Agents**: RAG-powered chatbots for sales, support, and success
- 🤖 **AI Knowledge Base Generator**: Auto-creates and updates articles
- 🤖 **AI Data Insights**: Natural language BI and predictive analytics

### Data Management Platform
- 📊 Unified customer 360° profile
- 📊 Event stream for analytics
- 📊 ETL pipelines with data quality checks
- 📊 Metadata layer with lineage tracking
- 📊 AI-ready feature stores

## 🎁 Surprise & Delight Features

1. **AI Autopilot Mode** - Fully autonomous lead engagement
2. **Live Co-Pilot During Calls** - Real-time suggestions and notes
3. **1-Click "Explain This Lead/Account"** - Natural language summaries
4. **AI QBR Creator** - Auto-generated quarterly business reviews
5. **1-Click Lookalike Prospect Finder** - AI-powered prospecting
6. **AI-driven Support Forecasting** - Predict ticket surges and staffing needs

## 🚦 Quick Start

### Prerequisites
- Node.js 20+
- Python 3.12+
- PostgreSQL 15+
- Redis 7+
- Docker & Docker Compose

### Local Development

```bash
# Clone the repository
git clone <repository-url>
cd LeadSupportPlatform

# Start infrastructure (Postgres, Redis)
docker-compose up -d

# Backend setup
cd apps/backend
python -m venv venv
source venv/bin/activate  # or `venv\Scripts\activate` on Windows
pip install -r requirements.txt
alembic upgrade head
uvicorn main:app --reload

# Frontend setup (in new terminal)
cd apps/frontend
npm install
npm run dev

# AI Service setup (in new terminal)
cd apps/ai_service
pip install -r requirements.txt
uvicorn main:app --port 8001 --reload
```

Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs
- AI Service: http://localhost:8001

## 📚 Documentation

- [System Architecture](docs/architecture/SYSTEM_DESIGN.md)
- [API Reference](docs/api/README.md)
- [Developer Guide](docs/guides/DEVELOPER_GUIDE.md)
- [AI Pipelines](docs/architecture/AI_ARCHITECTURE.md)
- [Data Dictionary](docs/architecture/DATA_DICTIONARY.md)
- [Deployment Guide](docs/guides/DEPLOYMENT.md)

## 🧪 Testing

```bash
# Backend tests
cd apps/backend
pytest

# Frontend tests
cd apps/frontend
npm test

# E2E tests
npm run test:e2e

# Load tests
cd tests/load
k6 run load_test.js
```

## 🔒 Security

- JWT-based authentication with refresh tokens
- Row-level security (RLS) in Postgres
- Rate limiting on all API endpoints
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- CORS configuration
- Secrets management via environment variables

## 📈 Monitoring & Observability

- **Application Monitoring**: Sentry for error tracking
- **Performance Monitoring**: OpenTelemetry traces
- **Logging**: Structured JSON logs
- **Metrics**: Prometheus-compatible metrics
- **Uptime**: Synthetic monitoring

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines.

## 📄 License

Proprietary and confidential.

## 🆘 Support

For issues, questions, or feature requests, please contact the engineering team.

---

**Built with ❤️ for modern GTM teams**
