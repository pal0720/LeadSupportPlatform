"""
Redis client and caching utilities.
"""
import json
from typing import Any, Optional
from redis.asyncio import Redis
from redis.asyncio.connection import ConnectionPool

from core.config import settings


class RedisClient:
    """Redis client wrapper with caching utilities."""

    def __init__(self, url: str):
        """
        Initialize Redis client.

        Args:
            url: Redis connection URL
        """
        self.pool = ConnectionPool.from_url(
            url,
            decode_responses=True,
            max_connections=10
        )
        self.client = Redis(connection_pool=self.pool)

    async def get(self, key: str) -> Optional[str]:
        """
        Get value from Redis.

        Args:
            key: Cache key

        Returns:
            Value or None if not found
        """
        return await self.client.get(key)

    async def set(
        self,
        key: str,
        value: Any,
        expire: Optional[int] = None
    ) -> bool:
        """
        Set value in Redis.

        Args:
            key: Cache key
            value: Value to cache
            expire: Expiration time in seconds

        Returns:
            True if successful
        """
        if isinstance(value, (dict, list)):
            value = json.dumps(value)

        return await self.client.set(key, value, ex=expire)

    async def delete(self, key: str) -> int:
        """
        Delete key from Redis.

        Args:
            key: Cache key

        Returns:
            Number of keys deleted
        """
        return await self.client.delete(key)

    async def exists(self, key: str) -> bool:
        """
        Check if key exists in Redis.

        Args:
            key: Cache key

        Returns:
            True if key exists
        """
        return await self.client.exists(key) > 0

    async def incr(self, key: str, amount: int = 1) -> int:
        """
        Increment value in Redis.

        Args:
            key: Cache key
            amount: Amount to increment

        Returns:
            New value
        """
        return await self.client.incrby(key, amount)

    async def expire(self, key: str, seconds: int) -> bool:
        """
        Set expiration on key.

        Args:
            key: Cache key
            seconds: Expiration time in seconds

        Returns:
            True if successful
        """
        return await self.client.expire(key, seconds)

    async def ping(self) -> bool:
        """
        Ping Redis to check connection.

        Returns:
            True if connected
        """
        return await self.client.ping()

    async def close(self) -> None:
        """Close Redis connection."""
        await self.client.close()
        await self.pool.disconnect()

    async def get_json(self, key: str) -> Optional[dict]:
        """
        Get JSON value from Redis.

        Args:
            key: Cache key

        Returns:
            Parsed JSON or None if not found
        """
        value = await self.get(key)
        if value:
            try:
                return json.loads(value)
            except json.JSONDecodeError:
                return None
        return None

    async def set_json(
        self,
        key: str,
        value: dict,
        expire: Optional[int] = None
    ) -> bool:
        """
        Set JSON value in Redis.

        Args:
            key: Cache key
            value: Dictionary to cache
            expire: Expiration time in seconds

        Returns:
            True if successful
        """
        return await self.set(key, json.dumps(value), expire)

    async def rate_limit(
        self,
        key: str,
        limit: int,
        window: int
    ) -> tuple[bool, int]:
        """
        Check rate limit using sliding window.

        Args:
            key: Rate limit key (e.g., "rate_limit:user_123")
            limit: Maximum requests allowed
            window: Time window in seconds

        Returns:
            Tuple of (allowed, remaining)
        """
        current = await self.incr(key)

        if current == 1:
            await self.expire(key, window)

        remaining = max(0, limit - current)
        allowed = current <= limit

        return allowed, remaining


# Create global Redis client instance
redis_client = RedisClient(settings.REDIS_URL)
