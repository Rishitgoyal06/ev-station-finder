"""
Booking Manager - Handles automatic booking expiration and slot release
"""
import asyncio
import datetime
from typing import Dict, Set
from app.db import get_bookings_collection
import logging

logger = logging.getLogger(__name__)

class BookingManager:
    def __init__(self):
        self.running = False
        self.task = None
        self._processed_bookings: Set[str] = set()
    
    async def start_background_task(self):
        """Start the background task to monitor booking expirations"""
        if self.running:
            return
        
        self.running = True
        self.task = asyncio.create_task(self._monitor_bookings())
        logger.info("Booking manager started")
    
    async def stop_background_task(self):
        """Stop the background task"""
        self.running = False
        if self.task:
            self.task.cancel()
            try:
                await self.task
            except asyncio.CancelledError:
                pass
        logger.info("Booking manager stopped")
    
    async def _monitor_bookings(self):
        """Background task that runs every minute to check for expired bookings"""
        while self.running:
            try:
                await self._process_expired_bookings()
                await asyncio.sleep(60)  # Check every minute
            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error(f"Error in booking monitor: {e}")
                await asyncio.sleep(60)
    
    async def _process_expired_bookings(self):
        """Check for bookings that have expired and mark them as completed"""
        try:
            mode, collection = await get_bookings_collection()
            
            # Skip if MongoDB is not available (using in-memory fallback)
            if mode != "mongo" and not collection:
                return
                
            now = datetime.datetime.utcnow()
            today = now.strftime("%Y-%m-%d")
            current_time = now.strftime("%H:%M")
            
            if mode == "mongo":
                # Find all confirmed bookings for today
                query = {
                    "status": "confirmed",
                    "date": today
                }
                
                cursor = collection.find(query)
                bookings = await cursor.to_list(length=1000)
                
                for booking in bookings:
                    booking_id = booking.get("id")
                    if not booking_id or booking_id in self._processed_bookings:
                        continue
                    
                    if await self._is_booking_expired(booking, now):
                        # Mark booking as completed and add to processed set
                        await collection.update_one(
                            {"id": booking_id},
                            {"$set": {"status": "completed", "completedAt": now.isoformat() + "Z"}}
                        )
                        self._processed_bookings.add(booking_id)
                        logger.info(f"Marked booking {booking_id} as completed (expired)")
            
            else:
                # In-memory storage
                for booking_id, booking in collection.items():
                    if (booking.get("status") == "confirmed" and 
                        booking.get("date") == today and
                        booking_id not in self._processed_bookings):
                        
                        if await self._is_booking_expired(booking, now):
                            booking["status"] = "completed"
                            booking["completedAt"] = now.isoformat() + "Z"
                            self._processed_bookings.add(booking_id)
                            logger.info(f"Marked booking {booking_id} as completed (expired)")
        
        except Exception as e:
            logger.error(f"Error processing expired bookings: {e}")
            # Don't fail the entire application if booking management fails
    
    async def _is_booking_expired(self, booking: dict, current_time: datetime.datetime) -> bool:
        """Check if a booking has expired based on its time slot"""
        booking_time = booking.get("time", "")
        
        if "-" in booking_time:  # e.g., "5:30 PM - 6:15 PM"
            try:
                start_time_str = booking_time.split(" - ")[0].strip()
                # Convert to 24-hour format
                start_time = datetime.datetime.strptime(start_time_str, "%I:%M %p").time()
                
                # Calculate end time (add 45 minutes for charging duration)
                start_datetime = datetime.datetime.combine(current_time.date(), start_time)
                end_datetime = start_datetime + datetime.timedelta(minutes=45)
                
                # Check if current time is past the booking end time
                current_datetime = datetime.datetime.combine(current_time.date(), current_time.time())
                return current_datetime > end_datetime
                
            except ValueError:
                # If time parsing fails, assume not expired
                logger.warning(f"Could not parse booking time: {booking_time}")
                return False
        
        # If time format is not recognized, don't expire
        return False


# Global booking manager instance
booking_manager = BookingManager()

async def start_booking_manager():
    """Start the global booking manager"""
    await booking_manager.start_background_task()

async def stop_booking_manager():
    """Stop the global booking manager"""
    await booking_manager.stop_background_task()