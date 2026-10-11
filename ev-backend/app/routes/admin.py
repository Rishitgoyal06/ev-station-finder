from fastapi import APIRouter, HTTPException, Header
from typing import Optional
import jwt
import datetime
from config import JWT_SECRET
from app.db import get_users_collection, get_bookings_collection, get_slots_collection

router = APIRouter(tags=["Admin & Summary"])

PRIVILEGED_ROLES = {"admin", "owner", "worker"}


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


def _is_booking_expired(booking_date: str, booking_time: str) -> bool:
    """Check if a booking's date and time has passed"""
    try:
        # Parse booking datetime - handle both 12-hour and 24-hour formats
        booking_datetime_str = f"{booking_date} {booking_time}"
        try:
            booking_datetime = datetime.datetime.strptime(booking_datetime_str, "%Y-%m-%d %I:%M %p")
        except ValueError:
            booking_datetime = datetime.datetime.strptime(booking_datetime_str, "%Y-%m-%d %H:%M")
        
        # Get current datetime
        now = datetime.datetime.now()
        
        # Add grace period of 2 hours after booking time before marking as expired
        grace_period = datetime.timedelta(hours=2)
        return now > (booking_datetime + grace_period)
    except ValueError:
        # If parsing fails, assume not expired to be safe
        return False


def _should_mark_completed(booking_date: str, booking_time: str) -> bool:
    """Check if a booking should be marked as completed (1+ hours after booking time)"""
    try:
        booking_datetime_str = f"{booking_date} {booking_time}"
        try:
            booking_datetime = datetime.datetime.strptime(booking_datetime_str, "%Y-%m-%d %I:%M %p")
        except ValueError:
            booking_datetime = datetime.datetime.strptime(booking_datetime_str, "%Y-%m-%d %H:%M")
        
        now = datetime.datetime.now()
        
        # Mark as completed 1 hour after booking time
        completion_threshold = datetime.timedelta(hours=1)
        return now > (booking_datetime + completion_threshold)
    except ValueError:
        return False


async def _update_expired_bookings(mode, collection):
    """Automatically update status of expired bookings"""
    if mode == "mongo":
        # Get all confirmed bookings
        cursor = collection.find({"status": "confirmed"})
        bookings = await cursor.to_list(length=1000)
        
        for booking in bookings:
            booking_date = booking.get("date", "")
            booking_time = booking.get("time", "")
            
            if _should_mark_completed(booking_date, booking_time):
                # Mark as completed if 1+ hours past booking time
                await collection.update_one(
                    {"id": booking["id"]}, 
                    {"$set": {"status": "completed"}}
                )
                # Free up the slot
                slot_number = booking.get("slotNumber")
                if slot_number:
                    await _set_slot_status(str(slot_number), "available")
            elif _is_booking_expired(booking_date, booking_time):
                # Mark as expired/cancelled if 2+ hours past booking time with no completion
                await collection.update_one(
                    {"id": booking["id"]}, 
                    {"$set": {"status": "expired"}}
                )
                # Free up the slot
                slot_number = booking.get("slotNumber")
                if slot_number:
                    await _set_slot_status(str(slot_number), "available")
    else:
        # In-memory storage
        for booking_id, booking in list(collection.items()):
            if booking.get("status") == "confirmed":
                booking_date = booking.get("date", "")
                booking_time = booking.get("time", "")
                
                if _should_mark_completed(booking_date, booking_time):
                    booking["status"] = "completed"
                    slot_number = booking.get("slotNumber")
                    if slot_number:
                        await _set_slot_status(str(slot_number), "available")
                elif _is_booking_expired(booking_date, booking_time):
                    booking["status"] = "expired"
                    slot_number = booking.get("slotNumber")
                    if slot_number:
                        await _set_slot_status(str(slot_number), "available")

def _require_privileged(authorization: Optional[str], cookie: Optional[str]) -> str:
    """Decode JWT and require admin/owner/worker role. Returns role string."""
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
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")
    role = (payload.get("role") or "").lower()
    if role not in PRIVILEGED_ROLES:
        raise HTTPException(status_code=403, detail="Access denied")
    return role

@router.get("/summary")
async def get_summary():
    u_mode, u_coll = await get_users_collection()
    b_mode, b_coll = await get_bookings_collection()
    s_mode, s_coll = await get_slots_collection()

    total_users = 0
    total_drivers = 0
    total_owners = 0

    if u_mode == "mongo":
        total_users = await u_coll.count_documents({})
        total_drivers = await u_coll.count_documents({"role": "user"})
        total_owners = await u_coll.count_documents({"role": "owner"})
    else:
        total_users = len(u_coll)
        total_drivers = sum(1 for u in u_coll.values() if u.get("role") == "user")
        total_owners = sum(1 for u in u_coll.values() if u.get("role") == "owner")

    if total_users == 0:
        total_users, total_drivers, total_owners = 12, 10, 2

    total_bookings = 0
    total_revenue = 0.0

    if b_mode == "mongo":
        total_bookings = await b_coll.count_documents({})
        pipeline = [{"$group": {"_id": None, "total": {"$sum": "$amount"}}}]
        rev_res = await b_coll.aggregate(pipeline).to_list(1)
        if rev_res:
            total_revenue = rev_res[0].get("total", 0.0)
    else:
        total_bookings = len(b_coll)
        total_revenue = sum(float(b.get("amount", 0)) for b in b_coll.values())

    if total_bookings == 0:
        total_bookings = 24
        total_revenue = 8900.0

    available_slots = 18
    occupied_slots = 6
    reserved_slots = 2
    maintenance_slots = 1

    if s_mode == "mongo":
        a_count = await s_coll.count_documents({"status": "available"})
        o_count = await s_coll.count_documents({"status": "occupied"})
        r_count = await s_coll.count_documents({"status": "reserved"})
        m_count = await s_coll.count_documents({"status": "maintenance"})
        if a_count + o_count + r_count + m_count > 0:
            available_slots, occupied_slots, reserved_slots, maintenance_slots = a_count, o_count, r_count, m_count
    else:
        if len(s_coll) > 0:
            available_slots = sum(1 for s in s_coll.values() if s.get("status") == "available")
            occupied_slots = sum(1 for s in s_coll.values() if s.get("status") == "occupied")
            reserved_slots = sum(1 for s in s_coll.values() if s.get("status") == "reserved")
            maintenance_slots = sum(1 for s in s_coll.values() if s.get("status") == "maintenance")

    return {
        "totalUsers": total_users,
        "totalStations": 45,
        "totalOwners": total_owners or 5,
        "totalBookings": total_bookings,
        "activeBookings": max(1, int(total_bookings * 0.4)),
        "completedBookings": int(total_bookings * 0.6),
        "totalRevenue": float(total_revenue),
        "availableSlots": available_slots,
        "occupiedSlots": occupied_slots,
        "reservedSlots": reserved_slots,
        "maintenanceSlots": maintenance_slots,
        "totalDrivers": total_drivers or 7
    }

@router.get("/admin/users")
async def get_admin_users():
    u_mode, u_coll = await get_users_collection()
    
    users_list = []
    if u_mode == "mongo":
        cursor = u_coll.find({})
        users_list = await cursor.to_list(length=100)
        for u in users_list:
            if "_id" in u:
                del u["_id"]
    else:
        users_list = list(u_coll.values())

    if not users_list:
        users_list = [
            {"id": "u1", "name": "Ravi Kumar", "email": "user@example.com", "role": "user", "avatar": ""},
            {"id": "u2", "name": "Aarav Sharma", "email": "owner@example.com", "role": "owner", "avatar": ""},
            {"id": "u3", "name": "Admin Control", "email": "admin@chargeiq.com", "role": "admin", "avatar": ""}
        ]

    return {"users": users_list}

@router.get("/admin/bookings")
async def get_all_bookings(
    authorization: Optional[str] = Header(None),
    cookie: Optional[str] = Header(None),
):
    """Return all bookings — accessible only to admin, owner, and worker roles."""
    _require_privileged(authorization, cookie)

    b_mode, b_coll = await get_bookings_collection()
    
    # Update expired bookings before returning results
    await _update_expired_bookings(b_mode, b_coll)

    if b_mode == "mongo":
        cursor = b_coll.find({})
        bookings = await cursor.to_list(length=500)
        for b in bookings:
            b.pop("_id", None)
    else:
        bookings = list(b_coll.values())

    return {"bookings": bookings}


@router.post("/admin/update-expired")
async def update_expired_bookings_admin(
    authorization: Optional[str] = Header(None),
    cookie: Optional[str] = Header(None),
):
    """Manually trigger update of expired bookings - admin only"""
    _require_privileged(authorization, cookie)
    
    b_mode, b_coll = await get_bookings_collection()
    await _update_expired_bookings(b_mode, b_coll)
    
    return {"ok": True, "message": "Expired bookings updated successfully"}
