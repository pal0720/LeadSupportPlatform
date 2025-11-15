"""
AI Agents API endpoints - Multi-agent orchestration system.
"""
from typing import List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, or_
from sqlalchemy.orm import selectinload
from pydantic import BaseModel, Field
from datetime import datetime

from core.database import get_db
from models.ai_agent import AIAgent, AgentTask, AgentConversation, AgentKnowledge, AgentType, AgentStatus
from models.workspace import WorkspaceMember
from models.user import User


# Pydantic schemas
class AIAgentCreate(BaseModel):
    agent_type: str
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    system_prompt: Optional[str] = None
    model: str = "gpt-4-turbo-preview"
    temperature: float = Field(0.7, ge=0.0, le=2.0)
    config: Optional[dict] = None


class AIAgentUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    system_prompt: Optional[str] = None
    model: Optional[str] = None
    temperature: Optional[float] = Field(None, ge=0.0, le=2.0)
    config: Optional[dict] = None
    status: Optional[str] = None


class AgentTaskCreate(BaseModel):
    agent_type: Optional[str] = None  # If not specified, orchestrator will route
    task_type: str
    input_data: dict
    priority: str = "medium"
    parent_task_id: Optional[UUID] = None


class AgentTaskUpdate(BaseModel):
    status: Optional[str] = None
    output_data: Optional[dict] = None
    error_message: Optional[str] = None


class AgentConversationCreate(BaseModel):
    agent_id: UUID
    title: Optional[str] = None
    context: Optional[dict] = None


class AgentConversationMessage(BaseModel):
    role: str  # user, assistant, system
    content: str
    metadata: Optional[dict] = None


class AgentKnowledgeCreate(BaseModel):
    knowledge_type: str  # faq, doc, procedure, policy
    title: str = Field(..., min_length=1, max_length=500)
    content: str = Field(..., min_length=1)
    agent_types: List[str] = []
    metadata: Optional[dict] = None


router = APIRouter()


async def get_current_user(db: AsyncSession = Depends(get_db)) -> User:
    """Get current authenticated user."""
    # TODO: Implement actual JWT authentication
    result = await db.execute(select(User).limit(1))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return user


async def get_workspace_member(
    workspace_id: UUID,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
) -> WorkspaceMember:
    """Get workspace member relationship."""
    result = await db.execute(
        select(WorkspaceMember).where(
            and_(
                WorkspaceMember.workspace_id == workspace_id,
                WorkspaceMember.user_id == user.id
            )
        )
    )
    member = result.scalar_one_or_none()
    if not member:
        raise HTTPException(status_code=403, detail="Not a member of this workspace")
    return member


# AI Agents CRUD endpoints
@router.post("/{workspace_id}/agents", status_code=status.HTTP_201_CREATED)
async def create_ai_agent(
    workspace_id: UUID,
    data: AIAgentCreate,
    member: WorkspaceMember = Depends(get_workspace_member),
    db: AsyncSession = Depends(get_db)
):
    """Create a new AI agent instance for the workspace."""
    import uuid

    # Validate agent type
    valid_types = [t.value for t in AgentType]
    if data.agent_type not in valid_types:
        raise HTTPException(status_code=400, detail=f"Invalid agent type. Must be one of: {valid_types}")

    agent = AIAgent(
        id=uuid.uuid4(),
        workspace_id=workspace_id,
        agent_type=data.agent_type,
        name=data.name,
        description=data.description,
        system_prompt=data.system_prompt,
        model=data.model,
        temperature=data.temperature,
        config=data.config or {},
    )
    db.add(agent)
    await db.commit()
    await db.refresh(agent)

    return agent


@router.get("/{workspace_id}/agents")
async def list_ai_agents(
    workspace_id: UUID,
    agent_type: Optional[str] = None,
    status: Optional[str] = None,
    member: WorkspaceMember = Depends(get_workspace_member),
    db: AsyncSession = Depends(get_db)
):
    """List all AI agents in the workspace."""
    query = select(AIAgent).where(
        and_(
            AIAgent.workspace_id == workspace_id,
            AIAgent.deleted_at.is_(None)
        )
    )

    if agent_type:
        query = query.where(AIAgent.agent_type == agent_type)
    if status:
        query = query.where(AIAgent.status == status)

    result = await db.execute(query)
    agents = result.scalars().all()
    return agents


@router.get("/{workspace_id}/agents/{agent_id}")
async def get_ai_agent(
    workspace_id: UUID,
    agent_id: UUID,
    member: WorkspaceMember = Depends(get_workspace_member),
    db: AsyncSession = Depends(get_db)
):
    """Get specific AI agent details."""
    result = await db.execute(
        select(AIAgent).where(
            and_(
                AIAgent.id == agent_id,
                AIAgent.workspace_id == workspace_id,
                AIAgent.deleted_at.is_(None)
            )
        )
    )
    agent = result.scalar_one_or_none()
    if not agent:
        raise HTTPException(status_code=404, detail="AI agent not found")
    return agent


@router.patch("/{workspace_id}/agents/{agent_id}")
async def update_ai_agent(
    workspace_id: UUID,
    agent_id: UUID,
    data: AIAgentUpdate,
    member: WorkspaceMember = Depends(get_workspace_member),
    db: AsyncSession = Depends(get_db)
):
    """Update AI agent configuration."""
    result = await db.execute(
        select(AIAgent).where(
            and_(
                AIAgent.id == agent_id,
                AIAgent.workspace_id == workspace_id
            )
        )
    )
    agent = result.scalar_one_or_none()
    if not agent:
        raise HTTPException(status_code=404, detail="AI agent not found")

    # Update fields
    update_data = data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(agent, field, value)

    await db.commit()
    await db.refresh(agent)
    return agent


@router.delete("/{workspace_id}/agents/{agent_id}")
async def delete_ai_agent(
    workspace_id: UUID,
    agent_id: UUID,
    member: WorkspaceMember = Depends(get_workspace_member),
    db: AsyncSession = Depends(get_db)
):
    """Soft delete an AI agent."""
    result = await db.execute(
        select(AIAgent).where(
            and_(
                AIAgent.id == agent_id,
                AIAgent.workspace_id == workspace_id
            )
        )
    )
    agent = result.scalar_one_or_none()
    if not agent:
        raise HTTPException(status_code=404, detail="AI agent not found")

    agent.deleted_at = datetime.utcnow()
    await db.commit()
    return {"message": "AI agent deleted successfully"}


# Agent Tasks endpoints
@router.post("/{workspace_id}/tasks", status_code=status.HTTP_201_CREATED)
async def create_agent_task(
    workspace_id: UUID,
    data: AgentTaskCreate,
    member: WorkspaceMember = Depends(get_workspace_member),
    db: AsyncSession = Depends(get_db)
):
    """
    Create a new agent task. If agent_type is not specified,
    the orchestrator agent will route it to the appropriate specialized agent.
    """
    import uuid

    # Find the appropriate agent
    if data.agent_type:
        # Direct task to specific agent type
        result = await db.execute(
            select(AIAgent).where(
                and_(
                    AIAgent.workspace_id == workspace_id,
                    AIAgent.agent_type == data.agent_type,
                    AIAgent.status != AgentStatus.DISABLED,
                    AIAgent.deleted_at.is_(None)
                )
            ).limit(1)
        )
    else:
        # Send to orchestrator for routing
        result = await db.execute(
            select(AIAgent).where(
                and_(
                    AIAgent.workspace_id == workspace_id,
                    AIAgent.agent_type == AgentType.ORCHESTRATOR,
                    AIAgent.status != AgentStatus.DISABLED,
                    AIAgent.deleted_at.is_(None)
                )
            ).limit(1)
        )

    agent = result.scalar_one_or_none()
    if not agent:
        agent_type_msg = f" of type {data.agent_type}" if data.agent_type else ""
        raise HTTPException(status_code=404, detail=f"No active AI agent found{agent_type_msg}")

    # Create task
    task = AgentTask(
        id=uuid.uuid4(),
        agent_id=agent.id,
        parent_task_id=data.parent_task_id,
        task_type=data.task_type,
        priority=data.priority,
        input_data=data.input_data,
        status="pending",
    )
    db.add(task)

    # Update agent stats
    agent.total_tasks += 1
    agent.last_active_at = datetime.utcnow()

    await db.commit()
    await db.refresh(task)

    # TODO: Trigger async task processing via Celery

    return task


@router.get("/{workspace_id}/tasks")
async def list_agent_tasks(
    workspace_id: UUID,
    agent_id: Optional[UUID] = None,
    status: Optional[str] = None,
    limit: int = 100,
    offset: int = 0,
    member: WorkspaceMember = Depends(get_workspace_member),
    db: AsyncSession = Depends(get_db)
):
    """List agent tasks with optional filtering."""
    # Build query with workspace filter via agent
    query = (
        select(AgentTask)
        .join(AIAgent)
        .where(AIAgent.workspace_id == workspace_id)
    )

    if agent_id:
        query = query.where(AgentTask.agent_id == agent_id)
    if status:
        query = query.where(AgentTask.status == status)

    query = query.order_by(AgentTask.created_at.desc()).offset(offset).limit(limit)

    result = await db.execute(query)
    tasks = result.scalars().all()
    return tasks


@router.get("/{workspace_id}/tasks/{task_id}")
async def get_agent_task(
    workspace_id: UUID,
    task_id: UUID,
    member: WorkspaceMember = Depends(get_workspace_member),
    db: AsyncSession = Depends(get_db)
):
    """Get specific agent task details."""
    result = await db.execute(
        select(AgentTask)
        .join(AIAgent)
        .where(
            and_(
                AgentTask.id == task_id,
                AIAgent.workspace_id == workspace_id
            )
        )
        .options(selectinload(AgentTask.agent))
    )
    task = result.scalar_one_or_none()
    if not task:
        raise HTTPException(status_code=404, detail="Agent task not found")
    return task


@router.patch("/{workspace_id}/tasks/{task_id}")
async def update_agent_task(
    workspace_id: UUID,
    task_id: UUID,
    data: AgentTaskUpdate,
    member: WorkspaceMember = Depends(get_workspace_member),
    db: AsyncSession = Depends(get_db)
):
    """Update agent task status and output."""
    result = await db.execute(
        select(AgentTask)
        .join(AIAgent)
        .where(
            and_(
                AgentTask.id == task_id,
                AIAgent.workspace_id == workspace_id
            )
        )
    )
    task = result.scalar_one_or_none()
    if not task:
        raise HTTPException(status_code=404, detail="Agent task not found")

    # Update fields
    if data.status:
        task.status = data.status
        if data.status == "completed":
            task.completed_at = datetime.utcnow()
            # Update agent success stats
            result = await db.execute(select(AIAgent).where(AIAgent.id == task.agent_id))
            agent = result.scalar_one()
            agent.successful_tasks += 1
        elif data.status == "failed":
            # Update agent failure stats
            result = await db.execute(select(AIAgent).where(AIAgent.id == task.agent_id))
            agent = result.scalar_one()
            agent.failed_tasks += 1

    if data.output_data:
        task.output_data = data.output_data
    if data.error_message:
        task.error_message = data.error_message

    await db.commit()
    await db.refresh(task)
    return task


# Agent Conversations endpoints
@router.post("/{workspace_id}/conversations", status_code=status.HTTP_201_CREATED)
async def create_agent_conversation(
    workspace_id: UUID,
    data: AgentConversationCreate,
    user: User = Depends(get_current_user),
    member: WorkspaceMember = Depends(get_workspace_member),
    db: AsyncSession = Depends(get_db)
):
    """Start a new conversation with an AI agent."""
    import uuid

    # Verify agent belongs to workspace
    result = await db.execute(
        select(AIAgent).where(
            and_(
                AIAgent.id == data.agent_id,
                AIAgent.workspace_id == workspace_id,
                AIAgent.deleted_at.is_(None)
            )
        )
    )
    agent = result.scalar_one_or_none()
    if not agent:
        raise HTTPException(status_code=404, detail="AI agent not found")

    conversation = AgentConversation(
        id=uuid.uuid4(),
        agent_id=data.agent_id,
        user_id=user.id,
        title=data.title,
        context=data.context or {},
        messages=[],
    )
    db.add(conversation)
    await db.commit()
    await db.refresh(conversation)

    return conversation


@router.get("/{workspace_id}/conversations")
async def list_agent_conversations(
    workspace_id: UUID,
    agent_id: Optional[UUID] = None,
    user: User = Depends(get_current_user),
    member: WorkspaceMember = Depends(get_workspace_member),
    db: AsyncSession = Depends(get_db)
):
    """List user's conversations with AI agents."""
    query = (
        select(AgentConversation)
        .join(AIAgent)
        .where(
            and_(
                AIAgent.workspace_id == workspace_id,
                AgentConversation.user_id == user.id
            )
        )
    )

    if agent_id:
        query = query.where(AgentConversation.agent_id == agent_id)

    query = query.order_by(AgentConversation.updated_at.desc())

    result = await db.execute(query)
    conversations = result.scalars().all()
    return conversations


@router.post("/{workspace_id}/conversations/{conversation_id}/messages")
async def send_conversation_message(
    workspace_id: UUID,
    conversation_id: UUID,
    message: AgentConversationMessage,
    user: User = Depends(get_current_user),
    member: WorkspaceMember = Depends(get_workspace_member),
    db: AsyncSession = Depends(get_db)
):
    """Send a message in an agent conversation."""
    # Get conversation
    result = await db.execute(
        select(AgentConversation)
        .join(AIAgent)
        .where(
            and_(
                AgentConversation.id == conversation_id,
                AIAgent.workspace_id == workspace_id,
                AgentConversation.user_id == user.id
            )
        )
        .options(selectinload(AgentConversation.agent))
    )
    conversation = result.scalar_one_or_none()
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")

    # Add message to conversation
    messages = conversation.messages or []
    messages.append({
        "role": message.role,
        "content": message.content,
        "metadata": message.metadata or {},
        "timestamp": datetime.utcnow().isoformat(),
    })
    conversation.messages = messages

    await db.commit()
    await db.refresh(conversation)

    # TODO: Trigger AI agent response processing

    return conversation


# Agent Knowledge endpoints
@router.post("/{workspace_id}/knowledge", status_code=status.HTTP_201_CREATED)
async def create_agent_knowledge(
    workspace_id: UUID,
    data: AgentKnowledgeCreate,
    user: User = Depends(get_current_user),
    member: WorkspaceMember = Depends(get_workspace_member),
    db: AsyncSession = Depends(get_db)
):
    """Add knowledge to the agent knowledge base (RAG)."""
    import uuid

    knowledge = AgentKnowledge(
        id=uuid.uuid4(),
        workspace_id=workspace_id,
        knowledge_type=data.knowledge_type,
        title=data.title,
        content=data.content,
        agent_types=data.agent_types,
        metadata=data.metadata or {},
        created_by=user.id,
    )
    db.add(knowledge)
    await db.commit()
    await db.refresh(knowledge)

    # TODO: Generate and store embeddings for RAG

    return knowledge


@router.get("/{workspace_id}/knowledge")
async def list_agent_knowledge(
    workspace_id: UUID,
    knowledge_type: Optional[str] = None,
    agent_type: Optional[str] = None,
    limit: int = 100,
    offset: int = 0,
    member: WorkspaceMember = Depends(get_workspace_member),
    db: AsyncSession = Depends(get_db)
):
    """List knowledge base items."""
    query = select(AgentKnowledge).where(
        and_(
            AgentKnowledge.workspace_id == workspace_id,
            AgentKnowledge.deleted_at.is_(None)
        )
    )

    if knowledge_type:
        query = query.where(AgentKnowledge.knowledge_type == knowledge_type)
    if agent_type:
        query = query.where(AgentKnowledge.agent_types.contains([agent_type]))

    query = query.order_by(AgentKnowledge.created_at.desc()).offset(offset).limit(limit)

    result = await db.execute(query)
    knowledge_items = result.scalars().all()
    return knowledge_items


@router.get("/{workspace_id}/knowledge/search")
async def search_agent_knowledge(
    workspace_id: UUID,
    q: str,
    agent_type: Optional[str] = None,
    limit: int = 10,
    member: WorkspaceMember = Depends(get_workspace_member),
    db: AsyncSession = Depends(get_db)
):
    """Search knowledge base (semantic search with embeddings)."""
    # TODO: Implement vector similarity search using pgvector
    # For now, do simple text search
    query = select(AgentKnowledge).where(
        and_(
            AgentKnowledge.workspace_id == workspace_id,
            AgentKnowledge.deleted_at.is_(None),
            or_(
                AgentKnowledge.title.ilike(f"%{q}%"),
                AgentKnowledge.content.ilike(f"%{q}%")
            )
        )
    )

    if agent_type:
        query = query.where(AgentKnowledge.agent_types.contains([agent_type]))

    query = query.limit(limit)

    result = await db.execute(query)
    knowledge_items = result.scalars().all()
    return knowledge_items
