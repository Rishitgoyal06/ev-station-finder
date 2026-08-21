@echo off
echo Starting Charge IQ ChatBot Backend...

where python >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Python is not installed. Please install Python 3.11+
    pause
    exit /b 1
)

cd /d "%~dp0ChatBot"

if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

call venv\Scripts\activate.bat
pip install -r requirements.txt --quiet

echo Starting Flask server on http://localhost:5555
echo Press Ctrl+C to stop

python app.py