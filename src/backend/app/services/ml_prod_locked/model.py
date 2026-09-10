import os

import joblib
import pandas as pd

from .feature_engineering import MODEL_FEATURES


# ============================================================
# MODEL ARTIFACT PATHS
# ============================================================

BASE_DIR = os.path.dirname(__file__)

CLASSIFIER_PATH = os.path.join(
    BASE_DIR,
    "MOIL_final_random_forest_classifier_moil_wide.joblib",
)

REGRESSOR_PATH = os.path.join(
    BASE_DIR,
    "MOIL_final_random_forest_regressor_moil_wide.joblib",
)


# ============================================================
# LOAD BOTH MODELS ONCE WHEN FASTAPI STARTS
# ============================================================

classifier_model = joblib.load(CLASSIFIER_PATH)
regressor_model = joblib.load(REGRESSOR_PATH)


# ============================================================
# COMMON INPUT BUILDER
# ============================================================

def _build_model_input(feature_values: dict) -> pd.DataFrame:
    """
    Validate and convert the seven MOIL-wide features into
    the exact dataframe structure expected by both models.
    """

    missing = [
        feature
        for feature in MODEL_FEATURES
        if feature not in feature_values
    ]

    if missing:
        raise ValueError(
            f"Missing production model features: {missing}"
        )

    X = pd.DataFrame(
        [[
            feature_values[feature]
            for feature in MODEL_FEATURES
        ]],
        columns=MODEL_FEATURES,
    )

    return X


# ============================================================
# CLASSIFIER
# ============================================================

def predict_classifier(feature_values: dict) -> dict:
    """
    Predict whether the current month is at risk of a
    production shortfall.

    Output:
        shortfall_probability
        shortfall_risk
        classification
    """

    X = _build_model_input(feature_values)

    probability = float(
        classifier_model.predict_proba(X)[0, 1]
    )

    # Matches the supplied ML deployment wrapper:
    # probability >= 0.50 => shortfall risk
    shortfall_risk = int(
        probability >= 0.50
    )

    return {
        "shortfall_probability": probability,
        "shortfall_risk": shortfall_risk,
        "classification": (
            "YES"
            if shortfall_risk == 1
            else "NO"
        ),
    }


# ============================================================
# REGRESSOR
# ============================================================

def predict_regressor(feature_values: dict) -> dict:
    """
    Predict the percentage production shortfall and convert
    that into forecast production.
    """

    X = _build_model_input(feature_values)

    predicted_shortfall_pct = max(
        0.0,
        float(
            regressor_model.predict(X)[0]
        ),
    )

    expected_production = float(
        feature_values[
            "expected_production_lakh_tonnes"
        ]
    )

    forecast_production = (
        expected_production
        *
        (
            1.0
            - predicted_shortfall_pct / 100.0
        )
    )

    return {
        "predicted_shortfall_pct":
            predicted_shortfall_pct,

        "expected_production_lakh_tonnes":
            expected_production,

        "forecast_production_lakh_tonnes":
            forecast_production,
    }


# ============================================================
# TEMPORARY BACKWARD-COMPATIBILITY ALIAS
# ============================================================

def predict_shortfall(feature_values: dict) -> dict:
    """
    Temporary alias so older backend imports do not fail
    while we refactor production_model.py.
    """

    return predict_classifier(
        feature_values
    )