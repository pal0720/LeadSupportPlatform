"""Lead scoring AI endpoints."""
import logging
from typing import Any, Dict, List
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from services.ai_provider import ai_provider_manager

logger = logging.getLogger(__name__)

router = APIRouter()


class LeadScoringRequest(BaseModel):
    """Lead scoring request model."""
    email: str
    name: str | None = None
    title: str | None = None
    company_name: str | None = None
    company_domain: str | None = None
    company_size: str | None = None
    industry: str | None = None
    technologies: List[str] = Field(default_factory=list)
    website_visits: int = 0
    page_views: int = 0
    emails_opened: int = 0
    emails_clicked: int = 0
    source: str | None = None


class LeadScoringResponse(BaseModel):
    """Lead scoring response model."""
    score: int = Field(..., ge=0, le=100, description="Overall lead score (0-100)")
    fit_score: int = Field(..., ge=0, le=100, description="Company/person fit score")
    intent_score: int = Field(..., ge=0, le=100, description="Intent/interest score")
    engagement_score: int = Field(..., ge=0, le=100, description="Engagement score")
    ai_score: float = Field(..., ge=0, le=1, description="AI confidence score")
    reasoning: str = Field(..., description="Explanation of the score")
    factors: Dict[str, Any] = Field(..., description="Scoring factors breakdown")
    recommended_actions: List[str] = Field(..., description="Recommended next actions")


@router.post("/score-lead", response_model=LeadScoringResponse)
async def score_lead(request: LeadScoringRequest) -> Any:
    """
    Score a lead using AI-powered analysis.

    Analyzes lead data including:
    - Fit: Company size, industry, role/title
    - Intent: Website behavior, content engagement
    - Engagement: Email interactions, response patterns

    Returns:
        Comprehensive lead score with reasoning
    """
    try:
        # Build context for AI
        context = f"""
        Score this lead based on the following information:

        Contact Information:
        - Email: {request.email}
        - Name: {request.name or 'Unknown'}
        - Title: {request.title or 'Unknown'}

        Company Information:
        - Company: {request.company_name or 'Unknown'}
        - Domain: {request.company_domain or 'Unknown'}
        - Size: {request.company_size or 'Unknown'}
        - Industry: {request.industry or 'Unknown'}
        - Technologies: {', '.join(request.technologies) if request.technologies else 'Unknown'}

        Engagement Data:
        - Website visits: {request.website_visits}
        - Page views: {request.page_views}
        - Emails opened: {request.emails_opened}
        - Emails clicked: {request.emails_clicked}
        - Source: {request.source or 'Unknown'}

        Please provide:
        1. Overall score (0-100)
        2. Fit score (0-100): How well does this lead match our ideal customer profile?
        3. Intent score (0-100): How much interest/buying intent is shown?
        4. Engagement score (0-100): How engaged are they with our content?
        5. Reasoning: Detailed explanation of the scores
        6. Key factors: List the most important factors affecting the score
        7. Recommended actions: 3-5 specific next steps

        Format your response as JSON with these fields:
        {{
          "overall_score": <number>,
          "fit_score": <number>,
          "intent_score": <number>,
          "engagement_score": <number>,
          "reasoning": "<explanation>",
          "key_factors": ["<factor1>", "<factor2>", ...],
          "recommended_actions": ["<action1>", "<action2>", ...]
        }}
        """

        messages = [
            {
                "role": "system",
                "content": "You are an expert B2B sales lead scoring analyst. Provide accurate, data-driven lead scores."
            },
            {
                "role": "user",
                "content": context
            }
        ]

        # Generate AI scoring
        response = await ai_provider_manager.generate_completion(
            messages=messages,
            temperature=0.3,  # Lower temperature for consistent scoring
            max_tokens=1000
        )

        # Parse JSON response
        import json
        try:
            # Extract JSON from response
            json_start = response.find('{')
            json_end = response.rfind('}') + 1
            json_str = response[json_start:json_end]
            result = json.loads(json_str)
        except (ValueError, json.JSONDecodeError):
            # Fallback to basic scoring if JSON parsing fails
            logger.warning("Failed to parse AI response, using fallback scoring")
            result = _fallback_scoring(request)

        # Build response
        return LeadScoringResponse(
            score=result.get("overall_score", 50),
            fit_score=result.get("fit_score", 50),
            intent_score=result.get("intent_score", 50),
            engagement_score=result.get("engagement_score", 50),
            ai_score=0.85,  # Confidence in AI scoring
            reasoning=result.get("reasoning", "Score based on available data"),
            factors={
                "key_factors": result.get("key_factors", []),
                "company_fit": request.company_size and request.industry,
                "engagement_level": request.emails_opened > 0 or request.website_visits > 0,
                "has_intent_signals": request.page_views > 5 or request.emails_clicked > 0,
            },
            recommended_actions=result.get("recommended_actions", [
                "Send personalized outreach email",
                "Monitor website activity",
                "Assign to sales rep"
            ])
        )

    except Exception as e:
        logger.error(f"Lead scoring error: {e}")
        raise HTTPException(status_code=500, detail=f"Scoring failed: {str(e)}")


def _fallback_scoring(request: LeadScoringRequest) -> Dict[str, Any]:
    """Fallback scoring when AI parsing fails."""
    # Simple rule-based scoring
    fit_score = 0
    if request.company_name:
        fit_score += 20
    if request.title and any(keyword in (request.title or "").lower() for keyword in ["director", "vp", "manager", "head"]):
        fit_score += 30
    if request.company_size in ["101-500", "501-1000", "1000+"]:
        fit_score += 25
    if request.industry:
        fit_score += 25

    engagement_score = min(100, (
        request.emails_opened * 10 +
        request.emails_clicked * 20 +
        request.website_visits * 5
    ))

    intent_score = min(100, (
        request.page_views * 5 +
        (50 if request.emails_clicked > 0 else 0)
    ))

    overall_score = int((fit_score + engagement_score + intent_score) / 3)

    return {
        "overall_score": overall_score,
        "fit_score": fit_score,
        "intent_score": intent_score,
        "engagement_score": engagement_score,
        "reasoning": "Score calculated using rule-based fallback system",
        "key_factors": ["Company information available", "Engagement detected"],
        "recommended_actions": [
            "Review lead details",
            "Send outreach email",
            "Track engagement"
        ]
    }
