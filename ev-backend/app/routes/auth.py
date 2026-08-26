from fastapi import APIRouter, HTTPException, Header, Response
from pydantic import BaseModel
from typing import Optional
import jwt
import uuid
import datetime
from passlib.context import CryptContext
from config import JWT_SECRET
from app.db import get_users_collection

import bcrypt

router = APIRouter(prefix="/auth", tags=["Auth"])
SECRET_KEY = JWT_SECRET

def safe_hash(password: str) -> str:
    pw_bytes = password.encode("utf-8")[:72]
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(pw_bytes, salt).decode("utf-8")

def safe_verify(plain_password: str, hashed_password: str) -> bool:
    if not hashed_password:
        return False
    if plain_password == hashed_password:
        return True
    try:
        pw_bytes = plain_password.encode("utf-8")[:72]
        hash_bytes = hashed_password.encode("utf-8")
        return bcrypt.checkpw(pw_bytes, hash_bytes)
    except Exception:
        return False

class LoginSchema(BaseModel):
    email: Optional[str] = None
    username: Optional[str] = None
    password: Optional[str] = None

class RegisterSchema(BaseModel):
    name: str
    email: str
    password: str
    role: Optional[str] = "user"

class GoogleAuthSchema(BaseModel):
    credential: Optional[str] = None
    userInfo: Optional[dict] = None
    role: Optional[str] = "user"

class UpdateProfileSchema(BaseModel):
    name: Optional[str] = None
    avatar: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    vehicleModel: Optional[str] = None
    vehicleNumber: Optional[str] = None
    preferredConnector: Optional[str] = None
    notifications: Optional[bool] = None
    locationSharing: Optional[bool] = None
    emailUpdates: Optional[bool] = None
    smsAlerts: Optional[bool] = None
    darkMode: Optional[bool] = None

def normalize_role(role: Optional[str]) -> str:
    r = (role or "").lower()
    if r in ("customer", "user", "driver"):
        return "user"
    if r in ("station_owner", "owner"):
        return "owner"
    if r in ("admin", "worker"):
        return r
    return "user"

def _build_profile(user_doc: dict) -> dict:
    return {
        "id": user_doc.get("id"),
        "name": user_doc.get("name", ""),
        "email": user_doc.get("email", ""),
        "role": normalize_role(user_doc.get("role")),
        "avatar": user_doc.get("avatar", ""),
        "phone": user_doc.get("phone", ""),
        "address": user_doc.get("address", ""),
        "vehicleModel": user_doc.get("vehicleModel", ""),
        "vehicleNumber": user_doc.get("vehicleNumber", ""),
        "preferredConnector": user_doc.get("preferredConnector", "CCS2"),
        "preferences": user_doc.get("preferences", {
            "notifications": True,
            "locationSharing": True,
            "emailUpdates": False,
            "smsAlerts": True,
            "darkMode": True,
        }),
        "createdAt": user_doc.get("createdAt"),
    }

def create_token(user_id: str, email: str, name: str, role: str) -> str:
    payload = {
        "userId": user_id,
        "email": email,
        "name": name,
        "role": role,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(days=7)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")


async def ensure_default_admin():
    mode, collection = await get_users_collection()
    admin_email = "admin@test.com"
    admin_doc = {
        "id": "admin_1",
        "name": "Admin User",
        "email": admin_email,
        "password": safe_hash("password123"),
        "role": "admin",
        "avatar": "",
        "createdAt": datetime.datetime.utcnow().isoformat()
    }

    if mode == "mongo":
        existing = await collection.find_one({"email": admin_email})
        if not existing:
            await collection.insert_one(admin_doc)
    else:
        if admin_email not in collection:
            collection[admin_email] = admin_doc

@router.post("/register")
async def register(data: RegisterSchema, response: Response):
    await ensure_default_admin()
    mode, collection = await get_users_collection()
    user_email = data.email.lower().strip()
    role = normalize_role(data.role)
    
    if mode == "mongo":
        existing = await collection.find_one({"email": user_email})
    else:
        existing = collection.get(user_email)
        
    if existing:
        raise HTTPException(status_code=400, detail="User with this email already exists")

    hashed_password = safe_hash(data.password)
    user_id = f"u_{uuid.uuid4().hex[:8]}"
    
    user_doc = {
        "id": user_id,
        "name": data.name,
        "email": user_email,
        "password": hashed_password,
        "role": role,
        "avatar": "",
        "createdAt": datetime.datetime.utcnow().isoformat()
    }

    if mode == "mongo":
        await collection.insert_one(user_doc)
    else:
        collection[user_email] = user_doc

    token = create_token(user_id, user_email, data.name, role)
    response.set_cookie("chargeiq_token", token, httponly=True, max_age=604800, path="/")
    
    return {
        "ok": True,
        "user": {
            "id": user_id,
            "name": data.name,
            "email": user_email,
            "role": role,
            "avatar": ""
        },
        "token": token
    }

@router.post("/login")
async def login(data: LoginSchema, response: Response):
    await ensure_default_admin()
    login_id = (data.email or data.username or "").lower().strip()
    if not login_id or not data.password:
        raise HTTPException(status_code=400, detail="Please enter email/username and password")

    mode, collection = await get_users_collection()
    
    user_doc = None
    if mode == "mongo":
        user_doc = await collection.find_one({"$or": [{"email": login_id}, {"name": login_id}]})
    else:
        user_doc = collection.get(login_id)
        if not user_doc:
            for u in collection.values():
                if u.get("name", "").lower() == login_id:
                    user_doc = u
                    break

    if not user_doc or not safe_verify(data.password, user_doc.get("password", "")):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    role = normalize_role(user_doc.get("role"))
    token = create_token(user_doc["id"], user_doc["email"], user_doc["name"], role)
    response.set_cookie("chargeiq_token", token, httponly=True, max_age=604800, path="/")

    return {
        "ok": True,
        "user": {
            "id": user_doc["id"],
            "name": user_doc["name"],
            "email": user_doc["email"],
            "role": role,
            "avatar": user_doc.get("avatar", "")
        },
        "token": token
    }

@router.post("/google")
async def google_auth(data: GoogleAuthSchema, response: Response):
    await ensure_default_admin()
    user_info = data.userInfo or {}
    email = (user_info.get("email") or "").lower().strip()
    name = user_info.get("name") or "Google User"
    role = normalize_role(data.role)

    if not email:
        raise HTTPException(status_code=400, detail="Google authentication payload invalid")

    mode, collection = await get_users_collection()
    
    if mode == "mongo":
        user_doc = await collection.find_one({"email": email})
    else:
        user_doc = collection.get(email)

    if not user_doc:
        user_id = f"u_{uuid.uuid4().hex[:8]}"
        user_doc = {
            "id": user_id,
            "name": name,
            "email": email,
            "password": "",
            "role": role,
            "avatar": user_info.get("picture", ""),
            "createdAt": datetime.datetime.utcnow().isoformat()
        }
        if mode == "mongo":
            await collection.insert_one(user_doc)
        else:
            collection[email] = user_doc
    else:
        user_id = user_doc["id"]
        role = normalize_role(user_doc.get("role"))

    token = create_token(user_id, email, name, role)
    response.set_cookie("chargeiq_token", token, httponly=True, max_age=604800, path="/")

    return {
        "ok": True,
        "user": {
            "id": user_id,
            "name": name,
            "email": email,
            "role": role,
            "avatar": user_doc.get("avatar", "")
        },
        "token": token
    }

@router.get("/status")
async def auth_status(authorization: Optional[str] = Header(None), cookie: Optional[str] = Header(None)):
    await ensure_default_admin()
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
        return {"authenticated": False}

    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        return {
            "authenticated": True,
            "user": {
                "id": payload.get("userId"),
                "name": payload.get("name"),
                "email": payload.get("email"),
                "role": normalize_role(payload.get("role")),
                "avatar": ""
            }
        }
    except Exception:
        return {"authenticated": False}

@router.post("/logout")
async def logout(response: Response):
    response.delete_cookie("chargeiq_token", path="/")
    return {"ok": True}

<<<<<<< HEAD
class ProfileUpdateSchema(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    vehicleModel: Optional[str] = None
    vehicleNumber: Optional[str] = None
    preferredConnector: Optional[str] = None
    preferences: Optional[dict] = None

@router.get("/profile")
async def get_profile(authorization: Optional[str] = Header(None), cookie: Optional[str] = Header(None)):
    token = None
    if authorization and authorization.startswith("Bearer "):
        token = authorization.replace("Bearer ", "")
=======
@router.get("/profile")
async def profile(authorization: Optional[str] = Header(None), cookie: Optional[str] = Header(None)):
    await ensure_default_admin()
    token = None
    if authorization and authorization.startswith("Bearer "):
      token = authorization.replace("Bearer ", "")
>>>>>>> 7e3627b (feat: implement dynamic route calculation, profile update API, and centralized station fetching utility)
    elif cookie and "chargeiq_token=" in cookie:
        for part in cookie.split(";"):
            part = part.strip()
            if part.startswith("chargeiq_token="):
                token = part.split("chargeiq_token=")[1]
                break
<<<<<<< HEAD

    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")

    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        email = payload.get("email")
        user_id = payload.get("userId")
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

    mode, collection = await get_users_collection()
=======
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
    except Exception:
        raise HTTPException(status_code=401, detail="Not authenticated")

    mode, collection = await get_users_collection()
    user_id = payload.get("userId")
    email = (payload.get("email") or "").lower().strip()
>>>>>>> 7e3627b (feat: implement dynamic route calculation, profile update API, and centralized station fetching utility)
    user_doc = None
    if mode == "mongo":
        user_doc = await collection.find_one({"$or": [{"id": user_id}, {"email": email}]})
    else:
        user_doc = collection.get(email)
<<<<<<< HEAD

    if not user_doc:
        user_doc = {
            "id": user_id,
            "name": payload.get("name", "User"),
            "email": email,
            "role": payload.get("role", "user"),
            "avatar": "",
            "phone": "",
            "address": "",
            "vehicleModel": "",
            "vehicleNumber": "",
            "preferredConnector": "CCS2",
            "preferences": {
                "notifications": True,
                "locationSharing": True,
                "emailUpdates": False,
                "smsAlerts": True,
                "darkMode": True
            }
        }

    # Format user document without mongo _id
    user_data = {
        "id": user_doc.get("id", user_id),
        "name": user_doc.get("name", ""),
        "email": user_doc.get("email", email),
        "role": normalize_role(user_doc.get("role")),
        "avatar": user_doc.get("avatar", ""),
        "phone": user_doc.get("phone", ""),
        "address": user_doc.get("address", ""),
        "vehicleModel": user_doc.get("vehicleModel", ""),
        "vehicleNumber": user_doc.get("vehicleNumber", ""),
        "preferredConnector": user_doc.get("preferredConnector", "CCS2"),
        "preferences": user_doc.get("preferences", {
            "notifications": True,
            "locationSharing": True,
            "emailUpdates": False,
            "smsAlerts": True,
            "darkMode": True
        })
    }

    return {"ok": True, "profile": user_data}

@router.put("/profile")
async def update_profile(data: ProfileUpdateSchema, authorization: Optional[str] = Header(None), cookie: Optional[str] = Header(None)):
=======
        if not user_doc:
            for item in collection.values():
                if item.get("id") == user_id:
                    user_doc = item
                    break
    if not user_doc:
        raise HTTPException(status_code=404, detail="User not found")
    return {"ok": True, "user": _build_profile(user_doc)}

@router.put("/profile")
async def update_profile(
    data: UpdateProfileSchema,
    authorization: Optional[str] = Header(None),
    cookie: Optional[str] = Header(None),
):
    await ensure_default_admin()
>>>>>>> 7e3627b (feat: implement dynamic route calculation, profile update API, and centralized station fetching utility)
    token = None
    if authorization and authorization.startswith("Bearer "):
        token = authorization.replace("Bearer ", "")
    elif cookie and "chargeiq_token=" in cookie:
        for part in cookie.split(";"):
            part = part.strip()
            if part.startswith("chargeiq_token="):
                token = part.split("chargeiq_token=")[1]
                break
<<<<<<< HEAD

    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")

    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        email = payload.get("email")
        user_id = payload.get("userId")
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

    mode, collection = await get_users_collection()

    update_fields = {}
    if data.name is not None: update_fields["name"] = data.name
    if data.phone is not None: update_fields["phone"] = data.phone
    if data.address is not None: update_fields["address"] = data.address
    if data.vehicleModel is not None: update_fields["vehicleModel"] = data.vehicleModel
    if data.vehicleNumber is not None: update_fields["vehicleNumber"] = data.vehicleNumber
    if data.preferredConnector is not None: update_fields["preferredConnector"] = data.preferredConnector
    if data.preferences is not None: update_fields["preferences"] = data.preferences

    if mode == "mongo":
        await collection.update_one(
            {"$or": [{"id": user_id}, {"email": email}]},
            {"$set": update_fields},
            upsert=True
        )
        user_doc = await collection.find_one({"$or": [{"id": user_id}, {"email": email}]})
    else:
        existing = collection.get(email, {})
        existing.update(update_fields)
        collection[email] = existing
        user_doc = existing

    user_data = {
        "id": user_doc.get("id", user_id),
        "name": user_doc.get("name", ""),
        "email": user_doc.get("email", email),
        "role": normalize_role(user_doc.get("role")),
        "avatar": user_doc.get("avatar", ""),
        "phone": user_doc.get("phone", ""),
        "address": user_doc.get("address", ""),
        "vehicleModel": user_doc.get("vehicleModel", ""),
        "vehicleNumber": user_doc.get("vehicleNumber", ""),
        "preferredConnector": user_doc.get("preferredConnector", "CCS2"),
        "preferences": user_doc.get("preferences", {})
    }

    return {"ok": True, "profile": user_data}
=======
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
    except Exception:
        raise HTTPException(status_code=401, detail="Not authenticated")

    mode, collection = await get_users_collection()
    email = (payload.get("email") or "").lower().strip()
    if mode == "mongo":
        user_doc = await collection.find_one({"$or": [{"id": payload.get("userId")}, {"email": email}]})
        if not user_doc:
            raise HTTPException(status_code=404, detail="User not found")
        updates = {k: v for k, v in data.model_dump().items() if v is not None}
        if "preferredConnector" in updates and not updates["preferredConnector"]:
            updates.pop("preferredConnector")
        if any(k in updates for k in ("notifications", "locationSharing", "emailUpdates", "smsAlerts", "darkMode")):
            pref_updates = {k: updates.pop(k) for k in list(updates.keys()) if k in ("notifications", "locationSharing", "emailUpdates", "smsAlerts", "darkMode")}
            existing_prefs = user_doc.get("preferences", {})
            existing_prefs.update(pref_updates)
            updates["preferences"] = existing_prefs
        if updates:
            await collection.update_one({"_id": user_doc["_id"]}, {"$set": updates})
    else:
        user_doc = collection.get(email)
        if not user_doc:
            raise HTTPException(status_code=404, detail="User not found")
        updates = {k: v for k, v in data.model_dump().items() if v is not None}
        pref_updates = {k: updates.pop(k) for k in list(updates.keys()) if k in ("notifications", "locationSharing", "emailUpdates", "smsAlerts", "darkMode")}
        user_doc.update(updates)
        if pref_updates:
            prefs = user_doc.get("preferences", {})
            prefs.update(pref_updates)
            user_doc["preferences"] = prefs
        collection[email] = user_doc
    return {"ok": True, "user": _build_profile(user_doc)}
>>>>>>> 7e3627b (feat: implement dynamic route calculation, profile update API, and centralized station fetching utility)
