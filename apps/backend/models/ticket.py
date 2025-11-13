"""Ticket models for customer support."""
from datetime import datetime
from sqlalchemy import Column, String, Integer, Boolean, DateTime, Text, ForeignKey, Enum as SQLEnum
from sqlalchemy.dialects.postgresql import UUID, JSONB, ARRAY
from pgvector.sqlalchemy import Vector
import uuid
import enum

from core.database import Base


class TicketStatus(str, enum.Enum):
    """Ticket status enumeration."""
    OPEN = "open"
    IN_PROGRESS = "in_progress"
    WAITING = "waiting"
    RESOLVED = "resolved"
    CLOSED = "closed"


class TicketPriority(str, enum.Enum):
    """Ticket priority enumeration."""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    URGENT = "urgent"


class TicketChannel(str, enum.Enum):
    """Ticket channel enumeration."""
    EMAIL = "email"
    CHAT = "chat"
    PORTAL = "portal"
    PHONE = "phone"
    API = "api"


class Ticket(Base):
    """Ticket model for customer support requests."""

    __tablename__ = "tickets"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    ticket_number = Column(String(50), unique=True, nullable=False, index=True)

    # Ticket details
    subject = Column(String(500), nullable=False, index=True)
    description = Column(Text, nullable=False)

    # Status and priority
    status = Column(SQLEnum(TicketStatus), default=TicketStatus.OPEN, nullable=False, index=True)
    priority = Column(SQLEnum(TicketPriority), default=TicketPriority.MEDIUM, nullable=False, index=True)

    # Channel
    channel = Column(SQLEnum(TicketChannel), nullable=False, index=True)

    # Customer information
    customer_email = Column(String(255), nullable=False, index=True)
    customer_name = Column(String(255), nullable=True)
    contact_id = Column(UUID(as_uuid=True), ForeignKey("contacts.id"), nullable=True, index=True)
    company_id = Column(UUID(as_uuid=True), ForeignKey("companies.id"), nullable=True, index=True)

    # Assignment
    assignee_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True, index=True)
    team_id = Column(UUID(as_uuid=True), nullable=True, index=True)
    assigned_at = Column(DateTime, nullable=True)

    # Category and classification
    category = Column(String(100), nullable=True, index=True)
    subcategory = Column(String(100), nullable=True)
    product = Column(String(100), nullable=True)

    # AI classification
    ai_category = Column(String(100), nullable=True)
    ai_sentiment = Column(String(50), nullable=True)  # positive, neutral, negative
    ai_intent = Column(String(100), nullable=True)
    ai_urgency_score = Column(Integer, nullable=True)
    ai_summary = Column(Text, nullable=True)
    ai_suggested_response = Column(Text, nullable=True)

    # Embeddings for similarity search
    embedding = Column(Vector(1536), nullable=True)

    # SLA tracking
    sla_policy = Column(String(100), nullable=True)
    first_response_due_at = Column(DateTime, nullable=True, index=True)
    first_response_at = Column(DateTime, nullable=True)
    first_response_sla_breached = Column(Boolean, default=False)
    resolution_due_at = Column(DateTime, nullable=True, index=True)
    resolved_at = Column(DateTime, nullable=True)
    resolution_sla_breached = Column(Boolean, default=False)

    # Metrics
    messages_count = Column(Integer, default=1)
    customer_messages_count = Column(Integer, default=1)
    agent_messages_count = Column(Integer, default=0)
    response_time_minutes = Column(Integer, nullable=True)
    resolution_time_minutes = Column(Integer, nullable=True)

    # Related tickets
    parent_ticket_id = Column(UUID(as_uuid=True), nullable=True, index=True)
    merged_into_ticket_id = Column(UUID(as_uuid=True), nullable=True)

    # Satisfaction
    satisfaction_rating = Column(Integer, nullable=True)  # 1-5
    satisfaction_comment = Column(Text, nullable=True)
    satisfaction_at = Column(DateTime, nullable=True)

    # Custom fields
    custom_fields = Column(JSONB, default={})
    metadata = Column(JSONB, default={})

    # Tags
    tags = Column(ARRAY(String), default=[])

    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_message_at = Column(DateTime, nullable=True)
    last_customer_message_at = Column(DateTime, nullable=True)

    def __repr__(self):
        return f"<Ticket {self.ticket_number}>"


class TicketMessage(Base):
    """Ticket message model for conversation history."""

    __tablename__ = "ticket_messages"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    ticket_id = Column(UUID(as_uuid=True), ForeignKey("tickets.id"), nullable=False, index=True)

    # Message details
    body = Column(Text, nullable=False)
    body_html = Column(Text, nullable=True)

    # Sender information
    sender_email = Column(String(255), nullable=False)
    sender_name = Column(String(255), nullable=True)
    sender_type = Column(String(50), nullable=False)  # customer, agent, system

    # Agent details (if sender is agent)
    agent_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True, index=True)

    # AI assistance
    ai_generated = Column(Boolean, default=False)
    ai_enhanced = Column(Boolean, default=False)
    ai_prompt = Column(Text, nullable=True)

    # Attachments
    attachments = Column(JSONB, default=[])

    # Email details (if from email)
    email_id = Column(UUID(as_uuid=True), nullable=True)
    email_message_id = Column(String(255), nullable=True)

    # Internal note flag
    is_internal = Column(Boolean, default=False)

    # Metadata
    metadata = Column(JSONB, default={})

    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    def __repr__(self):
        return f"<TicketMessage {self.ticket_id}>"
