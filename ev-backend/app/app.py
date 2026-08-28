from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import system, stations, directions, auth, bookings, slots, admin
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

app.include_router(system.router)
app.include_router(stations.router)
app.include_router(directions.router)
app.include_router(auth.router)
app.include_router(bookings.router)
app.include_router(slots.router)
app.include_router(admin.router)
