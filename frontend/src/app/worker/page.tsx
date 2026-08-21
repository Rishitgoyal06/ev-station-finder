"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function WorkerDashboard() {
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedStation, setSelectedStation] = useState("1");

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const workerData = {
    name: "Suresh Kumar",
    id: "WK001",
    shift: "Morning (6 AM - 2 PM)",
    station: "GreenCharge Whitefield"
  };

  const assignedStations = [
    { id: "1", name: "GreenCharge Whitefield", address: "ITPL Main Road", slots: 8 },
    { id: "2", name: "GreenCharge HSR", address: "Sector 2, HSR Layout", slots: 12 },
  ];

  const slotData = [
    { id: "A1", status: "available", user: null, timeLeft: null },
    { id: "A2", status: "occupied", user: "Rajesh K.", timeLeft: "25 min" },
    { id: "A3", status: "available", user: null, timeLeft: null },
    { id: "A4", status: "maintenance", user: null, timeLeft: null },
    { id: "B1", status: "occupied", user: "Priya S.", timeLeft: "12 min" },
    { id: "B2", status: "available", user: null, timeLeft: null },
    { id: "B3", status: "reserved", user: "Amit P.", timeLeft: "Starts in 15 min" },
    { id: "B4", status: "available", user: null, timeLeft: null },
  ];

  const [slotStatuses, setSlotStatuses] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    slotData.forEach(slot => {
      initial[slot.id] = slot.status;
    });
    return initial;
  });

  const upcomingBookings = [
    { id: "BK003", customer: "Amit Patel", slot: "B3", time: "2:15 PM", phone: "+91 98765 43213" },
    { id: "BK004", customer: "Sneha Reddy", slot: "A1", time: "3:30 PM", phone: "+91 98765 43214" },
    { id: "BK005", customer: "Vikram Singh", slot: "B2", time: "5:00 PM", phone: "+91 98765 43215" },
  ];

  const quickUpdateSlot = (slotId: string, newStatus: string) => {
    setSlotStatuses(prev => ({
      ...prev,
      [slotId]: newStatus
    }));
    // Here you would make an API call
    console.log(`Worker updated slot ${slotId} to ${newStatus}`);
    
    // Show success feedback
    const button = document.getElementById(`slot-${slotId}`);
    if (button) {
      button.style.transform = "scale(0.95)";
      setTimeout(() => {
        button.style.transform = "scale(1)";
      }, 150);
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

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-20 pb-20">
      <div className="p-4 space-y-6">
        {/* Welcome Section */}
        <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-black font-bold text-lg">
                {workerData.name.split(" ").map(n => n[0]).join("")}
              </div>
              <div>
                <h1 className="font-bold text-xl">Hi, {workerData.name.split(" ")[0]}! 👋</h1>
                <p className="text-sm text-gray-400">{workerData.shift}</p>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-lg font-bold text-green-400">
                {currentTime.toLocaleTimeString('en-US', { hour12: true })}
              </p>
              <p className="text-sm text-gray-400">
                {currentTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </p>
            </div>
          </div>
        </div>
        {/* Station Selection */}
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
                    <p className={`font-medium ${selectedStation === station.id ? "text-green-400" : "text-white"}`}>
                      {station.name}
                    </p>
                    <p className="text-xs text-gray-400">{station.address}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${selectedStation === station.id ? "text-green-400" : "text-white"}`}>
                      {station.slots} slots
                    </p>
                    {selectedStation === station.id && (
                      <div className="w-2 h-2 bg-green-400 rounded-full mt-1"></div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "Available", value: Object.values(slotStatuses).filter(s => s === "available").length, color: "text-green-400", bg: "bg-green-500/20" },
            { label: "Occupied", value: Object.values(slotStatuses).filter(s => s === "occupied").length, color: "text-yellow-400", bg: "bg-yellow-500/20" },
            { label: "Reserved", value: Object.values(slotStatuses).filter(s => s === "reserved").length, color: "text-blue-400", bg: "bg-blue-500/20" },
            { label: "Maintenance", value: Object.values(slotStatuses).filter(s => s === "maintenance").length, color: "text-red-400", bg: "bg-red-500/20" },
          ].map((stat, index) => (
            <div key={index} className={`${stat.bg} border border-current/30 rounded-xl p-3 ${stat.color}`}>
              <p className="text-xl font-bold">{stat.value}</p>
              <p className="text-xs opacity-80">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Slot Management Grid */}
        <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-4">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-4">Slot Management</h3>
          
          <div className="grid grid-cols-2 gap-4">
            {slotData.map((slot) => {
              const currentStatus = slotStatuses[slot.id];
              return (
                <div
                  key={slot.id}
                  id={`slot-${slot.id}`}
                  className="bg-[#161616] border border-[#2a2a2a] rounded-xl p-4 transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(currentStatus)}`}></div>
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
                    <div className="mb-3 h-12"></div>
                  )}

                  {/* Quick Action Buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    {currentStatus === "available" ? (
                      <>
                        <button
                          onClick={() => quickUpdateSlot(slot.id, "occupied")}
                          className="px-3 py-2 bg-yellow-500 hover:bg-yellow-400 text-black text-xs font-bold rounded-lg transition-all active:scale-95"
                        >
                          Mark Busy
                        </button>
                        <button
                          onClick={() => quickUpdateSlot(slot.id, "maintenance")}
                          className="px-3 py-2 bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold rounded-lg transition-all active:scale-95"
                        >
                          Maintenance
                        </button>
                      </>
                    ) : currentStatus === "occupied" ? (
                      <>
                        <button
                          onClick={() => quickUpdateSlot(slot.id, "available")}
                          className="px-3 py-2 bg-green-500 hover:bg-green-400 text-black text-xs font-bold rounded-lg transition-all active:scale-95"
                        >
                          Free Up
                        </button>
                        <button className="px-3 py-2 bg-[#1f1f1f] text-gray-400 text-xs font-bold rounded-lg">
                          Extend Time
                        </button>
                      </>
                    ) : currentStatus === "maintenance" ? (
                      <>
                        <button
                          onClick={() => quickUpdateSlot(slot.id, "available")}
                          className="col-span-2 px-3 py-2 bg-green-500 hover:bg-green-400 text-black text-xs font-bold rounded-lg transition-all active:scale-95"
                        >
                          Mark Fixed
                        </button>
                      </>
                    ) : (
                      <div className="col-span-2 px-3 py-2 bg-blue-500/20 text-blue-400 text-xs font-bold rounded-lg text-center">
                        Reserved
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Bookings */}
        <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-4">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-4">Upcoming Arrivals</h3>
          
          <div className="space-y-3">
            {upcomingBookings.slice(0, 3).map((booking) => (
              <div key={booking.id} className="flex items-center justify-between p-3 bg-[#161616] rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 text-xs font-bold">
                    {booking.customer.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{booking.customer}</p>
                    <p className="text-xs text-gray-400">Slot {booking.slot} • {booking.time}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => window.open(`tel:${booking.phone}`)}
                    className="p-2 bg-green-500/20 text-green-400 rounded-lg"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Actions */}
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
          <h3 className="text-sm font-bold text-red-400 uppercase tracking-wide mb-3">Emergency Controls</h3>
          
          <div className="grid grid-cols-1 gap-3">
            <button className="p-3 bg-red-500 hover:bg-red-400 text-white font-bold rounded-lg transition-all active:scale-95 flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"/>
              </svg>
              EMERGENCY STOP ALL SLOTS
            </button>
            
            <div className="grid grid-cols-2 gap-3">
              <button className="p-3 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 font-bold rounded-lg transition-all active:scale-95">
                Call Supervisor
              </button>
              <button className="p-3 bg-purple-500/20 text-purple-400 border border-purple-500/30 font-bold rounded-lg transition-all active:scale-95">
                Report Issue
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#111] border-t border-[#1a1a1a] px-4 py-3">
        <div className="grid grid-cols-4 gap-2">
          <button className="flex flex-col items-center gap-1 p-2 text-green-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"/>
            </svg>
            <span className="text-xs font-medium">Dashboard</span>
          </button>
          
          <button className="flex flex-col items-center gap-1 p-2 text-gray-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            <span className="text-xs">Bookings</span>
          </button>
          
          <button className="flex flex-col items-center gap-1 p-2 text-gray-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span className="text-xs">History</span>
          </button>
          
          <button 
            onClick={() => router.push("/")}
            className="flex flex-col items-center gap-1 p-2 text-gray-400"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
            <span className="text-xs">Exit</span>
          </button>
        </div>
      </div>
    </div>
  );
}