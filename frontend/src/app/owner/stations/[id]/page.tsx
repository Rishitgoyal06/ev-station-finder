"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/components/AuthContext";

const stationTemplates: Record<string, any> = {
  "1": {
    name: "GreenCharge Whitefield",
    address: "ITPL Main Road, Whitefield, Bengaluru",
    totalSlots: 8,
    connectorTypes: ["CCS2", "Type 2", "CHAdeMO"],
    amenities: ["Wi-Fi", "Restroom", "Café", "CCTV"],
    operatingHours: "24/7",
    pricePerKwh: 18,
  },
  "2": {
    name: "GreenCharge HSR Layout",
    address: "Sector 2, HSR Layout, Bengaluru",
    totalSlots: 12,
    connectorTypes: ["CCS2", "Type 2"],
    amenities: ["Wi-Fi", "Restroom", "CCTV"],
    operatingHours: "24/7",
    pricePerKwh: 20,
  },
  "3": {
    name: "GreenCharge Koramangala",
    address: "5th Block, Koramangala, Bengaluru",
    totalSlots: 6,
    connectorTypes: ["CCS2", "Type 2"],
    amenities: ["Wi-Fi", "Café"],
    operatingHours: "24/7",
    pricePerKwh: 22,
  },
};

const defaultSlots = [
  { id: "A1", connectorType: "CCS2", power: "150kW", status: "available", currentUser: null, timeRemaining: null },
  { id: "A2", connectorType: "CCS2", power: "150kW", status: "occupied", currentUser: "Rajesh Kumar", timeRemaining: "25 min" },
  { id: "A3", connectorType: "Type 2", power: "22kW", status: "available", currentUser: null, timeRemaining: null },
  { id: "A4", connectorType: "CCS2", power: "150kW", status: "maintenance", currentUser: null, timeRemaining: null },
  { id: "B1", connectorType: "Type 2", power: "22kW", status: "occupied", currentUser: "Priya Sharma", timeRemaining: "12 min" },
  { id: "B2", connectorType: "CHAdeMO", power: "50kW", status: "available", currentUser: null, timeRemaining: null },
  { id: "B3", connectorType: "CCS2", power: "150kW", status: "reserved", currentUser: "Amit Patel", timeRemaining: "Starting in 15 min" },
  { id: "B4", connectorType: "Type 2", power: "22kW", status: "available", currentUser: null, timeRemaining: null },
];

type Booking = {
  id: string;
  stationName: string;
  address: string;
  date: string;
  time: string;
  connector: string;
  amount: number;
  status: "confirmed" | "completed" | "cancelled";
  slotNumber: string;
  vehicleInfo?: string;
};

export default function StationManagement() {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const stationId = String(params?.id ?? "1");
  const template = stationTemplates[stationId] ?? stationTemplates["1"];

  const [activeTab, setActiveTab] = useState("slots");
  const [slotStatuses, setSlotStatuses] = useState<Record<string, string>>({});
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) router.replace("/");
  }, [isAuthLoading, isAuthenticated, router]);

  useEffect(() => {
    const initialStatuses: Record<string, string> = {};
    defaultSlots.forEach((slot) => {
      initialStatuses[slot.id] = slot.status;
    });
    setSlotStatuses(initialStatuses);
  }, []);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/admin/bookings");
        if (res.ok) {
          const data = await res.json();
          setBookings((data.bookings || []) as Booking[]);
        } else {
          setBookings([]);
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) load();
  }, [isAuthenticated]);

  const slotData = useMemo(() => defaultSlots, []);

  const todayBookings = bookings.length
    ? bookings
        .filter((booking) => booking.stationName.toLowerCase().includes(template.name.toLowerCase().split(" ")[0].toLowerCase()) || booking.stationName.toLowerCase().includes("greencharge"))
        .slice(0, 8)
    : [
        { id: "BK001", customer: "Rajesh Kumar", slot: "A2", time: "10:30 AM - 11:30 AM", status: "active", amount: 420 },
      ] as any[];

  const workers = [
    { id: 1, name: "Suresh Kumar", phone: "+91 98765 43210", shift: "Morning (6 AM - 2 PM)", status: "online", lastSeen: "Active now" },
    { id: 2, name: "Ramesh Patel", phone: "+91 98765 43211", shift: "Evening (2 PM - 10 PM)", status: "online", lastSeen: "Active now" },
    { id: 3, name: "Mahesh Singh", phone: "+91 98765 43212", shift: "Night (10 PM - 6 AM)", status: "offline", lastSeen: "2 hours ago" },
  ];

  const updateSlotStatus = async (slotId: string, newStatus: string) => {
    setSlotStatuses((prev) => ({ ...prev, [slotId]: newStatus }));
    try {
      await fetch(`/api/slots/${slotId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch {
      // keep optimistic UI state even if the request fails
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

  if (isAuthLoading || isLoading) {
    return <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full" /></div>;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-20 pb-20">
      <div className="bg-[#111] border-b border-[#1a1a1a] px-6 py-4 fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="p-2 hover:bg-[#1f1f1f] rounded-lg transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </button>
            <div>
              <h1 className="text-xl font-bold">{template.name}</h1>
              <p className="text-gray-400 text-sm">{template.address}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              Live Monitoring
            </div>
            <button
              onClick={() => router.push("/admin/settings")}
              className="px-4 py-2 bg-[#1f1f1f] hover:bg-[#2a2a2a] rounded-lg font-medium transition-colors">
              Settings
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Available Slots", value: slotData.filter((s) => slotStatuses[s.id] === "available").length, icon: "✓", color: "text-green-400" },
            { label: "Occupied Slots", value: slotData.filter((s) => slotStatuses[s.id] === "occupied").length, icon: "⚡", color: "text-yellow-400" },
            { label: "Maintenance", value: slotData.filter((s) => slotStatuses[s.id] === "maintenance").length, icon: "🔧", color: "text-red-400" },
            { label: "Reserved", value: slotData.filter((s) => slotStatuses[s.id] === "reserved").length, icon: "🕒", color: "text-blue-400" },
          ].map((stat, index) => (
            <div key={index} className="bg-[#111] border border-[#1a1a1a] rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{stat.icon}</span>
                <span className={`text-2xl font-bold ${stat.color}`}>{stat.value}</span>
              </div>
              <p className="text-sm text-gray-400">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 mb-6 overflow-x-auto">
          {[
            { id: "slots", label: "Slot Management", icon: "🔌" },
            { id: "bookings", label: "Today's Bookings", icon: "📅" },
            { id: "workers", label: "Workers", icon: "👷" },
            { id: "analytics", label: "Analytics", icon: "📊" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id ? "bg-green-500 text-black" : "text-gray-400 hover:text-white hover:bg-[#1f1f1f]"
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "slots" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {slotData.map((slot) => {
              const currentStatus = slotStatuses[slot.id] || slot.status;
              return (
                <div key={slot.id} className="bg-[#111] border border-[#1a1a1a] rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(currentStatus)}`} />
                      <span className="font-bold text-lg">Slot {slot.id}</span>
                    </div>
                    <span className="text-xl">{getStatusIcon(currentStatus)}</span>
                  </div>
                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex justify-between"><span className="text-gray-400">Type:</span><span className="text-white">{slot.connectorType}</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Power:</span><span className="text-white">{slot.power}</span></div>
                  </div>
                  <select
                    value={currentStatus}
                    onChange={(e) => updateSlotStatus(slot.id, e.target.value)}
                    className="w-full bg-[#161616] border border-[#2a2a2a] rounded-lg px-2 py-1 text-xs text-white"
                    style={{ colorScheme: "dark" }}
                  >
                    <option value="available">Available</option>
                    <option value="occupied">Occupied</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="reserved">Reserved</option>
                  </select>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === "bookings" && (
          <div className="bg-[#111] border border-[#1a1a1a] rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#1a1a1a]">
                    <th className="text-left py-4 px-6 font-medium text-gray-400">Booking ID</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-400">Customer</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-400">Slot</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-400">Time</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-400">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {todayBookings.map((booking: any) => (
                    <tr key={booking.id} className="border-b border-[#1a1a1a] hover:bg-[#161616]">
                      <td className="py-4 px-6 font-mono text-sm text-green-400">{booking.id}</td>
                      <td className="py-4 px-6 text-sm text-white">{booking.customer || booking.vehicleInfo || booking.stationName}</td>
                      <td className="py-4 px-6 text-sm text-gray-300">{booking.slot || booking.slotNumber}</td>
                      <td className="py-4 px-6 text-sm text-gray-300">{booking.time}</td>
                      <td className="py-4 px-6 font-medium text-green-400">₹{booking.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "workers" && (
          <div className="space-y-3">
            {workers.map((worker) => (
              <div key={worker.id} className="bg-[#111] border border-[#1a1a1a] rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="font-semibold">{worker.name}</p>
                  <p className="text-sm text-gray-400">{worker.shift}</p>
                </div>
                <span className="text-sm text-green-400">{worker.status}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-5">
            <h3 className="text-lg font-bold mb-2">Analytics</h3>
            <p className="text-sm text-gray-400 mb-5">Live station analytics will grow as bookings come in.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#161616] rounded-xl p-5">
                <p className="text-sm text-gray-400 mb-1">Total bookings</p>
                <p className="text-3xl font-black text-green-400">{bookings.length}</p>
              </div>
              <div className="bg-[#161616] rounded-xl p-5">
                <p className="text-sm text-gray-400 mb-1">Station status</p>
                <p className="text-3xl font-black text-blue-400">{template.operatingHours}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
