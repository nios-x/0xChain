from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from models import shipment as shipment_model, event as event_model
from schemas import shipment as shipment_schema, event as event_schema

async def get_shipment(db: AsyncSession, shipment_id: int):
    result = await db.execute(select(shipment_model.Shipment).filter(shipment_model.Shipment.id == shipment_id))
    return result.scalars().first()

async def get_shipments(db: AsyncSession, skip: int = 0, limit: int = 100):
    result = await db.execute(select(shipment_model.Shipment).offset(skip).limit(limit))
    return result.scalars().all()

async def create_shipment(db: AsyncSession, shipment: shipment_schema.ShipmentCreate):
    db_shipment = shipment_model.Shipment(source=shipment.source, destination=shipment.destination)
    db.add(db_shipment)
    await db.commit()
    await db.refresh(db_shipment)
    return db_shipment

async def create_event(db: AsyncSession, event: event_schema.EventCreate):
    db_event = event_model.Event(shipment_id=event.shipment_id, type=event.type, data=event.data)
    db.add(db_event)
    await db.commit()
    await db.refresh(db_event)
    return db_event
