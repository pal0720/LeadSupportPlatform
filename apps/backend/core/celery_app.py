"""
Celery application for background tasks.
"""
from celery import Celery
from celery.schedules import crontab

from core.config import settings

# Create Celery app
celery_app = Celery(
    "gtm_platform",
    broker=settings.REDIS_URL,
    backend=settings.REDIS_URL,
    include=[
        "tasks.enrichment_tasks",
        "tasks.scoring_tasks",
        "tasks.sequence_tasks",
        "tasks.support_tasks",
        "tasks.analytics_tasks",
    ]
)

# Configure Celery
celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
    task_time_limit=30 * 60,  # 30 minutes
    task_soft_time_limit=25 * 60,  # 25 minutes
    worker_prefetch_multiplier=1,
    worker_max_tasks_per_child=1000,
)

# Periodic tasks schedule
celery_app.conf.beat_schedule = {
    # Enrich new leads every 15 minutes
    "enrich-new-leads": {
        "task": "tasks.enrichment_tasks.enrich_pending_leads",
        "schedule": crontab(minute="*/15"),
    },
    # Score leads every 30 minutes
    "score-leads": {
        "task": "tasks.scoring_tasks.score_pending_leads",
        "schedule": crontab(minute="*/30"),
    },
    # Process email sequences every 5 minutes
    "process-sequences": {
        "task": "tasks.sequence_tasks.process_active_sequences",
        "schedule": crontab(minute="*/5"),
    },
    # Check SLA violations every 10 minutes
    "check-sla-violations": {
        "task": "tasks.support_tasks.check_sla_violations",
        "schedule": crontab(minute="*/10"),
    },
    # Calculate account health daily at 2 AM
    "calculate-account-health": {
        "task": "tasks.analytics_tasks.calculate_account_health",
        "schedule": crontab(hour=2, minute=0),
    },
    # Detect expansion signals daily at 3 AM
    "detect-expansion-signals": {
        "task": "tasks.analytics_tasks.detect_expansion_signals",
        "schedule": crontab(hour=3, minute=0),
    },
    # Generate AI insights daily at 4 AM
    "generate-ai-insights": {
        "task": "tasks.analytics_tasks.generate_ai_insights",
        "schedule": crontab(hour=4, minute=0),
    },
}
