"""AI agents endpoints."""
from fastapi import APIRouter

router = APIRouter()

@router.post("/sales-agent")
async def sales_agent():
    return {"action": "send_email", "reasoning": "Lead is highly engaged"}
