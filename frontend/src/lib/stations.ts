type StationQuery = {
  lat: number;
  lng: number;
  radius?: number;
};

type CachedResponse = {
  ts: number;
  data: any;
};

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
  return `${bucketCoord(lat)}:${bucketCoord(lng)}:${radius}`;
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
