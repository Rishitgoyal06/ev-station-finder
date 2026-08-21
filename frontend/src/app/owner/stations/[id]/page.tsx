"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function StationManagement() {
  const router = useRouter();
  const params = useParams();
  const stationId = params?.id;
  
  const [activeTab, setActiveTab] = useState("slots");
  const [slotStatuses, setSlotStatuses] = useState<Record<string, string>>({});

  const stationData = {
    id: stationId,
    name: "GreenCharge Whitefield",
    address: "ITPL Main Road, Whitefield, Bengaluru",
    totalSlots: 8,
    connectorTypes: ["CCS2", "Type 2", "CHAdeMO"],
    amenities: ["Wi-Fi", "Restroom", "Café", "CCTV"],
    operatingHours: "24/7",
    pricePerKwh: 18,
    status: "active"
  };

  const slotData = [
    { id: "A1", connectorType: "CCS2", power: "150kW", status: "available", currentUser: null, timeRemaining: null },
    { id: "A2", connectorType: "CCS2", power: "150kW", status: "occupied", currentUser: "Rajesh Kumar", timeRemaining: "25 min" },
    { id: "A3", connectorType: "Type 2", power: "22kW", status: "available", currentUser: null, timeRemaining: null },
    { id: "A4", connectorType: "CCS2", power: "150kW", status: "maintenance", currentUser: null, timeRemaining: null },
    { id: "B1", connectorType: "Type 2", power: "22kW", status: "occupied", currentUser: "Priya Sharma", timeRemaining: "12 min" },
    { id: "B2", connectorType: "CHAdeMO", power: "50kW", status: "available", currentUser: null, timeRemaining: null },
    { id: "B3", connectorType: "CCS2", power: "150kW", status: "reserved", currentUser: "Amit Patel", timeRemaining: "Starting in 15 min" },
    { id: "B4", connectorType: "Type 2", power: "22kW", status: "available", currentUser: null, timeRemaining: null },
  ];

  const todayBookings = [
    { id: "BK001", customer: "Rajesh Kumar", slot: "A2", time: "10:30 AM - 11:30 AM", status: "active", amount: 420 },
    { id: "BK002", customer: "Priya Sharma", slot: "B1", time: "11:45 AM - 12:45 PM", status: "active", amount: 380 },
    { id: "BK003", customer: "Amit Patel", slot: "B3", time: "2:15 PM - 3:15 PM", status: "upcoming", amount: 450 },
    { id: "BK004", customer: "Sneha Reddy", slot: "A1", time: "3:30 PM - 4:30 PM", status: "upcoming", amount: 390 },
    { id: "BK005", customer: "Vikram Singh", slot: "B2", time: "5:00 PM - 6:00 PM", status: "upcoming", amount: 420 },
  ];

  const workers = [
    { id: 1, name: "Suresh Kumar", phone: "+91 98765 43210", shift: "Morning (6 AM - 2 PM)", status: "online", lastSeen: "Active now" },
    { id: 2, name: "Ramesh Patel", phone: "+91 98765 43211", shift: "Evening (2 PM - 10 PM)", status: "online", lastSeen: "Active now" },
    { id: 3, name: "Mahesh Singh", phone: "+91 98765 43212", shift: "Night (10 PM - 6 AM)", status: "offline", lastSeen: "2 hours ago" },
  ];

  useEffect(() => {
    // Initialize slot statuses
    const initialStatuses: Record<string, string> = {};
    slotData.forEach(slot => {
      initialStatuses[slot.id] = slot.status;
    });
    setSlotStatuses(initialStatuses);
  }, []);

  const updateSlotStatus = (slotId: string, newStatus: string) => {
    setSlotStatuses(prev => ({
      ...prev,
      [slotId]: newStatus
    }));
    // Here you would make an API call to update the status
    console.log(`Updating slot ${slotId} to ${newStatus}`);
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

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-20">
      {/* Header */}
      <div className="bg-[#111] border-b border-[#1a1a1a] px-6 py-4 fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.back()}
              className="p-2 hover:bg-[#1f1f1f] rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </button>
            <div>
              <h1 className="text-xl font-bold">{stationData.name}</h1>
              <p className="text-gray-400 text-sm">{stationData.address}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              Live Monitoring
            </div>
            <button className="px-4 py-2 bg-[#1f1f1f] hover:bg-[#2a2a2a] rounded-lg font-medium transition-colors">
              Settings
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Available Slots", value: slotData.filter(s => slotStatuses[s.id] === "available").length, icon: "✓", color: "text-green-400" },
            { label: "Occupied Slots", value: slotData.filter(s => slotStatuses[s.id] === "occupied").length, icon: "⚡", color: "text-yellow-400" },
            { label: "Maintenance", value: slotData.filter(s => slotStatuses[s.id] === "maintenance").length, icon: "🔧", color: "text-red-400" },
            { label: "Reserved", value: slotData.filter(s => slotStatuses[s.id] === "reserved").length, icon: "🕒", color: "text-blue-400" },
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

        {/* Navigation Tabs */}
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
                activeTab === tab.id
                  ? "bg-green-500 text-black"
                  : "text-gray-400 hover:text-white hover:bg-[#1f1f1f]"
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "slots" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold">Real-Time Slot Management</h3>
              <div className="flex items-center gap-3">
                <button className="px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-colors">
                  Emergency Stop All
                </button>
                <button className="px-4 py-2 bg-green-500 text-black rounded-lg hover:bg-green-400 transition-colors">
                  Bulk Update
                </button>
              </div>
            </div>

            {/* Slot Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {slotData.map((slot) => {
                const currentStatus = slotStatuses[slot.id] || slot.status;
                return (
                  <div key={slot.id} className="bg-[#111] border border-[#1a1a1a] rounded-xl p-4 hover:border-green-500/30 transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(currentStatus)}`}></div>
                        <span className="font-bold text-lg">Slot {slot.id}</span>
                      </div>
                      <span className="text-xl">{getStatusIcon(currentStatus)}</span>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Type:</span>
                        <span className="text-white">{slot.connectorType}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Power:</span>
                        <span className="text-white">{slot.power}</span>
                      </div>
                      {currentStatus === "occupied" || currentStatus === "reserved" ? (
                        <>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">User:</span>
                            <span className="text-green-400 text-xs">{slot.currentUser}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Time:</span>
                            <span className="text-yellow-400 text-xs">{slot.timeRemaining}</span>
                          </div>
                        </>
                      ) : null}
                    </div>

                    {/* Quick Action Buttons */}
                    <div className="grid grid-cols-2 gap-2">
                      <select 
                        value={currentStatus}
                        onChange={(e) => updateSlotStatus(slot.id, e.target.value)}
                        className="w-full bg-[#161616] border border-[#2a2a2a] rounded-lg px-2 py-1 text-xs text-white"
                        style={{ colorScheme: 'dark' }}
                      >
                        <option value="available">Available</option>
                        <option value="occupied">Occupied</option>
                        <option value="maintenance">Maintenance</option>
                        <option value="reserved">Reserved</option>
                      </select>
                      
                      <button className="px-2 py-1 bg-[#1f1f1f] hover:bg-[#2a2a2a] rounded-lg text-xs transition-colors">
                        Details
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === "bookings" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold">Today's Bookings</h3>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <span>Auto-refresh:</span>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>
            </div>

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
                      <th className="text-left py-4 px-6 font-medium text-gray-400">Status</th>
                      <th className="text-left py-4 px-6 font-medium text-gray-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {todayBookings.map((booking) => (
                      <tr key={booking.id} className="border-b border-[#1a1a1a] hover:bg-[#161616] transition-colors">
                        <td className="py-4 px-6 font-mono text-sm text-green-400">{booking.id}</td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 text-xs font-bold">
                              {booking.customer.split(" ").map(n => n[0]).join("")}
                            </div>
                            <span className="font-medium">{booking.customer}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="px-2 py-1 bg-[#1f1f1f] rounded text-sm font-mono">{booking.slot}</span>
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-300">{booking.time}</td>
                        <td className="py-4 px-6 font-medium text-green-400">₹{booking.amount}</td>
                        <td className="py-4 px-6">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            booking.status === "active" ? "bg-green-500/20 text-green-400" :
                            booking.status === "completed" ? "bg-blue-500/20 text-blue-400" :
                            "bg-yellow-500/20 text-yellow-400"
                          }`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <button className="p-1 hover:bg-[#1f1f1f] rounded text-gray-400 hover:text-white">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                              </svg>
                            </button>
                            {booking.status === "active" && (
                              <button className="p-1 hover:bg-[#1f1f1f] rounded text-red-400 hover:text-red-300">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                                </svg>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "workers" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold">Station Workers</h3>
              <button className="px-4 py-2 bg-green-500 text-black rounded-lg hover:bg-green-400 transition-colors">
                + Invite Worker
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {workers.map((worker) => (
                <div key={worker.id} className="bg-[#111] border border-[#1a1a1a] rounded-xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 font-bold">
                        {worker.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div>
                        <h4 className="font-medium text-white">{worker.name}</h4>
                        <p className="text-xs text-gray-400">{worker.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${worker.status === "online" ? "bg-green-400" : "bg-gray-400"}`}></div>
                      <span className={`text-xs ${worker.status === "online" ? "text-green-400" : "text-gray-400"}`}>
                        {worker.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Shift:</span>
                      <span className="text-white text-xs">{worker.shift}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Last Seen:</span>
                      <span className="text-gray-300 text-xs">{worker.lastSeen}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button className="flex-1 px-3 py-2 bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg hover:bg-green-500/30 transition-colors text-sm">
                      Message
                    </button>
                    <button className="px-3 py-2 bg-[#1f1f1f] hover:bg-[#2a2a2a] rounded-lg transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/>
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}