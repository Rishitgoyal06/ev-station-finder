# EV Station Finder 🔋

This is a [Next.js](https://nextjs.org) project for finding electric vehicle charging stations across India, integrated with an AI-powered EV Assistant chatbot and a comprehensive EV station finder backend.

## Features

- 🗺️ Interactive map with 5000+ EV charging stations
- 🤖 AI-powered EV Assistant chatbot with multilingual support
- ⚡ Real-time charging station availability
- 🔍 Smart search and filtering with Google Places API
- 📱 Responsive design for all devices
- 🌐 Support for 40+ Indian languages
- 🚗 Advanced EV station finder with MongoDB integration
- 📍 Location-based station discovery
- 🛣️ Route optimization and directions

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Python 3.8+ (for chatbot backend)
- Python 3.11+ (for EV backend)
- MongoDB (for EV station data)
- Google Maps API Key
- Git

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ev-station-finder
```

2. Install frontend dependencies:
```bash
npm install
```

3. Install EV backend dependencies:
```bash
cd ev-backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cd ..
```

4. Install chatbot backend dependencies:
```bash
cd ChatBot
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cd ..
```

5. Set up environment variables:
   
   **For Chatbot (ChatBot/.env):**
   ```
   GROQ_API_KEY=your_groq_api_key_here
   ```
   
   **For EV Backend (ev-backend/.env):**
   ```
   GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
   MONGO_URI=mongodb://localhost:27017/ev_stations
   JWT_SECRET=your-super-secret-jwt-key-here
   ```

### Running the Application

#### Option 1: Run All Services Separately

**Terminal 1 - Frontend (Next.js):**
```bash
npm run dev
```

**Terminal 2 - Chatbot Backend (Flask):**
```bash
npm run chatbot
```

**Terminal 3 - EV Backend (FastAPI):**
```bash
npm run ev-backend
```

#### Option 2: Run Frontend + Chatbot
```bash
npm run dev:full
```

#### Option 3: Run All Services Together (Recommended)
```bash
npm run dev:complete
```

### Access the Application

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **EV Backend**: [http://localhost:8000](http://localhost:8000) (Complete map interface)
- **EV Assistant**: Click the floating chat button in the bottom-right corner
- **EV Station Finder**: Click "Find Charging Stations" button on homepage (opens backend)

## 🚗 EV Station Finder Integration

### Architecture Overview

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Next.js App   │    │  EV Backend      │    │    MongoDB      │
│  (Frontend UI)  │───►│  Frontend+API    │◄──►│   Database      │
│                 │    │  (ev-backend/)   │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │ Google Places   │
                       │      API        │
                       └─────────────────┘
```

### Components

1. **HeroSection Integration** - "Find Charging Stations" button opens EV backend frontend
2. **EV Backend Frontend** - `ev-backend/static/index.html` - Complete map interface
3. **FastAPI Backend** - `ev-backend/main.py` - Handles Google Places API and MongoDB
4. **Direct Integration** - No proxy needed, direct access to backend features

### Features

- **Location-based Search**: Automatically finds nearby stations using GPS
- **Text Search**: Search for stations by location name or address
- **Real-time Data**: Live station information from Google Places API
- **Station Details**: Photos, ratings, phone numbers, and operating hours
- **Navigation Integration**: Direct links to Google Maps for directions
- **MongoDB Storage**: User data, search history, reviews, and favorites
- **Authentication**: JWT-based user authentication system

### EV Station Finder Flow

1. User clicks "Find Charging Stations" on homepage
2. Opens the EV backend's interactive map interface in a new tab (http://localhost:8000)
3. Browser requests location permission
4. Full-featured map displays with:
   - Real-time location tracking
   - Interactive station markers with photos and details
   - Advanced search functionality
   - Route optimization (fastest, shortest, eco-friendly)
   - Turn-by-turn directions
   - Dark/light mode toggle
   - List and map view toggle
5. Direct integration with Google Places API for live data
6. MongoDB storage for user preferences and history

### Backend API Endpoints

- `GET /ev-stations` - Get nearby EV stations by coordinates
- `GET /search` - Search EV stations by text query
- `GET /directions` - Get route directions between points
- `POST /register` - User registration
- `POST /login` - User authentication
- `GET /favorites` - User's favorite stations
- `POST /reviews` - Add station reviews

## 🤖 EV Assistant Chatbot Integration

### Architecture Overview

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Next.js App   │    │   API Route      │    │  Flask Backend  │
│  (Frontend UI)  │◄──►│ /api/chatbot     │◄──►│   (ChatBot/)    │
│                 │    │                  │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### Components

1. **ChatbotButton.tsx** - Floating action button in bottom-right corner
2. **ChatbotModal.tsx** - Chat interface with message history and language selection
3. **API Route** - `/src/app/api/chatbot/route.ts` - Proxies requests to Flask backend
4. **Flask Backend** - `ChatBot/app.py` - Handles AI processing and responses

### Features

- **Multilingual Support**: 40+ Indian languages including Hindi, Tamil, Bengali, etc.
- **Real-time Chat**: Instant responses with typing indicators
- **Persistent Sessions**: Chat history maintained during session
- **Responsive Design**: Works on desktop and mobile devices
- **Error Handling**: Graceful fallbacks when backend is unavailable

### Chatbot Flow

1. User clicks the floating chat button (🔋)
2. ChatbotModal opens with welcome message
3. User selects preferred language from dropdown
4. User types message and presses Enter or clicks send
5. Frontend sends request to `/api/chatbot`
6. API route forwards request to Flask backend at `localhost:5555/predict`
7. Flask processes message using AI model (Groq)
8. Response flows back through API route to frontend
9. Bot message appears in chat interface

### Backend API Endpoints

- `POST /predict` - Main chat endpoint
- `POST /get_greeting` - Get localized greeting
- `GET /login` - User authentication (if needed)
- `POST /register` - User registration (if needed)

## 📁 Project Structure

```
ev-station-finder/
├── src/
│   ├── app/
│   │   ├── api/chatbot/route.ts         # Chatbot API proxy
│   │   ├── layout.tsx                   # Main layout with ChatbotButton
│   │   └── page.tsx                     # Home page
│   └── components/
│       ├── ChatbotButton.tsx            # Floating chat button
│       ├── ChatbotModal.tsx             # Chat interface
│       ├── HeroSection.tsx              # Updated with EV backend link
│       └── ...
├── ev-backend/                          # FastAPI backend + Frontend
│   ├── main.py                          # Main FastAPI application
│   ├── static/index.html                # Complete EV map interface
│   ├── .env                             # Environment variables
│   ├── requirements.txt                 # Python dependencies
│   └── start.sh                         # Backend startup script
├── ChatBot/                             # Flask backend
│   ├── app.py                           # Main Flask application
│   ├── chat.py                          # AI chat logic
│   ├── requirements.txt                 # Python dependencies
│   └── templates/                       # HTML templates
├── start-ev-backend.sh                  # EV backend startup script
├── start-chatbot.sh                     # Chatbot startup script
└── package.json                         # Frontend dependencies
```

## 🚀 Deployment

### Frontend (Vercel)
```bash
npm run build
# Deploy to Vercel
# Set environment variables:
# EV_BACKEND_URL=https://your-ev-backend.railway.app
```

### EV Backend (Railway/Heroku)
```bash
cd ev-backend
# Deploy FastAPI app to your preferred platform
# Set environment variables for production
```

### Chatbot Backend (Railway/Heroku)
```bash
cd ChatBot
# Deploy Flask app to your preferred platform
# Update API route URL in production
```

## 🛠️ Development

### Adding New Features

1. **Frontend**: Add components in `src/components/`
2. **EV Backend**: Modify `ev-backend/main.py`
3. **Chatbot Backend**: Modify `ChatBot/app.py` or `ChatBot/chat.py`
4. **API**: Update API routes in `src/app/api/`

### Environment Variables

**Frontend (.env.local):**
```
NEXT_PUBLIC_CHATBOT_URL=http://localhost:5555
EV_BACKEND_URL=http://localhost:8000
```

**EV Backend (ev-backend/.env):**
```
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
MONGO_URI=mongodb://localhost:27017/ev_stations
JWT_SECRET=your-super-secret-jwt-key
```

**Chatbot Backend (ChatBot/.env):**
```
GROQ_API_KEY=your_groq_api_key
DATABASE_URL=sqlite:///users.db
FLASK_ENV=development
```

## 🐛 Troubleshooting

### Common Issues

1. **EV stations not loading**: Ensure FastAPI backend is running on port 8000
2. **Chatbot not responding**: Ensure Flask backend is running on port 5555
3. **Google API errors**: Check your Google Maps API key and enabled services
4. **MongoDB connection issues**: Ensure MongoDB is running and connection string is correct
5. **CORS errors**: Check API route configuration
6. **Missing dependencies**: Run `npm install` and `pip install -r requirements.txt` in respective directories
7. **Port conflicts**: Change ports in configuration files

### Logs

- **Frontend**: Check browser console and terminal
- **EV Backend**: Check FastAPI terminal output and logs
- **Chatbot Backend**: Check Flask terminal output
- **API**: Check Next.js API logs

## 📝 Scripts

- `npm run dev` - Start Next.js development server
- `npm run ev-backend` - Start FastAPI EV backend
- `npm run chatbot` - Start Flask chatbot backend
- `npm run dev:full` - Start frontend + chatbot
- `npm run dev:complete` - Start all services (frontend + chatbot + EV backend)
- `npm run build` - Build for production
- `npm run start` - Start production server

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test frontend, chatbot backend, and EV backend
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Happy Charging! ⚡🚗**
