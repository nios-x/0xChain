from fastapi import APIRouter, HTTPException
from schemas.route import RouteRequest, RouteResponse
from services.routing_engine import routing_engine

router = APIRouter()

@router.post("/optimize", response_model=RouteResponse)
async def optimize_route(request: RouteRequest):
    try:
        return routing_engine.get_optimal_route(request)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
