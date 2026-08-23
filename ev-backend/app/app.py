from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.routes import system, stations, directions, auth, bookings, slots, admin

app = FastAPI(title="Charge IQ - EV Backend")

app.mount("/static", StaticFiles(directory="static"), name="static")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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
