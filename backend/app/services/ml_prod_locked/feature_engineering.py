"""
MOIL-wide production feature engineering.

Input:
    One row per mine for a prediction checkpoint.

Each mine row must contain:
    - production lag values
    - expected production
    - prediction date/day
    - mine name
    - production share
    - rainfall rolling variables
    - soil-moisture rolling variables

The process is:

    mine weather
        ↓
    mine rainfall stress
    mine soil stress
        ↓
    production-share weighted aggregation
        ↓
    MOIL-wide rainfall stress
    MOIL-wide soil-moisture stress

For the current MVP every mine has:
    production_share = 0.10

Therefore the weighted MOIL stress is simply the
average of the 10 mine-level stress values.
"""

import numpy as np
import pandas as pd


# ============================================================
# EXACT FEATURES EXPECTED BY BOTH NEW MODELS
# ============================================================

MODEL_FEATURES = [
    "production_lag_1m_lakh_tonnes",
    "production_lag_2m_lakh_tonnes",
    "production_lag_3m_lakh_tonnes",
    "expected_production_lakh_tonnes",
    "month_progress_pct",
    "moil_weighted_rainfall_stress_index",
    "moil_weighted_soil_moisture_stress_index",
]


# ============================================================
# RAINFALL INPUTS
# ============================================================

RAIN_COLUMNS = [
    "today_precipitation_mm_day",
    "w3d_sum_precipitation_mm_day",
    "w7d_sum_precipitation_mm_day",
    "w7d_max_precipitation_mm_day",
    "w30d_sum_precipitation_mm_day",
]


# Scaling values recovered from the ML training pipeline
RAIN_SCALES = np.array(
    [
        20.0,
        50.0,
        100.0,
        50.0,
        300.0,
    ]
)


# ============================================================
# SOIL INPUTS
# ============================================================

SOIL_COLUMNS = [
    "w1d_mean_surface_soil_wetness_frac",
    "w7d_mean_surface_soil_wetness_frac",
    "w30d_mean_surface_soil_wetness_frac",
]


# ============================================================
# MINE-LEVEL STRESS
# ============================================================

def build_mine_stress(df: pd.DataFrame) -> pd.DataFrame:
    """
    Calculate rainfall and soil-moisture stress independently
    for every mine.
    """

    out = df.copy()

    # --------------------------------------------------------
    # Rainfall stress
    # --------------------------------------------------------

    rain = (
        out[RAIN_COLUMNS]
        .astype(float)
        .to_numpy()
    )

    normalized_rain = np.clip(
        rain / RAIN_SCALES,
        0.0,
        1.0,
    )

    out["rainfall_stress_index"] = (
        normalized_rain.mean(axis=1)
    )

    # --------------------------------------------------------
    # Soil-moisture stress
    # --------------------------------------------------------

    out["soil_moisture_stress_index"] = (
        out[SOIL_COLUMNS]
        .astype(float)
        .mean(axis=1)
    )

    return out


# ============================================================
# WEIGHTED AGGREGATION
# ============================================================

def _weighted_average(
    group: pd.DataFrame,
    value_column: str,
    weight_column: str = "production_share",
) -> float:
    """
    Production-share weighted average.

    Current MVP:
        every mine weight = 0.10

    So mathematically this becomes the simple average
    of mine-level stress values.
    """

    weights = (
        group[weight_column]
        .astype(float)
        .to_numpy()
    )

    values = (
        group[value_column]
        .astype(float)
        .to_numpy()
    )

    total_weight = weights.sum()

    if total_weight <= 0:
        raise ValueError(
            "Production-share weights must sum to > 0."
        )

    return float(
        np.sum(values * weights)
        / total_weight
    )


# ============================================================
# BUILD FINAL SEVEN MOIL FEATURES
# ============================================================

def build_moil_features(
    checkpoint_df: pd.DataFrame
) -> pd.DataFrame:
    """
    Convert the 10 mine checkpoint rows into ONE MOIL-wide
    model feature row.

    This same output will be sent to:

        1. RandomForestClassifier
        2. RandomForestRegressor
    """

    df = checkpoint_df.copy()

    # --------------------------------------------------------
    # Validate required columns
    # --------------------------------------------------------

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

    missing = [
        column
        for column in required
        if column not in df.columns
    ]

    if missing:
        raise ValueError(
            f"Missing required columns: {missing}"
        )

    if "prediction_day_of_month" not in df.columns:
        raise ValueError(
            "prediction_day_of_month is required."
        )

    # --------------------------------------------------------
    # Calculate month progress
    # --------------------------------------------------------

    if "prediction_date" in df.columns:

        dates = pd.to_datetime(
            df["prediction_date"]
        )

        days_in_month = (
            dates.dt.days_in_month
        )

    elif "days_in_month" in df.columns:

        days_in_month = (
            df["days_in_month"]
            .astype(float)
        )

    else:
        raise ValueError(
            "Need prediction_date or days_in_month."
        )

    df["month_progress_pct"] = (
        df["prediction_day_of_month"]
        .astype(float)
        /
        days_in_month.astype(float)
        *
        100.0
    )

    # --------------------------------------------------------
    # Calculate stress separately for every mine
    # --------------------------------------------------------

    mine_df = build_mine_stress(df)

    # --------------------------------------------------------
    # Aggregate 10 mines → one MOIL-wide row
    # --------------------------------------------------------

    rows = []

    if "prediction_date" in mine_df.columns:

        group_columns = [
            "prediction_date"
        ]

    else:

        group_columns = [
            "prediction_month",
            "prediction_day_of_month",
        ]

    for key, group in mine_df.groupby(
        group_columns,
        sort=True,
    ):

        row = {}

        if isinstance(key, tuple):

            for column, value in zip(
                group_columns,
                key,
            ):
                row[column] = value

        else:

            row[group_columns[0]] = key

        # Production and time features are identical
        # for all 10 mine rows.

        first = group.iloc[0]

        for column in [
            "production_lag_1m_lakh_tonnes",
            "production_lag_2m_lakh_tonnes",
            "production_lag_3m_lakh_tonnes",
            "expected_production_lakh_tonnes",
            "month_progress_pct",
        ]:

            row[column] = float(
                first[column]
            )

        # ----------------------------------------------------
        # Weighted/average rainfall stress across 10 mines
        # ----------------------------------------------------

        row[
            "moil_weighted_rainfall_stress_index"
        ] = _weighted_average(
            group,
            "rainfall_stress_index",
        )

        # ----------------------------------------------------
        # Weighted/average soil stress across 10 mines
        # ----------------------------------------------------

        row[
            "moil_weighted_soil_moisture_stress_index"
        ] = _weighted_average(
            group,
            "soil_moisture_stress_index",
        )

        rows.append(row)

    final_features = pd.DataFrame(rows)

    return final_features[
        MODEL_FEATURES
    ].copy()