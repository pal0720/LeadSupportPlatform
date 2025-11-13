"""Data enrichment endpoints."""
from fastapi import APIRouter

router = APIRouter()

@router.post("/enrich-lead")
async def enrich_lead():
    return {"message": "Lead enrichment started"}
