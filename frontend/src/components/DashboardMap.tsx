"use client";
import { CLIENT_BACKEND_URL } from "@/lib/backend";

interface DashboardMapProps {
  lat?: number;
  lng?: number;
}

export default function DashboardMap({ lat, lng }: DashboardMapProps) {
  // Build URL — include user coordinates so the Leaflet app centres on their real location
  const src = lat && lng
    ? `${CLIENT_BACKEND_URL}/?embed=1&lat=${lat}&lng=${lng}&v=${Date.now()}`
    : `${CLIENT_BACKEND_URL}/?embed=1&v=${Date.now()}`;

  return (
    <div className="w-full h-full relative bg-[#111]">
      <iframe
        src={src}
        className="w-full h-full border-0"
        title="EV Station Finder Map"
        allow="geolocation"
      />
    </div>
  );
}
