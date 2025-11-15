"""
Journey builder and marketing automation API endpoints.
"""
from typing import List, Optional
from uuid import UUID
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, func
from sqlalchemy.orm import selectinload
from pydantic import BaseModel, Field

from core.database import get_db
from models.journey import Journey, JourneyEnrollment, JourneyStatus
from models.workspace import WorkspaceMember, UserRole
from models.user import User
from models.contact import Contact
from models.lead import Lead
from models.deal import Timeline


# Pydantic schemas
class JourneyCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    trigger: dict = {}
    steps: List[dict] = []
    goal: Optional[str] = None
    allow_multiple_entries: bool = False
    exit_on_goal_achieved: bool = True


class JourneyUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    status: Optional[str] = None
    trigger: Optional[dict] = None
    steps: Optional[List[dict]] = None
    goal: Optional[str] = None
    allow_multiple_entries: Optional[bool] = None
    exit_on_goal_achieved: Optional[bool] = None
    ai_optimized: Optional[bool] = None
    ai_suggestions: Optional[List[dict]] = None


class JourneyEnrollmentCreate(BaseModel):
    journey_id: UUID
    contact_id: Optional[UUID] = None
    lead_id: Optional[UUID] = None
    context: Optional[dict] = None


class JourneyEnrollmentUpdate(BaseModel):
    status: Optional[str] = None  # active, completed, exited, failed
    current_step_index: Optional[int] = None
    steps_completed: Optional[int] = None
    goal_achieved: Optional[bool] = None
    exit_reason: Optional[str] = None


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


# Journey CRUD endpoints
@router.post("/{workspace_id}/journeys", status_code=status.HTTP_201_CREATED)
async def create_journey(
    workspace_id: UUID,
    data: JourneyCreate,
    user: User = Depends(get_current_user),
    member: WorkspaceMember = Depends(get_workspace_member),
    db: AsyncSession = Depends(get_db)
):
    """Create a new marketing journey/automation workflow."""
    import uuid

    # Check permissions - marketing managers and above
    if member.role not in [UserRole.OWNER, UserRole.ADMIN, UserRole.MARKETING_MANAGER]:
        raise HTTPException(status_code=403, detail="Insufficient permissions")

    journey = Journey(
        id=uuid.uuid4(),
        workspace_id=workspace_id,
        name=data.name,
        description=data.description,
        trigger=data.trigger,
        steps=data.steps,
        goal=data.goal,
        allow_multiple_entries=data.allow_multiple_entries,
        exit_on_goal_achieved=data.exit_on_goal_achieved,
        created_by=user.id,
    )
    db.add(journey)
    await db.commit()
    await db.refresh(journey)

    # Create timeline event
    timeline_event = Timeline(
        id=uuid.uuid4(),
        workspace_id=workspace_id,
        event_type="journey_created",
        title=f"Journey created: {journey.name}",
        description=data.description,
        actor_type="user",
        actor_id=user.id,
        data={"journey_id": str(journey.id), "name": journey.name},
    )
    db.add(timeline_event)
    await db.commit()

    return journey


@router.get("/{workspace_id}/journeys")
async def list_journeys(
    workspace_id: UUID,
    status: Optional[str] = None,
    limit: int = 100,
    offset: int = 0,
    member: WorkspaceMember = Depends(get_workspace_member),
    db: AsyncSession = Depends(get_db)
):
    """List all journeys in the workspace with optional filtering."""
    query = select(Journey).where(Journey.workspace_id == workspace_id)

    if status:
        try:
            journey_status = JourneyStatus(status)
            query = query.where(Journey.status == journey_status)
        except ValueError:
            raise HTTPException(status_code=400, detail=f"Invalid status: {status}")

    query = query.order_by(Journey.created_at.desc()).offset(offset).limit(limit)

    result = await db.execute(query)
    journeys = result.scalars().all()
    return journeys


@router.get("/{workspace_id}/journeys/{journey_id}")
async def get_journey(
    workspace_id: UUID,
    journey_id: UUID,
    member: WorkspaceMember = Depends(get_workspace_member),
    db: AsyncSession = Depends(get_db)
):
    """Get specific journey details."""
    result = await db.execute(
        select(Journey).where(
            and_(
                Journey.id == journey_id,
                Journey.workspace_id == workspace_id
            )
        )
    )
    journey = result.scalar_one_or_none()
    if not journey:
        raise HTTPException(status_code=404, detail="Journey not found")
    return journey


@router.patch("/{workspace_id}/journeys/{journey_id}")
async def update_journey(
    workspace_id: UUID,
    journey_id: UUID,
    data: JourneyUpdate,
    user: User = Depends(get_current_user),
    member: WorkspaceMember = Depends(get_workspace_member),
    db: AsyncSession = Depends(get_db)
):
    """Update journey configuration."""
    # Check permissions - marketing managers and above
    if member.role not in [UserRole.OWNER, UserRole.ADMIN, UserRole.MARKETING_MANAGER]:
        raise HTTPException(status_code=403, detail="Insufficient permissions")

    result = await db.execute(
        select(Journey).where(
            and_(
                Journey.id == journey_id,
                Journey.workspace_id == workspace_id
            )
        )
    )
    journey = result.scalar_one_or_none()
    if not journey:
        raise HTTPException(status_code=404, detail="Journey not found")

    # Track changes for timeline
    changes = {}
    update_data = data.dict(exclude_unset=True)
    for field, value in update_data.items():
        old_value = getattr(journey, field)
        if old_value != value:
            changes[field] = {"old": str(old_value) if old_value else None, "new": str(value) if value else None}
            # Handle status enum conversion
            if field == "status" and value:
                try:
                    value = JourneyStatus(value)
                except ValueError:
                    raise HTTPException(status_code=400, detail=f"Invalid status: {value}")
            setattr(journey, field, value)

    await db.commit()
    await db.refresh(journey)

    # Create timeline event if there were changes
    if changes:
        import uuid
        timeline_event = Timeline(
            id=uuid.uuid4(),
            workspace_id=workspace_id,
            event_type="journey_updated",
            title=f"Journey updated: {journey.name}",
            actor_type="user",
            actor_id=user.id,
            data={"journey_id": str(journey.id), "changes": changes},
        )
        db.add(timeline_event)
        await db.commit()

    return journey


@router.delete("/{workspace_id}/journeys/{journey_id}")
async def delete_journey(
    workspace_id: UUID,
    journey_id: UUID,
    user: User = Depends(get_current_user),
    member: WorkspaceMember = Depends(get_workspace_member),
    db: AsyncSession = Depends(get_db)
):
    """Delete a journey (archives it instead of hard delete)."""
    # Check permissions - marketing managers and above
    if member.role not in [UserRole.OWNER, UserRole.ADMIN, UserRole.MARKETING_MANAGER]:
        raise HTTPException(status_code=403, detail="Insufficient permissions")

    result = await db.execute(
        select(Journey).where(
            and_(
                Journey.id == journey_id,
                Journey.workspace_id == workspace_id
            )
        )
    )
    journey = result.scalar_one_or_none()
    if not journey:
        raise HTTPException(status_code=404, detail="Journey not found")

    # Archive instead of delete
    journey.status = JourneyStatus.ARCHIVED
    await db.commit()

    return {"message": "Journey archived successfully"}


# Journey Enrollment endpoints
@router.post("/{workspace_id}/journey-enrollments", status_code=status.HTTP_201_CREATED)
async def enroll_in_journey(
    workspace_id: UUID,
    data: JourneyEnrollmentCreate,
    user: User = Depends(get_current_user),
    member: WorkspaceMember = Depends(get_workspace_member),
    db: AsyncSession = Depends(get_db)
):
    """Enroll a contact or lead in a journey."""
    import uuid

    # Verify journey exists and belongs to workspace
    result = await db.execute(
        select(Journey).where(
            and_(
                Journey.id == data.journey_id,
                Journey.workspace_id == workspace_id,
                Journey.status == JourneyStatus.ACTIVE
            )
        )
    )
    journey = result.scalar_one_or_none()
    if not journey:
        raise HTTPException(status_code=404, detail="Journey not found or not active")

    # Verify contact or lead exists
    if data.contact_id:
        result = await db.execute(
            select(Contact).where(
                and_(
                    Contact.id == data.contact_id,
                    Contact.workspace_id == workspace_id,
                    Contact.deleted_at.is_(None)
                )
            )
        )
        if not result.scalar_one_or_none():
            raise HTTPException(status_code=404, detail="Contact not found")
    elif data.lead_id:
        result = await db.execute(
            select(Lead).where(
                and_(
                    Lead.id == data.lead_id,
                    Lead.workspace_id == workspace_id,
                    Lead.deleted_at.is_(None)
                )
            )
        )
        if not result.scalar_one_or_none():
            raise HTTPException(status_code=404, detail="Lead not found")
    else:
        raise HTTPException(status_code=400, detail="Either contact_id or lead_id must be provided")

    # Check if already enrolled (if not allowing multiple entries)
    if not journey.allow_multiple_entries:
        query = select(JourneyEnrollment).where(
            and_(
                JourneyEnrollment.journey_id == data.journey_id,
                JourneyEnrollment.workspace_id == workspace_id
            )
        )
        if data.contact_id:
            query = query.where(JourneyEnrollment.contact_id == data.contact_id)
        if data.lead_id:
            query = query.where(JourneyEnrollment.lead_id == data.lead_id)

        result = await db.execute(query.where(JourneyEnrollment.status == "active"))
        if result.scalar_one_or_none():
            raise HTTPException(status_code=400, detail="Already enrolled in this journey")

    # Create enrollment
    enrollment = JourneyEnrollment(
        id=uuid.uuid4(),
        workspace_id=workspace_id,
        journey_id=data.journey_id,
        contact_id=data.contact_id,
        lead_id=data.lead_id,
        status="active",
        current_step_index=0,
        steps_completed=0,
        total_steps=len(journey.steps),
        context=data.context or {},
    )
    db.add(enrollment)

    # Update journey stats
    journey.total_entries += 1
    journey.active_entries += 1

    await db.commit()
    await db.refresh(enrollment)

    # Create timeline event
    if data.contact_id or data.lead_id:
        timeline_event = Timeline(
            id=uuid.uuid4(),
            workspace_id=workspace_id,
            event_type="journey_enrolled",
            title=f"Enrolled in journey: {journey.name}",
            contact_id=data.contact_id,
            actor_type="user",
            actor_id=user.id,
            data={
                "journey_id": str(journey.id),
                "enrollment_id": str(enrollment.id),
                "journey_name": journey.name
            },
        )
        db.add(timeline_event)
        await db.commit()

    return enrollment


@router.get("/{workspace_id}/journey-enrollments")
async def list_journey_enrollments(
    workspace_id: UUID,
    journey_id: Optional[UUID] = None,
    contact_id: Optional[UUID] = None,
    lead_id: Optional[UUID] = None,
    status: Optional[str] = None,
    limit: int = 100,
    offset: int = 0,
    member: WorkspaceMember = Depends(get_workspace_member),
    db: AsyncSession = Depends(get_db)
):
    """List journey enrollments with optional filtering."""
    query = select(JourneyEnrollment).where(
        JourneyEnrollment.workspace_id == workspace_id
    )

    if journey_id:
        query = query.where(JourneyEnrollment.journey_id == journey_id)
    if contact_id:
        query = query.where(JourneyEnrollment.contact_id == contact_id)
    if lead_id:
        query = query.where(JourneyEnrollment.lead_id == lead_id)
    if status:
        query = query.where(JourneyEnrollment.status == status)

    query = query.order_by(JourneyEnrollment.enrolled_at.desc()).offset(offset).limit(limit)

    result = await db.execute(query)
    enrollments = result.scalars().all()
    return enrollments


@router.get("/{workspace_id}/journey-enrollments/{enrollment_id}")
async def get_journey_enrollment(
    workspace_id: UUID,
    enrollment_id: UUID,
    member: WorkspaceMember = Depends(get_workspace_member),
    db: AsyncSession = Depends(get_db)
):
    """Get specific journey enrollment details."""
    result = await db.execute(
        select(JourneyEnrollment).where(
            and_(
                JourneyEnrollment.id == enrollment_id,
                JourneyEnrollment.workspace_id == workspace_id
            )
        )
    )
    enrollment = result.scalar_one_or_none()
    if not enrollment:
        raise HTTPException(status_code=404, detail="Journey enrollment not found")
    return enrollment


@router.patch("/{workspace_id}/journey-enrollments/{enrollment_id}")
async def update_journey_enrollment(
    workspace_id: UUID,
    enrollment_id: UUID,
    data: JourneyEnrollmentUpdate,
    user: User = Depends(get_current_user),
    member: WorkspaceMember = Depends(get_workspace_member),
    db: AsyncSession = Depends(get_db)
):
    """Update journey enrollment status and progress."""
    result = await db.execute(
        select(JourneyEnrollment).where(
            and_(
                JourneyEnrollment.id == enrollment_id,
                JourneyEnrollment.workspace_id == workspace_id
            )
        )
    )
    enrollment = result.scalar_one_or_none()
    if not enrollment:
        raise HTTPException(status_code=404, detail="Journey enrollment not found")

    # Get the journey for stats update
    result = await db.execute(
        select(Journey).where(Journey.id == enrollment.journey_id)
    )
    journey = result.scalar_one()

    # Track previous status for journey stats
    previous_status = enrollment.status

    # Update fields
    update_data = data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(enrollment, field, value)

    # Handle status changes
    if data.status:
        if data.status == "completed" and previous_status != "completed":
            enrollment.completed_at = datetime.utcnow()
            journey.active_entries = max(0, journey.active_entries - 1)
            journey.completed_entries += 1
        elif data.status == "exited" and previous_status != "exited":
            enrollment.exited_at = datetime.utcnow()
            journey.active_entries = max(0, journey.active_entries - 1)
        elif data.status == "failed" and previous_status != "failed":
            journey.active_entries = max(0, journey.active_entries - 1)

    # Handle goal achievement
    if data.goal_achieved and not enrollment.goal_achieved:
        enrollment.goal_achieved_at = datetime.utcnow()
        journey.goal_achieved_count += 1

    await db.commit()
    await db.refresh(enrollment)

    return enrollment


# Journey Analytics endpoints
@router.get("/{workspace_id}/journeys/{journey_id}/analytics")
async def get_journey_analytics(
    workspace_id: UUID,
    journey_id: UUID,
    member: WorkspaceMember = Depends(get_workspace_member),
    db: AsyncSession = Depends(get_db)
):
    """Get journey analytics including completion rates and goal achievement."""
    # Verify journey exists
    result = await db.execute(
        select(Journey).where(
            and_(
                Journey.id == journey_id,
                Journey.workspace_id == workspace_id
            )
        )
    )
    journey = result.scalar_one_or_none()
    if not journey:
        raise HTTPException(status_code=404, detail="Journey not found")

    # Get enrollment stats by status
    result = await db.execute(
        select(
            JourneyEnrollment.status,
            func.count(JourneyEnrollment.id).label("count")
        ).where(
            and_(
                JourneyEnrollment.journey_id == journey_id,
                JourneyEnrollment.workspace_id == workspace_id
            )
        ).group_by(JourneyEnrollment.status)
    )
    status_counts = {row.status: row.count for row in result}

    # Calculate completion rate
    total_entries = journey.total_entries
    completed_entries = journey.completed_entries
    completion_rate = (completed_entries / total_entries * 100) if total_entries > 0 else 0

    # Calculate goal achievement rate
    goal_achievement_rate = (journey.goal_achieved_count / total_entries * 100) if total_entries > 0 else 0

    # Get average completion time
    result = await db.execute(
        select(
            func.avg(
                func.extract('epoch', JourneyEnrollment.completed_at - JourneyEnrollment.enrolled_at)
            ).label("avg_seconds")
        ).where(
            and_(
                JourneyEnrollment.journey_id == journey_id,
                JourneyEnrollment.workspace_id == workspace_id,
                JourneyEnrollment.status == "completed"
            )
        )
    )
    avg_completion_seconds = result.scalar()

    return {
        "journey_id": str(journey_id),
        "journey_name": journey.name,
        "total_entries": total_entries,
        "active_entries": journey.active_entries,
        "completed_entries": completed_entries,
        "goal_achieved_count": journey.goal_achieved_count,
        "completion_rate": round(completion_rate, 2),
        "goal_achievement_rate": round(goal_achievement_rate, 2),
        "avg_completion_time_hours": round(avg_completion_seconds / 3600, 2) if avg_completion_seconds else None,
        "status_breakdown": status_counts,
        "last_executed_at": journey.last_executed_at.isoformat() if journey.last_executed_at else None,
    }


@router.get("/{workspace_id}/journeys/analytics/overview")
async def get_journeys_overview_analytics(
    workspace_id: UUID,
    member: WorkspaceMember = Depends(get_workspace_member),
    db: AsyncSession = Depends(get_db)
):
    """Get overview analytics for all journeys in the workspace."""
    # Get total journeys by status
    result = await db.execute(
        select(
            Journey.status,
            func.count(Journey.id).label("count")
        ).where(
            Journey.workspace_id == workspace_id
        ).group_by(Journey.status)
    )
    journey_status_counts = {row.status.value: row.count for row in result}

    # Get total enrollments
    result = await db.execute(
        select(func.count(JourneyEnrollment.id)).where(
            JourneyEnrollment.workspace_id == workspace_id
        )
    )
    total_enrollments = result.scalar() or 0

    # Get active enrollments
    result = await db.execute(
        select(func.count(JourneyEnrollment.id)).where(
            and_(
                JourneyEnrollment.workspace_id == workspace_id,
                JourneyEnrollment.status == "active"
            )
        )
    )
    active_enrollments = result.scalar() or 0

    # Get total goals achieved
    result = await db.execute(
        select(func.sum(Journey.goal_achieved_count)).where(
            Journey.workspace_id == workspace_id
        )
    )
    total_goals_achieved = result.scalar() or 0

    return {
        "total_journeys": sum(journey_status_counts.values()),
        "journey_status_breakdown": journey_status_counts,
        "total_enrollments": total_enrollments,
        "active_enrollments": active_enrollments,
        "total_goals_achieved": total_goals_achieved,
        "goal_achievement_rate": round((total_goals_achieved / total_enrollments * 100), 2) if total_enrollments > 0 else 0,
    }
