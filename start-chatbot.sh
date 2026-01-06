#!/bin/bash

# EV Station Finder - Chatbot Backend Startup Script

echo "🔋 Starting EV Assistant Chatbot Backend..."
echo "=================================="

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 is not installed. Please install Python3 to continue."
    exit 1
fi

# Navigate to ChatBot directory
cd ChatBot

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

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  Warning: .env file not found. Please create one with your API keys."
    echo "Example .env content:"
    echo "GROQ_API_KEY=your_groq_api_key_here"
fi

# Start the Flask application
echo "🚀 Starting EV Assistant on http://localhost:5555"
echo "Press Ctrl+C to stop the server"
echo "=================================="
python app.py