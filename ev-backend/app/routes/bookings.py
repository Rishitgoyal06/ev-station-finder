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
        return {"bookings": bookings}
    else:
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
