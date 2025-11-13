"""Company management endpoints."""
from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def list_companies():
    return {"companies": [], "total": 0}
