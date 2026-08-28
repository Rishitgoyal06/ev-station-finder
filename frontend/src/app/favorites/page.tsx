"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";

type FavoriteStation = {
  id: string | number;
  name: string;
  nameHighlight?: string;
  address: string;
  distance?: string;
  available?: number;
  total?: number;
  price?: number;
  rating?: number;
  reviews?: number;
  amenities?: string[];
  image?: string;
  lastVisited?: string;
  totalVisits?: number;
  city?: string;
  latitude?: number;
  longitude?: number;
  connectors?: string[];
  chargeTime?: string;
  type?: string;
};

export default function FavoritesPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [favorites, setFavorites] = useState<FavoriteStation[]>([]);
  const [loadState, setLoadState] = useState<"loading" | "ready" | "empty">("loading");
  const [hasLocalDraft, setHasLocalDraft] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/");
      return;
    }

    try {
      const raw = localStorage.getItem("chargeiq_favorites");
      if (raw) {
        const parsed = JSON.parse(raw) as FavoriteStation[];
        setFavorites(Array.isArray(parsed) ? parsed : []);
        setLoadState((Array.isArray(parsed) && parsed.length > 0) ? "ready" : "empty");
      } else {
        setFavorites([]);
        setLoadState("empty");
      }
      setHasLocalDraft(localStorage.getItem("chargeiq_favorites_draft") === "1");
    } catch {
      setFavorites([]);
      setLoadState("empty");
    }
  }, [isAuthenticated, router]);

  const favoriteStations = useMemo(() => favorites, [favorites]);

  const handleRemoveFavorite = (stationId: number | string) => {
    const next = favorites.filter((station) => String(station.id) !== String(stationId));
    setFavorites(next);
    setLoadState(next.length > 0 ? "ready" : "empty");
    localStorage.setItem("chargeiq_favorites", JSON.stringify(next));
    if (next.length === 0) {
      localStorage.removeItem("chargeiq_favorites_draft");
      setHasLocalDraft(false);
    }
  };

  const StationCard = ({ station, isListView = false }: { station: typeof favoriteStations[0], isListView?: boolean }) => (
    <div className={`bg-[#111] border border-[#1a1a1a] rounded-xl hover:border-green-500/30 transition-all cursor-pointer ${
      isListView ? "p-4" : "p-5"
    }`}>
      <div className={`${isListView ? "flex items-center gap-4" : "space-y-4"}`}>
        {/* Station Image */}
        <div className={`${isListView ? "w-20 h-20" : "w-full h-48"} rounded-lg overflow-hidden bg-[#1f1f1f] flex-shrink-0`}>
          <img src={station.image} alt={station.name} className="w-full h-full object-cover" />
        </div>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <h3 className={`font-bold text-white ${isListView ? "text-lg" : "text-xl"} mb-1`}>
                {station.name} <span className="text-green-400">{station.nameHighlight}</span>
              </h3>
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                <span className="truncate">{station.address}</span>
              </div>
            </div>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveFavorite(station.id);
              }}
              className="p-2 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-lg transition-colors ml-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </button>
          </div>

          {/* Stats Grid */}
          <div className={`grid ${isListView ? "grid-cols-4" : "grid-cols-2 md:grid-cols-4"} gap-3 mb-3`}>
            <div className="text-center">
              <p className={`${isListView ? "text-lg" : "text-xl"} font-bold text-green-400`}>{station.available}</p>
              <p className="text-xs text-gray-400">Available</p>
            </div>
            <div className="text-center">
              <p className={`${isListView ? "text-lg" : "text-xl"} font-bold text-white`}>₹{station.price}</p>
              <p className="text-xs text-gray-400">Per kWh</p>
            </div>
            <div className="text-center">
              <p className={`${isListView ? "text-lg" : "text-xl"} font-bold text-yellow-400`}>{station.rating}</p>
              <p className="text-xs text-gray-400">{station.reviews}+ reviews</p>
            </div>
            <div className="text-center">
              <p className={`${isListView ? "text-lg" : "text-xl"} font-bold text-blue-400`}>{station.distance}</p>
              <p className="text-xs text-gray-400">Distance</p>
            </div>
          </div>

          {/* Amenities */}
          <div className="flex items-center gap-2 mb-3 overflow-x-auto">
            {station.amenities?.map((amenity, index) => (
              <span key={index} className="px-2 py-1 bg-[#1f1f1f] text-gray-300 text-xs rounded-full whitespace-nowrap">
                {amenity}
              </span>
            ))}
          </div>

          {/* Visit Info & Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-[#1a1a1a]">
            <div className="text-xs text-gray-400">
              <p>Last visited: {station.lastVisited}</p>
              <p>{station.totalVisits} total visits</p>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  const qs = new URLSearchParams({
                    station: station.name,
                    address: station.address || "",
                    ...(station.latitude ? { lat: String(station.latitude) } : {}),
                    ...(station.longitude ? { lng: String(station.longitude) } : {}),
                  });
                  router.push(`/directions?${qs.toString()}`);
                }}
                className="px-3 py-1.5 bg-[#1f1f1f] hover:bg-[#2a2a2a] text-gray-300 text-xs rounded-lg transition-colors"
              >
                Directions
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  const params = new URLSearchParams({
                    name: station.name,
                    address: station.address || "",
                    city: station.city || "",
                    price: String(station.price || 15),
                    chargeTime: station.chargeTime || "45 mins",
                    connectors: (station.connectors || ["Type 2"]).join(","),
                    img: station.image || "",
                    available: String(station.available ?? 1),
                    total: String(station.total ?? 4),
                    peakPower: station.type?.includes("DC") ? "150 kW" : "22 kW",
                    powerType: station.type || "AC Charging",
                  });
                  router.push(`/stations/${encodeURIComponent(station.id)}?${params.toString()}`);
                }}
                className="px-3 py-1.5 bg-green-500 hover:bg-green-400 text-black text-xs font-medium rounded-lg transition-colors"
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-20">
      {/* Header */}
      <div className="bg-[#111] border-b border-[#1a1a1a] px-6 py-4 fixed top-0 left-0 right-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.back()}
              className="p-2 hover:bg-[#1f1f1f] rounded-xl transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </button>
          <div>
            <h1 className="text-xl font-bold">Favorite Stations</h1>
            <p className="text-sm text-gray-400">
              {favoriteStations.length} saved stations
              {hasLocalDraft ? " • local draft" : ""}
            </p>
          </div>
        </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 p-1 bg-[#1f1f1f] rounded-lg">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "grid" ? "bg-green-500 text-black" : "text-gray-400 hover:text-white"
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                  <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
                </svg>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "list" ? "bg-green-500 text-black" : "text-gray-400 hover:text-white"
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/>
                  <line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/>
                  <line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{favoriteStations.length}</p>
                <p className="text-sm text-gray-400">Favorite Stations</p>
              </div>
            </div>
          </div>

          <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {favoriteStations.reduce((sum, s) => sum + (s.available ?? 0), 0)}
                </p>
                <p className="text-sm text-gray-400">Available Slots</p>
              </div>
            </div>
          </div>

          <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {favoriteStations.reduce((sum, s) => sum + (s.totalVisits ?? 0), 0)}
                </p>
                <p className="text-sm text-gray-400">Total Visits</p>
              </div>
            </div>
          </div>

          <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {(favoriteStations.reduce((sum, s) => sum + (s.rating ?? 0), 0) / (favoriteStations.length || 1)).toFixed(1)}
                </p>
                <p className="text-sm text-gray-400">Avg Rating</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stations List */}
        {loadState === "loading" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-[#111] border border-[#1a1a1a] rounded-xl p-5 animate-pulse">
                <div className="h-48 rounded-lg bg-[#1f1f1f] mb-4" />
                <div className="h-4 bg-[#1f1f1f] rounded w-2/3 mb-3" />
                <div className="h-3 bg-[#1f1f1f] rounded w-1/2 mb-6" />
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4].map((j) => <div key={j} className="h-12 bg-[#1f1f1f] rounded" />)}
                </div>
              </div>
            ))}
          </div>
        ) : favoriteStations.length > 0 ? (
          <div className={
            viewMode === "grid" 
              ? "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6" 
              : "space-y-4"
          }>
            {favoriteStations.map((station) => (
              <div key={station.id} onClick={() => router.push(`/stations/${station.id}`)}>
                <StationCard station={station} isListView={viewMode === "list"} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-[#111] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No saved favorites yet</h3>
            <p className="text-gray-400 mb-2">
              Add stations from the live station pages to keep them here for quick access.
            </p>
            <p className="text-xs text-gray-500 mb-6">
              This screen now shows real saved data from local storage rather than placeholder favorites.
            </p>
            <button 
              onClick={() => router.push('/stations')}
              className="bg-green-500 hover:bg-green-400 text-black px-6 py-3 rounded-xl font-semibold transition-colors"
            >
              Browse Stations
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
