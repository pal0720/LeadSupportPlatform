"""Company model for B2B accounts and prospects."""
from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, DateTime, Text
from sqlalchemy.dialects.postgresql import UUID, JSONB, ARRAY
import uuid

from core.database import Base


class Company(Base):
    """Company/Account model for B2B customers and prospects."""

    __tablename__ = "companies"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False, index=True)
    domain = Column(String(255), unique=True, nullable=True, index=True)

    # Firmographic data
    industry = Column(String(255), nullable=True, index=True)
    employee_count = Column(Integer, nullable=True)
    employee_range = Column(String(50), nullable=True)  # e.g., "1-10", "11-50"
    annual_revenue = Column(Float, nullable=True)
    revenue_range = Column(String(50), nullable=True)

    # Location
    country = Column(String(100), nullable=True, index=True)
    state = Column(String(100), nullable=True)
    city = Column(String(100), nullable=True)
    address = Column(Text, nullable=True)
    postal_code = Column(String(20), nullable=True)

    # Contact information
    phone = Column(String(50), nullable=True)
    website = Column(String(500), nullable=True)

    # Technographics
    technologies = Column(ARRAY(String), default=[])  # Technologies used
    tech_stack = Column(JSONB, default={})  # Detailed tech stack

    # Social & online presence
    linkedin_url = Column(String(500), nullable=True)
    twitter_handle = Column(String(100), nullable=True)
    facebook_url = Column(String(500), nullable=True)

    # Business details
    founded_year = Column(Integer, nullable=True)
    company_type = Column(String(100), nullable=True)  # Private, Public, Non-profit
    stock_symbol = Column(String(10), nullable=True)
    description = Column(Text, nullable=True)

    # CRM integration
    hubspot_id = Column(String(100), nullable=True, index=True)
    salesforce_id = Column(String(100), nullable=True, index=True)

    # Status & lifecycle
    lifecycle_stage = Column(String(50), nullable=True, index=True)  # prospect, lead, customer
    is_customer = Column(String(20), default="false")  # "true" or "false" as string

    # Owner assignment
    owner_id = Column(UUID(as_uuid=True), nullable=True, index=True)

    # Enrichment status
    enriched_at = Column(DateTime, nullable=True)
    enrichment_provider = Column(String(50), nullable=True)

    # Custom fields and metadata
    custom_fields = Column(JSONB, default={})
    company_metadata = Column(JSONB, default={})

    # Tags
    tags = Column(ARRAY(String), default=[])

    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f"<Company {self.name}>"
