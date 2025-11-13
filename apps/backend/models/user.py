"""User model for authentication and authorization."""
from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, Enum as SQLEnum
from sqlalchemy.dialects.postgresql import UUID, JSONB
import uuid
import enum

from core.database import Base


class UserRole(str, enum.Enum):
    """User role enumeration."""
    ADMIN = "admin"
    SALES = "sales"
    SUPPORT = "support"
    SUCCESS = "success"
    VIEWER = "viewer"


class User(Base):
    """User model for authentication and team members."""

    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(SQLEnum(UserRole), default=UserRole.VIEWER, nullable=False)

    # Profile information
    avatar_url = Column(String(500), nullable=True)
    phone = Column(String(50), nullable=True)
    timezone = Column(String(50), default="UTC")

    # Status
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    last_login_at = Column(DateTime, nullable=True)

    # Team assignment
    team_id = Column(UUID(as_uuid=True), nullable=True, index=True)

    # Preferences
    preferences = Column(JSONB, default={})

    # Metadata
    metadata = Column(JSONB, default={})

    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f"<User {self.email}>"
