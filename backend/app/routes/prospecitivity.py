from fastapi import APIRouter
from app.schemas.prospectivity import ProspectivityPoint
from app.services.prospectivity_model import get_prospectivity_predictions

router = APIRouter()

@router.get("/prospectivity/locations",response_model=list[ProspectivityPoint],)
def get_locations():
    return get_prospectivity_predictions()

  