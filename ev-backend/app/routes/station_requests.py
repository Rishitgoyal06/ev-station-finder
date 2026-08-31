from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel
from typing import Optional
import uuid
import datetime
from app.db import get_db

router = APIRouter(prefix="/station-requests", tags=["Station Requests"])


class StationRequestModel(BaseModel):
    station_name: str
    address: str
    charging_type: str
    total_ports: int
    owner_name: Optional[str] = None
    owner_email: Optional[str] = None


async def get_requests_collection():
    db = get_db()
    return db["station_requests"]


@router.post("")
async def submit_station_request(
    body: StationRequestModel,
    authorization: Optional[str] = Header(None),
):
    """Owner submits a new station registration request."""
    col = await get_requests_collection()
    doc = {
        "id": str(uuid.uuid4()),
        "station_name": body.station_name,
        "address": body.address,
        "charging_type": body.charging_type,
        "total_ports": body.total_ports,
        "owner_name": body.owner_name or "Unknown",
        "owner_email": body.owner_email or "",
        "status": "pending",  # pending | approved | rejected
        "submitted_at": datetime.datetime.utcnow().isoformat(),
    }
    await col.insert_one(doc)
    doc.pop("_id", None)
    return {"success": True, "request": doc}


@router.get("")
async def list_station_requests(owner_email: Optional[str] = None):
    """List station requests. Admin gets all; owners filter by their email."""
    col = await get_requests_collection()
    query = {"owner_email": owner_email} if owner_email else {}
    cursor = col.find(query, {"_id": 0}).sort("submitted_at", -1)
    results = await cursor.to_list(length=200)
    return {"requests": results}


@router.patch("/{request_id}")
async def update_request_status(request_id: str, body: dict):
    """Admin: approve or reject a station request."""
    status = body.get("status")
    if status not in ("approved", "rejected", "pending"):
        raise HTTPException(status_code=400, detail="Invalid status")
    col = await get_requests_collection()
    result = await col.update_one(
        {"id": request_id},
        {"$set": {"status": status, "reviewed_at": datetime.datetime.utcnow().isoformat()}},
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Request not found")
    return {"success": True}
