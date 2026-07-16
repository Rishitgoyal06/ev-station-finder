from fastapi import APIRouter, Query
from app.services.osrm import fetch_route
from app.utils.geo import calculate_distance
from app.schemas.directions import DirectionsResponse

router = APIRouter()

VALID_ROUTE_TYPES = ("fastest", "shortest", "eco")

SPEED_MULTIPLIER = {
    "fastest": 0.8,
    "shortest": 1.2,
    "eco": 1.0,
}


def get_route_benefits(route_type: str, distance_km: float, duration_min: int) -> str:
    if route_type == "eco":
        fuel_saved = distance_km * 0.1
        return f"Eco-friendly • Saves ~{fuel_saved:.1f}L fuel • Lower emissions"
    elif route_type == "shortest":
        return "Shortest distance • Direct route • Less wear on vehicle"
    return "Fastest route • Saves time • Optimal traffic flow"


def get_simple_route(origin_lat, origin_lng, dest_lat, dest_lng, route_type) -> dict:
    points = [[origin_lat, origin_lng], [dest_lat, dest_lng]]
    distance_m = calculate_distance(origin_lat, origin_lng, dest_lat, dest_lng)
    distance_km = distance_m / 1000
    duration_min = int(distance_km / 40 * 60 * SPEED_MULTIPLIER.get(route_type, 1.0))

    return {
        "distance": f"{distance_km:.1f} km",
        "duration": f"{duration_min} min",
        "route_type": route_type.title(),
        "benefits": get_route_benefits(route_type, distance_km, duration_min),
        "start_address": f"{origin_lat:.4f}, {origin_lng:.4f}",
        "end_address": f"{dest_lat:.4f}, {dest_lng:.4f}",
        "route_points": points,
        "steps": [{
            "instruction": f"Head to destination via {route_type} route",
            "distance": f"{distance_km:.1f} km",
            "duration": f"{duration_min} min",
        }],
    }


@router.get("/directions", response_model=DirectionsResponse)
def get_directions(
    origin_lat: float = Query(...),
    origin_lng: float = Query(...),
    dest_lat: float = Query(...),
    dest_lng: float = Query(...),
    route_type: str = Query("fastest"),
):
    if route_type not in VALID_ROUTE_TYPES:
        route_type = "fastest"

    data = fetch_route(origin_lat, origin_lng, dest_lat, dest_lng, route_type)
    if not data:
        return get_simple_route(origin_lat, origin_lng, dest_lat, dest_lng, route_type)

    route = data["routes"][0]
    geometry = route["geometry"]

    if geometry["type"] != "LineString":
        return get_simple_route(origin_lat, origin_lng, dest_lat, dest_lng, route_type)

    points = [[coord[1], coord[0]] for coord in geometry["coordinates"]]
    distance_km = route["distance"] / 1000
    duration_min = int(route["duration"] / 60)

    if route_type == "eco":
        duration_min = int(duration_min * 1.1)
    elif route_type == "shortest":
        duration_min = int(duration_min * 1.2)

    steps = []
    if route.get("legs") and route["legs"][0].get("steps"):
        for step in route["legs"][0]["steps"][:5]:
            maneuver = step.get("maneuver", {})
            steps.append({
                "instruction": maneuver.get("instruction", "Continue"),
                "distance": f"{step.get('distance', 0) / 1000:.1f} km",
                "duration": f"{int(step.get('duration', 0) / 60)} min" if int(step.get('duration', 0) / 60) > 0 else "< 1 min",
            })

    if not steps:
        steps = [{
            "instruction": f"Follow {route_type} route to destination",
            "distance": f"{distance_km:.1f} km",
            "duration": f"{duration_min} min",
        }]

    return {
        "distance": f"{distance_km:.1f} km",
        "duration": f"{duration_min} min",
        "route_type": route_type.title(),
        "benefits": get_route_benefits(route_type, distance_km, duration_min),
        "start_address": f"{origin_lat:.4f}, {origin_lng:.4f}",
        "end_address": f"{dest_lat:.4f}, {dest_lng:.4f}",
        "route_points": points,
        "steps": steps,
    }
