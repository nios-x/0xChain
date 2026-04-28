from fastapi import FastAPI
from contextlib import asynccontextmanager

from core.database import engine
from core.config import settings
from models.base import Base

from routers import shipments, events, routes, predictions, dashboard, websockets

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create database tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    # Cleanup
    await engine.dispose()

app = FastAPI(
    title=settings.PROJECT_NAME,
    lifespan=lifespan
)

# Include Routers
app.include_router(shipments.router, prefix="/shipments", tags=["Shipments"])
app.include_router(events.router, prefix="/events", tags=["Events"])
app.include_router(routes.router, prefix="/routes", tags=["Routing"])
app.include_router(predictions.router, prefix="/predict", tags=["Predictions"])
app.include_router(dashboard.router, prefix="/dashboard", tags=["Dashboard"])
app.include_router(websockets.router, tags=["Websockets"])

@app.get("/")
def read_root():
    return {"message": f"Welcome to the {settings.PROJECT_NAME} API"}
