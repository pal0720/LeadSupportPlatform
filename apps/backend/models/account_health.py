"""Account health models for customer success."""
from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB, ARRAY
import uuid

from core.database import Base


class AccountHealth(Base):
    """Account health model for tracking customer success metrics."""

    __tablename__ = "account_health"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    company_id = Column(UUID(as_uuid=True), ForeignKey("companies.id"), nullable=False, unique=True, index=True)

    # Overall health score (0-100)
    health_score = Column(Integer, nullable=False, index=True)
    previous_health_score = Column(Integer, nullable=True)
    health_trend = Column(String(50), nullable=True)  # improving, stable, declining

    # Health status
    health_status = Column(String(50), nullable=False, index=True)  # healthy, at_risk, critical
    risk_level = Column(String(50), nullable=True)  # low, medium, high

    # Churn prediction
    churn_risk_score = Column(Float, nullable=True)  # 0-1 probability
    churn_risk_level = Column(String(50), nullable=True, index=True)  # low, medium, high
    churn_risk_factors = Column(JSONB, default=[])

    # Component scores (0-100)
    engagement_score = Column(Integer, nullable=True)
    product_usage_score = Column(Integer, nullable=True)
    support_satisfaction_score = Column(Integer, nullable=True)
    relationship_score = Column(Integer, nullable=True)
    financial_score = Column(Integer, nullable=True)

    # Engagement metrics
    last_login_at = Column(DateTime, nullable=True)
    days_since_last_login = Column(Integer, nullable=True)
    active_users_count = Column(Integer, default=0)
    licensed_users_count = Column(Integer, default=0)
    user_adoption_rate = Column(Float, nullable=True)  # percentage

    # Product usage metrics
    feature_adoption_rate = Column(Float, nullable=True)
    key_features_used = Column(ARRAY(String), default=[])
    usage_trend = Column(String(50), nullable=True)  # increasing, stable, decreasing
    dau = Column(Integer, nullable=True)  # Daily active users
    wau = Column(Integer, nullable=True)  # Weekly active users
    mau = Column(Integer, nullable=True)  # Monthly active users

    # Support metrics
    open_tickets_count = Column(Integer, default=0)
    tickets_this_month = Column(Integer, default=0)
    avg_satisfaction_rating = Column(Float, nullable=True)
    last_ticket_at = Column(DateTime, nullable=True)

    # Relationship metrics
    last_touchpoint_at = Column(DateTime, nullable=True)
    days_since_last_touchpoint = Column(Integer, nullable=True)
    touchpoints_this_quarter = Column(Integer, default=0)
    executive_sponsor_engaged = Column(Boolean, default=False)
    qbr_completed_this_quarter = Column(Boolean, default=False)
    last_qbr_at = Column(DateTime, nullable=True)

    # Financial metrics
    mrr = Column(Float, nullable=True)  # Monthly recurring revenue
    arr = Column(Float, nullable=True)  # Annual recurring revenue
    ltv = Column(Float, nullable=True)  # Lifetime value
    contract_value = Column(Float, nullable=True)
    contract_start_date = Column(DateTime, nullable=True)
    contract_end_date = Column(DateTime, nullable=True)
    days_until_renewal = Column(Integer, nullable=True)
    payment_issues = Column(Boolean, default=False)

    # Expansion opportunity
    expansion_score = Column(Float, nullable=True)  # 0-100
    upsell_potential = Column(String(50), nullable=True)  # low, medium, high
    cross_sell_opportunities = Column(ARRAY(String), default=[])

    # Owner assignment
    csm_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True, index=True)  # Customer Success Manager

    # AI insights
    ai_insights = Column(JSONB, default={})
    ai_recommendations = Column(JSONB, default=[])
    ai_predicted_churn_date = Column(DateTime, nullable=True)

    # Flags and alerts
    requires_attention = Column(Boolean, default=False, index=True)
    alert_reasons = Column(JSONB, default=[])

    # Metadata
    account_health_metadata = Column(JSONB, default={})

    # Timestamps
    calculated_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f"<AccountHealth {self.company_id}>"


class ExpansionSignal(Base):
    """Expansion signal model for tracking upsell/cross-sell opportunities."""

    __tablename__ = "expansion_signals"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    company_id = Column(UUID(as_uuid=True), ForeignKey("companies.id"), nullable=False, index=True)

    # Signal details
    signal_type = Column(String(100), nullable=False, index=True)  # upsell, cross_sell, add_users
    signal_name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)

    # Scoring
    confidence_score = Column(Float, nullable=False)  # 0-1 probability
    priority = Column(String(50), nullable=False)  # low, medium, high
    potential_value = Column(Float, nullable=True)

    # Signal data
    trigger_event = Column(String(255), nullable=True)
    trigger_data = Column(JSONB, default={})

    # AI detection
    ai_detected = Column(Boolean, default=False)
    ai_reasoning = Column(Text, nullable=True)

    # Status
    status = Column(String(50), default="new", nullable=False, index=True)  # new, reviewing, actioned, dismissed
    actioned_at = Column(DateTime, nullable=True)
    actioned_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    outcome = Column(String(100), nullable=True)

    # Recommended actions
    recommended_products = Column(ARRAY(String), default=[])
    recommended_actions = Column(JSONB, default=[])

    # Owner
    assigned_to = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True, index=True)

    # Metadata
    expansion_signal_metadata = Column(JSONB, default={})

    # Timestamps
    detected_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f"<ExpansionSignal {self.signal_name}>"
