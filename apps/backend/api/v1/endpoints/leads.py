"""Lead management endpoints."""
from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def list_leads():
    return {"leads": [], "total": 0}

@router.post("/")
async def create_lead():
    return {"message": "Lead created"}
