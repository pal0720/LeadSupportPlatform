"""Text generation endpoints."""
from fastapi import APIRouter

router = APIRouter()

@router.post("/generate-email")
async def generate_email():
    return {"subject": "AI Generated Email", "body": "Email content here"}
