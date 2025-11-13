"""Support ticket endpoints."""
from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def list_tickets():
    return {"tickets": [], "total": 0}

@router.post("/")
async def create_ticket():
    return {"message": "Ticket created"}
