"""
Enhanced multi-tenant workspace and organization models.
"""
from datetime import datetime
from sqlalchemy import Column, String, Integer, Boolean, DateTime, Text, Enum as SQLEnum, Float, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB, ARRAY
import uuid
import enum

from core.database import Base


class SubscriptionTier(str, enum.Enum):
    """Subscription tier enumeration."""
    FREE = "free"
    STARTER = "starter"
    PROFESSIONAL = "professional"
    ENTERPRISE = "enterprise"


class WorkspaceStatus(str, enum.Enum):
    """Workspace status enumeration."""
    ACTIVE = "active"
    SUSPENDED = "suspended"
    CANCELLED = "cancelled"
    TRIAL = "trial"


class Workspace(Base):
    """
    Workspace/Tenant model for multi-tenancy.
    All data is scoped to a workspace.
    """
    __tablename__ = "workspaces"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    # Basic info
    name = Column(String(255), nullable=False)
    slug = Column(String(100), unique=True, nullable=False, index=True)
    domain = Column(String(255), nullable=True)  # Custom domain

    # Subscription
    subscription_tier = Column(SQLEnum(SubscriptionTier), default=SubscriptionTier.FREE, nullable=False)
    status = Column(SQLEnum(WorkspaceStatus), default=WorkspaceStatus.TRIAL, nullable=False, index=True)

    # Billing
    stripe_customer_id = Column(String(255), nullable=True, index=True)
    stripe_subscription_id = Column(String(255), nullable=True)
    trial_ends_at = Column(DateTime, nullable=True)
    subscription_ends_at = Column(DateTime, nullable=True)

    # Limits (based on tier)
    max_users = Column(Integer, default=2)
    max_contacts = Column(Integer, default=1000)
    max_ai_requests_per_month = Column(Integer, default=100)

    # Usage tracking
    current_users = Column(Integer, default=0)
    current_contacts = Column(Integer, default=0)
    ai_requests_this_month = Column(Integer, default=0)
    last_usage_reset = Column(DateTime, default=datetime.utcnow)

    # Owner
    owner_id = Column(UUID(as_uuid=True), nullable=True, index=True)

    # Brand kit
    brand_colors = Column(JSONB, default={})  # primary, secondary, accent, etc.
    brand_fonts = Column(JSONB, default={})
    logo_url = Column(String(500), nullable=True)
    brand_voice = Column(Text, nullable=True)  # AI brand voice description

    # Settings
    timezone = Column(String(50), default="UTC")
    default_currency = Column(String(3), default="USD")
    language = Column(String(10), default="en")

    # Features enabled
    features = Column(JSONB, default={})  # Feature flags per workspace

    # Metadata
    metadata = Column(JSONB, default={})

    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    deleted_at = Column(DateTime, nullable=True)  # Soft delete

    def __repr__(self):
        return f"<Workspace {self.name}>"


class UserRole(str, enum.Enum):
    """Enhanced user role enumeration."""
    OWNER = "owner"  # Account owner/admin
    ADMIN = "admin"  # Admin with most permissions
    MARKETING_MANAGER = "marketing_manager"
    SALES_REP = "sales_rep"  # SDR/AM
    SUPPORT_AGENT = "support_agent"
    EXECUTIVE = "executive"  # View-only dashboards
    GUEST = "guest"  # Read-only access


class WorkspaceMember(Base):
    """
    Workspace membership linking users to workspaces with roles.
    """
    __tablename__ = "workspace_members"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    workspace_id = Column(UUID(as_uuid=True), ForeignKey("workspaces.id"), nullable=False, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)

    # Role in this workspace
    role = Column(SQLEnum(UserRole), nullable=False)

    # Permissions (granular overrides)
    permissions = Column(JSONB, default={})

    # Status
    is_active = Column(Boolean, default=True)

    # Invitation
    invited_by = Column(UUID(as_uuid=True), nullable=True)
    invited_at = Column(DateTime, nullable=True)
    joined_at = Column(DateTime, default=datetime.utcnow)

    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f"<WorkspaceMember {self.user_id} in {self.workspace_id}>"


class BrandKit(Base):
    """
    Brand kit configuration for AI content generation.
    """
    __tablename__ = "brand_kits"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    workspace_id = Column(UUID(as_uuid=True), ForeignKey("workspaces.id"), nullable=False, index=True)

    # Visual identity
    primary_color = Column(String(7), nullable=True)  # #RRGGBB
    secondary_color = Column(String(7), nullable=True)
    accent_color = Column(String(7), nullable=True)

    # Typography
    primary_font = Column(String(100), nullable=True)
    secondary_font = Column(String(100), nullable=True)

    # Logos
    logo_primary_url = Column(String(500), nullable=True)
    logo_secondary_url = Column(String(500), nullable=True)
    logo_icon_url = Column(String(500), nullable=True)

    # Brand voice
    voice_description = Column(Text, nullable=True)
    tone_formal_casual = Column(Integer, default=5)  # 1-10 scale
    tone_professional_playful = Column(Integer, default=5)
    tone_serious_humorous = Column(Integer, default=5)

    # Content guidelines
    messaging_pillars = Column(ARRAY(String), default=[])
    brand_keywords = Column(ARRAY(String), default=[])
    avoid_words = Column(ARRAY(String), default=[])

    # Target audience
    target_personas = Column(JSONB, default=[])

    # Templates
    email_signature = Column(Text, nullable=True)
    social_bio = Column(Text, nullable=True)

    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f"<BrandKit {self.workspace_id}>"
