"""Embedding generation endpoints."""
from fastapi import APIRouter

router = APIRouter()

@router.post("/generate")
async def generate_embeddings():
    return {"embeddings": []}
