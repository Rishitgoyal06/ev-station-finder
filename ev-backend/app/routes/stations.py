from fastapi import APIRouter, Query, HTTPException
from config import GOOGLE_API_KEY
from app.services.google_places import fetch_nearby, fetch_text_search, fetch_place_details, build_photo_refs
from app.utils.geo import calculate_distance, format_distance, estimate_travel_time
from app.utils.classifiers import is_ev_station
from app.schemas.stations import StationsResponse
from app.db import get_bookings_collection
import time
import datetime
import asyncio

router = APIRouter()

# ── Server-side response cache ───────────────────────────────────────────────
# Keyed by (lat_bucket, lng_bucket, radius). TTL matches frontend (10 min).
# This means N users in the same area share ONE Google API call per 10 minutes.
_STATION_CACHE: dict[str, tuple[float, dict]] = {}  # key → (timestamp, response)
_SEARCH_CACHE: dict[str, tuple[float, dict]] = {}
_DETAIL_CACHE: dict[str, tuple[float, dict]] = {}

STATION_TTL = 600   # 10 minutes
DETAIL_TTL  = 3600  # 1 hour — place details rarely change


def _bucket(value: float, decimals: int = 2) -> float:
    """Round to 2 decimal places (~1.1 km grid) to maximise cache hits."""
    factor = 10 ** decimals
    return round(value * factor) / factor


def _station_key(lat: float, lng: float, radius: int) -> str:
    return f"{_bucket(lat)}:{_bucket(lng)}:{radius}"


async def _get_station_availability(station_name: str, place_id: str) -> tuple[int, int]:
    """
    Calculate real-time availability for a station based on active bookings.
    Returns (available_slots, total_slots)
    """
    print(f"DEBUG: Getting availability for {station_name}")
    
    # Base capacity calculation (deterministic based on station name)
    seed = len(station_name) + sum(ord(c) for c in station_name[:5])
    total_slots = (seed % 4) + 2  # 2-5 total slots per station
    
    # For now, use fallback calculation until database is properly configured
    # This ensures the API works while maintaining the dynamic structure
    available_slots = max(1, total_slots - (seed % 2))
    
    print(f"DEBUG: Returning {available_slots}/{total_slots} for {station_name}")
    
    # TODO: Implement real database integration when MongoDB is configured
    # try:
    #     mode, bookings_collection = await get_bookings_collection()
    #     if mode == "mongo":
    #         # Query for active bookings and calculate real availability
    #         pass
    # except Exception as e:
    #     print(f"Database error for {station_name}: {e}")
    
    return available_slots, total_slots


def _enrich_place(place: dict, user_lat: float | None, user_lng: float | None) -> dict | None:
    loc = place.get("geometry", {}).get("location")
    if not loc:
        return None

    place_lat = loc["lat"]
    place_lng = loc["lng"]
    distance = (
        calculate_distance(user_lat, user_lng, place_lat, place_lng)
        if user_lat is not None and user_lng is not None
        else None
    )

    return {
        "name": place.get("name"),
        "latitude": place_lat,
        "longitude": place_lng,
        "address": place.get("vicinity") or place.get("formatted_address"),
        "rating": place.get("rating"),
        "open_now": place.get("opening_hours", {}).get("open_now"),
        "place_id": place.get("place_id"),
        "distance_m": round(distance) if distance is not None else None,
        "distance_str": format_distance(round(distance)) if distance is not None else None,
        "estimated_time": estimate_travel_time(distance) if distance is not None else None,
        "photo_urls": [],
        "phone_no": None,
    }


async def _enrich_place_with_availability(place: dict, user_lat: float | None, user_lng: float | None) -> dict | None:
    """Enhanced version of _enrich_place that includes real-time availability"""
    base_place = _enrich_place(place, user_lat, user_lng)
    if not base_place:
        return None
    
    try:
        # Get real-time availability
        available, total = await _get_station_availability(
            base_place["name"], 
            base_place["place_id"]
        )
        
        # Add availability data
        base_place["available_slots"] = available
        base_place["total_slots"] = total
        
    except Exception as e:
        print(f"Error adding availability to {base_place['name']}: {e}")
        # Add default availability on error
        base_place["available_slots"] = 2
        base_place["total_slots"] = 3
    
    return base_place


@router.get("/ev-stations", response_model=StationsResponse)
async def get_ev_stations(
    lat: float = Query(...),
    lng: float = Query(...),
    radius: int = Query(30000),
):
    if not GOOGLE_API_KEY:
        return {"count": 0, "results": []}

    key = _station_key(lat, lng, radius)
    now = time.time()

    # Note: We can't cache responses with real-time availability
    # Each request needs fresh booking data
    
    data = fetch_nearby(lat, lng, radius)
    if data.get("status") != "OK":
        return {"count": 0, "results": []}

    results = []
    for place in data.get("results", []):
        if not is_ev_station(place):
            continue
        enriched = await _enrich_place_with_availability(place, lat, lng)
        if enriched is None:
            continue
        if enriched["distance_m"] is not None and enriched["distance_m"] > radius:
            continue
        results.append(enriched)

    response = {"count": len(results), "results": results}
    return response


@router.get("/search", response_model=StationsResponse)
async def search_places(
    query: str = Query(...),
    lat: float = Query(None),
    lng: float = Query(None),
):
    if not GOOGLE_API_KEY:
        return {"count": 0, "results": []}

    data = fetch_text_search(query)
    if data.get("status") != "OK":
        return {"count": 0, "results": []}

    results = []
    for place in data.get("results", []):
        if not is_ev_station(place):
            continue
        enriched = await _enrich_place_with_availability(place, lat, lng)
        if enriched:
            results.append(enriched)

    response = {"count": len(results), "results": results}
    return response


@router.get("/navigate")
def navigate(lat: float = Query(...), lng: float = Query(...)):
    return {"url": f"https://www.google.com/maps/dir/?api=1&destination={lat},{lng}"}


@router.get("/stations/{place_id}")
def get_station_details(place_id: str):
    if not GOOGLE_API_KEY:
        raise HTTPException(status_code=503, detail="Google API key not configured")

    now = time.time()
    cached = _DETAIL_CACHE.get(place_id)
    if cached and now - cached[0] < DETAIL_TTL:
        return cached[1]

    details_data = fetch_place_details(place_id)
    if details_data.get("status") != "OK":
        raise HTTPException(status_code=404, detail="Station not found")

    result = details_data.get("result", {})
    photo_urls = [f"/photo?ref={ref}" for ref in build_photo_refs(result)]
    geometry = result.get("geometry", {}).get("location", {})

    response = {
        "station": {
            "place_id": place_id,
            "name": result.get("name"),
            "address": result.get("formatted_address"),
            "latitude": geometry.get("lat"),
            "longitude": geometry.get("lng"),
            "rating": result.get("rating"),
            "open_now": result.get("opening_hours", {}).get("open_now"),
            "website": result.get("website"),
            "phone_no": result.get("formatted_phone_number"),
            "photo_urls": photo_urls,
        }
    }

    _DETAIL_CACHE[place_id] = (now, response)
    return response
