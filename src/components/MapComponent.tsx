"use client";
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { TypewriterEffectSmooth } from "./ui/typewriter-effect";

const evStations = [
  { id: 1, lat: 19.0760, lng: 72.8777, name: "Mumbai Central", status: "available" },
  { id: 2, lat: 28.6139, lng: 77.2090, name: "Delhi CP", status: "occupied" },
  { id: 3, lat: 12.9716, lng: 77.5946, name: "Bangalore Tech Park", status: "available" },
  { id: 4, lat: 22.5726, lng: 88.3639, name: "Kolkata Metro", status: "maintenance" },
  { id: 5, lat: 26.9124, lng: 75.7873, name: "Jaipur Mall", status: "available" },
  { id: 6, lat: 23.0225, lng: 72.5714, name: "Ahmedabad Station", status: "occupied" },
  { id: 7, lat: 17.3850, lng: 78.4867, name: "Hyderabad Hub", status: "available" },
  { id: 8, lat: 13.0827, lng: 80.2707, name: "Chennai Marina", status: "available" },
  { id: 9, lat: 18.5204, lng: 73.8567, name: "Pune IT Park", status: "occupied" },
  { id: 10, lat: 30.7333, lng: 76.7794, name: "Chandigarh Sector 17", status: "available" },
];

const words = [
  {
    text: "Your",
    className: "text-white dark:text-white",
  },
  {
    text: "EV",
    className: "text-green-400 dark:text-green-400",
  },
  {
    text: "Journey",
    className: "text-white dark:text-white",
  },
  {
    text: "Starts",
    className: "text-white dark:text-white",
  },
  {
    text: "Here",
    className: "text-white dark:text-white",
  },
];

export default function MapComponent() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: [20.5937, 78.9629],
      zoom: 5,
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      touchZoom: false,
      boxZoom: false,
      keyboard: false,
      dragging: false,
    });

    mapInstanceRef.current = map;

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map);

    const createCustomIcon = (status: string) => {
      const color = status === 'available' ? '#22C55E' : status === 'occupied' ? '#EF4444' : '#F59E0B';
      
      return L.divIcon({
        html: `
          <div class="ev-pin" style="
            position: relative;
            width: 30px;
            height: 42px;
            cursor: pointer;
          ">
            <div style="
              width: 30px;
              height: 30px;
              background: linear-gradient(135deg, ${color}, ${color}dd);
              border: 3px solid white;
              border-radius: 50%;
              box-shadow: 0 0 15px ${color}60, 0 3px 10px rgba(0,0,0,0.3);
              animation: pulse 2s infinite;
              display: flex;
              align-items: center;
              justify-content: center;
              position: relative;
            ">
              <div style="
                color: white;
                font-size: 10px;
                font-weight: bold;
                font-family: system-ui, -apple-system, sans-serif;
                text-shadow: 0 1px 2px rgba(0,0,0,0.5);
                letter-spacing: -0.5px;
              ">IQ</div>
            </div>
            <div style="
              position: absolute;
              bottom: 0;
              left: 50%;
              transform: translateX(-50%);
              width: 0;
              height: 0;
              border-left: 8px solid transparent;
              border-right: 8px solid transparent;
              border-top: 12px solid ${color};
              filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
            "></div>
            <div style="
              position: absolute;
              top: 2px;
              right: 2px;
              width: 6px;
              height: 6px;
              background: ${color};
              border: 1px solid white;
              border-radius: 50%;
              box-shadow: 0 0 6px ${color};
            "></div>
          </div>
        `,
        className: 'custom-ev-icon',
        iconSize: [30, 42],
        iconAnchor: [15, 42],
      });
    };

    evStations.forEach(station => {
      const marker = L.marker([station.lat, station.lng], {
        icon: createCustomIcon(station.status)
      }).addTo(map);

      marker.bindPopup(`
        <div style="
          background: #020617;
          color: #E5E7EB;
          border: 1px solid #22C55E;
          border-radius: 8px;
          padding: 12px;
          font-family: system-ui;
        ">
          <h3 style="margin: 0 0 8px 0; color: #22C55E; font-size: 14px; font-weight: 600;">
            ${station.name}
          </h3>
          <p style="margin: 0; font-size: 12px; color: #9CA3AF;">
            Status: <span style="color: ${station.status === 'available' ? '#22C55E' : station.status === 'occupied' ? '#EF4444' : '#F59E0B'}">
              ${station.status.charAt(0).toUpperCase() + station.status.slice(1)}
            </span>
          </p>
        </div>
      `);
    });

    const style = document.createElement('style');
    style.textContent = `
      @keyframes pulse {
        0% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.2); opacity: 0.7; }
        100% { transform: scale(1); opacity: 1; }
      }
      .leaflet-popup-content-wrapper {
        background: #020617 !important;
        border: 1px solid #22C55E !important;
      }
      .leaflet-popup-tip {
        background: #020617 !important;
        border: 1px solid #22C55E !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-[400px] bg-black overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20 z-10 pointer-events-none" />
      
      <div 
        ref={mapRef} 
        className="w-full h-full filter blur-[0.8px] brightness-110 contrast-125"
        style={{ background: '#000000' }}
      />
      
      <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
        <div className="text-center text-white">
          <TypewriterEffectSmooth words={words} className="text-3xl md:text-4xl font-bold" style={{textShadow: '0 0 20px rgba(0,0,0,0.8), 0 0 40px rgba(0,0,0,0.6), 2px 2px 4px rgba(0,0,0,1)'}} />
        </div>
      </div>
    </div>
  );
}