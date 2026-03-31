# EV Station Finder - Backend

FastAPI backend for finding EV charging stations across India with real-time routing and Google Places integration.

## Architecture

```
Browser (index.html)
        ↕ fetch API calls
   main.py (FastAPI)
        ↕                    ↕
Google Places API        OSRM Routing API
```

## Tech Stack

- **FastAPI** — Python web framework
- **Uvicorn** — ASGI server
- **Requests** — HTTP calls to Google Places and OSRM
- **Python-dotenv** — loads environment variables

## Setup

```bash
# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
echo "GOOGLE_MAPS_API_KEY=your_google_maps_api_key" > .env

# Start server
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

Or use the startup script:
```bash
./start.sh
```

## Environment Variables

```
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

## API Endpoints

### `GET /`
Serves the frontend map interface (`static/index.html`).

---

### `GET /health`
Health check.

**Response:**
```json
{"status": "EV backend running"}
```

---

### `GET /ev-stations`
Find nearby EV charging stations using GPS coordinates.

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| lat | float | yes | — | Latitude |
| lng | float | yes | — | Longitude |
| radius | int | no | 5000 | Search radius in metres |

**Response:**
```json
{
  "count": 3,
  "results": [
    {
      "name": "Tata Power EZ Charge",
      "latitude": 12.9716,
      "longitude": 77.5946,
      "address": "MG Road, Bangalore",
      "rating": 4.2,
      "open_now": true,
      "place_id": "ChIJ...",
      "distance_m": 800,
      "distance_str": "800 m",
      "estimated_time": "2 min",
      "photo_urls": ["https://maps.googleapis.com/..."],
      "phone_no": "+91 98765 43210"
    }
  ]
}
```

---

### `GET /search`
Search EV stations by text query.

**Query Parameters:**
| Parameter | Type | Required | Description |
|---|---|---|---|
| query | string | yes | Search text |
| lat | float | no | User latitude for distance calculation |
| lng | float | no | User longitude for distance calculation |

**Response:** Same structure as `/ev-stations`. `distance_str` and `estimated_time` are `null` if `lat`/`lng` not provided.

---

### `GET /directions`
Get driving route between two points.

**Query Parameters:**
| Parameter | Type | Required | Description |
|---|---|---|---|
| origin_lat | float | yes | Origin latitude |
| origin_lng | float | yes | Origin longitude |
| dest_lat | float | yes | Destination latitude |
| dest_lng | float | yes | Destination longitude |
| route_type | string | no | `fastest` / `shortest` / `eco` (default: `fastest`) |

**Response:**
```json
{
  "distance": "5.2 km",
  "duration": "12 min",
  "route_type": "Fastest",
  "benefits": "Fastest route • Saves time • Optimal traffic flow",
  "start_address": "12.9716, 77.5946",
  "end_address": "12.9352, 77.6245",
  "route_points": [[12.9716, 77.5946], [12.9600, 77.6100], [12.9352, 77.6245]],
  "steps": [
    {
      "instruction": "Head north on MG Road",
      "distance": "2.1 km",
      "duration": "5 min"
    }
  ]
}
```

**Route Types:**
| Type | Speed | Use case |
|---|---|---|
| fastest | ~50 km/h | Minimize travel time |
| shortest | ~33 km/h | Minimize distance, local roads |
| eco | ~40 km/h | Fuel efficient, moderate speed |

---

### `GET /navigate`
Get Google Maps navigation URL for a station.

**Query Parameters:**
| Parameter | Type | Required | Description |
|---|---|---|---|
| lat | float | yes | Station latitude |
| lng | float | yes | Station longitude |

**Response:**
```json
{
  "url": "https://www.google.com/maps/dir/?api=1&destination=12.9716,77.5946"
}
```

---

## Helper Functions

| Function | Description |
|---|---|
| `calculate_distance()` | Haversine formula — straight-line distance between two GPS coordinates in metres |
| `estimate_travel_time()` | Converts distance to travel time assuming 40 km/h average speed |
| `format_distance()` | Formats metres to `"800 m"` or `"2.3 km"` |
| `is_ev_station()` | Keyword-based filter to detect real EV stations and remove false positives |
| `extract_charger_types()` | Predicts charger type (CCS, CHAdeMO, Type 2) from brand and location keywords |
| `get_route_benefits()` | Returns benefit text for each route type |
| `get_simple_route()` | Fallback straight-line route when OSRM is unavailable |

## Data Flow

```
1. User opens http://localhost:8000
   → FastAPI serves static/index.html

2. Browser requests GPS location
   → User clicks Nearby button
   → fetch /ev-stations?lat=&lng=
   → main.py calls Google Places Nearby Search API
   → Filters results using is_ev_station()
   → For each station, calls Google Place Details API (photos + phone)
   → Calculates distance using Haversine formula
   → Returns enriched station list

3. User clicks Route button on a station popup
   → fetch /directions?origin_lat=&origin_lng=&dest_lat=&dest_lng=&route_type=
   → main.py calls OSRM routing API
   → Falls back to straight-line if OSRM fails
   → Returns route polyline, distance, duration, steps

4. User clicks Google button on a station popup
   → fetch /navigate?lat=&lng=
   → main.py returns Google Maps URL
   → Browser opens Google Maps
```

## Google API Usage

Each nearby/search request makes:
- 1 × Google Places Nearby/Text Search call
- N × Google Places Details calls (one per station, for photos and phone)

Directions use OSRM which is **free and open-source** — no Google API calls.

## Access

- **Map Interface**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health
