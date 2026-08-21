@echo off
echo Starting Charge IQ EV Backend...

where python >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Python is not installed. Please install Python 3.11+
    pause
    exit /b 1
)

cd /d "%~dp0ev-backend"

if not exist ".env" (
    echo .env file not found. Copy .env.example and fill in your keys.
    copy .env.example .env
    echo .env created from template. Please add your GOOGLE_MAPS_API_KEY.
    pause
    exit /b 1
)

if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

call venv\Scripts\activate.bat
pip install -r requirements.txt --quiet

echo Starting server on http://localhost:8000
echo API docs at http://localhost:8000/docs
echo Press Ctrl+C to stop

python main.py