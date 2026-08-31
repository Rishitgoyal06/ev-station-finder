import { CLIENT_BACKEND_URL } from "@/lib/backend";

type StationQuery = {
  lat: number;
  lng: number;
  radius?: number;
};

type CachedResponse = {
  ts: number;
  data: any;
};

// ── Normalized station type used across all pages ────────────────────────────
export type NormalizedStation = {
  id: string;
  name: string;
  address: string;
  city: string;
  distance: string;           // e.g. "3.2 km"
  distance_m: number | null;
  latitude: number;
  longitude: number;
  type: "DC Fast Charger" | "AC Charger";
  types: string[];
  connectors: string[];
  available: number;
  total: number;
  price: number;              // ₹/kWh
  chargeTime: string;         // e.g. "35 mins"
  hours: string;              // "Open Now" | "Closed"
  open_now: boolean;
  img: string;
  badge: string;
  verified: boolean;
  peakPower: string;
  place_id: string;
};

// Cache version — bump this when the response shape changes to bust stale sessionStorage
const CACHE_VERSION = "v2";

/**
 * Transforms a raw Google Places result from the backend into a normalized
 * station object used consistently across dashboard, stations list, worker, and owner pages.
 *
 * Now uses real-time availability data from the backend when available,
 * falls back to deterministic calculation for backwards compatibility.
 */
export function normalizeStation(raw: any, index: number): NormalizedStation {
  const seed = raw.name.length + index;
  const isDC = seed % 2 === 0;
  
  // Use real-time availability if provided by backend, otherwise fallback to static calculation
  let total: number;
  let available: number;
  
  if (raw.available_slots !== undefined && raw.total_slots !== undefined) {
    // Use real-time data from backend
    available = raw.available_slots;
    total = raw.total_slots;
  } else {
    // Fallback to static calculation
    total = (seed % 4) + 2;
    available = raw.open_now ? seed % total : 0;
  }

  const type = isDC ? "DC Fast Charger" as const : "AC Charger" as const;
  const connector = isDC ? "CCS2" : "Type 2";
  const price = 12 + (seed % 10);
  const chargeTime = isDC ? "35 mins" : "60 mins";

  // Use the photo_reference from Google Places nearby search to build
  // a proxied image URL through the backend — avoids exposing the API key client-side.
  const photoRef = raw.photo_reference as string | undefined;
  const img = photoRef
    ? `${CLIENT_BACKEND_URL}/photo?ref=${encodeURIComponent(photoRef)}`
    : null; // No photo available for this station

  return {
    id: raw.place_id || String(index),
    name: raw.name,
    address: raw.address || "Unknown Location",
    city: raw.city || "",
    distance: raw.distance_str || "Nearby",
    distance_m: raw.distance_m ?? null,
    latitude: raw.latitude,
    longitude: raw.longitude,
    type,
    types: [type],
    connectors: [connector],
    available,
    total,
    price,
    chargeTime,
    hours: raw.open_now ? "Open Now" : "Closed",
    open_now: !!raw.open_now,
    img: img ?? "",
    badge: index === 0 ? "Best Match" : "",
    verified: seed % 3 !== 0,
    peakPower: isDC ? "150 kW" : "22 kW",
    place_id: raw.place_id || String(index),
  };
}

/**
 * Fetch + cache + normalize in one call.
 * Returns NormalizedStation[] ready to render directly.
 */
export async function fetchAndNormalizeStations(
  query: StationQuery,
  limit?: number
): Promise<NormalizedStation[]> {
  const data = await fetchStationsCached(query);
  const results: any[] = data.results || [];
  const sliced = limit !== undefined ? results.slice(0, limit) : results;
  return sliced.map(normalizeStation);
}

const MEMORY_CACHE = new Map<string, CachedResponse>();
const INFLIGHT = new Map<string, Promise<any>>();

// 10 minutes — station open/closed status doesn't change that fast
const TTL_MS = 10 * 60 * 1000;

// Round to 2 decimal places (~1.1 km grid).
// Nearby users share the same cache bucket instead of generating unique keys.
// Tradeoff: results are for the grid centre, not exact position — fine for a 30km radius search.
function bucketCoord(n: number) {
  return Math.round(n * 100) / 100;
}

function cacheKey({ lat, lng, radius = 30000 }: StationQuery) {
  return `${CACHE_VERSION}:${bucketCoord(lat)}:${bucketCoord(lng)}:${radius}`;
}

function getFromStorage(key: string): CachedResponse | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(`stations:${key}`);
    if (!raw) return null;
    return JSON.parse(raw) as CachedResponse;
  } catch {
    return null;
  }
}

function saveToStorage(key: string, payload: CachedResponse) {
  if (typeof window === "undefined") return;
  try {
    // Purge any old-version cache entries
    Object.keys(sessionStorage)
      .filter((k) => k.startsWith("stations:") && !k.startsWith(`stations:${CACHE_VERSION}:`))
      .forEach((k) => sessionStorage.removeItem(k));
    sessionStorage.setItem(`stations:${key}`, JSON.stringify(payload));
  } catch {
    // ignore quota errors — memory cache still works
  }
}

export async function fetchStationsCached(query: StationQuery): Promise<any> {
  const key = cacheKey(query);
  const now = Date.now();

  // 1. Memory cache (fastest — zero serialization)
  const mem = MEMORY_CACHE.get(key);
  if (mem && now - mem.ts < TTL_MS) return mem.data;

  // 2. sessionStorage (survives component remounts but not tab close)
  const stored = getFromStorage(key);
  if (stored && now - stored.ts < TTL_MS) {
    MEMORY_CACHE.set(key, stored); // warm memory cache
    return stored.data;
  }

  // 3. Deduplicate in-flight requests — multiple components loading simultaneously
  //    (dashboard + owner portal both mount at once) share one fetch
  const existing = INFLIGHT.get(key);
  if (existing) return existing;

  // Use bucketed coords in the actual request so the backend cache also benefits
  const { radius = 30000 } = query;
  const lat = bucketCoord(query.lat);
  const lng = bucketCoord(query.lng);

  const promise = fetch(
    `/api/ev-stations?lat=${lat}&lng=${lng}&radius=${radius}`,
    { cache: "no-store" }
  )
    .then((res) => res.json())
    .then((data) => {
      const payload: CachedResponse = { ts: Date.now(), data };
      MEMORY_CACHE.set(key, payload);
      saveToStorage(key, payload);
      return data;
    })
    .finally(() => {
      INFLIGHT.delete(key);
    });

  INFLIGHT.set(key, promise);
  return promise;
}

export function clearStationsCache() {
  MEMORY_CACHE.clear();
  INFLIGHT.clear();
  if (typeof window !== "undefined") {
    try {
      Object.keys(sessionStorage)
        .filter((k) => k.startsWith("stations:"))
        .forEach((k) => sessionStorage.removeItem(k));
    } catch {
      // ignore
    }
  }
}

/**
 * Refresh station data after booking/cancelling to get updated availability.
 * This clears cache and refetches data for the given location.
 */
export async function refreshStationsAfterBooking(
  query: StationQuery,
  limit?: number
): Promise<NormalizedStation[]> {
  const key = cacheKey(query);
  
  // Clear cache for this location
  MEMORY_CACHE.delete(key);
  INFLIGHT.delete(key);
  if (typeof window !== "undefined") {
    try {
      sessionStorage.removeItem(`stations:${key}`);
    } catch {
      // ignore
    }
  }
  
  // Fetch fresh data
  return fetchAndNormalizeStations(query, limit);
}
