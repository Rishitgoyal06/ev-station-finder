from pydantic import BaseModel
from typing import Optional


class RouteStep(BaseModel):
    instruction: str
    distance: str
    duration: str


class DirectionsResponse(BaseModel):
    distance: str
    duration: str
    route_type: str
    benefits: str
    start_address: str
    end_address: str
    route_points: list[list[float]]
    steps: list[RouteStep]
