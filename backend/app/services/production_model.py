import pandas as pd
from app.core.exceptions import ModelInferenceError
from app.core.logging import logger
from app.services.data_sources.production import get_production_context

from app.services.data_sources.weather_soil import get_mine_weather_checkpoint

from app.services.ml_prod_locked.feature_engineering import build_moil_features
from app.services.ml_prod_locked.model import (predict_classifier,predict_regressor,)

def get_production_forecast(prediction_date) -> dict:
    """
    Run the complete MOIL-wide production shortfall pipeline.
    Pipeline:
        1. Get hardcoded monthly production context
        2. Fetch NASA weather/soil data for all 10 mines
        3. Build rolling environmental variables per mine
        4. Attach MOIL-wide production data to each mine row
        5. Calculate mine-level stress
        6. Average stress across the 10 mines using 0.10 weight each
        7. Generate the final seven MOIL-wide model features
        8. Run classifier
        9. Run regressor
        10. Return combined result
    """
    try:
        # ====================================================
        # 1. NORMALIZE PREDICTION DATE
        # ====================================================
        prediction_date = (
            pd.Timestamp(prediction_date)
            .normalize()
        )
        logger.info(
            f"Running MOIL production model "
            f"for {prediction_date.strftime('%Y-%m-%d')}"
        )
        # ====================================================
        # 2. GET HARDCODED PRODUCTION CONTEXT
        # ====================================================
        production_context = (
            get_production_context(
                prediction_date=prediction_date
            )
        )
        logger.info(
            "Loaded production context: "
            f"{production_context}"
        )
        # ====================================================
        # 3. FETCH WEATHER/SOIL FOR ALL 10 MINES
        # ====================================================
        checkpoint_df = (
            get_mine_weather_checkpoint(
                prediction_date=prediction_date,
                lookback_days=40,
            )
        )
        logger.info(
            f"Built weather checkpoint rows "
            f"for {len(checkpoint_df)} mines"
        )
        if len(checkpoint_df) != 10:
            raise ValueError(
                f"Expected 10 mine checkpoint rows, "
                f"got {len(checkpoint_df)}."
            )
        # ====================================================
        # 4. ATTACH SAME MOIL-WIDE PRODUCTION VALUES
        #    TO EACH OF THE 10 MINE ROWS
        # ====================================================
        checkpoint_df[
            "production_lag_1m_lakh_tonnes"
        ] = production_context[
            "production_lag_1m_lakh_tonnes"
        ]
        checkpoint_df[
            "production_lag_2m_lakh_tonnes"
        ] = production_context[
            "production_lag_2m_lakh_tonnes"
        ]
        checkpoint_df[
            "production_lag_3m_lakh_tonnes"
        ] = production_context[
            "production_lag_3m_lakh_tonnes"
        ]
        checkpoint_df[
            "expected_production_lakh_tonnes"
        ] = production_context[
            "expected_production_lakh_tonnes"
        ]
        logger.info(
            "Attached MOIL-wide production values "
            "to all mine checkpoint rows"
        )
        # ====================================================
        # 5. BUILD THE FINAL 7 MOIL-WIDE FEATURES
        # ====================================================
        features_df = (
            build_moil_features(
                checkpoint_df
            )
        )
        if len(features_df) != 1:
            raise ValueError(
                f"Expected exactly one MOIL feature row, "
                f"got {len(features_df)}."
            )
        feature_values = (
            features_df
            .iloc[0]
            .to_dict()
        )
        logger.info(
            f"Final MOIL-wide model features: "
            f"{feature_values}"
        )
        # ====================================================
        # 6. CLASSIFIER
        # ====================================================
        classifier_result = (
            predict_classifier(
                feature_values
            )
        )
        logger.info(
            f"Classifier output: "
            f"{classifier_result}"
        )
        # ====================================================
        # 7. REGRESSOR
        # ====================================================
        regressor_result = (
            predict_regressor(
                feature_values
            )
        )
        logger.info(
            f"Regressor output: "
            f"{regressor_result}"
        )
        # ====================================================
        # 8. COMBINED API RESULT
        # ====================================================
        return {
            "prediction_date":
                prediction_date.strftime(
                    "%Y-%m-%d"
                ),
            # -----------------------------------------------
            # CLASSIFICATION MODEL
            # -----------------------------------------------
            "shortfall_probability":
                classifier_result[
                    "shortfall_probability"
                ],
            "shortfall_risk":
                classifier_result[
                    "shortfall_risk"
                ],
            "classification":
                classifier_result[
                    "classification"
                ],
            # -----------------------------------------------
            # REGRESSION MODEL
            # -----------------------------------------------
            "predicted_shortfall_pct":
                regressor_result[
                    "predicted_shortfall_pct"
                ],
            "forecast_production_lakh_tonnes":
                regressor_result[
                    "forecast_production_lakh_tonnes"
                ],
            "expected_production_lakh_tonnes":
                regressor_result[
                    "expected_production_lakh_tonnes"
                ],
            # -----------------------------------------------
            # ENVIRONMENTAL FEATURES
            # Useful for frontend/demo/debugging
            # -----------------------------------------------
            "moil_weighted_rainfall_stress_index":
                feature_values[
                    "moil_weighted_rainfall_stress_index"
                ],
            "moil_weighted_soil_moisture_stress_index":
                feature_values[
                    "moil_weighted_soil_moisture_stress_index"
                ],
            "month_progress_pct":
                feature_values[
                    "month_progress_pct"
                ],
            # -----------------------------------------------
            # HISTORICAL PRODUCTION
            # -----------------------------------------------
            "historical":
                production_context[
                    "historical"
                ],
        }
    except Exception as e:
        logger.error(
            f"Production pipeline failed: {str(e)}"
        )
        raise ModelInferenceError(
            f"Production model failed: {str(e)}"
        ) from e