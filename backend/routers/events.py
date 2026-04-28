from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from core.database import get_db
from schemas.event import EventCreate, EventResponse
from services.shipment_service import shipment_service

router = APIRouter()

@router.post("/", response_model=EventResponse)
async def ingest_event(event: EventCreate, db: AsyncSession = Depends(get_db)):
    return await shipment_service.process_event(db, event)
