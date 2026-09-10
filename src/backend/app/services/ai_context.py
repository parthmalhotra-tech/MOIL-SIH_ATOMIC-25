from datetime import date
from typing import Any

from app.services.production_model import (
    get_production_forecast,
)


def get_current_ai_context() -> dict[str, Any]:
    """
    Runs the existing MOIL production forecasting pipeline
    and converts the result into a plain dictionary for Gemini.
    """

    forecast = get_production_forecast(
        prediction_date=date.today()
    )

    if hasattr(forecast, "model_dump"):
        data = forecast.model_dump()
    elif isinstance(forecast, dict):
        data = forecast
    else:
        data = vars(forecast)

    return {
        "prediction_date": data.get(
            "prediction_date"
        ),

        "expected_production_lakh_tonnes": data.get(
            "expected_production_lakh_tonnes"
        ),

        "forecast_production_lakh_tonnes": data.get(
            "forecast_production_lakh_tonnes"
        ),

        "predicted_shortfall_pct": data.get(
            "predicted_shortfall_pct"
        ),

        "shortfall_probability": data.get(
            "shortfall_probability"
        ),

        "shortfall_risk": data.get(
            "shortfall_risk"
        ),

        "classification": data.get(
            "classification"
        ),

        "moil_weighted_rainfall_stress_index": data.get(
            "moil_weighted_rainfall_stress_index"
        ),

        "moil_weighted_soil_moisture_stress_index": data.get(
            "moil_weighted_soil_moisture_stress_index"
        ),

        "month_progress_pct": data.get(
            "month_progress_pct"
        ),

        "historical": data.get(
            "historical",
            [],
        ),
    }