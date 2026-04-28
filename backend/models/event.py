from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from datetime import datetime
from models.base import Base

class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    shipment_id = Column(Integer, ForeignKey("shipments.id"), nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    type = Column(String, nullable=False) # e.g. "LOCATION_UPDATE", "WEATHER_ALERT", "TRAFFIC_DELAY"
    data = Column(String, nullable=True) # JSON string representing the data
