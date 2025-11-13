"""Email models for tracking communications."""
from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, Text, ForeignKey, Enum as SQLEnum
from sqlalchemy.dialects.postgresql import UUID, JSONB, ARRAY
import uuid
import enum

from core.database import Base


class EmailStatus(str, enum.Enum):
    """Email status enumeration."""
    DRAFT = "draft"
    SCHEDULED = "scheduled"
    SENDING = "sending"
    SENT = "sent"
    DELIVERED = "delivered"
    OPENED = "opened"
    CLICKED = "clicked"
    REPLIED = "replied"
    BOUNCED = "bounced"
    FAILED = "failed"


class EmailType(str, enum.Enum):
    """Email type enumeration."""
    OUTBOUND = "outbound"
    INBOUND = "inbound"
    SEQUENCE = "sequence"
    TRANSACTIONAL = "transactional"
    SUPPORT = "support"


class Email(Base):
    """Email model for tracking all email communications."""

    __tablename__ = "emails"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    # Email details
    from_email = Column(String(255), nullable=False, index=True)
    to_email = Column(String(255), nullable=False, index=True)
    cc = Column(ARRAY(String), default=[])
    bcc = Column(ARRAY(String), default=[])

    subject = Column(String(500), nullable=False)
    body_text = Column(Text, nullable=True)
    body_html = Column(Text, nullable=True)

    # Classification
    email_type = Column(SQLEnum(EmailType), nullable=False, index=True)
    status = Column(SQLEnum(EmailStatus), default=EmailStatus.DRAFT, nullable=False, index=True)

    # Associations
    lead_id = Column(UUID(as_uuid=True), ForeignKey("leads.id"), nullable=True, index=True)
    contact_id = Column(UUID(as_uuid=True), ForeignKey("contacts.id"), nullable=True, index=True)
    sequence_id = Column(UUID(as_uuid=True), ForeignKey("sequences.id"), nullable=True, index=True)
    enrollment_id = Column(UUID(as_uuid=True), ForeignKey("sequence_enrollments.id"), nullable=True, index=True)
    ticket_id = Column(UUID(as_uuid=True), nullable=True, index=True)

    # Sender/owner
    sender_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True, index=True)

    # Template
    template_id = Column(UUID(as_uuid=True), nullable=True)

    # AI generation
    ai_generated = Column(Boolean, default=False)
    ai_prompt = Column(Text, nullable=True)
    ai_personalization = Column(JSONB, default={})

    # Tracking
    opens_count = Column(Integer, default=0)
    clicks_count = Column(Integer, default=0)
    first_opened_at = Column(DateTime, nullable=True)
    last_opened_at = Column(DateTime, nullable=True)
    first_clicked_at = Column(DateTime, nullable=True)
    last_clicked_at = Column(DateTime, nullable=True)

    # Reply tracking
    replied = Column(Boolean, default=False)
    replied_at = Column(DateTime, nullable=True)
    reply_email_id = Column(UUID(as_uuid=True), nullable=True)
    thread_id = Column(String(255), nullable=True, index=True)

    # Scheduling
    scheduled_at = Column(DateTime, nullable=True, index=True)
    sent_at = Column(DateTime, nullable=True)
    delivered_at = Column(DateTime, nullable=True)

    # Bounce handling
    bounced_at = Column(DateTime, nullable=True)
    bounce_reason = Column(Text, nullable=True)

    # Provider details
    provider = Column(String(50), nullable=True)  # SMTP, SendGrid, etc.
    provider_message_id = Column(String(255), nullable=True, index=True)

    # Metadata
    metadata = Column(JSONB, default={})
    headers = Column(JSONB, default={})

    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f"<Email {self.subject}>"


class EmailTemplate(Base):
    """Email template model for reusable email content."""

    __tablename__ = "email_templates"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False, index=True)
    description = Column(Text, nullable=True)

    # Template content
    subject = Column(String(500), nullable=False)
    body_text = Column(Text, nullable=True)
    body_html = Column(Text, nullable=True)

    # Category
    category = Column(String(100), nullable=True, index=True)

    # Variables
    variables = Column(ARRAY(String), default=[])  # {{first_name}}, etc.

    # AI configuration
    use_ai_enhancement = Column(Boolean, default=False)
    ai_enhancement_prompt = Column(Text, nullable=True)

    # Usage tracking
    usage_count = Column(Integer, default=0)
    last_used_at = Column(DateTime, nullable=True)

    # Owner
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)

    # Status
    is_active = Column(Boolean, default=True)

    # Metadata
    metadata = Column(JSONB, default={})

    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f"<EmailTemplate {self.name}>"
