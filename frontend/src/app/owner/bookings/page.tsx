"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";

type Booking = {
  id: string;
  userId: string;
  stationName: string;
  address: string;
  date: string;
  time: string;
  connector: string;
  amount: number;
  status: "confirmed" | "completed" | "cancelled";
  slotNumber: string;
  vehicleInfo?: string;
  paymentMethod?: string;
  bookedAt?: string;
};

const STATUS_STYLE: Record<string, string> = {
  confirmed: "bg-green-500/10 text-green-400 border-green-500/20",
  completed: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  cancelled: "bg-red-500/10 text-red-400 border-red-500/20",
};

export default function OwnerBookingsPage() {
  const router = useRouter();
  const { isAuthenticated, user, isLoading: isAuthLoading } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Role guard — owner or admin only
  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) router.replace("/");
    if (!isAuthLoading && isAuthenticated && user?.role !== "owner" && user?.role !== "admin") {
      router.replace("/dashboard");
    }
  }, [isAuthLoading, isAuthenticated, user, router]);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        // Use the privileged admin/bookings endpoint — returns ALL bookings
        const res = await fetch("/api/admin/bookings");
        if (res.ok) {
          const data = await res.json();
          setBookings(data.bookings || []);
        } else {
          setBookings([]);
        }
      } finally {
        setIsLoading(false);
      }
    };
    if (isAuthenticated) load();
  }, [isAuthenticated]);

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  const filtered = bookings.filter((b) => {
    const matchSearch =
      b.stationName.toLowerCase().includes(search.toLowerCase()) ||
      b.id.toLowerCase().includes(search.toLowerCase()) ||
      (b.vehicleInfo || "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || b.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: bookings.length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    completed: bookings.filter((b) => b.status === "completed").length,
    revenue: bookings
      .filter((b) => b.status !== "cancelled")
      .reduce((s, b) => s + b.amount, 0),
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-20">
      {/* Header */}
      <div className="bg-[#111] border-b border-[#1a1a1a] px-6 py-4 fixed top-0 left-0 right-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="p-2 hover:bg-[#1f1f1f] rounded-xl transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-xl font-bold">All Bookings</h1>
              <p className="text-sm text-gray-400">Manage customer bookings across all stations</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Live
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Bookings", value: stats.total, color: "text-white" },
            { label: "Active", value: stats.confirmed, color: "text-green-400" },
            { label: "Completed", value: stats.completed, color: "text-blue-400" },
            { label: "Revenue", value: `₹${stats.revenue.toLocaleString()}`, color: "text-emerald-400" },
          ].map((s) => (
            <div key={s.label} className="bg-[#111] border border-[#1a1a1a] rounded-xl p-4">
              <p className="text-xs text-gray-400 mb-1">{s.label}</p>
              <p className={`text-2xl font-bold ${s.color}`}>{isLoading ? "—" : s.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-[200px] relative">
            <input
              type="text"
              placeholder="Search by station, booking ID or vehicle..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#111] border border-[#2a2a2a] rounded-lg px-4 py-2 pl-10 text-white placeholder-gray-500 focus:outline-none focus:border-green-500 text-sm"
            />
            <svg className="w-4 h-4 absolute left-3 top-2.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#111] border border-[#2a2a2a] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-green-500"
          >
            <option value="all">All Statuses</option>
            <option value="confirmed">Active</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Bookings List */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-[#111] border border-[#1a1a1a] rounded-xl p-5 animate-pulse">
                <div className="flex gap-4">
                  <div className="w-16 h-16 bg-[#1f1f1f] rounded-lg shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-[#1f1f1f] rounded w-1/3" />
                    <div className="h-3 bg-[#1f1f1f] rounded w-1/2" />
                    <div className="h-3 bg-[#1f1f1f] rounded w-1/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-[#111] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No Bookings Found</h3>
            <p className="text-gray-400 text-sm">
              {bookings.length === 0
                ? "No customer bookings yet. They will appear here once customers start reserving slots."
                : "No bookings match your filter."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filtered.map((booking) => (
              <div key={booking.id} className="bg-[#111] border border-[#1a1a1a] rounded-xl p-5 hover:border-green-500/20 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-white">{booking.stationName}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">{booking.address}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full border font-medium ${STATUS_STYLE[booking.status] ?? "bg-gray-500/10 text-gray-400 border-gray-500/20"}`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <p className="text-gray-500">Booking ID <span className="text-white font-mono block">{booking.id}</span></p>
                  <p className="text-gray-500">Slot <span className="text-white block">{booking.slotNumber}</span></p>
                  <p className="text-gray-500">Date & Time <span className="text-white block">{booking.date} {booking.time}</span></p>
                  <p className="text-gray-500">Amount <span className="text-green-400 font-bold block">₹{booking.amount}</span></p>
                  {booking.vehicleInfo && (
                    <p className="text-gray-500 col-span-2">Vehicle <span className="text-white">{booking.vehicleInfo}</span></p>
                  )}
                  {booking.paymentMethod && (
                    <p className="text-gray-500">Payment <span className="text-white">{booking.paymentMethod}</span></p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
