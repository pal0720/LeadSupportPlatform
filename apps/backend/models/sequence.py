"""Sequence models for automated outreach campaigns."""
from datetime import datetime
from sqlalchemy import Column, String, Integer, Boolean, DateTime, Text, ForeignKey, Enum as SQLEnum
from sqlalchemy.dialects.postgresql import UUID, JSONB
import uuid
import enum

from core.database import Base


class SequenceStatus(str, enum.Enum):
    """Sequence status enumeration."""
    DRAFT = "draft"
    ACTIVE = "active"
    PAUSED = "paused"
    ARCHIVED = "archived"


class StepType(str, enum.Enum):
    """Sequence step type enumeration."""
    EMAIL = "email"
    TASK = "task"
    LINKEDIN = "linkedin"
    CALL = "call"
    WAIT = "wait"


class EnrollmentStatus(str, enum.Enum):
    """Enrollment status enumeration."""
    ACTIVE = "active"
    PAUSED = "paused"
    COMPLETED = "completed"
    BOUNCED = "bounced"
    UNSUBSCRIBED = "unsubscribed"
    REPLIED = "replied"


class Sequence(Base):
    """Sequence model for automated outreach campaigns."""

    __tablename__ = "sequences"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False, index=True)
    description = Column(Text, nullable=True)

    # Status
    status = Column(SQLEnum(SequenceStatus), default=SequenceStatus.DRAFT, nullable=False, index=True)

    # Configuration
    steps_count = Column(Integer, default=0)
    is_ai_optimized = Column(Boolean, default=False)  # AI-optimized sequence

    # Performance metrics
    enrollments_count = Column(Integer, default=0)
    active_enrollments = Column(Integer, default=0)
    completed_enrollments = Column(Integer, default=0)
    reply_rate = Column(String(20), nullable=True)  # Stored as string percentage
    open_rate = Column(String(20), nullable=True)
    click_rate = Column(String(20), nullable=True)
    bounce_rate = Column(String(20), nullable=True)

    # Owner
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)

    # Settings
    settings = Column(JSONB, default={})
    sequence_metadata = Column(JSONB, default={})

    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f"<Sequence {self.name}>"


class SequenceStep(Base):
    """Sequence step model for individual steps in a sequence."""

    __tablename__ = "sequence_steps"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    sequence_id = Column(UUID(as_uuid=True), ForeignKey("sequences.id"), nullable=False, index=True)

    # Step details
    step_number = Column(Integer, nullable=False)
    step_type = Column(SQLEnum(StepType), nullable=False)
    name = Column(String(255), nullable=True)

    # Delay before this step (in hours)
    delay_hours = Column(Integer, default=0)

    # Email step content
    subject = Column(String(500), nullable=True)
    body = Column(Text, nullable=True)
    template_id = Column(UUID(as_uuid=True), nullable=True)

    # Task step content
    task_description = Column(Text, nullable=True)

    # AI configuration
    use_ai_personalization = Column(Boolean, default=False)
    ai_prompt = Column(Text, nullable=True)

    # Conditions
    conditions = Column(JSONB, default={})

    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f"<SequenceStep {self.sequence_id}:{self.step_number}>"


class SequenceEnrollment(Base):
    """Sequence enrollment model for tracking lead/contact progression."""

    __tablename__ = "sequence_enrollments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    sequence_id = Column(UUID(as_uuid=True), ForeignKey("sequences.id"), nullable=False, index=True)

    # Enrolled entity (lead or contact)
    lead_id = Column(UUID(as_uuid=True), ForeignKey("leads.id"), nullable=True, index=True)
    contact_id = Column(UUID(as_uuid=True), ForeignKey("contacts.id"), nullable=True, index=True)
    email = Column(String(255), nullable=False, index=True)

    # Status
    status = Column(SQLEnum(EnrollmentStatus), default=EnrollmentStatus.ACTIVE, nullable=False, index=True)
    current_step = Column(Integer, default=0)

    # Scheduling
    next_step_at = Column(DateTime, nullable=True, index=True)
    paused_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)

    # Performance
    emails_sent = Column(Integer, default=0)
    emails_opened = Column(Integer, default=0)
    emails_clicked = Column(Integer, default=0)
    replied = Column(Boolean, default=False)
    replied_at = Column(DateTime, nullable=True)

    # Exit reason
    exit_reason = Column(String(255), nullable=True)

    # Metadata
    sequence_enrollment_metadata = Column(JSONB, default={})

    # Timestamps
    enrolled_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f"<SequenceEnrollment {self.email}>"
