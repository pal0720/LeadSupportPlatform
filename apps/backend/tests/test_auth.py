"""
Tests for authentication endpoints and functionality.
"""
import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from core.auth import verify_password, get_password_hash, create_access_token, decode_token, validate_password_strength
from models.user import User


class TestPasswordHashing:
    """Tests for password hashing functionality."""

    def test_hash_password(self):
        """Test password hashing."""
        password = "TestPassword123!"
        hashed = get_password_hash(password)

        assert hashed != password
        assert len(hashed) > 0
        assert hashed.startswith("$2b$")  # bcrypt hash prefix

    def test_verify_password_correct(self):
        """Test password verification with correct password."""
        password = "TestPassword123!"
        hashed = get_password_hash(password)

        assert verify_password(password, hashed) is True

    def test_verify_password_incorrect(self):
        """Test password verification with incorrect password."""
        password = "TestPassword123!"
        hashed = get_password_hash(password)

        assert verify_password("WrongPassword123!", hashed) is False

    def test_password_strength_validation_valid(self):
        """Test password strength validation with valid password."""
        assert validate_password_strength("TestPassword123!") is True

    def test_password_strength_validation_too_short(self):
        """Test password strength validation with short password."""
        with pytest.raises(ValueError, match="at least 8 characters"):
            validate_password_strength("Test1!")

    def test_password_strength_validation_no_uppercase(self):
        """Test password strength validation without uppercase."""
        with pytest.raises(ValueError, match="uppercase letter"):
            validate_password_strength("testpassword123!")

    def test_password_strength_validation_no_lowercase(self):
        """Test password strength validation without lowercase."""
        with pytest.raises(ValueError, match="lowercase letter"):
            validate_password_strength("TESTPASSWORD123!")

    def test_password_strength_validation_no_digit(self):
        """Test password strength validation without digit."""
        with pytest.raises(ValueError, match="digit"):
            validate_password_strength("TestPassword!")

    def test_password_strength_validation_no_special(self):
        """Test password strength validation without special character."""
        with pytest.raises(ValueError, match="special character"):
            validate_password_strength("TestPassword123")


class TestJWTTokens:
    """Tests for JWT token generation and verification."""

    def test_create_access_token(self):
        """Test access token creation."""
        data = {"sub": "user123", "email": "test@example.com"}
        token = create_access_token(data)

        assert isinstance(token, str)
        assert len(token) > 0

    def test_decode_access_token(self):
        """Test access token decoding."""
        data = {"sub": "user123", "email": "test@example.com"}
        token = create_access_token(data)

        payload = decode_token(token)

        assert payload["sub"] == "user123"
        assert payload["email"] == "test@example.com"
        assert payload["type"] == "access"
        assert "exp" in payload

    def test_decode_invalid_token(self):
        """Test decoding invalid token."""
        from fastapi import HTTPException

        with pytest.raises(HTTPException) as exc_info:
            decode_token("invalid.token.here")

        assert exc_info.value.status_code == 401


@pytest.mark.asyncio
class TestUserRegistration:
    """Tests for user registration."""

    async def test_register_user_success(self, async_client: AsyncClient, db: AsyncSession, test_workspace):
        """Test successful user registration."""
        response = await async_client.post(
            "/api/v1/auth/register",
            json={
                "email": "newuser@example.com",
                "password": "NewPassword123!",
                "full_name": "New User",
                "workspace_slug": test_workspace.slug
            }
        )

        assert response.status_code == 201
        data = response.json()
        assert data["email"] == "newuser@example.com"
        assert data["full_name"] == "New User"
        assert "id" in data
        assert "hashed_password" not in data  # Should not expose password

    async def test_register_user_duplicate_email(
        self,
        async_client: AsyncClient,
        test_user: User,
        test_workspace
    ):
        """Test registration with duplicate email."""
        response = await async_client.post(
            "/api/v1/auth/register",
            json={
                "email": test_user.email,
                "password": "NewPassword123!",
                "full_name": "Duplicate User",
                "workspace_slug": test_workspace.slug
            }
        )

        assert response.status_code == 400
        assert "already registered" in response.json()["detail"].lower()

    async def test_register_user_weak_password(
        self,
        async_client: AsyncClient,
        test_workspace
    ):
        """Test registration with weak password."""
        response = await async_client.post(
            "/api/v1/auth/register",
            json={
                "email": "newuser@example.com",
                "password": "weak",
                "full_name": "New User",
                "workspace_slug": test_workspace.slug
            }
        )

        assert response.status_code == 422


@pytest.mark.asyncio
class TestUserLogin:
    """Tests for user login."""

    async def test_login_success(self, async_client: AsyncClient, test_user: User):
        """Test successful login."""
        response = await async_client.post(
            "/api/v1/auth/login",
            json={
                "email": test_user.email,
                "password": "TestPassword123!"
            }
        )

        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert "refresh_token" in data
        assert data["token_type"] == "bearer"

    async def test_login_incorrect_password(
        self,
        async_client: AsyncClient,
        test_user: User
    ):
        """Test login with incorrect password."""
        response = await async_client.post(
            "/api/v1/auth/login",
            json={
                "email": test_user.email,
                "password": "WrongPassword123!"
            }
        )

        assert response.status_code == 401
        assert "incorrect" in response.json()["detail"].lower()

    async def test_login_nonexistent_user(self, async_client: AsyncClient):
        """Test login with non-existent user."""
        response = await async_client.post(
            "/api/v1/auth/login",
            json={
                "email": "nonexistent@example.com",
                "password": "TestPassword123!"
            }
        )

        assert response.status_code == 401

    async def test_login_inactive_user(
        self,
        async_client: AsyncClient,
        db: AsyncSession,
        test_user: User
    ):
        """Test login with inactive user."""
        # Deactivate user
        test_user.is_active = False
        db.add(test_user)
        await db.commit()

        response = await async_client.post(
            "/api/v1/auth/login",
            json={
                "email": test_user.email,
                "password": "TestPassword123!"
            }
        )

        assert response.status_code == 401
        assert "inactive" in response.json()["detail"].lower()


@pytest.mark.asyncio
class TestTokenRefresh:
    """Tests for token refresh functionality."""

    async def test_refresh_token_success(
        self,
        async_client: AsyncClient,
        test_user: User
    ):
        """Test successful token refresh."""
        # First, login to get refresh token
        login_response = await async_client.post(
            "/api/v1/auth/login",
            json={
                "email": test_user.email,
                "password": "TestPassword123!"
            }
        )
        refresh_token = login_response.json()["refresh_token"]

        # Refresh the token
        response = await async_client.post(
            "/api/v1/auth/refresh",
            json={"refresh_token": refresh_token}
        )

        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"

    async def test_refresh_token_invalid(self, async_client: AsyncClient):
        """Test token refresh with invalid token."""
        response = await async_client.post(
            "/api/v1/auth/refresh",
            json={"refresh_token": "invalid.token.here"}
        )

        assert response.status_code == 401


@pytest.mark.asyncio
class TestProtectedEndpoints:
    """Tests for protected endpoint access."""

    async def test_access_protected_endpoint_with_token(
        self,
        async_client: AsyncClient,
        auth_headers: dict
    ):
        """Test accessing protected endpoint with valid token."""
        response = await async_client.get(
            "/api/v1/users/me",
            headers=auth_headers
        )

        assert response.status_code == 200
        data = response.json()
        assert "email" in data
        assert "id" in data

    async def test_access_protected_endpoint_without_token(
        self,
        async_client: AsyncClient
    ):
        """Test accessing protected endpoint without token."""
        response = await async_client.get("/api/v1/users/me")

        assert response.status_code == 403  # Forbidden or Unauthorized

    async def test_access_protected_endpoint_invalid_token(
        self,
        async_client: AsyncClient
    ):
        """Test accessing protected endpoint with invalid token."""
        response = await async_client.get(
            "/api/v1/users/me",
            headers={"Authorization": "Bearer invalid.token.here"}
        )

        assert response.status_code == 401


@pytest.mark.asyncio
class TestUserProfile:
    """Tests for user profile endpoints."""

    async def test_get_current_user(
        self,
        async_client: AsyncClient,
        auth_headers: dict,
        test_user: User
    ):
        """Test getting current user profile."""
        response = await async_client.get(
            "/api/v1/users/me",
            headers=auth_headers
        )

        assert response.status_code == 200
        data = response.json()
        assert data["email"] == test_user.email
        assert data["full_name"] == test_user.full_name
        assert data["id"] == str(test_user.id)

    async def test_update_user_profile(
        self,
        async_client: AsyncClient,
        auth_headers: dict
    ):
        """Test updating user profile."""
        response = await async_client.patch(
            "/api/v1/users/me",
            headers=auth_headers,
            json={
                "full_name": "Updated Name",
                "phone": "+1234567890"
            }
        )

        assert response.status_code == 200
        data = response.json()
        assert data["full_name"] == "Updated Name"
        assert data["phone"] == "+1234567890"

    async def test_change_password(
        self,
        async_client: AsyncClient,
        auth_headers: dict
    ):
        """Test password change."""
        response = await async_client.post(
            "/api/v1/users/me/change-password",
            headers=auth_headers,
            json={
                "current_password": "TestPassword123!",
                "new_password": "NewPassword456!"
            }
        )

        assert response.status_code == 200

        # Verify can login with new password
        login_response = await async_client.post(
            "/api/v1/auth/login",
            json={
                "email": "test@example.com",
                "password": "NewPassword456!"
            }
        )
        assert login_response.status_code == 200

    async def test_change_password_incorrect_current(
        self,
        async_client: AsyncClient,
        auth_headers: dict
    ):
        """Test password change with incorrect current password."""
        response = await async_client.post(
            "/api/v1/users/me/change-password",
            headers=auth_headers,
            json={
                "current_password": "WrongPassword123!",
                "new_password": "NewPassword456!"
            }
        )

        assert response.status_code == 400
