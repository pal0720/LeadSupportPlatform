"""Event model for tracking all platform activities."""
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Text, Index
from sqlalchemy.dialects.postgresql import UUID, JSONB
import uuid

from core.database import Base


class Event(Base):
    """Event model for tracking all activities and behaviors."""

    __tablename__ = "events"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    # Event classification
    event_type = Column(String(100), nullable=False, index=True)
    event_name = Column(String(255), nullable=False, index=True)
    event_category = Column(String(100), nullable=True, index=True)

    # Actor (who performed the action)
    actor_type = Column(String(50), nullable=True)  # user, lead, contact, system, api
    actor_id = Column(UUID(as_uuid=True), nullable=True, index=True)
    actor_email = Column(String(255), nullable=True, index=True)

    # Target (what was acted upon)
    target_type = Column(String(100), nullable=True, index=True)  # lead, company, ticket, email, etc.
    target_id = Column(UUID(as_uuid=True), nullable=True, index=True)

    # Company/Account context
    company_id = Column(UUID(as_uuid=True), nullable=True, index=True)
    lead_id = Column(UUID(as_uuid=True), nullable=True, index=True)
    contact_id = Column(UUID(as_uuid=True), nullable=True, index=True)

    # Event details
    description = Column(Text, nullable=True)
    properties = Column(JSONB, default={})

    # Session tracking
    session_id = Column(String(255), nullable=True, index=True)
    device_type = Column(String(50), nullable=True)
    user_agent = Column(String(500), nullable=True)
    ip_address = Column(String(50), nullable=True)

    # Location
    country = Column(String(100), nullable=True)
    city = Column(String(100), nullable=True)

    # Referrer and source
    referrer = Column(String(500), nullable=True)
    utm_source = Column(String(255), nullable=True)
    utm_medium = Column(String(255), nullable=True)
    utm_campaign = Column(String(255), nullable=True)
    utm_content = Column(String(255), nullable=True)
    utm_term = Column(String(255), nullable=True)

    # Metadata
    metadata = Column(JSONB, default={})

    # Timestamp
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)

    # Indexes for common queries
    __table_args__ = (
        Index('ix_events_actor_created', 'actor_id', 'created_at'),
        Index('ix_events_target_created', 'target_type', 'target_id', 'created_at'),
        Index('ix_events_company_created', 'company_id', 'created_at'),
        Index('ix_events_type_created', 'event_type', 'created_at'),
    )

    def __repr__(self):
        return f"<Event {self.event_name}>"
