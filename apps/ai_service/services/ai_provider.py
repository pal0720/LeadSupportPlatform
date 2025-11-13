"""
AI Provider abstraction layer supporting OpenAI and Anthropic.
"""
import logging
from typing import List, Dict, Any, Optional
from abc import ABC, abstractmethod

from openai import AsyncOpenAI
from anthropic import AsyncAnthropic

from core.config import settings

logger = logging.getLogger(__name__)


class AIProvider(ABC):
    """Abstract base class for AI providers."""

    @abstractmethod
    async def generate_completion(
        self,
        messages: List[Dict[str, str]],
        model: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: int = 2000,
        **kwargs
    ) -> str:
        """Generate text completion."""
        pass

    @abstractmethod
    async def generate_embeddings(
        self,
        texts: List[str],
        model: Optional[str] = None,
    ) -> List[List[float]]:
        """Generate embeddings for texts."""
        pass


class OpenAIProvider(AIProvider):
    """OpenAI provider implementation."""

    def __init__(self, api_key: str):
        """Initialize OpenAI client."""
        self.client = AsyncOpenAI(api_key=api_key)
        self.default_model = settings.DEFAULT_MODEL
        self.embedding_model = settings.EMBEDDING_MODEL

    async def generate_completion(
        self,
        messages: List[Dict[str, str]],
        model: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: int = 2000,
        **kwargs
    ) -> str:
        """
        Generate text completion using OpenAI.

        Args:
            messages: List of message dictionaries
            model: Model to use (default: gpt-4-turbo-preview)
            temperature: Sampling temperature
            max_tokens: Maximum tokens to generate
            **kwargs: Additional arguments

        Returns:
            Generated text
        """
        try:
            response = await self.client.chat.completions.create(
                model=model or self.default_model,
                messages=messages,
                temperature=temperature,
                max_tokens=max_tokens,
                **kwargs
            )
            return response.choices[0].message.content
        except Exception as e:
            logger.error(f"OpenAI completion error: {e}")
            raise

    async def generate_embeddings(
        self,
        texts: List[str],
        model: Optional[str] = None,
    ) -> List[List[float]]:
        """
        Generate embeddings using OpenAI.

        Args:
            texts: List of texts to embed
            model: Embedding model to use

        Returns:
            List of embedding vectors
        """
        try:
            response = await self.client.embeddings.create(
                model=model or self.embedding_model,
                input=texts,
            )
            return [item.embedding for item in response.data]
        except Exception as e:
            logger.error(f"OpenAI embedding error: {e}")
            raise


class AnthropicProvider(AIProvider):
    """Anthropic (Claude) provider implementation."""

    def __init__(self, api_key: str):
        """Initialize Anthropic client."""
        self.client = AsyncAnthropic(api_key=api_key)
        self.default_model = "claude-3-opus-20240229"

    async def generate_completion(
        self,
        messages: List[Dict[str, str]],
        model: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: int = 2000,
        **kwargs
    ) -> str:
        """
        Generate text completion using Anthropic.

        Args:
            messages: List of message dictionaries
            model: Model to use (default: claude-3-opus)
            temperature: Sampling temperature
            max_tokens: Maximum tokens to generate
            **kwargs: Additional arguments

        Returns:
            Generated text
        """
        try:
            # Convert messages format if needed
            system_message = None
            converted_messages = []

            for msg in messages:
                if msg["role"] == "system":
                    system_message = msg["content"]
                else:
                    converted_messages.append(msg)

            response = await self.client.messages.create(
                model=model or self.default_model,
                max_tokens=max_tokens,
                temperature=temperature,
                system=system_message,
                messages=converted_messages,
                **kwargs
            )
            return response.content[0].text
        except Exception as e:
            logger.error(f"Anthropic completion error: {e}")
            raise

    async def generate_embeddings(
        self,
        texts: List[str],
        model: Optional[str] = None,
    ) -> List[List[float]]:
        """
        Anthropic doesn't provide embeddings, fallback to OpenAI.

        Args:
            texts: List of texts to embed
            model: Embedding model to use

        Returns:
            List of embedding vectors
        """
        logger.warning("Anthropic doesn't provide embeddings, using OpenAI fallback")
        if settings.OPENAI_API_KEY:
            openai_provider = OpenAIProvider(settings.OPENAI_API_KEY)
            return await openai_provider.generate_embeddings(texts, model)
        else:
            raise ValueError("OpenAI API key required for embeddings")


class AIProviderManager:
    """Manager for AI providers."""

    def __init__(self):
        """Initialize provider manager."""
        self.providers: Dict[str, AIProvider] = {}
        self.default_provider: Optional[str] = None

    async def initialize(self):
        """Initialize available providers."""
        # Initialize OpenAI
        if settings.OPENAI_API_KEY:
            self.providers["openai"] = OpenAIProvider(settings.OPENAI_API_KEY)
            logger.info("OpenAI provider initialized")

        # Initialize Anthropic
        if settings.ANTHROPIC_API_KEY:
            self.providers["anthropic"] = AnthropicProvider(settings.ANTHROPIC_API_KEY)
            logger.info("Anthropic provider initialized")

        # Set default provider
        if settings.DEFAULT_PROVIDER in self.providers:
            self.default_provider = settings.DEFAULT_PROVIDER
        elif self.providers:
            self.default_provider = list(self.providers.keys())[0]

        if not self.providers:
            logger.warning("No AI providers configured")

    def get_provider(self, provider_name: Optional[str] = None) -> AIProvider:
        """
        Get AI provider by name.

        Args:
            provider_name: Provider name (openai, anthropic)

        Returns:
            AI provider instance

        Raises:
            ValueError: If provider not found
        """
        name = provider_name or self.default_provider

        if not name or name not in self.providers:
            raise ValueError(f"Provider '{name}' not available")

        return self.providers[name]

    async def generate_completion(
        self,
        messages: List[Dict[str, str]],
        provider: Optional[str] = None,
        **kwargs
    ) -> str:
        """Generate completion using specified or default provider."""
        provider_instance = self.get_provider(provider)
        return await provider_instance.generate_completion(messages, **kwargs)

    async def generate_embeddings(
        self,
        texts: List[str],
        provider: Optional[str] = None,
        **kwargs
    ) -> List[List[float]]:
        """Generate embeddings using specified or default provider."""
        provider_instance = self.get_provider(provider)
        return await provider_instance.generate_embeddings(texts, **kwargs)


# Global provider manager instance
ai_provider_manager = AIProviderManager()
