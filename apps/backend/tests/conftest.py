"""
Pytest configuration and fixtures for testing.
"""
import asyncio
import pytest
import uuid
from typing import AsyncGenerator, Generator
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.pool import NullPool

from main import app
from core.database import Base, get_db
from core.auth import get_password_hash, create_access_token
from models.user import User
from models.workspace import Workspace, WorkspaceMember, UserRole, SubscriptionTier, WorkspaceStatus

# Test database URL (use separate test database)
TEST_DATABASE_URL = "postgresql+asyncpg://postgres:postgres@localhost:5432/gtm_platform_test"


@pytest.fixture(scope="session")
def event_loop() -> Generator:
    """
    Create an event loop for the test session.
    """
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest.fixture(scope="session")
async def engine():
    """
    Create a test database engine.
    """
    engine = create_async_engine(
        TEST_DATABASE_URL,
        echo=False,
        poolclass=NullPool,
    )

    # Create all tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)

    yield engine

    # Cleanup
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)

    await engine.dispose()


@pytest.fixture(scope="function")
async def db(engine) -> AsyncGenerator[AsyncSession, None]:
    """
    Create a test database session.
    Rolls back after each test.
    """
    # Create session factory
    async_session_maker = async_sessionmaker(
        engine,
        class_=AsyncSession,
        expire_on_commit=False,
    )

    async with async_session_maker() as session:
        # Start a transaction
        async with session.begin():
            yield session
            # Rollback after test
            await session.rollback()


@pytest.fixture(scope="function")
async def async_client(db: AsyncSession) -> AsyncGenerator[AsyncClient, None]:
    """
    Create an async HTTP client for testing.
    """
    # Override the get_db dependency
    async def override_get_db():
        yield db

    app.dependency_overrides[get_db] = override_get_db

    async with AsyncClient(app=app, base_url="http://test") as client:
        yield client

    # Clear overrides
    app.dependency_overrides.clear()


@pytest.fixture
async def test_workspace(db: AsyncSession) -> Workspace:
    """
    Create a test workspace.
    """
    workspace = Workspace(
        id=uuid.uuid4(),
        name="Test Workspace",
        slug="test-workspace",
        subscription_tier=SubscriptionTier.PROFESSIONAL,
        status=WorkspaceStatus.ACTIVE,
        max_users=10,
        max_contacts=10000,
        max_ai_requests_per_month=1000,
    )
    db.add(workspace)
    await db.commit()
    await db.refresh(workspace)
    return workspace


@pytest.fixture
async def test_user(db: AsyncSession, test_workspace: Workspace) -> User:
    """
    Create a test user.
    """
    user = User(
        id=uuid.uuid4(),
        email="test@example.com",
        hashed_password=get_password_hash("TestPassword123!"),
        full_name="Test User",
        is_active=True,
        is_verified=True,
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)

    # Add user to workspace
    member = WorkspaceMember(
        workspace_id=test_workspace.id,
        user_id=user.id,
        role=UserRole.ADMIN,
        is_active=True,
    )
    db.add(member)
    await db.commit()

    return user


@pytest.fixture
async def test_user_token(test_user: User) -> str:
    """
    Create a JWT token for the test user.
    """
    token_data = {
        "sub": str(test_user.id),
        "email": test_user.email,
        "type": "access"
    }
    return create_access_token(token_data)


@pytest.fixture
async def test_user2(db: AsyncSession, test_workspace: Workspace) -> User:
    """
    Create a second test user (for multi-user tests).
    """
    user = User(
        id=uuid.uuid4(),
        email="test2@example.com",
        hashed_password=get_password_hash("TestPassword123!"),
        full_name="Test User 2",
        is_active=True,
        is_verified=True,
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)

    # Add user to workspace with different role
    member = WorkspaceMember(
        workspace_id=test_workspace.id,
        user_id=user.id,
        role=UserRole.SALES_REP,
        is_active=True,
    )
    db.add(member)
    await db.commit()

    return user


@pytest.fixture
def auth_headers(test_user_token: str) -> dict:
    """
    Create authorization headers for authenticated requests.
    """
    return {"Authorization": f"Bearer {test_user_token}"}


@pytest.fixture(autouse=True)
async def clear_database(db: AsyncSession):
    """
    Clear database before each test (except fixtures).
    This ensures test isolation.
    """
    # This runs before each test
    yield
    # Cleanup after test - rollback is handled by db fixture


@pytest.fixture
def sample_lead_data() -> dict:
    """
    Sample lead data for testing.
    """
    return {
        "email": "lead@company.com",
        "first_name": "John",
        "last_name": "Doe",
        "company": "Acme Corp",
        "title": "CTO",
        "status": "new",
    }


@pytest.fixture
def sample_deal_data() -> dict:
    """
    Sample deal data for testing.
    """
    return {
        "name": "Enterprise Deal - Acme Corp",
        "amount": 50000.0,
        "currency": "USD",
        "stage": "prospecting",
        "priority": "high",
        "probability": 30,
    }


@pytest.fixture
def sample_agent_data() -> dict:
    """
    Sample AI agent data for testing.
    """
    return {
        "agent_type": "content",
        "name": "Content Generator",
        "description": "AI agent for generating marketing content",
        "is_enabled": True,
        "model": "gpt-4-turbo-preview",
        "temperature": 0.7,
    }


# Helper functions for tests
def assert_valid_uuid(value: str):
    """Assert that a string is a valid UUID."""
    try:
        uuid.UUID(value)
    except (ValueError, TypeError, AttributeError):
        pytest.fail(f"'{value}' is not a valid UUID")


def assert_valid_datetime(value: str):
    """Assert that a string is a valid ISO datetime."""
    from datetime import datetime
    try:
        datetime.fromisoformat(value.replace('Z', '+00:00'))
    except (ValueError, TypeError, AttributeError):
        pytest.fail(f"'{value}' is not a valid ISO datetime")
