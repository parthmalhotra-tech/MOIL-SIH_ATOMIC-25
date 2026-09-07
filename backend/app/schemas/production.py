from pydantic import BaseModel
from typing import List

class HistoricalPoint(BaseModel):
    month: str
    production_lakh_tonnes: float

class ProductionOutput(BaseModel):
    prediction_date: str

    # Classifier outputs
    shortfall_probability: float
    shortfall_risk: int
    classification: str

    # Regressor outputs
    predicted_shortfall_pct: float
    forecast_production_lakh_tonnes: float
    expected_production_lakh_tonnes: float

    # Environmental/model features
    moil_weighted_rainfall_stress_index: float
    moil_weighted_soil_moisture_stress_index: float
    month_progress_pct: float

    # Historical production
    historical: List[HistoricalPoint]
