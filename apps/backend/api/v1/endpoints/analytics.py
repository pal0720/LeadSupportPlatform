"""Analytics endpoints."""
from fastapi import APIRouter

router = APIRouter()

@router.get("/dashboard")
async def get_dashboard_stats():
    return {
        "total_leads": 0,
        "total_companies": 0,
        "open_tickets": 0,
        "active_sequences": 0
    }
