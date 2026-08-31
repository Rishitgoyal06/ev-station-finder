"use client";
import { CLIENT_BACKEND_URL } from "@/lib/backend";

export default function DashboardMap() {
  return (
    <div className="w-full h-full relative bg-[#111]">
      <iframe
        src={`${CLIENT_BACKEND_URL}/?embed=1&v=${Date.now()}`}
        className="w-full h-full border-0"
        title="EV Station Finder Map"
        allow="geolocation"
      />
    </div>
  );
}
