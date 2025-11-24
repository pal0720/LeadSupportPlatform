"""Lead model for prospect management."""
from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, Text, ForeignKey, Enum as SQLEnum
from sqlalchemy.dialects.postgresql import UUID, JSONB, ARRAY
from pgvector.sqlalchemy import Vector
import uuid
import enum

from core.database import Base


class LeadStatus(str, enum.Enum):
    """Lead status enumeration."""
    NEW = "new"
    CONTACTED = "contacted"
    QUALIFIED = "qualified"
    UNQUALIFIED = "unqualified"
    NURTURING = "nurturing"
    CONVERTED = "converted"
    LOST = "lost"


class LeadSource(str, enum.Enum):
    """Lead source enumeration."""
    WEBSITE = "website"
    FORM = "form"
    CHAT = "chat"
    REFERRAL = "referral"
    EVENT = "event"
    SOCIAL = "social"
    MANUAL = "manual"
    API = "api"


class Lead(Base):
    """Lead model for prospect management."""

    __tablename__ = "leads"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    # Contact information
    email = Column(String(255), nullable=False, index=True)
    first_name = Column(String(100), nullable=True)
    last_name = Column(String(100), nullable=True)
    full_name = Column(String(255), nullable=True, index=True)
    phone = Column(String(50), nullable=True)
    title = Column(String(255), nullable=True)

    # Company association
    company_id = Column(UUID(as_uuid=True), ForeignKey("companies.id"), nullable=True, index=True)
    company_name = Column(String(255), nullable=True, index=True)
    company_domain = Column(String(255), nullable=True, index=True)

    # Lead details
    status = Column(SQLEnum(LeadStatus), default=LeadStatus.NEW, nullable=False, index=True)
    source = Column(SQLEnum(LeadSource), nullable=True, index=True)
    source_details = Column(String(500), nullable=True)

    # Lead scoring
    score = Column(Integer, default=0, nullable=False, index=True)
    score_reasons = Column(JSONB, default={})
    ai_score = Column(Float, nullable=True)
    fit_score = Column(Integer, nullable=True)
    intent_score = Column(Integer, nullable=True)
    engagement_score = Column(Integer, nullable=True)

    # Qualification
    is_qualified = Column(Boolean, default=False, index=True)
    qualification_date = Column(DateTime, nullable=True)
    disqualification_reason = Column(Text, nullable=True)

    # Intent signals
    intent_signals = Column(JSONB, default=[])
    website_visits = Column(Integer, default=0)
    page_views = Column(Integer, default=0)
    last_visit_at = Column(DateTime, nullable=True)

    # Engagement tracking
    emails_sent = Column(Integer, default=0)
    emails_opened = Column(Integer, default=0)
    emails_clicked = Column(Integer, default=0)
    emails_replied = Column(Integer, default=0)
    last_email_sent_at = Column(DateTime, nullable=True)
    last_email_opened_at = Column(DateTime, nullable=True)
    last_contacted_at = Column(DateTime, nullable=True)

    # Assignment
    owner_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True, index=True)
    assigned_at = Column(DateTime, nullable=True)

    # Enrichment
    enriched = Column(Boolean, default=False)
    enriched_at = Column(DateTime, nullable=True)
    enrichment_provider = Column(String(50), nullable=True)

    # Location
    country = Column(String(100), nullable=True)
    state = Column(String(100), nullable=True)
    city = Column(String(100), nullable=True)

    # Social profiles
    linkedin_url = Column(String(500), nullable=True)
    twitter_handle = Column(String(100), nullable=True)

    # AI and embeddings
    embedding = Column(Vector(1536), nullable=True)  # OpenAI embedding dimension
    ai_summary = Column(Text, nullable=True)
    ai_insights = Column(JSONB, default={})

    # CRM integration
    hubspot_id = Column(String(100), nullable=True, index=True)
    salesforce_id = Column(String(100), nullable=True, index=True)

    # Conversion tracking
    converted = Column(Boolean, default=False, index=True)
    converted_at = Column(DateTime, nullable=True)
    converted_to_contact_id = Column(UUID(as_uuid=True), nullable=True)

    # Custom fields
    custom_fields = Column(JSONB, default={})
    lead_metadata = Column(JSONB, default={})

    # Tags
    tags = Column(ARRAY(String), default=[])

    # Notes
    notes = Column(Text, nullable=True)

    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f"<Lead {self.email}>"
