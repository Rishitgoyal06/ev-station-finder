from pydantic import BaseModel
from typing import Optional


class EVStationResult(BaseModel):
    name: Optional[str]
    latitude: float
    longitude: float
    address: Optional[str]
    rating: Optional[float]
    open_now: Optional[bool]
    place_id: Optional[str]
    distance_m: Optional[int]
    distance_str: Optional[str]
    estimated_time: Optional[str]
    photo_urls: list[str]
    photo_reference: Optional[str] = None
    available_slots: Optional[int] = None
    total_slots: Optional[int] = None
    phone_no: Optional[str]


class StationsResponse(BaseModel):
    count: int
    results: list[EVStationResult]
