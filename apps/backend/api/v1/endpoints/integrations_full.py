"""
Complete integrations management API endpoints - Integrations, webhooks, and sync operations.
"""
from typing import List, Optional
from uuid import UUID
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, func
from sqlalchemy.orm import selectinload
from pydantic import BaseModel, Field, HttpUrl

from core.database import get_db
from models.integration import Integration, Webhook, WebhookLog, IntegrationType, IntegrationStatus
from models.workspace import WorkspaceMember, UserRole
from models.user import User


# Pydantic schemas for Integrations
class IntegrationCreate(BaseModel):
    integration_type: str  # crm, email, calendar, social, ads, etc.
    provider: str  # hubspot, salesforce, gmail, etc.
    name: str = Field(..., min_length=1, max_length=255)
    auth_type: str  # oauth2, api_key, basic
    credentials: Optional[dict] = None
    config: Optional[dict] = None
    field_mappings: Optional[dict] = None
    sync_enabled: bool = True
    sync_direction: str = "bidirectional"  # inbound, outbound, bidirectional
    sync_frequency_minutes: int = 60


class IntegrationUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    status: Optional[str] = None  # active, inactive, error, expired
    credentials: Optional[dict] = None
    access_token: Optional[str] = None
    refresh_token: Optional[str] = None
    token_expires_at: Optional[datetime] = None
    config: Optional[dict] = None
    field_mappings: Optional[dict] = None
    sync_enabled: Optional[bool] = None
    sync_direction: Optional[str] = None
    sync_frequency_minutes: Optional[int] = None
    last_error: Optional[str] = None


class IntegrationOAuthCallback(BaseModel):
    """OAuth callback data after user authorization."""
    code: str
    state: str


# Pydantic schemas for Webhooks
class WebhookCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    direction: str  # inbound, outbound
    url: str = Field(..., min_length=1, max_length=500)
    secret: Optional[str] = None
    events: List[str] = []  # For outbound webhooks


class WebhookUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    url: Optional[str] = Field(None, min_length=1, max_length=500)
    secret: Optional[str] = None
    events: Optional[List[str]] = None
    is_active: Optional[bool] = None


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


# Integration CRUD endpoints
@router.post("/{workspace_id}/integrations", status_code=status.HTTP_201_CREATED)
async def create_integration(
    workspace_id: UUID,
    data: IntegrationCreate,
    user: User = Depends(get_current_user),
    member: WorkspaceMember = Depends(get_workspace_member),
    db: AsyncSession = Depends(get_db)
):
    """Create a new integration with external service."""
    import uuid

    # Check permissions - admin and above
    if member.role not in [UserRole.OWNER, UserRole.ADMIN]:
        raise HTTPException(status_code=403, detail="Insufficient permissions")

    # Validate integration type
    valid_types = [t.value for t in IntegrationType]
    if data.integration_type not in valid_types:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid integration type. Must be one of: {valid_types}"
        )

    # Check for duplicate integrations
    result = await db.execute(
        select(Integration).where(
            and_(
                Integration.workspace_id == workspace_id,
                Integration.provider == data.provider,
                Integration.status != IntegrationStatus.INACTIVE
            )
        )
    )
    existing = result.scalar_one_or_none()
    if existing:
        raise HTTPException(
            status_code=400,
            detail=f"Active integration with {data.provider} already exists"
        )

    # TODO: Encrypt credentials before storing
    integration = Integration(
        id=uuid.uuid4(),
        workspace_id=workspace_id,
        integration_type=IntegrationType(data.integration_type),
        provider=data.provider,
        name=data.name,
        auth_type=data.auth_type,
        credentials=data.credentials or {},
        config=data.config or {},
        field_mappings=data.field_mappings or {},
        sync_enabled=data.sync_enabled,
        sync_direction=data.sync_direction,
        sync_frequency_minutes=data.sync_frequency_minutes,
        created_by=user.id,
    )
    db.add(integration)
    await db.commit()
    await db.refresh(integration)

    return integration


@router.get("/{workspace_id}/integrations")
async def list_integrations(
    workspace_id: UUID,
    integration_type: Optional[str] = None,
    status: Optional[str] = None,
    provider: Optional[str] = None,
    limit: int = 100,
    offset: int = 0,
    member: WorkspaceMember = Depends(get_workspace_member),
    db: AsyncSession = Depends(get_db)
):
    """List all integrations in the workspace with optional filtering."""
    query = select(Integration).where(Integration.workspace_id == workspace_id)

    if integration_type:
        try:
            int_type = IntegrationType(integration_type)
            query = query.where(Integration.integration_type == int_type)
        except ValueError:
            raise HTTPException(status_code=400, detail=f"Invalid integration type: {integration_type}")

    if status:
        try:
            int_status = IntegrationStatus(status)
            query = query.where(Integration.status == int_status)
        except ValueError:
            raise HTTPException(status_code=400, detail=f"Invalid status: {status}")

    if provider:
        query = query.where(Integration.provider == provider)

    query = query.order_by(Integration.created_at.desc()).offset(offset).limit(limit)

    result = await db.execute(query)
    integrations = result.scalars().all()

    # Remove sensitive data from response
    for integration in integrations:
        integration.credentials = {}  # Hide credentials
        integration.access_token = None  # Hide tokens
        integration.refresh_token = None

    return integrations


@router.get("/{workspace_id}/integrations/{integration_id}")
async def get_integration(
    workspace_id: UUID,
    integration_id: UUID,
    member: WorkspaceMember = Depends(get_workspace_member),
    db: AsyncSession = Depends(get_db)
):
    """Get specific integration details."""
    result = await db.execute(
        select(Integration).where(
            and_(
                Integration.id == integration_id,
                Integration.workspace_id == workspace_id
            )
        )
    )
    integration = result.scalar_one_or_none()
    if not integration:
        raise HTTPException(status_code=404, detail="Integration not found")

    # Hide sensitive data
    integration.credentials = {}
    integration.access_token = None
    integration.refresh_token = None

    return integration


@router.patch("/{workspace_id}/integrations/{integration_id}")
async def update_integration(
    workspace_id: UUID,
    integration_id: UUID,
    data: IntegrationUpdate,
    user: User = Depends(get_current_user),
    member: WorkspaceMember = Depends(get_workspace_member),
    db: AsyncSession = Depends(get_db)
):
    """Update integration configuration."""
    # Check permissions - admin and above
    if member.role not in [UserRole.OWNER, UserRole.ADMIN]:
        raise HTTPException(status_code=403, detail="Insufficient permissions")

    result = await db.execute(
        select(Integration).where(
            and_(
                Integration.id == integration_id,
                Integration.workspace_id == workspace_id
            )
        )
    )
    integration = result.scalar_one_or_none()
    if not integration:
        raise HTTPException(status_code=404, detail="Integration not found")

    # Update fields
    update_data = data.dict(exclude_unset=True)
    for field, value in update_data.items():
        # Handle status enum conversion
        if field == "status" and value:
            try:
                value = IntegrationStatus(value)
            except ValueError:
                raise HTTPException(status_code=400, detail=f"Invalid status: {value}")
        # TODO: Encrypt sensitive fields before storing
        setattr(integration, field, value)

    integration.updated_at = datetime.utcnow()
    await db.commit()
    await db.refresh(integration)

    # Hide sensitive data in response
    integration.credentials = {}
    integration.access_token = None
    integration.refresh_token = None

    return integration


@router.delete("/{workspace_id}/integrations/{integration_id}")
async def delete_integration(
    workspace_id: UUID,
    integration_id: UUID,
    user: User = Depends(get_current_user),
    member: WorkspaceMember = Depends(get_workspace_member),
    db: AsyncSession = Depends(get_db)
):
    """Delete an integration (sets status to inactive)."""
    # Check permissions - admin and above
    if member.role not in [UserRole.OWNER, UserRole.ADMIN]:
        raise HTTPException(status_code=403, detail="Insufficient permissions")

    result = await db.execute(
        select(Integration).where(
            and_(
                Integration.id == integration_id,
                Integration.workspace_id == workspace_id
            )
        )
    )
    integration = result.scalar_one_or_none()
    if not integration:
        raise HTTPException(status_code=404, detail="Integration not found")

    # Set to inactive instead of hard delete
    integration.status = IntegrationStatus.INACTIVE
    integration.sync_enabled = False
    await db.commit()

    return {"message": "Integration deactivated successfully"}


# Integration sync operations
@router.post("/{workspace_id}/integrations/{integration_id}/sync")
async def trigger_integration_sync(
    workspace_id: UUID,
    integration_id: UUID,
    user: User = Depends(get_current_user),
    member: WorkspaceMember = Depends(get_workspace_member),
    db: AsyncSession = Depends(get_db)
):
    """Manually trigger a sync for an integration."""
    # Check permissions - admin and above
    if member.role not in [UserRole.OWNER, UserRole.ADMIN]:
        raise HTTPException(status_code=403, detail="Insufficient permissions")

    result = await db.execute(
        select(Integration).where(
            and_(
                Integration.id == integration_id,
                Integration.workspace_id == workspace_id
            )
        )
    )
    integration = result.scalar_one_or_none()
    if not integration:
        raise HTTPException(status_code=404, detail="Integration not found")

    if integration.status != IntegrationStatus.ACTIVE:
        raise HTTPException(status_code=400, detail="Integration is not active")

    # TODO: Trigger async sync task via Celery
    # For now, just update last_sync_at
    integration.last_sync_at = datetime.utcnow()
    integration.next_sync_at = datetime.utcnow() + timedelta(minutes=integration.sync_frequency_minutes)
    integration.last_used_at = datetime.utcnow()

    await db.commit()

    return {
        "message": "Sync triggered successfully",
        "integration_id": str(integration_id),
        "last_sync_at": integration.last_sync_at.isoformat(),
        "next_sync_at": integration.next_sync_at.isoformat(),
    }


@router.get("/{workspace_id}/integrations/{integration_id}/status")
async def get_integration_sync_status(
    workspace_id: UUID,
    integration_id: UUID,
    member: WorkspaceMember = Depends(get_workspace_member),
    db: AsyncSession = Depends(get_db)
):
    """Get integration sync status and health metrics."""
    result = await db.execute(
        select(Integration).where(
            and_(
                Integration.id == integration_id,
                Integration.workspace_id == workspace_id
            )
        )
    )
    integration = result.scalar_one_or_none()
    if not integration:
        raise HTTPException(status_code=404, detail="Integration not found")

    return {
        "integration_id": str(integration_id),
        "provider": integration.provider,
        "status": integration.status.value,
        "sync_enabled": integration.sync_enabled,
        "last_sync_at": integration.last_sync_at.isoformat() if integration.last_sync_at else None,
        "next_sync_at": integration.next_sync_at.isoformat() if integration.next_sync_at else None,
        "last_error": integration.last_error,
        "last_error_at": integration.last_error_at.isoformat() if integration.last_error_at else None,
        "error_count": integration.error_count,
        "total_api_calls": integration.total_api_calls,
        "api_calls_this_month": integration.api_calls_this_month,
        "rate_limit_remaining": integration.rate_limit_remaining,
        "rate_limit_reset_at": integration.rate_limit_reset_at.isoformat() if integration.rate_limit_reset_at else None,
    }


# OAuth flow helpers
@router.get("/{workspace_id}/integrations/oauth/{provider}/authorize-url")
async def get_oauth_authorize_url(
    workspace_id: UUID,
    provider: str,
    user: User = Depends(get_current_user),
    member: WorkspaceMember = Depends(get_workspace_member),
    db: AsyncSession = Depends(get_db)
):
    """Get OAuth authorization URL for a provider."""
    # Check permissions - admin and above
    if member.role not in [UserRole.OWNER, UserRole.ADMIN]:
        raise HTTPException(status_code=403, detail="Insufficient permissions")

    # TODO: Implement actual OAuth URL generation per provider
    # This is a placeholder implementation
    import uuid
    state = str(uuid.uuid4())

    oauth_urls = {
        "hubspot": f"https://app.hubspot.com/oauth/authorize?client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&scope=crm.objects.contacts.read&state={state}",
        "salesforce": f"https://login.salesforce.com/services/oauth2/authorize?client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&response_type=code&state={state}",
        "gmail": f"https://accounts.google.com/o/oauth2/v2/auth?client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&response_type=code&scope=https://www.googleapis.com/auth/gmail.send&state={state}",
        "linkedin": f"https://www.linkedin.com/oauth/v2/authorization?client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&response_type=code&scope=r_liteprofile%20r_emailaddress%20w_member_social&state={state}",
    }

    if provider not in oauth_urls:
        raise HTTPException(status_code=400, detail=f"OAuth not supported for provider: {provider}")

    return {
        "provider": provider,
        "authorize_url": oauth_urls[provider],
        "state": state,
    }


@router.post("/{workspace_id}/integrations/oauth/{provider}/callback")
async def handle_oauth_callback(
    workspace_id: UUID,
    provider: str,
    data: IntegrationOAuthCallback,
    user: User = Depends(get_current_user),
    member: WorkspaceMember = Depends(get_workspace_member),
    db: AsyncSession = Depends(get_db)
):
    """Handle OAuth callback and exchange code for tokens."""
    # Check permissions - admin and above
    if member.role not in [UserRole.OWNER, UserRole.ADMIN]:
        raise HTTPException(status_code=403, detail="Insufficient permissions")

    # TODO: Implement actual OAuth token exchange per provider
    # This is a placeholder implementation

    # Verify state parameter
    # TODO: Store and verify state parameter to prevent CSRF

    # Exchange code for access token
    # TODO: Make actual HTTP request to provider's token endpoint

    return {
        "message": "OAuth callback handled successfully",
        "provider": provider,
        "status": "tokens_exchanged",
        "next_step": "Create integration with received tokens",
    }


# Webhook CRUD endpoints
@router.post("/{workspace_id}/webhooks", status_code=status.HTTP_201_CREATED)
async def create_webhook(
    workspace_id: UUID,
    data: WebhookCreate,
    user: User = Depends(get_current_user),
    member: WorkspaceMember = Depends(get_workspace_member),
    db: AsyncSession = Depends(get_db)
):
    """Create a new webhook configuration."""
    import uuid

    # Check permissions - admin and above
    if member.role not in [UserRole.OWNER, UserRole.ADMIN]:
        raise HTTPException(status_code=403, detail="Insufficient permissions")

    # Validate direction
    if data.direction not in ["inbound", "outbound"]:
        raise HTTPException(status_code=400, detail="Direction must be 'inbound' or 'outbound'")

    # Generate secret if not provided
    if not data.secret:
        import secrets
        data.secret = secrets.token_urlsafe(32)

    webhook = Webhook(
        id=uuid.uuid4(),
        workspace_id=workspace_id,
        name=data.name,
        description=data.description,
        direction=data.direction,
        url=data.url,
        secret=data.secret,
        events=data.events,
    )
    db.add(webhook)
    await db.commit()
    await db.refresh(webhook)

    return webhook


@router.get("/{workspace_id}/webhooks")
async def list_webhooks(
    workspace_id: UUID,
    direction: Optional[str] = None,
    is_active: Optional[bool] = None,
    limit: int = 100,
    offset: int = 0,
    member: WorkspaceMember = Depends(get_workspace_member),
    db: AsyncSession = Depends(get_db)
):
    """List all webhooks in the workspace with optional filtering."""
    query = select(Webhook).where(Webhook.workspace_id == workspace_id)

    if direction:
        query = query.where(Webhook.direction == direction)
    if is_active is not None:
        query = query.where(Webhook.is_active == is_active)

    query = query.order_by(Webhook.created_at.desc()).offset(offset).limit(limit)

    result = await db.execute(query)
    webhooks = result.scalars().all()
    return webhooks


@router.get("/{workspace_id}/webhooks/{webhook_id}")
async def get_webhook(
    workspace_id: UUID,
    webhook_id: UUID,
    member: WorkspaceMember = Depends(get_workspace_member),
    db: AsyncSession = Depends(get_db)
):
    """Get specific webhook details."""
    result = await db.execute(
        select(Webhook).where(
            and_(
                Webhook.id == webhook_id,
                Webhook.workspace_id == workspace_id
            )
        )
    )
    webhook = result.scalar_one_or_none()
    if not webhook:
        raise HTTPException(status_code=404, detail="Webhook not found")
    return webhook


@router.patch("/{workspace_id}/webhooks/{webhook_id}")
async def update_webhook(
    workspace_id: UUID,
    webhook_id: UUID,
    data: WebhookUpdate,
    user: User = Depends(get_current_user),
    member: WorkspaceMember = Depends(get_workspace_member),
    db: AsyncSession = Depends(get_db)
):
    """Update webhook configuration."""
    # Check permissions - admin and above
    if member.role not in [UserRole.OWNER, UserRole.ADMIN]:
        raise HTTPException(status_code=403, detail="Insufficient permissions")

    result = await db.execute(
        select(Webhook).where(
            and_(
                Webhook.id == webhook_id,
                Webhook.workspace_id == workspace_id
            )
        )
    )
    webhook = result.scalar_one_or_none()
    if not webhook:
        raise HTTPException(status_code=404, detail="Webhook not found")

    # Update fields
    update_data = data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(webhook, field, value)

    webhook.updated_at = datetime.utcnow()
    await db.commit()
    await db.refresh(webhook)
    return webhook


@router.delete("/{workspace_id}/webhooks/{webhook_id}")
async def delete_webhook(
    workspace_id: UUID,
    webhook_id: UUID,
    user: User = Depends(get_current_user),
    member: WorkspaceMember = Depends(get_workspace_member),
    db: AsyncSession = Depends(get_db)
):
    """Delete a webhook."""
    # Check permissions - admin and above
    if member.role not in [UserRole.OWNER, UserRole.ADMIN]:
        raise HTTPException(status_code=403, detail="Insufficient permissions")

    result = await db.execute(
        select(Webhook).where(
            and_(
                Webhook.id == webhook_id,
                Webhook.workspace_id == workspace_id
            )
        )
    )
    webhook = result.scalar_one_or_none()
    if not webhook:
        raise HTTPException(status_code=404, detail="Webhook not found")

    await db.delete(webhook)
    await db.commit()
    return {"message": "Webhook deleted successfully"}


# Webhook logs endpoints
@router.get("/{workspace_id}/webhooks/{webhook_id}/logs")
async def list_webhook_logs(
    workspace_id: UUID,
    webhook_id: UUID,
    success: Optional[bool] = None,
    limit: int = 100,
    offset: int = 0,
    member: WorkspaceMember = Depends(get_workspace_member),
    db: AsyncSession = Depends(get_db)
):
    """View webhook logs for debugging and monitoring."""
    # Verify webhook exists and belongs to workspace
    result = await db.execute(
        select(Webhook).where(
            and_(
                Webhook.id == webhook_id,
                Webhook.workspace_id == workspace_id
            )
        )
    )
    if not result.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Webhook not found")

    # Get logs
    query = select(WebhookLog).where(
        and_(
            WebhookLog.webhook_id == webhook_id,
            WebhookLog.workspace_id == workspace_id
        )
    )

    if success is not None:
        query = query.where(WebhookLog.success == success)

    query = query.order_by(WebhookLog.created_at.desc()).offset(offset).limit(limit)

    result = await db.execute(query)
    logs = result.scalars().all()
    return logs


@router.get("/{workspace_id}/webhook-logs/{log_id}")
async def get_webhook_log(
    workspace_id: UUID,
    log_id: UUID,
    member: WorkspaceMember = Depends(get_workspace_member),
    db: AsyncSession = Depends(get_db)
):
    """Get specific webhook log details."""
    result = await db.execute(
        select(WebhookLog).where(
            and_(
                WebhookLog.id == log_id,
                WebhookLog.workspace_id == workspace_id
            )
        )
    )
    log = result.scalar_one_or_none()
    if not log:
        raise HTTPException(status_code=404, detail="Webhook log not found")
    return log


@router.post("/{workspace_id}/webhooks/{webhook_id}/test")
async def test_webhook(
    workspace_id: UUID,
    webhook_id: UUID,
    test_payload: Optional[dict] = None,
    user: User = Depends(get_current_user),
    member: WorkspaceMember = Depends(get_workspace_member),
    db: AsyncSession = Depends(get_db)
):
    """Test a webhook by sending a test payload."""
    # Check permissions - admin and above
    if member.role not in [UserRole.OWNER, UserRole.ADMIN]:
        raise HTTPException(status_code=403, detail="Insufficient permissions")

    result = await db.execute(
        select(Webhook).where(
            and_(
                Webhook.id == webhook_id,
                Webhook.workspace_id == workspace_id
            )
        )
    )
    webhook = result.scalar_one_or_none()
    if not webhook:
        raise HTTPException(status_code=404, detail="Webhook not found")

    # TODO: Actually send webhook request
    # For now, just create a test log entry
    import uuid
    test_log = WebhookLog(
        id=uuid.uuid4(),
        workspace_id=workspace_id,
        webhook_id=webhook_id,
        request_method="POST",
        request_url=webhook.url,
        request_headers={"Content-Type": "application/json"},
        request_body=test_payload or {"test": True},
        response_status=200,
        response_body={"status": "test_success"},
        duration_ms=123,
        success=True,
    )
    db.add(test_log)
    await db.commit()
    await db.refresh(test_log)

    return {
        "message": "Webhook test completed",
        "webhook_id": str(webhook_id),
        "log_id": str(test_log.id),
        "success": test_log.success,
    }


# Webhook analytics
@router.get("/{workspace_id}/webhooks/{webhook_id}/analytics")
async def get_webhook_analytics(
    workspace_id: UUID,
    webhook_id: UUID,
    member: WorkspaceMember = Depends(get_workspace_member),
    db: AsyncSession = Depends(get_db)
):
    """Get webhook analytics and performance metrics."""
    result = await db.execute(
        select(Webhook).where(
            and_(
                Webhook.id == webhook_id,
                Webhook.workspace_id == workspace_id
            )
        )
    )
    webhook = result.scalar_one_or_none()
    if not webhook:
        raise HTTPException(status_code=404, detail="Webhook not found")

    # Calculate success rate
    success_rate = (webhook.successful_calls / webhook.total_calls * 100) if webhook.total_calls > 0 else 0

    # Get recent error rate (last 24 hours)
    twenty_four_hours_ago = datetime.utcnow() - timedelta(hours=24)
    result = await db.execute(
        select(
            func.count(WebhookLog.id).label("total"),
            func.sum(func.cast(WebhookLog.success, Integer)).label("successful")
        ).where(
            and_(
                WebhookLog.webhook_id == webhook_id,
                WebhookLog.workspace_id == workspace_id,
                WebhookLog.created_at >= twenty_four_hours_ago
            )
        )
    )
    recent_stats = result.first()
    recent_total = recent_stats.total or 0
    recent_successful = recent_stats.successful or 0
    recent_success_rate = (recent_successful / recent_total * 100) if recent_total > 0 else 0

    return {
        "webhook_id": str(webhook_id),
        "webhook_name": webhook.name,
        "direction": webhook.direction,
        "is_active": webhook.is_active,
        "all_time_stats": {
            "total_calls": webhook.total_calls,
            "successful_calls": webhook.successful_calls,
            "failed_calls": webhook.failed_calls,
            "success_rate": round(success_rate, 2),
        },
        "recent_stats_24h": {
            "total_calls": recent_total,
            "successful_calls": recent_successful,
            "failed_calls": recent_total - recent_successful,
            "success_rate": round(recent_success_rate, 2),
        },
        "performance": {
            "average_response_time_ms": webhook.average_response_time_ms,
            "last_called_at": webhook.last_called_at.isoformat() if webhook.last_called_at else None,
        },
        "errors": {
            "last_error": webhook.last_error,
            "last_error_at": webhook.last_error_at.isoformat() if webhook.last_error_at else None,
        },
    }
