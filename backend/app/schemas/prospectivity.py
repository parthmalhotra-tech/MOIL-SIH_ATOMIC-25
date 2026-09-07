from pydantic import BaseModel


class ProspectivityPoint(BaseModel):
    latitude: float
    longitude: float

    manganese_probability: float
    manganese_prediction: int
    prospectivity: str

    NDVI: float
    NDWI: float
    BSI: float

    elevation_m: float
    slope_deg: float
    terrain_relief_m: float

    B02: float
    B03: float
    B04: float
    B08: float
    B11: float
    B12: float

    cloud_cover: float