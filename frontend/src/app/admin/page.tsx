"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import {
  IconUsers,
  IconChargingPile,
  IconBuildingStore,
  IconCalendarEvent,
  IconFlame,
  IconCash,
  IconChartBar,
  IconCreditCard,
} from "@tabler/icons-react";

// ── Types ─────────────────────────────────────────────────────────────────────
type AdminStats = {
  totalUsers: number;
  totalStations: number;
  totalOwners: number;
  totalBookings: number;
  activeBookings: number;
  totalRevenue?: number;
  completedBookings?: number;
  availableSlots?: number;
  occupiedSlots?: number;
  reservedSlots?: number;
  maintenanceSlots?: number;
  totalDrivers?: number;
};

type RegisteredUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt?: string;
};

// ── Skeleton ─────────────────────────────────────────────────────────────────
const SkeletonRow = () => (
  <tr className="border-b border-[#1a1a1a] animate-pulse">
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <td key={i} className="py-3 px-4">
        <div className="h-3 bg-[#1f1f1f] rounded w-3/4" />
      </td>
    ))}
  </tr>
);

const StatSkeleton = () => (
  <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-4 animate-pulse">
    <div className="h-5 bg-[#1f1f1f] rounded w-1/2 mb-3" />
    <div className="h-8 bg-[#1f1f1f] rounded w-2/3 mb-1" />
    <div className="h-3 bg-[#1f1f1f] rounded w-1/3" />
  </div>
);

// ── Page ──────────────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const router = useRouter();
  const { isAuthenticated, user, logout, isLoading: isAuthLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  // Live data from the backend API & registered users
  const [evStats, setEvStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<RegisteredUser[]>([]);
  const [allBookings, setAllBookings] = useState<any[]>([]);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  // Auth guard — only admins
  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) router.replace("/");
    if (!isAuthLoading && isAuthenticated && user?.role !== "admin") router.replace("/dashboard");
  }, [isAuthLoading, isAuthenticated, user, router]);

  // Fetch EV station stats from backend
  useEffect(() => {
    const fetchStats = async () => {
      setIsLoadingStats(true);
      try {
        const res = await fetch("/api/summary");
        if (res.ok) {
          const data = await res.json();
          setEvStats(data);
        } else {
          setEvStats({
            totalUsers: 0,
            totalStations: 0,
            totalOwners: 0,
            totalBookings: 0,
            activeBookings: 0,
            totalRevenue: 0,
          });
        }
      } catch {
        setEvStats({ totalUsers: 0, totalStations: 0, totalOwners: 0, totalBookings: 0, activeBookings: 0, totalRevenue: 0 });
      } finally {
        setIsLoadingStats(false);
      }
    };
    fetchStats();
  }, []);

  // Fetch registered users via auth status (in-memory store)
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoadingUsers(true);
      try {
        const res = await fetch("/api/admin/users");
        if (res.ok) {
          const data = await res.json();
          setUsers(data.users || []);
        } else {
          setUsers([]);
        }
      } catch {
        setUsers([]);
      } finally {
        setIsLoadingUsers(false);
      }
    };
    if (activeTab === "users") fetchUsers();
    if (activeTab === "bookings") {
      setIsLoadingBookings(true);
      fetch("/api/admin/bookings")
        .then((r) => r.json())
        .then((d) => setAllBookings(d.bookings || []))
        .catch(() => setAllBookings([]))
        .finally(() => setIsLoadingBookings(false));
    }
  }, [activeTab]);

  if (isAuthLoading) {
    return (
      <div className="flex h-screen bg-[#0a0a0a] items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "admin") return null;

  const displayName = user?.name || "Admin";
  const avatarLetter = displayName[0]?.toUpperCase() || "A";

  const statCards = [
    { label: "Registered Users", value: isLoadingStats ? null : (evStats?.totalUsers ?? users.length), icon: IconUsers, color: "text-blue-400" },
    { label: "EV Stations", value: isLoadingStats ? null : (evStats?.totalStations ?? 0), icon: IconChargingPile, color: "text-green-400" },
    { label: "Station Owners", value: isLoadingStats ? null : (evStats?.totalOwners ?? users.filter(u => u.role === "owner").length), icon: IconBuildingStore, color: "text-purple-400" },
    { label: "Total Bookings", value: isLoadingStats ? null : (evStats?.totalBookings ?? 0), icon: IconCalendarEvent, color: "text-yellow-400" },
    { label: "Active Bookings", value: isLoadingStats ? null : (evStats?.activeBookings ?? 0), icon: IconFlame, color: "text-orange-400" },
    { label: "Total Revenue", value: isLoadingStats ? null : `₹${evStats?.totalRevenue ?? 0}`, icon: IconCash, color: "text-emerald-400" },
  ];

  const filteredUsers = users.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const tabs = [
    { key: "overview", label: "Overview", icon: IconChartBar },
    { key: "users", label: "Users", icon: IconUsers },
    { key: "stations", label: "Stations", icon: IconChargingPile },
    { key: "owners", label: "Owners", icon: IconBuildingStore },
    { key: "bookings", label: "Bookings", icon: IconCalendarEvent },
    { key: "payments", label: "Payments", icon: IconCreditCard },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-20">
      {/* Fixed Header */}
      <div className="bg-[#111] border-b border-[#1a1a1a] px-6 py-4 fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-red-500 flex items-center justify-center text-white font-bold text-lg">
              {avatarLetter}
            </div>
            <div>
              <h1 className="text-xl font-bold">Admin Dashboard</h1>
              <p className="text-gray-400 text-sm">Logged in as <span className="text-red-400 font-medium">{displayName}</span></p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/")}
              className="px-4 py-2 bg-[#1f1f1f] hover:bg-[#2a2a2a] rounded-lg font-medium transition-colors text-sm"
            >
              ← Exit Admin
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
              <Icon size={16} stroke={1.8} /> {label}
            </button>
          ))}
        </div>

        {/* ── Overview Tab ──────────────────────────────────────────── */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
              {statCards.map((s, i) => (
                isLoadingStats || isLoadingUsers ? (
                  <StatSkeleton key={i} />
                ) : (
                  <div key={i} className="bg-[#111] border border-[#1a1a1a] rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <s.icon size={22} stroke={1.8} />
                    </div>
                    <p className={`text-2xl font-bold mb-1 ${s.color}`}>{s.value}</p>
                    <p className="text-xs text-gray-400">{s.label}</p>
                  </div>
                )
              ))}
            </div>

            {/* Live EV Stations from backend */}
            <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Live EV Station Data</h3>
                <span className="flex items-center gap-1.5 text-xs text-green-400">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse inline-block" />
                  Live via backend API
                </span>
              </div>
              {isLoadingStats ? (
                <div className="animate-pulse space-y-3">
                  {[1, 2, 3].map(i => <div key={i} className="h-8 bg-[#1f1f1f] rounded" />)}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-[#161616] rounded-lg text-center">
                    <p className="text-3xl font-black text-green-400">{evStats?.totalStations ?? 0}</p>
                    <p className="text-sm text-gray-400 mt-1">Stations indexed from backend</p>
                  </div>
                  <div className="p-4 bg-[#161616] rounded-lg text-center">
                    <p className="text-3xl font-black text-blue-400">{evStats?.availableSlots ?? 0}</p>
                    <p className="text-sm text-gray-400 mt-1">Available slots</p>
                  </div>
                  <div className="p-4 bg-[#161616] rounded-lg text-center">
                    <p className="text-3xl font-black text-purple-400">{evStats?.totalRevenue ?? 0}</p>
                    <p className="text-sm text-gray-400 mt-1">Total revenue from bookings</p>
                  </div>
                </div>
              )}
            </div>

            {/* Registered Users quick view */}
            <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Registered Users</h3>
                <button onClick={() => setActiveTab("users")} className="text-green-400 text-sm hover:text-green-300">View All →</button>
              </div>
              {isLoadingUsers ? (
                <div className="animate-pulse space-y-2">
                  {[1, 2, 3].map(i => <div key={i} className="h-10 bg-[#1f1f1f] rounded" />)}
                </div>
              ) : users.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-6">No registered users yet.</p>
              ) : (
                <div className="space-y-2">
                  {users.slice(0, 5).map((u) => (
                    <div key={u.id} className="flex items-center justify-between p-3 bg-[#161616] rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 text-xs font-bold">
                          {u.name[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{u.name}</p>
                          <p className="text-xs text-gray-400">{u.email}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        u.role === "admin" ? "bg-red-500/20 text-red-400" :
                        u.role === "owner" ? "bg-purple-500/20 text-purple-400" :
                        "bg-green-500/20 text-green-400"
                      }`}>
                        {u.role}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Users Tab ─────────────────────────────────────────────── */}
        {activeTab === "users" && (
          <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-5">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">User Management</h3>
              <span className="text-xs text-gray-400">{isLoadingUsers ? "Loading..." : `${filteredUsers.length} users`}</span>
            </div>

            <div className="flex flex-wrap items-center gap-3 mb-5">
              <div className="flex-1 min-w-[200px] relative">
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-[#161616] border border-[#2a2a2a] rounded-lg px-4 py-2 pl-10 text-white placeholder-gray-500 focus:outline-none focus:border-green-500 text-sm"
                />
                <svg className="w-4 h-4 absolute left-3 top-2.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </div>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="bg-[#161616] border border-[#2a2a2a] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-green-500"
              >
                <option value="all">All Roles</option>
                <option value="user">Users</option>
                <option value="owner">Owners</option>
                <option value="admin">Admins</option>
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#1a1a1a] text-left">
                    {["User", "Email", "Role", "Actions"].map((h) => (
                      <th key={h} className="py-3 px-4 font-medium text-gray-400 text-sm">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {isLoadingUsers ? (
                    [1, 2, 3, 4].map(i => <SkeletonRow key={i} />)
                  ) : filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-gray-500 text-sm">
                        {users.length === 0 ? "No registered users yet. Users will appear here once they sign up." : "No users match your search."}
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => (
                      <tr key={u.id} className="border-b border-[#1a1a1a] hover:bg-[#161616] transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 text-xs font-bold">
                              {u.name[0]?.toUpperCase()}
                            </div>
                            <span className="font-medium text-sm">{u.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-300 text-sm">{u.email}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            u.role === "admin" ? "bg-red-500/20 text-red-400" :
                            u.role === "owner" ? "bg-purple-500/20 text-purple-400" :
                            "bg-green-500/20 text-green-400"
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <button className="px-3 py-1 text-xs bg-[#1f1f1f] hover:bg-[#2a2a2a] border border-[#2a2a2a] rounded-lg transition-colors">View</button>
                            <button className="px-3 py-1 text-xs bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-lg transition-colors">Suspend</button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Stations Tab ──────────────────────────────────────────── */}
        {activeTab === "stations" && (
          <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-5">
            <h3 className="text-lg font-bold mb-2">EV Stations</h3>
            <p className="text-sm text-gray-400 mb-5">Station data is served live from the Google Places API via the ev-backend service.</p>
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <IconChargingPile size={48} className="mx-auto mb-4 text-green-400" stroke={1.5} />
              <p className="text-white font-semibold mb-2">Station data is live</p>
              <p className="text-gray-400 text-sm mb-4">All station listings are fetched dynamically from the backend API. View them on the map or Stations page.</p>
              <button
                onClick={() => router.push("/stations")}
                className="px-5 py-2.5 bg-green-500 hover:bg-green-400 text-black font-semibold rounded-lg transition-colors text-sm"
              >
                Open Stations Map →
              </button>
            </div>
          </div>
        )}

        {/* ── Owners Tab ────────────────────────────────────────────── */}
        {activeTab === "owners" && (
          <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-5">
            <h3 className="text-lg font-bold mb-5">Station Owners</h3>
            {isLoadingUsers ? (
              <div className="animate-pulse space-y-3">
                {[1, 2, 3].map(i => <div key={i} className="h-14 bg-[#1f1f1f] rounded-lg" />)}
              </div>
            ) : users.filter(u => u.role === "owner").length === 0 ? (
              <div className="text-center py-16 text-gray-500">
                <IconBuildingStore size={36} className="mx-auto mb-3 text-purple-400" stroke={1.5} />
                <p className="text-sm">No station owners registered yet.</p>
                <p className="text-xs mt-1">Owners will appear here once they register with the "owner" role.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {users.filter(u => u.role === "owner").map((u) => (
                  <div key={u.id} className="flex items-center justify-between p-4 bg-[#161616] rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold">
                        {u.name[0]?.toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{u.name}</p>
                        <p className="text-xs text-gray-400">{u.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 rounded-full text-xs bg-purple-500/20 text-purple-400">Owner</span>
                      <button className="px-3 py-1 text-xs bg-[#1f1f1f] hover:bg-[#2a2a2a] border border-[#2a2a2a] rounded-lg transition-colors">View</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Bookings Tab ──────────────────────────────────────────── */}
        {activeTab === "bookings" && (
          <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-5">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold">All Bookings</h3>
              <span className="text-xs text-gray-400">
                {isLoadingBookings ? "Loading..." : `${allBookings.length} total`}
              </span>
            </div>

            {/* Summary strip */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="bg-[#161616] rounded-xl p-4 text-center">
                <p className="text-2xl font-black text-green-400">
                  {allBookings.filter((b) => b.status === "confirmed").length}
                </p>
                <p className="text-xs text-gray-400 mt-1">Active</p>
              </div>
              <div className="bg-[#161616] rounded-xl p-4 text-center">
                <p className="text-2xl font-black text-blue-400">
                  {allBookings.filter((b) => b.status === "completed").length}
                </p>
                <p className="text-xs text-gray-400 mt-1">Completed</p>
              </div>
              <div className="bg-[#161616] rounded-xl p-4 text-center">
                <p className="text-2xl font-black text-emerald-400">
                  ₹{allBookings.filter((b) => b.status !== "cancelled").reduce((s: number, b: any) => s + (b.amount || 0), 0).toLocaleString()}
                </p>
                <p className="text-xs text-gray-400 mt-1">Revenue</p>
              </div>
            </div>

            {/* Booking rows */}
            {isLoadingBookings ? (
              <div className="animate-pulse space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-14 bg-[#1f1f1f] rounded-lg" />
                ))}
              </div>
            ) : allBookings.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-10">
                No bookings yet. They will appear here once customers make reservations.
              </p>
            ) : (
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
                    {allBookings.map((b: any) => (
                      <tr key={b.id} className="border-b border-[#1a1a1a] hover:bg-[#161616] transition-colors">
                        <td className="py-3 px-3 font-mono text-xs text-gray-300">{b.id}</td>
                        <td className="py-3 px-3">
                          <p className="font-medium text-white truncate max-w-[160px]">{b.stationName}</p>
                          <p className="text-xs text-gray-500 truncate max-w-[160px]">{b.address}</p>
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
            )}
          </div>
        )}

        {/* ── Payments Tab ──────────────────────────────────────────── */}
        {activeTab === "payments" && (
          <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-5">
            <h3 className="text-lg font-bold mb-2">Payments & Revenue</h3>
            <p className="text-sm text-gray-400 mb-5">Revenue now reflects the shared booking store.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#161616] rounded-xl p-5">
                <p className="text-sm text-gray-400 mb-1">Total revenue</p>
                <p className="text-3xl font-black text-emerald-400">₹{evStats?.totalRevenue ?? 0}</p>
              </div>
              <div className="bg-[#161616] rounded-xl p-5">
                <p className="text-sm text-gray-400 mb-1">Completed bookings</p>
                <p className="text-3xl font-black text-blue-400">{evStats?.completedBookings ?? 0}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
