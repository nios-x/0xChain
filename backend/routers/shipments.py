from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from core.database import get_db
from schemas.shipment import ShipmentCreate, ShipmentResponse
from db.crud import create_shipment, get_shipments, get_shipment

router = APIRouter()

@router.post("/", response_model=ShipmentResponse)
async def create_new_shipment(shipment: ShipmentCreate, db: AsyncSession = Depends(get_db)):
    return await create_shipment(db, shipment)

@router.get("/", response_model=List[ShipmentResponse])
async def read_shipments(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    return await get_shipments(db, skip=skip, limit=limit)

@router.get("/{shipment_id}", response_model=ShipmentResponse)
async def read_shipment(shipment_id: int, db: AsyncSession = Depends(get_db)):
    shipment = await get_shipment(db, shipment_id)
    if shipment is None:
        raise HTTPException(status_code=404, detail="Shipment not found")
    return shipment
