from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel
from typing import Optional
import jwt
import uuid
import datetime
from config import JWT_SECRET
from app.db import get_bookings_collection, get_slots_collection

router = APIRouter(prefix="/bookings", tags=["Bookings"])


class BookingCreateSchema(BaseModel):
    stationId: Optional[str] = None
    stationPlaceId: Optional[str] = None
    stationName: str
    address: Optional[str] = "Station Location"
    date: Optional[str] = None
    time: Optional[str] = None
    connector: Optional[str] = "CCS2"
    amount: Optional[float] = 350.0
    slotNumber: Optional[str] = "A1"
    estimatedCharge: Optional[str] = "45 min"
    vehicleInfo: Optional[str] = None
    paymentMethod: Optional[str] = "UPI"
    instructions: Optional[str] = ""
    baseCharge: Optional[float] = None
    serviceFee: Optional[float] = None
    tax: Optional[float] = None
    ratePerKwh: Optional[float] = None
    energyEstimateKwh: Optional[float] = None


def _extract_user_id(authorization: Optional[str], cookie: Optional[str]) -> Optional[str]:
    """Extract userId from JWT in Authorization header or cookie. Returns None if invalid/missing."""
    token = None
    if authorization and authorization.startswith("Bearer "):
        token = authorization.replace("Bearer ", "")
    elif cookie and "chargeiq_token=" in cookie:
        for part in cookie.split(";"):
            part = part.strip()
            if part.startswith("chargeiq_token="):
                token = part.split("chargeiq_token=")[1]
                break
    if not token:
        return None
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        return payload.get("userId")
    except Exception:
        return None


def _normalize_booking_slot(value: str | None) -> str:
    return (value or "").strip().lower()


async def _booking_conflicts(
    collection_mode,
    collection,
    station_id: str | None,
    station_place_id: str | None,
    station_name: str,
    date: str,
    time: str,
    slot_number: str,
) -> bool:
    def matches(booking: dict) -> bool:
        if booking.get("status") == "cancelled":
            return False
        booking_station_id = str(booking.get("stationId") or "")
        booking_place_id = str(booking.get("stationPlaceId") or "")
        booking_date = str(booking.get("date") or "")
        booking_time = str(booking.get("time") or "")
        booking_slot = str(booking.get("slotNumber") or "")
        same_station = False
        if station_id and booking_station_id:
            same_station = booking_station_id == station_id
        elif station_place_id and booking_place_id:
            same_station = booking_place_id == station_place_id
        else:
            same_station = str(booking.get("stationName") or "") == station_name
        return same_station and booking_date == date and booking_time == time and booking_slot == slot_number

    if collection_mode == "mongo":
        station_filter = []
        if station_id:
            station_filter.append({"stationId": station_id})
        if station_place_id:
            station_filter.append({"stationPlaceId": station_place_id})
        station_filter.append({"stationName": station_name})

        query = {
            "status": {"$ne": "cancelled"},
            "date": date,
            "time": time,
            "slotNumber": slot_number,
            "$or": station_filter
        }
        conflict_doc = await collection.find_one(query)
        return conflict_doc is not None

    return any(matches(b) for b in collection.values())


async def _set_slot_status(slot_id: str, status: str):
    mode, slots = await get_slots_collection()
    if mode == "mongo":
        slot = await slots.find_one({"id": slot_id})
        if slot:
            await slots.update_one({"id": slot_id}, {"$set": {"status": status}})
        else:
            await slots.insert_one({
                "id": slot_id,
                "stationId": "1",
                "name": f"Slot {slot_id}",
                "status": status,
                "type": "CCS2",
                "power": "150 kW"
            })
    else:
        slots[slot_id] = slots.get(slot_id, {
            "id": slot_id,
            "stationId": "1",
            "name": f"Slot {slot_id}",
            "type": "CCS2",
            "power": "150 kW"
        })
        slots[slot_id]["status"] = status


@router.get("")
@router.get("/")
async def get_bookings(
    authorization: Optional[str] = Header(None),
    cookie: Optional[str] = Header(None),
):
    user_id = _extract_user_id(authorization, cookie)
    if not user_id:
        raise HTTPException(status_code=401, detail="Not authenticated")

    mode, collection = await get_bookings_collection()

    if mode == "mongo":
        cursor = collection.find({"userId": user_id})
        bookings = await cursor.to_list(length=200)
        for b in bookings:
            b.pop("_id", None)
    else:
        bookings = [b for b in collection.values() if b.get("userId") == user_id]

    return {"bookings": bookings}


@router.get("/{booking_id}")
async def get_booking_by_id(
    booking_id: str,
    authorization: Optional[str] = Header(None),
    cookie: Optional[str] = Header(None),
):
    user_id = _extract_user_id(authorization, cookie)
    if not user_id:
        raise HTTPException(status_code=401, detail="Not authenticated")

    mode, collection = await get_bookings_collection()

    booking = None
    if mode == "mongo":
        booking = await collection.find_one({"id": booking_id})
        if booking:
            booking.pop("_id", None)
    else:
        booking = collection.get(booking_id)

    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    # Ensure the booking belongs to the requesting user
    if booking.get("userId") != user_id:
        raise HTTPException(status_code=403, detail="Access denied")

    return {"booking": booking}


@router.post("")
@router.post("/")
async def create_booking(
    data: BookingCreateSchema,
    authorization: Optional[str] = Header(None),
    cookie: Optional[str] = Header(None),
):
    user_id = _extract_user_id(authorization, cookie)
    if not user_id:
        raise HTTPException(status_code=401, detail="Not authenticated")

    mode, collection = await get_bookings_collection()
    booking_id = f"BK{uuid.uuid4().hex[:6].upper()}"
    now_str = datetime.datetime.utcnow().isoformat() + "Z"
    today_str = datetime.datetime.utcnow().strftime("%Y-%m-%d")
    booking_date = data.date or today_str
    booking_time = data.time or "12:00"
    slot_number = data.slotNumber or "A1"
    station_id = data.stationId or None
    station_place_id = data.stationPlaceId or None

    if await _booking_conflicts(
        mode, collection, station_id, station_place_id,
        data.stationName, booking_date, booking_time, slot_number
    ):
        raise HTTPException(
            status_code=409,
            detail="That slot is already booked for the selected date and time"
        )

    booking_doc = {
        "id": booking_id,
        "userId": user_id,  # always from token — never from request body
        "stationId": station_id,
        "stationPlaceId": station_place_id,
        "stationName": data.stationName,
        "address": data.address or "Station Location",
        "date": booking_date,
        "time": booking_time,
        "connector": data.connector or "CCS2",
        "amount": data.amount or 350.0,
        "baseCharge": data.baseCharge,
        "serviceFee": data.serviceFee,
        "tax": data.tax,
        "ratePerKwh": data.ratePerKwh,
        "energyEstimateKwh": data.energyEstimateKwh,
        "status": "confirmed",
        "slotNumber": slot_number,
        "estimatedCharge": data.estimatedCharge or "45 min",
        "image": "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=400&q=80",
        "vehicleInfo": data.vehicleInfo or "",
        "paymentMethod": data.paymentMethod or "UPI",
        "transactionId": f"txn_{uuid.uuid4().hex[:8]}",
        "bookedAt": now_str,
        "instructions": data.instructions or "Please plug in charger within 10 minutes of arrival.",
    }

    if mode == "mongo":
        await collection.insert_one(booking_doc.copy())
    else:
        collection[booking_id] = booking_doc

    await _set_slot_status(slot_number, "occupied")

    return {"booking": booking_doc}


@router.delete("/{booking_id}")
async def cancel_booking(
    booking_id: str,
    authorization: Optional[str] = Header(None),
    cookie: Optional[str] = Header(None),
):
    user_id = _extract_user_id(authorization, cookie)
    if not user_id:
        raise HTTPException(status_code=401, detail="Not authenticated")

    mode, collection = await get_bookings_collection()
    booking = None

    if mode == "mongo":
        booking = await collection.find_one({"id": booking_id})
        if not booking:
            raise HTTPException(status_code=404, detail="Booking not found")
        if booking.get("userId") != user_id:
            raise HTTPException(status_code=403, detail="Access denied")
        await collection.update_one({"id": booking_id}, {"$set": {"status": "cancelled"}})
        booking["status"] = "cancelled"
        booking.pop("_id", None)
    else:
        booking = collection.get(booking_id)
        if not booking:
            raise HTTPException(status_code=404, detail="Booking not found")
        if booking.get("userId") != user_id:
            raise HTTPException(status_code=403, detail="Access denied")
        booking["status"] = "cancelled"

    slot_number = booking.get("slotNumber")
    if slot_number:
        await _set_slot_status(str(slot_number), "available")

    return {"ok": True, "booking": booking}
