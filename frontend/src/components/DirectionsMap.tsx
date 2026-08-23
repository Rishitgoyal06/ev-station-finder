"use client";
import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

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
  onRouteCalculated
}: DirectionsMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: userLocation,
      zoom: 13,
      zoomControl: false, // We'll add custom controls
      scrollWheelZoom: true,
      attributionControl: false,
    });

    mapInstanceRef.current = map;

    // Give the browser one frame to finish painting the container
    setTimeout(() => mapInstanceRef.current?.invalidateSize(), 0);

    // Use dark theme tiles
    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution: "",
      subdomains: "abcd",
      maxZoom: 19,
    }).addTo(map);

    // Create custom icons
    const userIcon = L.divIcon({
      html: `<div style="
        width: 20px; 
        height: 20px; 
        background: #3b82f6; 
        border: 3px solid white; 
        border-radius: 50%; 
        box-shadow: 0 0 15px #3b82f680;
        position: relative;
      ">
        <div style="
          position: absolute;
          top: -8px;
          left: -8px;
          width: 36px;
          height: 36px;
          background: #3b82f640;
          border-radius: 50%;
          animation: pulse 2s infinite;
        "></div>
      </div>`,
      className: "",
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });

    const stationIcon = L.divIcon({
      html: `<div style="
        width: 24px; 
        height: 24px; 
        background: #22c55e; 
        border: 3px solid white; 
        border-radius: 50%; 
        box-shadow: 0 0 15px #22c55e80;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
      ">⚡</div>`,
      className: "",
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });

    // Add markers
    const userMarker = L.marker(userLocation, { icon: userIcon })
      .addTo(map)
      .bindPopup(`
        <div style="
          background: #111; 
          color: #fff; 
          border: 1px solid #3b82f6; 
          border-radius: 8px; 
          padding: 12px; 
          font-size: 14px; 
          min-width: 140px;
          text-align: center;
        ">
          <div style="color: #3b82f6; font-weight: bold; margin-bottom: 4px;">📍 Your Location</div>
          <div style="color: #9ca3af; font-size: 12px;">Starting point</div>
        </div>
      `);

    const stationMarker = L.marker(stationLocation, { icon: stationIcon })
      .addTo(map)
      .bindPopup(`
        <div style="
          background: #111; 
          color: #fff; 
          border: 1px solid #22c55e; 
          border-radius: 8px; 
          padding: 12px; 
          font-size: 14px; 
          min-width: 160px;
          text-align: center;
        ">
          <div style="color: #22c55e; font-weight: bold; margin-bottom: 4px;">⚡ ${stationName}</div>
          <div style="color: #9ca3af; font-size: 12px;">Destination • Available</div>
        </div>
      `);

    fetch(`http://localhost:8000/directions?origin_lat=${userLocation[0]}&origin_lng=${userLocation[1]}&dest_lat=${stationLocation[0]}&dest_lng=${stationLocation[1]}&route_type=fastest`)
      .then(res => res.json())
      .then(data => {
        if (!mapInstanceRef.current) return;
        if (data && data.route_points) {
          const routeLine = L.polyline(data.route_points, {
            color: '#22c55e',
            weight: 4,
            opacity: 0.8,
            dashArray: '10, 10',
          }).addTo(map);

          const animatedRoute = L.polyline(data.route_points, {
            color: '#22c55e',
            weight: 6,
            opacity: 0.3,
          }).addTo(map);

          const group = new L.FeatureGroup([userMarker, stationMarker, routeLine]);
          map.fitBounds(group.getBounds().pad(0.1));

          if (onRouteCalculated) {
            onRouteCalculated({
              distance: data.distance || "Unknown",
              duration: data.duration || "Unknown",
              traffic: "Moderate traffic"
            });
          }
        }
      })
      .catch(e => {
        console.error("Routing failed", e);
        if (!mapInstanceRef.current) return;
        const routeLine = L.polyline([userLocation, stationLocation], {
          color: '#22c55e',
          weight: 4,
          opacity: 0.8,
          dashArray: '10, 10',
        }).addTo(map);

        const animatedRoute = L.polyline([userLocation, stationLocation], {
          color: '#22c55e',
          weight: 6,
          opacity: 0.3,
        }).addTo(map);

        const group = new L.FeatureGroup([userMarker, stationMarker, routeLine]);
        map.fitBounds(group.getBounds().pad(0.1));

        const distance = map.distance(userLocation, stationLocation);
        const distanceKm = (distance / 1000).toFixed(1);
        const estimatedTime = Math.max(5, Math.round(distance / 1000 * 2.5));

        if (onRouteCalculated) {
          onRouteCalculated({
            distance: `${distanceKm} km`,
            duration: `${estimatedTime} min`,
            traffic: distance > 5000 ? "Moderate traffic" : "Light traffic"
          });
        }
      });

    // Add custom zoom controls
    const zoomControl = L.control.zoom({
      position: 'bottomright'
    }).addTo(map);

    // Add CSS for animations and popup styling
    const style = document.createElement("style");
    style.textContent = `
      @keyframes pulse {
        0% { transform: scale(1); opacity: 0.7; }
        50% { transform: scale(1.2); opacity: 0.3; }
        100% { transform: scale(1); opacity: 0.7; }
      }
      
      .leaflet-popup-content-wrapper, 
      .leaflet-popup-tip { 
        background: transparent !important; 
        box-shadow: none !important; 
      }
      
      .leaflet-control-zoom {
        background: #111 !important;
        border: 1px solid #2a2a2a !important;
        border-radius: 8px !important;
      }
      
      .leaflet-control-zoom a {
        background: #111 !important;
        border: none !important;
        color: #fff !important;
        font-size: 18px !important;
        width: 40px !important;
        height: 40px !important;
        line-height: 40px !important;
      }
      
      .leaflet-control-zoom a:hover {
        background: #1f1f1f !important;
        color: #22c55e !important;
      }
      
      .leaflet-control-zoom a:first-child {
        border-radius: 8px 8px 0 0 !important;
      }
      
      .leaflet-control-zoom a:last-child {
        border-radius: 0 0 8px 8px !important;
      }
      
      .leaflet-container {
        background: #0a0a0a !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      mapInstanceRef.current?.remove();
      mapInstanceRef.current = null;
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, [userLocation, stationLocation, stationName, onRouteCalculated]);

  return <div ref={mapRef} className="w-full h-full" />;
}