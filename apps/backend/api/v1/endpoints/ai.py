"""AI features endpoints."""
from fastapi import APIRouter

router = APIRouter()

@router.post("/score-lead")
async def score_lead():
    return {"score": 50, "reasoning": "AI scoring"}

@router.post("/generate-email")
async def generate_email():
    return {"subject": "Generated subject", "body": "Generated email body"}
