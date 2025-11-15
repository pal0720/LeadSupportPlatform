# Security Documentation

Comprehensive security guide for the AI-Driven GTM Platform.

## Table of Contents

- [Security Overview](#security-overview)
- [Authentication and Authorization](#authentication-and-authorization)
- [Data Encryption](#data-encryption)
- [API Security](#api-security)
- [Rate Limiting](#rate-limiting)
- [Webhook Security](#webhook-security)
- [GDPR Compliance](#gdpr-compliance)
- [Audit Logging](#audit-logging)
- [Secrets Management](#secrets-management)
- [Security Best Practices](#security-best-practices)
- [Vulnerability Reporting](#vulnerability-reporting)

## Security Overview

The GTM Platform implements multiple layers of security to protect user data and ensure safe operations:

- **Authentication**: JWT-based authentication with secure token management
- **Authorization**: Role-based access control (RBAC) with workspace isolation
- **Encryption**: Data encryption at rest and in transit
- **Input Validation**: Comprehensive input sanitization and validation
- **Rate Limiting**: Protection against brute force and DoS attacks
- **Audit Logging**: Complete audit trail of all actions
- **Security Headers**: Industry-standard HTTP security headers

## Authentication and Authorization

### JWT Token-Based Authentication

The platform uses JSON Web Tokens (JWT) for stateless authentication.

#### Token Types

1. **Access Token**: Short-lived (30 minutes default)
   - Used for API requests
   - Contains user ID, email, and role
   - Auto-refreshed by frontend

2. **Refresh Token**: Long-lived (30 days default)
   - Used to obtain new access tokens
   - Stored securely (httpOnly cookie recommended)
   - Can be revoked

#### Token Security

```python
# Token configuration
JWT_SECRET=<strong-random-secret>  # Min 32 characters
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=30
JWT_REFRESH_TOKEN_EXPIRE_DAYS=30
```

**Security Measures:**
- Tokens are signed with HMAC-SHA256
- Secret key must be at least 32 bytes
- Tokens include expiration time
- Tokens are validated on every request

### Password Security

#### Password Requirements

Enforced password policy:
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one digit
- At least one special character

#### Password Hashing

```python
# Using bcrypt for password hashing
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
```

**Security Features:**
- Bcrypt with automatic salt generation
- Cost factor: 12 (configurable)
- Passwords never stored in plain text
- Passwords never logged or exposed in API responses

### Role-Based Access Control (RBAC)

#### User Roles

1. **OWNER**: Full access to workspace and billing
2. **ADMIN**: Most permissions except billing
3. **MARKETING_MANAGER**: Marketing and campaign access
4. **SALES_REP**: CRM and deal access
5. **SUPPORT_AGENT**: Support ticket access
6. **EXECUTIVE**: Read-only dashboard access
7. **GUEST**: Limited read-only access

#### Permission Checks

```python
# Example: Require admin role
from core.security import require_roles

@router.patch("/workspace/{id}")
async def update_workspace(
    user_id: str = Depends(require_roles("owner", "admin"))
):
    # Only owners and admins can update workspace
    pass
```

### Multi-Tenancy Isolation

All data is scoped to workspaces:

```python
# All queries include workspace filter
deals = await db.execute(
    select(Deal)
    .where(Deal.workspace_id == workspace_id)
)
```

**Security Guarantees:**
- Users can only access their workspace data
- Workspace ID validated on every request
- Cross-workspace access attempts logged and blocked

## Data Encryption

### Encryption at Rest

#### Database Encryption

```sql
-- PostgreSQL encryption
CREATE TABLE sensitive_data (
    id UUID PRIMARY KEY,
    encrypted_value TEXT,  -- Encrypted with Fernet
    ...
);
```

#### Using EncryptionService

```python
from core.security import encryption_service

# Encrypt sensitive data
api_key = "sk_live_abc123"
encrypted = encryption_service.encrypt(api_key)

# Decrypt when needed
decrypted = encryption_service.decrypt(encrypted)
```

**Encryption Details:**
- Algorithm: Fernet (symmetric encryption)
- Key derivation: SHA-256 from JWT_SECRET
- All API keys and credentials encrypted
- Encryption key rotatable without data migration

### Encryption in Transit

#### TLS/SSL Configuration

**Production Requirements:**
- Minimum TLS 1.2
- Strong cipher suites only
- HSTS header enabled
- Certificate from trusted CA

```nginx
# Nginx SSL configuration
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256';
ssl_prefer_server_ciphers off;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
```

## API Security

### Security Headers

All API responses include security headers:

```python
# Applied by SecurityHeadersMiddleware
Content-Security-Policy: default-src 'self'; ...
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

### Input Validation and Sanitization

#### XSS Prevention

```python
from core.security import data_sanitizer

# Sanitize user input
clean_text = data_sanitizer.sanitize_html(user_input)

# Validate email
if not data_sanitizer.validate_email(email):
    raise ValueError("Invalid email")
```

#### SQL Injection Prevention

- **Always use parameterized queries**
- **Never concatenate user input into SQL**
- **Use ORM (SQLAlchemy) for database operations**

```python
# GOOD - Parameterized query
result = await db.execute(
    select(User).where(User.email == email)
)

# BAD - Never do this
query = f"SELECT * FROM users WHERE email = '{email}'"
```

### CORS Configuration

```python
# Configure allowed origins
CORS_ORIGINS=https://yourdomain.com,https://app.yourdomain.com

# Applied by CORSMiddleware
allow_origins=settings.CORS_ORIGINS
allow_credentials=True
allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE"]
allow_headers=["*"]
```

**Security Notes:**
- Never use `allow_origins=["*"]` in production
- Specify exact domains
- Enable credentials only if needed

## Rate Limiting

### Rate Limiter Configuration

```python
# Default rate limits
RATE_LIMIT_PER_MINUTE=60  # 60 requests per minute

# Applied by RateLimitMiddleware
from core.security import rate_limiter

allowed = await rate_limiter.check_rate_limit(
    key=user_id,
    max_requests=60,
    window_seconds=60
)
```

### Rate Limit Headers

```http
X-RateLimit-Limit: 60
X-RateLimit-Window: 60
X-RateLimit-Remaining: 45
Retry-After: 60
```

### Custom Rate Limits

```python
# Per-endpoint rate limiting
@router.post("/expensive-operation")
@rate_limit(max_requests=10, window=3600)  # 10 per hour
async def expensive_operation():
    pass
```

## Webhook Security

### HMAC Signature Verification

```python
from core.security import webhook_security

# Generate signature (sender)
timestamp = str(int(time.time()))
payload = json.dumps(webhook_data)
signature = webhook_security.generate_signature(payload, timestamp)

# Verify signature (receiver)
try:
    is_valid = webhook_security.verify_signature(
        payload=request.body,
        signature=request.headers["X-Webhook-Signature"],
        timestamp=request.headers["X-Webhook-Timestamp"],
        tolerance=300  # 5 minutes
    )
except ValueError:
    # Invalid signature or expired timestamp
    raise HTTPException(status_code=401)
```

### Webhook Headers

```http
X-Webhook-Signature: abc123...
X-Webhook-Timestamp: 1234567890
X-Webhook-ID: unique-id
```

## GDPR Compliance

### Data Protection Features

#### 1. Right to Access
```python
# Export all user data
GET /api/v1/users/me/export
```

#### 2. Right to Erasure
```python
# Delete user account and all data
DELETE /api/v1/users/me
```

#### 3. Data Portability
```python
# Export data in JSON format
GET /api/v1/users/me/export?format=json
```

#### 4. Consent Management
```python
# User consent tracking
{
    "marketing_consent": true,
    "analytics_consent": false,
    "consent_date": "2024-01-15T10:00:00Z"
}
```

### Data Retention

```python
# Configurable retention periods
RETENTION_POLICIES = {
    "audit_logs": 365,  # days
    "deleted_users": 30,
    "anonymous_sessions": 90,
}
```

### Data Anonymization

```python
# Anonymize user data instead of deletion
async def anonymize_user(user_id: str):
    user.email = f"deleted_{uuid4()}@deleted.local"
    user.full_name = "Deleted User"
    user.is_active = False
    user.deleted_at = datetime.utcnow()
```

## Audit Logging

### What is Logged

All API requests are logged with:
- Request ID (unique identifier)
- Timestamp
- User ID (if authenticated)
- Workspace ID
- HTTP method and path
- Query parameters
- IP address
- User agent
- Response status code
- Duration (milliseconds)
- Errors (if any)

### Audit Log Storage

```sql
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY,
    request_id UUID NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    user_id UUID,
    workspace_id UUID,
    method VARCHAR(10),
    path TEXT,
    query_params JSONB,
    client_ip INET,
    status_code INTEGER,
    duration_ms FLOAT,
    error TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Index for fast queries
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id, timestamp);
CREATE INDEX idx_audit_logs_workspace ON audit_logs(workspace_id, timestamp);
```

### Querying Audit Logs

```python
# Get user activity
GET /api/v1/audit-logs?user_id={id}&start_date={date}&end_date={date}

# Get workspace activity
GET /api/v1/audit-logs?workspace_id={id}&limit=100
```

### Log Retention

- **Audit logs**: Retained for 1 year
- **Error logs**: Retained for 90 days
- **Access logs**: Retained for 30 days

## Secrets Management

### Environment Variables

**Never commit secrets to git!**

```bash
# Use .env file (add to .gitignore)
JWT_SECRET=<secret>
DATABASE_PASSWORD=<secret>
OPENAI_API_KEY=<secret>
```

### Using Secret Management Services

#### AWS Secrets Manager

```python
import boto3

def get_secret(secret_name):
    client = boto3.client('secretsmanager')
    response = client.get_secret_value(SecretId=secret_name)
    return response['SecretString']
```

#### HashiCorp Vault

```python
import hvac

client = hvac.Client(url='http://vault:8200')
secret = client.secrets.kv.v2.read_secret_version(path='gtm-platform')
```

### API Key Security

```python
from core.security import api_key_security

# Generate API key
api_key = api_key_security.generate_api_key(prefix="sk")
# Returns: sk_abc123...

# Hash for storage
hashed = api_key_security.hash_api_key(api_key)

# Verify API key
is_valid = api_key_security.verify_api_key(api_key, hashed)
```

**API Key Best Practices:**
- Show keys only once (on creation)
- Store only hashed versions
- Allow key rotation
- Support key revocation
- Implement key expiration

## Security Best Practices

### For Developers

1. **Input Validation**
   - Validate all user input
   - Use Pydantic models for request validation
   - Sanitize HTML input
   - Check for SQL injection patterns

2. **Error Handling**
   - Never expose stack traces to users
   - Log errors securely
   - Use generic error messages

3. **Dependencies**
   - Keep dependencies updated
   - Run `pip audit` regularly
   - Review security advisories

4. **Code Review**
   - All code must be reviewed
   - Security-sensitive changes require security review
   - Check for hardcoded secrets

### For Operators

1. **Access Control**
   - Use principle of least privilege
   - Rotate credentials regularly
   - Use SSH keys (not passwords)
   - Enable MFA for all accounts

2. **Monitoring**
   - Monitor for suspicious activity
   - Set up alerts for anomalies
   - Review audit logs regularly

3. **Backups**
   - Encrypt backups
   - Test recovery procedures
   - Store backups securely

4. **Updates**
   - Apply security patches promptly
   - Test updates in staging first
   - Have rollback plan

### Security Checklist

#### Pre-Deployment
- [ ] All secrets stored securely
- [ ] SSL/TLS certificates configured
- [ ] Security headers enabled
- [ ] Rate limiting configured
- [ ] CORS properly set
- [ ] Database access restricted
- [ ] Firewall rules configured
- [ ] Monitoring enabled
- [ ] Backups configured
- [ ] Audit logging enabled

#### Post-Deployment
- [ ] Security scan completed
- [ ] Penetration test passed
- [ ] Vulnerability scan clean
- [ ] Compliance review done
- [ ] Incident response plan documented
- [ ] Security training completed

## Vulnerability Reporting

### Responsible Disclosure

If you discover a security vulnerability:

1. **DO NOT** create a public GitHub issue
2. **DO** email security@yourdomain.com with:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

3. We will:
   - Acknowledge within 24 hours
   - Provide timeline for fix
   - Keep you updated on progress
   - Credit you (if desired) after fix

### Bounty Program

We offer rewards for valid security vulnerabilities:

- **Critical**: $500-$2000
- **High**: $200-$500
- **Medium**: $50-$200
- **Low**: Recognition + swag

### Security Updates

Subscribe to security announcements:
- Email: security-announce@yourdomain.com
- RSS: https://yourdomain.com/security/feed

## Compliance

### Standards Followed

- **OWASP Top 10**: All vulnerabilities addressed
- **GDPR**: Full compliance for EU users
- **SOC 2**: Type II certification (in progress)
- **ISO 27001**: Information security management
- **HIPAA**: Available for healthcare customers

### Regular Audits

- **Code Security Audit**: Quarterly
- **Penetration Testing**: Semi-annually
- **Compliance Review**: Annually
- **Dependency Audit**: Weekly (automated)

## Additional Resources

- [OWASP Cheat Sheets](https://cheatsheetseries.owasp.org/)
- [CWE Top 25](https://cwe.mitre.org/top25/)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)

---

**Last Updated**: 2024-01-15
**Version**: 1.0
**Contact**: security@yourdomain.com
