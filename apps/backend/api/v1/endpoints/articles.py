"""Knowledge base article endpoints."""
from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def list_articles():
    return {"articles": [], "total": 0}
