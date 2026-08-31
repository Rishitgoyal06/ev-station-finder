from fastapi import APIRouter, Query, Request
from fastapi.responses import FileResponse, JSONResponse, StreamingResponse
from app.services.google_places import fetch_photo

router = APIRouter()


@router.get("/")
def read_index(request: Request, embed: str = None):
    """Serve the Leaflet map app when ?embed=1, otherwise return API info."""
    if embed is not None:
        return FileResponse("static/index.html")
    return JSONResponse({
        "service": "Charge IQ EV Backend",
        "docs": "/docs",
        "health": "/health",
        "map": "/?embed=1",
    })


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
