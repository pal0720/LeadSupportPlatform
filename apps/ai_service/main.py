"""
AI Service for the GTM Platform.
Handles all AI operations including scoring, classification, generation, and embeddings.
"""
import logging
from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from core.config import settings
from api.routes import (
    scoring,
    classification,
    generation,
    embeddings,
    agents,
    insights,
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator:
    """Application lifespan manager."""
    logger.info("Starting AI Service...")

    # Initialize AI providers
    from services.ai_provider import ai_provider_manager
    await ai_provider_manager.initialize()
    logger.info("AI providers initialized")

    yield

    logger.info("Shutting down AI Service...")


# Create FastAPI app
app = FastAPI(
    title="GTM Platform AI Service",
    description="AI microservice for lead scoring, classification, generation, and analysis",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # AI service is internal
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Exception handlers
@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    """Handle unexpected exceptions."""
    logger.exception(f"Unexpected error: {exc}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": {
                "code": 500,
                "message": "Internal server error",
                "type": "server_error"
            }
        },
    )


# Health check
@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "service": "ai-service",
        "version": "1.0.0"
    }


# Include routers
app.include_router(scoring.router, prefix="/scoring", tags=["Scoring"])
app.include_router(classification.router, prefix="/classification", tags=["Classification"])
app.include_router(generation.router, prefix="/generation", tags=["Generation"])
app.include_router(embeddings.router, prefix="/embeddings", tags=["Embeddings"])
app.include_router(agents.router, prefix="/agents", tags=["AI Agents"])
app.include_router(insights.router, prefix="/insights", tags=["Insights"])


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8001,
        reload=True,
        log_level="info"
    )
