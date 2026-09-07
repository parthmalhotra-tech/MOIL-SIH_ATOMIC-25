from datetime import date
from fastapi import APIRouter
from app.schemas.production import ProductionOutput
from app.services.production_model import get_production_forecast

router = APIRouter()

@router.get("/production/forecast",response_model=ProductionOutput,)
def get_forecast():
    return get_production_forecast(prediction_date=date.today())