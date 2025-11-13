"""AI Service configuration."""
from typing import Optional
from pydantic_settings import BaseSettings
from pydantic import Field


class Settings(BaseSettings):
    """AI Service settings."""

    # Service
    SERVICE_NAME: str = "AI Service"
    DEBUG: bool = Field(default=False, env="DEBUG")

    # AI Providers
    OPENAI_API_KEY: Optional[str] = Field(default=None, env="OPENAI_API_KEY")
    ANTHROPIC_API_KEY: Optional[str] = Field(default=None, env="ANTHROPIC_API_KEY")

    # Default provider
    DEFAULT_PROVIDER: str = Field(default="openai", env="DEFAULT_PROVIDER")

    # Model configuration
    DEFAULT_MODEL: str = Field(default="gpt-4-turbo-preview", env="DEFAULT_MODEL")
    EMBEDDING_MODEL: str = Field(default="text-embedding-3-small", env="EMBEDDING_MODEL")
    EMBEDDING_DIMENSIONS: int = Field(default=1536, env="EMBEDDING_DIMENSIONS")

    # Database (for vector storage)
    DATABASE_URL: Optional[str] = Field(default=None, env="DATABASE_URL")

    # Redis (for caching)
    REDIS_URL: Optional[str] = Field(default=None, env="REDIS_URL")

    # Generation limits
    MAX_TOKENS: int = Field(default=2000, env="MAX_TOKENS")
    TEMPERATURE: float = Field(default=0.7, env="TEMPERATURE")

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
