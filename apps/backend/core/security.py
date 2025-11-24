"""
Security utilities for authentication, authorization, and data protection.
"""
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
import asyncio
import hashlib
import hmac
import secrets
import re
from cryptography.fernet import Fernet
from jose import JWTError, jwt
import bcrypt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import base64

from core.config import settings

# Bearer token security
security = HTTPBearer()


def hash_password(password: str) -> str:
    """
    Hash a password using bcrypt.

    Args:
        password: Plain text password

    Returns:
        Hashed password

    Note:
        Bcrypt has a 72-byte limitation. Passwords are truncated to 72 bytes
        before hashing to prevent errors.
    """
    # Bcrypt can only handle passwords up to 72 bytes
    # Truncate to ensure compatibility
    password_bytes = password.encode('utf-8')[:72]
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password_bytes, salt)
    return hashed.decode('utf-8')


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a password against a hash.

    Args:
        plain_password: Plain text password
        hashed_password: Hashed password

    Returns:
        True if password matches

    Note:
        Bcrypt has a 72-byte limitation. Passwords are truncated to 72 bytes
        before verification to match the hashing behavior.
    """
    # Bcrypt can only handle passwords up to 72 bytes
    # Truncate to match the hash_password behavior
    password_bytes = plain_password.encode('utf-8')[:72]
    hashed_bytes = hashed_password.encode('utf-8')
    return bcrypt.checkpw(password_bytes, hashed_bytes)


def create_access_token(
    data: Dict[str, Any],
    expires_delta: Optional[timedelta] = None
) -> str:
    """
    Create a JWT access token.

    Args:
        data: Data to encode in token
        expires_delta: Token expiration time

    Returns:
        Encoded JWT token
    """
    to_encode = data.copy()

    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(
            minutes=settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES
        )

    to_encode.update({"exp": expire, "type": "access"})

    return jwt.encode(
        to_encode,
        settings.JWT_SECRET,
        algorithm=settings.JWT_ALGORITHM
    )


def create_refresh_token(
    data: Dict[str, Any],
    expires_delta: Optional[timedelta] = None
) -> str:
    """
    Create a JWT refresh token.

    Args:
        data: Data to encode in token
        expires_delta: Token expiration time

    Returns:
        Encoded JWT token
    """
    to_encode = data.copy()

    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(
            days=settings.JWT_REFRESH_TOKEN_EXPIRE_DAYS
        )

    to_encode.update({"exp": expire, "type": "refresh"})

    return jwt.encode(
        to_encode,
        settings.JWT_SECRET,
        algorithm=settings.JWT_ALGORITHM
    )


def decode_token(token: str) -> Dict[str, Any]:
    """
    Decode and verify a JWT token.

    Args:
        token: JWT token to decode

    Returns:
        Decoded token payload

    Raises:
        HTTPException: If token is invalid or expired
    """
    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET,
            algorithms=[settings.JWT_ALGORITHM]
        )
        return payload
    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )


async def get_current_user_id(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> str:
    """
    Get current user ID from JWT token.

    Args:
        credentials: HTTP bearer credentials

    Returns:
        User ID

    Raises:
        HTTPException: If token is invalid or missing user_id
    """
    token = credentials.credentials
    payload = decode_token(token)

    user_id: Optional[str] = payload.get("sub")
    token_type: Optional[str] = payload.get("type")

    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
        )

    if token_type != "access":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token type",
        )

    return user_id


def require_roles(*allowed_roles: str):
    """
    Dependency to require specific roles for an endpoint.

    Args:
        allowed_roles: Roles that are allowed to access the endpoint

    Returns:
        Dependency function
    """
    async def role_checker(
        credentials: HTTPAuthorizationCredentials = Depends(security)
    ) -> str:
        token = credentials.credentials
        payload = decode_token(token)

        user_id: Optional[str] = payload.get("sub")
        user_role: Optional[str] = payload.get("role")

        if user_id is None or user_role is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
            )

        if user_role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions",
            )

        return user_id

    return role_checker


class EncryptionService:
    """
    Service for encrypting and decrypting sensitive data using Fernet encryption.
    """

    def __init__(self, encryption_key: Optional[str] = None):
        """
        Initialize encryption service.

        Args:
            encryption_key: Base64-encoded Fernet key. If not provided, uses JWT_SECRET.
        """
        if encryption_key:
            self.key = encryption_key.encode()
        else:
            # Derive key from JWT_SECRET for backwards compatibility
            key_hash = hashlib.sha256(settings.JWT_SECRET.encode()).digest()
            self.key = base64.urlsafe_b64encode(key_hash)

        self.cipher = Fernet(self.key)

    def encrypt(self, data: str) -> str:
        """
        Encrypt a string.

        Args:
            data: Plain text to encrypt

        Returns:
            Encrypted string (base64-encoded)
        """
        encrypted = self.cipher.encrypt(data.encode())
        return encrypted.decode()

    def decrypt(self, encrypted_data: str) -> str:
        """
        Decrypt a string.

        Args:
            encrypted_data: Encrypted string (base64-encoded)

        Returns:
            Decrypted plain text

        Raises:
            ValueError: If decryption fails
        """
        try:
            decrypted = self.cipher.decrypt(encrypted_data.encode())
            return decrypted.decode()
        except Exception as e:
            raise ValueError(f"Decryption failed: {str(e)}")


class WebhookSecurity:
    """
    Service for webhook signature generation and verification using HMAC.
    """

    def __init__(self, secret: Optional[str] = None):
        """
        Initialize webhook security.

        Args:
            secret: Webhook signing secret. If not provided, uses JWT_SECRET.
        """
        self.secret = (secret or settings.JWT_SECRET).encode()

    def generate_signature(self, payload: str, timestamp: Optional[str] = None) -> str:
        """
        Generate HMAC signature for webhook payload.

        Args:
            payload: Webhook payload (JSON string)
            timestamp: Optional timestamp to include in signature

        Returns:
            HMAC signature (hex-encoded)
        """
        if timestamp:
            message = f"{timestamp}.{payload}".encode()
        else:
            message = payload.encode()

        signature = hmac.new(self.secret, message, hashlib.sha256).hexdigest()
        return signature

    def verify_signature(
        self,
        payload: str,
        signature: str,
        timestamp: Optional[str] = None,
        tolerance: int = 300
    ) -> bool:
        """
        Verify webhook signature.

        Args:
            payload: Webhook payload (JSON string)
            signature: Provided signature to verify
            timestamp: Optional timestamp from webhook
            tolerance: Time tolerance in seconds for timestamp validation

        Returns:
            True if signature is valid

        Raises:
            ValueError: If signature is invalid or timestamp is outside tolerance
        """
        if timestamp:
            # Verify timestamp is within tolerance
            try:
                ts = int(timestamp)
                current = int(datetime.utcnow().timestamp())
                if abs(current - ts) > tolerance:
                    raise ValueError("Timestamp outside tolerance window")
            except (ValueError, TypeError):
                raise ValueError("Invalid timestamp")

        expected = self.generate_signature(payload, timestamp)

        # Use constant-time comparison to prevent timing attacks
        return hmac.compare_digest(signature, expected)


class RateLimiter:
    """
    In-memory rate limiter with sliding window.
    """

    def __init__(self):
        """Initialize rate limiter."""
        self._requests: Dict[str, list] = {}
        self._locks: Dict[str, asyncio.Lock] = {}

    async def check_rate_limit(
        self,
        key: str,
        max_requests: int,
        window_seconds: int
    ) -> bool:
        """
        Check if request is within rate limit.

        Args:
            key: Identifier for the rate limit (e.g., user_id, ip_address)
            max_requests: Maximum number of requests allowed
            window_seconds: Time window in seconds

        Returns:
            True if within rate limit, False otherwise
        """
        # Get or create lock for this key
        if key not in self._locks:
            self._locks[key] = asyncio.Lock()

        async with self._locks[key]:
            now = datetime.utcnow().timestamp()

            # Initialize or get request history
            if key not in self._requests:
                self._requests[key] = []

            # Remove old requests outside the window
            cutoff = now - window_seconds
            self._requests[key] = [
                ts for ts in self._requests[key] if ts > cutoff
            ]

            # Check if under limit
            if len(self._requests[key]) < max_requests:
                self._requests[key].append(now)
                return True

            return False

    async def reset(self, key: str):
        """
        Reset rate limit for a key.

        Args:
            key: Identifier to reset
        """
        if key in self._requests:
            del self._requests[key]
        if key in self._locks:
            del self._locks[key]


class DataSanitizer:
    """
    Service for sanitizing and validating input data.
    """

    # XSS patterns to detect
    XSS_PATTERNS = [
        re.compile(r'<script[^>]*>.*?</script>', re.IGNORECASE | re.DOTALL),
        re.compile(r'javascript:', re.IGNORECASE),
        re.compile(r'on\w+\s*=', re.IGNORECASE),
        re.compile(r'<iframe[^>]*>', re.IGNORECASE),
    ]

    # SQL injection patterns
    SQL_PATTERNS = [
        re.compile(r"(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC)\b)", re.IGNORECASE),
        re.compile(r"(\bunion\b.*\bselect\b)", re.IGNORECASE),
        re.compile(r"(--|;|\/\*|\*\/)", re.IGNORECASE),
    ]

    @staticmethod
    def sanitize_html(text: str) -> str:
        """
        Remove potentially dangerous HTML/JavaScript from text.

        Args:
            text: Input text to sanitize

        Returns:
            Sanitized text
        """
        sanitized = text
        for pattern in DataSanitizer.XSS_PATTERNS:
            sanitized = pattern.sub('', sanitized)
        return sanitized

    @staticmethod
    def detect_sql_injection(text: str) -> bool:
        """
        Detect potential SQL injection attempts.

        Args:
            text: Input text to check

        Returns:
            True if potential SQL injection detected
        """
        for pattern in DataSanitizer.SQL_PATTERNS:
            if pattern.search(text):
                return True
        return False

    @staticmethod
    def sanitize_filename(filename: str) -> str:
        """
        Sanitize filename to prevent directory traversal attacks.

        Args:
            filename: Input filename

        Returns:
            Sanitized filename
        """
        # Remove path separators and null bytes
        sanitized = filename.replace('/', '').replace('\\', '').replace('\0', '')

        # Remove leading dots
        sanitized = sanitized.lstrip('.')

        # Limit length
        if len(sanitized) > 255:
            sanitized = sanitized[:255]

        return sanitized

    @staticmethod
    def validate_email(email: str) -> bool:
        """
        Validate email format.

        Args:
            email: Email address to validate

        Returns:
            True if valid email format
        """
        pattern = re.compile(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')
        return bool(pattern.match(email))

    @staticmethod
    def validate_url(url: str) -> bool:
        """
        Validate URL format.

        Args:
            url: URL to validate

        Returns:
            True if valid URL format
        """
        pattern = re.compile(
            r'^https?://'  # http:// or https://
            r'(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+[A-Z]{2,6}\.?|'  # domain
            r'localhost|'  # localhost
            r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})'  # ...or ip
            r'(?::\d+)?'  # optional port
            r'(?:/?|[/?]\S+)$', re.IGNORECASE
        )
        return bool(pattern.match(url))


class APIKeySecurity:
    """
    Service for API key generation and validation.
    """

    @staticmethod
    def generate_api_key(prefix: str = "sk") -> str:
        """
        Generate a secure API key.

        Args:
            prefix: Key prefix (e.g., 'sk' for secret key)

        Returns:
            Generated API key
        """
        random_bytes = secrets.token_bytes(32)
        key = base64.urlsafe_b64encode(random_bytes).decode().rstrip('=')
        return f"{prefix}_{key}"

    @staticmethod
    def hash_api_key(api_key: str) -> str:
        """
        Hash an API key for storage.

        Args:
            api_key: API key to hash

        Returns:
            Hashed API key
        """
        key_hash = hashlib.sha256(api_key.encode()).hexdigest()
        return key_hash

    @staticmethod
    def verify_api_key(api_key: str, hashed_key: str) -> bool:
        """
        Verify an API key against a hash.

        Args:
            api_key: API key to verify
            hashed_key: Stored hash

        Returns:
            True if API key matches hash
        """
        return hmac.compare_digest(
            APIKeySecurity.hash_api_key(api_key),
            hashed_key
        )


# Singleton instances
encryption_service = EncryptionService()
webhook_security = WebhookSecurity()
rate_limiter = RateLimiter()
data_sanitizer = DataSanitizer()
api_key_security = APIKeySecurity()
