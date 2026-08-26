"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import dynamic from "next/dynamic";
import { BACKEND_BASE_URL } from "@/lib/backend";

// Dynamically import map component to avoid SSR issues
const DirectionsMap = dynamic(() => import("@/components/DirectionsMap"), { ssr: false });

function DirectionsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [routeInfo, setRouteInfo] = useState({
    distance: "4.2 km",
    duration: "12 min",
    traffic: "Light traffic"
  });

  // Get station details from URL params
  const stationName = searchParams?.get("station") || "Charging Station";
  const stationAddress = searchParams?.get("address") || "";
  const stationLat = parseFloat(searchParams?.get("lat") || "12.9716");
  const stationLng = parseFloat(searchParams?.get("lng") || "77.5946");
  const [routeData, setRouteData] = useState({
    distance: "4.2 km",
    duration: "12 min",
    traffic: "Light traffic",
    routeType: "Fastest",
    benefits: "",
  });

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        () => {
          // Default to Bangalore if location access denied
          setUserLocation([12.9716, 77.5946]);
        }
      );
    } else {
      setUserLocation([12.9716, 77.5946]);
    }
  }, []);

  useEffect(() => {
    if (!userLocation || !Number.isFinite(stationLat) || !Number.isFinite(stationLng)) return;

    const loadRoute = async () => {
      try {
        const params = new URLSearchParams({
          origin_lat: String(userLocation[0]),
          origin_lng: String(userLocation[1]),
          dest_lat: String(stationLat),
          dest_lng: String(stationLng),
          route_type: "fastest",
        });
        const res = await fetch(`${BACKEND_BASE_URL}/directions?${params.toString()}`);
        const data = await res.json();
        setRouteData({
          distance: data.distance || "0 km",
          duration: data.duration || "0 min",
          traffic: data.benefits || "Light traffic",
          routeType: data.route_type || "Fastest",
          benefits: data.benefits || "",
        });
      } catch {
        setRouteData({
          distance: "0 km",
          duration: "0 min",
          traffic: "Light traffic",
          routeType: "Fastest",
          benefits: "",
        });
      }
    };

    loadRoute();
  }, [stationLat, stationLng, userLocation]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-[#111] border-b border-[#1a1a1a] px-4 py-3 flex-shrink-0 relative z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => router.back()} 
              className="p-2 hover:bg-[#1f1f1f] rounded-xl transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </button>
            <div>
              <h1 className="text-lg font-bold">Directions</h1>
              <p className="text-sm text-gray-400">
                to {stationName}
                {stationAddress ? ` • ${stationAddress}` : ""}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-[#1f1f1f] rounded-xl transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"/>
              </svg>
            </button>
            <button className="p-2 hover:bg-[#1f1f1f] rounded-xl transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82 1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1 1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-1.82.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1.51 1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Route Info Banner */}
      <div className="bg-[#161616] border-b border-[#1a1a1a] px-4 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <circle cx="12" cy="12" r="9"/>
                <path d="M12 7v5l3 3"/>
              </svg>
              <span className="text-white font-semibold">{routeData.duration}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
              </svg>
              <span className="text-white font-semibold">{routeData.distance}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-gray-400 text-sm">{routeData.traffic}</span>
            </div>
          </div>
          
          <button 
            onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${stationLat},${stationLng}`, "_blank")}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-400 text-black font-semibold rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
            </svg>
            Start Navigation
          </button>
        </div>
      </div>

      {/* Full Screen Map */}
      <div className="flex-1 relative min-h-0">
        {userLocation && (
          <DirectionsMap
            userLocation={userLocation}
            stationLocation={[stationLat, stationLng]}
            stationName={stationName}
          />
        )}
        
        {/* Loading state */}
        {!userLocation && (
          <div className="absolute inset-0 bg-[#0a0a0a] flex items-center justify-center">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-green-500/20 border-t-green-500 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-400">Loading directions...</p>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}

export default function DirectionsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-4">Loading directions...</div>}>
      <DirectionsContent />
    </Suspense>
  );
}
