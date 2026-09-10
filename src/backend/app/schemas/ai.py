from typing import Any, Literal

from pydantic import BaseModel, Field


class RecommendationItem(BaseModel):
    priority: Literal["HIGH", "MEDIUM", "LOW"]
    category: str
    action: str
    reason: str


class RecommendationResponse(BaseModel):
    overall_risk: Literal["HIGH", "MEDIUM", "LOW"]
    summary: str
    recommendations: list[RecommendationItem] = Field(
        min_length=1,
        max_length=5,
    )
    source: Literal["gemini", "fallback_rules"] = "gemini"


class ChatRequest(BaseModel):
    message: str = Field(
        min_length=2,
        max_length=2000,
    )
    context: dict[str, Any] | None = None


class ChatResponse(BaseModel):
    answer: str
    source: str = "gemini"