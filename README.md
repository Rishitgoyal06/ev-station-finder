# EV Station Finder 🔋

This is a [Next.js](https://nextjs.org) project for finding electric vehicle charging stations across India, integrated with an AI-powered EV Assistant chatbot.

## Features

- 🗺️ Interactive map with 5000+ EV charging stations
- 🤖 AI-powered EV Assistant chatbot with multilingual support
- ⚡ Real-time charging station availability
- 🔍 Smart search and filtering
- 📱 Responsive design for all devices
- 🌐 Support for 40+ Indian languages

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Python 3.8+ (for chatbot backend)
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

3. Install chatbot backend dependencies:
```bash
cd ChatBot
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cd ..
```

4. Set up environment variables:
   - Create a `.env` file in the `ChatBot` directory
   - Add your API keys:
   ```
   GROQ_API_KEY=your_groq_api_key_here
   ```

### Running the Application

#### Option 1: Run Frontend and Backend Separately

**Terminal 1 - Frontend (Next.js):**
```bash
npm run dev
```

**Terminal 2 - Chatbot Backend (Flask):**
```bash
npm run chatbot
# or manually:
./start-chatbot.sh
```

#### Option 2: Run Both Together (Recommended)
```bash
npm run dev:full
```

### Access the Application

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Chatbot Backend**: [http://localhost:5555](http://localhost:5555)
- **EV Assistant**: Click the floating chat button in the bottom-right corner

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
│   │   ├── api/chatbot/route.ts     # Chatbot API proxy
│   │   ├── layout.tsx               # Main layout with ChatbotButton
│   │   └── page.tsx                 # Home page
│   └── components/
│       ├── ChatbotButton.tsx        # Floating chat button
│       ├── ChatbotModal.tsx         # Chat interface
│       └── ...
├── ChatBot/                         # Flask backend
│   ├── app.py                       # Main Flask application
│   ├── chat.py                      # AI chat logic
│   ├── requirements.txt             # Python dependencies
│   └── templates/                   # HTML templates
├── start-chatbot.sh                 # Backend startup script
└── package.json                     # Frontend dependencies
```

## 🚀 Deployment

### Frontend (Vercel)
```bash
npm run build
# Deploy to Vercel
```

### Backend (Railway/Heroku)
```bash
cd ChatBot
# Deploy Flask app to your preferred platform
# Update API route URL in production
```

## 🛠️ Development

### Adding New Features

1. **Frontend**: Add components in `src/components/`
2. **Backend**: Modify `ChatBot/app.py` or `ChatBot/chat.py`
3. **API**: Update `src/app/api/chatbot/route.ts` for new endpoints

### Environment Variables

**Frontend (.env.local):**
```
NEXT_PUBLIC_CHATBOT_URL=http://localhost:5555
```

**Backend (ChatBot/.env):**
```
GROQ_API_KEY=your_groq_api_key
DATABASE_URL=sqlite:///users.db
FLASK_ENV=development
```

## 🐛 Troubleshooting

### Common Issues

1. **Chatbot not responding**: Ensure Flask backend is running on port 5555
2. **CORS errors**: Check API route configuration
3. **Missing dependencies**: Run `npm install` and `pip install -r requirements.txt`
4. **Port conflicts**: Change ports in configuration files

### Logs

- **Frontend**: Check browser console and terminal
- **Backend**: Check Flask terminal output
- **API**: Check Next.js API logs

## 📝 Scripts

- `npm run dev` - Start Next.js development server
- `npm run chatbot` - Start Flask chatbot backend
- `npm run dev:full` - Start both frontend and backend
- `npm run build` - Build for production
- `npm run start` - Start production server

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test both frontend and backend
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Happy Charging! ⚡🚗**
