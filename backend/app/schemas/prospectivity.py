from pydantic import BaseModel
from typing import List

from pydantic import BaseModel
from typing import List

class ProspectivityLocation(BaseModel):
    latitude: float
    longitude: float
    state: str
    district: str
    prospectivity_score: float
    prospectivity_class: str
    B02: float
    B03: float
    B04: float
    B08: float
    B11: float
    B12: float
    NDVI: float
    NDWI: float
    BSI: float
    cloud_cover: float
    elevation_m: float
    slope_deg: float
    terrain_relief_m: float

class ProspectivityMapResponse(BaseModel):
    locations: List[ProspectivityLocation]
  