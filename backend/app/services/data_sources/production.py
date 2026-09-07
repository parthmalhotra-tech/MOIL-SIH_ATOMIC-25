import pandas as pd
# ============================================================
# MOIL-WIDE MONTHLY PRODUCTION DATA
# MVP: hardcoded until a production database is connected.
#
# Units: lakh tonnes
#
# For September 2026 prediction:
#   lag 1 = August 2026
#   lag 2 = July 2026
#   lag 3 = June 2026
# ============================================================

JUNE_2026_PRODUCTION = 2.58
JULY_2026_PRODUCTION = 2.61
AUGUST_2026_PRODUCTION = 2.49

SEPTEMBER_2026_TARGET = 2.70

def get_production_context(prediction_date) -> dict:
    """
    Returns the MOIL-wide production inputs required by both:

    1. Production shortfall classifier
    2. Production shortfall regressor

    The current MVP is configured specifically for September 2026.
    """

    prediction_date = pd.Timestamp(prediction_date).normalize()

    # --------------------------------------------------------
    # Protect against accidentally using September's hardcoded
    # production context for another prediction month.
    # --------------------------------------------------------
    if prediction_date.year != 2026 or prediction_date.month != 9:
        raise ValueError(
            "Current production MVP supports September 2026 only. "
            "Update the hardcoded production lags and monthly target "
            "before predicting another month."
        )

    historical = [
        {
            "month": "2026-06",
            "production_lakh_tonnes": JUNE_2026_PRODUCTION,
        },
        {
            "month": "2026-07",
            "production_lakh_tonnes": JULY_2026_PRODUCTION,
        },
        {
            "month": "2026-08",
            "production_lakh_tonnes": AUGUST_2026_PRODUCTION,
        },
    ]

    return {
        # Exact feature names expected by both ML models
        "production_lag_1m_lakh_tonnes": AUGUST_2026_PRODUCTION,
        "production_lag_2m_lakh_tonnes": JULY_2026_PRODUCTION,
        "production_lag_3m_lakh_tonnes": JUNE_2026_PRODUCTION,
        "expected_production_lakh_tonnes": SEPTEMBER_2026_TARGET,

        # Dashboard / response information
        "prediction_month": "2026-09",
        "historical": historical,
    }