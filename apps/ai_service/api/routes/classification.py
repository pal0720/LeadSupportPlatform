"""Classification endpoints."""
from fastapi import APIRouter

router = APIRouter()

@router.post("/classify-ticket")
async def classify_ticket():
    return {"category": "Technical", "sentiment": "neutral", "urgency": "medium"}
