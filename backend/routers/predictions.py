from fastapi import APIRouter
from schemas.prediction import PredictionRequest, PredictionResponse
from services.prediction_model import prediction_model

router = APIRouter()

@router.post("/", response_model=PredictionResponse)
async def predict_disruption(request: PredictionRequest):
    return prediction_model.predict_disruption(request)
