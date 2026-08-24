"use client";
import { useEffect, useMemo } from "react";

interface DirectionsMapProps {
  userLocation: [number, number];
  stationLocation: [number, number];
  stationName: string;
  onRouteCalculated?: (routeInfo: { distance: string; duration: string; traffic: string }) => void;
}

export default function DirectionsMap({
  userLocation,
  stationLocation,
  stationName,
  onRouteCalculated,
}: DirectionsMapProps) {
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

  const backendMapUrl = useMemo(() => {
    const params = new URLSearchParams({
      lat: String(userLocation[0]),
      lng: String(userLocation[1]),
      dest_lat: String(stationLocation[0]),
      dest_lng: String(stationLocation[1]),
      station: stationName,
      embed: "1",
      v: "2",
    });
    return `http://localhost:8001/static/index.html?${params.toString()}`;
  }, [stationLocation, stationName, userLocation]);

  return (
    <div className="relative w-full h-full min-h-[560px] rounded-2xl overflow-hidden border border-[#1a1a1a] bg-[#070707]">
      <iframe
        title="EV station map"
        src={backendMapUrl}
        className="absolute inset-0 block w-full h-full border-0"
      />

      <div className="absolute top-4 left-4 right-4 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 pointer-events-none">
        <div className="bg-black/75 backdrop-blur-sm border border-[#1f1f1f] rounded-xl px-4 py-3 max-w-[65%]">
          <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Destination</p>
          <p className="text-sm font-semibold text-white truncate">{stationName}</p>
          <p className="text-xs text-gray-400">
            {stationLocation[0].toFixed(4)}, {stationLocation[1].toFixed(4)}
          </p>
        </div>
        <div className="bg-black/75 backdrop-blur-sm border border-[#1f1f1f] rounded-xl px-4 py-3">
          <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Route</p>
          <p className="text-sm font-semibold text-green-400">{distanceKm.toFixed(1)} km</p>
          <p className="text-xs text-gray-400">Loading backend map</p>
        </div>
      </div>
    </div>
  );
}
