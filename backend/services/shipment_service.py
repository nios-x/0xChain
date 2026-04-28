from sqlalchemy.ext.asyncio import AsyncSession
from db.crud import create_event
from schemas.event import EventCreate
from schemas.prediction import PredictionRequest
from services.prediction_model import prediction_model
from services.notification_service import notification_service
import json

class ShipmentService:
    async def process_event(self, db: AsyncSession, event: EventCreate):
        # Save event to DB
        db_event = await create_event(db, event)
        
        # Parse event data
        if event.data:
            try:
                data = json.loads(event.data)
                
                # Check for disruption if weather or traffic is reported
                if "weather" in data or "traffic" in data:
                    pred_req = PredictionRequest(
                        weather_condition=data.get("weather", "clear"),
                        traffic_level=data.get("traffic", 1),
                        delay_history=0 # Assume 0 for simplicity, could fetch from DB
                    )
                    
                    prediction = prediction_model.predict_disruption(pred_req)
                    
                    if prediction.disruption_probability > 0.6:
                        notification_service.send_notification(
                            "logistics_team@company.com",
                            f"High disruption probability ({prediction.disruption_probability:.2f}) for shipment {event.shipment_id}"
                        )
                        # Here we could trigger rerouting logic
                        
            except json.JSONDecodeError:
                pass
                
        return db_event

shipment_service = ShipmentService()
