"""
Multimodal content generation service.
Supports text, image, video, and audio generation using various AI providers.
"""
from typing import Optional, Dict, Any, List
from enum import Enum
import httpx
import os
import base64
import json
from datetime import datetime


class ContentType(str, Enum):
    TEXT = "text"
    IMAGE = "image"
    VIDEO = "video"
    AUDIO = "audio"


class MultimodalGenerator:
    """Unified interface for multimodal AI content generation."""

    def __init__(self):
        self.openai_api_key = os.getenv("OPENAI_API_KEY")
        self.anthropic_api_key = os.getenv("ANTHROPIC_API_KEY")
        self.stability_api_key = os.getenv("STABILITY_API_KEY")  # For image generation
        self.elevenlabs_api_key = os.getenv("ELEVENLABS_API_KEY")  # For audio generation

    async def generate_text(
        self,
        prompt: str,
        model: str = "gpt-4-turbo-preview",
        max_tokens: int = 2000,
        temperature: float = 0.7,
        system_prompt: Optional[str] = None,
        brand_voice: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Generate text content using OpenAI or Anthropic models.

        Args:
            prompt: The content prompt
            model: Model to use (gpt-4-turbo-preview, claude-3-opus-20240229, etc.)
            max_tokens: Maximum tokens to generate
            temperature: Creativity level (0-2)
            system_prompt: System prompt for context
            brand_voice: Brand voice guidelines to apply

        Returns:
            Dict with generated content and metadata
        """
        try:
            # Apply brand voice if provided
            if brand_voice:
                enhanced_prompt = f"{brand_voice}\n\nUser request: {prompt}"
            else:
                enhanced_prompt = prompt

            if model.startswith("gpt"):
                return await self._generate_text_openai(
                    enhanced_prompt, model, max_tokens, temperature, system_prompt
                )
            elif model.startswith("claude"):
                return await self._generate_text_anthropic(
                    enhanced_prompt, model, max_tokens, temperature, system_prompt
                )
            else:
                raise ValueError(f"Unsupported text model: {model}")

        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "content": None,
            }

    async def _generate_text_openai(
        self,
        prompt: str,
        model: str,
        max_tokens: int,
        temperature: float,
        system_prompt: Optional[str],
    ) -> Dict[str, Any]:
        """Generate text using OpenAI API."""
        async with httpx.AsyncClient() as client:
            messages = []
            if system_prompt:
                messages.append({"role": "system", "content": system_prompt})
            messages.append({"role": "user", "content": prompt})

            response = await client.post(
                "https://api.openai.com/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {self.openai_api_key}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": model,
                    "messages": messages,
                    "max_tokens": max_tokens,
                    "temperature": temperature,
                },
                timeout=120.0,
            )
            response.raise_for_status()
            data = response.json()

            return {
                "success": True,
                "content": data["choices"][0]["message"]["content"],
                "model": model,
                "usage": data.get("usage", {}),
                "finish_reason": data["choices"][0].get("finish_reason"),
            }

    async def _generate_text_anthropic(
        self,
        prompt: str,
        model: str,
        max_tokens: int,
        temperature: float,
        system_prompt: Optional[str],
    ) -> Dict[str, Any]:
        """Generate text using Anthropic API."""
        async with httpx.AsyncClient() as client:
            payload = {
                "model": model,
                "max_tokens": max_tokens,
                "temperature": temperature,
                "messages": [{"role": "user", "content": prompt}],
            }
            if system_prompt:
                payload["system"] = system_prompt

            response = await client.post(
                "https://api.anthropic.com/v1/messages",
                headers={
                    "x-api-key": self.anthropic_api_key,
                    "anthropic-version": "2023-06-01",
                    "Content-Type": "application/json",
                },
                json=payload,
                timeout=120.0,
            )
            response.raise_for_status()
            data = response.json()

            return {
                "success": True,
                "content": data["content"][0]["text"],
                "model": model,
                "usage": data.get("usage", {}),
                "stop_reason": data.get("stop_reason"),
            }

    async def generate_image(
        self,
        prompt: str,
        model: str = "dall-e-3",
        size: str = "1024x1024",
        quality: str = "standard",
        style: Optional[str] = None,
        brand_colors: Optional[List[str]] = None,
    ) -> Dict[str, Any]:
        """
        Generate image using DALL-E or Stable Diffusion.

        Args:
            prompt: Image description/prompt
            model: Model to use (dall-e-3, dall-e-2, stable-diffusion-xl)
            size: Image dimensions (1024x1024, 1792x1024, 1024x1792 for DALL-E 3)
            quality: Quality level (standard, hd)
            style: Style preference (vivid, natural)
            brand_colors: Brand color palette to incorporate

        Returns:
            Dict with image URL/data and metadata
        """
        try:
            # Enhance prompt with brand colors if provided
            enhanced_prompt = prompt
            if brand_colors:
                color_desc = ", ".join(brand_colors)
                enhanced_prompt = f"{prompt}. Use these brand colors: {color_desc}"

            if model.startswith("dall-e"):
                return await self._generate_image_dalle(
                    enhanced_prompt, model, size, quality, style
                )
            elif model == "stable-diffusion-xl":
                return await self._generate_image_stability(enhanced_prompt, size)
            else:
                raise ValueError(f"Unsupported image model: {model}")

        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "image_url": None,
            }

    async def _generate_image_dalle(
        self,
        prompt: str,
        model: str,
        size: str,
        quality: str,
        style: Optional[str],
    ) -> Dict[str, Any]:
        """Generate image using DALL-E."""
        async with httpx.AsyncClient() as client:
            payload = {
                "model": model,
                "prompt": prompt,
                "size": size,
                "quality": quality,
                "n": 1,
            }
            if style:
                payload["style"] = style

            response = await client.post(
                "https://api.openai.com/v1/images/generations",
                headers={
                    "Authorization": f"Bearer {self.openai_api_key}",
                    "Content-Type": "application/json",
                },
                json=payload,
                timeout=120.0,
            )
            response.raise_for_status()
            data = response.json()

            return {
                "success": True,
                "image_url": data["data"][0]["url"],
                "revised_prompt": data["data"][0].get("revised_prompt"),
                "model": model,
                "size": size,
                "quality": quality,
            }

    async def _generate_image_stability(
        self, prompt: str, size: str
    ) -> Dict[str, Any]:
        """Generate image using Stability AI (Stable Diffusion)."""
        # Parse size
        width, height = map(int, size.split("x"))

        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image",
                headers={
                    "Authorization": f"Bearer {self.stability_api_key}",
                    "Content-Type": "application/json",
                },
                json={
                    "text_prompts": [{"text": prompt, "weight": 1.0}],
                    "cfg_scale": 7,
                    "height": height,
                    "width": width,
                    "samples": 1,
                    "steps": 30,
                },
                timeout=120.0,
            )
            response.raise_for_status()
            data = response.json()

            # Stability returns base64 encoded images
            image_data = data["artifacts"][0]["base64"]

            return {
                "success": True,
                "image_data_base64": image_data,
                "model": "stable-diffusion-xl",
                "size": size,
                "seed": data["artifacts"][0].get("seed"),
            }

    async def generate_video(
        self,
        prompt: str,
        duration: int = 5,
        model: str = "runway-gen2",
        fps: int = 24,
        resolution: str = "1280x720",
    ) -> Dict[str, Any]:
        """
        Generate video using Runway or similar services.

        Args:
            prompt: Video description
            duration: Video duration in seconds
            model: Model to use (runway-gen2, etc.)
            fps: Frames per second
            resolution: Video resolution

        Returns:
            Dict with video URL/ID and metadata
        """
        try:
            # Note: This is a placeholder implementation
            # Actual implementation would integrate with Runway ML, Synthesia, or similar

            return {
                "success": True,
                "video_url": None,  # Would contain actual video URL
                "job_id": "placeholder_job_id",
                "status": "pending",
                "model": model,
                "duration": duration,
                "resolution": resolution,
                "message": "Video generation initiated. Check job_id for status.",
            }

        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "video_url": None,
            }

    async def generate_audio(
        self,
        text: str,
        voice_id: str = "default",
        model: str = "eleven_multilingual_v2",
        stability: float = 0.5,
        similarity_boost: float = 0.75,
    ) -> Dict[str, Any]:
        """
        Generate audio/speech using ElevenLabs or similar services.

        Args:
            text: Text to convert to speech
            voice_id: Voice ID to use
            model: TTS model
            stability: Voice stability (0-1)
            similarity_boost: Voice similarity (0-1)

        Returns:
            Dict with audio URL/data and metadata
        """
        try:
            if not self.elevenlabs_api_key:
                raise ValueError("ElevenLabs API key not configured")

            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}",
                    headers={
                        "xi-api-key": self.elevenlabs_api_key,
                        "Content-Type": "application/json",
                    },
                    json={
                        "text": text,
                        "model_id": model,
                        "voice_settings": {
                            "stability": stability,
                            "similarity_boost": similarity_boost,
                        },
                    },
                    timeout=120.0,
                )
                response.raise_for_status()

                # ElevenLabs returns audio data
                audio_data = response.content

                return {
                    "success": True,
                    "audio_data_base64": base64.b64encode(audio_data).decode(),
                    "model": model,
                    "voice_id": voice_id,
                    "text_length": len(text),
                }

        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "audio_data_base64": None,
            }

    async def generate_content(
        self,
        content_type: ContentType,
        prompt: str,
        brand_kit: Optional[Dict[str, Any]] = None,
        **kwargs,
    ) -> Dict[str, Any]:
        """
        Unified content generation method.

        Args:
            content_type: Type of content to generate
            prompt: Generation prompt
            brand_kit: Brand kit configuration (voice, colors, fonts, etc.)
            **kwargs: Additional parameters specific to content type

        Returns:
            Dict with generated content and metadata
        """
        # Extract brand kit parameters
        brand_voice = brand_kit.get("brand_voice") if brand_kit else None
        brand_colors = brand_kit.get("brand_colors", {}).values() if brand_kit else None

        if content_type == ContentType.TEXT:
            return await self.generate_text(
                prompt=prompt,
                brand_voice=brand_voice,
                **kwargs,
            )
        elif content_type == ContentType.IMAGE:
            return await self.generate_image(
                prompt=prompt,
                brand_colors=list(brand_colors) if brand_colors else None,
                **kwargs,
            )
        elif content_type == ContentType.VIDEO:
            return await self.generate_video(prompt=prompt, **kwargs)
        elif content_type == ContentType.AUDIO:
            return await self.generate_audio(text=prompt, **kwargs)
        else:
            raise ValueError(f"Unsupported content type: {content_type}")

    async def generate_multi_channel_content(
        self,
        base_prompt: str,
        channels: List[str],
        brand_kit: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """
        Generate content optimized for multiple channels simultaneously.

        Args:
            base_prompt: Base content idea/prompt
            channels: List of channels (e.g., ["linkedin", "twitter", "instagram"])
            brand_kit: Brand kit configuration

        Returns:
            Dict mapping channels to generated content
        """
        results = {}

        # Channel-specific optimizations
        channel_configs = {
            "linkedin": {
                "max_length": 3000,
                "tone": "professional and insightful",
                "format": "Long-form professional content with line breaks",
            },
            "twitter": {
                "max_length": 280,
                "tone": "concise and engaging",
                "format": "Short, punchy statement with optional thread",
            },
            "instagram": {
                "max_length": 2200,
                "tone": "visual and engaging",
                "format": "Caption with emojis and hashtags",
            },
            "facebook": {
                "max_length": 63206,
                "tone": "conversational and friendly",
                "format": "Engaging story-driven content",
            },
            "email": {
                "max_length": 5000,
                "tone": "personalized and valuable",
                "format": "Email with subject, body, and CTA",
            },
        }

        for channel in channels:
            config = channel_configs.get(channel, {})
            channel_prompt = f"""
            Create content for {channel} based on this idea: {base_prompt}

            Requirements:
            - Tone: {config.get('tone', 'engaging')}
            - Format: {config.get('format', 'standard')}
            - Max length: {config.get('max_length', 1000)} characters
            - Platform: {channel}
            """

            result = await self.generate_text(
                prompt=channel_prompt,
                brand_voice=brand_kit.get("brand_voice") if brand_kit else None,
                temperature=0.8,
            )

            results[channel] = result

        return {
            "success": True,
            "base_prompt": base_prompt,
            "channels": results,
            "generated_at": datetime.utcnow().isoformat(),
        }


# Singleton instance
multimodal_generator = MultimodalGenerator()
