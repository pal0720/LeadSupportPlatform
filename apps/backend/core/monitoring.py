"""
Monitoring and observability setup.
"""
import logging
from typing import Optional

import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration
from sentry_sdk.integrations.sqlalchemy import SqlalchemyIntegration
from sentry_sdk.integrations.redis import RedisIntegration
from fastapi import FastAPI

from core.config import settings

logger = logging.getLogger(__name__)


def setup_monitoring(app: FastAPI) -> None:
    """
    Setup monitoring and error tracking.

    Args:
        app: FastAPI application instance
    """
    if settings.SENTRY_DSN:
        sentry_sdk.init(
            dsn=settings.SENTRY_DSN,
            environment=settings.SENTRY_ENVIRONMENT,
            traces_sample_rate=1.0 if settings.DEBUG else 0.1,
            profiles_sample_rate=1.0 if settings.DEBUG else 0.1,
            integrations=[
                FastApiIntegration(transaction_style="endpoint"),
                SqlalchemyIntegration(),
                RedisIntegration(),
            ],
            attach_stacktrace=True,
            send_default_pii=False,
        )
        logger.info("Sentry monitoring initialized")
