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
const TTL_MS = 2 * 60 * 1000;

function cacheKey({ lat, lng, radius = 30000 }: StationQuery) {
  return `${lat.toFixed(4)}:${lng.toFixed(4)}:${radius}`;
}

export async function fetchStationsCached(query: StationQuery) {
  const key = cacheKey(query);
  const now = Date.now();

  const cached = MEMORY_CACHE.get(key);
  if (cached && now - cached.ts < TTL_MS) return cached.data;

  if (typeof window !== "undefined") {
    try {
      const raw = sessionStorage.getItem(`stations:${key}`);
      if (raw) {
        const parsed: CachedResponse = JSON.parse(raw);
        if (now - parsed.ts < TTL_MS) {
          MEMORY_CACHE.set(key, parsed);
          return parsed.data;
        }
      }
    } catch {
      // ignore storage parsing errors
    }
  }

  const existing = INFLIGHT.get(key);
  if (existing) return existing;

  const promise = fetch(`/api/ev-stations?lat=${query.lat}&lng=${query.lng}&radius=${query.radius ?? 30000}`, {
    cache: "no-store",
  })
    .then((res) => res.json())
    .then((data) => {
      const payload = { ts: Date.now(), data };
      MEMORY_CACHE.set(key, payload);
      if (typeof window !== "undefined") {
        try {
          sessionStorage.setItem(`stations:${key}`, JSON.stringify(payload));
        } catch {
          // ignore quota/storage failures
        }
      }
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
}
