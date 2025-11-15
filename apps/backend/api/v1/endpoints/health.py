"""
Health check and metrics endpoints for monitoring and observability.
"""
import time
from datetime import datetime
from typing import Dict, Any
from collections import defaultdict

from fastapi import APIRouter, status
from fastapi.responses import JSONResponse
from sqlalchemy import text

from core.config import settings
from core.database import SessionLocal
from core.redis import redis_client

router = APIRouter(tags=["Health"])

# In-memory metrics storage
_request_metrics = {
    "total_requests": 0,
    "requests_by_endpoint": defaultdict(int),
    "requests_by_status": defaultdict(int),
    "total_latency_ms": 0,
    "start_time": datetime.utcnow()
}


@router.get("/health")
async def health_check() -> Dict[str, Any]:
    """
    Basic health check endpoint.

    Returns:
        Health status
    """
    return {
        "status": "healthy",
        "service": "gtm-platform-api",
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT,
        "timestamp": datetime.utcnow().isoformat()
    }


@router.get("/health/ready")
async def readiness_check():
    """
    Readiness check - verifies all required services are available.

    Returns:
        JSONResponse: Readiness status with service checks
    """
    checks = {
        "database": {"status": "unknown", "latency_ms": None},
        "redis": {"status": "unknown", "latency_ms": None},
    }

    all_healthy = True

    # Check database connection
    try:
        db = SessionLocal()
        start = time.time()
        result = await db.execute(text("SELECT 1"))
        latency = (time.time() - start) * 1000

        if result:
            checks["database"]["status"] = "healthy"
            checks["database"]["latency_ms"] = round(latency, 2)
        else:
            checks["database"]["status"] = "unhealthy"
            all_healthy = False

        await db.close()
    except Exception as e:
        checks["database"]["status"] = "unhealthy"
        checks["database"]["error"] = str(e)
        all_healthy = False

    # Check Redis connection
    try:
        start = time.time()
        pong = await redis_client.ping()
        latency = (time.time() - start) * 1000

        if pong:
            checks["redis"]["status"] = "healthy"
            checks["redis"]["latency_ms"] = round(latency, 2)
        else:
            checks["redis"]["status"] = "unhealthy"
            all_healthy = False
    except Exception as e:
        checks["redis"]["status"] = "unhealthy"
        checks["redis"]["error"] = str(e)
        all_healthy = False

    # Return appropriate status code
    status_code = status.HTTP_200_OK if all_healthy else status.HTTP_503_SERVICE_UNAVAILABLE

    return JSONResponse(
        status_code=status_code,
        content={
            "status": "ready" if all_healthy else "not_ready",
            "checks": checks,
            "timestamp": datetime.utcnow().isoformat()
        }
    )


@router.get("/health/live")
async def liveness_check() -> Dict[str, Any]:
    """
    Liveness check - verifies the application is running.

    Returns:
        Liveness status
    """
    return {
        "status": "alive",
        "timestamp": datetime.utcnow().isoformat(),
        "uptime_seconds": (
            datetime.utcnow() - _request_metrics["start_time"]
        ).total_seconds()
    }


@router.get("/metrics")
async def metrics() -> Dict[str, Any]:
    """
    Prometheus-style metrics endpoint.

    Returns:
        Application metrics including request counts, latencies, and system info
    """
    # Calculate average latency
    avg_latency = 0
    if _request_metrics["total_requests"] > 0:
        avg_latency = (
            _request_metrics["total_latency_ms"] / _request_metrics["total_requests"]
        )

    # Get database connection pool stats
    db_pool_stats = {}
    try:
        from core.database import engine
        db_pool_stats = {
            "pool_size": engine.pool.size(),
            "checked_in": engine.pool.checkedin(),
            "checked_out": engine.pool.checkedout(),
            "overflow": engine.pool.overflow(),
        }
    except Exception:
        pass

    # Get Redis info
    redis_info = {}
    try:
        info = await redis_client.info()
        redis_info = {
            "connected_clients": info.get("connected_clients", 0),
            "used_memory": info.get("used_memory_human", "unknown"),
            "uptime_days": info.get("uptime_in_days", 0),
        }
    except Exception:
        pass

    # Calculate uptime
    uptime_seconds = (
        datetime.utcnow() - _request_metrics["start_time"]
    ).total_seconds()

    metrics_data = {
        "application": {
            "name": settings.APP_NAME,
            "version": settings.VERSION,
            "environment": settings.ENVIRONMENT,
            "uptime_seconds": round(uptime_seconds, 2),
        },
        "requests": {
            "total": _request_metrics["total_requests"],
            "by_endpoint": dict(_request_metrics["requests_by_endpoint"]),
            "by_status": dict(_request_metrics["requests_by_status"]),
            "avg_latency_ms": round(avg_latency, 2),
        },
        "database": db_pool_stats,
        "redis": redis_info,
        "timestamp": datetime.utcnow().isoformat()
    }

    return metrics_data


def record_request_metric(endpoint: str, status_code: int, latency_ms: float):
    """
    Record request metrics (called by middleware).

    Args:
        endpoint: Request endpoint path
        status_code: HTTP status code
        latency_ms: Request latency in milliseconds
    """
    _request_metrics["total_requests"] += 1
    _request_metrics["requests_by_endpoint"][endpoint] += 1
    _request_metrics["requests_by_status"][status_code] += 1
    _request_metrics["total_latency_ms"] += latency_ms
