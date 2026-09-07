from app.core.exceptions import ModelInferenceError
from app.core.logging import logger

from app.services.data_sources.prospectivity import (
    get_prospectivity_locations,
)


def get_prospectivity_predictions() -> list[dict]:
    """
    Return precomputed manganese prospectivity predictions.

    The final CSV already contains model probabilities and
    prospectivity classes, so no model inference is required.
    """

    try:
        locations = get_prospectivity_locations()

        logger.info(
            f"Loaded {len(locations)} prospectivity map points"
        )

        return locations

    except Exception as e:
        logger.error(
            f"Prospectivity pipeline failed: {e}"
        )

        raise ModelInferenceError(
            f"Prospectivity model failed: {e}"
        ) from e