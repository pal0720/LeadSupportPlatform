"""
Multi-agent AI system models for autonomous operations.
"""
from datetime import datetime
from sqlalchemy import Column, String, Integer, Boolean, DateTime, Text, ForeignKey, Enum as SQLEnum, Float
from sqlalchemy.dialects.postgresql import UUID, JSONB, ARRAY
import uuid
import enum

from core.database import Base


class AgentType(str, enum.Enum):
    """AI agent type enumeration."""
    ORCHESTRATOR = "orchestrator"  # Coordinates all agents
    CRM_DATA = "crm_data"  # Handles CRM operations
    MARKETING = "marketing"  # Marketing strategy and campaigns
    CONTENT = "content"  # Multimodal content generation
    LEAD_GEN = "lead_gen"  # Lead generation and outbound
    SUPPORT = "support"  # Customer support
    ANALYTICS = "analytics"  # Data analysis and insights


class AgentStatus(str, enum.Enum):
    """Agent status enumeration."""
    IDLE = "idle"
    RUNNING = "running"
    PAUSED = "paused"
    ERROR = "error"


class AIAgent(Base):
    """
    AI Agent configuration and state.
    """
    __tablename__ = "ai_agents"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    workspace_id = Column(UUID(as_uuid=True), ForeignKey("workspaces.id"), nullable=False, index=True)

    # Agent identity
    agent_type = Column(SQLEnum(AgentType), nullable=False, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)

    # Status
    status = Column(SQLEnum(AgentStatus), default=AgentStatus.IDLE, nullable=False)
    is_enabled = Column(Boolean, default=True)

    # Configuration
    config = Column(JSONB, default={})  # Agent-specific configuration
    system_prompt = Column(Text, nullable=True)  # Custom system prompt
    model = Column(String(100), default="gpt-4-turbo-preview")  # LLM model to use
    temperature = Column(Float, default=0.7)

    # Memory and context
    long_term_memory = Column(JSONB, default={})  # Persistent agent memory
    context_window_size = Column(Integer, default=10)  # How many recent interactions to keep

    # Performance tracking
    total_tasks_completed = Column(Integer, default=0)
    total_tasks_failed = Column(Integer, default=0)
    average_task_duration_seconds = Column(Float, nullable=True)

    # Last activity
    last_active_at = Column(DateTime, nullable=True)
    last_task_id = Column(UUID(as_uuid=True), nullable=True)

    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f"<AIAgent {self.agent_type}: {self.name}>"


class AgentTask(Base):
    """
    Task assigned to an AI agent.
    """
    __tablename__ = "agent_tasks"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    workspace_id = Column(UUID(as_uuid=True), ForeignKey("workspaces.id"), nullable=False, index=True)

    # Agent assignment
    agent_id = Column(UUID(as_uuid=True), ForeignKey("ai_agents.id"), nullable=False, index=True)
    agent_type = Column(SQLEnum(AgentType), nullable=False, index=True)

    # Parent task (for orchestration)
    parent_task_id = Column(UUID(as_uuid=True), nullable=True, index=True)
    orchestration_id = Column(UUID(as_uuid=True), nullable=True, index=True)

    # Task details
    task_type = Column(String(100), nullable=False)  # generate_email, score_lead, create_campaign, etc.
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)

    # Input/Output
    input_data = Column(JSONB, default={})
    output_data = Column(JSONB, default={})

    # Status
    status = Column(String(50), default="pending")  # pending, running, completed, failed
    progress = Column(Integer, default=0)  # 0-100%

    # Priority
    priority = Column(Integer, default=50)  # 0-100, higher is more urgent

    # Execution
    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    failed_at = Column(DateTime, nullable=True)
    error_message = Column(Text, nullable=True)

    # Retries
    retry_count = Column(Integer, default=0)
    max_retries = Column(Integer, default=3)

    # Context
    context = Column(JSONB, default={})  # Additional context for the agent

    # Related entities
    related_entity_type = Column(String(50), nullable=True)
    related_entity_id = Column(UUID(as_uuid=True), nullable=True)

    # AI conversation
    conversation_history = Column(JSONB, default=[])  # Full conversation with LLM

    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f"<AgentTask {self.task_type}>"


class AgentConversation(Base):
    """
    Conversation between agents or with users.
    """
    __tablename__ = "agent_conversations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    workspace_id = Column(UUID(as_uuid=True), ForeignKey("workspaces.id"), nullable=False, index=True)

    # Participants
    agent_id = Column(UUID(as_uuid=True), ForeignKey("ai_agents.id"), nullable=True, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True, index=True)
    contact_id = Column(UUID(as_uuid=True), ForeignKey("contacts.id"), nullable=True, index=True)

    # Conversation
    title = Column(String(255), nullable=True)
    channel = Column(String(50), nullable=True)  # chat, email, voice, etc.

    # Messages
    messages = Column(JSONB, default=[])  # Array of {role, content, timestamp}

    # Status
    is_active = Column(Boolean, default=True)

    # Context
    context = Column(JSONB, default={})
    intent = Column(String(100), nullable=True)  # Detected user intent
    sentiment = Column(String(50), nullable=True)  # positive, neutral, negative

    # Outcomes
    lead_created = Column(Boolean, default=False)
    ticket_created = Column(Boolean, default=False)
    deal_created = Column(Boolean, default=False)

    # Related entities
    related_lead_id = Column(UUID(as_uuid=True), nullable=True)
    related_ticket_id = Column(UUID(as_uuid=True), nullable=True)
    related_deal_id = Column(UUID(as_uuid=True), nullable=True)

    # Timestamps
    started_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    last_message_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    ended_at = Column(DateTime, nullable=True)

    def __repr__(self):
        return f"<AgentConversation {self.id}>"


class AgentKnowledge(Base):
    """
    Knowledge base for AI agents (RAG).
    """
    __tablename__ = "agent_knowledge"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    workspace_id = Column(UUID(as_uuid=True), ForeignKey("workspaces.id"), nullable=False, index=True)

    # Knowledge type
    knowledge_type = Column(String(50), nullable=False, index=True)  # faq, doc, procedure, best_practice

    # Content
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    summary = Column(Text, nullable=True)

    # Embedding for semantic search
    embedding = Column(JSONB, nullable=True)  # Vector embedding as array

    # Categories and tags
    category = Column(String(100), nullable=True, index=True)
    tags = Column(ARRAY(String), default=[])

    # Scope (which agents can access)
    agent_types = Column(ARRAY(String), default=[])  # Empty means all agents

    # Metadata
    source = Column(String(255), nullable=True)  # Where this knowledge came from
    confidence = Column(Float, default=1.0)  # How confident are we in this knowledge

    # Usage tracking
    times_used = Column(Integer, default=0)
    last_used_at = Column(DateTime, nullable=True)

    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f"<AgentKnowledge {self.title}>"
