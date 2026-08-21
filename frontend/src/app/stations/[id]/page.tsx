"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/components/AuthContext";

const STATIONS: Record<string, {
  id: number; name: string; nameHighlight: string; address: string; city: string;
  available: number; total: number; price: number; chargeTime: string; energy: string;
  peakPower: string; powerType: string; rating: number; reviews: number;
  amenities: string[]; connectors: { id: string; name: string; type: string; power: string; max: string }[];
  img: string;
}> = {
  "1": {
    id: 1, name: "GreenCharge", nameHighlight: "Hub",
    address: "Silicon Valley Tech Park, Block 4, Zone B", city: "Bengaluru, KA",
    available: 3, total: 5, price: 18, chargeTime: "35 mins", energy: "42.5 kWh",
    peakPower: "150 kW", powerType: "DC Fast Charging", rating: 4.9, reviews: 120,
    amenities: ["Wi-Fi", "Café", "Parking"],
    connectors: [
      { id: "ccs2", name: "CCS2", type: "DC Fast Charge", power: "DC Fast Charge", max: "Up to 150 kW" },
      { id: "type2", name: "TYPE 2", type: "AC 22kW", power: "AC 22kW", max: "Up to 22 kW" },
    ],
    img: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=900&q=85",
  },
  "2": {
    id: 2, name: "VoltSpark", nameHighlight: "Center",
    address: "Gotri Road, Near Bright School", city: "Vadodara, GJ",
    available: 1, total: 4, price: 12, chargeTime: "50 mins", energy: "28.0 kWh",
    peakPower: "22 kW", powerType: "AC Charging", rating: 4.5, reviews: 68,
    amenities: ["Wi-Fi", "Parking"],
    connectors: [
      { id: "type2", name: "TYPE 2", type: "AC 22kW", power: "AC 22kW", max: "Up to 22 kW" },
    ],
    img: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=900&q=85",
  },
  "3": {
    id: 3, name: "ChargeIQ", nameHighlight: "Station",
    address: "Waghodia Road, Near Amul Dairy", city: "Vadodara, GJ",
    available: 2, total: 6, price: 20, chargeTime: "40 mins", energy: "38.0 kWh",
    peakPower: "120 kW", powerType: "DC Fast Charging", rating: 4.7, reviews: 95,
    amenities: ["Wi-Fi", "Parking", "CCTV"],
    connectors: [
      { id: "ccs2",  name: "CCS2",   type: "DC Fast Charge", power: "DC Fast Charge", max: "Up to 120 kW" },
      { id: "type2", name: "TYPE 2", type: "AC 22kW",        power: "AC 22kW",        max: "Up to 22 kW"  },
    ],
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=85",
  },
};

export default function StationDetailPage() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = String(params?.id ?? "1");
  const station = STATIONS[id] ?? STATIONS["1"];

  const [connector, setConnector] = useState(station.connectors[0].id);
  const [date, setDate]           = useState("Today");
  const [time, setTime]           = useState("5:30 PM");
  const [imgIdx, setImgIdx]       = useState(0);
  const totalCost = Math.round(parseFloat(station.energy) * station.price);

  // Generate available time slots based on current time and selected date
  const generateTimeSlots = () => {
    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();
    
    const timeSlots = [];
    const startHour = 5; // 5 AM
    const endHour = 22; // 10 PM
    
    for (let hour = startHour; hour <= endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const slotTime = new Date();
        slotTime.setHours(hour, minute, 0, 0);
        
        // If today is selected, only show future time slots
        if (date === "Today") {
          if (hour < currentHour || (hour === currentHour && minute <= currentMinute)) {
            continue; // Skip past times
          }
        }
        
        const timeString = slotTime.toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit', 
          hour12: true 
        });
        
        timeSlots.push(timeString);
      }
    }
    
    return timeSlots;
  };

  const availableTimeSlots = generateTimeSlots();

  useEffect(() => { 
    if (!isAuthenticated) router.replace("/"); 
    // Reset time when date changes to ensure valid time is selected
    if (availableTimeSlots.length > 0 && !availableTimeSlots.includes(time)) {
      setTime(availableTimeSlots[0]);
    }
  }, [isAuthenticated, router, date, time, availableTimeSlots]);
  if (!isAuthenticated) return null;

  const displayName = user || "Driver";
  const navLinks = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Stations", path: "/stations" },
    { label: "My Bookings", path: "/bookings" },
    { label: "Profile", path: "/profile" }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* ── Top nav ── */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-[#1a1a1a] bg-[#0d0d0d] sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()}
            className="w-8 h-8 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center text-[#aaa] hover:text-white transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          </button>
          <span className="text-lg font-black"><span className="text-green-400">Charge</span><span className="text-white">IQ</span></span>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map(({ label, path }) => (
            <button key={label} onClick={() => router.push(path)}
              className={`text-[13px] font-medium pb-0.5 transition-colors ${label === "Stations" ? "text-white border-b-2 border-green-400" : "text-[#666] hover:text-white"}`}>
              {label}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <button className="relative text-[#555] hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full text-[8px] font-bold text-black flex items-center justify-center">3</span>
          </button>
          <button className="text-[#555] hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
          </button>
          <div className="w-7 h-7 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center text-[11px] font-bold text-green-400">
            {displayName[0].toUpperCase()}
          </div>
        </div>
      </header>

      {/* ── Body ── */}
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">

        {/* ── LEFT COLUMN ── */}
        <div className="space-y-4">
          {/* Active badge + title */}
          <div>
            <div className="inline-flex items-center gap-1.5 bg-green-500/10 border border-green-500/30 text-green-400 text-[11px] font-semibold px-3 py-1 rounded-full mb-3">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              ACTIVE STATION
            </div>
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-3xl sm:text-4xl font-black leading-tight">
                {station.name} <span className="text-green-400">{station.nameHighlight}</span>
              </h1>
              <button 
                onClick={() => router.push(`/directions?station=${encodeURIComponent(station.name)}&lat=12.9716&lng=77.5946`)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#2a2a2a] bg-[#111] text-[#aaa] hover:text-white hover:border-[#444] text-[13px] font-medium transition-all flex-shrink-0"
              >
                <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/></svg>
                Directions
              </button>
            </div>
            <div className="flex items-center gap-1.5 text-[#666] text-[13px] mt-2">
              <svg className="w-3.5 h-3.5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path d="M12 2C8.686 2 6 4.686 6 8c0 4.5 6 12 6 12s6-7.5 6-12c0-3.314-2.686-6-6-6z"/><circle cx="12" cy="8" r="2"/></svg>
              {station.address} • {station.city}
            </div>
          </div>

          {/* Hero image */}
          <div className="relative rounded-2xl overflow-hidden aspect-[16/9] bg-[#111]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={station.img} alt={station.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm border border-green-500/40 text-green-400 text-[11px] font-semibold px-3 py-1.5 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              AVAILABLE NOW
            </div>
            {/* Dot indicators */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {[0,1,2,3].map(i => (
                <button key={i} onClick={() => setImgIdx(i)}
                  className={`rounded-full transition-all ${i === imgIdx ? "w-5 h-2 bg-green-400" : "w-2 h-2 bg-white/30 hover:bg-white/60"}`} />
              ))}
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-4">
              <p className="text-[10px] text-[#555] font-semibold tracking-widest uppercase mb-2">Peak Power</p>
              <div className="flex items-center gap-1.5 mb-1">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 24 24"><path d="M13 2L4.5 13.5H11L10 22L19.5 10.5H13Z"/></svg>
                <span className="text-2xl font-black text-white">{station.peakPower}</span>
              </div>
              <p className="text-[11px] text-[#555]">{station.powerType}</p>
            </div>
            <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-4">
              <p className="text-[10px] text-[#555] font-semibold tracking-widest uppercase mb-2">Amenities</p>
              <div className="flex items-center gap-2 mb-1">
                {station.amenities.includes("Wi-Fi") && <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path d="M5 12.55a11 11 0 0114.08 0"/><path d="M1.42 9a16 16 0 0121.16 0"/><path d="M8.53 16.11a6 6 0 016.95 0"/><circle cx="12" cy="20" r="1" fill="currentColor"/></svg>}
                {station.amenities.includes("Café") && <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>}
                {station.amenities.includes("Parking") && <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 17V7h4a3 3 0 010 6H9"/></svg>}
              </div>
              <p className="text-[11px] text-[#555]">{station.amenities.join(" • ")}</p>
            </div>
            <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-4">
              <p className="text-[10px] text-[#555] font-semibold tracking-widest uppercase mb-2">User Rating</p>
              <div className="flex items-center gap-1.5 mb-1">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                <span className="text-2xl font-black text-white">{station.rating}</span>
              </div>
              <p className="text-[11px] text-[#555]">({station.reviews}+) Excellent</p>
            </div>
          </div>

          {/* Feature badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { icon: "🕐", label: "24/7", sub: "Available" },
              { icon: "🛡️", label: "Safe & Secure", sub: "Monitored" },
              { icon: "🚪", label: "Easy Access", sub: "Wide Entry" },
              { icon: "🌿", label: "Eco Friendly", sub: "100% Green" },
            ].map(({ icon, label, sub }) => (
              <div key={label} className="bg-[#111] border border-[#1a1a1a] rounded-xl px-3 py-2.5 flex items-center gap-2.5">
                <span className="text-base">{icon}</span>
                <div>
                  <p className="text-white text-[12px] font-semibold leading-tight">{label}</p>
                  <p className="text-[#555] text-[10px]">{sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA banner */}
          <div className="bg-[#111] border border-[#1a1a1a] rounded-xl px-4 py-3.5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              </div>
              <div>
                <p className="text-white text-[13px] font-bold">Save Time. Book in Advance!</p>
                <p className="text-[#555] text-[11px]">Reserve your slot and skip the wait.</p>
              </div>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-green-500/40 text-green-400 hover:bg-green-500/10 text-[12px] font-semibold transition-colors flex-shrink-0">
              View Future Slots
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </div>
        </div>

        {/* ── RIGHT COLUMN — Configure Session ── */}
        <div className="lg:sticky lg:top-[61px] h-fit">
          <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl p-5 space-y-5">
            <h2 className="text-lg font-bold text-white">Configure Session</h2>

            {/* Connector type */}
            <div>
              <p className="text-[10px] font-semibold text-[#555] tracking-widest uppercase mb-3">Select Connector Type</p>
              <div className="grid grid-cols-2 gap-2">
                {station.connectors.map((c) => (
                  <button key={c.id} onClick={() => setConnector(c.id)}
                    className={`relative flex flex-col items-center gap-1.5 p-4 rounded-xl border transition-all ${
                      connector === c.id
                        ? "border-green-500/60 bg-green-500/8"
                        : "border-[#2a2a2a] bg-[#161616] hover:border-[#3a3a3a]"
                    }`}>
                    {connector === c.id && (
                      <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                        <svg className="w-3 h-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}><path d="M5 13l4 4L19 7"/></svg>
                      </div>
                    )}
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      {c.id === "ccs2"
                        ? <><rect x="6" y="3" width="12" height="14" rx="2"/><circle cx="9" cy="10" r="1.5" fill="currentColor"/><circle cx="15" cy="10" r="1.5" fill="currentColor"/><rect x="8" y="17" width="3" height="4" rx="1"/><rect x="13" y="17" width="3" height="4" rx="1"/></>
                        : <><rect x="7" y="3" width="10" height="16" rx="2"/><line x1="10" y1="7" x2="14" y2="7"/><line x1="10" y1="11" x2="14" y2="11"/><circle cx="12" cy="16" r="1" fill="currentColor"/></>
                      }
                    </svg>
                    <span className="text-white text-[13px] font-bold">{c.name}</span>
                    <span className="text-[#666] text-[10px]">{c.power}</span>
                    <span className="text-[#555] text-[10px]">{c.max}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Date + Time */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-[10px] font-semibold text-[#555] tracking-widest uppercase mb-2">Date</p>
                <div className="flex items-center justify-between bg-[#161616] border border-[#2a2a2a] rounded-xl px-3 py-2.5">
                  <select value={date} onChange={e => setDate(e.target.value)}
                    className="bg-[#161616] text-white text-[13px] font-medium flex-1 focus:outline-none appearance-none cursor-pointer"
                    style={{
                      background: '#161616',
                      color: 'white',
                      colorScheme: 'dark',
                    }}>
                    <option value="Today">Today</option>
                    <option value="Tomorrow">Tomorrow</option>
                    <option value="Day After">Day After</option>
                  </select>
                  <svg className="w-4 h-4 text-[#555] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-[#555] tracking-widest uppercase mb-2">Arrival Time</p>
                <div className="flex items-center justify-between bg-[#161616] border border-[#2a2a2a] rounded-xl px-3 py-2.5">
                  <select value={time} onChange={e => setTime(e.target.value)}
                    className="bg-[#161616] text-white text-[13px] font-medium flex-1 focus:outline-none appearance-none cursor-pointer"
                    style={{
                      background: '#161616',
                      color: 'white',
                      colorScheme: 'dark',
                    }}>
                    {availableTimeSlots.map(t =>
                      <option key={t} value={t}>{t}</option>
                    )}
                  </select>
                  <svg className="w-4 h-4 text-[#555] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>
                </div>
              </div>
            </div>

            {/* Best time hint */}
            <div className="flex items-center gap-3 bg-green-500/5 border border-green-500/20 rounded-xl px-4 py-3">
              <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>
              <div className="flex-1 min-w-0">
                <p className="text-white text-[12px] font-semibold">Best Time to Charge</p>
                <p className="text-[#666] text-[10px]">Low demand between 5 PM – 7 PM</p>
              </div>
              <span className="text-green-400 text-[11px] font-bold bg-green-500/10 px-2 py-0.5 rounded-full flex-shrink-0">Optimal</span>
            </div>

            {/* Estimates */}
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-[#666] text-[13px]">Estimated Charge Time</span>
                <span className="text-green-400 text-[15px] font-bold">{station.chargeTime}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#666] text-[13px]">Energy Estimate</span>
                <span className="text-white text-[13px] font-semibold">~ {station.energy}</span>
              </div>
            </div>

            <div className="h-px bg-[#1f1f1f]" />

            {/* Total */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-white text-[17px] font-bold">Total Cost</span>
                <span className="text-green-400 text-[22px] font-black">₹{totalCost}</span>
              </div>
              <p className="text-[#555] text-[10px] flex items-center gap-1">
                Inclusive of taxes and service fee
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><circle cx="12" cy="12" r="9"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              </p>
            </div>

            {/* Pay button */}
            <button 
              onClick={() => router.push('/booking-success')}
              className="w-full flex items-center justify-between bg-green-500 hover:bg-green-400 active:bg-green-600 text-black font-bold px-5 py-4 rounded-xl transition-colors text-[15px]"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
              Pay &amp; Confirm
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>

            {/* Razorpay note */}
            <div className="flex items-center justify-center gap-1.5 text-[#555] text-[10px]">
              <svg className="w-3.5 h-3.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              Secure payment powered by Razorpay
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
