from sqlalchemy import Column, Integer, String, Float, Enum
import enum
from models.base import Base

class ShipmentStatus(str, enum.Enum):
    PENDING = "PENDING"
    IN_TRANSIT = "IN_TRANSIT"
    DELAYED = "DELAYED"
    DELIVERED = "DELIVERED"

class Shipment(Base):
    __tablename__ = "shipments"

    id = Column(Integer, primary_key=True, index=True)
    source = Column(String, nullable=False)
    destination = Column(String, nullable=False)
    status = Column(String, default=ShipmentStatus.PENDING)
    current_location = Column(String, nullable=True)
