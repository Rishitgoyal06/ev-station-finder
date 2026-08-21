"use client";
import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const stations = [
  { lat: 22.3119, lng: 73.1723, name: "GreenCharge Hub", status: "available" },
  { lat: 22.3219, lng: 73.1823, name: "VoltSpark Center", status: "limited" },
  { lat: 22.2919, lng: 73.1623, name: "ChargeIQ Station", status: "occupied" },
];

export default function DashboardMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const defaultCenter: [number, number] = [22.3072, 73.1812]; // Vadodara

    const map = L.map(mapRef.current, {
      center: defaultCenter,
      zoom: 12,
      zoomControl: true,
      scrollWheelZoom: true,
    });

    mapInstanceRef.current = map;

    // Give the browser one frame to finish painting the container
    // before Leaflet tries to measure it
    setTimeout(() => mapInstanceRef.current?.invalidateSize(), 0);

    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution: "",
      subdomains: "abcd",
      maxZoom: 19,
    }).addTo(map);

    const makeIcon = (color: string) =>
      L.divIcon({
        html: `<div style="width:14px;height:14px;background:${color};border:2px solid white;border-radius:50%;box-shadow:0 0 8px ${color}80"></div>`,
        className: "",
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      });

    stations.forEach((s) => {
      const color =
        s.status === "available" ? "#22c55e" : s.status === "limited" ? "#f59e0b" : "#ef4444";
      L.marker([s.lat, s.lng], { icon: makeIcon(color) })
        .addTo(map)
        .bindPopup(
          `<div style="background:#111;color:#fff;border:1px solid ${color};border-radius:8px;padding:8px;font-size:12px;min-width:120px">
            <b style="color:${color}">${s.name}</b><br/>
            <span style="color:#9ca3af;text-transform:capitalize">${s.status}</span>
          </div>`,
          { className: "dark-popup" }
        );
    });

    // Try to show user's real location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          // Guard: map may have been unmounted before geolocation responded
          if (!mapInstanceRef.current) return;

          const { latitude, longitude } = pos.coords;

          // Force Leaflet to recalculate container size before any pan/zoom
          mapInstanceRef.current.invalidateSize();

          // Use animate:false to avoid the animated zoom path that errors
          // when the container size isn't fully settled yet
          mapInstanceRef.current.setView([latitude, longitude], 13, { animate: false });

          const userIcon = L.divIcon({
            html: `<div style="width:16px;height:16px;background:#3b82f6;border:3px solid white;border-radius:50%;box-shadow:0 0 12px #3b82f680"></div>`,
            className: "",
            iconSize: [16, 16],
            iconAnchor: [8, 8],
          });

          L.marker([latitude, longitude], { icon: userIcon })
            .addTo(mapInstanceRef.current)
            .bindPopup('<div style="background:#111;color:#fff;border:1px solid #3b82f6;border-radius:8px;padding:8px;font-size:12px">📍 You are here</div>');
        },
        () => {
          // Geolocation denied or failed — stay on default center, just invalidate size
          mapInstanceRef.current?.invalidateSize();
        }
      );
    }

    const style = document.createElement("style");
    style.textContent = `
      .leaflet-popup-content-wrapper, .leaflet-popup-tip { background: transparent !important; box-shadow: none !important; }
      .dark-popup .leaflet-popup-content-wrapper { background: transparent !important; }
    `;
    document.head.appendChild(style);

    return () => {
      mapInstanceRef.current?.remove();
      mapInstanceRef.current = null;
      document.head.contains(style) && document.head.removeChild(style);
    };
  }, []);

  return <div ref={mapRef} className="w-full h-full" />;
}
