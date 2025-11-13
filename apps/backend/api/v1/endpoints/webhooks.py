"""Webhook endpoints."""
from fastapi import APIRouter

router = APIRouter()

@router.post("/hubspot")
async def hubspot_webhook():
    return {"message": "Webhook received"}

@router.post("/salesforce")
async def salesforce_webhook():
    return {"message": "Webhook received"}
