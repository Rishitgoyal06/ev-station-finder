"use client";
import { BACKEND_BASE_URL } from "@/lib/backend";

export default function DashboardMap() {
  return (
    <div className="w-full h-full relative bg-[#111]">
      <iframe
        src={`${BACKEND_BASE_URL}/?embed=1`}
        className="w-full h-full border-0"
        title="EV Station Finder Map"
        allow="geolocation"
      />
    </div>
  );
}
