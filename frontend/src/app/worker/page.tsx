"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";

type Booking = {
  id: string;
  stationName: string;
  slotNumber: string;
  time: string;
  amount: number;
  status: "confirmed" | "completed" | "cancelled";
  vehicleInfo?: string;
};

export default function WorkerDashboard() {
  const router = useRouter();
  const { isAuthenticated, user, isLoading: isAuthLoading } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedStation, setSelectedStation] = useState("1");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [slotStatuses, setSlotStatuses] = useState<Record<string, string>>({
    A1: "available",
    A2: "occupied",
    A3: "available",
    A4: "maintenance",
    B1: "occupied",
    B2: "available",
    B3: "reserved",
    B4: "available",
  });

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) router.replace("/login");
  }, [isAuthLoading, isAuthenticated, router]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/bookings");
        if (res.ok) {
          const data = await res.json();
          setBookings(data.bookings || []);
        }
      } catch {
        setBookings([]);
      }
    };

    if (isAuthenticated) load();
  }, [isAuthenticated]);

  const workerData = {
    name: user?.name || "Suresh Kumar",
    id: "WK001",
    shift: "Morning (6 AM - 2 PM)",
    station: "GreenCharge Whitefield",
  };

  const assignedStations = [
    { id: "1", name: "GreenCharge Whitefield", address: "ITPL Main Road", slots: 8 },
    { id: "2", name: "GreenCharge HSR", address: "Sector 2, HSR Layout", slots: 12 },
  ];

  const slotData = [
    { id: "A1", user: null, timeLeft: null },
    { id: "A2", user: "Rajesh K.", timeLeft: "25 min" },
    { id: "A3", user: null, timeLeft: null },
    { id: "A4", user: null, timeLeft: null },
    { id: "B1", user: "Priya S.", timeLeft: "12 min" },
    { id: "B2", user: null, timeLeft: null },
    { id: "B3", user: "Amit P.", timeLeft: "Starts in 15 min" },
    { id: "B4", user: null, timeLeft: null },
  ];

  const upcomingBookings = useMemo(
    () =>
      bookings
        .filter((booking) => booking.status === "confirmed")
        .slice(0, 3)
        .map((booking) => ({
          id: booking.id,
          customer: booking.vehicleInfo || booking.stationName,
          slot: booking.slotNumber,
          time: booking.time,
          phone: "+91 98765 43213",
        })),
    [bookings]
  );

  const quickUpdateSlot = async (slotId: string, newStatus: string) => {
    setSlotStatuses((prev) => ({ ...prev, [slotId]: newStatus }));
    try {
      await fetch(`/api/slots/${slotId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch {
      // optimistic UI only; backend sync can fail without blocking the operator
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available": return "bg-green-500";
      case "occupied": return "bg-yellow-500";
      case "maintenance": return "bg-red-500";
      case "reserved": return "bg-blue-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "available": return "✓";
      case "occupied": return "⚡";
      case "maintenance": return "🔧";
      case "reserved": return "🕒";
      default: return "?";
    }
  };

  if (isAuthLoading) {
    return <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full" /></div>;
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-20 pb-20">
      <div className="p-4 space-y-6">
        <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-black font-bold text-lg">
                {workerData.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div>
                <h1 className="font-bold text-xl">Hi, {workerData.name.split(" ")[0]}! 👋</h1>
                <p className="text-sm text-gray-400">{workerData.shift}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-green-400">{currentTime.toLocaleTimeString("en-US", { hour12: true })}</p>
              <p className="text-sm text-gray-400">{currentTime.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</p>
            </div>
          </div>
        </div>

        <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-4">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-3">Assigned Stations</h3>
          <div className="grid grid-cols-1 gap-3">
            {assignedStations.map((station) => (
              <button
                key={station.id}
                onClick={() => setSelectedStation(station.id)}
                className={`p-3 rounded-lg text-left transition-all ${
                  selectedStation === station.id
                    ? "bg-green-500/20 border border-green-500/40"
                    : "bg-[#161616] border border-[#2a2a2a] hover:border-[#3a3a3a]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`font-medium ${selectedStation === station.id ? "text-green-400" : "text-white"}`}>{station.name}</p>
                    <p className="text-xs text-gray-400">{station.address}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${selectedStation === station.id ? "text-green-400" : "text-white"}`}>{station.slots} slots</p>
                    {selectedStation === station.id && <div className="w-2 h-2 bg-green-400 rounded-full mt-1" />}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "Available", value: Object.values(slotStatuses).filter((s) => s === "available").length, color: "text-green-400", bg: "bg-green-500/20" },
            { label: "Occupied", value: Object.values(slotStatuses).filter((s) => s === "occupied").length, color: "text-yellow-400", bg: "bg-yellow-500/20" },
            { label: "Reserved", value: Object.values(slotStatuses).filter((s) => s === "reserved").length, color: "text-blue-400", bg: "bg-blue-500/20" },
            { label: "Maintenance", value: Object.values(slotStatuses).filter((s) => s === "maintenance").length, color: "text-red-400", bg: "bg-red-500/20" },
          ].map((stat, index) => (
            <div key={index} className={`${stat.bg} border border-current/30 rounded-xl p-3 ${stat.color}`}>
              <p className="text-xl font-bold">{stat.value}</p>
              <p className="text-xs opacity-80">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-4">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-4">Slot Management</h3>
          <div className="grid grid-cols-2 gap-4">
            {slotData.map((slot) => {
              const currentStatus = slotStatuses[slot.id];
              return (
                <div key={slot.id} id={`slot-${slot.id}`} className="bg-[#161616] border border-[#2a2a2a] rounded-xl p-4 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(currentStatus)}`} />
                      <span className="font-bold">Slot {slot.id}</span>
                    </div>
                    <span className="text-xl">{getStatusIcon(currentStatus)}</span>
                  </div>

                  {currentStatus === "occupied" || currentStatus === "reserved" ? (
                    <div className="mb-3">
                      <p className="text-xs text-gray-400">User:</p>
                      <p className="text-sm font-medium text-green-400">{slot.user}</p>
                      <p className="text-xs text-yellow-400">{slot.timeLeft}</p>
                    </div>
                  ) : (
                    <div className="mb-3 h-12" />
                  )}

                  <div className="grid grid-cols-2 gap-2">
                    {currentStatus === "available" ? (
                      <>
                        <button onClick={() => quickUpdateSlot(slot.id, "occupied")} className="px-3 py-2 bg-yellow-500 hover:bg-yellow-400 text-black text-xs font-bold rounded-lg transition-all active:scale-95">Mark Busy</button>
                        <button onClick={() => quickUpdateSlot(slot.id, "maintenance")} className="px-3 py-2 bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold rounded-lg transition-all active:scale-95">Maintenance</button>
                      </>
                    ) : currentStatus === "occupied" ? (
                      <>
                        <button onClick={() => quickUpdateSlot(slot.id, "available")} className="px-3 py-2 bg-green-500 hover:bg-green-400 text-black text-xs font-bold rounded-lg transition-all active:scale-95">Free Up</button>
                        <button className="px-3 py-2 bg-[#1f1f1f] text-gray-400 text-xs font-bold rounded-lg">Extend Time</button>
                      </>
                    ) : currentStatus === "maintenance" ? (
                      <button onClick={() => quickUpdateSlot(slot.id, "available")} className="col-span-2 px-3 py-2 bg-green-500 hover:bg-green-400 text-black text-xs font-bold rounded-lg transition-all active:scale-95">Mark Fixed</button>
                    ) : (
                      <div className="col-span-2 px-3 py-2 bg-blue-500/20 text-blue-400 text-xs font-bold rounded-lg text-center">Reserved</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-4">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-4">Upcoming Arrivals</h3>
          <div className="space-y-3">
            {upcomingBookings.length === 0 ? (
              <p className="text-sm text-gray-500">No upcoming bookings yet.</p>
            ) : (
              upcomingBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-3 bg-[#161616] rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 text-xs font-bold">
                      {booking.customer.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{booking.customer}</p>
                      <p className="text-xs text-gray-400">Slot {booking.slot} • {booking.time}</p>
                    </div>
                  </div>
                  <button onClick={() => window.open(`tel:${booking.phone}`)} className="p-2 bg-green-500/20 text-green-400 rounded-lg">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                    </svg>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
