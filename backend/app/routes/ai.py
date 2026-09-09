from fastapi import APIRouter, HTTPException

from app.schemas.ai import (
    ChatRequest,
    ChatResponse,
    RecommendationResponse,
)

from app.services.ai_context import get_current_ai_context

from app.services.gemini_service import (
    answer_chat,
    generate_fallback_recommendations,
    generate_recommendations,
)


router = APIRouter(
    prefix="/ai",
    tags=["AI"],
)


@router.get(
    "/recommendations",
    response_model=RecommendationResponse,
)
def get_ai_recommendations():

    try:
        context = get_current_ai_context()

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail="Unable to generate the current production model context.",
        ) from exc

    try:
        return generate_recommendations(context)

    except Exception:
        # Keep recommendations available even when Gemini fails.
        return generate_fallback_recommendations(context)


@router.post(
    "/chat",
    response_model=ChatResponse,
)
def chat_with_ai(
    request: ChatRequest,
):
    try:
        # Dashboard already sends the current context.
        # Only calculate it here when context wasn't supplied.
        context = request.context

        if not context:
            context = get_current_ai_context()

        answer = answer_chat(
            message=request.message,
            context=context,
        )

        return ChatResponse(
            answer=answer,
            source="gemini",
        )

    except RuntimeError as exc:
        print("Gemini runtime error:", repr(exc))

        raise HTTPException(
            status_code=503,
            detail=str(exc),
        ) from exc

    except Exception as exc:
        print("AI chat error:", repr(exc))

        raise HTTPException(
            status_code=500,
            detail=str(exc),
        ) from exc