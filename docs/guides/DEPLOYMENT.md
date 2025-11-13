# Deployment Guide

Complete guide for deploying the GTM Platform to production.

## Prerequisites

- Docker and Docker Compose
- Node.js 20+
- Python 3.12+
- PostgreSQL 15+ with pgvector
- Redis 7+
- OpenAI and/or Anthropic API keys

## Local Development Setup

### 1. Clone Repository
```bash
git clone <repository-url>
cd LeadSupportPlatform
```

### 2. Environment Configuration
```bash
# Copy environment template
cp .env.example .env

# Edit .env and add your API keys
nano .env
```

Required environment variables:
```bash
# Database
DATABASE_URL=postgresql://gtm_user:gtm_password@localhost:5432/gtm_platform

# Redis
REDIS_URL=redis://localhost:6379/0

# JWT Secret (generate with: openssl rand -hex 32)
JWT_SECRET=your-secret-key-here

# AI Providers
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...

# Email (for development)
SMTP_HOST=localhost
SMTP_PORT=1025
```

### 3. Start Infrastructure
```bash
# Start PostgreSQL, Redis, and MailHog
docker-compose up -d postgres redis mailhog
```

### 4. Backend Setup
```bash
cd apps/backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
alembic upgrade head

# Start backend
uvicorn main:app --reload --port 8000
```

### 5. AI Service Setup
```bash
cd apps/ai_service

# Create virtual environment
python -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start AI service
uvicorn main:app --reload --port 8001
```

### 6. Frontend Setup
```bash
cd apps/frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### 7. Background Workers (Optional)
```bash
cd apps/backend

# Start Celery worker
celery -A core.celery_app worker --loglevel=info

# Start Celery beat (scheduler)
celery -A core.celery_app beat --loglevel=info
```

### Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs
- AI Service: http://localhost:8001
- MailHog (email testing): http://localhost:8025

## Production Deployment

### Option 1: Deploy with Docker Compose

#### 1. Prepare Server
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo apt install docker-compose-plugin
```

#### 2. Clone and Configure
```bash
# Clone repository
git clone <repository-url>
cd LeadSupportPlatform

# Create production .env
cp .env.example .env
nano .env  # Set production values
```

#### 3. Deploy
```bash
# Build and start all services
docker-compose up -d --build

# Check logs
docker-compose logs -f

# Run migrations
docker-compose exec backend alembic upgrade head
```

### Option 2: Deploy to Railway

#### Frontend (Vercel)
1. Push code to GitHub
2. Connect repository to Vercel
3. Configure environment variables:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend.railway.app
   NEXT_PUBLIC_AI_SERVICE_URL=https://your-ai-service.railway.app
   ```
4. Deploy automatically on push

#### Backend (Railway)
1. Create new project on Railway
2. Add PostgreSQL database
3. Add Redis
4. Deploy backend service:
   - Set root directory: `apps/backend`
   - Set build command: `pip install -r requirements.txt`
   - Set start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Configure environment variables
6. Deploy

#### AI Service (Railway)
1. Add new service to Railway project
2. Deploy AI service:
   - Set root directory: `apps/ai_service`
   - Set build command: `pip install -r requirements.txt`
   - Set start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
3. Configure environment variables
4. Deploy

### Option 3: Deploy to Fly.io

#### 1. Install Fly CLI
```bash
curl -L https://fly.io/install.sh | sh
```

#### 2. Login
```bash
fly auth login
```

#### 3. Deploy Backend
```bash
cd apps/backend

# Create app
fly launch --name gtm-backend --region sjc

# Set secrets
fly secrets set DATABASE_URL="postgres://..." \
  REDIS_URL="redis://..." \
  JWT_SECRET="..." \
  OPENAI_API_KEY="..." \
  ANTHROPIC_API_KEY="..."

# Deploy
fly deploy
```

#### 4. Deploy AI Service
```bash
cd apps/ai_service

# Create app
fly launch --name gtm-ai-service --region sjc

# Set secrets
fly secrets set OPENAI_API_KEY="..." \
  ANTHROPIC_API_KEY="..."

# Deploy
fly deploy
```

#### 5. Deploy Frontend (Vercel)
Same as Railway option above.

## Database Migrations

### Create New Migration
```bash
cd apps/backend

# Auto-generate migration
alembic revision --autogenerate -m "description of changes"

# Review generated migration file
# Edit if necessary

# Apply migration
alembic upgrade head
```

### Rollback Migration
```bash
# Rollback one version
alembic downgrade -1

# Rollback to specific version
alembic downgrade <revision>

# Rollback all
alembic downgrade base
```

## Monitoring Setup

### Sentry Setup
1. Create account at sentry.io
2. Create new project
3. Get DSN
4. Add to environment:
   ```bash
   SENTRY_DSN=https://...@sentry.io/...
   SENTRY_ENVIRONMENT=production
   ```

### Log Monitoring
```bash
# View backend logs
docker-compose logs -f backend

# View AI service logs
docker-compose logs -f ai_service

# View worker logs
docker-compose logs -f celery_worker
```

## Backup & Recovery

### Database Backup
```bash
# Create backup
docker-compose exec postgres pg_dump -U gtm_user gtm_platform > backup.sql

# Restore backup
docker-compose exec -T postgres psql -U gtm_user gtm_platform < backup.sql
```

### Automated Backups
```bash
# Add to crontab
0 2 * * * cd /path/to/app && docker-compose exec -T postgres pg_dump -U gtm_user gtm_platform | gzip > backups/backup-$(date +\%Y\%m\%d).sql.gz

# Keep last 7 days
find backups/ -name "backup-*.sql.gz" -mtime +7 -delete
```

## Scaling

### Horizontal Scaling

#### Backend API
```bash
# Scale backend instances
docker-compose up -d --scale backend=3

# Or in Kubernetes
kubectl scale deployment backend --replicas=3
```

#### Background Workers
```bash
# Scale Celery workers
docker-compose up -d --scale celery_worker=5
```

### Database Scaling
```bash
# Add read replicas (PostgreSQL)
# Configure in connection string:
DATABASE_URL_PRIMARY=postgresql://...
DATABASE_URL_REPLICA=postgresql://...

# Use replicas for read queries
```

### Caching
- Redis cluster for high availability
- Cache AI responses aggressively
- Use CDN for frontend assets

## SSL/TLS Setup

### Using Let's Encrypt
```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal
sudo certbot renew --dry-run
```

## Health Checks

### Endpoints
- Backend: `GET /health`
- Backend Readiness: `GET /health/ready`
- AI Service: `GET /health`

### Monitoring Script
```bash
#!/bin/bash
# check-health.sh

BACKEND_URL="https://your-backend.com"
AI_SERVICE_URL="https://your-ai-service.com"

# Check backend
if curl -f -s "$BACKEND_URL/health" > /dev/null; then
    echo "✓ Backend is healthy"
else
    echo "✗ Backend is down"
    # Send alert
fi

# Check AI service
if curl -f -s "$AI_SERVICE_URL/health" > /dev/null; then
    echo "✓ AI Service is healthy"
else
    echo "✗ AI Service is down"
    # Send alert
fi
```

## Performance Optimization

### Database
```sql
-- Add indexes for common queries
CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_created ON leads(created_at);
CREATE INDEX idx_events_company_created ON events(company_id, created_at);

-- Enable vector indexing (pgvector)
CREATE INDEX ON leads USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);
```

### Application
```python
# Enable query result caching
from core.redis import redis_client

@cache(expire=300)  # 5 minutes
async def get_dashboard_stats():
    # Expensive query
    pass
```

### Frontend
- Enable Next.js image optimization
- Use static generation where possible
- Implement route-based code splitting
- Use CDN for assets

## Troubleshooting

### Backend Won't Start
```bash
# Check logs
docker-compose logs backend

# Common issues:
# 1. Database connection failed
#    - Verify DATABASE_URL
#    - Check if PostgreSQL is running
# 2. Redis connection failed
#    - Verify REDIS_URL
#    - Check if Redis is running
# 3. Missing environment variables
#    - Check .env file
```

### Database Migration Issues
```bash
# Check current version
alembic current

# Check migration history
alembic history

# Force set version (use carefully)
alembic stamp head
```

### High Memory Usage
```bash
# Check container stats
docker stats

# Limit memory usage
docker-compose.yml:
  services:
    backend:
      mem_limit: 512m
```

## Security Checklist

- [ ] Change default passwords
- [ ] Set strong JWT_SECRET
- [ ] Enable HTTPS/TLS
- [ ] Configure CORS properly
- [ ] Enable rate limiting
- [ ] Set up firewall rules
- [ ] Regular security updates
- [ ] Database backup enabled
- [ ] Monitoring and alerts configured
- [ ] Secrets not in code/git

## Cost Optimization

### AI API Costs
```python
# Cache AI responses
@cache_ai_response(ttl=3600)
async def score_lead(lead_data):
    # Expensive AI call
    pass

# Batch operations
await batch_score_leads(leads)  # Process multiple leads in one call
```

### Database
- Regular VACUUM and ANALYZE
- Archive old data
- Use connection pooling
- Optimize queries

### Infrastructure
- Use spot instances (AWS/GCP)
- Scale down during off-hours
- Use serverless for frontend
- Monitor and alert on costs

## Support

For issues and questions:
- GitHub Issues: <repository-url>/issues
- Documentation: <docs-url>
- Email: support@gtmplatform.com
