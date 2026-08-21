"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function OwnerDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");

  const ownerData = {
    businessName: "GreenPower Solutions",
    totalStations: 12,
    totalSlots: 48,
    todayRevenue: 15420,
    monthlyRevenue: 342800,
    activeBookings: 23,
    occupiedSlots: 18
  };

  const myStations = [
    {
      id: 1,
      name: "GreenCharge Whitefield",
      address: "ITPL Main Road, Whitefield",
      totalSlots: 8,
      occupiedSlots: 5,
      availableSlots: 3,
      todayRevenue: 4200,
      status: "active",
      maintenanceSlots: 0
    },
    {
      id: 2,
      name: "GreenCharge HSR Layout",
      address: "Sector 2, HSR Layout",
      totalSlots: 12,
      occupiedSlots: 8,
      availableSlots: 3,
      todayRevenue: 6800,
      status: "active",
      maintenanceSlots: 1
    },
    {
      id: 3,
      name: "GreenCharge Koramangala",
      address: "5th Block, Koramangala",
      totalSlots: 6,
      occupiedSlots: 2,
      availableSlots: 4,
      todayRevenue: 2100,
      status: "active",
      maintenanceSlots: 0
    }
  ];

  const recentBookings = [
    { id: "BK001", customer: "Rajesh Kumar", station: "Whitefield", slot: "A1", time: "10:30 AM", amount: 420, status: "active" },
    { id: "BK002", customer: "Priya Sharma", station: "HSR Layout", slot: "B3", time: "11:45 AM", amount: 380, status: "completed" },
    { id: "BK003", customer: "Amit Patel", station: "Koramangala", slot: "C2", time: "12:15 PM", amount: 450, status: "active" },
    { id: "BK004", customer: "Sneha Reddy", station: "Whitefield", slot: "A4", time: "1:30 PM", amount: 390, status: "upcoming" },
  ];

  const TabButton = ({ tab, label, icon, route }: { tab: string; label: string; icon: string; route?: string }) => (
    <button
      onClick={() => {
        if (route) {
          router.push(route);
        } else {
          setActiveTab(tab);
        }
      }}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
        activeTab === tab
          ? "bg-green-500 text-black"
          : "text-gray-400 hover:text-white hover:bg-[#1f1f1f]"
      }`}
    >
      <span className="text-lg">{icon}</span>
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-20">
      {/* Header */}
      <div className="bg-[#111] border-b border-[#1a1a1a] px-6 py-4 fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center text-black font-bold text-lg">
              G
            </div>
            <div>
              <h1 className="text-xl font-bold">{ownerData.businessName}</h1>
              <p className="text-gray-400 text-sm">Station Owner Dashboard</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="relative p-2 hover:bg-[#1f1f1f] rounded-lg transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
              </svg>
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full text-xs flex items-center justify-center text-black">3</span>
            </button>
            
            <button 
              onClick={() => router.push("/")}
              className="px-4 py-2 bg-[#1f1f1f] hover:bg-[#2a2a2a] rounded-lg font-medium transition-colors"
            >
              View Site
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto">
          <TabButton tab="overview" label="Overview" icon="📊" />
          <TabButton tab="stations" label="My Stations" icon="⚡" route="/owner/stations" />
          <TabButton tab="bookings" label="Bookings" icon="📅" route="/owner/bookings" />
          <TabButton tab="workers" label="Workers" icon="👷" route="/owner/workers" />
          <TabButton tab="analytics" label="Analytics" icon="📈" route="/owner/analytics" />
          <TabButton tab="settings" label="Settings" icon="⚙️" route="/owner/settings" />
        </div>

        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Total Stations", value: ownerData.totalStations, icon: "⚡", change: "+2 this month" },
                { label: "Total Slots", value: ownerData.totalSlots, icon: "🔌", change: `${ownerData.occupiedSlots} occupied` },
                { label: "Today's Revenue", value: `₹${ownerData.todayRevenue.toLocaleString()}`, icon: "💰", change: "+15% vs yesterday" },
                { label: "Active Bookings", value: ownerData.activeBookings, icon: "📅", change: "Real-time" },
              ].map((stat, index) => (
                <div key={index} className="bg-[#111] border border-[#1a1a1a] rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{stat.icon}</span>
                    <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7H7"/>
                    </svg>
                  </div>
                  <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
                  <p className="text-xs text-gray-400">{stat.label}</p>
                  <p className="text-xs text-green-400 mt-1">{stat.change}</p>
                </div>
              ))}
            </div>

            {/* Station Status Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Live Station Status */}
              <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">Live Station Status</h3>
                  <button 
                    onClick={() => setActiveTab("stations")}
                    className="text-green-400 text-sm hover:text-green-300"
                  >
                    View All →
                  </button>
                </div>
                
                <div className="space-y-3">
                  {myStations.slice(0, 3).map((station) => (
                    <div key={station.id} className="p-4 bg-[#161616] rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-white">{station.name}</h4>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span className="text-xs text-green-400">Online</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-3 text-center">
                        <div>
                          <p className="text-lg font-bold text-green-400">{station.availableSlots}</p>
                          <p className="text-xs text-gray-400">Available</p>
                        </div>
                        <div>
                          <p className="text-lg font-bold text-yellow-400">{station.occupiedSlots}</p>
                          <p className="text-xs text-gray-400">Occupied</p>
                        </div>
                        <div>
                          <p className="text-lg font-bold text-blue-400">₹{station.todayRevenue}</p>
                          <p className="text-xs text-gray-400">Today</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Bookings */}
              <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">Recent Bookings</h3>
                  <button 
                    onClick={() => setActiveTab("bookings")}
                    className="text-green-400 text-sm hover:text-green-300"
                  >
                    View All →
                  </button>
                </div>
                
                <div className="space-y-3">
                  {recentBookings.slice(0, 4).map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-3 bg-[#161616] rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 text-xs font-bold">
                          {booking.customer.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{booking.customer}</p>
                          <p className="text-xs text-gray-400">{booking.station} • Slot {booking.slot}</p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-sm font-medium text-green-400">₹{booking.amount}</p>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          booking.status === "active" ? "bg-green-500/20 text-green-400" :
                          booking.status === "completed" ? "bg-blue-500/20 text-blue-400" :
                          "bg-yellow-500/20 text-yellow-400"
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl hover:bg-green-500/20 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center text-black group-hover:scale-110 transition-transform">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-green-400">Add New Station</p>
                    <p className="text-xs text-green-400/70">Expand your network</p>
                  </div>
                </div>
              </button>

              <button className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl hover:bg-blue-500/20 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center text-black group-hover:scale-110 transition-transform">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-blue-400">Invite Worker</p>
                    <p className="text-xs text-blue-400/70">Add team member</p>
                  </div>
                </div>
              </button>

              <button className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl hover:bg-purple-500/20 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center text-black group-hover:scale-110 transition-transform">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-purple-400">View Reports</p>
                    <p className="text-xs text-purple-400/70">Analytics & insights</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        )}

        {activeTab === "stations" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold">My Stations</h3>
              <button className="px-4 py-2 bg-green-500 hover:bg-green-400 text-black font-medium rounded-lg transition-colors">
                + Add New Station
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {myStations.map((station) => (
                <div key={station.id} className="bg-[#111] border border-[#1a1a1a] rounded-xl p-5 hover:border-green-500/30 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-bold text-white mb-1">{station.name}</h4>
                      <p className="text-sm text-gray-400">{station.address}</p>
                    </div>
                    <button 
                      onClick={() => router.push(`/owner/stations/${station.id}`)}
                      className="p-2 hover:bg-[#1f1f1f] rounded-lg transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      </svg>
                    </button>
                  </div>

                  <div className="grid grid-cols-4 gap-3 mb-4">
                    <div className="text-center">
                      <p className="text-lg font-bold text-green-400">{station.availableSlots}</p>
                      <p className="text-xs text-gray-400">Available</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-yellow-400">{station.occupiedSlots}</p>
                      <p className="text-xs text-gray-400">Occupied</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-red-400">{station.maintenanceSlots}</p>
                      <p className="text-xs text-gray-400">Maintenance</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-white">{station.totalSlots}</p>
                      <p className="text-xs text-gray-400">Total</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Today's Revenue</p>
                      <p className="font-bold text-green-400">₹{station.todayRevenue.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-xs text-green-400">Active</span>
                    </div>
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