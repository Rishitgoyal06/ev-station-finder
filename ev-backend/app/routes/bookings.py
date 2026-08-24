from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel
from typing import Optional, List
import uuid
import datetime
from app.db import get_bookings_collection

router = APIRouter(prefix="/bookings", tags=["Bookings"])

class BookingCreateSchema(BaseModel):
    userId: Optional[str] = "u1"
    stationName: str
    address: Optional[str] = "Station Location"
    date: Optional[str] = None
    time: Optional[str] = None
    connector: Optional[str] = "CCS2"
    amount: Optional[float] = 350.0
    slotNumber: Optional[str] = "A1"
    estimatedCharge: Optional[str] = "45 min"
    vehicleInfo: Optional[str] = "Tata Nexon EV"
    paymentMethod: Optional[str] = "UPI"
    instructions: Optional[str] = ""

DEFAULT_SEED_BOOKINGS = [
    {
        "id": "BK101",
        "userId": "u1",
        "stationName": "GreenCharge Hub",
        "address": "Silicon Valley Tech Park, Block 4, Zone B, Bengaluru",
        "date": "2026-08-23",
        "time": "14:30",
        "connector": "CCS2",
        "amount": 420.0,
        "status": "confirmed",
        "slotNumber": "A2",
        "estimatedCharge": "45 min",
        "image": "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=400&q=80",
        "vehicleInfo": "Tata Nexon EV (GJ05RC1234)",
        "paymentMethod": "UPI",
        "transactionId": "txn_892347101",
        "bookedAt": "2026-08-23T10:00:00.000Z",
        "instructions": "Park in Slot A2 and connect CCS2 gun."
    },
    {
        "id": "BK102",
        "userId": "u1",
        "stationName": "VoltSpark Center",
        "address": "Gotri Road, Near Bright School, Vadodara",
        "date": "2026-08-24",
        "time": "16:00",
        "connector": "Type 2",
        "amount": 250.0,
        "status": "confirmed",
        "slotNumber": "B1",
        "estimatedCharge": "60 min",
        "image": "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=400&q=80",
        "vehicleInfo": "Tata Nexon EV",
        "paymentMethod": "Credit Card",
        "transactionId": "txn_892347102",
        "bookedAt": "2026-08-23T11:15:00.000Z",
        "instructions": "Scan QR code on arrival."
    }
]

@router.get("")
@router.get("/")
async def get_bookings():
    mode, collection = await get_bookings_collection()
    
    if mode == "mongo":
        cursor = collection.find({})
        bookings = await cursor.to_list(length=100)
        for b in bookings:
            if "_id" in b:
                del b["_id"]
        if not bookings:
            return {"bookings": DEFAULT_SEED_BOOKINGS}
        return {"bookings": bookings}
    else:
        if not collection:
            for item in DEFAULT_SEED_BOOKINGS:
                collection[item["id"]] = item
        return {"bookings": list(collection.values())}

@router.get("/{booking_id}")
async def get_booking_by_id(booking_id: str):
    mode, collection = await get_bookings_collection()
    
    booking = None
    if mode == "mongo":
        booking = await collection.find_one({"id": booking_id})
        if booking and "_id" in booking:
            del booking["_id"]
    else:
        booking = collection.get(booking_id)

    if not booking:
        for seed in DEFAULT_SEED_BOOKINGS:
            if seed["id"] == booking_id:
                booking = seed
                break

    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    return {"booking": booking}

@router.post("")
@router.post("/")
async def create_booking(data: BookingCreateSchema):
    mode, collection = await get_bookings_collection()
    booking_id = f"BK{uuid.uuid4().hex[:6].upper()}"
    now_str = datetime.datetime.utcnow().isoformat() + "Z"
    today_str = datetime.datetime.utcnow().strftime("%Y-%m-%d")
    
    booking_doc = {
        "id": booking_id,
        "userId": data.userId or "u1",
        "stationName": data.stationName,
        "address": data.address or "Station Location",
        "date": data.date or today_str,
        "time": data.time or "12:00",
        "connector": data.connector or "CCS2",
        "amount": data.amount or 350.0,
        "status": "confirmed",
        "slotNumber": data.slotNumber or "A1",
        "estimatedCharge": data.estimatedCharge or "45 min",
        "image": "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=400&q=80",
        "vehicleInfo": data.vehicleInfo or "Tata Nexon EV",
        "paymentMethod": data.paymentMethod or "UPI",
        "transactionId": f"txn_{uuid.uuid4().hex[:8]}",
        "bookedAt": now_str,
        "instructions": data.instructions or "Please plug in charger within 10 minutes of arrival."
    }

    if mode == "mongo":
        await collection.insert_one(booking_doc.copy())
    else:
        collection[booking_id] = booking_doc

    return {"booking": booking_doc}
