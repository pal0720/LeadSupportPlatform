"""
Workspace management API endpoints.
"""
from typing import List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from sqlalchemy.orm import selectinload

from core.database import get_db
from models.workspace import Workspace, WorkspaceMember, BrandKit, UserRole
from models.user import User
from pydantic import BaseModel, Field


# Pydantic schemas
class WorkspaceCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    slug: str = Field(..., min_length=1, max_length=100)
    billing_email: Optional[str] = None


class WorkspaceUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    billing_email: Optional[str] = None
    brand_voice: Optional[str] = None
    settings: Optional[dict] = None


class WorkspaceMemberAdd(BaseModel):
    user_id: UUID
    role: UserRole


class WorkspaceMemberUpdate(BaseModel):
    role: UserRole
    permissions: Optional[dict] = None


class BrandKitUpdate(BaseModel):
    logo_url: Optional[str] = None
    primary_color: Optional[str] = None
    secondary_color: Optional[str] = None
    accent_color: Optional[str] = None
    font_heading: Optional[str] = None
    font_body: Optional[str] = None
    brand_voice_tone: Optional[str] = None
    brand_voice_description: Optional[str] = None
    messaging_guidelines: Optional[dict] = None
    visual_guidelines: Optional[dict] = None


router = APIRouter()


async def get_current_user(db: AsyncSession = Depends(get_db)) -> User:
    """Get current authenticated user (placeholder - implement with actual auth)."""
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


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_workspace(
    data: WorkspaceCreate,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a new workspace and make the current user the owner."""
    import uuid
    from datetime import datetime, timedelta

    # Check if slug is already taken
    result = await db.execute(
        select(Workspace).where(Workspace.slug == data.slug)
    )
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Workspace slug already taken")

    # Create workspace
    workspace = Workspace(
        id=uuid.uuid4(),
        name=data.name,
        slug=data.slug,
        billing_email=data.billing_email or user.email,
        trial_ends_at=datetime.utcnow() + timedelta(days=14),  # 14-day trial
    )
    db.add(workspace)
    await db.flush()

    # Add current user as owner
    member = WorkspaceMember(
        id=uuid.uuid4(),
        workspace_id=workspace.id,
        user_id=user.id,
        role=UserRole.OWNER,
    )
    db.add(member)

    # Create brand kit
    brand_kit = BrandKit(
        id=uuid.uuid4(),
        workspace_id=workspace.id,
    )
    db.add(brand_kit)

    await db.commit()
    await db.refresh(workspace)

    return workspace


@router.get("/")
async def list_workspaces(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """List all workspaces the current user is a member of."""
    result = await db.execute(
        select(Workspace)
        .join(WorkspaceMember)
        .where(WorkspaceMember.user_id == user.id)
        .where(Workspace.deleted_at.is_(None))
        .options(selectinload(Workspace.members))
    )
    workspaces = result.scalars().all()
    return workspaces


@router.get("/{workspace_id}")
async def get_workspace(
    workspace_id: UUID,
    member: WorkspaceMember = Depends(get_workspace_member),
    db: AsyncSession = Depends(get_db)
):
    """Get workspace details."""
    result = await db.execute(
        select(Workspace)
        .where(Workspace.id == workspace_id)
        .where(Workspace.deleted_at.is_(None))
        .options(selectinload(Workspace.members))
    )
    workspace = result.scalar_one_or_none()
    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")
    return workspace


@router.patch("/{workspace_id}")
async def update_workspace(
    workspace_id: UUID,
    data: WorkspaceUpdate,
    member: WorkspaceMember = Depends(get_workspace_member),
    db: AsyncSession = Depends(get_db)
):
    """Update workspace details (requires admin or owner role)."""
    if member.role not in [UserRole.OWNER, UserRole.ADMIN]:
        raise HTTPException(status_code=403, detail="Insufficient permissions")

    result = await db.execute(
        select(Workspace).where(Workspace.id == workspace_id)
    )
    workspace = result.scalar_one_or_none()
    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")

    # Update fields
    if data.name is not None:
        workspace.name = data.name
    if data.billing_email is not None:
        workspace.billing_email = data.billing_email
    if data.brand_voice is not None:
        workspace.brand_voice = data.brand_voice
    if data.settings is not None:
        workspace.settings = data.settings

    await db.commit()
    await db.refresh(workspace)
    return workspace


@router.delete("/{workspace_id}")
async def delete_workspace(
    workspace_id: UUID,
    member: WorkspaceMember = Depends(get_workspace_member),
    db: AsyncSession = Depends(get_db)
):
    """Soft delete workspace (owner only)."""
    if member.role != UserRole.OWNER:
        raise HTTPException(status_code=403, detail="Only workspace owner can delete workspace")

    result = await db.execute(
        select(Workspace).where(Workspace.id == workspace_id)
    )
    workspace = result.scalar_one_or_none()
    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")

    from datetime import datetime
    workspace.deleted_at = datetime.utcnow()

    await db.commit()
    return {"message": "Workspace deleted successfully"}


# Workspace Members endpoints
@router.get("/{workspace_id}/members")
async def list_workspace_members(
    workspace_id: UUID,
    member: WorkspaceMember = Depends(get_workspace_member),
    db: AsyncSession = Depends(get_db)
):
    """List all members of a workspace."""
    result = await db.execute(
        select(WorkspaceMember)
        .where(WorkspaceMember.workspace_id == workspace_id)
        .options(selectinload(WorkspaceMember.user))
    )
    members = result.scalars().all()
    return members


@router.post("/{workspace_id}/members")
async def add_workspace_member(
    workspace_id: UUID,
    data: WorkspaceMemberAdd,
    member: WorkspaceMember = Depends(get_workspace_member),
    db: AsyncSession = Depends(get_db)
):
    """Add a new member to the workspace (admin or owner only)."""
    if member.role not in [UserRole.OWNER, UserRole.ADMIN]:
        raise HTTPException(status_code=403, detail="Insufficient permissions")

    # Check if user exists
    result = await db.execute(select(User).where(User.id == data.user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Check if already a member
    result = await db.execute(
        select(WorkspaceMember).where(
            and_(
                WorkspaceMember.workspace_id == workspace_id,
                WorkspaceMember.user_id == data.user_id
            )
        )
    )
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="User is already a member")

    import uuid
    new_member = WorkspaceMember(
        id=uuid.uuid4(),
        workspace_id=workspace_id,
        user_id=data.user_id,
        role=data.role,
        invited_by=member.user_id,
    )
    db.add(new_member)
    await db.commit()
    await db.refresh(new_member)

    return new_member


@router.patch("/{workspace_id}/members/{member_id}")
async def update_workspace_member(
    workspace_id: UUID,
    member_id: UUID,
    data: WorkspaceMemberUpdate,
    current_member: WorkspaceMember = Depends(get_workspace_member),
    db: AsyncSession = Depends(get_db)
):
    """Update workspace member role (admin or owner only)."""
    if current_member.role not in [UserRole.OWNER, UserRole.ADMIN]:
        raise HTTPException(status_code=403, detail="Insufficient permissions")

    result = await db.execute(
        select(WorkspaceMember).where(
            and_(
                WorkspaceMember.id == member_id,
                WorkspaceMember.workspace_id == workspace_id
            )
        )
    )
    target_member = result.scalar_one_or_none()
    if not target_member:
        raise HTTPException(status_code=404, detail="Member not found")

    # Can't change owner role unless you're the owner
    if target_member.role == UserRole.OWNER and current_member.role != UserRole.OWNER:
        raise HTTPException(status_code=403, detail="Cannot modify owner role")

    target_member.role = data.role
    if data.permissions is not None:
        target_member.permissions = data.permissions

    await db.commit()
    await db.refresh(target_member)
    return target_member


@router.delete("/{workspace_id}/members/{member_id}")
async def remove_workspace_member(
    workspace_id: UUID,
    member_id: UUID,
    current_member: WorkspaceMember = Depends(get_workspace_member),
    db: AsyncSession = Depends(get_db)
):
    """Remove a member from the workspace (admin or owner only)."""
    if current_member.role not in [UserRole.OWNER, UserRole.ADMIN]:
        raise HTTPException(status_code=403, detail="Insufficient permissions")

    result = await db.execute(
        select(WorkspaceMember).where(
            and_(
                WorkspaceMember.id == member_id,
                WorkspaceMember.workspace_id == workspace_id
            )
        )
    )
    target_member = result.scalar_one_or_none()
    if not target_member:
        raise HTTPException(status_code=404, detail="Member not found")

    # Can't remove owner
    if target_member.role == UserRole.OWNER:
        raise HTTPException(status_code=403, detail="Cannot remove workspace owner")

    await db.delete(target_member)
    await db.commit()
    return {"message": "Member removed successfully"}


# Brand Kit endpoints
@router.get("/{workspace_id}/brand-kit")
async def get_brand_kit(
    workspace_id: UUID,
    member: WorkspaceMember = Depends(get_workspace_member),
    db: AsyncSession = Depends(get_db)
):
    """Get workspace brand kit."""
    result = await db.execute(
        select(BrandKit).where(BrandKit.workspace_id == workspace_id)
    )
    brand_kit = result.scalar_one_or_none()
    if not brand_kit:
        raise HTTPException(status_code=404, detail="Brand kit not found")
    return brand_kit


@router.patch("/{workspace_id}/brand-kit")
async def update_brand_kit(
    workspace_id: UUID,
    data: BrandKitUpdate,
    member: WorkspaceMember = Depends(get_workspace_member),
    db: AsyncSession = Depends(get_db)
):
    """Update workspace brand kit (marketing manager, admin, or owner)."""
    if member.role not in [UserRole.OWNER, UserRole.ADMIN, UserRole.MARKETING_MANAGER]:
        raise HTTPException(status_code=403, detail="Insufficient permissions")

    result = await db.execute(
        select(BrandKit).where(BrandKit.workspace_id == workspace_id)
    )
    brand_kit = result.scalar_one_or_none()
    if not brand_kit:
        raise HTTPException(status_code=404, detail="Brand kit not found")

    # Update fields
    update_data = data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(brand_kit, field, value)

    await db.commit()
    await db.refresh(brand_kit)
    return brand_kit
