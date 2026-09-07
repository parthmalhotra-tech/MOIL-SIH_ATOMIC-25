from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routes import prospecitivity, production
from app.core.exceptions import ModelInferenceError


app = FastAPI(
    title=settings.app_name
)
# ---------------------------------------------------------
# Routes
# ---------------------------------------------------------
app.include_router(prospecitivity.router)
app.include_router(production.router)
# ---------------------------------------------------------
# Model inference errors
# ---------------------------------------------------------
@app.exception_handler(ModelInferenceError)
def model_inference_error_handler(
    request: Request,
    exc: ModelInferenceError,
):
    return JSONResponse(
        status_code=500,
        content={
            "error": exc.message
        },
    )
# ---------------------------------------------------------
# CORS
# ---------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_methods=["*"],
    allow_headers=["*"],
)
# ---------------------------------------------------------
# Health
# ---------------------------------------------------------
@app.get("/health")
def health_check():
    return {
        "status": "ok"
    }
