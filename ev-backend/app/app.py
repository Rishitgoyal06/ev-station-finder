from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.routes import system, stations, directions, auth, bookings, slots, admin, station_requests
from app.services.booking_manager import start_booking_manager, stop_booking_manager
import os

app = FastAPI(title="Charge IQ - EV Backend")

# CORS — in production, restrict to your Vercel domain
allowed_origins = os.getenv(
    "ALLOWED_ORIGINS",
    "*"  # default open for dev; set ALLOWED_ORIGINS env var on Render
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Startup event to initialize booking manager
@app.on_event("startup")
async def startup_event():
    await start_booking_manager()

# Shutdown event to cleanup booking manager
@app.on_event("shutdown")
async def shutdown_event():
    await stop_booking_manager()

app.include_router(system.router)
app.include_router(stations.router)
app.include_router(directions.router)
app.include_router(auth.router)
app.include_router(bookings.router)
app.include_router(slots.router)
app.include_router(admin.router)
app.include_router(station_requests.router)

# Mount static files for CSS, JS, images
app.mount("/static", StaticFiles(directory="static"), name="static")
