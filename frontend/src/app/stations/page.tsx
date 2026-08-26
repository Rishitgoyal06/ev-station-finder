"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import dynamic from "next/dynamic";
import { fetchStationsCached } from "@/lib/stations";

const StationsMap = dynamic(() => import("@/components/DashboardMap"), { ssr: false });

// Fallback mock data
const fallbackStations: any[] = [];

type Filter = "All Chargers" | "DC Fast Charger" | "AC Charger";
type Sort   = "Nearest" | "Price: Low" | "Available";

export default function StationsPage() {
  const { isAuthenticated, user, logout, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>("All Chargers");
  const [sort, setSort]     = useState<Sort>("Nearest");
  const [avail, setAvail]   = useState(false);
  const [booking, setBooking] = useState(false);
  const [activeNav, setActiveNav] = useState("Stations");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [location, setLocation] = useState("Vagodhia Taluka");
  const [subLocation, setSubLocation] = useState("Vadodara, Gujarat");
  const [stationsList, setStationsList] = useState<any[]>(fallbackStations);
  const [isStationsLoading, setIsStationsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) router.replace("/");
  }, [isAuthLoading, isAuthenticated, router]);

  useEffect(() => {
    const fetchStations = async (lat: number, lng: number) => {
      setIsStationsLoading(true);
      try {
        const data = await fetchStationsCached({ lat, lng, radius: 30000 });
        
        if (data.results && data.results.length > 0) {
          const mapped = data.results.map((s: any, i: number) => {
            const seed = s.name.length + i;
            const isDC = seed % 2 === 0;
            const total = (seed % 4) + 2;
            const available = s.open_now ? (seed % total) : 0;
            const imgs = [
              "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=400&q=80",
              "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=400&q=80",
              "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
              "https://images.unsplash.com/photo-1660236822651-4263beb35fa8?w=400&q=80"
            ];
            return {
              id: s.place_id || i.toString(),
              name: s.name,
              badge: i === 0 ? "Best Match" : "",
              address: s.address || "Unknown Location",
              city: s.city || "",
              distance: s.distance_str || "Nearby",
              types: [isDC ? "DC Fast Charger" : "AC Charger"],
              connectors: [isDC ? "CCS2" : "Type 2"],
              hours: s.open_now ? "Open Now" : "Closed",
              available: available,
              total: total,
              price: 12 + (seed % 10),
              chargeTime: isDC ? "35 mins" : "60 mins",
              verified: seed % 3 !== 0,
              img: s.photo_urls && s.photo_urls.length > 0 ? `http://localhost:8001${s.photo_urls[0]}` : imgs[seed % imgs.length]
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
      fetchStations(22.3072, 73.1812);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        fetchStations(coords.latitude, coords.longitude);
        try {
          const r = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${coords.latitude}&lon=${coords.longitude}&format=json`);
          const d = await r.json();
          setLocation(d.address?.suburb || d.address?.county || d.address?.city || "Your Location");
          setSubLocation(`${d.address?.city || d.address?.town || ""}, ${d.address?.state || ""}`.trim().replace(/^,|,$/g, ""));
        } catch {}
      },
      () => fetchStations(22.3072, 73.1812)
    );
  }, []);

  if (isAuthLoading) {
    return <div className="flex h-screen bg-[#0a0a0a] items-center justify-center text-green-400">
      <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full" />
    </div>;
  }
  if (!isAuthenticated) return null;
  const displayName = typeof user === "string" ? user : user?.name || "Driver";

  const filtered = stationsList
    .filter(s => filter === "All Chargers" || s.types.includes(filter))
    .filter(s => !avail  || s.available > 0)
    .filter(s => !booking || true)
    .sort((a, b) =>
      sort === "Price: Low" ? a.price - b.price :
      sort === "Available"  ? b.available - a.available :
      parseFloat(a.distance) - parseFloat(b.distance)
    );

  const navItems = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Stations",  path: "/stations" },
    { label: "My Bookings", path: "/bookings" },
    { label: "Profile", path: "/profile" },
  ];

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={`flex flex-col h-full bg-[#0d0d0d] border-r border-[#1a1a1a] ${mobile ? "w-56" : "w-[200px]"}`}>
      <div className="px-5 py-4 border-b border-[#1a1a1a]">
        <span className="text-xl font-black"><span className="text-green-400">Charge</span><span className="text-white">IQ</span></span>
      </div>
      <nav className="flex-1 px-2 py-3 space-y-0.5">
        {navItems.map(({ label, path }) => (
          <button key={label} onClick={() => { setActiveNav(label); setSidebarOpen(false); router.push(path); }}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] font-medium transition-all text-left ${
              activeNav === label ? "bg-green-500/15 text-green-400" : "text-[#555] hover:text-white hover:bg-[#161616]"
            }`}>
            {label}
          </button>
        ))}
      </nav>
      {/* Premium banner */}
      <div className="mx-3 mb-3 p-3 rounded-xl bg-gradient-to-br from-green-900/40 to-[#111] border border-green-800/30">
        <div className="flex items-center gap-1.5 mb-1">
          <div className="w-4 h-4 rounded-full bg-green-500/20 flex items-center justify-center">
            <svg className="w-2.5 h-2.5 text-green-400" fill="currentColor" viewBox="0 0 24 24"><path d="M13 2L4.5 13.5H11L10 22L19.5 10.5H13Z"/></svg>
          </div>
          <span className="text-green-400 text-[11px] font-bold">Go Premium</span>
        </div>
        <p className="text-[#666] text-[10px] leading-relaxed mb-2">Get lower prices, priority booking and more benefits.</p>
        <button className="w-full py-1.5 rounded-lg bg-green-500 hover:bg-green-400 text-black text-[11px] font-bold transition-colors">Upgrade Now</button>
      </div>
      {/* Vehicle info */}
      <div className="mx-3 mb-3 p-3 rounded-xl bg-[#111] border border-[#1a1a1a]">
        <p className="text-[10px] text-[#444] mb-2">My Vehicle</p>
        <button
          onClick={() => router.push("/profile?tab=vehicle")}
          className="w-full flex items-center gap-2 text-[#555] hover:text-green-400 text-[11px] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <circle cx="12" cy="12" r="9"/><path d="M12 7v10M7 12h10"/>
          </svg>
          Add your vehicle
        </button>
      </div>
      <div className="px-3 pb-3 flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-full bg-[#1a1a1a] border border-[#333] flex items-center justify-center text-[11px] font-bold text-green-400 flex-shrink-0">
          {displayName[0].toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-white text-[11px] font-semibold truncate">{displayName}</p>
          <p className="text-[#555] text-[10px]">Premium Member</p>
        </div>
        <button onClick={async () => { await logout(); router.replace("/"); }} className="text-[#444] hover:text-red-400 transition-colors">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-white overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex flex-col flex-shrink-0 h-full"><Sidebar /></div>
      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/70" onClick={() => setSidebarOpen(false)} />
          <div className="relative z-10 h-full"><Sidebar mobile /></div>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-[#1a1a1a] bg-[#0d0d0d] flex-shrink-0">
          <button className="lg:hidden text-[#555] hover:text-white mr-3" onClick={() => setSidebarOpen(true)}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path d="M4 6h16M4 12h16M4 18h16"/></svg>
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-3">
            <button className="relative text-[#555] hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full text-[8px] font-bold text-black flex items-center justify-center">3</span>
            </button>
            <div className="w-7 h-7 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center text-[11px] font-bold text-green-400">
              {displayName[0].toUpperCase()}
            </div>
            <svg className="w-4 h-4 text-[#555]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path d="M19 9l-7 7-7-7"/></svg>
          </div>
        </div>

        <div className="flex-1 p-4 sm:p-5 space-y-4">
          {/* Heading */}
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">Find Your Next <span className="text-green-400">Charge</span></h1>
            <p className="text-[#555] text-xs mt-0.5">Real-time availability of charging stations near you</p>
          </div>

          {/* Location + Map row */}
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-3">
            {/* Location card */}
            <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-4 flex flex-col justify-between min-h-[180px]">
              <div>
                <div className="flex items-center gap-1.5 text-[10px] text-[#555] font-semibold tracking-widest uppercase mb-2">
                  <svg className="w-3 h-3 text-green-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.686 2 6 4.686 6 8c0 4.5 6 12 6 12s6-7.5 6-12c0-3.314-2.686-6-6-6z"/></svg>
                  Current Location
                </div>
                <p className="text-lg font-bold text-white leading-tight">{location}</p>
                <p className="text-[#555] text-xs mt-0.5">{subLocation}</p>
              </div>
              <button className="mt-4 flex items-center gap-2 px-3 py-2 rounded-lg border border-[#2a2a2a] text-[#aaa] hover:text-white hover:border-[#444] text-[12px] font-medium transition-colors w-fit">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                Change Location
              </button>
            </div>
            {/* Map */}
            <div className="bg-[#111] border border-[#1a1a1a] rounded-xl overflow-hidden relative" style={{ minHeight: 200 }}>
              <div className="h-[200px] lg:h-full min-h-[200px]"><StationsMap /></div>
              {/* Legend */}
              <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm rounded-lg px-3 py-2 border border-[#2a2a2a] space-y-1">
                {[["#22c55e","Available"],["#f59e0b","Busy"],["#ef4444","Unavailable"]].map(([c,l]) => (
                  <div key={l} className="flex items-center gap-1.5 text-[10px] text-[#aaa]">
                    <div className="w-2 h-2 rounded-full" style={{ background: c }} />{l}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Filter bar */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 text-[#555] text-[12px]">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path d="M3 4h18M7 8h10M11 12h2"/></svg>
              Filter By
            </div>
            {(["All Chargers","DC Fast Charger","AC Charger"] as Filter[]).map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-full text-[12px] font-medium border transition-all ${
                  filter === f ? "bg-green-500/15 border-green-500/50 text-green-400" : "border-[#2a2a2a] text-[#666] hover:text-white hover:border-[#444]"
                }`}>{f}</button>
            ))}
            <button onClick={() => setAvail(!avail)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-medium border transition-all ${
                avail ? "bg-green-500/15 border-green-500/50 text-green-400" : "border-[#2a2a2a] text-[#666] hover:text-white"
              }`}>
              Available Now
              <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${avail ? "bg-green-500 border-green-500" : "border-[#444]"}`}>
                {avail && <svg className="w-2 h-2 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}><path d="M5 13l4 4L19 7"/></svg>}
              </div>
            </button>
            <button onClick={() => setBooking(!booking)}
              className={`px-3 py-1 rounded-full text-[12px] font-medium border transition-all ${
                booking ? "bg-green-500/15 border-green-500/50 text-green-400" : "border-[#2a2a2a] text-[#666] hover:text-white"
              }`}>Booking Available</button>
            <div className="ml-auto flex items-center gap-2">
              <span className="text-[#555] text-[12px]">Sort By</span>
              <select value={sort} onChange={e => setSort(e.target.value as Sort)}
                className="bg-[#111] border border-[#2a2a2a] text-white text-[12px] rounded-lg px-3 py-1 focus:outline-none focus:border-green-500/50">
                <option>Nearest</option><option>Price: Low</option><option>Available</option>
              </select>
            </div>
          </div>

          {/* Station cards */}
          <div className="space-y-3">
            {isStationsLoading ? (
              // Loading Skeleton
              [1, 2, 3].map((n) => (
                <div key={n} className="bg-[#111] border border-[#1a1a1a] rounded-xl p-4 flex flex-col sm:flex-row gap-4 animate-pulse">
                  <div className="w-full sm:w-[200px] h-[140px] bg-[#1a1a1a] rounded-lg flex-shrink-0" />
                  <div className="flex-1 flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="h-4 bg-[#1a1a1a] rounded w-1/2" />
                      <div className="h-3 bg-[#1a1a1a] rounded w-3/4" />
                      <div className="flex gap-2">
                        <div className="h-4 bg-[#1a1a1a] rounded w-16" />
                        <div className="h-4 bg-[#1a1a1a] rounded w-16" />
                      </div>
                    </div>
                    <div className="flex sm:flex-col items-start sm:items-end gap-3 sm:min-w-[160px]">
                      <div className="h-3 bg-[#1a1a1a] rounded w-20" />
                      <div className="h-8 bg-[#1a1a1a] rounded w-24" />
                    </div>
                  </div>
                </div>
              ))
            ) : filtered.length === 0 ? (
              <div className="text-center py-12 text-[#555]">No stations match your filters.</div>
            ) : (
              filtered.map((s) => {
                const availColor = s.available === 0 ? "text-red-400" : s.available <= 1 ? "text-yellow-400" : "text-green-400";
                const typeColor  = s.types[0].includes("DC") ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-blue-500/10 text-blue-400 border-blue-500/20";
                const isGreen    = s.badge === "Best Match";
                return (
                  <div key={s.id} className={`bg-[#111] border rounded-xl overflow-hidden transition-all hover:border-[#333] ${isGreen ? "border-green-500/30" : "border-[#1a1a1a]"}`}>
                    <div className="flex flex-col sm:flex-row gap-0">
                      {/* Image */}
                      <div className="relative w-full sm:w-[200px] h-[140px] sm:h-auto flex-shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={s.img} alt={s.name} className="w-full h-full object-cover" />
                        {s.badge && (
                          <div className="absolute top-2 left-2 bg-green-500/90 text-black text-[10px] font-bold px-2 py-0.5 rounded-full">{s.badge}</div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 p-4 flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-white font-bold text-[15px]">{s.name}</h3>
                            {s.verified && (
                              <svg className="w-4 h-4 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                            )}
                          </div>
                          <div className="flex items-center gap-1 text-[#555] text-[11px] mb-2">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path d="M12 2C8.686 2 6 4.686 6 8c0 4.5 6 12 6 12s6-7.5 6-12c0-3.314-2.686-6-6-6z"/></svg>
                            {s.distance} • {s.address}
                          </div>
                          <button className="flex items-center gap-1 text-green-400 text-[11px] hover:text-green-300 mb-3 transition-colors">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/></svg>
                            Directions
                          </button>
                          <div className="flex flex-wrap gap-1.5">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${typeColor}`}>{s.types[0]}</span>
                            {s.connectors.map(c => <span key={c} className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#1a1a1a] border border-[#2a2a2a] text-[#aaa]">{c}</span>)}
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#1a1a1a] border border-[#2a2a2a] text-[#aaa]">{s.hours}</span>
                          </div>
                        </div>

                        {/* Stats + CTA */}
                        <div className="flex sm:flex-col items-start sm:items-end justify-between sm:justify-start gap-3 sm:gap-4 sm:min-w-[160px]">
                          <div className="flex gap-6 sm:gap-4 sm:flex-row">
                            <div>
                              <p className="text-[10px] text-[#555]">Available Chargers</p>
                              <p className={`text-[15px] font-bold ${availColor}`}>{s.available} / {s.total}</p>
                              <p className={`text-[10px] ${availColor}`}>Ready to use</p>
                            </div>
                            <div>
                              <p className="text-[10px] text-[#555]">Price</p>
                              <p className="text-[15px] font-bold text-white">₹{s.price} <span className="text-[11px] text-[#555] font-normal">/ kWh</span></p>
                            </div>
                            <div>
                              <p className="text-[10px] text-[#555]">Est. Charge Time</p>
                              <p className="text-[15px] font-bold text-white">{s.chargeTime}</p>
                              <p className="text-[10px] text-[#555]">(10% – 80%)</p>
                            </div>
                          </div>
                          <div className="flex flex-col gap-1.5 items-end">
                            <button
                              onClick={() => {
                                const params = new URLSearchParams({
                                  name: s.name,
                                  address: s.address,
                                  city: s.city || "",
                                  price: String(s.price),
                                  chargeTime: s.chargeTime,
                                  connectors: s.connectors.join(","),
                                  img: s.img,
                                  available: String(s.available),
                                  total: String(s.total),
                                  peakPower: s.types[0]?.includes("DC") ? "150 kW" : "22 kW",
                                  powerType: s.types[0] || "AC Charging",
                                });
                                router.push(`/stations/${encodeURIComponent(s.id)}?${params.toString()}`);
                              }}
                              disabled={s.available === 0}
                              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-bold transition-all ${
                                s.available === 0 ? "bg-[#1a1a1a] text-[#444] cursor-not-allowed border border-[#2a2a2a]"
                                : isGreen ? "bg-green-500 hover:bg-green-400 text-black" : "bg-white hover:bg-gray-100 text-black"
                              }`}>
                              Book Now
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                            </button>
                            <button className="text-green-400 hover:text-green-300 text-[11px] transition-colors">View Details</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Bottom info strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pb-4">
            {[
              { icon: "🏷️", title: "Why Book in Advance?", desc: "Avoid waiting in queues and get guaranteed charging on arrival." },
              { icon: "🔒", title: "Secure & Easy Booking", desc: "100% secure payments with instant confirmation." },
              { icon: "💬", title: "Need Help?", desc: "Contact support for any assistance with your booking." },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="bg-[#111] border border-[#1a1a1a] rounded-xl p-4 flex items-start gap-3">
                <span className="text-xl flex-shrink-0">{icon}</span>
                <div>
                  <p className="text-white text-[13px] font-semibold mb-0.5">{title}</p>
                  <p className="text-[#555] text-[11px] leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
