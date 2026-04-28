from pydantic import BaseModel

class PredictionRequest(BaseModel):
    weather_condition: str # e.g. "clear", "rain", "storm"
    traffic_level: int # 1 to 10
    delay_history: int # past delays in hours

class PredictionResponse(BaseModel):
    disruption_probability: float # 0.0 to 1.0
