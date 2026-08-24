import requests
from config import GOOGLE_API_KEY, NEARBY_SEARCH_URL, TEXT_SEARCH_URL, PLACE_DETAILS_URL


def fetch_nearby(lat: float, lng: float, radius: int) -> dict:
    params = {
        "location": f"{lat},{lng}",
        "radius": radius,
        "keyword": "EV charging station",
        "key": GOOGLE_API_KEY,
    }
    response = requests.get(NEARBY_SEARCH_URL, params=params, timeout=10)
    return response.json()

def fetch_text_search(query: str) -> dict:
    params = {"query": query, "key": GOOGLE_API_KEY}
    response = requests.get(TEXT_SEARCH_URL, params=params, timeout=10)
    return response.json()


def fetch_place_details(place_id: str) -> dict:
    params = {
        "place_id": place_id,
        "fields": (
            "name,formatted_address,geometry,opening_hours,rating,website,"
            "photos,formatted_phone_number"
        ),
        "key": GOOGLE_API_KEY,
    }
    response = requests.get(PLACE_DETAILS_URL, params=params, timeout=5)
    return response.json()


def build_photo_refs(details_result: dict) -> list[str]:
    refs = []
    for photo in details_result.get("photos", [])[:5]:
        ref = photo.get("photo_reference")
        if ref:
            refs.append(ref)
    return refs


def fetch_photo(photo_reference: str) -> requests.Response:
    params = {
        "maxwidth": 1200,
        "photo_reference": photo_reference,
        "key": GOOGLE_API_KEY,
    }
    return requests.get(
        "https://maps.googleapis.com/maps/api/place/photo",
        params=params,
        timeout=10,
        stream=True,
    )
