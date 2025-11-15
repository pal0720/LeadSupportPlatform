"""
Tests for AI agents endpoints and functionality.
"""
import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from models.workspace import Workspace
from models.ai_agent import AIAgent, AgentType, AgentStatus


@pytest.mark.asyncio
class TestAgentCreation:
    """Tests for AI agent creation."""

    async def test_create_agent_success(
        self,
        async_client: AsyncClient,
        auth_headers: dict,
        test_workspace: Workspace,
        sample_agent_data: dict
    ):
        """Test successful AI agent creation."""
        agent_data = sample_agent_data.copy()
        agent_data["workspace_id"] = str(test_workspace.id)

        response = await async_client.post(
            "/api/v1/ai-agents",
            headers=auth_headers,
            json=agent_data
        )

        assert response.status_code == 201
        data = response.json()
        assert data["name"] == agent_data["name"]
        assert data["agent_type"] == agent_data["agent_type"]
        assert data["is_enabled"] is True
        assert "id" in data

    async def test_create_agent_invalid_type(
        self,
        async_client: AsyncClient,
        auth_headers: dict,
        test_workspace: Workspace
    ):
        """Test creating agent with invalid type."""
        response = await async_client.post(
            "/api/v1/ai-agents",
            headers=auth_headers,
            json={
                "workspace_id": str(test_workspace.id),
                "agent_type": "invalid_type",
                "name": "Invalid Agent",
                "is_enabled": True
            }
        )

        assert response.status_code == 422


@pytest.mark.asyncio
class TestAgentRetrieval:
    """Tests for AI agent retrieval."""

    async def test_get_agents_list(
        self,
        async_client: AsyncClient,
        auth_headers: dict,
        test_workspace: Workspace,
        db: AsyncSession
    ):
        """Test getting list of workspace agents."""
        # Create a test agent
        agent = AIAgent(
            workspace_id=test_workspace.id,
            agent_type=AgentType.CONTENT,
            name="Test Agent",
            is_enabled=True,
        )
        db.add(agent)
        await db.commit()

        response = await async_client.get(
            f"/api/v1/ai-agents?workspace_id={test_workspace.id}",
            headers=auth_headers
        )

        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) >= 1

    async def test_get_agent_by_id(
        self,
        async_client: AsyncClient,
        auth_headers: dict,
        test_workspace: Workspace,
        db: AsyncSession
    ):
        """Test getting specific agent by ID."""
        # Create a test agent
        agent = AIAgent(
            workspace_id=test_workspace.id,
            agent_type=AgentType.MARKETING,
            name="Marketing Agent",
            is_enabled=True,
        )
        db.add(agent)
        await db.commit()
        await db.refresh(agent)

        response = await async_client.get(
            f"/api/v1/ai-agents/{agent.id}",
            headers=auth_headers
        )

        assert response.status_code == 200
        data = response.json()
        assert data["id"] == str(agent.id)
        assert data["name"] == "Marketing Agent"

    async def test_get_agents_by_type(
        self,
        async_client: AsyncClient,
        auth_headers: dict,
        test_workspace: Workspace,
        db: AsyncSession
    ):
        """Test filtering agents by type."""
        # Create agents of different types
        agent1 = AIAgent(
            workspace_id=test_workspace.id,
            agent_type=AgentType.CONTENT,
            name="Content Agent",
            is_enabled=True,
        )
        agent2 = AIAgent(
            workspace_id=test_workspace.id,
            agent_type=AgentType.SUPPORT,
            name="Support Agent",
            is_enabled=True,
        )
        db.add_all([agent1, agent2])
        await db.commit()

        response = await async_client.get(
            f"/api/v1/ai-agents?workspace_id={test_workspace.id}&agent_type=content",
            headers=auth_headers
        )

        assert response.status_code == 200
        data = response.json()
        assert all(agent["agent_type"] == "content" for agent in data)


@pytest.mark.asyncio
class TestAgentUpdate:
    """Tests for AI agent updates."""

    async def test_update_agent_success(
        self,
        async_client: AsyncClient,
        auth_headers: dict,
        test_workspace: Workspace,
        db: AsyncSession
    ):
        """Test successful agent update."""
        # Create agent
        agent = AIAgent(
            workspace_id=test_workspace.id,
            agent_type=AgentType.LEAD_GEN,
            name="Lead Gen Agent",
            is_enabled=True,
            temperature=0.7,
        )
        db.add(agent)
        await db.commit()
        await db.refresh(agent)

        response = await async_client.patch(
            f"/api/v1/ai-agents/{agent.id}",
            headers=auth_headers,
            json={
                "name": "Updated Lead Gen Agent",
                "temperature": 0.9,
                "system_prompt": "You are a helpful lead generation assistant."
            }
        )

        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "Updated Lead Gen Agent"
        assert data["temperature"] == 0.9
        assert data["system_prompt"] == "You are a helpful lead generation assistant."

    async def test_disable_agent(
        self,
        async_client: AsyncClient,
        auth_headers: dict,
        test_workspace: Workspace,
        db: AsyncSession
    ):
        """Test disabling an agent."""
        agent = AIAgent(
            workspace_id=test_workspace.id,
            agent_type=AgentType.ANALYTICS,
            name="Analytics Agent",
            is_enabled=True,
        )
        db.add(agent)
        await db.commit()
        await db.refresh(agent)

        response = await async_client.patch(
            f"/api/v1/ai-agents/{agent.id}",
            headers=auth_headers,
            json={"is_enabled": False}
        )

        assert response.status_code == 200
        data = response.json()
        assert data["is_enabled"] is False


@pytest.mark.asyncio
class TestAgentTasks:
    """Tests for AI agent task management."""

    async def test_create_task_for_agent(
        self,
        async_client: AsyncClient,
        auth_headers: dict,
        test_workspace: Workspace,
        db: AsyncSession
    ):
        """Test creating a task for an agent."""
        # Create agent
        agent = AIAgent(
            workspace_id=test_workspace.id,
            agent_type=AgentType.CONTENT,
            name="Content Agent",
            is_enabled=True,
        )
        db.add(agent)
        await db.commit()
        await db.refresh(agent)

        response = await async_client.post(
            f"/api/v1/ai-agents/{agent.id}/tasks",
            headers=auth_headers,
            json={
                "task_type": "generate_email",
                "title": "Generate welcome email",
                "description": "Create a welcome email for new customers",
                "input_data": {
                    "recipient": "customer@example.com",
                    "product": "GTM Platform"
                },
                "priority": 50
            }
        )

        assert response.status_code == 201
        data = response.json()
        assert data["task_type"] == "generate_email"
        assert data["status"] == "pending"
        assert "id" in data

    async def test_get_agent_tasks(
        self,
        async_client: AsyncClient,
        auth_headers: dict,
        test_workspace: Workspace,
        db: AsyncSession
    ):
        """Test getting tasks for an agent."""
        from models.ai_agent import AgentTask
        import uuid

        # Create agent and task
        agent = AIAgent(
            workspace_id=test_workspace.id,
            agent_type=AgentType.CONTENT,
            name="Content Agent",
            is_enabled=True,
        )
        db.add(agent)
        await db.commit()
        await db.refresh(agent)

        task = AgentTask(
            workspace_id=test_workspace.id,
            agent_id=agent.id,
            agent_type=AgentType.CONTENT,
            task_type="generate_content",
            title="Test Task",
            status="pending",
        )
        db.add(task)
        await db.commit()

        response = await async_client.get(
            f"/api/v1/ai-agents/{agent.id}/tasks",
            headers=auth_headers
        )

        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) >= 1

    async def test_update_task_status(
        self,
        async_client: AsyncClient,
        auth_headers: dict,
        test_workspace: Workspace,
        db: AsyncSession
    ):
        """Test updating task status."""
        from models.ai_agent import AgentTask

        # Create agent and task
        agent = AIAgent(
            workspace_id=test_workspace.id,
            agent_type=AgentType.CONTENT,
            name="Content Agent",
            is_enabled=True,
        )
        db.add(agent)
        await db.commit()
        await db.refresh(agent)

        task = AgentTask(
            workspace_id=test_workspace.id,
            agent_id=agent.id,
            agent_type=AgentType.CONTENT,
            task_type="generate_content",
            title="Test Task",
            status="pending",
        )
        db.add(task)
        await db.commit()
        await db.refresh(task)

        response = await async_client.patch(
            f"/api/v1/ai-agents/tasks/{task.id}",
            headers=auth_headers,
            json={
                "status": "completed",
                "output_data": {"result": "Task completed successfully"}
            }
        )

        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "completed"
        assert "result" in data["output_data"]


@pytest.mark.asyncio
class TestAgentConversations:
    """Tests for AI agent conversations."""

    async def test_create_conversation(
        self,
        async_client: AsyncClient,
        auth_headers: dict,
        test_workspace: Workspace,
        db: AsyncSession
    ):
        """Test creating a conversation with an agent."""
        # Create agent
        agent = AIAgent(
            workspace_id=test_workspace.id,
            agent_type=AgentType.SUPPORT,
            name="Support Agent",
            is_enabled=True,
        )
        db.add(agent)
        await db.commit()
        await db.refresh(agent)

        response = await async_client.post(
            f"/api/v1/ai-agents/{agent.id}/conversations",
            headers=auth_headers,
            json={
                "title": "Customer Support Inquiry",
                "channel": "chat",
                "initial_message": "I need help with my account"
            }
        )

        assert response.status_code == 201
        data = response.json()
        assert data["title"] == "Customer Support Inquiry"
        assert data["is_active"] is True
        assert "id" in data

    async def test_send_message_to_agent(
        self,
        async_client: AsyncClient,
        auth_headers: dict,
        test_workspace: Workspace,
        db: AsyncSession
    ):
        """Test sending message to agent conversation."""
        from models.ai_agent import AgentConversation

        # Create agent
        agent = AIAgent(
            workspace_id=test_workspace.id,
            agent_type=AgentType.SUPPORT,
            name="Support Agent",
            is_enabled=True,
        )
        db.add(agent)
        await db.commit()
        await db.refresh(agent)

        # Create conversation
        conversation = AgentConversation(
            workspace_id=test_workspace.id,
            agent_id=agent.id,
            title="Test Conversation",
            channel="chat",
            messages=[],
        )
        db.add(conversation)
        await db.commit()
        await db.refresh(conversation)

        response = await async_client.post(
            f"/api/v1/ai-agents/conversations/{conversation.id}/messages",
            headers=auth_headers,
            json={
                "content": "What are your business hours?",
                "role": "user"
            }
        )

        assert response.status_code == 201
        data = response.json()
        assert "content" in data
        assert "role" in data


@pytest.mark.asyncio
class TestAgentKnowledge:
    """Tests for AI agent knowledge base."""

    async def test_add_knowledge_item(
        self,
        async_client: AsyncClient,
        auth_headers: dict,
        test_workspace: Workspace
    ):
        """Test adding item to knowledge base."""
        response = await async_client.post(
            "/api/v1/ai-agents/knowledge",
            headers=auth_headers,
            json={
                "workspace_id": str(test_workspace.id),
                "knowledge_type": "faq",
                "title": "How to reset password",
                "content": "To reset your password, click 'Forgot Password' on the login page.",
                "category": "account",
                "tags": ["password", "security", "account"]
            }
        )

        assert response.status_code == 201
        data = response.json()
        assert data["title"] == "How to reset password"
        assert "password" in data["tags"]

    async def test_search_knowledge_base(
        self,
        async_client: AsyncClient,
        auth_headers: dict,
        test_workspace: Workspace,
        db: AsyncSession
    ):
        """Test searching knowledge base."""
        from models.ai_agent import AgentKnowledge

        # Add knowledge items
        knowledge = AgentKnowledge(
            workspace_id=test_workspace.id,
            knowledge_type="faq",
            title="Password Reset Guide",
            content="Step-by-step guide to reset password",
            category="security",
            tags=["password", "security"],
        )
        db.add(knowledge)
        await db.commit()

        response = await async_client.get(
            f"/api/v1/ai-agents/knowledge/search?workspace_id={test_workspace.id}&q=password",
            headers=auth_headers
        )

        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) >= 1


@pytest.mark.asyncio
class TestAgentDeletion:
    """Tests for AI agent deletion."""

    async def test_delete_agent_success(
        self,
        async_client: AsyncClient,
        auth_headers: dict,
        test_workspace: Workspace,
        db: AsyncSession
    ):
        """Test successful agent deletion."""
        agent = AIAgent(
            workspace_id=test_workspace.id,
            agent_type=AgentType.CONTENT,
            name="Agent to Delete",
            is_enabled=True,
        )
        db.add(agent)
        await db.commit()
        await db.refresh(agent)

        response = await async_client.delete(
            f"/api/v1/ai-agents/{agent.id}",
            headers=auth_headers
        )

        assert response.status_code == 204

    async def test_delete_agent_with_active_tasks(
        self,
        async_client: AsyncClient,
        auth_headers: dict,
        test_workspace: Workspace,
        db: AsyncSession
    ):
        """Test deleting agent with active tasks (should fail or cascade)."""
        from models.ai_agent import AgentTask

        agent = AIAgent(
            workspace_id=test_workspace.id,
            agent_type=AgentType.CONTENT,
            name="Agent with Tasks",
            is_enabled=True,
        )
        db.add(agent)
        await db.commit()
        await db.refresh(agent)

        # Create active task
        task = AgentTask(
            workspace_id=test_workspace.id,
            agent_id=agent.id,
            agent_type=AgentType.CONTENT,
            task_type="generate_content",
            title="Active Task",
            status="running",
        )
        db.add(task)
        await db.commit()

        response = await async_client.delete(
            f"/api/v1/ai-agents/{agent.id}",
            headers=auth_headers
        )

        # Should either fail (400/409) or succeed with cascade
        assert response.status_code in [204, 400, 409]
