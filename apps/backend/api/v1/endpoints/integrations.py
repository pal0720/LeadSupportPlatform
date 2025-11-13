"""CRM integration endpoints."""
from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def list_integrations():
    return {"integrations": ["HubSpot", "Salesforce"]}
