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


from fastapi import Header

@router.patch("/{slot_id}")
async def update_slot_status(
    slot_id: str,
    data: SlotUpdateSchema,
    authorization: Optional[str] = Header(None),
    cookie: Optional[str] = Header(None),
):
    new_status = data.status.lower().strip()
    if new_status not in VALID_STATUSES:
        raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of: {', '.join(VALID_STATUSES)}")

    mode, collection = await get_slots_collection()
    await _ensure_slots_seeded(mode, collection)

    seed = next((s for s in SEED_SLOTS if s["id"] == slot_id or s.get("slotNumber") == slot_id), {
        "id": slot_id,
        "slotNumber": slot_id,
        "stationId": "1",
        "name": f"Slot {slot_id.upper()}",
        "type": "CCS2",
        "power": "150 kW",
    })

    if mode == "mongo":
        slot = await collection.find_one({
            "$or": [
                {"id": slot_id},
                {"slotNumber": slot_id},
                {"name": f"Slot {slot_id.upper()}"},
                {"name": slot_id}
            ]
        })
        if not slot:
            slot = {**seed, "status": new_status}
            await collection.insert_one(slot.copy())
            return {"ok": True, "slot": {k: v for k, v in slot.items() if k != "_id"}}

        await collection.update_one({"_id": slot["_id"]}, {"$set": {"status": new_status}})
        slot["status"] = new_status
        slot.pop("_id", None)
        return {"ok": True, "slot": slot}
    else:
        found_key = slot_id if slot_id in collection else None
        if not found_key:
            for k, v in collection.items():
                if v.get("id") == slot_id or v.get("slotNumber") == slot_id or v.get("name") == f"Slot {slot_id.upper()}":
                    found_key = k
                    break

        if not found_key:
            collection[slot_id] = {**seed, "status": new_status}
            return {"ok": True, "slot": collection[slot_id]}
        else:
            collection[found_key]["status"] = new_status
            return {"ok": True, "slot": collection[found_key]}
