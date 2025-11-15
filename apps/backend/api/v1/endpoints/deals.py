"""
Deals and CRM API endpoints - Pipeline management, activities, notes, timeline.
"""
from typing import List, Optional
from uuid import UUID
from datetime import date, datetime
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, func
from sqlalchemy.orm import selectinload
from pydantic import BaseModel, Field

from core.database import get_db
from models.deal import Deal, Pipeline, Activity, Note, Timeline, DealStage, ActivityType, ActivityStatus
from models.workspace import WorkspaceMember
from models.user import User
from models.company import Company
from models.contact import Contact


# Pydantic schemas
class PipelineCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    stages: List[dict]  # [{name: str, probability: int, color: str}]
    is_default: bool = False


class DealCreate(BaseModel):
    company_id: UUID
    primary_contact_id: Optional[UUID] = None
    pipeline_id: Optional[UUID] = None
    name: str = Field(..., min_length=1, max_length=500)
    stage: str = "prospecting"
    amount: Optional[float] = None
    currency: str = "USD"
    probability: int = Field(0, ge=0, le=100)
    expected_close_date: Optional[date] = None
    description: Optional[str] = None
    custom_fields: Optional[dict] = None
    tags: List[str] = []


class DealUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=500)
    stage: Optional[str] = None
    amount: Optional[float] = None
    probability: Optional[int] = Field(None, ge=0, le=100)
    expected_close_date: Optional[date] = None
    actual_close_date: Optional[date] = None
    description: Optional[str] = None
    loss_reason: Optional[str] = None
    custom_fields: Optional[dict] = None
    tags: Optional[List[str]] = None


class ActivityCreate(BaseModel):
    activity_type: str  # task, call, meeting, email, note
    title: str = Field(..., min_length=1, max_length=500)
    description: Optional[str] = None
    due_date: Optional[datetime] = None
    duration_minutes: Optional[int] = None
    company_id: Optional[UUID] = None
    contact_id: Optional[UUID] = None
    deal_id: Optional[UUID] = None
    assigned_to: Optional[UUID] = None


class ActivityUpdate(BaseModel):
    status: Optional[str] = None
    title: Optional[str] = Field(None, min_length=1, max_length=500)
    description: Optional[str] = None
    due_date: Optional[datetime] = None
    duration_minutes: Optional[int] = None
    completed_at: Optional[datetime] = None


class NoteCreate(BaseModel):
    content: str = Field(..., min_length=1)
    company_id: Optional[UUID] = None
    contact_id: Optional[UUID] = None
    deal_id: Optional[UUID] = None
    is_pinned: bool = False


router = APIRouter()


async def get_current_user(db: AsyncSession = Depends(get_db)) -> User:
    """Get current authenticated user."""
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


# Pipeline endpoints
@router.post("/{workspace_id}/pipelines", status_code=status.HTTP_201_CREATED)
async def create_pipeline(
    workspace_id: UUID,
    data: PipelineCreate,
    user: User = Depends(get_current_user),
    member: WorkspaceMember = Depends(get_workspace_member),
    db: AsyncSession = Depends(get_db)
):
    """Create a new sales pipeline."""
    import uuid

    # If this is set as default, unset other defaults
    if data.is_default:
        await db.execute(
            select(Pipeline).where(
                and_(
                    Pipeline.workspace_id == workspace_id,
                    Pipeline.is_default == True
                )
            )
        )
        result = await db.execute(
            select(Pipeline).where(
                and_(
                    Pipeline.workspace_id == workspace_id,
                    Pipeline.is_default == True
                )
            )
        )
        for existing in result.scalars():
            existing.is_default = False

    pipeline = Pipeline(
        id=uuid.uuid4(),
        workspace_id=workspace_id,
        name=data.name,
        stages=data.stages,
        is_default=data.is_default,
    )
    db.add(pipeline)
    await db.commit()
    await db.refresh(pipeline)

    return pipeline


@router.get("/{workspace_id}/pipelines")
async def list_pipelines(
    workspace_id: UUID,
    member: WorkspaceMember = Depends(get_workspace_member),
    db: AsyncSession = Depends(get_db)
):
    """List all sales pipelines."""
    result = await db.execute(
        select(Pipeline).where(
            and_(
                Pipeline.workspace_id == workspace_id,
                Pipeline.deleted_at.is_(None)
            )
        ).order_by(Pipeline.display_order, Pipeline.created_at)
    )
    pipelines = result.scalars().all()
    return pipelines


# Deal endpoints
@router.post("/{workspace_id}/deals", status_code=status.HTTP_201_CREATED)
async def create_deal(
    workspace_id: UUID,
    data: DealCreate,
    user: User = Depends(get_current_user),
    member: WorkspaceMember = Depends(get_workspace_member),
    db: AsyncSession = Depends(get_db)
):
    """Create a new deal/opportunity."""
    import uuid

    # Verify company exists and belongs to workspace
    result = await db.execute(
        select(Company).where(
            and_(
                Company.id == data.company_id,
                Company.workspace_id == workspace_id,
                Company.deleted_at.is_(None)
            )
        )
    )
    if not result.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Company not found")

    # Verify contact if provided
    if data.primary_contact_id:
        result = await db.execute(
            select(Contact).where(
                and_(
                    Contact.id == data.primary_contact_id,
                    Contact.workspace_id == workspace_id,
                    Contact.deleted_at.is_(None)
                )
            )
        )
        if not result.scalar_one_or_none():
            raise HTTPException(status_code=404, detail="Contact not found")

    # Get default pipeline if not specified
    pipeline_id = data.pipeline_id
    if not pipeline_id:
        result = await db.execute(
            select(Pipeline).where(
                and_(
                    Pipeline.workspace_id == workspace_id,
                    Pipeline.is_default == True,
                    Pipeline.deleted_at.is_(None)
                )
            ).limit(1)
        )
        default_pipeline = result.scalar_one_or_none()
        if default_pipeline:
            pipeline_id = default_pipeline.id

    deal = Deal(
        id=uuid.uuid4(),
        workspace_id=workspace_id,
        pipeline_id=pipeline_id,
        company_id=data.company_id,
        primary_contact_id=data.primary_contact_id,
        name=data.name,
        stage=data.stage,
        amount=data.amount,
        currency=data.currency,
        probability=data.probability,
        expected_close_date=data.expected_close_date,
        description=data.description,
        custom_fields=data.custom_fields or {},
        tags=data.tags,
        owner_id=user.id,
        created_by=user.id,
    )
    db.add(deal)
    await db.commit()
    await db.refresh(deal)

    # Create timeline event
    timeline_event = Timeline(
        id=uuid.uuid4(),
        workspace_id=workspace_id,
        event_type="deal_created",
        title=f"Deal created: {deal.name}",
        company_id=data.company_id,
        contact_id=data.primary_contact_id,
        deal_id=deal.id,
        actor_type="user",
        actor_id=user.id,
        data={"deal_id": str(deal.id), "amount": data.amount, "stage": data.stage},
    )
    db.add(timeline_event)
    await db.commit()

    return deal


@router.get("/{workspace_id}/deals")
async def list_deals(
    workspace_id: UUID,
    stage: Optional[str] = None,
    pipeline_id: Optional[UUID] = None,
    company_id: Optional[UUID] = None,
    owner_id: Optional[UUID] = None,
    limit: int = 100,
    offset: int = 0,
    member: WorkspaceMember = Depends(get_workspace_member),
    db: AsyncSession = Depends(get_db)
):
    """List all deals with optional filtering."""
    query = select(Deal).where(
        and_(
            Deal.workspace_id == workspace_id,
            Deal.deleted_at.is_(None)
        )
    ).options(
        selectinload(Deal.company),
        selectinload(Deal.primary_contact),
        selectinload(Deal.owner)
    )

    if stage:
        query = query.where(Deal.stage == stage)
    if pipeline_id:
        query = query.where(Deal.pipeline_id == pipeline_id)
    if company_id:
        query = query.where(Deal.company_id == company_id)
    if owner_id:
        query = query.where(Deal.owner_id == owner_id)

    query = query.order_by(Deal.expected_close_date.asc().nullslast(), Deal.created_at.desc())
    query = query.offset(offset).limit(limit)

    result = await db.execute(query)
    deals = result.scalars().all()
    return deals


@router.get("/{workspace_id}/deals/{deal_id}")
async def get_deal(
    workspace_id: UUID,
    deal_id: UUID,
    member: WorkspaceMember = Depends(get_workspace_member),
    db: AsyncSession = Depends(get_db)
):
    """Get specific deal details."""
    result = await db.execute(
        select(Deal).where(
            and_(
                Deal.id == deal_id,
                Deal.workspace_id == workspace_id,
                Deal.deleted_at.is_(None)
            )
        ).options(
            selectinload(Deal.company),
            selectinload(Deal.primary_contact),
            selectinload(Deal.owner)
        )
    )
    deal = result.scalar_one_or_none()
    if not deal:
        raise HTTPException(status_code=404, detail="Deal not found")
    return deal


@router.patch("/{workspace_id}/deals/{deal_id}")
async def update_deal(
    workspace_id: UUID,
    deal_id: UUID,
    data: DealUpdate,
    user: User = Depends(get_current_user),
    member: WorkspaceMember = Depends(get_workspace_member),
    db: AsyncSession = Depends(get_db)
):
    """Update deal details."""
    result = await db.execute(
        select(Deal).where(
            and_(
                Deal.id == deal_id,
                Deal.workspace_id == workspace_id
            )
        )
    )
    deal = result.scalar_one_or_none()
    if not deal:
        raise HTTPException(status_code=404, detail="Deal not found")

    # Track changes for timeline
    changes = {}
    update_data = data.dict(exclude_unset=True)
    for field, value in update_data.items():
        old_value = getattr(deal, field)
        if old_value != value:
            changes[field] = {"old": old_value, "new": value}
            setattr(deal, field, value)

    await db.commit()
    await db.refresh(deal)

    # Create timeline event if there were changes
    if changes:
        timeline_event = Timeline(
            id=uuid.uuid4(),
            workspace_id=workspace_id,
            event_type="deal_updated",
            title=f"Deal updated: {deal.name}",
            company_id=deal.company_id,
            contact_id=deal.primary_contact_id,
            deal_id=deal.id,
            actor_type="user",
            actor_id=user.id,
            data={"changes": changes},
        )
        db.add(timeline_event)
        await db.commit()

    return deal


@router.delete("/{workspace_id}/deals/{deal_id}")
async def delete_deal(
    workspace_id: UUID,
    deal_id: UUID,
    member: WorkspaceMember = Depends(get_workspace_member),
    db: AsyncSession = Depends(get_db)
):
    """Soft delete a deal."""
    result = await db.execute(
        select(Deal).where(
            and_(
                Deal.id == deal_id,
                Deal.workspace_id == workspace_id
            )
        )
    )
    deal = result.scalar_one_or_none()
    if not deal:
        raise HTTPException(status_code=404, detail="Deal not found")

    deal.deleted_at = datetime.utcnow()
    await db.commit()
    return {"message": "Deal deleted successfully"}


# Activity endpoints
@router.post("/{workspace_id}/activities", status_code=status.HTTP_201_CREATED)
async def create_activity(
    workspace_id: UUID,
    data: ActivityCreate,
    user: User = Depends(get_current_user),
    member: WorkspaceMember = Depends(get_workspace_member),
    db: AsyncSession = Depends(get_db)
):
    """Create a new activity (task, call, meeting, etc.)."""
    import uuid

    activity = Activity(
        id=uuid.uuid4(),
        workspace_id=workspace_id,
        activity_type=data.activity_type,
        title=data.title,
        description=data.description,
        due_date=data.due_date,
        duration_minutes=data.duration_minutes,
        company_id=data.company_id,
        contact_id=data.contact_id,
        deal_id=data.deal_id,
        assigned_to=data.assigned_to or user.id,
        created_by=user.id,
    )
    db.add(activity)
    await db.commit()
    await db.refresh(activity)

    # Create timeline event
    if data.company_id or data.contact_id or data.deal_id:
        timeline_event = Timeline(
            id=uuid.uuid4(),
            workspace_id=workspace_id,
            event_type=f"activity_{data.activity_type}",
            title=f"{data.activity_type.capitalize()}: {data.title}",
            company_id=data.company_id,
            contact_id=data.contact_id,
            deal_id=data.deal_id,
            actor_type="user",
            actor_id=user.id,
            data={"activity_id": str(activity.id), "due_date": data.due_date.isoformat() if data.due_date else None},
        )
        db.add(timeline_event)
        await db.commit()

    return activity


@router.get("/{workspace_id}/activities")
async def list_activities(
    workspace_id: UUID,
    activity_type: Optional[str] = None,
    status: Optional[str] = None,
    assigned_to: Optional[UUID] = None,
    company_id: Optional[UUID] = None,
    contact_id: Optional[UUID] = None,
    deal_id: Optional[UUID] = None,
    limit: int = 100,
    offset: int = 0,
    member: WorkspaceMember = Depends(get_workspace_member),
    db: AsyncSession = Depends(get_db)
):
    """List activities with filtering."""
    query = select(Activity).where(
        and_(
            Activity.workspace_id == workspace_id,
            Activity.deleted_at.is_(None)
        )
    ).options(
        selectinload(Activity.assigned_user),
        selectinload(Activity.company)
    )

    if activity_type:
        query = query.where(Activity.activity_type == activity_type)
    if status:
        query = query.where(Activity.status == status)
    if assigned_to:
        query = query.where(Activity.assigned_to == assigned_to)
    if company_id:
        query = query.where(Activity.company_id == company_id)
    if contact_id:
        query = query.where(Activity.contact_id == contact_id)
    if deal_id:
        query = query.where(Activity.deal_id == deal_id)

    query = query.order_by(Activity.due_date.asc().nullslast(), Activity.created_at.desc())
    query = query.offset(offset).limit(limit)

    result = await db.execute(query)
    activities = result.scalars().all()
    return activities


@router.patch("/{workspace_id}/activities/{activity_id}")
async def update_activity(
    workspace_id: UUID,
    activity_id: UUID,
    data: ActivityUpdate,
    user: User = Depends(get_current_user),
    member: WorkspaceMember = Depends(get_workspace_member),
    db: AsyncSession = Depends(get_db)
):
    """Update activity."""
    result = await db.execute(
        select(Activity).where(
            and_(
                Activity.id == activity_id,
                Activity.workspace_id == workspace_id
            )
        )
    )
    activity = result.scalar_one_or_none()
    if not activity:
        raise HTTPException(status_code=404, detail="Activity not found")

    update_data = data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(activity, field, value)

    # Auto-set completed_at when status changes to completed
    if data.status == "completed" and not activity.completed_at:
        activity.completed_at = datetime.utcnow()

    await db.commit()
    await db.refresh(activity)
    return activity


# Note endpoints
@router.post("/{workspace_id}/notes", status_code=status.HTTP_201_CREATED)
async def create_note(
    workspace_id: UUID,
    data: NoteCreate,
    user: User = Depends(get_current_user),
    member: WorkspaceMember = Depends(get_workspace_member),
    db: AsyncSession = Depends(get_db)
):
    """Create a new note."""
    import uuid

    note = Note(
        id=uuid.uuid4(),
        workspace_id=workspace_id,
        content=data.content,
        company_id=data.company_id,
        contact_id=data.contact_id,
        deal_id=data.deal_id,
        is_pinned=data.is_pinned,
        created_by=user.id,
    )
    db.add(note)
    await db.commit()
    await db.refresh(note)

    # Create timeline event
    if data.company_id or data.contact_id or data.deal_id:
        timeline_event = Timeline(
            id=uuid.uuid4(),
            workspace_id=workspace_id,
            event_type="note_added",
            title="Note added",
            description=data.content[:200],  # Truncate for timeline
            company_id=data.company_id,
            contact_id=data.contact_id,
            deal_id=data.deal_id,
            actor_type="user",
            actor_id=user.id,
            data={"note_id": str(note.id)},
        )
        db.add(timeline_event)
        await db.commit()

    return note


@router.get("/{workspace_id}/notes")
async def list_notes(
    workspace_id: UUID,
    company_id: Optional[UUID] = None,
    contact_id: Optional[UUID] = None,
    deal_id: Optional[UUID] = None,
    is_pinned: Optional[bool] = None,
    limit: int = 100,
    offset: int = 0,
    member: WorkspaceMember = Depends(get_workspace_member),
    db: AsyncSession = Depends(get_db)
):
    """List notes with filtering."""
    query = select(Note).where(
        and_(
            Note.workspace_id == workspace_id,
            Note.deleted_at.is_(None)
        )
    ).options(selectinload(Note.author))

    if company_id:
        query = query.where(Note.company_id == company_id)
    if contact_id:
        query = query.where(Note.contact_id == contact_id)
    if deal_id:
        query = query.where(Note.deal_id == deal_id)
    if is_pinned is not None:
        query = query.where(Note.is_pinned == is_pinned)

    query = query.order_by(Note.is_pinned.desc(), Note.created_at.desc())
    query = query.offset(offset).limit(limit)

    result = await db.execute(query)
    notes = result.scalars().all()
    return notes


# Timeline endpoints
@router.get("/{workspace_id}/timeline")
async def get_timeline(
    workspace_id: UUID,
    company_id: Optional[UUID] = Query(None),
    contact_id: Optional[UUID] = Query(None),
    deal_id: Optional[UUID] = Query(None),
    event_type: Optional[str] = Query(None),
    limit: int = Query(100, le=500),
    offset: int = 0,
    member: WorkspaceMember = Depends(get_workspace_member),
    db: AsyncSession = Depends(get_db)
):
    """Get unified timeline of all customer interactions."""
    query = select(Timeline).where(Timeline.workspace_id == workspace_id)

    # Filter by entity
    if company_id:
        query = query.where(Timeline.company_id == company_id)
    if contact_id:
        query = query.where(Timeline.contact_id == contact_id)
    if deal_id:
        query = query.where(Timeline.deal_id == deal_id)
    if event_type:
        query = query.where(Timeline.event_type == event_type)

    query = query.order_by(Timeline.occurred_at.desc())
    query = query.offset(offset).limit(limit)

    result = await db.execute(query)
    timeline_events = result.scalars().all()
    return timeline_events


@router.get("/{workspace_id}/deals/analytics/pipeline")
async def get_pipeline_analytics(
    workspace_id: UUID,
    pipeline_id: Optional[UUID] = None,
    member: WorkspaceMember = Depends(get_workspace_member),
    db: AsyncSession = Depends(get_db)
):
    """Get pipeline analytics (deals by stage, conversion rates, etc.)."""
    query = select(
        Deal.stage,
        func.count(Deal.id).label("count"),
        func.sum(Deal.amount).label("total_value"),
        func.avg(Deal.probability).label("avg_probability")
    ).where(
        and_(
            Deal.workspace_id == workspace_id,
            Deal.deleted_at.is_(None)
        )
    ).group_by(Deal.stage)

    if pipeline_id:
        query = query.where(Deal.pipeline_id == pipeline_id)

    result = await db.execute(query)
    analytics = [
        {
            "stage": row.stage,
            "count": row.count,
            "total_value": float(row.total_value) if row.total_value else 0,
            "avg_probability": float(row.avg_probability) if row.avg_probability else 0
        }
        for row in result
    ]

    return analytics
