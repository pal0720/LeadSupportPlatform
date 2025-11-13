"""Contact management endpoints."""
from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def list_contacts():
    return {"contacts": [], "total": 0}
