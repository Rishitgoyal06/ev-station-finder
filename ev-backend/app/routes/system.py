from fastapi import APIRouter, Query
from fastapi.responses import JSONResponse, StreamingResponse
from app.services.google_places import fetch_photo

router = APIRouter()


@router.get("/")
def read_index():
    return JSONResponse({"service": "Charge IQ EV Backend", "docs": "/docs", "health": "/health"})


@router.get("/health")
def health_check():
    return {"status": "ok", "service": "Charge IQ EV Backend"}


@router.get("/photo")
def proxy_photo(ref: str = Query(...)):
    response = fetch_photo(ref)
    content_type = response.headers.get("Content-Type", "image/jpeg")
    return StreamingResponse(response.iter_content(chunk_size=8192), media_type=content_type)


@router.get("/photos")
def get_place_photos(place_id: str = Query(...)):
    from app.services.google_places import fetch_place_details, build_photo_refs
    details_data = fetch_place_details(place_id)
    if details_data.get("status") == "OK":
        result = details_data.get("result", {})
        refs = build_photo_refs(result)
        photo_urls = [f"/photo?ref={ref}" for ref in refs]
        return {"count": len(photo_urls), "photo_urls": photo_urls}
    return {"count": 0, "photo_urls": []}
