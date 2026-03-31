#!/bin/bash

# EV Station Finder - Backend Startup Script

echo "🚗 Starting EV Station Finder Backend..."
echo "========================================"

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 is not installed. Please install Python3 to continue."
    exit 1
fi

# Navigate to ev-backend directory
cd ev-backend

# Check if virtual environment exists, if not create one
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install requirements
echo "📥 Installing dependencies..."
pip install -r requirements.txt

# Check if .env file exists and has required keys
if [ ! -f ".env" ]; then
    echo "⚠️  Warning: .env file not found in ev-backend directory."
    echo "Please create one with your API keys."
    echo "Example .env content:"
    echo "GOOGLE_MAPS_API_KEY=your_google_api_key_here"
    echo "MONGO_URI=mongodb://localhost:27017/ev_stations"
    echo "JWT_SECRET=your-super-secret-jwt-key-here"
    exit 1
fi



# Start the FastAPI application
echo "🚀 Starting EV Backend on http://localhost:8000"
echo "📚 API docs available at http://localhost:8000/docs"
echo "Press Ctrl+C to stop the server"
echo "========================================"
uvicorn main:app --host 0.0.0.0 --port 8000 --reload --reload-include="*.html"
