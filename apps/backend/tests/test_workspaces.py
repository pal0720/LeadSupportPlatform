"""
Tests for workspace management endpoints.
"""
import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from models.user import User
from models.workspace import Workspace, UserRole


@pytest.mark.asyncio
class TestWorkspaceCreation:
    """Tests for workspace creation."""

    async def test_create_workspace_success(
        self,
        async_client: AsyncClient,
        auth_headers: dict
    ):
        """Test successful workspace creation."""
        response = await async_client.post(
            "/api/v1/workspaces",
            headers=auth_headers,
            json={
                "name": "New Workspace",
                "slug": "new-workspace",
                "subscription_tier": "professional"
            }
        )

        assert response.status_code == 201
        data = response.json()
        assert data["name"] == "New Workspace"
        assert data["slug"] == "new-workspace"
        assert data["subscription_tier"] == "professional"
        assert "id" in data

    async def test_create_workspace_duplicate_slug(
        self,
        async_client: AsyncClient,
        auth_headers: dict,
        test_workspace: Workspace
    ):
        """Test creating workspace with duplicate slug."""
        response = await async_client.post(
            "/api/v1/workspaces",
            headers=auth_headers,
            json={
                "name": "Another Workspace",
                "slug": test_workspace.slug,
                "subscription_tier": "starter"
            }
        )

        assert response.status_code == 400
        assert "already exists" in response.json()["detail"].lower()

    async def test_create_workspace_invalid_slug(
        self,
        async_client: AsyncClient,
        auth_headers: dict
    ):
        """Test creating workspace with invalid slug."""
        response = await async_client.post(
            "/api/v1/workspaces",
            headers=auth_headers,
            json={
                "name": "Test Workspace",
                "slug": "invalid slug!",
                "subscription_tier": "free"
            }
        )

        assert response.status_code == 422


@pytest.mark.asyncio
class TestWorkspaceRetrieval:
    """Tests for workspace retrieval."""

    async def test_get_workspaces_list(
        self,
        async_client: AsyncClient,
        auth_headers: dict,
        test_workspace: Workspace
    ):
        """Test getting list of user's workspaces."""
        response = await async_client.get(
            "/api/v1/workspaces",
            headers=auth_headers
        )

        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) >= 1
        assert data[0]["id"] == str(test_workspace.id)

    async def test_get_workspace_by_id(
        self,
        async_client: AsyncClient,
        auth_headers: dict,
        test_workspace: Workspace
    ):
        """Test getting workspace by ID."""
        response = await async_client.get(
            f"/api/v1/workspaces/{test_workspace.id}",
            headers=auth_headers
        )

        assert response.status_code == 200
        data = response.json()
        assert data["id"] == str(test_workspace.id)
        assert data["name"] == test_workspace.name

    async def test_get_workspace_unauthorized(
        self,
        async_client: AsyncClient,
        test_workspace: Workspace
    ):
        """Test getting workspace without authentication."""
        response = await async_client.get(
            f"/api/v1/workspaces/{test_workspace.id}"
        )

        assert response.status_code in [401, 403]


@pytest.mark.asyncio
class TestWorkspaceUpdate:
    """Tests for workspace updates."""

    async def test_update_workspace_success(
        self,
        async_client: AsyncClient,
        auth_headers: dict,
        test_workspace: Workspace
    ):
        """Test successful workspace update."""
        response = await async_client.patch(
            f"/api/v1/workspaces/{test_workspace.id}",
            headers=auth_headers,
            json={
                "name": "Updated Workspace Name",
                "timezone": "America/New_York"
            }
        )

        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "Updated Workspace Name"
        assert data["timezone"] == "America/New_York"

    async def test_update_workspace_brand_kit(
        self,
        async_client: AsyncClient,
        auth_headers: dict,
        test_workspace: Workspace
    ):
        """Test updating workspace brand kit."""
        response = await async_client.patch(
            f"/api/v1/workspaces/{test_workspace.id}",
            headers=auth_headers,
            json={
                "brand_colors": {
                    "primary": "#FF5733",
                    "secondary": "#3366FF"
                },
                "brand_voice": "Professional and friendly"
            }
        )

        assert response.status_code == 200
        data = response.json()
        assert data["brand_colors"]["primary"] == "#FF5733"
        assert data["brand_voice"] == "Professional and friendly"


@pytest.mark.asyncio
class TestWorkspaceMembers:
    """Tests for workspace member management."""

    async def test_get_workspace_members(
        self,
        async_client: AsyncClient,
        auth_headers: dict,
        test_workspace: Workspace,
        test_user: User
    ):
        """Test getting workspace members."""
        response = await async_client.get(
            f"/api/v1/workspaces/{test_workspace.id}/members",
            headers=auth_headers
        )

        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) >= 1

    async def test_invite_workspace_member(
        self,
        async_client: AsyncClient,
        auth_headers: dict,
        test_workspace: Workspace
    ):
        """Test inviting a new member to workspace."""
        response = await async_client.post(
            f"/api/v1/workspaces/{test_workspace.id}/members",
            headers=auth_headers,
            json={
                "email": "newmember@example.com",
                "role": "sales_rep",
                "full_name": "New Member"
            }
        )

        assert response.status_code == 201
        data = response.json()
        assert data["email"] == "newmember@example.com"
        assert data["role"] == "sales_rep"

    async def test_update_member_role(
        self,
        async_client: AsyncClient,
        auth_headers: dict,
        test_workspace: Workspace,
        test_user2: User
    ):
        """Test updating workspace member role."""
        response = await async_client.patch(
            f"/api/v1/workspaces/{test_workspace.id}/members/{test_user2.id}",
            headers=auth_headers,
            json={"role": "admin"}
        )

        assert response.status_code == 200
        data = response.json()
        assert data["role"] == "admin"

    async def test_remove_workspace_member(
        self,
        async_client: AsyncClient,
        auth_headers: dict,
        test_workspace: Workspace,
        test_user2: User
    ):
        """Test removing member from workspace."""
        response = await async_client.delete(
            f"/api/v1/workspaces/{test_workspace.id}/members/{test_user2.id}",
            headers=auth_headers
        )

        assert response.status_code == 204


@pytest.mark.asyncio
class TestWorkspaceRoles:
    """Tests for role-based permissions in workspaces."""

    async def test_admin_can_update_workspace(
        self,
        async_client: AsyncClient,
        auth_headers: dict,
        test_workspace: Workspace
    ):
        """Test that admin can update workspace."""
        response = await async_client.patch(
            f"/api/v1/workspaces/{test_workspace.id}",
            headers=auth_headers,
            json={"name": "Admin Updated"}
        )

        assert response.status_code == 200

    async def test_sales_rep_cannot_update_workspace(
        self,
        async_client: AsyncClient,
        test_workspace: Workspace,
        test_user2: User
    ):
        """Test that sales rep cannot update workspace settings."""
        # Create token for sales rep user
        from core.auth import create_access_token
        token = create_access_token({"sub": str(test_user2.id)})
        headers = {"Authorization": f"Bearer {token}"}

        response = await async_client.patch(
            f"/api/v1/workspaces/{test_workspace.id}",
            headers=headers,
            json={"name": "Sales Rep Update"}
        )

        assert response.status_code == 403

    async def test_guest_has_read_only_access(
        self,
        async_client: AsyncClient,
        db: AsyncSession,
        test_workspace: Workspace
    ):
        """Test that guest users have read-only access."""
        # Create a guest user
        from models.user import User
        from models.workspace import WorkspaceMember
        from core.auth import get_password_hash, create_access_token
        import uuid

        guest = User(
            id=uuid.uuid4(),
            email="guest@example.com",
            hashed_password=get_password_hash("GuestPass123!"),
            full_name="Guest User",
            is_active=True,
        )
        db.add(guest)
        await db.commit()

        # Add as guest to workspace
        member = WorkspaceMember(
            workspace_id=test_workspace.id,
            user_id=guest.id,
            role=UserRole.GUEST,
            is_active=True,
        )
        db.add(member)
        await db.commit()

        # Create token for guest
        token = create_access_token({"sub": str(guest.id)})
        headers = {"Authorization": f"Bearer {token}"}

        # Guest can read
        response = await async_client.get(
            f"/api/v1/workspaces/{test_workspace.id}",
            headers=headers
        )
        assert response.status_code == 200

        # Guest cannot update
        response = await async_client.patch(
            f"/api/v1/workspaces/{test_workspace.id}",
            headers=headers,
            json={"name": "Guest Update"}
        )
        assert response.status_code == 403


@pytest.mark.asyncio
class TestWorkspaceDeletion:
    """Tests for workspace deletion."""

    async def test_delete_workspace_success(
        self,
        async_client: AsyncClient,
        auth_headers: dict,
        db: AsyncSession
    ):
        """Test successful workspace deletion (soft delete)."""
        # Create a workspace to delete
        from models.workspace import Workspace, SubscriptionTier, WorkspaceStatus
        import uuid

        workspace = Workspace(
            id=uuid.uuid4(),
            name="Workspace to Delete",
            slug="workspace-to-delete",
            subscription_tier=SubscriptionTier.FREE,
            status=WorkspaceStatus.ACTIVE,
        )
        db.add(workspace)
        await db.commit()

        response = await async_client.delete(
            f"/api/v1/workspaces/{workspace.id}",
            headers=auth_headers
        )

        assert response.status_code == 204

    async def test_delete_workspace_unauthorized(
        self,
        async_client: AsyncClient,
        test_workspace: Workspace,
        test_user2: User
    ):
        """Test that non-admin cannot delete workspace."""
        from core.auth import create_access_token
        token = create_access_token({"sub": str(test_user2.id)})
        headers = {"Authorization": f"Bearer {token}"}

        response = await async_client.delete(
            f"/api/v1/workspaces/{test_workspace.id}",
            headers=headers
        )

        assert response.status_code == 403


@pytest.mark.asyncio
class TestWorkspaceUsageLimits:
    """Tests for workspace usage limits."""

    async def test_check_user_limit(
        self,
        async_client: AsyncClient,
        auth_headers: dict,
        test_workspace: Workspace
    ):
        """Test workspace user limit enforcement."""
        # Set low user limit
        test_workspace.max_users = 2
        test_workspace.current_users = 2

        response = await async_client.post(
            f"/api/v1/workspaces/{test_workspace.id}/members",
            headers=auth_headers,
            json={
                "email": "overlimit@example.com",
                "role": "sales_rep",
                "full_name": "Over Limit"
            }
        )

        assert response.status_code == 403
        assert "limit" in response.json()["detail"].lower()

    async def test_check_ai_request_limit(
        self,
        async_client: AsyncClient,
        auth_headers: dict,
        test_workspace: Workspace
    ):
        """Test AI request limit enforcement."""
        # Set AI request to limit
        test_workspace.max_ai_requests_per_month = 100
        test_workspace.ai_requests_this_month = 100

        response = await async_client.post(
            f"/api/v1/ai/generate",
            headers=auth_headers,
            json={
                "workspace_id": str(test_workspace.id),
                "prompt": "Generate content",
                "type": "email"
            }
        )

        # Should return 429 or 403 indicating limit reached
        assert response.status_code in [403, 429]
