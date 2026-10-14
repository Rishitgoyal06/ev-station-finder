"use client";
import { useMemo } from "react";
import { CLIENT_BACKEND_URL } from "@/lib/backend";

interface DirectionsMapProps {
  userLocation: [number, number];
  stationLocation: [number, number];
  stationName: string;
}

// Map rendering and routing is handled by the ev-backend Leaflet app
export default function DirectionsMap({
  userLocation,
  stationLocation,
  stationName,
}: DirectionsMapProps) {
  // Build the iframe URL with all params the backend Leaflet app expects
  const mapUrl = useMemo(() => {
    const params = new URLSearchParams({
      lat: String(userLocation[0]),
      lng: String(userLocation[1]),
      dest_lat: String(stationLocation[0]),
      dest_lng: String(stationLocation[1]),
      station: stationName,
      embed: "1",
    });
    return `${CLIENT_BACKEND_URL}/?${params.toString()}`;
  }, [userLocation, stationLocation, stationName]);

  return (
    <div className="relative w-full h-full min-h-[360px] rounded-2xl overflow-hidden border border-[#1a1a1a] bg-[#070707]">
      <iframe
        title="EV station directions map"
        src={mapUrl}
        className="absolute inset-0 w-full h-full border-0"
        allow="geolocation"
      />

      {/* Info overlay */}
      <div className="absolute top-4 left-4 right-4 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 pointer-events-none z-[1000]">
        <div className="bg-black/75 backdrop-blur-sm border border-[#1f1f1f] rounded-xl px-4 py-3 max-w-[65%]">
          <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Destination</p>
          <p className="text-sm font-semibold text-white truncate">{stationName}</p>
          <p className="text-xs text-gray-400">
            {stationLocation[0].toFixed(4)}, {stationLocation[1].toFixed(4)}
          </p>
        </div>
      </div>
    </div>
  );
}
