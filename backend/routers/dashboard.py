from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import func
from sqlalchemy.future import select

from core.database import get_db
from models.shipment import Shipment, ShipmentStatus

router = APIRouter()

@router.get("/")
async def get_dashboard_metrics(db: AsyncSession = Depends(get_db)):
    total_shipments = await db.scalar(select(func.count(Shipment.id)))
    delayed_shipments = await db.scalar(
        select(func.count(Shipment.id)).filter(Shipment.status == ShipmentStatus.DELAYED)
    )
    in_transit = await db.scalar(
        select(func.count(Shipment.id)).filter(Shipment.status == ShipmentStatus.IN_TRANSIT)
    )
    
    return {
        "total_shipments": total_shipments or 0,
        "delayed_shipments": delayed_shipments or 0,
        "in_transit": in_transit or 0,
        "system_status": "Healthy"
    }
