"""
Tests for CRM deals and pipeline management.
"""
import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime, timedelta

from models.workspace import Workspace
from models.deal import Deal, DealStage, DealPriority, Pipeline, Activity, Note


@pytest.mark.asyncio
class TestDealCreation:
    """Tests for deal creation."""

    async def test_create_deal_success(
        self,
        async_client: AsyncClient,
        auth_headers: dict,
        test_workspace: Workspace,
        sample_deal_data: dict
    ):
        """Test successful deal creation."""
        deal_data = sample_deal_data.copy()
        deal_data["workspace_id"] = str(test_workspace.id)

        response = await async_client.post(
            "/api/v1/deals",
            headers=auth_headers,
            json=deal_data
        )

        assert response.status_code == 201
        data = response.json()
        assert data["name"] == deal_data["name"]
        assert data["amount"] == deal_data["amount"]
        assert data["stage"] == deal_data["stage"]
        assert "id" in data

    async def test_create_deal_minimal_data(
        self,
        async_client: AsyncClient,
        auth_headers: dict,
        test_workspace: Workspace
    ):
        """Test creating deal with minimal required data."""
        response = await async_client.post(
            "/api/v1/deals",
            headers=auth_headers,
            json={
                "workspace_id": str(test_workspace.id),
                "name": "Simple Deal",
                "stage": "prospecting"
            }
        )

        assert response.status_code == 201
        data = response.json()
        assert data["name"] == "Simple Deal"
        assert data["stage"] == "prospecting"


@pytest.mark.asyncio
class TestDealRetrieval:
    """Tests for deal retrieval."""

    async def test_get_deals_list(
        self,
        async_client: AsyncClient,
        auth_headers: dict,
        test_workspace: Workspace,
        db: AsyncSession
    ):
        """Test getting list of deals."""
        # Create test deals
        deal1 = Deal(
            workspace_id=test_workspace.id,
            name="Deal 1",
            stage=DealStage.PROSPECTING,
            amount=10000.0,
        )
        deal2 = Deal(
            workspace_id=test_workspace.id,
            name="Deal 2",
            stage=DealStage.PROPOSAL,
            amount=25000.0,
        )
        db.add_all([deal1, deal2])
        await db.commit()

        response = await async_client.get(
            f"/api/v1/deals?workspace_id={test_workspace.id}",
            headers=auth_headers
        )

        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) >= 2

    async def test_get_deal_by_id(
        self,
        async_client: AsyncClient,
        auth_headers: dict,
        test_workspace: Workspace,
        db: AsyncSession
    ):
        """Test getting specific deal by ID."""
        deal = Deal(
            workspace_id=test_workspace.id,
            name="Specific Deal",
            stage=DealStage.NEGOTIATION,
            amount=50000.0,
        )
        db.add(deal)
        await db.commit()
        await db.refresh(deal)

        response = await async_client.get(
            f"/api/v1/deals/{deal.id}",
            headers=auth_headers
        )

        assert response.status_code == 200
        data = response.json()
        assert data["id"] == str(deal.id)
        assert data["name"] == "Specific Deal"

    async def test_filter_deals_by_stage(
        self,
        async_client: AsyncClient,
        auth_headers: dict,
        test_workspace: Workspace,
        db: AsyncSession
    ):
        """Test filtering deals by stage."""
        # Create deals in different stages
        deal1 = Deal(
            workspace_id=test_workspace.id,
            name="Prospecting Deal",
            stage=DealStage.PROSPECTING,
        )
        deal2 = Deal(
            workspace_id=test_workspace.id,
            name="Negotiation Deal",
            stage=DealStage.NEGOTIATION,
        )
        db.add_all([deal1, deal2])
        await db.commit()

        response = await async_client.get(
            f"/api/v1/deals?workspace_id={test_workspace.id}&stage=prospecting",
            headers=auth_headers
        )

        assert response.status_code == 200
        data = response.json()
        assert all(deal["stage"] == "prospecting" for deal in data)

    async def test_filter_deals_by_priority(
        self,
        async_client: AsyncClient,
        auth_headers: dict,
        test_workspace: Workspace,
        db: AsyncSession
    ):
        """Test filtering deals by priority."""
        deal = Deal(
            workspace_id=test_workspace.id,
            name="High Priority Deal",
            stage=DealStage.PROPOSAL,
            priority=DealPriority.HIGH,
        )
        db.add(deal)
        await db.commit()

        response = await async_client.get(
            f"/api/v1/deals?workspace_id={test_workspace.id}&priority=high",
            headers=auth_headers
        )

        assert response.status_code == 200
        data = response.json()
        assert all(deal["priority"] == "high" for deal in data)


@pytest.mark.asyncio
class TestDealUpdate:
    """Tests for deal updates."""

    async def test_update_deal_success(
        self,
        async_client: AsyncClient,
        auth_headers: dict,
        test_workspace: Workspace,
        db: AsyncSession
    ):
        """Test successful deal update."""
        deal = Deal(
            workspace_id=test_workspace.id,
            name="Deal to Update",
            stage=DealStage.PROSPECTING,
            amount=10000.0,
        )
        db.add(deal)
        await db.commit()
        await db.refresh(deal)

        response = await async_client.patch(
            f"/api/v1/deals/{deal.id}",
            headers=auth_headers,
            json={
                "name": "Updated Deal Name",
                "amount": 15000.0,
                "stage": "qualification"
            }
        )

        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "Updated Deal Name"
        assert data["amount"] == 15000.0
        assert data["stage"] == "qualification"

    async def test_move_deal_to_next_stage(
        self,
        async_client: AsyncClient,
        auth_headers: dict,
        test_workspace: Workspace,
        db: AsyncSession
    ):
        """Test moving deal through pipeline stages."""
        deal = Deal(
            workspace_id=test_workspace.id,
            name="Pipeline Deal",
            stage=DealStage.PROSPECTING,
        )
        db.add(deal)
        await db.commit()
        await db.refresh(deal)

        # Move to qualification
        response = await async_client.patch(
            f"/api/v1/deals/{deal.id}",
            headers=auth_headers,
            json={"stage": "qualification"}
        )
        assert response.status_code == 200
        assert response.json()["stage"] == "qualification"

        # Move to proposal
        response = await async_client.patch(
            f"/api/v1/deals/{deal.id}",
            headers=auth_headers,
            json={"stage": "proposal"}
        )
        assert response.status_code == 200
        assert response.json()["stage"] == "proposal"

    async def test_close_deal_won(
        self,
        async_client: AsyncClient,
        auth_headers: dict,
        test_workspace: Workspace,
        db: AsyncSession
    ):
        """Test closing deal as won."""
        deal = Deal(
            workspace_id=test_workspace.id,
            name="Winning Deal",
            stage=DealStage.NEGOTIATION,
            amount=100000.0,
        )
        db.add(deal)
        await db.commit()
        await db.refresh(deal)

        response = await async_client.patch(
            f"/api/v1/deals/{deal.id}",
            headers=auth_headers,
            json={"stage": "closed_won"}
        )

        assert response.status_code == 200
        data = response.json()
        assert data["stage"] == "closed_won"
        assert data["closed_date"] is not None

    async def test_close_deal_lost(
        self,
        async_client: AsyncClient,
        auth_headers: dict,
        test_workspace: Workspace,
        db: AsyncSession
    ):
        """Test closing deal as lost with reason."""
        deal = Deal(
            workspace_id=test_workspace.id,
            name="Lost Deal",
            stage=DealStage.PROPOSAL,
        )
        db.add(deal)
        await db.commit()
        await db.refresh(deal)

        response = await async_client.patch(
            f"/api/v1/deals/{deal.id}",
            headers=auth_headers,
            json={
                "stage": "closed_lost",
                "lost_reason": "Price too high",
                "competitor": "Competitor Inc"
            }
        )

        assert response.status_code == 200
        data = response.json()
        assert data["stage"] == "closed_lost"
        assert data["lost_reason"] == "Price too high"


@pytest.mark.asyncio
class TestPipelineManagement:
    """Tests for pipeline management."""

    async def test_create_pipeline(
        self,
        async_client: AsyncClient,
        auth_headers: dict,
        test_workspace: Workspace
    ):
        """Test creating a custom pipeline."""
        response = await async_client.post(
            "/api/v1/pipelines",
            headers=auth_headers,
            json={
                "workspace_id": str(test_workspace.id),
                "name": "Custom Sales Pipeline",
                "description": "Pipeline for enterprise sales",
                "stages": [
                    {"name": "Discovery", "probability": 10, "color": "#3B82F6"},
                    {"name": "Demo", "probability": 30, "color": "#10B981"},
                    {"name": "Proposal", "probability": 60, "color": "#F59E0B"},
                    {"name": "Closed", "probability": 100, "color": "#22C55E"}
                ]
            }
        )

        assert response.status_code == 201
        data = response.json()
        assert data["name"] == "Custom Sales Pipeline"
        assert len(data["stages"]) == 4

    async def test_get_pipelines(
        self,
        async_client: AsyncClient,
        auth_headers: dict,
        test_workspace: Workspace,
        db: AsyncSession
    ):
        """Test getting workspace pipelines."""
        pipeline = Pipeline(
            workspace_id=test_workspace.id,
            name="Test Pipeline",
            is_default=True,
            stages=[],
        )
        db.add(pipeline)
        await db.commit()

        response = await async_client.get(
            f"/api/v1/pipelines?workspace_id={test_workspace.id}",
            headers=auth_headers
        )

        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)


@pytest.mark.asyncio
class TestActivities:
    """Tests for deal activities."""

    async def test_create_activity_for_deal(
        self,
        async_client: AsyncClient,
        auth_headers: dict,
        test_workspace: Workspace,
        test_user,
        db: AsyncSession
    ):
        """Test creating an activity for a deal."""
        deal = Deal(
            workspace_id=test_workspace.id,
            name="Deal with Activity",
            stage=DealStage.PROSPECTING,
        )
        db.add(deal)
        await db.commit()
        await db.refresh(deal)

        response = await async_client.post(
            "/api/v1/activities",
            headers=auth_headers,
            json={
                "workspace_id": str(test_workspace.id),
                "deal_id": str(deal.id),
                "type": "call",
                "title": "Follow-up call",
                "description": "Discuss proposal details",
                "due_date": (datetime.utcnow() + timedelta(days=1)).isoformat()
            }
        )

        assert response.status_code == 201
        data = response.json()
        assert data["type"] == "call"
        assert data["title"] == "Follow-up call"
        assert data["deal_id"] == str(deal.id)

    async def test_get_deal_activities(
        self,
        async_client: AsyncClient,
        auth_headers: dict,
        test_workspace: Workspace,
        db: AsyncSession
    ):
        """Test getting activities for a deal."""
        deal = Deal(
            workspace_id=test_workspace.id,
            name="Deal with Activities",
            stage=DealStage.QUALIFICATION,
        )
        db.add(deal)
        await db.commit()
        await db.refresh(deal)

        # Create activities
        activity1 = Activity(
            workspace_id=test_workspace.id,
            deal_id=deal.id,
            type="call",
            title="Initial call",
            status="completed",
        )
        activity2 = Activity(
            workspace_id=test_workspace.id,
            deal_id=deal.id,
            type="email",
            title="Send proposal",
            status="pending",
        )
        db.add_all([activity1, activity2])
        await db.commit()

        response = await async_client.get(
            f"/api/v1/deals/{deal.id}/activities",
            headers=auth_headers
        )

        assert response.status_code == 200
        data = response.json()
        assert len(data) >= 2

    async def test_complete_activity(
        self,
        async_client: AsyncClient,
        auth_headers: dict,
        test_workspace: Workspace,
        db: AsyncSession
    ):
        """Test marking activity as completed."""
        activity = Activity(
            workspace_id=test_workspace.id,
            type="task",
            title="Review contract",
            status="pending",
        )
        db.add(activity)
        await db.commit()
        await db.refresh(activity)

        response = await async_client.patch(
            f"/api/v1/activities/{activity.id}",
            headers=auth_headers,
            json={
                "status": "completed",
                "outcome": "Contract approved"
            }
        )

        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "completed"
        assert data["outcome"] == "Contract approved"


@pytest.mark.asyncio
class TestNotes:
    """Tests for deal notes."""

    async def test_create_note_for_deal(
        self,
        async_client: AsyncClient,
        auth_headers: dict,
        test_workspace: Workspace,
        test_user,
        db: AsyncSession
    ):
        """Test creating a note for a deal."""
        deal = Deal(
            workspace_id=test_workspace.id,
            name="Deal with Note",
            stage=DealStage.PROPOSAL,
        )
        db.add(deal)
        await db.commit()
        await db.refresh(deal)

        response = await async_client.post(
            "/api/v1/notes",
            headers=auth_headers,
            json={
                "workspace_id": str(test_workspace.id),
                "deal_id": str(deal.id),
                "content": "Customer is very interested in the enterprise plan",
                "is_internal": True
            }
        )

        assert response.status_code == 201
        data = response.json()
        assert data["content"] == "Customer is very interested in the enterprise plan"
        assert data["is_internal"] is True

    async def test_get_deal_notes(
        self,
        async_client: AsyncClient,
        auth_headers: dict,
        test_workspace: Workspace,
        test_user,
        db: AsyncSession
    ):
        """Test getting notes for a deal."""
        deal = Deal(
            workspace_id=test_workspace.id,
            name="Deal with Notes",
            stage=DealStage.NEGOTIATION,
        )
        db.add(deal)
        await db.commit()
        await db.refresh(deal)

        # Create notes
        note1 = Note(
            workspace_id=test_workspace.id,
            deal_id=deal.id,
            content="First meeting went well",
            created_by=test_user.id,
        )
        note2 = Note(
            workspace_id=test_workspace.id,
            deal_id=deal.id,
            content="Sent pricing proposal",
            created_by=test_user.id,
        )
        db.add_all([note1, note2])
        await db.commit()

        response = await async_client.get(
            f"/api/v1/deals/{deal.id}/notes",
            headers=auth_headers
        )

        assert response.status_code == 200
        data = response.json()
        assert len(data) >= 2


@pytest.mark.asyncio
class TestTimeline:
    """Tests for deal timeline."""

    async def test_get_deal_timeline(
        self,
        async_client: AsyncClient,
        auth_headers: dict,
        test_workspace: Workspace,
        db: AsyncSession
    ):
        """Test getting timeline events for a deal."""
        from models.deal import Timeline

        deal = Deal(
            workspace_id=test_workspace.id,
            name="Deal with Timeline",
            stage=DealStage.QUALIFICATION,
        )
        db.add(deal)
        await db.commit()
        await db.refresh(deal)

        # Create timeline events
        event1 = Timeline(
            workspace_id=test_workspace.id,
            deal_id=deal.id,
            event_type="deal_created",
            title="Deal created",
            description="New deal created in pipeline",
        )
        event2 = Timeline(
            workspace_id=test_workspace.id,
            deal_id=deal.id,
            event_type="stage_changed",
            title="Stage changed to Qualification",
            description="Deal moved to qualification stage",
        )
        db.add_all([event1, event2])
        await db.commit()

        response = await async_client.get(
            f"/api/v1/deals/{deal.id}/timeline",
            headers=auth_headers
        )

        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) >= 2


@pytest.mark.asyncio
class TestDealDeletion:
    """Tests for deal deletion."""

    async def test_delete_deal_success(
        self,
        async_client: AsyncClient,
        auth_headers: dict,
        test_workspace: Workspace,
        db: AsyncSession
    ):
        """Test successful deal deletion (soft delete)."""
        deal = Deal(
            workspace_id=test_workspace.id,
            name="Deal to Delete",
            stage=DealStage.PROSPECTING,
        )
        db.add(deal)
        await db.commit()
        await db.refresh(deal)

        response = await async_client.delete(
            f"/api/v1/deals/{deal.id}",
            headers=auth_headers
        )

        assert response.status_code == 204
