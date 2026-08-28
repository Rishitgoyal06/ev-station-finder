"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import {
  IconChartBar,
  IconChargingPile,
  IconCalendarEvent,
  IconUsers,
  IconTrendingUp,
  IconCircleCheck,
  IconLock,
  IconMapPin,
  IconRefresh,
  IconSearch,
  IconCalendar,
  IconUsersGroup,
  IconChartAreaLine,
} from "@tabler/icons-react";
import { fetchStationsCached } from "@/lib/stations";

type LiveStation = {
  place_id: string;
  name: string;
  address: string;
  distance_str: string;
  open_now: boolean;
  latitude: number;
  longitude: number;
};

const SkeletonCard = () => (
  <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-5 animate-pulse">
    <div className="h-4 bg-[#1f1f1f] rounded w-1/2 mb-3" />
    <div className="h-3 bg-[#1f1f1f] rounded w-3/4 mb-4" />
    <div className="grid grid-cols-3 gap-2">
      {[1, 2, 3].map(i => <div key={i} className="h-8 bg-[#1f1f1f] rounded" />)}
    </div>
  </div>
);

export default function OwnerDashboard() {
  const router = useRouter();
  const { isAuthenticated, user, logout, isLoading: isAuthLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  // Live stations from backend
  const [stations, setStations] = useState<LiveStation[]>([]);
  const [isLoadingStations, setIsLoadingStations] = useState(true);
  const [stationSearch, setStationSearch] = useState("");
  const [userLocation, setUserLocation] = useState({ lat: 22.3072, lng: 73.1812 });

  // Bookings
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);
  const [bookingSearch, setBookingSearch] = useState("");
  const [bookingStatusFilter, setBookingStatusFilter] = useState("all");

  const canAccessOwner = user?.role === "owner" || user?.role === "admin";

  // Auth guard — only owners (and admins can also view)
  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) router.replace("/login");
    if (!isAuthLoading && isAuthenticated && !canAccessOwner) router.replace("/dashboard");
  }, [isAuthLoading, isAuthenticated, user, router]);

  // Get user location then fetch stations
  useEffect(() => {
    if (!isAuthenticated) return;

    const doFetch = (lat: number, lng: number) => {
      setUserLocation({ lat, lng });
      fetchNearbyStations(lat, lng);
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => doFetch(coords.latitude, coords.longitude),
        () => doFetch(22.3072, 73.1812)
      );
    } else {
      doFetch(22.3072, 73.1812);
    }
  }, [isAuthenticated]);

  const fetchNearbyStations = async (lat: number, lng: number) => {
    setIsLoadingStations(true);
    try {
      const data = await fetchStationsCached({ lat, lng, radius: 30000 });
      setStations(data.results || []);
    } catch (e) {
      console.error("Failed to fetch stations:", e);
      setStations([]);
    } finally {
      setIsLoadingStations(false);
    }
  };

  // Fetch all bookings when bookings tab is active
  useEffect(() => {
    if (!isAuthenticated) return;
    // Always fetch bookings on mount so Overview stat is populated
    setIsLoadingBookings(true);
    fetch("/api/admin/bookings")
      .then((r) => r.json())
      .then((d) => setBookings(d.bookings || []))
      .catch(() => setBookings([]))
      .finally(() => setIsLoadingBookings(false));
  }, [isAuthenticated]);

  if (isAuthLoading) {
    return (
      <div className="flex h-screen bg-[#0a0a0a] items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated || !user || !canAccessOwner) return null;

  const displayName = user?.name || "Owner";
  const avatarLetter = displayName[0]?.toUpperCase() || "O";
  const isAdmin = user?.role === "admin";

  const openStations = stations.filter(s => s.open_now);
  const closedStations = stations.filter(s => !s.open_now);

  const filteredStations = stations.filter(s =>
    s.name.toLowerCase().includes(stationSearch.toLowerCase()) ||
    s.address.toLowerCase().includes(stationSearch.toLowerCase())
  );

  const tabs = [
    { key: "overview", label: "Overview", icon: IconChartBar },
    { key: "stations", label: "Nearby Stations", icon: IconChargingPile },
    { key: "bookings", label: "Bookings", icon: IconCalendarEvent },
    { key: "workers", label: "Workers", icon: IconUsers },
    { key: "analytics", label: "Analytics", icon: IconTrendingUp },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-20">
      {/* Fixed Header */}
      <div className="bg-[#111] border-b border-[#1a1a1a] px-6 py-4 fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg ${isAdmin ? "bg-red-500" : "bg-purple-500"}`}>
              {avatarLetter}
            </div>
            <div>
              <h1 className="text-xl font-bold">{isAdmin ? "Admin" : "Owner"} Portal</h1>
              <p className="text-gray-400 text-sm">
                Logged in as <span className={`font-medium ${isAdmin ? "text-red-400" : "text-purple-400"}`}>{displayName}</span>
                <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400">{user?.role}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {isAdmin && (
              <button
                onClick={() => router.push("/admin")}
                className="px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg font-medium transition-colors text-sm hover:bg-red-500/20"
              >
                Admin Panel
              </button>
            )}
            <button
              onClick={() => router.push("/")}
              className="px-4 py-2 bg-[#1f1f1f] hover:bg-[#2a2a2a] rounded-lg font-medium transition-colors text-sm"
            >
              ← Exit Portal
            </button>
            <button
              onClick={async () => { await logout(); router.push("/"); }}
              className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-lg font-medium transition-colors text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Nav Tabs */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                activeTab === key ? "bg-green-500 text-black" : "text-gray-400 hover:text-white hover:bg-[#1f1f1f]"
              }`}
            >
              <Icon size={16} stroke={2} /> {label}
            </button>
          ))}
        </div>

        {/* ── Overview Tab ──────────────────────────────────────────── */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Quick Stats — derived from live backend data */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Stations Nearby", value: isLoadingStations ? null : stations.length, icon: IconChargingPile, color: "text-green-400" },
                { label: "Currently Open", value: isLoadingStations ? null : openStations.length, icon: IconCircleCheck, color: "text-emerald-400" },
                { label: "Currently Closed", value: isLoadingStations ? null : closedStations.length, icon: IconLock, color: "text-red-400" },
                { label: "Active Bookings", value: bookings.filter(b => b.status === "confirmed").length, icon: IconCalendarEvent, color: "text-yellow-400" },
              ].map((s, i) => (
                <div key={i} className="bg-[#111] border border-[#1a1a1a] rounded-xl p-4">
                  {isLoadingStations && s.value === null ? (
                    <div className="animate-pulse">
                      <div className="h-3 bg-[#1f1f1f] rounded w-1/2 mb-2" />
                      <div className="h-8 bg-[#1f1f1f] rounded w-1/3" />
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between mb-2">
                        <s.icon size={22} stroke={1.8} />
                      </div>
                      <p className={`text-3xl font-bold mb-1 ${s.color}`}>{s.value}</p>
                      <p className="text-xs text-gray-400">{s.label}</p>
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* Live Station Status */}
            <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Live Station Status</h3>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse inline-block" />
                  <span className="text-xs text-green-400">Live via backend API</span>
                </div>
              </div>
              {isLoadingStations ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
                </div>
              ) : stations.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  <IconMapPin size={36} className="mx-auto mb-2 text-gray-400" stroke={1.6} />
                  <p className="text-sm">No stations found nearby. Backend may be offline.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {stations.slice(0, 6).map((s) => (
                    <div key={s.place_id} className="p-4 bg-[#161616] rounded-xl border border-[#2a2a2a]">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-sm leading-tight flex-1 pr-2">{s.name}</h4>
                        <div className={`flex-shrink-0 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          s.open_now ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${s.open_now ? "bg-green-400" : "bg-red-400"}`} />
                          {s.open_now ? "Open" : "Closed"}
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mb-3 leading-relaxed">{s.address}</p>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400">{s.distance_str}</span>
                        <button
                          onClick={() => router.push(`/directions?lat=${s.latitude}&lng=${s.longitude}&station=${encodeURIComponent(s.name)}&address=${encodeURIComponent(s.address)}`)}
                          className="text-green-400 hover:text-green-300 font-medium"
                        >
                          Directions →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {stations.length > 6 && (
                <button
                  onClick={() => setActiveTab("stations")}
                  className="mt-4 w-full py-2.5 border border-[#2a2a2a] hover:border-green-500/40 text-gray-400 hover:text-green-400 rounded-lg text-sm font-medium transition-colors"
                >
                  View all {stations.length} stations →
                </button>
              )}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: "Register Station", sub: "Add your EV station", icon: IconChargingPile, color: "green", action: () => setActiveTab("stations") },
                { label: "Manage Workers", sub: "Add team members", icon: IconUsersGroup, color: "blue", action: () => setActiveTab("workers") },
                { label: "View Analytics", sub: "Performance insights", icon: IconChartAreaLine, color: "purple", action: () => setActiveTab("analytics") },
              ].map((a) => (
                <button
                  key={a.label}
                  onClick={a.action}
                  className={`p-4 bg-${a.color}-500/10 border border-${a.color}-500/20 rounded-xl hover:bg-${a.color}-500/20 transition-colors text-left`}
                >
                  <a.icon size={24} className={`block mb-2 text-${a.color}-400`} stroke={1.8} />
                  <p className={`font-medium text-${a.color}-400`}>{a.label}</p>
                  <p className={`text-xs text-${a.color}-400/70 mt-0.5`}>{a.sub}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Stations Tab ──────────────────────────────────────────── */}
        {activeTab === "stations" && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-xl font-bold">Nearby EV Stations</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => fetchNearbyStations(userLocation.lat, userLocation.lng)}
                  className="px-4 py-2 bg-[#1f1f1f] hover:bg-[#2a2a2a] border border-[#2a2a2a] rounded-lg text-sm font-medium transition-colors"
                >
                  <span className="inline-flex items-center gap-2"><IconRefresh size={14} stroke={1.8} /> Refresh</span>
                </button>
              </div>
            </div>

            <div className="relative">
              <input
                type="text"
                placeholder="Search stations by name or address..."
                value={stationSearch}
                onChange={(e) => setStationSearch(e.target.value)}
                className="w-full bg-[#111] border border-[#1a1a1a] rounded-xl px-4 py-3 pl-10 text-white placeholder-gray-500 focus:outline-none focus:border-green-500 text-sm"
              />
              <svg className="w-4 h-4 absolute left-3 top-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>

            {isLoadingStations ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map(i => <SkeletonCard key={i} />)}
              </div>
            ) : filteredStations.length === 0 ? (
              <div className="text-center py-16 text-gray-500">
                <IconSearch size={44} className="mx-auto mb-3 text-gray-400" stroke={1.6} />
                <p className="font-medium">{stations.length === 0 ? "No stations found. Backend may be offline." : "No stations match your search."}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredStations.map((s) => (
                  <div key={s.place_id} className="bg-[#111] border border-[#1a1a1a] hover:border-green-500/30 rounded-xl p-5 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-bold text-sm leading-tight flex-1 pr-2">{s.name}</h4>
                      <span className={`flex-shrink-0 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        s.open_now ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${s.open_now ? "bg-green-400" : "bg-red-400"}`} />
                        {s.open_now ? "Open" : "Closed"}
                      </span>
                    </div>

                    <p className="text-xs text-gray-400 mb-4 leading-relaxed">{s.address}</p>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{s.distance_str}</span>
                      <button
                        onClick={() => router.push(`/directions?lat=${s.latitude}&lng=${s.longitude}&station=${encodeURIComponent(s.name)}&address=${encodeURIComponent(s.address)}`)}
                        className="text-xs text-green-400 hover:text-green-300 font-medium transition-colors"
                      >
                        Get Directions →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Bookings Tab ──────────────────────────────────────────── */}
        {activeTab === "bookings" && (
          <div className="space-y-4">
            {/* Stats strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Total Bookings", value: bookings.length, color: "text-white" },
                { label: "Active", value: bookings.filter(b => b.status === "confirmed").length, color: "text-green-400" },
                { label: "Completed", value: bookings.filter(b => b.status === "completed").length, color: "text-blue-400" },
                { label: "Revenue", value: `₹${bookings.filter(b => b.status !== "cancelled").reduce((s: number, b: any) => s + (b.amount || 0), 0).toLocaleString()}`, color: "text-emerald-400" },
              ].map((s) => (
                <div key={s.label} className="bg-[#111] border border-[#1a1a1a] rounded-xl p-4">
                  <p className="text-xs text-gray-400 mb-1">{s.label}</p>
                  <p className={`text-2xl font-bold ${s.color}`}>{isLoadingBookings ? "—" : s.value}</p>
                </div>
              ))}
            </div>

            {/* Filters */}
            <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-5">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                <h3 className="text-lg font-bold">Station Bookings</h3>
                <div className="flex items-center gap-2 text-xs text-green-400">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  Live
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mb-4">
                <div className="flex-1 min-w-[200px] relative">
                  <input
                    type="text"
                    placeholder="Search by station, booking ID or vehicle..."
                    value={bookingSearch}
                    onChange={(e) => setBookingSearch(e.target.value)}
                    className="w-full bg-[#161616] border border-[#2a2a2a] rounded-lg px-4 py-2 pl-9 text-white placeholder-gray-500 focus:outline-none focus:border-green-500 text-sm"
                  />
                  <IconSearch size={14} className="absolute left-3 top-2.5 text-gray-500" stroke={2} />
                </div>
                <select
                  value={bookingStatusFilter}
                  onChange={(e) => setBookingStatusFilter(e.target.value)}
                  className="bg-[#161616] border border-[#2a2a2a] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-green-500"
                >
                  <option value="all">All Statuses</option>
                  <option value="confirmed">Active</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {/* Table */}
              {isLoadingBookings ? (
                <div className="animate-pulse space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-12 bg-[#1f1f1f] rounded-lg" />
                  ))}
                </div>
              ) : (() => {
                const filtered = bookings.filter((b) => {
                  const matchSearch =
                    b.stationName?.toLowerCase().includes(bookingSearch.toLowerCase()) ||
                    b.id?.toLowerCase().includes(bookingSearch.toLowerCase()) ||
                    (b.vehicleInfo || "").toLowerCase().includes(bookingSearch.toLowerCase());
                  const matchStatus = bookingStatusFilter === "all" || b.status === bookingStatusFilter;
                  return matchSearch && matchStatus;
                });

                if (filtered.length === 0) {
                  return (
                    <div className="text-center py-16 text-gray-500">
                      <IconCalendar size={44} className="mx-auto mb-3 text-gray-400" stroke={1.6} />
                      <p className="text-white font-semibold mb-1">
                        {bookings.length === 0 ? "No bookings yet" : "No bookings match your filter"}
                      </p>
                      <p className="text-sm">
                        {bookings.length === 0
                          ? "Once users book charging sessions at your stations, they'll appear here."
                          : "Try adjusting your search or status filter."}
                      </p>
                    </div>
                  );
                }

                return (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-[#1a1a1a] text-left text-gray-400 text-xs">
                          {["Booking ID", "Station", "Date & Time", "Slot", "Amount", "Status"].map((h) => (
                            <th key={h} className="py-3 px-3 font-medium">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {filtered.map((b: any) => (
                          <tr key={b.id} className="border-b border-[#1a1a1a] hover:bg-[#161616] transition-colors">
                            <td className="py-3 px-3 font-mono text-xs text-gray-300">{b.id}</td>
                            <td className="py-3 px-3">
                              <p className="font-medium text-white truncate max-w-[160px]">{b.stationName}</p>
                              {b.vehicleInfo && <p className="text-xs text-gray-500">{b.vehicleInfo}</p>}
                            </td>
                            <td className="py-3 px-3 text-gray-300">
                              <p>{b.date}</p>
                              <p className="text-xs text-gray-500">{b.time}</p>
                            </td>
                            <td className="py-3 px-3 text-gray-300">{b.slotNumber}</td>
                            <td className="py-3 px-3 text-green-400 font-bold">₹{b.amount}</td>
                            <td className="py-3 px-3">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                                b.status === "confirmed" ? "bg-green-500/10 text-green-400 border-green-500/20" :
                                b.status === "completed" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                                "bg-red-500/10 text-red-400 border-red-500/20"
                              }`}>
                                {b.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* ── Workers Tab ───────────────────────────────────────────── */}
        {activeTab === "workers" && (
          <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-5">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold">Station Workers</h3>
              <button
                onClick={() => window.open("mailto:support@chargeiq.in?subject=Add Worker Request&body=Please add the following worker to my station:%0A%0AName:%0AEmail:%0APhone:%0AStation:", "_blank")}
                className="px-4 py-2 bg-green-500 hover:bg-green-400 text-black font-medium rounded-lg text-sm transition-colors"
              >
                + Invite Worker
              </button>
            </div>
            <div className="text-center py-16 text-gray-500">
              <IconUsersGroup size={44} className="mx-auto mb-3 text-gray-400" stroke={1.6} />
              <p className="text-white font-semibold mb-1">No workers added yet</p>
              <p className="text-sm mb-4">Workers who register with the "worker" role will appear here.</p>
              <p className="text-xs text-gray-600">Ask your workers to sign up at <span className="text-green-400">/signup</span> and select the Worker role.</p>
            </div>
          </div>
        )}

        {/* ── Analytics Tab ─────────────────────────────────────────── */}
        {activeTab === "analytics" && (
          <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-5">
            <h3 className="text-lg font-bold mb-2">Analytics</h3>
            <p className="text-sm text-gray-400 mb-5">Revenue and usage analytics will appear once bookings start flowing in.</p>

            {/* Show what we do know from live data */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-[#161616] rounded-xl p-5">
                <p className="text-sm text-gray-400 mb-1">Stations in your area</p>
                <p className="text-3xl font-black text-green-400">{isLoadingStations ? "—" : stations.length}</p>
                <p className="text-xs text-gray-500 mt-1">Within 30km radius</p>
              </div>
              <div className="bg-[#161616] rounded-xl p-5">
                <p className="text-sm text-gray-400 mb-1">Currently open</p>
                <p className="text-3xl font-black text-emerald-400">{isLoadingStations ? "—" : openStations.length}</p>
                <p className="text-xs text-gray-500 mt-1">Accepting vehicles right now</p>
              </div>
            </div>

            <div className="text-center py-8 border border-dashed border-[#2a2a2a] rounded-xl text-gray-500">
              <IconChartAreaLine size={36} className="mx-auto mb-2 text-gray-400" stroke={1.6} />
              <p className="text-sm">Full analytics available after first booking is made.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
