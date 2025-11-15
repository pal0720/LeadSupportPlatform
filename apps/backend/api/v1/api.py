"""Main API router combining all endpoint modules."""
from fastapi import APIRouter

from api.v1.endpoints import (
    auth,
    users,
    workspaces,
    leads,
    companies,
    contacts,
    deals,
    sequences,
    emails,
    tickets,
    articles,
    account_health,
    analytics,
    enrichment,
    ai,
    ai_agents,
    journeys,
    campaigns,
    integrations_full,
    webhooks,
)

api_router = APIRouter()

# Authentication & Users
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(users.router, prefix="/users", tags=["Users"])

# Multi-Tenancy & Workspace Management
api_router.include_router(workspaces.router, prefix="/workspaces", tags=["Workspaces"])

# Lead Generation & Sales
api_router.include_router(leads.router, prefix="/leads", tags=["Leads"])
api_router.include_router(companies.router, prefix="/companies", tags=["Companies"])
api_router.include_router(contacts.router, prefix="/contacts", tags=["Contacts"])
api_router.include_router(deals.router, prefix="/deals", tags=["Deals & CRM"])
api_router.include_router(sequences.router, prefix="/sequences", tags=["Sequences"])
api_router.include_router(emails.router, prefix="/emails", tags=["Emails"])

# Marketing Automation
api_router.include_router(journeys.router, prefix="/journeys", tags=["Marketing Journeys"])
api_router.include_router(campaigns.router, prefix="/campaigns", tags=["Campaigns & Content"])

# Customer Support
api_router.include_router(tickets.router, prefix="/tickets", tags=["Support Tickets"])
api_router.include_router(articles.router, prefix="/articles", tags=["Knowledge Base"])

# Customer Success
api_router.include_router(account_health.router, prefix="/account-health", tags=["Customer Success"])

# Analytics & Insights
api_router.include_router(analytics.router, prefix="/analytics", tags=["Analytics"])

# Data Enrichment
api_router.include_router(enrichment.router, prefix="/enrichment", tags=["Data Enrichment"])

# AI Features
api_router.include_router(ai.router, prefix="/ai", tags=["AI Features"])
api_router.include_router(ai_agents.router, prefix="/ai-agents", tags=["AI Agents & Orchestration"])

# Integrations
api_router.include_router(integrations_full.router, prefix="/integrations", tags=["Integrations"])

# Webhooks
api_router.include_router(webhooks.router, prefix="/webhooks", tags=["Webhooks"])
