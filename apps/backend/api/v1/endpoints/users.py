"""User management endpoints."""
from fastapi import APIRouter

router = APIRouter()


@router.get("/me")
async def get_current_user():
    """Get current authenticated user."""
    return {"message": "User endpoint - implementation pending"}
