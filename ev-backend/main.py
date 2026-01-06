from fastapi import FastAPI, Query, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel
from datetime import datetime, timedelta
import requests
import os
import math
import jwt
import bcrypt
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI()

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")

# --------------------------------------------------
# CORS (safe even for Postman)
# --------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------------------------------------------------
# MongoDB Config
# --------------------------------------------------
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
client = AsyncIOMotorClient(MONGO_URL)
db = client.ev_backend
users_collection = db.users
search_history_collection = db.search_history
reviews_collection = db.reviews
favorites_collection = db.favorites

# --------------------------------------------------
# JWT Config
# --------------------------------------------------
JWT_SECRET = os.getenv("JWT_SECRET", "your-secret-key")
security = HTTPBearer()

# --------------------------------------------------
# Pydantic Models
# --------------------------------------------------
class UserRegister(BaseModel):
    email: str
    password: str
    name: str

class UserLogin(BaseModel):
    email: str
    password: str

class Review(BaseModel):
    place_id: str
    rating: int
    comment: str

class Favorite(BaseModel):
    place_id: str
    name: str
    address: str
    photo_urls: list = []

# --------------------------------------------------
# Auth Functions
# --------------------------------------------------
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=["HS256"])
        email = payload.get("email")
        user = await users_collection.find_one({"email": email})
        if not user:
            raise HTTPException(status_code=401, detail="Invalid token")
        return user
    except:
        raise HTTPException(status_code=401, detail="Invalid token")

# --------------------------------------------------
# Google Places Config
# --------------------------------------------------
GOOGLE_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY")
NEARBY_SEARCH_URL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
TEXT_SEARCH_URL = "https://maps.googleapis.com/maps/api/place/textsearch/json"
PLACE_DETAILS_URL = "https://maps.googleapis.com/maps/api/place/details/json"
DIRECTIONS_URL = "https://maps.googleapis.com/maps/api/directions/json"

# --------------------------------------------------
# Frontend Route
# --------------------------------------------------
@app.get("/")
def read_index():
    return FileResponse('static/index.html')

# --------------------------------------------------
# Auth Routes
# --------------------------------------------------
@app.post("/register")
async def register(user: UserRegister):
    existing_user = await users_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt())
    user_doc = {
        "email": user.email,
        "password": hashed_password,
        "name": user.name,
        "created_at": datetime.utcnow()
    }
    await users_collection.insert_one(user_doc)
    return {"message": "User registered successfully"}

@app.post("/login")
async def login(user: UserLogin):
    db_user = await users_collection.find_one({"email": user.email})
    if not db_user or not bcrypt.checkpw(user.password.encode('utf-8'), db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = jwt.encode({"email": user.email, "exp": datetime.utcnow() + timedelta(days=7)}, JWT_SECRET)
    return {"token": token, "user": {"email": db_user["email"], "name": db_user["name"]}}

# --------------------------------------------------
# User Data Routes
# --------------------------------------------------
@app.post("/search-history")
async def add_search_history(request: dict, user = Depends(get_current_user)):
    query = request.get("query")
    if not query:
        raise HTTPException(status_code=400, detail="Query is required")
    
    # Check if this exact query already exists for this user
    existing = await search_history_collection.find_one({
        "user_email": user["email"],
        "query": query
    })
    
    if existing:
        # Update timestamp of existing entry
        await search_history_collection.update_one(
            {"_id": existing["_id"]},
            {"$set": {"timestamp": datetime.utcnow()}}
        )
    else:
        # Create new entry
        history_doc = {
            "user_email": user["email"],
            "query": query,
            "timestamp": datetime.utcnow()
        }
        await search_history_collection.insert_one(history_doc)
    
    return {"message": "Search history added"}

@app.get("/search-history")
async def get_search_history(user = Depends(get_current_user)):
    history = await search_history_collection.find({"user_email": user["email"]}).sort("timestamp", -1).limit(20).to_list(20)
    return {"history": [h["query"] for h in history]}

@app.delete("/search-history")
async def clear_search_history(user = Depends(get_current_user)):
    await search_history_collection.delete_many({"user_email": user["email"]})
    return {"message": "Search history cleared"}

@app.post("/reviews")
async def add_review(review: Review, user = Depends(get_current_user)):
    # Get place details for storing with review
    place_details = {}
    if review.place_id:
        details_params = {
            "place_id": review.place_id,
            "fields": "name,formatted_address,photos,geometry,formatted_phone_number",
            "key": GOOGLE_API_KEY
        }
        details_response = requests.get(PLACE_DETAILS_URL, params=details_params, timeout=5)
        details_data = details_response.json()
        
        if details_data.get("status") == "OK" and details_data.get("result"):
            result = details_data["result"]
            place_details["name"] = result.get("name")
            place_details["address"] = result.get("formatted_address")
            place_details["phone"] = result.get("formatted_phone_number")
            if result.get("geometry", {}).get("location"):
                place_details["latitude"] = result["geometry"]["location"]["lat"]
                place_details["longitude"] = result["geometry"]["location"]["lng"]
            
            # Get photos
            photo_urls = []
            if result.get("photos"):
                for photo in result["photos"][:3]:
                    photo_ref = photo.get("photo_reference")
                    if photo_ref:
                        photo_urls.append(
                            f"https://maps.googleapis.com/maps/api/place/photo"
                            f"?maxwidth=1200"
                            f"&photo_reference={photo_ref}"
                            f"&key={GOOGLE_API_KEY}"
                        )
            place_details["photo_urls"] = photo_urls
    
    review_doc = {
        "user_email": user["email"],
        "user_name": user["name"],
        "place_id": review.place_id,
        "rating": review.rating,
        "comment": review.comment,
        "place_details": place_details,
        "timestamp": datetime.utcnow()
    }
    await reviews_collection.insert_one(review_doc)
    return {"message": "Review added"}

@app.get("/my-reviews")
async def get_my_reviews(user = Depends(get_current_user)):
    reviews = await reviews_collection.find({"user_email": user["email"]}).sort("timestamp", -1).to_list(100)
    return {"reviews": [{"review_id": str(r["_id"]), "place_id": r["place_id"], "rating": r["rating"], "comment": r["comment"], "timestamp": r["timestamp"], "place_details": r.get("place_details", {})} for r in reviews]}

@app.delete("/reviews/{review_id}")
async def remove_review(review_id: str, user = Depends(get_current_user)):
    from bson import ObjectId
    result = await reviews_collection.delete_one({"_id": ObjectId(review_id), "user_email": user["email"]})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Review not found")
    return {"message": "Review removed"}

@app.get("/reviews/{place_id}")
async def get_reviews(place_id: str):
    reviews = await reviews_collection.find({"place_id": place_id}).sort("timestamp", -1).to_list(50)
    return {"reviews": [{"user_name": r["user_name"], "rating": r["rating"], "comment": r["comment"], "timestamp": r["timestamp"]} for r in reviews]}

@app.post("/favorites")
async def add_favorite(favorite: Favorite, user = Depends(get_current_user)):
    existing = await favorites_collection.find_one({"user_email": user["email"], "place_id": favorite.place_id})
    if existing:
        return {"message": "Already in favorites"}
    
    favorite_doc = {
        "user_email": user["email"],
        "place_id": favorite.place_id,
        "name": favorite.name,
        "address": favorite.address,
        "photo_urls": favorite.photo_urls,
        "timestamp": datetime.utcnow()
    }
    await favorites_collection.insert_one(favorite_doc)
    return {"message": "Added to favorites"}

@app.get("/favorites")
async def get_favorites(user = Depends(get_current_user)):
    favorites = await favorites_collection.find({"user_email": user["email"]}).sort("timestamp", -1).to_list(100)
    return {"favorites": [{"place_id": f["place_id"], "name": f["name"], "address": f["address"], "photo_urls": f.get("photo_urls", [])} for f in favorites]}

@app.delete("/favorites/{place_id}")
async def remove_favorite(place_id: str, user = Depends(get_current_user)):
    await favorites_collection.delete_one({"user_email": user["email"], "place_id": place_id})
    return {"message": "Removed from favorites"}

# --------------------------------------------------
# Health Check
# --------------------------------------------------
@app.get("/health")
def health_check():
    return {"status": "EV backend running"}

# --------------------------------------------------
# Utility: Distance
# --------------------------------------------------
def calculate_distance(lat1, lng1, lat2, lng2):
    R = 6371000
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lng2 - lng1)

    a = (
        math.sin(dphi / 2) ** 2
        + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda / 2) ** 2
    )
    return R * (2 * math.atan2(math.sqrt(a), math.sqrt(1 - a)))

# --------------------------------------------------
# Time Estimation
# --------------------------------------------------
def estimate_travel_time(distance_m):
    distance_km = distance_m / 1000
    hours = distance_km / 40
    if hours < 1:
        return f"{round(hours * 60)} min"
    return f"{round(hours, 1)} hr"

# --------------------------------------------------
# EV Detection (Score-based)
# --------------------------------------------------
def extract_charger_types(place_name, place_address=""):
    """Predict charger types based on brand and location patterns"""
    text = f"{place_name} {place_address}".lower()
    
    # Exact matches first
    if "ccs" in text or "ccs2" in text:
        return ["CCS"]
    if "chademo" in text:
        return ["CHAdeMO"]
    if "type 2" in text or "type2" in text:
        return ["Type 2"]
    
    # Brand-based predictions
    if any(brand in text for brand in ["tata", "tata power"]):
        return ["CCS", "Type 2"]
    if "ather" in text:
        return ["Type 2"]
    if "ola" in text:
        return ["CCS"]
    if "mahindra" in text:
        return ["Type 2"]
    if "tesla" in text:
        return ["Tesla Supercharger"]
    if "bpcl" in text or "iocl" in text or "hpcl" in text:
        return ["CCS", "CHAdeMO"]
    if "adani" in text:
        return ["CCS", "Type 2"]
    if "reliance" in text:
        return ["CCS"]
    
    # Location-based predictions
    if any(word in text for word in ["highway", "expressway", "toll"]):
        return ["DC Fast", "CCS"]
    if any(word in text for word in ["mall", "shopping", "complex"]):
        return ["AC", "Type 2"]
    if "airport" in text:
        return ["CCS", "Type 2"]
    
    # Speed indicators
    if "fast" in text or "rapid" in text or "dc" in text:
        return ["DC Fast"]
    if "slow" in text or "ac" in text:
        return ["AC"]
    
    return []

def is_ev_station(place: dict) -> bool:
    """
    Keyword-based EV station detection for India.
    Simple, predictable, and works for Nearby + Text Search.
    """

    name = (place.get("name") or "").lower()
    address = (place.get("formatted_address") or place.get("vicinity") or "").lower()

    text = f"{name} {address}"

    # ✅ Keywords commonly used by EV charging stations in India
    ev_keywords = [
        # Generic EV terms
        "ev",
        "electric vehicle",
        "electric charging",
        "ev charging",
        "charging station",
        "ev station",
        "charger",

        # Charger types
        "fast charger",
        "dc charger",
        "dc fast",
        "ccs",
        "ccs2",
        "ac charger",
        "type 2",

        # Public infra keywords
        "charging point",
        "ev point",
        "ev plug",
        "electric point",

        # Government / PSU wording
        "electric vehicle charging",
        "public charging",
        "charging facility"
    ]

    # ❌ Strong negative filters (very important)
    negative_keywords = [
        "hotel",
        "restaurant",
        "cafe",
        "mall",
        "school",
        "college",
        "hospital",
        "apartment",
        "residency",
        "hostel",
        "office",
        "complex"
    ]

    # Remove obvious false positives
    for neg in negative_keywords:
        if neg in text:
            return False

    # Accept if ANY EV keyword matches
    for kw in ev_keywords:
        if kw in text:
            return True

    return False


# --------------------------------------------------
# Nearby EV Stations
# --------------------------------------------------
@app.get("/ev-stations")
def get_ev_stations(
    lat: float = Query(...),
    lng: float = Query(...),
    radius: int = Query(5000)
):
    if not GOOGLE_API_KEY:
        return {"error": "Google API key not configured"}

    params = {
        "location": f"{lat},{lng}",
        "radius": radius,
        "keyword": "EV charging station",
        "key": GOOGLE_API_KEY
    }

    response = requests.get(NEARBY_SEARCH_URL, params=params, timeout=10)
    data = response.json()

    if data.get("status") != "OK":
        return {"count": 0, "results": []}

    results = []

    for place in data.get("results", []):
        if not is_ev_station(place):
            continue

        loc = place.get("geometry", {}).get("location")
        if not loc:
            continue

        place_lat = loc["lat"]
        place_lng = loc["lng"]

        distance = calculate_distance(lat, lng, place_lat, place_lng)
        if distance > radius:
            continue

        # Get photos using Place Details API for more photos
        photo_urls = []
        phone_number = None
        place_id = place.get("place_id")
        if place_id:
            details_params = {
                "place_id": place_id,
                "fields": "photos,formatted_phone_number",
                "key": GOOGLE_API_KEY
            }
            details_response = requests.get(PLACE_DETAILS_URL, params=details_params, timeout=5)
            details_data = details_response.json()
            
            if details_data.get("status") == "OK":
                result = details_data.get("result", {})
                if result.get("photos"):
                    photos = result["photos"][:5]
                    print(f"Found {len(photos)} photos for {place.get('name')} via Place Details")
                    for i, photo in enumerate(photos):
                        photo_ref = photo.get("photo_reference")
                        if photo_ref:
                            photo_urls.append(
                                f"https://maps.googleapis.com/maps/api/place/photo"
                                f"?maxwidth=1200"
                                f"&photo_reference={photo_ref}"
                                f"&key={GOOGLE_API_KEY}"
                            )
                            print(f"Added photo {i+1} for {place.get('name')}")
                phone_number = result.get("formatted_phone_number")
            else:
                print(f"No photos found via Place Details for {place.get('name')}")


        results.append({
            "name": place.get("name"),
            "latitude": place_lat,
            "longitude": place_lng,
            "address": place.get("vicinity"),
            "rating": place.get("rating"),
            "open_now": place.get("opening_hours", {}).get("open_now"),
            "place_id": place.get("place_id"),
            "distance_m": round(distance),
            "estimated_time": estimate_travel_time(distance),
            "photo_urls": photo_urls,
            "phone_no": phone_number
        })

    return {
        "count": len(results),
        "results": results
    }

# --------------------------------------------------
# Text Search
# --------------------------------------------------
@app.get("/search")
def search_places(query: str = Query(...)):
    if not GOOGLE_API_KEY:
        return {"error": "Google API key not configured"}

    params = {
        "query": query,
        "key": GOOGLE_API_KEY
    }

    response = requests.get(TEXT_SEARCH_URL, params=params, timeout=10)
    data = response.json()

    if data.get("status") != "OK":
        return {
            "count": 0,
            "results": []
        }

    cleaned_results = []

    for place in data.get("results", []):
        if not is_ev_station(place):
            continue

        loc = place.get("geometry", {}).get("location")
        if not loc:
            continue

        # Get photos and phone for text search
        photo_urls = []
        phone_number = None
        place_id = place.get("place_id")
        if place_id:
            details_params = {
                "place_id": place_id,
                "fields": "photos,formatted_phone_number",
                "key": GOOGLE_API_KEY
            }
            details_response = requests.get(PLACE_DETAILS_URL, params=details_params, timeout=5)
            details_data = details_response.json()
            
            if details_data.get("status") == "OK":
                result = details_data.get("result", {})
                if result.get("photos"):
                    photos = result["photos"][:5]
                    for photo in photos:
                        photo_ref = photo.get("photo_reference")
                        if photo_ref:
                            photo_urls.append(
                                f"https://maps.googleapis.com/maps/api/place/photo"
                                f"?maxwidth=1200"
                                f"&photo_reference={photo_ref}"
                                f"&key={GOOGLE_API_KEY}"
                            )
                phone_number = result.get("formatted_phone_number")

        cleaned_results.append({
            "name": place.get("name"),
            "latitude": loc["lat"],
            "longitude": loc["lng"],
            "address": place.get("formatted_address"),
            "rating": place.get("rating"),
            "open_now": place.get("opening_hours", {}).get("open_now"),
            "place_id": place.get("place_id"),
            "distance_m": None,
            "estimated_time": None,
            "photo_urls": photo_urls,
            "phone_no": phone_number
        })

    return {
        "count": len(cleaned_results),
        "results": cleaned_results
    }

# --------------------------------------------------
# Directions
# --------------------------------------------------
@app.get("/directions")
def get_directions(
    origin_lat: float = Query(...),
    origin_lng: float = Query(...),
    dest_lat: float = Query(...),
    dest_lng: float = Query(...),
    route_type: str = Query("fastest")  # fastest, shortest, eco
):
    # Use OSRM public API for real road routing
    osrm_url = "http://router.project-osrm.org/route/v1/driving"
    
    # Build coordinates string
    coords = f"{origin_lng},{origin_lat};{dest_lng},{dest_lat}"
    
    # Route parameters based on type
    params = {
        "geometries": "geojson",
        "overview": "full",
        "steps": "true"
    }
    
    # Add route-specific parameters
    if route_type == "shortest":
        params["annotations"] = "distance"
    elif route_type == "eco":
        params["annotations"] = "duration,distance"
    
    try:
        response = requests.get(f"{osrm_url}/{coords}", params=params, timeout=15)
        
        if response.status_code != 200:
            return get_simple_route(origin_lat, origin_lng, dest_lat, dest_lng, route_type)
            
        data = response.json()
        
        if data.get("code") != "Ok" or not data.get("routes"):
            return get_simple_route(origin_lat, origin_lng, dest_lat, dest_lng, route_type)
            
        route = data["routes"][0]
        geometry = route["geometry"]
        
        # Extract coordinates from GeoJSON
        if geometry["type"] == "LineString":
            # Convert [lng, lat] to [lat, lng] for Leaflet
            points = [[coord[1], coord[0]] for coord in geometry["coordinates"]]
        else:
            return get_simple_route(origin_lat, origin_lng, dest_lat, dest_lng, route_type)
        
        distance_m = route["distance"]
        duration_sec = route["duration"]
        
        distance_km = distance_m / 1000
        duration_min = int(duration_sec / 60)
        
        # Adjust for route type preferences
        if route_type == "eco":
            # Eco routes might be slightly longer but more efficient
            duration_min = int(duration_min * 1.1)  # Slower, more efficient driving
        elif route_type == "fastest":
            # Fastest routes optimize for time
            duration_min = int(duration_min * 0.95)  # Slightly faster estimate
        
        # Get route type benefits
        benefits = get_route_benefits(route_type, distance_km, duration_min)
        
        # Get turn-by-turn directions
        steps = []
        if route.get("legs") and route["legs"][0].get("steps"):
            for step in route["legs"][0]["steps"][:5]:  # Limit to 5 main steps
                maneuver = step.get("maneuver", {})
                instruction = maneuver.get("instruction", "Continue")
                step_distance = step.get("distance", 0) / 1000
                step_duration = int(step.get("duration", 0) / 60)
                
                steps.append({
                    "instruction": instruction,
                    "distance": f"{step_distance:.1f} km",
                    "duration": f"{step_duration} min" if step_duration > 0 else "< 1 min"
                })
        
        if not steps:
            steps = [{
                "instruction": f"Follow {route_type} route to destination",
                "distance": f"{distance_km:.1f} km",
                "duration": f"{duration_min} min"
            }]
        
        return {
            "distance": f"{distance_km:.1f} km",
            "duration": f"{duration_min} min",
            "route_type": route_type.title(),
            "benefits": benefits,
            "start_address": f"{origin_lat:.4f}, {origin_lng:.4f}",
            "end_address": f"{dest_lat:.4f}, {dest_lng:.4f}",
            "route_points": points,
            "steps": steps
        }
        
    except Exception as e:
        print(f"OSRM routing error: {e}")
        return get_simple_route(origin_lat, origin_lng, dest_lat, dest_lng, route_type)

def get_simple_route(origin_lat, origin_lng, dest_lat, dest_lng, route_type):
    """Fallback simple route when API fails"""
    points = [[origin_lat, origin_lng], [dest_lat, dest_lng]]
    
    distance_m = calculate_distance(origin_lat, origin_lng, dest_lat, dest_lng)
    distance_km = distance_m / 1000
    
    # Adjust time based on route type
    speed_multiplier = {
        "fastest": 1.0,    # 40 km/h
        "shortest": 1.2,  # 33 km/h (slower, more direct)
        "eco": 0.8        # 50 km/h (efficient speed)
    }
    
    duration_min = int(distance_km / 40 * 60 * speed_multiplier.get(route_type, 1.0))
    benefits = get_route_benefits(route_type, distance_km, duration_min)
    
    return {
        "distance": f"{distance_km:.1f} km",
        "duration": f"{duration_min} min",
        "route_type": route_type.title(),
        "benefits": benefits,
        "start_address": f"{origin_lat:.4f}, {origin_lng:.4f}",
        "end_address": f"{dest_lat:.4f}, {dest_lng:.4f}",
        "route_points": points,
        "steps": [{
            "instruction": f"Head to destination via {route_type} route",
            "distance": f"{distance_km:.1f} km",
            "duration": f"{duration_min} min"
        }]
    }

def get_route_benefits(route_type, distance_km, duration_min):
    """Get benefits text for each route type"""
    if route_type == "eco":
        fuel_saved = distance_km * 0.1  # Estimate 10% fuel savings
        return f"🌱 Eco-friendly • Saves ~{fuel_saved:.1f}L fuel • Lower emissions"
    elif route_type == "shortest":
        return f"📏 Shortest distance • Direct route • Less wear on vehicle"
    else:
        return f"⚡ Fastest route • Saves time • Optimal traffic flow"