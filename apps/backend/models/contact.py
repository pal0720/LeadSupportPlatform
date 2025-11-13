"""Contact model for converted leads and customers."""
from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB, ARRAY
import uuid

from core.database import Base


class Contact(Base):
    """Contact model for converted leads and existing customers."""

    __tablename__ = "contacts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    # Contact information
    email = Column(String(255), nullable=False, unique=True, index=True)
    first_name = Column(String(100), nullable=True)
    last_name = Column(String(100), nullable=True)
    full_name = Column(String(255), nullable=True, index=True)
    phone = Column(String(50), nullable=True)
    mobile_phone = Column(String(50), nullable=True)
    title = Column(String(255), nullable=True)
    department = Column(String(100), nullable=True)

    # Company association
    company_id = Column(UUID(as_uuid=True), ForeignKey("companies.id"), nullable=False, index=True)

    # Contact details
    is_primary = Column(Boolean, default=False)  # Primary contact for the company
    role = Column(String(100), nullable=True)  # Decision maker, influencer, etc.

    # Location
    country = Column(String(100), nullable=True)
    state = Column(String(100), nullable=True)
    city = Column(String(100), nullable=True)
    address = Column(Text, nullable=True)
    postal_code = Column(String(20), nullable=True)

    # Social profiles
    linkedin_url = Column(String(500), nullable=True)
    twitter_handle = Column(String(100), nullable=True)

    # Engagement tracking
    emails_sent = Column(Integer, default=0)
    emails_opened = Column(Integer, default=0)
    emails_clicked = Column(Integer, default=0)
    emails_replied = Column(Integer, default=0)
    last_contacted_at = Column(DateTime, nullable=True)
    last_email_opened_at = Column(DateTime, nullable=True)

    # Support tracking
    tickets_created = Column(Integer, default=0)
    last_ticket_at = Column(DateTime, nullable=True)

    # Assignment
    owner_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True, index=True)

    # CRM integration
    hubspot_id = Column(String(100), nullable=True, index=True)
    salesforce_id = Column(String(100), nullable=True, index=True)

    # Conversion tracking (from lead)
    lead_id = Column(UUID(as_uuid=True), ForeignKey("leads.id"), nullable=True)
    converted_from_lead_at = Column(DateTime, nullable=True)

    # Custom fields
    custom_fields = Column(JSONB, default={})
    metadata = Column(JSONB, default={})

    # Tags
    tags = Column(ARRAY(String), default=[])

    # Notes
    notes = Column(Text, nullable=True)

    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f"<Contact {self.email}>"
