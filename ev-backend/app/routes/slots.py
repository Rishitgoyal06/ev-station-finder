from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.db import get_slots_collection

router = APIRouter(prefix="/slots", tags=["Slots"])

class SlotUpdateSchema(BaseModel):
    status: str

VALID_STATUSES = ("available", "occupied", "maintenance", "reserved")

# Canonical slot definitions — used as seed data when DB is empty
SEED_SLOTS = [
    {"id": "A1", "stationId": "1", "name": "Slot A1", "status": "available", "type": "CCS2", "power": "150 kW"},
    {"id": "A2", "stationId": "1", "name": "Slot A2", "status": "available", "type": "CCS2", "power": "150 kW"},
    {"id": "A3", "stationId": "1", "name": "Slot A3", "status": "available", "type": "CCS2", "power": "150 kW"},
    {"id": "A4", "stationId": "1", "name": "Slot A4", "status": "available", "type": "Type 2", "power": "22 kW"},
    {"id": "B1", "stationId": "2", "name": "Slot B1", "status": "available", "type": "CCS2", "power": "150 kW"},
    {"id": "B2", "stationId": "2", "name": "Slot B2", "status": "available", "type": "Type 2", "power": "22 kW"},
    {"id": "B3", "stationId": "2", "name": "Slot B3", "status": "available", "type": "CCS2", "power": "150 kW"},
    {"id": "B4", "stationId": "2", "name": "Slot B4", "status": "available", "type": "Type 2", "power": "22 kW"},
]

async def _ensure_slots_seeded(mode, collection):
    """Seed slots into DB if the collection is empty."""
    if mode == "mongo":
        count = await collection.count_documents({})
        if count == 0:
            await collection.insert_many([s.copy() for s in SEED_SLOTS])
    else:
        if not collection:
            for s in SEED_SLOTS:
                collection[s["id"]] = s.copy()


@router.get("")
@router.get("/")
async def get_all_slots():
    mode, collection = await get_slots_collection()
    await _ensure_slots_seeded(mode, collection)

    if mode == "mongo":
        cursor = collection.find({})
        slots = await cursor.to_list(length=200)
        for s in slots:
            s.pop("_id", None)
    else:
        slots = list(collection.values())

    return {"slots": slots}


@router.patch("/{slot_id}")
async def update_slot_status(slot_id: str, data: SlotUpdateSchema):
    new_status = data.status.lower().strip()
    if new_status not in VALID_STATUSES:
        raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of: {', '.join(VALID_STATUSES)}")

    mode, collection = await get_slots_collection()
    await _ensure_slots_seeded(mode, collection)

    # Find the seed definition or create a generic one
    seed = next((s for s in SEED_SLOTS if s["id"] == slot_id), {
        "id": slot_id,
        "stationId": "1",
        "name": f"Slot {slot_id.upper()}",
        "type": "CCS2",
        "power": "150 kW",
    })

    if mode == "mongo":
        slot = await collection.find_one({"id": slot_id})
        if not slot:
            slot = {**seed, "status": new_status}
            await collection.insert_one(slot.copy())
            return {"ok": True, "slot": {k: v for k, v in slot.items() if k != "_id"}}

        await collection.update_one({"id": slot_id}, {"$set": {"status": new_status}})
        slot["status"] = new_status
        slot.pop("_id", None)
        return {"ok": True, "slot": slot}
    else:
        if slot_id not in collection:
            collection[slot_id] = {**seed, "status": new_status}
        else:
            collection[slot_id]["status"] = new_status
        return {"ok": True, "slot": collection[slot_id]}
