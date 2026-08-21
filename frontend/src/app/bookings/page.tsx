"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const mockBookings = [
  {
    id: "BK001",
    stationName: "GreenCharge Hub",
    address: "MG Road, Bengaluru, Karnataka",
    date: "2026-08-15",
    time: "5:30 PM - 6:15 PM",
    connector: "CCS2",
    amount: 245,
    status: "confirmed",
    image: "/WhatsApp Image 2026-03-30 at 11.48.19 PM.jpeg"
  },
  {
    id: "BK002", 
    stationName: "VoltSpark Center",
    address: "Whitefield, Bengaluru, Karnataka",
    date: "2026-08-12",
    time: "2:00 PM - 2:45 PM", 
    connector: "Type 2",
    amount: 180,
    status: "completed",
    image: "/WhatsApp Image 2026-03-31 at 8.25.52 PM.jpeg"
  },
  {
    id: "BK003",
    stationName: "ChargeIQ Station",
    address: "Electronic City, Bengaluru, Karnataka", 
    date: "2026-08-10",
    time: "11:30 AM - 12:15 PM",
    connector: "CCS2", 
    amount: 220,
    status: "cancelled",
    image: "/WhatsApp Image 2026-03-31 at 9.25.26 PM (1).jpeg"
  }
];

export default function MyBookingsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const router = useRouter();

  const filteredBookings = mockBookings.filter(booking => {
    if (activeTab === "all") return true;
    if (activeTab === "upcoming") return booking.status === "confirmed";
    if (activeTab === "completed") return booking.status === "completed"; 
    if (activeTab === "cancelled") return booking.status === "cancelled";
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
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Bookings</p>
                <p className="text-2xl font-bold text-white">3</p>
              </div>
              <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Upcoming</p>
                <p className="text-2xl font-bold text-green-400">1</p>
              </div>
              <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/>
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Completed</p>
                <p className="text-2xl font-bold text-blue-400">1</p>
              </div>
              <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22,4 12,14.01 9,11.01"/>
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Spent</p>
                <p className="text-2xl font-bold text-white">₹645</p>
              </div>
              <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 bg-[#111] border border-[#1a1a1a] rounded-xl p-1">
          {[
            { key: "all", label: "All Bookings" },
            { key: "upcoming", label: "Upcoming" }, 
            { key: "completed", label: "Completed" },
            { key: "cancelled", label: "Cancelled" }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? "bg-green-500 text-black"
                  : "text-gray-400 hover:text-white hover:bg-[#1f1f1f]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Bookings List */}
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <div key={booking.id} className="bg-[#111] border border-[#1a1a1a] rounded-xl p-6">
              <div className="flex items-start gap-4">
                {/* Station Image */}
                <div className="w-16 h-16 bg-[#1f1f1f] rounded-lg overflow-hidden flex-shrink-0">
                  <img src={booking.image} alt={booking.stationName} className="w-full h-full object-cover"/>
                </div>

                {/* Booking Details */}
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
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Booking ID</p>
                      <p className="text-sm font-medium text-white">{booking.id}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Date & Time</p>
                      <p className="text-sm font-medium text-white">{booking.date}</p>
                      <p className="text-xs text-gray-400">{booking.time}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Connector</p>
                      <p className="text-sm font-medium text-white">{booking.connector}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Amount</p>
                      <p className="text-sm font-bold text-green-400">₹{booking.amount}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 mt-4 pt-4 border-t border-[#1a1a1a]">
                    <button onClick={() => router.push(`/bookings/${booking.id}`)} className="flex items-center gap-2 px-4 py-2 bg-[#1f1f1f] hover:bg-[#2a2a2a] border border-[#2a2a2a] rounded-lg text-sm font-medium transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                      </svg>
                      View Details
                    </button>
                    
                    {booking.status === "confirmed" && (
                      <button className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-lg text-sm font-medium transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <circle cx="12" cy="12" r="9"/><path d="M15 9l-6 6M9 9l6 6"/>
                        </svg>
                        Cancel Booking
                      </button>
                    )}

                    {booking.status === "completed" && (
                      <button className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-400 rounded-lg text-sm font-medium transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                        </svg>
                        Write Review
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredBookings.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-[#111] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No Bookings Found</h3>
            <p className="text-gray-400 mb-6">You don't have any bookings in this category yet.</p>
            <button onClick={() => router.push('/stations')} className="bg-green-500 hover:bg-green-400 text-black px-6 py-3 rounded-xl font-semibold transition-colors">
              Find Stations
            </button>
          </div>
        )}
      </div>
    </div>
  );
}