"""
Application configuration using Pydantic settings.
"""
from typing import List, Optional
from pydantic_settings import BaseSettings
from pydantic import Field, validator


class Settings(BaseSettings):
    """Application settings."""

    # Application
    APP_NAME: str = "GTM Platform API"
    VERSION: str = "1.0.0"
    DEBUG: bool = Field(default=False, env="DEBUG")
    ENVIRONMENT: str = Field(default="development", env="ENVIRONMENT")

    # Database
    DATABASE_URL: str = Field(..., env="DATABASE_URL")

    # Redis
    REDIS_URL: str = Field(..., env="REDIS_URL")

    # JWT & Security
    JWT_SECRET: str = Field(..., env="JWT_SECRET")
    JWT_ALGORITHM: str = Field(default="HS256", env="JWT_ALGORITHM")
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(default=30, env="JWT_ACCESS_TOKEN_EXPIRE_MINUTES")
    JWT_REFRESH_TOKEN_EXPIRE_DAYS: int = Field(default=30, env="JWT_REFRESH_TOKEN_EXPIRE_DAYS")

    # CORS
    CORS_ORIGINS: List[str] = Field(
        default=["http://localhost:3000"],
        env="CORS_ORIGINS"
    )

    @validator("CORS_ORIGINS", pre=True)
    def parse_cors_origins(cls, v):
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(",")]
        return v

    # AI Providers
    OPENAI_API_KEY: Optional[str] = Field(default=None, env="OPENAI_API_KEY")
    ANTHROPIC_API_KEY: Optional[str] = Field(default=None, env="ANTHROPIC_API_KEY")
    AI_SERVICE_URL: str = Field(default="http://localhost:8001", env="AI_SERVICE_URL")

    # Email
    SMTP_HOST: str = Field(default="localhost", env="SMTP_HOST")
    SMTP_PORT: int = Field(default=1025, env="SMTP_PORT")
    SMTP_USER: Optional[str] = Field(default=None, env="SMTP_USER")
    SMTP_PASSWORD: Optional[str] = Field(default=None, env="SMTP_PASSWORD")
    EMAIL_FROM: str = Field(default="noreply@gtmplatform.com", env="EMAIL_FROM")

    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = Field(default=60, env="RATE_LIMIT_PER_MINUTE")

    # Enrichment APIs
    CLEARBIT_API_KEY: Optional[str] = Field(default=None, env="CLEARBIT_API_KEY")
    HUNTER_API_KEY: Optional[str] = Field(default=None, env="HUNTER_API_KEY")
    BUILTWITH_API_KEY: Optional[str] = Field(default=None, env="BUILTWITH_API_KEY")

    # CRM Integrations
    HUBSPOT_API_KEY: Optional[str] = Field(default=None, env="HUBSPOT_API_KEY")
    SALESFORCE_CLIENT_ID: Optional[str] = Field(default=None, env="SALESFORCE_CLIENT_ID")
    SALESFORCE_CLIENT_SECRET: Optional[str] = Field(default=None, env="SALESFORCE_CLIENT_SECRET")
    SALESFORCE_REDIRECT_URI: Optional[str] = Field(default=None, env="SALESFORCE_REDIRECT_URI")

    # Monitoring
    SENTRY_DSN: Optional[str] = Field(default=None, env="SENTRY_DSN")
    SENTRY_ENVIRONMENT: str = Field(default="development", env="SENTRY_ENVIRONMENT")

    # Feature Flags
    FEATURE_AI_AUTOPILOT: bool = Field(default=True, env="FEATURE_AI_AUTOPILOT")
    FEATURE_LIVE_COPILOT: bool = Field(default=True, env="FEATURE_LIVE_COPILOT")
    FEATURE_AI_QBR_CREATOR: bool = Field(default=True, env="FEATURE_AI_QBR_CREATOR")
    FEATURE_LOOKALIKE_FINDER: bool = Field(default=True, env="FEATURE_LOOKALIKE_FINDER")
    FEATURE_SUPPORT_FORECASTING: bool = Field(default=True, env="FEATURE_SUPPORT_FORECASTING")

    class Config:
        env_file = ".env"
        case_sensitive = True


# Create global settings instance
settings = Settings()
