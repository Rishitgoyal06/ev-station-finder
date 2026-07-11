import requests

OSRM_URL = "https://router.project-osrm.org/route/v1/driving"


def fetch_route(origin_lat: float, origin_lng: float, dest_lat: float, dest_lng: float, route_type: str) -> dict | None:
    coords = f"{origin_lng},{origin_lat};{dest_lng},{dest_lat}"
    params = {"geometries": "geojson", "overview": "full", "steps": "true"}

    if route_type == "shortest":
        params["annotations"] = "distance"
    elif route_type == "eco":
        params["annotations"] = "duration,distance"

    try:
        response = requests.get(f"{OSRM_URL}/{coords}", params=params, timeout=15)
        if response.status_code != 200:
            return None
        data = response.json()
        if data.get("code") != "Ok" or not data.get("routes"):
            return None
        return data
    except Exception as e:
        print(f"OSRM error: {e}")
        return None
