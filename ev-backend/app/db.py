import os
import asyncio
import certifi
from config import MONGODB_URI

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
            raise e
            
    if db is None:
        raise Exception("MongoDB URI is not configured or initialization failed.")
        
    return db

async def get_users_collection():
    database = get_db()
    await mongo_client.admin.command('ping')
    return ("mongo", database["users"])

async def get_bookings_collection():
    database = get_db()
    await mongo_client.admin.command('ping')
    return ("mongo", database["bookings"])

async def get_slots_collection():
    database = get_db()
    await mongo_client.admin.command('ping')
    return ("mongo", database["slots"])
