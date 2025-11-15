"""
Deal/Opportunity models for CRM pipeline management.
"""
from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, Text, ForeignKey, Enum as SQLEnum
from sqlalchemy.dialects.postgresql import UUID, JSONB, ARRAY
import uuid
import enum

from core.database import Base


class DealStage(str, enum.Enum):
    """Deal stage enumeration."""
    PROSPECTING = "prospecting"
    QUALIFICATION = "qualification"
    PROPOSAL = "proposal"
    NEGOTIATION = "negotiation"
    CLOSED_WON = "closed_won"
    CLOSED_LOST = "closed_lost"


class DealPriority(str, enum.Enum):
    """Deal priority enumeration."""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class Deal(Base):
    """
    Deal/Opportunity model for sales pipeline management.
    """
    __tablename__ = "deals"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    workspace_id = Column(UUID(as_uuid=True), ForeignKey("workspaces.id"), nullable=False, index=True)

    # Basic info
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)

    # Associations
    company_id = Column(UUID(as_uuid=True), ForeignKey("companies.id"), nullable=True, index=True)
    primary_contact_id = Column(UUID(as_uuid=True), ForeignKey("contacts.id"), nullable=True, index=True)
    lead_id = Column(UUID(as_uuid=True), ForeignKey("leads.id"), nullable=True, index=True)  # Original lead

    # Deal details
    stage = Column(SQLEnum(DealStage), default=DealStage.PROSPECTING, nullable=False, index=True)
    priority = Column(SQLEnum(DealPriority), default=DealPriority.MEDIUM, nullable=False)

    # Financial
    amount = Column(Float, nullable=True)
    currency = Column(String(3), default="USD")
    probability = Column(Integer, default=0)  # 0-100%
    expected_close_date = Column(DateTime, nullable=True, index=True)

    # Pipeline
    pipeline_id = Column(UUID(as_uuid=True), nullable=True, index=True)
    position = Column(Integer, default=0)  # For kanban ordering

    # Assignment
    owner_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True, index=True)
    team_id = Column(UUID(as_uuid=True), nullable=True)

    # Tracking
    source = Column(String(100), nullable=True)  # Where did this deal come from
    created_from_lead_at = Column(DateTime, nullable=True)

    # AI insights
    ai_win_probability = Column(Float, nullable=True)  # AI-calculated probability
    ai_insights = Column(JSONB, default={})
    ai_recommended_actions = Column(JSONB, default=[])

    # Dates
    first_contact_date = Column(DateTime, nullable=True)
    last_activity_date = Column(DateTime, nullable=True)
    closed_date = Column(DateTime, nullable=True)

    # Close reason (if lost)
    lost_reason = Column(String(255), nullable=True)
    competitor = Column(String(255), nullable=True)

    # Custom fields
    custom_fields = Column(JSONB, default={})
    metadata = Column(JSONB, default={})

    # Tags
    tags = Column(ARRAY(String), default=[])

    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    deleted_at = Column(DateTime, nullable=True)

    def __repr__(self):
        return f"<Deal {self.name}>"


class Pipeline(Base):
    """
    Pipeline configuration for customizable deal stages.
    """
    __tablename__ = "pipelines"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    workspace_id = Column(UUID(as_uuid=True), ForeignKey("workspaces.id"), nullable=False, index=True)

    # Basic info
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)

    # Stages (ordered)
    stages = Column(JSONB, default=[])  # Array of {name, probability, color}

    # Default pipeline
    is_default = Column(Boolean, default=False)

    # Settings
    auto_rotate_stale_deals = Column(Boolean, default=False)
    stale_days = Column(Integer, default=30)

    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f"<Pipeline {self.name}>"


class Activity(Base):
    """
    Activity/Task model for CRM actions and to-dos.
    """
    __tablename__ = "activities"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    workspace_id = Column(UUID(as_uuid=True), ForeignKey("workspaces.id"), nullable=False, index=True)

    # Activity type
    type = Column(String(50), nullable=False, index=True)  # call, email, meeting, task, note

    # Title and description
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)

    # Associations (activity can be linked to multiple entities)
    company_id = Column(UUID(as_uuid=True), ForeignKey("companies.id"), nullable=True, index=True)
    contact_id = Column(UUID(as_uuid=True), ForeignKey("contacts.id"), nullable=True, index=True)
    deal_id = Column(UUID(as_uuid=True), ForeignKey("deals.id"), nullable=True, index=True)
    lead_id = Column(UUID(as_uuid=True), ForeignKey("leads.id"), nullable=True, index=True)

    # Assignment
    assigned_to = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True, index=True)
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True, index=True)

    # Status
    status = Column(String(50), default="pending")  # pending, completed, cancelled
    priority = Column(String(20), default="medium")  # low, medium, high

    # Timing
    due_date = Column(DateTime, nullable=True, index=True)
    completed_at = Column(DateTime, nullable=True)
    scheduled_at = Column(DateTime, nullable=True)

    # Call/meeting specific
    duration_minutes = Column(Integer, nullable=True)
    outcome = Column(String(255), nullable=True)

    # AI generated
    ai_generated = Column(Boolean, default=False)
    ai_agent_id = Column(String(100), nullable=True)

    # Metadata
    metadata = Column(JSONB, default={})

    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f"<Activity {self.type}: {self.title}>"


class Note(Base):
    """
    Note model for CRM notes and comments.
    """
    __tablename__ = "notes"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    workspace_id = Column(UUID(as_uuid=True), ForeignKey("workspaces.id"), nullable=False, index=True)

    # Content
    content = Column(Text, nullable=False)

    # Associations
    company_id = Column(UUID(as_uuid=True), ForeignKey("companies.id"), nullable=True, index=True)
    contact_id = Column(UUID(as_uuid=True), ForeignKey("contacts.id"), nullable=True, index=True)
    deal_id = Column(UUID(as_uuid=True), ForeignKey("deals.id"), nullable=True, index=True)
    lead_id = Column(UUID(as_uuid=True), ForeignKey("leads.id"), nullable=True, index=True)
    ticket_id = Column(UUID(as_uuid=True), ForeignKey("tickets.id"), nullable=True, index=True)

    # Author
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)

    # AI generated
    ai_generated = Column(Boolean, default=False)
    ai_summary = Column(Boolean, default=False)  # Is this an AI-generated summary

    # Visibility
    is_internal = Column(Boolean, default=False)

    # Mentions
    mentions = Column(ARRAY(UUID), default=[])  # User IDs mentioned

    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f"<Note {self.id}>"


class Timeline(Base):
    """
    Unified customer timeline - all interactions with a company/contact.
    """
    __tablename__ = "timeline"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    workspace_id = Column(UUID(as_uuid=True), ForeignKey("workspaces.id"), nullable=False, index=True)

    # What happened
    event_type = Column(String(100), nullable=False, index=True)  # email_sent, call_made, deal_created, etc.
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)

    # Associations
    company_id = Column(UUID(as_uuid=True), ForeignKey("companies.id"), nullable=True, index=True)
    contact_id = Column(UUID(as_uuid=True), ForeignKey("contacts.id"), nullable=True, index=True)
    lead_id = Column(UUID(as_uuid=True), ForeignKey("leads.id"), nullable=True, index=True)
    deal_id = Column(UUID(as_uuid=True), ForeignKey("deals.id"), nullable=True, index=True)

    # Related entity IDs
    related_entity_type = Column(String(50), nullable=True)  # email, activity, ticket, etc.
    related_entity_id = Column(UUID(as_uuid=True), nullable=True)

    # Who did it
    actor_type = Column(String(50), nullable=True)  # user, ai_agent, system
    actor_id = Column(UUID(as_uuid=True), nullable=True)
    actor_name = Column(String(255), nullable=True)

    # Data
    data = Column(JSONB, default={})

    # Timestamp
    occurred_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    def __repr__(self):
        return f"<Timeline {self.event_type}>"
