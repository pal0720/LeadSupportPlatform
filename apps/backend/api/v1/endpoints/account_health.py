"""Account health endpoints."""
from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def list_account_health():
    return {"accounts": [], "total": 0}
