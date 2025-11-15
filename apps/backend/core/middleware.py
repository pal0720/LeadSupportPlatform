"""
FastAPI middleware for security, logging, and request tracking.
"""
import time
import uuid
import json
import logging
from typing import Callable
from datetime import datetime
from fastapi import Request, Response, status
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession

from core.config import settings
from core.security import rate_limiter
from core.database import SessionLocal

logger = logging.getLogger(__name__)


class RateLimitMiddleware(BaseHTTPMiddleware):
    """
    Middleware for rate limiting requests per IP address or authenticated user.
    """

    def __init__(self, app, max_requests: int = 60, window_seconds: int = 60):
        """
        Initialize rate limit middleware.

        Args:
            app: FastAPI application
            max_requests: Maximum requests allowed per window
            window_seconds: Time window in seconds
        """
        super().__init__(app)
        self.max_requests = max_requests
        self.window_seconds = window_seconds

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        """
        Process request and check rate limits.

        Args:
            request: Incoming request
            call_next: Next middleware/handler

        Returns:
            Response
        """
        # Skip rate limiting for health checks
        if request.url.path.startswith("/health"):
            return await call_next(request)

        # Get identifier (user ID or IP address)
        client_ip = request.client.host if request.client else "unknown"

        # Try to get user from auth header for authenticated rate limiting
        auth_header = request.headers.get("Authorization", "")
        identifier = client_ip

        if auth_header.startswith("Bearer "):
            try:
                # Extract token and use as additional identifier
                token = auth_header.split(" ")[1]
                identifier = f"token:{token[:16]}"  # Use first 16 chars of token
            except Exception:
                pass

        # Check rate limit
        allowed = await rate_limiter.check_rate_limit(
            key=identifier,
            max_requests=self.max_requests,
            window_seconds=self.window_seconds
        )

        if not allowed:
            return JSONResponse(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                content={
                    "error": {
                        "code": 429,
                        "message": "Rate limit exceeded. Please try again later.",
                        "type": "rate_limit_error"
                    }
                },
                headers={
                    "Retry-After": str(self.window_seconds),
                    "X-RateLimit-Limit": str(self.max_requests),
                    "X-RateLimit-Window": str(self.window_seconds)
                }
            )

        # Process request
        response = await call_next(request)

        # Add rate limit headers
        response.headers["X-RateLimit-Limit"] = str(self.max_requests)
        response.headers["X-RateLimit-Window"] = str(self.window_seconds)

        return response


class RequestIDMiddleware(BaseHTTPMiddleware):
    """
    Middleware to add unique request ID to each request.
    """

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        """
        Add request ID to request state and response headers.

        Args:
            request: Incoming request
            call_next: Next middleware/handler

        Returns:
            Response with X-Request-ID header
        """
        # Generate unique request ID
        request_id = str(uuid.uuid4())

        # Add to request state for access in endpoints
        request.state.request_id = request_id

        # Process request
        response = await call_next(request)

        # Add request ID to response headers
        response.headers["X-Request-ID"] = request_id

        return response


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """
    Middleware to add security headers to all responses.
    """

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        """
        Add security headers to response.

        Args:
            request: Incoming request
            call_next: Next middleware/handler

        Returns:
            Response with security headers
        """
        response = await call_next(request)

        # Content Security Policy
        response.headers["Content-Security-Policy"] = (
            "default-src 'self'; "
            "script-src 'self' 'unsafe-inline' 'unsafe-eval'; "
            "style-src 'self' 'unsafe-inline'; "
            "img-src 'self' data: https:; "
            "font-src 'self' data:; "
            "connect-src 'self' https:; "
            "frame-ancestors 'none';"
        )

        # Prevent clickjacking
        response.headers["X-Frame-Options"] = "DENY"

        # Prevent MIME type sniffing
        response.headers["X-Content-Type-Options"] = "nosniff"

        # Enable XSS protection (legacy, but still useful)
        response.headers["X-XSS-Protection"] = "1; mode=block"

        # Referrer policy
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"

        # Permissions policy
        response.headers["Permissions-Policy"] = (
            "geolocation=(), "
            "microphone=(), "
            "camera=()"
        )

        # HSTS (only in production)
        if settings.ENVIRONMENT == "production":
            response.headers["Strict-Transport-Security"] = (
                "max-age=31536000; includeSubDomains; preload"
            )

        return response


class AuditLoggingMiddleware(BaseHTTPMiddleware):
    """
    Middleware to log all API calls to audit log.
    """

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        """
        Log request and response details for audit purposes.

        Args:
            request: Incoming request
            call_next: Next middleware/handler

        Returns:
            Response
        """
        # Skip audit logging for health checks and metrics
        skip_paths = ["/health", "/metrics", "/docs", "/openapi.json", "/redoc"]
        if any(request.url.path.startswith(path) for path in skip_paths):
            return await call_next(request)

        # Capture request details
        start_time = time.time()
        request_id = getattr(request.state, "request_id", str(uuid.uuid4()))
        client_ip = request.client.host if request.client else "unknown"

        # Extract user info from auth header (if present)
        user_id = None
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            try:
                from core.security import decode_token
                token = auth_header.split(" ")[1]
                payload = decode_token(token)
                user_id = payload.get("sub")
            except Exception:
                pass

        # Get workspace ID from headers or query params
        workspace_id = request.headers.get("X-Workspace-ID")
        if not workspace_id:
            workspace_id = request.query_params.get("workspace_id")

        # Process request
        try:
            response = await call_next(request)
            status_code = response.status_code
            error = None
        except Exception as e:
            status_code = 500
            error = str(e)
            logger.exception(f"Request failed: {e}")
            raise

        # Calculate duration
        duration_ms = (time.time() - start_time) * 1000

        # Create audit log entry
        audit_log = {
            "request_id": request_id,
            "timestamp": datetime.utcnow().isoformat(),
            "method": request.method,
            "path": request.url.path,
            "query_params": dict(request.query_params),
            "client_ip": client_ip,
            "user_id": str(user_id) if user_id else None,
            "workspace_id": workspace_id,
            "status_code": status_code,
            "duration_ms": round(duration_ms, 2),
            "user_agent": request.headers.get("User-Agent", ""),
            "error": error
        }

        # Log to database (async)
        try:
            await self._save_audit_log(audit_log)
        except Exception as e:
            logger.error(f"Failed to save audit log: {e}")

        # Also log to standard logger
        logger.info(
            f"{request.method} {request.url.path} - "
            f"Status: {status_code} - "
            f"Duration: {duration_ms:.2f}ms - "
            f"User: {user_id or 'anonymous'}"
        )

        return response

    async def _save_audit_log(self, log_data: dict):
        """
        Save audit log to database.

        Args:
            log_data: Audit log data
        """
        # Use a separate database session for audit logging
        db = SessionLocal()
        try:
            # Import here to avoid circular imports
            from sqlalchemy import text

            # Insert audit log
            query = text("""
                INSERT INTO audit_logs (
                    id, request_id, timestamp, method, path, query_params,
                    client_ip, user_id, workspace_id, status_code,
                    duration_ms, user_agent, error, created_at
                ) VALUES (
                    gen_random_uuid(), :request_id, :timestamp, :method, :path,
                    :query_params, :client_ip, :user_id, :workspace_id,
                    :status_code, :duration_ms, :user_agent, :error, NOW()
                )
            """)

            await db.execute(
                query,
                {
                    "request_id": log_data["request_id"],
                    "timestamp": log_data["timestamp"],
                    "method": log_data["method"],
                    "path": log_data["path"],
                    "query_params": json.dumps(log_data["query_params"]),
                    "client_ip": log_data["client_ip"],
                    "user_id": log_data["user_id"],
                    "workspace_id": log_data["workspace_id"],
                    "status_code": log_data["status_code"],
                    "duration_ms": log_data["duration_ms"],
                    "user_agent": log_data["user_agent"],
                    "error": log_data["error"]
                }
            )
            await db.commit()
        except Exception as e:
            # Don't fail the request if audit logging fails
            logger.error(f"Audit log save failed: {e}")
        finally:
            await db.close()


class TimingMiddleware(BaseHTTPMiddleware):
    """
    Middleware to add timing information to responses.
    """

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        """
        Add server timing information to response.

        Args:
            request: Incoming request
            call_next: Next middleware/handler

        Returns:
            Response with Server-Timing header
        """
        start_time = time.time()
        response = await call_next(request)
        process_time = time.time() - start_time

        # Add timing header (useful for debugging and monitoring)
        response.headers["X-Process-Time"] = f"{process_time:.4f}"
        response.headers["Server-Timing"] = f"total;dur={process_time*1000:.2f}"

        return response


def setup_middleware(app):
    """
    Setup all middleware for the FastAPI application.

    Args:
        app: FastAPI application instance
    """
    # Add middleware in reverse order (last added is executed first)

    # CORS middleware (should be last to handle all responses)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
        expose_headers=["X-Request-ID", "X-Process-Time"]
    )

    # Security headers
    app.add_middleware(SecurityHeadersMiddleware)

    # Request timing
    app.add_middleware(TimingMiddleware)

    # Audit logging
    if settings.ENVIRONMENT in ["production", "staging"]:
        app.add_middleware(AuditLoggingMiddleware)

    # Request ID tracking
    app.add_middleware(RequestIDMiddleware)

    # Rate limiting
    app.add_middleware(
        RateLimitMiddleware,
        max_requests=settings.RATE_LIMIT_PER_MINUTE,
        window_seconds=60
    )

    logger.info("Middleware setup completed")
