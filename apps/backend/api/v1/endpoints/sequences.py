"""Sequence management endpoints."""
from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def list_sequences():
    return {"sequences": [], "total": 0}
