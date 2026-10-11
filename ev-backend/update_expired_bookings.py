#!/usr/bin/env python3
"""
Script to manually update expired bookings.
This demonstrates the automatic booking status management functionality.
"""
import asyncio
import sys
import datetime

# Add the current directory to Python path
sys.path.append('.')

from app.db import get_bookings_collection, get_slots_collection


async def set_slot_status(slot_id: str, status: str):
    """Helper function to update slot status"""
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


def is_booking_expired(booking_date: str, booking_time: str) -> bool:
    """Check if a booking's date and time has passed"""
    try:
        # Parse booking datetime
        booking_datetime_str = f"{booking_date} {booking_time}"
        booking_datetime = datetime.datetime.strptime(booking_datetime_str, "%Y-%m-%d %I:%M %p")
        
        # Get current datetime
        now = datetime.datetime.now()
        
        # Add grace period of 2 hours after booking time before marking as expired
        grace_period = datetime.timedelta(hours=2)
        return now > (booking_datetime + grace_period)
    except ValueError:
        # If parsing fails, assume not expired to be safe
        return False


def should_mark_completed(booking_date: str, booking_time: str) -> bool:
    """Check if a booking should be marked as completed (1+ hours after booking time)"""
    try:
        booking_datetime_str = f"{booking_date} {booking_time}"
        booking_datetime = datetime.datetime.strptime(booking_datetime_str, "%Y-%m-%d %I:%M %p")
        
        now = datetime.datetime.now()
        
        # Mark as completed 1 hour after booking time
        completion_threshold = datetime.timedelta(hours=1)
        return now > (booking_datetime + completion_threshold)
    except ValueError:
        return False


async def update_expired_bookings():
    """Update all expired bookings"""
    mode, collection = await get_bookings_collection()
    
    print(f"Database mode: {mode}")
    print("Checking for expired bookings...")
    
    updated_count = 0
    completed_count = 0
    
    if mode == "mongo":
        # Get all confirmed bookings
        cursor = collection.find({"status": "confirmed"})
        bookings = await cursor.to_list(length=1000)
        
        print(f"Found {len(bookings)} confirmed bookings")
        
        for booking in bookings:
            booking_date = booking.get("date", "")
            booking_time = booking.get("time", "")
            booking_id = booking.get("id", "")
            
            print(f"Checking booking {booking_id}: {booking_date} {booking_time}")
            
            if should_mark_completed(booking_date, booking_time):
                # Mark as completed if 1+ hours past booking time
                await collection.update_one(
                    {"id": booking["id"]}, 
                    {"$set": {"status": "completed"}}
                )
                print(f"  ✅ Marked as COMPLETED")
                completed_count += 1
                
                # Free up the slot
                slot_number = booking.get("slotNumber")
                if slot_number:
                    await set_slot_status(str(slot_number), "available")
                    
            elif is_booking_expired(booking_date, booking_time):
                # Mark as expired if 2+ hours past booking time with no completion
                await collection.update_one(
                    {"id": booking["id"]}, 
                    {"$set": {"status": "expired"}}
                )
                print(f"  ⏰ Marked as EXPIRED")
                updated_count += 1
                
                # Free up the slot
                slot_number = booking.get("slotNumber")
                if slot_number:
                    await set_slot_status(str(slot_number), "available")
            else:
                print(f"  ⏳ Still upcoming")
    else:
        # In-memory storage
        bookings = list(collection.values())
        confirmed_bookings = [b for b in bookings if b.get("status") == "confirmed"]
        
        print(f"Found {len(confirmed_bookings)} confirmed bookings")
        
        for booking in confirmed_bookings:
            booking_date = booking.get("date", "")
            booking_time = booking.get("time", "")
            booking_id = booking.get("id", "")
            
            print(f"Checking booking {booking_id}: {booking_date} {booking_time}")
            
            if should_mark_completed(booking_date, booking_time):
                booking["status"] = "completed"
                print(f"  ✅ Marked as COMPLETED")
                completed_count += 1
                
                slot_number = booking.get("slotNumber")
                if slot_number:
                    await set_slot_status(str(slot_number), "available")
                    
            elif is_booking_expired(booking_date, booking_time):
                booking["status"] = "expired"
                print(f"  ⏰ Marked as EXPIRED")
                updated_count += 1
                
                slot_number = booking.get("slotNumber")
                if slot_number:
                    await set_slot_status(str(slot_number), "available")
            else:
                print(f"  ⏳ Still upcoming")
    
    print(f"\n📊 Summary:")
    print(f"   Completed: {completed_count}")
    print(f"   Expired: {updated_count}")
    print(f"   Total updated: {completed_count + updated_count}")


async def main():
    try:
        await update_expired_bookings()
        print("\n✅ Booking status update completed successfully!")
    except Exception as e:
        print(f"\n❌ Error updating bookings: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    asyncio.run(main())