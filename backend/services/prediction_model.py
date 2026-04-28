from schemas.prediction import PredictionRequest, PredictionResponse
import random

class PredictionModel:
    def predict_disruption(self, request: PredictionRequest) -> PredictionResponse:
        # Dummy logic: bad weather or high traffic increases probability
        base_prob = 0.05
        
        if request.weather_condition.lower() in ["rain", "storm", "snow"]:
            base_prob += 0.3
        
        if request.traffic_level > 7:
            base_prob += 0.2
            
        if request.delay_history > 2:
            base_prob += 0.1
            
        # Add some random noise
        noise = random.uniform(0, 0.1)
        prob = min(base_prob + noise, 1.0)
        
        return PredictionResponse(disruption_probability=prob)

prediction_model = PredictionModel()
