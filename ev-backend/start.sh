#!/bin/bash

echo "🚗 Starting EV Station Finder..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.11+"
    exit 1
fi

# Check if pip is installed
if ! command -v pip3 &> /dev/null; then
    echo "❌ pip3 is not installed. Please install pip3"
    exit 1
fi

# Install dependencies if requirements.txt exists
if [ -f "requirements.txt" ]; then
    echo "📦 Installing dependencies..."
    pip3 install -r requirements.txt
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found. Creating template..."
    cat > .env << EOL
GOOGLE_API_KEY=your_google_api_key_here
MONGO_URL=mongodb://localhost:27017
JWT_SECRET=your-super-secret-jwt-key-here
EOL
    echo "📝 Please edit .env file with your Google API key"
    echo "🔑 Get your Google API key from: https://console.cloud.google.com/"
    echo "✅ Enable Places API, Maps JavaScript API, and Places Photos API"
fi

echo "🚀 Starting server on http://localhost:8000"
echo "📱 Open http://localhost:8000 in your browser"
echo "📚 API docs available at http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop the server"

# Start the FastAPI server
uvicorn main:app --host 0.0.0.0 --port 8000 --reload