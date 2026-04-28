from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class EventBase(BaseModel):
    shipment_id: int
    type: str
    data: Optional[str] = None

class EventCreate(EventBase):
    pass

class EventResponse(EventBase):
    id: int
    timestamp: datetime

    class Config:
        from_attributes = True
