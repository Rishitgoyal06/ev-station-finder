"use client";

export default function DashboardMap() {
  return (
    <div className="w-full h-full relative bg-[#111]">
      <iframe 
        src="http://localhost:8000/" 
        className="w-full h-full border-0"
        title="EV Station Finder Map"
        allow="geolocation"
      />
    </div>
  );
}
