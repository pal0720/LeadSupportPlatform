# Quick Start Guide

Get your GTM Platform up and running in minutes!

## Prerequisites

- **Node.js**: 20+ ([Download](https://nodejs.org))
- **Python**: 3.12+ ([Download](https://python.org))
- **Docker Desktop**: ([Download](https://docker.com/products/docker-desktop))
- **AI API Keys**: OpenAI or Anthropic account

## 5-Minute Setup

### 1. Environment Setup (1 min)

```bash
# Copy environment template
cp .env.example .env

# Edit .env and add your API keys
# Required: OpenAI_API_KEY or ANTHROPIC_API_KEY
# Required: JWT_SECRET (generate with: openssl rand -hex 32)
nano .env
```

### 2. Start Infrastructure (2 min)

```bash
# Start PostgreSQL, Redis, and MailHog
docker-compose up -d postgres redis mailhog

# Wait for services to be ready (check with docker ps)
```

### 3. Start Backend (1 min)

```bash
cd apps/backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start server
uvicorn main:app --reload --port 8000 &
```

### 4. Start AI Service (30 sec)

```bash
cd apps/ai_service

# Use same virtual environment or create new one
pip install -r requirements.txt

# Start service
uvicorn main:app --reload --port 8001 &
```

### 5. Start Frontend (30 sec)

```bash
cd apps/frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

## Access the Platform

Open your browser and navigate to:

- **Frontend**: http://localhost:3000
- **Backend API Docs**: http://localhost:8000/docs
- **AI Service Docs**: http://localhost:8001/docs
- **Email Testing (MailHog)**: http://localhost:8025

## First Steps

### 1. Create an Account
- Navigate to http://localhost:3000
- Click "Get Started" or go to `/register` (when implemented)
- Create your first user account

### 2. Explore Features
- **Dashboard**: Overview of all metrics
- **Leads**: Create and manage leads
- **Sequences**: Set up email campaigns
- **Support**: Manage customer tickets
- **Analytics**: View insights and reports

### 3. Test AI Features

#### Score a Lead
```bash
curl -X POST http://localhost:8001/scoring/score-lead \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "name": "John Doe",
    "company_name": "Acme Corp",
    "title": "VP of Sales"
  }'
```

#### Generate an Email
```bash
curl -X POST http://localhost:8001/generation/generate-email \
  -H "Content-Type: application/json" \
  -d '{
    "to_name": "John",
    "company": "Acme Corp",
    "context": "Following up on demo request"
  }'
```

## Common Issues & Solutions

### Database Connection Failed
```bash
# Check if PostgreSQL is running
docker ps | grep postgres

# Restart if needed
docker-compose restart postgres
```

### Redis Connection Failed
```bash
# Check if Redis is running
docker ps | grep redis

# Restart if needed
docker-compose restart redis
```

### Port Already in Use
```bash
# Find process using port
lsof -i :8000  # or :8001, :3000

# Kill the process
kill -9 <PID>
```

### Python Dependencies Error
```bash
# Upgrade pip
pip install --upgrade pip

# Clear cache and reinstall
pip cache purge
pip install -r requirements.txt --no-cache-dir
```

### Node Modules Error
```bash
# Clear npm cache
npm cache clean --force

# Remove and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Development Tips

### Hot Reload
All services support hot reload:
- **Backend**: Automatically reloads on file changes
- **AI Service**: Automatically reloads on file changes
- **Frontend**: Automatically reloads on file changes

### API Documentation
Access interactive API docs:
- Backend: http://localhost:8000/docs (Swagger UI)
- Backend: http://localhost:8000/redoc (ReDoc)
- AI Service: http://localhost:8001/docs

### Database Migrations
```bash
cd apps/backend

# Create migration
alembic revision --autogenerate -m "description"

# Apply migration
alembic upgrade head

# Rollback
alembic downgrade -1
```

### View Logs
```bash
# Docker services
docker-compose logs -f

# Backend
cd apps/backend && tail -f app.log

# Frontend
cd apps/frontend && npm run dev
```

## Next Steps

1. **Read the Documentation**
   - [System Architecture](docs/architecture/SYSTEM_DESIGN.md)
   - [Features List](docs/FEATURES.md)
   - [Deployment Guide](docs/guides/DEPLOYMENT.md)

2. **Customize the Platform**
   - Configure branding in `apps/frontend/app/globals.css`
   - Add custom fields in database models
   - Create custom AI prompts in `apps/ai_service/`

3. **Deploy to Production**
   - Follow [Deployment Guide](docs/guides/DEPLOYMENT.md)
   - Set up monitoring (Sentry, OpenTelemetry)
   - Configure backups

4. **Add Integrations**
   - HubSpot: Configure API key in `.env`
   - Salesforce: Set up OAuth credentials
   - Email Provider: Configure SMTP settings

## Production Checklist

Before going to production:

- [ ] Change `JWT_SECRET` to a secure random value
- [ ] Set strong database passwords
- [ ] Configure HTTPS/TLS certificates
- [ ] Set up database backups
- [ ] Configure monitoring and alerts
- [ ] Set up error tracking (Sentry)
- [ ] Review and update CORS settings
- [ ] Enable rate limiting
- [ ] Configure production email provider
- [ ] Set up CI/CD pipeline
- [ ] Document custom configurations

## Get Help

- **Documentation**: See `/docs` folder
- **API Issues**: Check http://localhost:8000/docs
- **Frontend Issues**: Check browser console (F12)
- **Backend Issues**: Check `docker-compose logs backend`

## Key Commands Reference

```bash
# Start everything
docker-compose up -d

# Stop everything
docker-compose down

# View logs
docker-compose logs -f [service]

# Restart service
docker-compose restart [service]

# Database backup
docker-compose exec postgres pg_dump -U gtm_user gtm_platform > backup.sql

# Database restore
docker-compose exec -T postgres psql -U gtm_user gtm_platform < backup.sql
```

## Architecture Overview

```
┌─────────────────────┐
│   Next.js Frontend  │  Port 3000
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   FastAPI Backend   │  Port 8000
└──────────┬──────────┘
           │
     ┌─────┴─────┬─────────────┐
     ▼           ▼             ▼
┌─────────┐ ┌──────────┐ ┌──────────┐
│   AI    │ │PostgreSQL│ │  Redis   │
│ Service │ │+pgvector │ │  Cache   │
│Port 8001│ │Port 5432 │ │Port 6379 │
└─────────┘ └──────────┘ └──────────┘
```

Happy building! 🚀
