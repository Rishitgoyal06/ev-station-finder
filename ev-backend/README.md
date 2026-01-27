# EV Station Finder - India API Documentation
A real-time EV charging station discovery platform for India with smart routing and user management.

## 🇮🇳 India-Specific Features

- **Major EV Networks**: Tata Power, Ather Grid, Statiq, BPCL, IOCL, Adani Total Gas
- **Connector Types**: CCS, CHAdeMO, Type 2, Bharat AC001, Bharat DC001
- **Regional Coverage**: Delhi NCR, Mumbai, Bangalore, Chennai, Hyderabad, Pune
- **Highway Corridors**: Delhi-Mumbai, Delhi-Kolkata, Chennai-Bangalore routes
- **Government Stations**: EESL, state electricity boards

## 🔄 System Flow

```
Frontend → Backend → Google Places API → India EV Filtering → Response Processing → Frontend Display
```

## 📡 API Architecture

### Core APIs

**1. Station Search (`/ev-stations`)**
- **Input**: `lat`, `lng`, `radius` (coordinates for Indian cities)
- **Process**: Google Places Nearby Search → India EV filtering → Photo fetching
- **Output**: Filtered Indian EV stations with photos and metadata
- **API Calls**: 1 + N (where N = number of stations for photos)
- **Coverage**: 28 states, 8 union territories

**2. Text Search (`/search`)**
- **Input**: `query` string (supports Hindi transliteration)
- **Process**: Google Places Text Search → India EV filtering → Photo fetching
- **Output**: Indian EV stations matching search query
- **API Calls**: 1 + N (where N = number of stations for photos)
- **Examples**: "Tata Power", "Ather Grid", "BPCL charging"

**3. Station Details (`/station-details/{place_id}`)**
- **Input**: Google Place ID
- **Process**: Google Places Details API
- **Output**: Complete Indian station information with operator details
- **API Calls**: 1

**4. Routing (`/directions`)**
- **Input**: Origin/destination coordinates, route type
- **Process**: OSRM routing API → India road optimization
- **Output**: Optimized route for Indian road conditions
- **API Calls**: 1
- **Route Types**: Fastest (highways), Shortest (city), Eco (fuel-efficient)

### User Management APIs

**Authentication**
- `POST /register` - User registration with mobile number support
- `POST /login` - JWT token generation

**User Data**
- `GET/POST/DELETE /favorites` - MongoDB operations for Indian stations
- `GET/POST /reviews` - Review management in English/Hindi
- `GET /search-history` - User search patterns across India

## 🔢 API Call Analysis

### Per Search Operation in India

**Nearby Search (Delhi NCR example):**
```
1. Google Places Nearby Search API call
2. N × Google Places Details API calls (for photos)
Total: 1 + N calls (typically 1 + 8-15 = 9-16 calls)
```

**Text Search ("Tata Power Mumbai"):**
```
1. Google Places Text Search API call
2. N × Google Places Details API calls (for photos)
Total: 1 + N calls (typically 1 + 5-12 = 6-13 calls)
```

**Route Calculation (Mumbai-Pune corridor):**
```
1. OSRM API call (free, optimized for Indian roads)
Total: 1 call (no Google API usage)
```

## 🏗️ Backend Processing Flow

### 1. India Station Discovery
```python
# Google Places API → India EV Detection → Photo Enhancement
raw_places = google_places_api(location, radius)
india_ev_stations = filter(is_india_ev_station, raw_places)
enhanced_stations = add_photos_and_details(india_ev_stations)
```

### 2. India EV Station Detection
```python
def is_india_ev_station(place):
    # Indian EV operators and keywords
    operators = ["tata power", "ather", "statiq", "bpcl", "iocl", "adani", "eesl"]
    keywords = ["ev", "charging", "charger", "electric", "विद्युत"]
    return any(op in place.name.lower() for op in operators) or \
           any(kw in place.name.lower() for kw in keywords)
```

### 3. Connector Type Detection
```python
def detect_connector_types(station_name, address):
    # Predict connector types based on Indian operators
    if "tata power" in station_name.lower():
        return ["CCS", "Type 2"]
    elif "ather" in station_name.lower():
        return ["Type 2"]
    elif "bpcl" in station_name.lower():
        return ["CCS", "CHAdeMO"]
    return ["CCS", "Type 2"]  # Default for India
```

### 4. Route Optimization for India
```python
# OSRM optimized for Indian road conditions
route = osrm_api(origin, destination, route_type)
# Consider Indian factors: tolls, traffic, monsoon routes
optimized_route = apply_india_route_preferences(route, route_type)
```

## 🗄️ Data Flow

### Frontend → Backend
```javascript
// Search in Delhi NCR
fetch(`/ev-stations?lat=28.6139&lng=77.2090&radius=5000`)

// Route Mumbai to Pune
fetch(`/directions?origin_lat=19.0760&origin_lng=72.8777&dest_lat=18.5204&dest_lng=73.8567&route_type=fastest`)
```

### Backend → External APIs
```python
# Google Places for Indian locations
requests.get("https://maps.googleapis.com/maps/api/place/nearbysearch/json", 
            params={"location": "28.6139,77.2090", "keyword": "EV charging station"})

# OSRM for Indian roads
requests.get("http://router.project-osrm.org/route/v1/driving/77.2090,28.6139;73.8567,18.5204")
```

### Backend → Frontend
```json
{
  "count": 12,
  "results": [
    {
      "name": "Tata Power EZ Charge",
      "latitude": 28.6139,
      "longitude": 77.2090,
      "distance_m": 800,
      "photo_urls": ["url1", "url2"],
      "rating": 4.2,
      "operator": "Tata Power",
      "connector_types": ["CCS", "Type 2"],
      "power_rating": "50kW DC Fast"
    }
  ]
}
```

## 🚀 Performance Optimization

### API Call Reduction for India
- **Regional Caching**: Cache popular routes (Delhi-Mumbai, Bangalore-Chennai)
- **Operator Filtering**: Pre-filter by major Indian EV operators
- **City-wise Optimization**: Optimized search patterns for metro cities

### India-Specific Optimizations
- **Monsoon Routing**: Alternative routes during monsoon season
- **Festival Traffic**: Route adjustments during Indian festivals
- **Toll Optimization**: Minimize toll costs on highways

## 🔧 Quick Setup for India

```bash
# Install dependencies
pip3 install -r requirements.txt --break-system-packages

# Configure for India
echo "GOOGLE_MAPS_API_KEY=your_key" > .env
echo "MONGO_URI=mongodb://localhost:27017/india_ev_stations" >> .env
echo "JWT_SECRET=your_secret" >> .env
echo "DEFAULT_COUNTRY=IN" >> .env
echo "DEFAULT_LOCATION=28.6139,77.2090" >> .env  # Delhi

# Start application
./start.sh
```

## 📊 API Limits & Costs (India Usage)

**Google Places API (India):**
- Nearby Search: ₹2,400/1000 requests
- Text Search: ₹2,400/1000 requests  
- Place Details: ₹1,275/1000 requests
- Photos: Free (via Place Details)

**OSRM Routing:**
- Free (self-hosted or public instance)

**Typical Calls per Search **
- 1 search + (5 detail calls per EV STATTION)

## 🇮🇳 Indian EV Market Coverage

**Major Operators Supported:**
- Tata Power (2000+ stations)
- Ather Grid (1500+ stations)
- Statiq (1000+ stations)
- BPCL (800+ stations)
- IOCL (600+ stations)
- Adani Total Gas (400+ stations)

**Regional Coverage:**
- North: Delhi NCR, Punjab, Haryana
- West: Mumbai, Pune, Gujarat
- South: Bangalore, Chennai, Hyderabad
- East: Kolkata, Bhubaneswar

---

**Access**: http://localhost:8000 | **API Docs**: http://localhost:8000/docs
**Optimized for Indian EV Infrastructure** 🇮🇳⚡
