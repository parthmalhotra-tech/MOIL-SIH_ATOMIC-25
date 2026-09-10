"""
MOIL-wide deployment feature engineering.

Input: one row per mine and prediction checkpoint.
Required:
- production lag / expected production fields
- prediction_date OR days_in_month + prediction_day_of_month
- mine_name
- production_share
- raw rolling precipitation columns
- raw rolling surface-soil wetness columns

The rainfall and soil transformations use the recovered validated formulas.
MOIL-wide indices are production-share-weighted averages of the mine-level
indices. The classifier consumes exactly seven features.
"""

import numpy as np
import pandas as pd

MODEL_FEATURES = [
    "production_lag_1m_lakh_tonnes",
    "production_lag_2m_lakh_tonnes",
    "production_lag_3m_lakh_tonnes",
    "expected_production_lakh_tonnes",
    "month_progress_pct",
    "moil_weighted_rainfall_stress_index",
    "moil_weighted_soil_moisture_stress_index",
]

RAIN_COLUMNS = [
    "today_precipitation_mm_day",
    "w3d_sum_precipitation_mm_day",
    "w7d_sum_precipitation_mm_day",
    "w7d_max_precipitation_mm_day",
    "w30d_sum_precipitation_mm_day",
]
RAIN_SCALES = np.array([20.0, 50.0, 100.0, 50.0, 300.0])
SOIL_COLUMNS = [
    "w1d_mean_surface_soil_wetness_frac",
    "w7d_mean_surface_soil_wetness_frac",
    "w30d_mean_surface_soil_wetness_frac",
]

def build_mine_stress(df):
    out = df.copy()
    rain = out[RAIN_COLUMNS].astype(float).to_numpy()
    out["rainfall_stress_index"] = np.clip(
        rain / RAIN_SCALES, 0.0, 1.0
    ).mean(axis=1)
    out["soil_moisture_stress_index"] = (
        out[SOIL_COLUMNS].astype(float).mean(axis=1)
    )
    return out

def _weighted(group, value_col, weight_col="production_share"):
    w = group[weight_col].astype(float).to_numpy()
    x = group[value_col].astype(float).to_numpy()
    total = w.sum()
    if total <= 0:
        raise ValueError("Production-share weights must sum to > 0.")
    return float(np.sum(x * w) / total)

def build_moil_features(checkpoint_df):
    df = checkpoint_df.copy()

    required = [
        "production_lag_1m_lakh_tonnes",
        "production_lag_2m_lakh_tonnes",
        "production_lag_3m_lakh_tonnes",
        "expected_production_lakh_tonnes",
        "mine_name",
        "production_share",
        *RAIN_COLUMNS,
        *SOIL_COLUMNS,
    ]
    missing = [c for c in required if c not in df.columns]
    if missing:
        raise ValueError(f"Missing required columns: {missing}")

    if "prediction_day_of_month" not in df.columns:
        raise ValueError("prediction_day_of_month is required.")

    if "prediction_date" in df.columns:
        dates = pd.to_datetime(df["prediction_date"])
        days = dates.dt.days_in_month
    elif "days_in_month" in df.columns:
        days = df["days_in_month"].astype(float)
    else:
        raise ValueError("Need prediction_date or days_in_month.")

    df["month_progress_pct"] = (
        df["prediction_day_of_month"].astype(float) / days.astype(float) * 100.0
    )

    mine = build_mine_stress(df)

    # Aggregate environmental stress by prediction date. Production/time
    # features are expected to be identical across mine rows for a checkpoint.
    rows = []
    group_cols = ["prediction_date"] if "prediction_date" in mine.columns else ["prediction_month", "prediction_day_of_month"]

    for key, g in mine.groupby(group_cols, sort=True):
        row = {}
        if isinstance(key, tuple):
            for col, val in zip(group_cols, key):
                row[col] = val
        else:
            row[group_cols[0]] = key

        first = g.iloc[0]
        for col in [
            "production_lag_1m_lakh_tonnes",
            "production_lag_2m_lakh_tonnes",
            "production_lag_3m_lakh_tonnes",
            "expected_production_lakh_tonnes",
            "month_progress_pct",
        ]:
            row[col] = float(first[col])

        row["moil_weighted_rainfall_stress_index"] = _weighted(
            g, "rainfall_stress_index"
        )
        row["moil_weighted_soil_moisture_stress_index"] = _weighted(
            g, "soil_moisture_stress_index"
        )
        rows.append(row)

    return pd.DataFrame(rows)[MODEL_FEATURES]
