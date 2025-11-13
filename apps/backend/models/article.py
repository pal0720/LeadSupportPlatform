"""Article model for knowledge base."""
from datetime import datetime
from sqlalchemy import Column, String, Integer, Boolean, DateTime, Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB, ARRAY
from pgvector.sqlalchemy import Vector
import uuid

from core.database import Base


class Article(Base):
    """Article model for knowledge base and help documentation."""

    __tablename__ = "articles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    # Article details
    title = Column(String(500), nullable=False, index=True)
    slug = Column(String(500), unique=True, nullable=False, index=True)
    summary = Column(Text, nullable=True)
    content = Column(Text, nullable=False)
    content_html = Column(Text, nullable=True)

    # Category and organization
    category = Column(String(100), nullable=True, index=True)
    subcategory = Column(String(100), nullable=True)
    tags = Column(ARRAY(String), default=[])

    # Status
    status = Column(String(50), default="draft", nullable=False, index=True)  # draft, published, archived
    is_published = Column(Boolean, default=False, index=True)
    published_at = Column(DateTime, nullable=True)

    # Visibility
    is_public = Column(Boolean, default=True)  # Public or internal only
    is_featured = Column(Boolean, default=False)

    # Author
    author_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    last_edited_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)

    # AI features
    ai_generated = Column(Boolean, default=False)
    ai_enhanced = Column(Boolean, default=False)
    ai_suggestions = Column(JSONB, default={})
    embedding = Column(Vector(1536), nullable=True)  # For similarity search

    # SEO
    meta_description = Column(Text, nullable=True)
    meta_keywords = Column(ARRAY(String), default=[])

    # Usage metrics
    view_count = Column(Integer, default=0)
    helpful_count = Column(Integer, default=0)
    not_helpful_count = Column(Integer, default=0)
    used_in_tickets_count = Column(Integer, default=0)

    # Related content
    related_articles = Column(ARRAY(UUID), default=[])
    related_products = Column(ARRAY(String), default=[])

    # Freshness tracking
    last_reviewed_at = Column(DateTime, nullable=True)
    needs_review = Column(Boolean, default=False)

    # Metadata
    metadata = Column(JSONB, default={})

    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f"<Article {self.title}>"
