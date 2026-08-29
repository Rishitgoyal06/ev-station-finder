# Environment Setup Guide

## Prerequisites

- **Node.js 18+** - [Download from nodejs.org](https://nodejs.org/)
- **Python 3.10+** - [Download from python.org](https://python.org/)
- **MongoDB** (Optional) - For user authentication and bookings
- **Git** - For version control

## Quick Start

### 1. Install Dependencies

All dependencies are now installed! ✅

- Frontend: Node.js dependencies installed
- EV Backend: Python virtual environment with FastAPI setup
- ChatBot: Python virtual environment with Flask/Groq setup

### 2. Configure Environment Variables

**Important:** You need to obtain API keys before running the services.

#### Required API Keys:

1. **Google Maps API Key** (Required for EV station data)
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create/select a project
   - Enable APIs: Places API, Maps JavaScript API, Directions API
   - Generate API key and add to `ev-backend/.env`

2. **Groq API Key** (Required for AI chatbot)
   - Go to [Groq Console](https://console.groq.com/)
   - Sign up for free account (free tier available)
   - Generate API key and add to `ChatBot/.env`

#### Update Configuration Files:

1. Edit `ev-backend/.env`:
   ```bash
   GOOGLE_MAPS_API_KEY=your_actual_google_api_key
   ```

2. Edit `ChatBot/.env`:
   ```bash
   GROQ_API_KEY=your_actual_groq_api_key
   ```

### 3. Run the Application

**Option 1: Run all services together (Recommended)**
```bash
cd frontend
npm run dev:complete
```

**Option 2: Run services individually**

Terminal 1 - Frontend:
```bash
cd frontend
npm run dev
```

Terminal 2 - EV Backend:
```bash
cd ev-backend
# Windows
.\venv\Scripts\activate
uvicorn main:app --reload --port 8000

# Linux/Mac
source venv/bin/activate
uvicorn main:app --reload --port 8000
```

Terminal 3 - ChatBot:
```bash
cd ChatBot
# Windows
.\venv\Scripts\activate
python app.py

# Linux/Mac
source venv/bin/activate
python app.py
```

### 4. Access the Application

| Service | URL | Status |
|---------|-----|--------|
| Frontend | http://localhost:3000 | ✅ Ready |
| EV Backend | http://localhost:8000 | ⚠️ Needs Google API Key |
| ChatBot | http://localhost:5555 | ⚠️ Needs Groq API Key |

## Verification

### Test Frontend
- Open http://localhost:3000
- Should see the Charge IQ homepage with animations

### Test EV Backend
- Open http://localhost:8000/health
- Should return: `{"status": "ok"}`
- For station data: http://localhost:8000/ev-stations?lat=19.0760&lng=72.8777&radius=10000

### Test ChatBot
- Open http://localhost:5555/health
- Should return: `{"ok": true, "service": "EV Assistant"}`

## Troubleshooting

### Common Issues

1. **"ModuleNotFoundError"**
   - Ensure virtual environment is activated
   - Run `pip install -r requirements.txt` in the respective directory

2. **"GOOGLE_MAPS_API_KEY not found"**
   - Add your Google API key to `ev-backend/.env`
   - Ensure Places API is enabled in Google Cloud Console

3. **"Groq API Error"**
   - Add your Groq API key to `ChatBot/.env`
   - Check your Groq account quota

4. **Frontend build errors**
   - Run `npm install` in frontend directory
   - Check Node.js version (requires 18+)

5. **Port conflicts**
   - Frontend: 3000 (Next.js)
   - EV Backend: 8000 (FastAPI)
   - ChatBot: 5555 (Flask)
   - Ensure no other services are using these ports

### MongoDB (Optional)

The app works without MongoDB for basic functionality. To enable user authentication:

1. Install MongoDB locally or use MongoDB Atlas
2. Update `MONGODB_URI` in `ev-backend/.env`
3. The app will automatically connect on startup

## Development Workflow

1. **Frontend Development**: Work in `src/` directory
2. **EV Backend**: Modify files in `ev-backend/app/`
3. **ChatBot**: Update `ChatBot/chat.py` for AI logic
4. **Styling**: Use Tailwind CSS classes
5. **Testing**: Each service has health check endpoints

## Production Deployment

- **Frontend**: Deploy to Vercel (auto-configured)
- **Backend Services**: Deploy to Railway, Heroku, or similar
- **Environment Variables**: Set in deployment platform
- **Domain Configuration**: Update CORS settings for production domains

---

**Need Help?** Check the main README.md for detailed architecture and API documentation.