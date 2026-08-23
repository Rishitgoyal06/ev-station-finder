import os
import asyncio
import certifi
from config import MONGODB_URI

memory_db = {
    "users": {},
    "bookings": {},
    "slots": {}
}

mongo_client = None
db = None

def get_db():
    global mongo_client, db
    if db is None and MONGODB_URI and ("mongodb+srv://" in MONGODB_URI or "mongodb://" in MONGODB_URI):
        try:
            from motor.motor_asyncio import AsyncIOMotorClient
            mongo_client = AsyncIOMotorClient(
                MONGODB_URI,
                serverSelectionTimeoutMS=5000,
                tlsCAFile=certifi.where()
            )
            # Use EvStationFinderDatabase as default database name
            db = mongo_client.get_database("EvStationFinderDatabase")
        except Exception as e:
            print(f"MongoDB init exception: {e}")
    return db

async def get_users_collection():
    database = get_db()
    if database is not None:
        try:
            await mongo_client.admin.command('ping')
            return ("mongo", database["users"])
        except Exception as e:
            print(f"MongoDB ping error (users): {e}")
    return ("memory", memory_db["users"])

async def get_bookings_collection():
    database = get_db()
    if database is not None:
        try:
            await mongo_client.admin.command('ping')
            return ("mongo", database["bookings"])
        except Exception as e:
            print(f"MongoDB ping error (bookings): {e}")
    return ("memory", memory_db["bookings"])

async def get_slots_collection():
    database = get_db()
    if database is not None:
        try:
            await mongo_client.admin.command('ping')
            return ("mongo", database["slots"])
        except Exception as e:
            print(f"MongoDB ping error (slots): {e}")
    return ("memory", memory_db["slots"])
