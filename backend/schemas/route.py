from pydantic import BaseModel
from typing import List

class RouteRequest(BaseModel):
    source: str
    destination: str

class RouteResponse(BaseModel):
    path: List[str]
    total_distance: float
    estimated_time: float
