"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import dynamic from "next/dynamic";

const DashboardMap = dynamic(() => import("@/components/DashboardMap"), { ssr: false });

// Fallback mock data
const fallbackStations: any[] = [];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
}

// ── icons ──────────────────────────────────────────────────────────────────
const IconGrid = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
  </svg>
);
const IconClock = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/>
  </svg>
);
const IconPin = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M12 2C8.686 2 6 4.686 6 8c0 4.5 6 12 6 12s6-7.5 6-12c0-3.314-2.686-6-6-6z"/>
    <circle cx="12" cy="8" r="2"/>
  </svg>
);
const IconUser = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.582-7 8-7s8 3 8 7"/>
  </svg>
);
const IconHelp = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <circle cx="12" cy="12" r="9"/>
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><circle cx="12" cy="17" r=".5" fill="currentColor"/>
  </svg>
);
const IconLogout = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);
const IconBolt = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M13 2L4.5 13.5H11L10 22L19.5 10.5H13L13 2Z"/>
  </svg>
);
const IconArrow = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);

export default function DashboardPage() {
  const { isAuthenticated, user, logout, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const [battery, setBattery] = useState(28);
  const [location, setLocation] = useState("Detecting...");
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stationsList, setStationsList] = useState<any[]>(fallbackStations);
  const [isStationsLoading, setIsStationsLoading] = useState(true);
  const [summary, setSummary] = useState<{
    totalBookings: number;
    activeBookings: number;
    totalRevenue: number;
    availableSlots: number;
  } | null>(null);

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) router.replace("/");
  }, [isAuthLoading, isAuthenticated, router]);

  useEffect(() => {
    const fetchStations = async (lat: number, lng: number) => {
      setIsStationsLoading(true);
      try {
        const res = await fetch(`http://localhost:8000/ev-stations?lat=${lat}&lng=${lng}&radius=30000`);
        const data = await res.json();
        
        if (data.results && data.results.length > 0) {
          const mapped = data.results.slice(0, 5).map((s: any, i: number) => {
            // Generate deterministic mock stats for chargers based on name length
            const seed = s.name.length + i;
            const isDC = seed % 2 === 0;
            const total = (seed % 4) + 2;
            const available = s.open_now ? (seed % total) : 0;
            return {
              id: s.place_id || i.toString(),
              name: s.name,
              distance: s.distance_str || "Nearby",
              type: isDC ? "DC Fast Charger" : "AC Charger",
              available: available,
              total: total,
              price: 12 + (seed % 10)
            };
          });
          setStationsList(mapped);
        } else {
          setStationsList([]);
        }
      } catch (e) {
        console.error("Failed to fetch UI stations", e);
        setStationsList([]);
      } finally {
        setIsStationsLoading(false);
      }
    };

    if (!navigator.geolocation) { 
      setLocation("Vadodara"); 
      fetchStations(22.3072, 73.1812);
      return; 
    }
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        fetchStations(coords.latitude, coords.longitude);
        try {
          const r = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${coords.latitude}&lon=${coords.longitude}&format=json`);
          const d = await r.json();
          setLocation(d.address?.suburb || d.address?.county || d.address?.city || d.address?.town || "Your Location");
        } catch { setLocation("Your Location"); }
      },
      () => {
        setLocation("Vadodara");
        fetchStations(22.3072, 73.1812);
      }
    );
  }, []);

  useEffect(() => {
    const loadSummary = async () => {
      try {
        const res = await fetch("/api/summary");
        if (res.ok) {
          const data = await res.json();
          setSummary({
            totalBookings: data.totalBookings || 0,
            activeBookings: data.activeBookings || 0,
            totalRevenue: data.totalRevenue || 0,
            availableSlots: data.availableSlots || 0,
          });
        }
      } catch {
        setSummary(null);
      }
    };

    if (isAuthenticated) loadSummary();
  }, [isAuthenticated]);

  const handleLogout = async () => { await logout(); router.replace("/"); };

  if (isAuthLoading) {
    return <div className="flex h-screen bg-[#0a0a0a] items-center justify-center text-green-400">
      <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full" />
    </div>;
  }
  if (!isAuthenticated) return null;

  const displayName = typeof user === "string" ? user : user?.name || "Driver";
  const estimatedRange = Math.round(battery * 3);
  const timeToFullMins = Math.round((100 - battery) * 1.1);
  const batteryColor = battery > 50 ? "#22c55e" : battery > 20 ? "#f59e0b" : "#ef4444";
  const statusLabel = battery > 50 ? "Optimal" : battery > 20 ? "Moderate" : "Low — Charge Soon";
  const statusColor = battery > 50 ? "text-green-400" : battery > 20 ? "text-yellow-400" : "text-red-400";

  const navItems = [
    { label: "Dashboard", icon: <IconGrid />, path: "/dashboard" },
    { label: "My Bookings", icon: <IconClock />, path: "/bookings" },
    { label: "Stations", icon: <IconPin />, path: "/stations" },
    { label: "Profile", icon: <IconUser />, path: "/profile" },
  ];

  // ── Sidebar ──────────────────────────────────────────────────────────────
  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={`flex flex-col h-full bg-[#0f0f0f] border-r border-[#1f1f1f] ${mobile ? "w-56" : "w-[200px]"}`}>
      {/* Logo */}
      <div className="px-5 py-4 border-b border-[#1f1f1f]">
        <span className="text-xl font-black tracking-tight">
          <span className="text-green-400">Charge</span>
          <span className="text-white">IQ</span>
        </span>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-2 py-3 space-y-0.5">
        {navItems.map(({ label, icon, path }) => (
          <button
            key={label}
            onClick={() => { 
              if (path && path !== "/dashboard") {
                router.push(path);
              } else {
                setActiveNav(label); 
              }
              setSidebarOpen(false); 
            }}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] font-medium transition-all ${
              activeNav === label
                ? "bg-[#1a1a1a] text-white"
                : "text-[#666] hover:text-white hover:bg-[#161616]"
            }`}
          >
            {icon}
            {label}
          </button>
        ))}
      </nav>

      {/* User section */}
      <div className="px-3 py-3 border-t border-[#1f1f1f] space-y-2">
        {/* Avatar + name */}
        <div className="flex items-center gap-2.5 px-1">
          <div className="w-7 h-7 rounded-full bg-[#1a1a1a] border border-[#333] flex items-center justify-center text-[11px] font-bold text-green-400 flex-shrink-0">
            {displayName[0].toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-white text-[12px] font-semibold truncate leading-tight">{displayName}</p>
            <p className="text-[#555] text-[10px] leading-tight">Premium Member</p>
          </div>
        </div>

        {/* Upgrade */}
        <button className="w-full py-1.5 rounded-md bg-green-500 hover:bg-green-400 text-black text-[11px] font-bold transition-colors">
          Upgrade Plan
        </button>

        {/* Support + Logout */}
        <div className="space-y-0.5 pt-0.5">
          <button className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-[#555] hover:text-white hover:bg-[#161616] text-[12px] transition-colors">
            <IconHelp /> Support
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-[#555] hover:text-red-400 hover:bg-[#1a1010] text-[12px] transition-colors"
          >
            <IconLogout /> Logout
          </button>
        </div>
      </div>
    </div>
  );

  // ── Main ─────────────────────────────────────────────────────────────────
  return (
    <div className="flex h-screen bg-[#0a0a0a] text-white overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex flex-col flex-shrink-0 h-full">
        <Sidebar />
      </div>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/70" onClick={() => setSidebarOpen(false)} />
          <div className="relative z-10 h-full"><Sidebar mobile /></div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">

        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-[#1f1f1f] bg-[#0f0f0f]">
          <button onClick={() => setSidebarOpen(true)} className="text-[#555] hover:text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
          <span className="text-base font-black">
            <span className="text-green-400">Charge</span>IQ
          </span>
          <div className="w-5" />
        </div>

        <div className="flex-1 p-4 sm:p-5 space-y-4">

          {/* ── Greeting ── */}
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-white leading-tight">
              {getGreeting()} {displayName} 👋
            </h1>
            <p className="text-[#555] text-xs mt-0.5">
              Your vehicle is ready. Current status:{" "}
              <span className={`font-semibold ${statusColor}`}>{statusLabel}</span>
            </p>
          </div>

          {/* ── Top row: Battery + Location ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

            {/* Battery card */}
            <div className="bg-[#111] border border-[#1f1f1f] rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-semibold text-[#555] tracking-widest uppercase">Battery Status</span>
                <div className="w-7 h-7 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center text-yellow-400">
                  <IconBolt />
                </div>
              </div>

              <div className="text-4xl font-black mb-3" style={{ color: batteryColor }}>
                {battery}%
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-[#1f1f1f] rounded-full overflow-hidden mb-2">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${battery}%`, backgroundColor: batteryColor }}
                />
              </div>

              <div className="flex justify-between text-[10px] text-[#555] mb-3">
                <span>Estimated Range: {estimatedRange} km</span>
                <span>Time to Full: {Math.floor(timeToFullMins / 60)}h {timeToFullMins % 60}m (DC)</span>
              </div>

              {/* Slider */}
              <input
                type="range" min={1} max={100} value={battery}
                onChange={(e) => setBattery(Number(e.target.value))}
                className="w-full cursor-pointer accent-green-500"
                style={{ accentColor: batteryColor }}
              />
              <p className="text-[10px] text-[#444] mt-1">Drag to simulate battery level</p>
            </div>

            {/* Location card */}
            <div className="bg-[#111] border border-[#1f1f1f] rounded-xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-[10px] font-semibold text-[#555] tracking-widest uppercase mb-3">
                  <svg className="w-3.5 h-3.5 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="3"/>
                    <path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>
                  </svg>
                  Current Location
                </div>
                <p className="text-2xl font-bold text-white mb-4">{location}</p>
              </div>
              <button
                onClick={() => router.push("/stations")}
                className="flex items-center justify-between w-full bg-white hover:bg-gray-100 text-black text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors">
                Find My Next Charge
                <IconArrow />
              </button>
            </div>
          </div>

          {/* ── Live Summary ── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Bookings", value: summary?.totalBookings ?? "—", color: "text-green-400" },
              { label: "Active", value: summary?.activeBookings ?? "—", color: "text-blue-400" },
              { label: "Revenue", value: `₹${summary?.totalRevenue ?? 0}`, color: "text-emerald-400" },
              { label: "Open Slots", value: summary?.availableSlots ?? "—", color: "text-yellow-400" },
            ].map((item) => (
              <div key={item.label} className="bg-[#111] border border-[#1f1f1f] rounded-xl p-4">
                <p className="text-[10px] uppercase tracking-widest text-[#555] mb-1">{item.label}</p>
                <p className={`text-2xl font-black ${item.color}`}>{item.value}</p>
              </div>
            ))}
          </div>

          {/* ── Map ── */}
          <div className="bg-[#111] border border-[#1f1f1f] rounded-xl overflow-hidden relative">
            <div className="h-[200px] sm:h-[260px]">
              <DashboardMap />
            </div>
          </div>

          {/* ── Nearby Stations ── */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h2 className="text-sm font-bold text-white">Nearby Stations</h2>
              <button onClick={() => router.push("/stations")} className="text-[11px] text-green-400 hover:text-green-300 transition-colors">View All</button>
            </div>
            <div className="space-y-2">
              {isStationsLoading ? (
                // Loading Skeleton
                [1, 2, 3].map((n) => (
                  <div key={n} className="bg-[#111] border border-[#1f1f1f] rounded-xl px-4 py-3 flex items-center gap-3 animate-pulse">
                    <div className="w-9 h-9 rounded-lg bg-[#1a1a1a] flex-shrink-0" />
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="h-3.5 bg-[#1a1a1a] rounded w-1/3" />
                      <div className="h-2.5 bg-[#1a1a1a] rounded w-1/4" />
                    </div>
                    <div className="hidden sm:flex flex-col items-end gap-2">
                      <div className="h-2 bg-[#1a1a1a] rounded w-12" />
                      <div className="h-3 bg-[#1a1a1a] rounded w-16" />
                    </div>
                    <div className="ml-3 w-16 h-7 bg-[#1a1a1a] rounded-lg" />
                  </div>
                ))
              ) : stationsList.length === 0 ? (
                <div className="text-center py-8 text-[#555] text-sm">No stations found nearby</div>
              ) : (
                stationsList.map((s) => {
                  const avail = s.available === 0 ? "text-red-400" : s.available <= 1 ? "text-yellow-400" : "text-green-400";
                  const availLabel = s.available === 0 ? "Full" : "Ready";
                  const typeColor = s.type.includes("DC") ? "text-green-400" : "text-blue-400";
                  return (
                    <div key={s.id} className="bg-[#111] border border-[#1f1f1f] rounded-xl px-4 py-3 flex items-center gap-3">
                      {/* Icon */}
                      <div className="w-9 h-9 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center text-green-400 flex-shrink-0">
                        <IconBolt />
                      </div>

                      {/* Name + type */}
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-[13px] font-semibold leading-tight">{s.name}</p>
                        <div className="flex items-center gap-1.5 text-[11px] text-[#555] mt-0.5">
                          <span>{s.distance}</span>
                          <span>•</span>
                          <span className={`${typeColor} font-medium`}>⚡ {s.type}</span>
                        </div>
                      </div>

                      {/* Availability */}
                      <div className="hidden sm:flex flex-col items-end text-right">
                        <span className="text-[10px] text-[#555] font-medium">Availability</span>
                        <span className={`text-[11px] font-semibold ${avail}`}>
                          {s.available}/{s.total} {availLabel}
                        </span>
                      </div>

                      {/* Price */}
                      <div className="hidden sm:flex flex-col items-end text-right ml-4">
                        <span className="text-[10px] text-[#555] font-medium">Price</span>
                        <span className="text-[11px] font-semibold text-white">₹{s.price}/kWh</span>
                      </div>

                      {/* Book button */}
                      <button
                        onClick={() => s.available > 0 && router.push(`/stations/${s.id}`)}
                        disabled={s.available === 0}
                        className={`ml-3 px-4 py-1.5 rounded-lg text-[12px] font-bold transition-colors flex-shrink-0 ${
                          s.available === 0
                            ? "bg-[#1a1a1a] text-[#444] cursor-not-allowed border border-[#2a2a2a]"
                            : "bg-white hover:bg-gray-100 text-black"
                        }`}
                      >
                        Book
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
