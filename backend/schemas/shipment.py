from pydantic import BaseModel
from typing import Optional
from models.shipment import ShipmentStatus

class ShipmentBase(BaseModel):
    source: str
    destination: str

class ShipmentCreate(ShipmentBase):
    pass

class ShipmentResponse(ShipmentBase):
    id: int
    status: ShipmentStatus
    current_location: Optional[str] = None

    class Config:
        from_attributes = True
