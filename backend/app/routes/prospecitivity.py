from fastapi import APIRouter
from app.schemas.prospectivity import ProspectivityMapResponse
from app.services.prospectivity_model import get_prospectivity_map

router= APIRouter()

@router.get("/prospectivity/locations", response_model = ProspectivityMapResponse)
def get_locations():
  locations= get_prospectivity_map()
  return {"locations":locations}




  