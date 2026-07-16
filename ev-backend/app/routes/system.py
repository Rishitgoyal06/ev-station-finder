from fastapi import APIRouter, Query
from fastapi.responses import FileResponse, StreamingResponse
from app.services.google_places import fetch_photo

router = APIRouter()


@router.get("/")
def read_index():
    return FileResponse("static/index.html")


@router.get("/health")
def health_check():
    return {"status": "EV backend running"}


@router.get("/photo")
def proxy_photo(ref: str = Query(...)):
    response = fetch_photo(ref)
    content_type = response.headers.get("Content-Type", "image/jpeg")
    return StreamingResponse(response.iter_content(chunk_size=8192), media_type=content_type)
