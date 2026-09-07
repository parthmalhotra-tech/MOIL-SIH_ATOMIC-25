import requests
import pandas as pd

from datetime import timedelta
from concurrent.futures import ThreadPoolExecutor, as_completed


# ============================================================
# MOIL MINE LOCATIONS
# MVP coordinates - keep/update these with your final GIS values
# ============================================================

MINE_LOCATIONS = [
    {"name": "Balaghat",      "lat": 21.50, "lon": 80.14},
    {"name": "Ukwa",          "lat": 21.58, "lon": 80.25},
    {"name": "Bharweli",      "lat": 21.75, "lon": 80.15},
    {"name": "Munsar",        "lat": 21.24, "lon": 79.16},
    {"name": "Tirodi",        "lat": 21.41, "lon": 79.43},
    {"name": "Dongri Buzurg", "lat": 21.32, "lon": 79.40},
    {"name": "Sitapatore",    "lat": 21.42, "lon": 79.40},
    {"name": "Gumgaon",       "lat": 21.23, "lon": 78.58},
    {"name": "Kandri",        "lat": 21.24, "lon": 79.15},
    {"name": "Beldongri",     "lat": 21.20, "lon": 79.17},
]


# No mine-wise production data is currently available.
# Therefore each of the 10 mines gets equal weight.
EQUAL_PRODUCTION_SHARE = 0.10


NASA_POWER_URL = (
    "https://power.larc.nasa.gov/api/temporal/daily/point"
)


def _fetch_one_location(
    mine: dict,
    start_date,
    end_date
) -> pd.DataFrame:
    """
    Fetch daily precipitation and top-layer soil wetness
    from NASA POWER for one mine.
    """

    params = {
        "parameters": "PRECTOTCORR,GWETTOP",
        "community": "AG",
        "longitude": mine["lon"],
        "latitude": mine["lat"],
        "start": start_date.strftime("%Y%m%d"),
        "end": end_date.strftime("%Y%m%d"),
        "format": "JSON",
    }

    response = requests.get(
        NASA_POWER_URL,
        params=params,
        timeout=30
    )

    response.raise_for_status()

    payload = response.json()

    try:
        parameters = payload["properties"]["parameter"]

        precipitation = parameters["PRECTOTCORR"]
        soil_wetness = parameters["GWETTOP"]

    except KeyError as exc:
        raise ValueError(
            f"NASA POWER response missing expected data "
            f"for mine {mine['name']}"
        ) from exc

    dates = sorted(
        set(precipitation.keys())
        & set(soil_wetness.keys())
    )

    df = pd.DataFrame({
        "date": pd.to_datetime(
            dates,
            format="%Y%m%d"
        ),
        "precipitation_mm_day": [
            precipitation[d]
            for d in dates
        ],
        "surface_soil_wetness_frac": [
            soil_wetness[d]
            for d in dates
        ],
    })

    df["mine_name"] = mine["name"]

    # NASA missing-data sentinel
    df = df[
        (df["precipitation_mm_day"] > -900)
        &
        (df["surface_soil_wetness_frac"] > -900)
    ].copy()

    df["precipitation_mm_day"] = pd.to_numeric(
        df["precipitation_mm_day"],
        errors="coerce"
    )

    df["surface_soil_wetness_frac"] = pd.to_numeric(
        df["surface_soil_wetness_frac"],
        errors="coerce"
    )

    df = (
        df
        .dropna()
        .sort_values("date")
        .reset_index(drop=True)
    )

    return df


def _build_checkpoint_row(
    mine_df: pd.DataFrame,
    mine_name: str,
    prediction_date
) -> dict:
    """
    Convert one mine's daily NASA data into the rolling
    weather variables required by the MOIL-wide ML model.
    """

    prediction_date = pd.Timestamp(
        prediction_date
    ).normalize()

    mine_df = (
        mine_df[
            mine_df["date"] <= prediction_date
        ]
        .sort_values("date")
        .copy()
    )

    if len(mine_df) < 30:
        raise ValueError(
            f"{mine_name}: only {len(mine_df)} valid daily "
            f"weather observations available. "
            f"At least 30 are required."
        )

    # Last available row on/before prediction date
    latest = mine_df.iloc[-1]

    # --------------------------------------------------------
    # Rainfall windows
    # --------------------------------------------------------

    rain_3d = mine_df.tail(3)
    rain_7d = mine_df.tail(7)
    rain_30d = mine_df.tail(30)

    # --------------------------------------------------------
    # Soil-moisture windows
    # --------------------------------------------------------

    soil_1d = mine_df.tail(1)
    soil_7d = mine_df.tail(7)
    soil_30d = mine_df.tail(30)

    return {
        "mine_name": mine_name,

        # Equal mine weights for MVP
        "production_share":
            EQUAL_PRODUCTION_SHARE,

        "prediction_date":
            prediction_date,

        "prediction_day_of_month":
            prediction_date.day,

        # --------------------------------------------
        # Rainfall variables expected by ML package
        # --------------------------------------------

        "today_precipitation_mm_day":
            float(
                latest[
                    "precipitation_mm_day"
                ]
            ),

        "w3d_sum_precipitation_mm_day":
            float(
                rain_3d[
                    "precipitation_mm_day"
                ].sum()
            ),

        "w7d_sum_precipitation_mm_day":
            float(
                rain_7d[
                    "precipitation_mm_day"
                ].sum()
            ),

        "w7d_max_precipitation_mm_day":
            float(
                rain_7d[
                    "precipitation_mm_day"
                ].max()
            ),

        "w30d_sum_precipitation_mm_day":
            float(
                rain_30d[
                    "precipitation_mm_day"
                ].sum()
            ),

        # --------------------------------------------
        # Soil variables expected by ML package
        # --------------------------------------------

        "w1d_mean_surface_soil_wetness_frac":
            float(
                soil_1d[
                    "surface_soil_wetness_frac"
                ].mean()
            ),

        "w7d_mean_surface_soil_wetness_frac":
            float(
                soil_7d[
                    "surface_soil_wetness_frac"
                ].mean()
            ),

        "w30d_mean_surface_soil_wetness_frac":
            float(
                soil_30d[
                    "surface_soil_wetness_frac"
                ].mean()
            ),

        # Useful for debugging
        "weather_data_through":
            latest["date"],
    }


def get_mine_weather_checkpoint(
    prediction_date,
    lookback_days: int = 40
) -> pd.DataFrame:
    """
    Fetch weather for all 10 mines and return ONE ROW PER MINE.

    IMPORTANT:
    This function does NOT average raw rainfall or soil values.

    Each mine keeps its own rolling environmental features.
    The ML feature-engineering layer will later:
        1. calculate mine-level rainfall stress
        2. calculate mine-level soil stress
        3. aggregate the 10 mine stress values using
           production_share = 0.10 each
    """

    prediction_date = pd.Timestamp(
        prediction_date
    ).normalize()

    start_date = (
        prediction_date
        - timedelta(days=lookback_days - 1)
    )

    mine_frames = {}

    # Fetch mines concurrently so 10 NASA requests do not
    # unnecessarily block one after another.
    with ThreadPoolExecutor(
        max_workers=5
    ) as executor:

        futures = {
            executor.submit(
                _fetch_one_location,
                mine,
                start_date,
                prediction_date
            ): mine

            for mine in MINE_LOCATIONS
        }

        for future in as_completed(futures):

            mine = futures[future]

            try:
                mine_frames[mine["name"]] = (
                    future.result()
                )

            except Exception as exc:
                raise RuntimeError(
                    f"NASA weather fetch failed for "
                    f"{mine['name']}: {exc}"
                ) from exc

    checkpoint_rows = []

    for mine in MINE_LOCATIONS:

        mine_name = mine["name"]

        if mine_name not in mine_frames:
            raise ValueError(
                f"No weather dataframe returned "
                f"for {mine_name}"
            )

        checkpoint_rows.append(
            _build_checkpoint_row(
                mine_df=mine_frames[mine_name],
                mine_name=mine_name,
                prediction_date=prediction_date,
            )
        )

    checkpoint_df = pd.DataFrame(
        checkpoint_rows
    )

    # Safety check: 10 × 0.10 = 1.0
    total_share = (
        checkpoint_df[
            "production_share"
        ].sum()
    )

    if abs(total_share - 1.0) > 1e-9:
        raise ValueError(
            f"Production shares must sum to 1.0. "
            f"Current total = {total_share}"
        )

    return checkpoint_df