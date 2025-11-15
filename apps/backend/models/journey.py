"""
Marketing journey and automation models.
"""
from datetime import datetime
from sqlalchemy import Column, String, Integer, Boolean, DateTime, Text, ForeignKey, Enum as SQLEnum
from sqlalchemy.dialects.postgresql import UUID, JSONB, ARRAY
import uuid
import enum

from core.database import Base


class JourneyStatus(str, enum.Enum):
    """Journey status enumeration."""
    DRAFT = "draft"
    ACTIVE = "active"
    PAUSED = "paused"
    ARCHIVED = "archived"


class Journey(Base):
    """
    Marketing journey/automation workflow.
    """
    __tablename__ = "journeys"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    workspace_id = Column(UUID(as_uuid=True), ForeignKey("workspaces.id"), nullable=False, index=True)

    # Basic info
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)

    # Status
    status = Column(SQLEnum(JourneyStatus), default=JourneyStatus.DRAFT, nullable=False, index=True)

    # Journey configuration
    trigger = Column(JSONB, default={})  # What starts this journey
    steps = Column(JSONB, default=[])  # Array of journey steps with conditions
    goal = Column(String(255), nullable=True)  # What success looks like

    # Settings
    allow_multiple_entries = Column(Boolean, default=False)
    exit_on_goal_achieved = Column(Boolean, default=True)

    # Performance
    total_entries = Column(Integer, default=0)
    active_entries = Column(Integer, default=0)
    completed_entries = Column(Integer, default=0)
    goal_achieved_count = Column(Integer, default=0)

    # AI optimization
    ai_optimized = Column(Boolean, default=False)
    ai_suggestions = Column(JSONB, default=[])

    # Owner
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)

    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_executed_at = Column(DateTime, nullable=True)

    def __repr__(self):
        return f"<Journey {self.name}>"


class JourneyEnrollment(Base):
    """
    Individual enrollment in a journey.
    """
    __tablename__ = "journey_enrollments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    workspace_id = Column(UUID(as_uuid=True), ForeignKey("workspaces.id"), nullable=False, index=True)
    journey_id = Column(UUID(as_uuid=True), ForeignKey("journeys.id"), nullable=False, index=True)

    # Who is enrolled
    contact_id = Column(UUID(as_uuid=True), ForeignKey("contacts.id"), nullable=True, index=True)
    lead_id = Column(UUID(as_uuid=True), ForeignKey("leads.id"), nullable=True, index=True)

    # Status
    status = Column(String(50), default="active")  # active, completed, exited, failed
    current_step_index = Column(Integer, default=0)

    # Journey progress
    steps_completed = Column(Integer, default=0)
    total_steps = Column(Integer, default=0)

    # Timing
    enrolled_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    next_step_at = Column(DateTime, nullable=True, index=True)
    completed_at = Column(DateTime, nullable=True)
    exited_at = Column(DateTime, nullable=True)
    exit_reason = Column(String(255), nullable=True)

    # Goal
    goal_achieved = Column(Boolean, default=False)
    goal_achieved_at = Column(DateTime, nullable=True)

    # Data
    context = Column(JSONB, default={})  # Custom data for this enrollment

    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f"<JourneyEnrollment {self.journey_id}>"


class Campaign(Base):
    """
    Marketing campaign model.
    """
    __tablename__ = "campaigns"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    workspace_id = Column(UUID(as_uuid=True), ForeignKey("workspaces.id"), nullable=False, index=True)

    # Basic info
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)

    # Type
    campaign_type = Column(String(50), nullable=False)  # email, social, paid_ads, seo, etc.

    # Status
    status = Column(String(50), default="draft")  # draft, scheduled, running, paused, completed

    # Timing
    starts_at = Column(DateTime, nullable=True, index=True)
    ends_at = Column(DateTime, nullable=True)

    # Budget (for paid campaigns)
    budget = Column(Integer, nullable=True)
    spent = Column(Integer, default=0)

    # Target
    target_audience = Column(JSONB, default={})  # Segment criteria
    estimated_reach = Column(Integer, nullable=True)

    # Content
    content_ids = Column(ARRAY(UUID), default=[])  # Generated content assets

    # Goals
    goal_type = Column(String(50), nullable=True)  # leads, conversions, engagement, etc.
    goal_value = Column(Integer, nullable=True)

    # Performance
    impressions = Column(Integer, default=0)
    clicks = Column(Integer, default=0)
    conversions = Column(Integer, default=0)
    leads_generated = Column(Integer, default=0)
    revenue_generated = Column(Integer, default=0)

    # AI
    ai_generated = Column(Boolean, default=False)
    ai_optimized = Column(Boolean, default=False)

    # Owner
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)

    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f"<Campaign {self.name}>"


class ContentAsset(Base):
    """
    Generated content asset (text, image, video, audio).
    """
    __tablename__ = "content_assets"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    workspace_id = Column(UUID(as_uuid=True), ForeignKey("workspaces.id"), nullable=False, index=True)

    # Type
    asset_type = Column(String(50), nullable=False, index=True)  # text, image, video, audio

    # Basic info
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)

    # Content
    content = Column(Text, nullable=True)  # For text
    file_url = Column(String(500), nullable=True)  # For media
    thumbnail_url = Column(String(500), nullable=True)

    # Metadata
    format = Column(String(50), nullable=True)  # markdown, html, mp4, mp3, jpg, etc.
    size_bytes = Column(Integer, nullable=True)
    duration_seconds = Column(Integer, nullable=True)  # For video/audio
    dimensions = Column(JSONB, nullable=True)  # {width, height} for images/videos

    # Generation
    ai_generated = Column(Boolean, default=False)
    generation_prompt = Column(Text, nullable=True)
    generation_model = Column(String(100), nullable=True)

    # Usage
    campaign_id = Column(UUID(as_uuid=True), ForeignKey("campaigns.id"), nullable=True, index=True)
    used_in_campaigns = Column(Integer, default=0)
    used_in_emails = Column(Integer, default=0)
    used_in_social = Column(Integer, default=0)

    # Performance
    views = Column(Integer, default=0)
    clicks = Column(Integer, default=0)
    shares = Column(Integer, default=0)

    # Categories
    category = Column(String(100), nullable=True)
    tags = Column(ARRAY(String), default=[])

    # Publishing
    published = Column(Boolean, default=False)
    published_at = Column(DateTime, nullable=True)
    published_to = Column(ARRAY(String), default=[])  # Platforms it's published to

    # Owner
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True, index=True)

    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f"<ContentAsset {self.asset_type}: {self.title}>"


class SocialPost(Base):
    """
    Social media post scheduling and tracking.
    """
    __tablename__ = "social_posts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    workspace_id = Column(UUID(as_uuid=True), ForeignKey("workspaces.id"), nullable=False, index=True)

    # Platform
    platform = Column(String(50), nullable=False, index=True)  # linkedin, twitter, instagram, facebook

    # Content
    content = Column(Text, nullable=False)
    media_urls = Column(ARRAY(String), default=[])
    link = Column(String(500), nullable=True)

    # Scheduling
    status = Column(String(50), default="draft")  # draft, scheduled, published, failed
    scheduled_at = Column(DateTime, nullable=True, index=True)
    published_at = Column(DateTime, nullable=True)

    # Campaign
    campaign_id = Column(UUID(as_uuid=True), ForeignKey("campaigns.id"), nullable=True, index=True)
    content_asset_id = Column(UUID(as_uuid=True), ForeignKey("content_assets.id"), nullable=True)

    # Performance
    impressions = Column(Integer, default=0)
    engagement = Column(Integer, default=0)  # likes + comments + shares
    clicks = Column(Integer, default=0)
    shares = Column(Integer, default=0)

    # Platform IDs
    platform_post_id = Column(String(255), nullable=True)  # ID from the platform
    platform_url = Column(String(500), nullable=True)

    # AI
    ai_generated = Column(Boolean, default=False)

    # Owner
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True, index=True)

    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f"<SocialPost {self.platform}>"
