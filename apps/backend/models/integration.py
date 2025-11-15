"""
Integration and external service connection models.
"""
from datetime import datetime
from sqlalchemy import Column, String, Integer, Boolean, DateTime, Text, ForeignKey, Enum as SQLEnum
from sqlalchemy.dialects.postgresql import UUID, JSONB
import uuid
import enum

from core.database import Base


class IntegrationType(str, enum.Enum):
    """Integration type enumeration."""
    CRM = "crm"  # HubSpot, Salesforce
    EMAIL = "email"  # Gmail, Outlook, SendGrid
    CALENDAR = "calendar"  # Google Calendar, Outlook Calendar
    SOCIAL = "social"  # LinkedIn, Twitter, Instagram
    ADS = "ads"  # Google Ads, Meta Ads, LinkedIn Ads
    ENRICHMENT = "enrichment"  # Clearbit, Hunter, BuiltWith
    PAYMENT = "payment"  # Stripe
    ANALYTICS = "analytics"  # Google Analytics
    COMMUNICATION = "communication"  # Slack, Teams, WhatsApp
    STORAGE = "storage"  # S3, Google Drive


class IntegrationStatus(str, enum.Enum):
    """Integration status enumeration."""
    ACTIVE = "active"
    INACTIVE = "inactive"
    ERROR = "error"
    EXPIRED = "expired"


class Integration(Base):
    """
    External service integration configuration.
    """
    __tablename__ = "integrations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    workspace_id = Column(UUID(as_uuid=True), ForeignKey("workspaces.id"), nullable=False, index=True)

    # Integration details
    integration_type = Column(SQLEnum(IntegrationType), nullable=False, index=True)
    provider = Column(String(100), nullable=False)  # hubspot, salesforce, gmail, etc.
    name = Column(String(255), nullable=False)

    # Status
    status = Column(SQLEnum(IntegrationStatus), default=IntegrationStatus.INACTIVE, nullable=False)

    # Authentication
    auth_type = Column(String(50), nullable=False)  # oauth2, api_key, basic
    credentials = Column(JSONB, default={})  # Encrypted credentials
    access_token = Column(Text, nullable=True)  # Encrypted
    refresh_token = Column(Text, nullable=True)  # Encrypted
    token_expires_at = Column(DateTime, nullable=True)

    # Configuration
    config = Column(JSONB, default={})  # Provider-specific configuration
    field_mappings = Column(JSONB, default={})  # How to map fields

    # Sync settings
    sync_enabled = Column(Boolean, default=True)
    sync_direction = Column(String(50), default="bidirectional")  # inbound, outbound, bidirectional
    last_sync_at = Column(DateTime, nullable=True)
    next_sync_at = Column(DateTime, nullable=True)
    sync_frequency_minutes = Column(Integer, default=60)

    # Error handling
    last_error = Column(Text, nullable=True)
    error_count = Column(Integer, default=0)
    last_error_at = Column(DateTime, nullable=True)

    # Usage
    total_api_calls = Column(Integer, default=0)
    api_calls_this_month = Column(Integer, default=0)
    rate_limit_remaining = Column(Integer, nullable=True)
    rate_limit_reset_at = Column(DateTime, nullable=True)

    # Owner
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)

    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_used_at = Column(DateTime, nullable=True)

    def __repr__(self):
        return f"<Integration {self.provider}>"


class Webhook(Base):
    """
    Webhook configuration for inbound and outbound webhooks.
    """
    __tablename__ = "webhooks"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    workspace_id = Column(UUID(as_uuid=True), ForeignKey("workspaces.id"), nullable=False, index=True)

    # Basic info
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)

    # Direction
    direction = Column(String(20), nullable=False)  # inbound, outbound

    # URL
    url = Column(String(500), nullable=False)
    secret = Column(String(255), nullable=True)  # For signature verification

    # Events (for outbound webhooks)
    events = Column(JSONB, default=[])  # Array of event types to trigger on

    # Status
    is_active = Column(Boolean, default=True)

    # Performance
    total_calls = Column(Integer, default=0)
    successful_calls = Column(Integer, default=0)
    failed_calls = Column(Integer, default=0)
    last_called_at = Column(DateTime, nullable=True)
    average_response_time_ms = Column(Integer, nullable=True)

    # Error tracking
    last_error = Column(Text, nullable=True)
    last_error_at = Column(DateTime, nullable=True)

    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f"<Webhook {self.name}>"


class WebhookLog(Base):
    """
    Log of webhook calls for debugging and monitoring.
    """
    __tablename__ = "webhook_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    workspace_id = Column(UUID(as_uuid=True), ForeignKey("workspaces.id"), nullable=False, index=True)
    webhook_id = Column(UUID(as_uuid=True), ForeignKey("webhooks.id"), nullable=False, index=True)

    # Request
    request_method = Column(String(10), nullable=False)
    request_url = Column(String(500), nullable=False)
    request_headers = Column(JSONB, default={})
    request_body = Column(JSONB, default={})

    # Response
    response_status = Column(Integer, nullable=True)
    response_headers = Column(JSONB, default={})
    response_body = Column(JSONB, default={})

    # Timing
    duration_ms = Column(Integer, nullable=True)

    # Status
    success = Column(Boolean, default=False)
    error_message = Column(Text, nullable=True)

    # Timestamp
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    def __repr__(self):
        return f"<WebhookLog {self.webhook_id}>"


class AuditLog(Base):
    """
    Audit log for all actions (user and AI agent).
    """
    __tablename__ = "audit_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    workspace_id = Column(UUID(as_uuid=True), ForeignKey("workspaces.id"), nullable=False, index=True)

    # Actor (who did it)
    actor_type = Column(String(50), nullable=False, index=True)  # user, ai_agent, system
    actor_id = Column(UUID(as_uuid=True), nullable=True, index=True)
    actor_name = Column(String(255), nullable=True)

    # Action
    action = Column(String(100), nullable=False, index=True)  # created, updated, deleted, etc.
    resource_type = Column(String(100), nullable=False, index=True)  # lead, deal, email, etc.
    resource_id = Column(UUID(as_uuid=True), nullable=True, index=True)

    # Details
    description = Column(Text, nullable=True)
    changes = Column(JSONB, default={})  # Before/after values

    # Context
    ip_address = Column(String(50), nullable=True)
    user_agent = Column(String(500), nullable=True)
    request_id = Column(String(100), nullable=True)

    # Timestamp
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)

    def __repr__(self):
        return f"<AuditLog {self.action} {self.resource_type}>"
