#!/bin/bash

echo "Starting Charge IQ EV Backend..."

if ! command -v python3 &> /dev/null; then
    echo "Python 3 is not installed. Please install Python 3.11+"
    exit 1
fi

if [ ! -f ".env" ]; then
    echo ".env file not found. Copy .env.example and fill in your keys."
    cp .env.example .env
    echo ".env created from template. Please add your GOOGLE_MAPS_API_KEY."
    exit 1
fi

if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

source venv/bin/activate
pip install -r requirements.txt --quiet

echo "Starting server on http://localhost:8000"
echo "API docs at http://localhost:8000/docs"
echo "Press Ctrl+C to stop"

uvicorn main:app --host 0.0.0.0 --port 8000 --reload
