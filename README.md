# Charge IQ ⚡

India's largest EV charging network platform — find, navigate, and manage EV charging stations with an AI-powered assistant and real-time data.

---

## What is Charge IQ?

Charge IQ is a full-stack web application that helps electric vehicle owners across India locate nearby charging stations, plan routes, and get AI-powered assistance — all in one place. It combines a modern Next.js frontend with a FastAPI backend for station discovery and a Flask backend for the AI chatbot.

---

## Features

- 🗺️ **Interactive Map** — Live map with 5000+ EV charging stations across India using Leaflet
- 🤖 **AI Chatbot** — Multilingual EV assistant supporting 40+ Indian languages (powered by Groq)
- ⚡ **Real-time Availability** — Live station status via Google Places API
- 🔍 **Smart Search** — Text and GPS-based station discovery with keyword filtering
- 🛣️ **Route Optimization** — Fastest, shortest, and eco-friendly routing via OSRM
- 📍 **Station Details** — Photos, ratings, phone numbers, distance, and travel time estimates
- 🔋 **Charger Type Detection** — Predicts CCS, CHAdeMO, Type 2, DC Fast based on brand/location
- 💰 **Pricing Plans** — Free and Premium (₹99/month) tiers
- 📱 **Fully Responsive** — Mobile-first design with swipe gestures and pull-to-refresh
- 🌙 **Smooth Animations** — Framer Motion animations with Lottie support
- 🔐 **Authentication** — JWT-based login/signup system

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Next.js Frontend                      │
│                   (localhost:3000)                       │
│                                                         │
│  Pages: Home, About, Features, Contact, Login, Signup   │
│  Components: HeroSection, LiveMap, ChatbotModal,        │
│              StatsSection, Reviews, PricingTeaser        │
└──────────────┬──────────────────────┬───────────────────┘
               │                      │
               ▼                      ▼
┌──────────────────────┐   ┌──────────────────────────────┐
│  Flask Chatbot       │   │  FastAPI EV Backend           │
│  (localhost:5555)    │   │  (localhost:8000)             │
│                      │   │                              │
│  /predict            │   │  /ev-stations                │
│  /get_greeting       │   │  /search                     │
│  /login              │   │  /directions                 │
│  /register           │   │  /navigate                   │
│                      │   │  /health                     │
│  AI: Groq LLM        │   │  Google Places API + OSRM    │
└──────────────────────┘   └──────────────┬───────────────┘
                                          │
                                          ▼
                               ┌─────────────────────┐
                               │   Google Places API  │
                               │   OSRM Routing API   │
                               └─────────────────────┘
```

---

## Project Structure

```
ev-station-finder/
├── src/
│   ├── app/
│   │   ├── api/chatbot/route.ts        # Proxy to Flask chatbot backend
│   │   ├── about/page.tsx              # About Us page
│   │   ├── contact/page.tsx            # Contact page with form
│   │   ├── features/page.tsx           # Features showcase page
│   │   ├── login/page.tsx              # Login page
│   │   ├── signup/page.tsx             # Signup page
│   │   ├── layout.tsx                  # Root layout with Navbar, Footer, ChatbotButton
│   │   └── page.tsx                    # Home page
│   ├── components/
│   │   ├── ui/
│   │   │   ├── resizable-navbar.tsx    # Animated responsive navbar
│   │   │   ├── background-beams.tsx    # Hero background effect
│   │   │   ├── typewriter-effect.tsx   # Typewriter animation
│   │   │   └── pointer-highlight.tsx   # Cursor highlight effect
│   │   ├── AboutUs.tsx                 # About section with Lottie animations
│   │   ├── AuthContext.tsx             # Auth state management
│   │   ├── AuthModal.tsx               # Login/Signup modal
│   │   ├── ChatbotButton.tsx           # Floating chat button
│   │   ├── ChatbotModal.tsx            # Chat interface with language selector
│   │   ├── Features.tsx                # Features page component
│   │   ├── Footer.tsx                  # Site footer
│   │   ├── HeroSection.tsx             # Landing hero with CTA buttons
│   │   ├── LiveMap.tsx                 # Interactive Leaflet map
│   │   ├── LoadingScreen.tsx           # Initial loading animation
│   │   ├── MapComponent.tsx            # Map with typewriter overlay
│   │   ├── NavBar.tsx                  # Top navigation bar
│   │   ├── PricingTeaser.tsx           # Free vs Premium pricing cards
│   │   ├── Reviews.tsx                 # User testimonials section
│   │   ├── StatsSection.tsx            # Platform statistics
│   │   └── VideoModal.tsx              # Demo video modal
│   ├── hooks/
│   │   ├── usePullToRefresh.ts         # Mobile pull-to-refresh
│   │   └── useSwipeGestures.ts         # Swipe navigation gestures
│   └── lib/
│       └── utils.ts                    # Utility functions
├── ev-backend/
│   ├── main.py                         # FastAPI app (stations, search, directions)
│   ├── static/index.html               # Standalone EV map interface
│   ├── requirements.txt                # Python dependencies
│   ├── .env                            # Environment variables
│   └── start.sh                        # Backend startup script
├── chatbot_assistant/
│   ├── app.py                          # Flask chatbot backend
│   ├── chat.py                         # Groq AI chat logic
│   ├── requirements.txt                # Python dependencies
│   └── templates/                      # HTML templates
├── public/
│   ├── animations/                     # Lottie animation JSON files
│   │   ├── Electric vehicle charging animation.json
│   │   ├── Business team.json
│   │   ├── Map browsing.json
│   │   └── ...
│   └── logo.png
├── package.json
├── next.config.ts
├── vercel.json
└── DEPLOYMENT.md
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, React 19, TypeScript |
| Styling | Tailwind CSS v4, Framer Motion |
| Animations | Lottie React, Framer Motion |
| Map | Leaflet, React Leaflet |
| EV Backend | FastAPI (Python) |
| Chatbot Backend | Flask (Python) |
| AI | Groq LLM |
| Station Data | Google Places API |
| Routing | OSRM (Open Source Routing Machine) |
| Icons | Lucide React, Tabler Icons |
| Auth | JWT tokens |

---

## Prerequisites

- Node.js 18+
- Python 3.10+
- Google Maps API Key (with Places API enabled)
- Groq API Key

---

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd ev-station-finder
```

### 2. Install frontend dependencies

```bash
npm install
```

### 3. Set up EV backend

```bash
cd ev-backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Create `ev-backend/.env`:
```
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### 4. Set up chatbot backend

```bash
cd chatbot_assistant
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Create `chatbot_assistant/.env`:
```
GROQ_API_KEY=your_groq_api_key
```

---

## Running the Application

### Run all services together (recommended)

```bash
npm run dev:complete
```

### Run services individually

**Terminal 1 — Frontend:**
```bash
npm run dev
```

**Terminal 2 — Chatbot backend:**
```bash
cd chatbot_assistant
source venv/bin/activate
python3 app.py
```

**Terminal 3 — EV backend:**
```bash
cd ev-backend
source venv/bin/activate
uvicorn main:app --reload --port 8000
```

### Access the app

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| EV Station Map | http://localhost:8000 |
| Chatbot API | http://localhost:5555 |

---

## API Reference

### EV Backend (FastAPI — port 8000)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/ev-stations` | Nearby EV stations by coordinates |
| GET | `/search` | Text search for stations |
| GET | `/directions` | Route between two points |
| GET | `/navigate` | Google Maps navigation link |
| GET | `/health` | Health check |

**Example:**
```
GET /ev-stations?lat=19.0760&lng=72.8777&radius=10000
GET /search?query=EV+charging+Bangalore
GET /directions?origin_lat=19.07&origin_lng=72.87&dest_lat=18.52&dest_lng=73.85&route_type=fastest
```

### Chatbot Backend (Flask — port 5555)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/predict` | Send message, get AI response |
| POST | `/get_greeting` | Get localized greeting |
| POST | `/register` | User registration |
| POST | `/login` | User login |

**Example:**
```json
POST /predict
{
  "message": "Find EV stations near me",
  "language": "en"
}
```

---

## Pages

| Route | Description |
|---|---|
| `/` | Home — Hero, Stats, Map, Pricing, Reviews |
| `/about` | About Charge IQ — Mission, Vision, Team |
| `/features` | Feature showcase with tech specs |
| `/contact` | Contact form and company info |
| `/login` | User login |
| `/signup` | User registration |

---

## Deployment

The frontend is deployed on Vercel. See [DEPLOYMENT.md](./DEPLOYMENT.md) for full instructions.

```bash
# Quick deploy
git push origin main
# Vercel auto-deploys on push
```

> Note: The chatbot and EV backend require separate deployment (Railway, Heroku, etc.) for full functionality on the live site.

---

## Scripts

```bash
npm run dev              # Start Next.js dev server
npm run build            # Build for production
npm run start            # Start production server
npm run chatbot          # Start Flask chatbot backend
npm run ev-backend       # Start FastAPI EV backend
npm run dev:full         # Frontend + chatbot
npm run dev:complete     # All three services
```

---

## Troubleshooting

| Issue | Fix |
|---|---|
| Chatbot shows "I'm currently unavailable" | Start Flask backend: `python3 app.py` in `chatbot_assistant/` |
| EV stations not loading | Start FastAPI backend on port 8000 |
| `ModuleNotFoundError` | Activate venv and run `pip install -r requirements.txt` |
| `python: command not found` | Use `python3` instead of `python` |
| Google API errors | Check `GOOGLE_MAPS_API_KEY` in `ev-backend/.env` |
| Build fails on Vercel | Run `npm run build` locally first to catch TypeScript errors |

---

## License

MIT License — see [LICENSE](./LICENSE) for details.

---

**Happy Charging! ⚡🚗**
