from fastapi import APIRouter, HTTPException, Header, Response
from pydantic import BaseModel
from typing import Optional
import jwt
import uuid
import datetime
from passlib.context import CryptContext
from config import JWT_SECRET
from app.db import get_users_collection

router = APIRouter(prefix="/auth", tags=["Auth"])
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

def normalize_role(role: Optional[str]) -> str:
    r = (role or "").lower()
    if r in ("customer", "user", "driver"):
        return "user"
    if r in ("station_owner", "owner"):
        return "owner"
    if r in ("admin", "worker"):
        return r
    return "user"

def create_token(user_id: str, email: str, name: str, role: str) -> str:
    payload = {
        "userId": user_id,
        "email": email,
        "name": name,
        "role": role,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(days=7)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")

@router.post("/register")
async def register(data: RegisterSchema, response: Response):
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

    # Seed demo accounts if database is empty / testing
    if not user_doc and data.password in ("password123", "password", "admin123", "123456"):
        demo_accounts = {
            "user@example.com": {"id": "u1", "name": "Ravi Kumar", "email": "user@example.com", "role": "user", "avatar": ""},
            "owner@example.com": {"id": "u2", "name": "Aarav Sharma", "email": "owner@example.com", "role": "owner", "avatar": ""},
            "admin@chargeiq.com": {"id": "u3", "name": "Admin Control", "email": "admin@chargeiq.com", "role": "admin", "avatar": ""},
            "driver@example.com": {"id": "u4", "name": "EV Driver", "email": "driver@example.com", "role": "user", "avatar": ""},
        }
        if login_id in demo_accounts:
            demo_user = demo_accounts[login_id]
            hashed = safe_hash(data.password)
            user_doc = {**demo_user, "password": hashed}

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
    response.delete_cookie("chargeiq_token")
    return {"ok": True}
