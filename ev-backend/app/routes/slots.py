from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.db import get_slots_collection

router = APIRouter(prefix="/slots", tags=["Slots"])

class SlotUpdateSchema(BaseModel):
    status: str

VALID_STATUSES = ("available", "occupied", "maintenance", "reserved")

DEFAULT_SLOTS = {
    "s1": {"id": "s1", "stationId": "1", "name": "Slot A1", "status": "available", "type": "CCS2", "power": "150 kW"},
    "s2": {"id": "s2", "stationId": "1", "name": "Slot A2", "status": "occupied", "type": "CCS2", "power": "150 kW"},
    "s3": {"id": "s3", "stationId": "2", "name": "Slot B1", "status": "available", "type": "Type 2", "power": "22 kW"},
    "s4": {"id": "s4", "stationId": "3", "name": "Slot C1", "status": "maintenance", "type": "CCS2", "power": "120 kW"},
}

@router.patch("/{slot_id}")
async def update_slot_status(slot_id: str, data: SlotUpdateSchema):
    new_status = data.status.lower().strip()
    if new_status not in VALID_STATUSES:
        raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of: {', '.join(VALID_STATUSES)}")

    mode, collection = await get_slots_collection()

    if mode == "mongo":
        slot = await collection.find_one({"id": slot_id})
        if not slot:
            initial = DEFAULT_SLOTS.get(slot_id, {
                "id": slot_id,
                "stationId": "1",
                "name": f"Slot {slot_id.upper()}",
                "status": new_status,
                "type": "CCS2",
                "power": "150 kW"
            })
            initial["status"] = new_status
            await collection.insert_one(initial.copy())
            return {"ok": True, "slot": initial}
        
        await collection.update_one({"id": slot_id}, {"$set": {"status": new_status}})
        slot["status"] = new_status
        if "_id" in slot:
            del slot["_id"]
        return {"ok": True, "slot": slot}
    else:
        if slot_id not in collection:
            collection[slot_id] = DEFAULT_SLOTS.get(slot_id, {
                "id": slot_id,
                "stationId": "1",
                "name": f"Slot {slot_id.upper()}",
                "status": "available",
                "type": "CCS2",
                "power": "150 kW"
            })
        
        collection[slot_id]["status"] = new_status
        return {"ok": True, "slot": collection[slot_id]}
