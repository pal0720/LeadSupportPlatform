# Deployment Guide

Comprehensive guide for deploying the AI-Driven GTM Platform to production.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Docker Deployment](#docker-deployment)
- [Kubernetes Deployment](#kubernetes-deployment)
- [CI/CD Pipeline](#cicd-pipeline)
- [Monitoring and Logging](#monitoring-and-logging)
- [Backup and Recovery](#backup-and-recovery)
- [Scaling Considerations](#scaling-considerations)
- [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Software

- **Docker**: 20.10+ and Docker Compose 2.0+
- **PostgreSQL**: 14+ (if not using Docker)
- **Redis**: 6.2+ (if not using Docker)
- **Node.js**: 18+ (for frontend)
- **Python**: 3.11+ (for backend)
- **Nginx**: Latest (for reverse proxy)

### Recommended Infrastructure

- **CPU**: 4+ cores per service
- **RAM**: 8GB+ minimum
- **Storage**: 100GB+ SSD
- **Network**: 100Mbps+ bandwidth

### External Services

- **AI Providers**: OpenAI API key and/or Anthropic API key
- **Email Service**: SMTP server or service (SendGrid, AWS SES)
- **Monitoring**: Sentry account (optional but recommended)
- **Object Storage**: AWS S3 or compatible (for file uploads)

## Environment Variables

Copy the `.env.example` file and configure all required variables:

```bash
cp .env.example .env
```

### Critical Variables

#### Application Settings
```env
ENVIRONMENT=production
DEBUG=false
SECRET_KEY=<generate-strong-secret-key>
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
```

#### Database
```env
DATABASE_URL=postgresql+asyncpg://user:password@postgres:5432/gtm_platform
```

#### Redis
```env
REDIS_URL=redis://redis:6379/0
```

#### JWT Authentication
```env
JWT_SECRET=<generate-strong-jwt-secret>
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=30
JWT_REFRESH_TOKEN_EXPIRE_DAYS=30
```

#### AI Services
```env
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
AI_SERVICE_URL=http://ai-service:8001
```

#### CORS
```env
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### Generate Secrets

Use these commands to generate secure secrets:

```bash
# Generate SECRET_KEY
python -c "import secrets; print(secrets.token_urlsafe(32))"

# Generate JWT_SECRET
openssl rand -hex 32

# Generate API keys
python -c "import secrets; print(f'sk_{secrets.token_urlsafe(32)}')"
```

## Database Setup

### 1. Create Production Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database and user
CREATE DATABASE gtm_platform;
CREATE USER gtm_user WITH ENCRYPTED PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE gtm_platform TO gtm_user;

# Enable required extensions
\c gtm_platform
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "unaccent";
```

### 2. Run Database Migrations

```bash
cd apps/backend

# Install dependencies
pip install -r requirements.txt

# Run migrations
alembic upgrade head
```

### 3. Create Initial Superuser

```bash
# Create superuser via API or directly in database
python scripts/create_superuser.py \
  --email admin@yourdomain.com \
  --password <secure-password> \
  --full-name "Admin User"
```

### 4. Database Optimization

Add these to your PostgreSQL configuration (`postgresql.conf`):

```conf
# Memory settings
shared_buffers = 2GB
effective_cache_size = 6GB
maintenance_work_mem = 512MB
work_mem = 32MB

# Connection settings
max_connections = 200

# Performance
random_page_cost = 1.1
effective_io_concurrency = 200

# Logging
log_min_duration_statement = 1000
log_line_prefix = '%t [%p]: [%l-1] user=%u,db=%d,app=%a,client=%h '
```

## Docker Deployment

### 1. Production Build

Build all services:

```bash
# Build backend
docker build -t gtm-platform-backend:latest ./apps/backend

# Build frontend
docker build -t gtm-platform-frontend:latest ./apps/frontend

# Build AI service
docker build -t gtm-platform-ai:latest ./apps/ai-service
```

### 2. Deploy with Docker Compose

Use the production configuration:

```bash
docker-compose -f docker-compose.prod.yml up -d
```

### 3. Verify Deployment

```bash
# Check container status
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f backend

# Health check
curl http://localhost:8000/health
```

### 4. SSL/TLS Configuration

Use Let's Encrypt with Certbot:

```bash
# Install certbot
apt-get install certbot python3-certbot-nginx

# Obtain certificate
certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal (add to crontab)
0 12 * * * /usr/bin/certbot renew --quiet
```

## Kubernetes Deployment

### 1. Create Namespace

```yaml
# namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: gtm-platform
```

```bash
kubectl apply -f namespace.yaml
```

### 2. Configure Secrets

```bash
# Create secrets
kubectl create secret generic gtm-secrets \
  --from-literal=database-url='postgresql://...' \
  --from-literal=jwt-secret='...' \
  --from-literal=openai-api-key='...' \
  -n gtm-platform
```

### 3. Deploy PostgreSQL

```yaml
# postgres-deployment.yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: postgres
  namespace: gtm-platform
spec:
  serviceName: postgres
  replicas: 1
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
      - name: postgres
        image: postgres:14
        ports:
        - containerPort: 5432
        env:
        - name: POSTGRES_DB
          value: gtm_platform
        - name: POSTGRES_USER
          value: gtm_user
        - name: POSTGRES_PASSWORD
          valueFrom:
            secretKeyRef:
              name: gtm-secrets
              key: postgres-password
        volumeMounts:
        - name: postgres-storage
          mountPath: /var/lib/postgresql/data
  volumeClaimTemplates:
  - metadata:
      name: postgres-storage
    spec:
      accessModes: [ "ReadWriteOnce" ]
      resources:
        requests:
          storage: 100Gi
```

### 4. Deploy Backend API

```yaml
# backend-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend
  namespace: gtm-platform
spec:
  replicas: 3
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
    spec:
      containers:
      - name: backend
        image: gtm-platform-backend:latest
        ports:
        - containerPort: 8000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: gtm-secrets
              key: database-url
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: gtm-secrets
              key: jwt-secret
        livenessProbe:
          httpGet:
            path: /health/live
            port: 8000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health/ready
            port: 8000
          initialDelaySeconds: 10
          periodSeconds: 5
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "2Gi"
            cpu: "2000m"
```

### 5. Deploy Ingress

```yaml
# ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: gtm-platform-ingress
  namespace: gtm-platform
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
spec:
  tls:
  - hosts:
    - yourdomain.com
    secretName: gtm-platform-tls
  rules:
  - host: yourdomain.com
    http:
      paths:
      - path: /api
        pathType: Prefix
        backend:
          service:
            name: backend
            port:
              number: 8000
      - path: /
        pathType: Prefix
        backend:
          service:
            name: frontend
            port:
              number: 80
```

### 6. Apply Kubernetes Configuration

```bash
kubectl apply -f postgres-deployment.yaml
kubectl apply -f backend-deployment.yaml
kubectl apply -f frontend-deployment.yaml
kubectl apply -f ingress.yaml
```

## CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'

      - name: Install dependencies
        run: |
          cd apps/backend
          pip install -r requirements.txt

      - name: Run tests
        run: |
          cd apps/backend
          pytest tests/ -v

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Build Docker images
        run: |
          docker build -t ${{ secrets.REGISTRY }}/backend:${{ github.sha }} ./apps/backend
          docker build -t ${{ secrets.REGISTRY }}/frontend:${{ github.sha }} ./apps/frontend

      - name: Push to registry
        run: |
          echo ${{ secrets.REGISTRY_PASSWORD }} | docker login -u ${{ secrets.REGISTRY_USER }} --password-stdin
          docker push ${{ secrets.REGISTRY }}/backend:${{ github.sha }}
          docker push ${{ secrets.REGISTRY }}/frontend:${{ github.sha }}

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Kubernetes
        run: |
          kubectl set image deployment/backend backend=${{ secrets.REGISTRY }}/backend:${{ github.sha }}
          kubectl set image deployment/frontend frontend=${{ secrets.REGISTRY }}/frontend:${{ github.sha }}
```

## Monitoring and Logging

### 1. Setup Prometheus

```yaml
# prometheus-config.yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'backend'
    static_configs:
      - targets: ['backend:8000']
    metrics_path: '/metrics'
```

### 2. Setup Grafana

```bash
# Deploy Grafana
docker run -d -p 3000:3000 \
  --name=grafana \
  -e "GF_SECURITY_ADMIN_PASSWORD=secure_password" \
  grafana/grafana
```

Import the provided dashboards from `monitoring/grafana/`.

### 3. Sentry Integration

Configure in `.env`:

```env
SENTRY_DSN=https://...@sentry.io/...
SENTRY_ENVIRONMENT=production
```

### 4. Log Aggregation

Use ELK stack or similar:

```yaml
# filebeat.yaml
filebeat.inputs:
- type: container
  paths:
    - '/var/lib/docker/containers/*/*.log'

output.elasticsearch:
  hosts: ['elasticsearch:9200']
```

## Backup and Recovery

### 1. Database Backups

Automated daily backups:

```bash
#!/bin/bash
# backup.sh

BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/gtm_platform_$DATE.sql"

# Backup database
pg_dump -U gtm_user gtm_platform | gzip > $BACKUP_FILE.gz

# Upload to S3
aws s3 cp $BACKUP_FILE.gz s3://your-backup-bucket/postgres/

# Cleanup old backups (keep 30 days)
find $BACKUP_DIR -type f -mtime +30 -delete
```

Add to crontab:
```cron
0 2 * * * /path/to/backup.sh
```

### 2. Restore from Backup

```bash
# Download backup
aws s3 cp s3://your-backup-bucket/postgres/gtm_platform_20240115.sql.gz .

# Restore
gunzip < gtm_platform_20240115.sql.gz | psql -U gtm_user gtm_platform
```

### 3. Redis Backups

Configure Redis persistence in `redis.conf`:

```conf
save 900 1
save 300 10
save 60 10000
dir /data
dbfilename dump.rdb
```

## Scaling Considerations

### Horizontal Scaling

1. **Backend API**: Scale to 3-5 replicas
   ```bash
   kubectl scale deployment backend --replicas=5
   ```

2. **Database**: Use read replicas for read-heavy workloads

3. **Redis**: Use Redis Cluster for high availability

### Vertical Scaling

Increase resources per pod/container:

```yaml
resources:
  requests:
    memory: "2Gi"
    cpu: "2000m"
  limits:
    memory: "4Gi"
    cpu: "4000m"
```

### Performance Optimization

1. **Enable caching**: Redis for session and API caching
2. **Use CDN**: CloudFlare or AWS CloudFront for static assets
3. **Database indexing**: Review and optimize indexes
4. **Connection pooling**: Configure appropriate pool sizes

### Load Testing

Use tools like Locust or k6:

```python
# locustfile.py
from locust import HttpUser, task

class APIUser(HttpUser):
    @task
    def health_check(self):
        self.client.get("/health")
```

## Troubleshooting

### Common Issues

#### Database Connection Errors

```bash
# Check database connectivity
docker exec -it postgres psql -U gtm_user -d gtm_platform

# Check connection pool
docker logs backend | grep "pool"
```

#### High Memory Usage

```bash
# Check container memory
docker stats

# Restart service
kubectl rollout restart deployment/backend
```

#### Slow API Responses

```bash
# Check slow queries
psql -U gtm_user -d gtm_platform -c "SELECT * FROM pg_stat_statements ORDER BY mean_time DESC LIMIT 10;"

# Check Redis
redis-cli --stat
```

### Support Channels

- GitHub Issues: [repository]/issues
- Email: support@yourdomain.com
- Slack: #gtm-platform-support

## Security Checklist

Before deploying to production:

- [ ] All secrets stored securely (not in code)
- [ ] SSL/TLS enabled for all services
- [ ] Firewall configured (only necessary ports open)
- [ ] Database access restricted to application only
- [ ] Regular security updates scheduled
- [ ] Backup and recovery tested
- [ ] Monitoring and alerting configured
- [ ] Rate limiting enabled
- [ ] CORS properly configured
- [ ] Security headers added (see SECURITY.md)
