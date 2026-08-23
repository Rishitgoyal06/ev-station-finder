"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";

type Booking = {
  id: string;
  stationName: string;
  address: string;
  date: string;
  time: string;
  connector: string;
  amount: number;
  status: "confirmed" | "completed" | "cancelled";
};

export default function MyBookingsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) router.replace("/");
  }, [isAuthLoading, isAuthenticated, router]);

  useEffect(() => {
    const fetchBookings = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/bookings");
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

    if (isAuthenticated) {
      fetchBookings();
    }
  }, [isAuthenticated]);

  if (isAuthLoading) {
    return (
      <div className="flex h-screen bg-[#0a0a0a] items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  const filtered = bookings.filter((b) => {
    if (activeTab === "upcoming") return b.status === "confirmed";
    if (activeTab === "completed") return b.status === "completed";
    if (activeTab === "cancelled") return b.status === "cancelled";
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "text-green-400 bg-green-500/10 border-green-500/20";
      case "completed": return "text-blue-400 bg-blue-500/10 border-blue-500/20";
      case "cancelled": return "text-red-400 bg-red-500/10 border-red-500/20";
      default: return "text-gray-400 bg-gray-500/10 border-gray-500/20";
    }
  };

  const totalSpent = bookings
    .filter((b) => b.status === "completed")
    .reduce((sum, b) => sum + b.amount, 0);

  const stats = [
    { label: "Total Bookings", value: bookings.length, color: "text-white", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z", iconBg: "bg-blue-500/10", iconColor: "text-blue-400" },
    { label: "Upcoming", value: bookings.filter((b) => b.status === "confirmed").length, color: "text-green-400", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", iconBg: "bg-green-500/10", iconColor: "text-green-400" },
    { label: "Completed", value: bookings.filter((b) => b.status === "completed").length, color: "text-blue-400", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", iconBg: "bg-blue-500/10", iconColor: "text-blue-400" },
    { label: "Total Spent", value: `₹${totalSpent}`, color: "text-white", icon: "M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z", iconBg: "bg-yellow-500/10", iconColor: "text-yellow-400" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-20">
      {/* Header */}
      <div className="bg-[#111] border-b border-[#1a1a1a] px-6 py-4 fixed top-0 left-0 right-0 z-50">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 hover:bg-[#1f1f1f] rounded-xl transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          <div>
            <h1 className="text-xl font-bold">My Bookings</h1>
            <p className="text-sm text-gray-400">Manage your charging reservations</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((s) => (
            <div key={s.label} className="bg-[#111] border border-[#1a1a1a] rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">{s.label}</p>
                  <p className={`text-2xl font-bold ${s.color}`}>{isLoading ? "—" : s.value}</p>
                </div>
                <div className={`w-10 h-10 ${s.iconBg} rounded-lg flex items-center justify-center`}>
                  <svg className={`w-5 h-5 ${s.iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path d={s.icon}/>
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-[#111] border border-[#1a1a1a] rounded-xl p-1">
          {[
            { key: "all", label: "All Bookings" },
            { key: "upcoming", label: "Upcoming" },
            { key: "completed", label: "Completed" },
            { key: "cancelled", label: "Cancelled" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.key ? "bg-green-500 text-black" : "text-gray-400 hover:text-white hover:bg-[#1f1f1f]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-[#111] border border-[#1a1a1a] rounded-xl p-6 animate-pulse">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-[#1f1f1f] rounded-lg flex-shrink-0" />
                  <div className="flex-1 space-y-3">
                    <div className="h-5 bg-[#1f1f1f] rounded w-1/3" />
                    <div className="h-3 bg-[#1f1f1f] rounded w-1/2" />
                    <div className="grid grid-cols-4 gap-4 mt-4">
                      {[1,2,3,4].map(i => <div key={i} className="h-8 bg-[#1f1f1f] rounded" />)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-[#111] rounded-full flex items-center justify-center mx-auto mb-5">
              <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No Bookings Yet</h3>
            <p className="text-gray-400 text-sm mb-6">
              {activeTab === "all"
                ? "You haven't made any bookings. Find a nearby station and charge up!"
                : `No ${activeTab} bookings found.`}
            </p>
            <button
              onClick={() => router.push("/stations")}
              className="bg-green-500 hover:bg-green-400 text-black px-6 py-3 rounded-xl font-semibold transition-colors"
            >
              Find Stations
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((booking) => (
              <div key={booking.id} className="bg-[#111] border border-[#1a1a1a] rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-[#1f1f1f] rounded-lg flex-shrink-0 flex items-center justify-center">
                    <svg className="w-7 h-7 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M13 2L4.5 13.5H11L10 22L19.5 10.5H13L13 2Z"/>
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-1">{booking.stationName}</h3>
                        <p className="text-sm text-gray-400">{booking.address}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                      <div><p className="text-xs text-gray-500 mb-1">Booking ID</p><p className="text-sm font-medium">{booking.id}</p></div>
                      <div><p className="text-xs text-gray-500 mb-1">Date & Time</p><p className="text-sm font-medium">{booking.date}</p><p className="text-xs text-gray-400">{booking.time}</p></div>
                      <div><p className="text-xs text-gray-500 mb-1">Connector</p><p className="text-sm font-medium">{booking.connector}</p></div>
                      <div><p className="text-xs text-gray-500 mb-1">Amount</p><p className="text-sm font-bold text-green-400">₹{booking.amount}</p></div>
                    </div>
                    <div className="flex items-center gap-3 mt-4 pt-4 border-t border-[#1a1a1a]">
                      <button className="flex items-center gap-2 px-4 py-2 bg-[#1f1f1f] hover:bg-[#2a2a2a] border border-[#2a2a2a] rounded-lg text-sm font-medium transition-colors">
                        View Details
                      </button>
                      {booking.status === "confirmed" && (
                        <button className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-lg text-sm font-medium transition-colors">
                          Cancel Booking
                        </button>
                      )}
                      {booking.status === "completed" && (
                        <button className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-400 rounded-lg text-sm font-medium transition-colors">
                          Write Review
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
