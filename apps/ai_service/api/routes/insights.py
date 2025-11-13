"""AI insights endpoints."""
from fastapi import APIRouter

router = APIRouter()

@router.get("/dashboard")
async def get_ai_insights():
    return {"insights": [], "recommendations": []}
