import os
import joblib
import pandas as pd
from app.services.ml_prosp_locked.feature_engineering import feature_engineering

BASE_DIR = os.path.dirname(__file__)
MODELS = joblib.load(os.path.join(BASE_DIR, "model", "manganese_prospectivity_ensemble.pkl"))
WEIGHTS = joblib.load(os.path.join(BASE_DIR, "model", "manganese_ensemble_weights.pkl"))

REQUIRED_FEATURES = [
    "B02", "B03", "B04", "B08", "B11", "B12", "NDVI", "NDWI", "BSI",
    "cloud_cover", "elevation_m", "slope_deg", "terrain_relief_m"
]

def get_category(p: float) -> str:
    if p < 0.30: return "Very Low"
    if p < 0.50: return "Low"
    if p < 0.70: return "Moderate"
    if p < 0.85: return "High"
    return "Very High"

def predict_prospectivity(feature_values: dict) -> dict:
    missing = [f for f in REQUIRED_FEATURES if f not in feature_values]
    if missing:
        raise ValueError(f"Missing model features: {missing}")

    raw = pd.DataFrame([feature_values])
    engineered = feature_engineering(raw)

    probability = 0.0
    for name, model in MODELS.items():
        p = float(model.predict_proba(engineered)[:, 1][0])
        probability += WEIGHTS[name] * p

    return {
        "manganese_probability": round(float(probability), 6),
        "manganese_prediction": int(probability >= 0.5),
        "prospectivity": get_category(float(probability)),
    }