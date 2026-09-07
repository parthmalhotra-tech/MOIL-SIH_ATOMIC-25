from app.services.data_sources.prospectivity import get_prospectivity_locations
from app.services.ml_prosp_locked.model import predict_prospectivity
from app.core.exceptions import ModelInferenceError
from app.core.logging import logger

MODEL_INPUT_FIELDS = [
    "B02", "B03", "B04", "B08", "B11", "B12",
    "NDVI", "NDWI", "BSI", "cloud_cover",
    "elevation_m", "slope_deg", "terrain_relief_m",
]
def get_prospectivity_map() -> list[dict]:
    try:
        locations = get_prospectivity_locations()
        results = []

        for loc in locations:
            model_inputs = {field: loc[field] for field in MODEL_INPUT_FIELDS}
            prediction = predict_prospectivity(model_inputs)

            results.append({
                "latitude": loc["latitude"],
                "longitude": loc["longitude"],
                "state": loc["state"],
                "district": loc["district"],
                "prospectivity_score": prediction["manganese_probability"],
                "prospectivity_class": prediction["prospectivity"],
                **model_inputs,
            })

        logger.info(f"Prospectivity map generated for {len(results)} locations")
        return results

    except Exception as e:
        logger.error(f"Prospectivity pipeline failed: {str(e)}")
        raise ModelInferenceError(f"Prospectivity model failed: {str(e)}")