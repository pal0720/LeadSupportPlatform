"""
Campaign management API endpoints - Campaigns, content assets, and social posts.
"""
from typing import List, Optional
from uuid import UUID
from datetime import datetime, date
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, func, or_
from sqlalchemy.orm import selectinload
from pydantic import BaseModel, Field, HttpUrl

from core.database import get_db
from models.journey import Campaign, ContentAsset, SocialPost
from models.workspace import WorkspaceMember, UserRole
from models.user import User


# Pydantic schemas for Campaigns
class CampaignCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    campaign_type: str  # email, social, paid_ads, seo, content, etc.
    starts_at: Optional[datetime] = None
    ends_at: Optional[datetime] = None
    budget: Optional[int] = None
    target_audience: Optional[dict] = None
    estimated_reach: Optional[int] = None
    goal_type: Optional[str] = None  # leads, conversions, engagement, etc.
    goal_value: Optional[int] = None


class CampaignUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    status: Optional[str] = None  # draft, scheduled, running, paused, completed
    starts_at: Optional[datetime] = None
    ends_at: Optional[datetime] = None
    budget: Optional[int] = None
    spent: Optional[int] = None
    target_audience: Optional[dict] = None
    estimated_reach: Optional[int] = None
    goal_type: Optional[str] = None
    goal_value: Optional[int] = None
    impressions: Optional[int] = None
    clicks: Optional[int] = None
    conversions: Optional[int] = None
    leads_generated: Optional[int] = None
    revenue_generated: Optional[int] = None
    ai_optimized: Optional[bool] = None


# Pydantic schemas for Content Assets
class ContentAssetCreate(BaseModel):
    asset_type: str  # text, image, video, audio
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    content: Optional[str] = None  # For text assets
    file_url: Optional[str] = None  # For media assets
    thumbnail_url: Optional[str] = None
    format: Optional[str] = None  # markdown, html, mp4, mp3, jpg, etc.
    size_bytes: Optional[int] = None
    duration_seconds: Optional[int] = None
    dimensions: Optional[dict] = None  # {width, height}
    campaign_id: Optional[UUID] = None
    category: Optional[str] = None
    tags: List[str] = []
    ai_generated: bool = False
    generation_prompt: Optional[str] = None
    generation_model: Optional[str] = None


class ContentAssetUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    content: Optional[str] = None
    file_url: Optional[str] = None
    thumbnail_url: Optional[str] = None
    campaign_id: Optional[UUID] = None
    category: Optional[str] = None
    tags: Optional[List[str]] = None
    published: Optional[bool] = None
    published_to: Optional[List[str]] = None


# Pydantic schemas for Social Posts
class SocialPostCreate(BaseModel):
    platform: str  # linkedin, twitter, instagram, facebook
    content: str = Field(..., min_length=1)
    media_urls: List[str] = []
    link: Optional[str] = None
    scheduled_at: Optional[datetime] = None
    campaign_id: Optional[UUID] = None
    content_asset_id: Optional[UUID] = None
    ai_generated: bool = False


class SocialPostUpdate(BaseModel):
    platform: Optional[str] = None
    content: Optional[str] = Field(None, min_length=1)
    media_urls: Optional[List[str]] = None
    link: Optional[str] = None
    status: Optional[str] = None  # draft, scheduled, published, failed
    scheduled_at: Optional[datetime] = None
    published_at: Optional[datetime] = None
    impressions: Optional[int] = None
    engagement: Optional[int] = None
    clicks: Optional[int] = None
    shares: Optional[int] = None
    platform_post_id: Optional[str] = None
    platform_url: Optional[str] = None


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


# Campaign CRUD endpoints
@router.post("/{workspace_id}/campaigns", status_code=status.HTTP_201_CREATED)
async def create_campaign(
    workspace_id: UUID,
    data: CampaignCreate,
    user: User = Depends(get_current_user),
    member: WorkspaceMember = Depends(get_workspace_member),
    db: AsyncSession = Depends(get_db)
):
    """Create a new marketing campaign."""
    import uuid

    # Check permissions - marketing managers and above
    if member.role not in [UserRole.OWNER, UserRole.ADMIN, UserRole.MARKETING_MANAGER]:
        raise HTTPException(status_code=403, detail="Insufficient permissions")

    campaign = Campaign(
        id=uuid.uuid4(),
        workspace_id=workspace_id,
        name=data.name,
        description=data.description,
        campaign_type=data.campaign_type,
        starts_at=data.starts_at,
        ends_at=data.ends_at,
        budget=data.budget,
        target_audience=data.target_audience or {},
        estimated_reach=data.estimated_reach,
        goal_type=data.goal_type,
        goal_value=data.goal_value,
        created_by=user.id,
    )
    db.add(campaign)
    await db.commit()
    await db.refresh(campaign)

    return campaign


@router.get("/{workspace_id}/campaigns")
async def list_campaigns(
    workspace_id: UUID,
    campaign_type: Optional[str] = None,
    status: Optional[str] = None,
    limit: int = 100,
    offset: int = 0,
    member: WorkspaceMember = Depends(get_workspace_member),
    db: AsyncSession = Depends(get_db)
):
    """List all campaigns in the workspace with optional filtering."""
    query = select(Campaign).where(Campaign.workspace_id == workspace_id)

    if campaign_type:
        query = query.where(Campaign.campaign_type == campaign_type)
    if status:
        query = query.where(Campaign.status == status)

    query = query.order_by(Campaign.starts_at.desc().nullslast(), Campaign.created_at.desc())
    query = query.offset(offset).limit(limit)

    result = await db.execute(query)
    campaigns = result.scalars().all()
    return campaigns


@router.get("/{workspace_id}/campaigns/{campaign_id}")
async def get_campaign(
    workspace_id: UUID,
    campaign_id: UUID,
    member: WorkspaceMember = Depends(get_workspace_member),
    db: AsyncSession = Depends(get_db)
):
    """Get specific campaign details."""
    result = await db.execute(
        select(Campaign).where(
            and_(
                Campaign.id == campaign_id,
                Campaign.workspace_id == workspace_id
            )
        )
    )
    campaign = result.scalar_one_or_none()
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    return campaign


@router.patch("/{workspace_id}/campaigns/{campaign_id}")
async def update_campaign(
    workspace_id: UUID,
    campaign_id: UUID,
    data: CampaignUpdate,
    user: User = Depends(get_current_user),
    member: WorkspaceMember = Depends(get_workspace_member),
    db: AsyncSession = Depends(get_db)
):
    """Update campaign details and metrics."""
    # Check permissions - marketing managers and above
    if member.role not in [UserRole.OWNER, UserRole.ADMIN, UserRole.MARKETING_MANAGER]:
        raise HTTPException(status_code=403, detail="Insufficient permissions")

    result = await db.execute(
        select(Campaign).where(
            and_(
                Campaign.id == campaign_id,
                Campaign.workspace_id == workspace_id
            )
        )
    )
    campaign = result.scalar_one_or_none()
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")

    # Update fields
    update_data = data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(campaign, field, value)

    await db.commit()
    await db.refresh(campaign)
    return campaign


@router.delete("/{workspace_id}/campaigns/{campaign_id}")
async def delete_campaign(
    workspace_id: UUID,
    campaign_id: UUID,
    user: User = Depends(get_current_user),
    member: WorkspaceMember = Depends(get_workspace_member),
    db: AsyncSession = Depends(get_db)
):
    """Delete a campaign."""
    # Check permissions - marketing managers and above
    if member.role not in [UserRole.OWNER, UserRole.ADMIN, UserRole.MARKETING_MANAGER]:
        raise HTTPException(status_code=403, detail="Insufficient permissions")

    result = await db.execute(
        select(Campaign).where(
            and_(
                Campaign.id == campaign_id,
                Campaign.workspace_id == workspace_id
            )
        )
    )
    campaign = result.scalar_one_or_none()
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")

    await db.delete(campaign)
    await db.commit()
    return {"message": "Campaign deleted successfully"}


# Campaign Analytics endpoint
@router.get("/{workspace_id}/campaigns/{campaign_id}/analytics")
async def get_campaign_analytics(
    workspace_id: UUID,
    campaign_id: UUID,
    member: WorkspaceMember = Depends(get_workspace_member),
    db: AsyncSession = Depends(get_db)
):
    """Get campaign analytics including reach, engagement, and ROI."""
    result = await db.execute(
        select(Campaign).where(
            and_(
                Campaign.id == campaign_id,
                Campaign.workspace_id == workspace_id
            )
        )
    )
    campaign = result.scalar_one_or_none()
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")

    # Calculate metrics
    ctr = (campaign.clicks / campaign.impressions * 100) if campaign.impressions > 0 else 0
    conversion_rate = (campaign.conversions / campaign.clicks * 100) if campaign.clicks > 0 else 0
    cost_per_lead = (campaign.spent / campaign.leads_generated) if campaign.leads_generated > 0 else 0
    roi = ((campaign.revenue_generated - campaign.spent) / campaign.spent * 100) if campaign.spent > 0 else 0

    return {
        "campaign_id": str(campaign_id),
        "campaign_name": campaign.name,
        "campaign_type": campaign.campaign_type,
        "status": campaign.status,
        "budget": campaign.budget,
        "spent": campaign.spent,
        "budget_remaining": (campaign.budget - campaign.spent) if campaign.budget else None,
        "reach": {
            "estimated": campaign.estimated_reach,
            "actual_impressions": campaign.impressions,
        },
        "engagement": {
            "clicks": campaign.clicks,
            "ctr": round(ctr, 2),
            "conversions": campaign.conversions,
            "conversion_rate": round(conversion_rate, 2),
        },
        "performance": {
            "leads_generated": campaign.leads_generated,
            "revenue_generated": campaign.revenue_generated,
            "cost_per_lead": round(cost_per_lead, 2) if cost_per_lead > 0 else None,
            "roi": round(roi, 2),
        },
        "timeline": {
            "starts_at": campaign.starts_at.isoformat() if campaign.starts_at else None,
            "ends_at": campaign.ends_at.isoformat() if campaign.ends_at else None,
            "created_at": campaign.created_at.isoformat(),
        },
    }


# Content Asset CRUD endpoints
@router.post("/{workspace_id}/content-assets", status_code=status.HTTP_201_CREATED)
async def create_content_asset(
    workspace_id: UUID,
    data: ContentAssetCreate,
    user: User = Depends(get_current_user),
    member: WorkspaceMember = Depends(get_workspace_member),
    db: AsyncSession = Depends(get_db)
):
    """Create a new content asset (text, image, video, audio)."""
    import uuid

    # Check permissions - marketing managers and above
    if member.role not in [UserRole.OWNER, UserRole.ADMIN, UserRole.MARKETING_MANAGER]:
        raise HTTPException(status_code=403, detail="Insufficient permissions")

    # Verify campaign if provided
    if data.campaign_id:
        result = await db.execute(
            select(Campaign).where(
                and_(
                    Campaign.id == data.campaign_id,
                    Campaign.workspace_id == workspace_id
                )
            )
        )
        if not result.scalar_one_or_none():
            raise HTTPException(status_code=404, detail="Campaign not found")

    content_asset = ContentAsset(
        id=uuid.uuid4(),
        workspace_id=workspace_id,
        asset_type=data.asset_type,
        title=data.title,
        description=data.description,
        content=data.content,
        file_url=data.file_url,
        thumbnail_url=data.thumbnail_url,
        format=data.format,
        size_bytes=data.size_bytes,
        duration_seconds=data.duration_seconds,
        dimensions=data.dimensions,
        campaign_id=data.campaign_id,
        category=data.category,
        tags=data.tags,
        ai_generated=data.ai_generated,
        generation_prompt=data.generation_prompt,
        generation_model=data.generation_model,
        created_by=user.id,
    )
    db.add(content_asset)
    await db.commit()
    await db.refresh(content_asset)

    return content_asset


@router.get("/{workspace_id}/content-assets")
async def list_content_assets(
    workspace_id: UUID,
    asset_type: Optional[str] = None,
    campaign_id: Optional[UUID] = None,
    category: Optional[str] = None,
    ai_generated: Optional[bool] = None,
    published: Optional[bool] = None,
    limit: int = 100,
    offset: int = 0,
    member: WorkspaceMember = Depends(get_workspace_member),
    db: AsyncSession = Depends(get_db)
):
    """List all content assets with optional filtering."""
    query = select(ContentAsset).where(ContentAsset.workspace_id == workspace_id)

    if asset_type:
        query = query.where(ContentAsset.asset_type == asset_type)
    if campaign_id:
        query = query.where(ContentAsset.campaign_id == campaign_id)
    if category:
        query = query.where(ContentAsset.category == category)
    if ai_generated is not None:
        query = query.where(ContentAsset.ai_generated == ai_generated)
    if published is not None:
        query = query.where(ContentAsset.published == published)

    query = query.order_by(ContentAsset.created_at.desc()).offset(offset).limit(limit)

    result = await db.execute(query)
    content_assets = result.scalars().all()
    return content_assets


@router.get("/{workspace_id}/content-assets/{asset_id}")
async def get_content_asset(
    workspace_id: UUID,
    asset_id: UUID,
    member: WorkspaceMember = Depends(get_workspace_member),
    db: AsyncSession = Depends(get_db)
):
    """Get specific content asset details."""
    result = await db.execute(
        select(ContentAsset).where(
            and_(
                ContentAsset.id == asset_id,
                ContentAsset.workspace_id == workspace_id
            )
        )
    )
    asset = result.scalar_one_or_none()
    if not asset:
        raise HTTPException(status_code=404, detail="Content asset not found")
    return asset


@router.patch("/{workspace_id}/content-assets/{asset_id}")
async def update_content_asset(
    workspace_id: UUID,
    asset_id: UUID,
    data: ContentAssetUpdate,
    user: User = Depends(get_current_user),
    member: WorkspaceMember = Depends(get_workspace_member),
    db: AsyncSession = Depends(get_db)
):
    """Update content asset details."""
    # Check permissions - marketing managers and above
    if member.role not in [UserRole.OWNER, UserRole.ADMIN, UserRole.MARKETING_MANAGER]:
        raise HTTPException(status_code=403, detail="Insufficient permissions")

    result = await db.execute(
        select(ContentAsset).where(
            and_(
                ContentAsset.id == asset_id,
                ContentAsset.workspace_id == workspace_id
            )
        )
    )
    asset = result.scalar_one_or_none()
    if not asset:
        raise HTTPException(status_code=404, detail="Content asset not found")

    # Update fields
    update_data = data.dict(exclude_unset=True)
    for field, value in update_data.items():
        # Handle published status change
        if field == "published" and value and not asset.published:
            asset.published_at = datetime.utcnow()
        setattr(asset, field, value)

    await db.commit()
    await db.refresh(asset)
    return asset


@router.delete("/{workspace_id}/content-assets/{asset_id}")
async def delete_content_asset(
    workspace_id: UUID,
    asset_id: UUID,
    user: User = Depends(get_current_user),
    member: WorkspaceMember = Depends(get_workspace_member),
    db: AsyncSession = Depends(get_db)
):
    """Delete a content asset."""
    # Check permissions - marketing managers and above
    if member.role not in [UserRole.OWNER, UserRole.ADMIN, UserRole.MARKETING_MANAGER]:
        raise HTTPException(status_code=403, detail="Insufficient permissions")

    result = await db.execute(
        select(ContentAsset).where(
            and_(
                ContentAsset.id == asset_id,
                ContentAsset.workspace_id == workspace_id
            )
        )
    )
    asset = result.scalar_one_or_none()
    if not asset:
        raise HTTPException(status_code=404, detail="Content asset not found")

    await db.delete(asset)
    await db.commit()
    return {"message": "Content asset deleted successfully"}


# Social Post CRUD endpoints
@router.post("/{workspace_id}/social-posts", status_code=status.HTTP_201_CREATED)
async def create_social_post(
    workspace_id: UUID,
    data: SocialPostCreate,
    user: User = Depends(get_current_user),
    member: WorkspaceMember = Depends(get_workspace_member),
    db: AsyncSession = Depends(get_db)
):
    """Create a new social media post."""
    import uuid

    # Check permissions - marketing managers and above
    if member.role not in [UserRole.OWNER, UserRole.ADMIN, UserRole.MARKETING_MANAGER]:
        raise HTTPException(status_code=403, detail="Insufficient permissions")

    # Verify campaign if provided
    if data.campaign_id:
        result = await db.execute(
            select(Campaign).where(
                and_(
                    Campaign.id == data.campaign_id,
                    Campaign.workspace_id == workspace_id
                )
            )
        )
        if not result.scalar_one_or_none():
            raise HTTPException(status_code=404, detail="Campaign not found")

    # Verify content asset if provided
    if data.content_asset_id:
        result = await db.execute(
            select(ContentAsset).where(
                and_(
                    ContentAsset.id == data.content_asset_id,
                    ContentAsset.workspace_id == workspace_id
                )
            )
        )
        if not result.scalar_one_or_none():
            raise HTTPException(status_code=404, detail="Content asset not found")

    # Determine initial status
    initial_status = "scheduled" if data.scheduled_at else "draft"

    social_post = SocialPost(
        id=uuid.uuid4(),
        workspace_id=workspace_id,
        platform=data.platform,
        content=data.content,
        media_urls=data.media_urls,
        link=data.link,
        status=initial_status,
        scheduled_at=data.scheduled_at,
        campaign_id=data.campaign_id,
        content_asset_id=data.content_asset_id,
        ai_generated=data.ai_generated,
        created_by=user.id,
    )
    db.add(social_post)
    await db.commit()
    await db.refresh(social_post)

    return social_post


@router.get("/{workspace_id}/social-posts")
async def list_social_posts(
    workspace_id: UUID,
    platform: Optional[str] = None,
    status: Optional[str] = None,
    campaign_id: Optional[UUID] = None,
    limit: int = 100,
    offset: int = 0,
    member: WorkspaceMember = Depends(get_workspace_member),
    db: AsyncSession = Depends(get_db)
):
    """List all social posts with optional filtering."""
    query = select(SocialPost).where(SocialPost.workspace_id == workspace_id)

    if platform:
        query = query.where(SocialPost.platform == platform)
    if status:
        query = query.where(SocialPost.status == status)
    if campaign_id:
        query = query.where(SocialPost.campaign_id == campaign_id)

    query = query.order_by(
        SocialPost.scheduled_at.desc().nullslast(),
        SocialPost.created_at.desc()
    ).offset(offset).limit(limit)

    result = await db.execute(query)
    social_posts = result.scalars().all()
    return social_posts


@router.get("/{workspace_id}/social-posts/{post_id}")
async def get_social_post(
    workspace_id: UUID,
    post_id: UUID,
    member: WorkspaceMember = Depends(get_workspace_member),
    db: AsyncSession = Depends(get_db)
):
    """Get specific social post details."""
    result = await db.execute(
        select(SocialPost).where(
            and_(
                SocialPost.id == post_id,
                SocialPost.workspace_id == workspace_id
            )
        )
    )
    post = result.scalar_one_or_none()
    if not post:
        raise HTTPException(status_code=404, detail="Social post not found")
    return post


@router.patch("/{workspace_id}/social-posts/{post_id}")
async def update_social_post(
    workspace_id: UUID,
    post_id: UUID,
    data: SocialPostUpdate,
    user: User = Depends(get_current_user),
    member: WorkspaceMember = Depends(get_workspace_member),
    db: AsyncSession = Depends(get_db)
):
    """Update social post details and metrics."""
    # Check permissions - marketing managers and above
    if member.role not in [UserRole.OWNER, UserRole.ADMIN, UserRole.MARKETING_MANAGER]:
        raise HTTPException(status_code=403, detail="Insufficient permissions")

    result = await db.execute(
        select(SocialPost).where(
            and_(
                SocialPost.id == post_id,
                SocialPost.workspace_id == workspace_id
            )
        )
    )
    post = result.scalar_one_or_none()
    if not post:
        raise HTTPException(status_code=404, detail="Social post not found")

    # Update fields
    update_data = data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(post, field, value)

    await db.commit()
    await db.refresh(post)
    return post


@router.delete("/{workspace_id}/social-posts/{post_id}")
async def delete_social_post(
    workspace_id: UUID,
    post_id: UUID,
    user: User = Depends(get_current_user),
    member: WorkspaceMember = Depends(get_workspace_member),
    db: AsyncSession = Depends(get_db)
):
    """Delete a social post."""
    # Check permissions - marketing managers and above
    if member.role not in [UserRole.OWNER, UserRole.ADMIN, UserRole.MARKETING_MANAGER]:
        raise HTTPException(status_code=403, detail="Insufficient permissions")

    result = await db.execute(
        select(SocialPost).where(
            and_(
                SocialPost.id == post_id,
                SocialPost.workspace_id == workspace_id
            )
        )
    )
    post = result.scalar_one_or_none()
    if not post:
        raise HTTPException(status_code=404, detail="Social post not found")

    await db.delete(post)
    await db.commit()
    return {"message": "Social post deleted successfully"}


# Bulk scheduling endpoint for social posts
@router.post("/{workspace_id}/social-posts/bulk-schedule")
async def bulk_schedule_social_posts(
    workspace_id: UUID,
    post_ids: List[UUID],
    scheduled_times: List[datetime],
    user: User = Depends(get_current_user),
    member: WorkspaceMember = Depends(get_workspace_member),
    db: AsyncSession = Depends(get_db)
):
    """Bulk schedule multiple social posts."""
    # Check permissions - marketing managers and above
    if member.role not in [UserRole.OWNER, UserRole.ADMIN, UserRole.MARKETING_MANAGER]:
        raise HTTPException(status_code=403, detail="Insufficient permissions")

    if len(post_ids) != len(scheduled_times):
        raise HTTPException(status_code=400, detail="Number of post IDs must match number of scheduled times")

    # Get all posts
    result = await db.execute(
        select(SocialPost).where(
            and_(
                SocialPost.id.in_(post_ids),
                SocialPost.workspace_id == workspace_id
            )
        )
    )
    posts = {post.id: post for post in result.scalars().all()}

    if len(posts) != len(post_ids):
        raise HTTPException(status_code=404, detail="One or more social posts not found")

    # Update scheduled times
    updated_posts = []
    for post_id, scheduled_time in zip(post_ids, scheduled_times):
        post = posts[post_id]
        post.scheduled_at = scheduled_time
        post.status = "scheduled"
        updated_posts.append(post)

    await db.commit()

    return {
        "message": f"Successfully scheduled {len(updated_posts)} posts",
        "updated_post_ids": [str(post.id) for post in updated_posts]
    }
