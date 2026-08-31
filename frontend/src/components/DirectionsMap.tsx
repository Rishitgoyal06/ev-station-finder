"use client";
import { useMemo, useEffect } from "react";
import { CLIENT_BACKEND_URL } from "@/lib/backend";

interface DirectionsMapProps {
  userLocation: [number, number];
  stationLocation: [number, number];
  stationName: string;
  onRouteCalculated?: (routeInfo: { distance: string; duration: string; traffic: string }) => void;
}

// Map rendering and routing is handled by the ev-backend Leaflet app
export default function DirectionsMap({
  userLocation,
  stationLocation,
  stationName,
  onRouteCalculated,
}: DirectionsMapProps) {
  // Straight-line distance for the info panel
  const distanceKm = useMemo(() => {
    const toRad = (v: number) => (v * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(stationLocation[0] - userLocation[0]);
    const dLng = toRad(stationLocation[1] - userLocation[1]);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(userLocation[0])) *
        Math.cos(toRad(stationLocation[0])) *
        Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(a));
  }, [stationLocation, userLocation]);

  useEffect(() => {
    const durationMin = Math.max(5, Math.round(distanceKm * 2.5));
    onRouteCalculated?.({
      distance: `${distanceKm.toFixed(1)} km`,
      duration: `${durationMin} min`,
      traffic: distanceKm > 20 ? "Moderate traffic" : "Light traffic",
    });
  }, [distanceKm, onRouteCalculated]);

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
        <div className="bg-black/75 backdrop-blur-sm border border-[#1f1f1f] rounded-xl px-4 py-3">
          <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Distance</p>
          <p className="text-sm font-semibold text-green-400">{distanceKm.toFixed(1)} km</p>
          <p className="text-xs text-gray-400">straight-line</p>
        </div>
      </div>
    </div>
  );
}
