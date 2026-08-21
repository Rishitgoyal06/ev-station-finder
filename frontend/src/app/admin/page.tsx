"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");

  const stats = {
    totalUsers: 12453,
    totalStations: 847,
    totalOwners: 156,
    totalBookings: 8934,
    revenue: 2456780,
    activeBookings: 234
  };

  const recentActivity = [
    { id: 1, type: "station", message: "New station registered by GreenPower Ltd", time: "2 min ago" },
    { id: 2, type: "user", message: "User reported payment issue", time: "5 min ago" },
    { id: 3, type: "booking", message: "High demand at Whitefield Hub", time: "8 min ago" },
    { id: 4, type: "owner", message: "Station owner verification pending", time: "12 min ago" },
  ];

  const pendingApprovals = [
    { id: 1, type: "station", name: "EcoCharge Central", owner: "GreenPower Ltd", status: "pending" },
    { id: 2, type: "owner", name: "TechVolt Solutions", email: "admin@techvolt.com", status: "verification" },
    { id: 3, type: "station", name: "FastCharge Marina", owner: "Marina Corp", status: "pending" },
  ];

  const TabButton = ({ tab, label, icon }: { tab: string; label: string; icon: string }) => (
    <button
      onClick={() => setActiveTab(tab)}
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
              A
            </div>
            <div>
              <h1 className="text-xl font-bold">Admin Dashboard</h1>
              <p className="text-gray-400 text-sm">ChargeIQ Management Portal</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="relative p-2 hover:bg-[#1f1f1f] rounded-lg transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
              </svg>
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center">5</span>
            </button>
            
            <button 
              onClick={() => router.push("/")}
              className="px-4 py-2 bg-[#1f1f1f] hover:bg-[#2a2a2a] rounded-lg font-medium transition-colors"
            >
              Exit Admin
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto">
          <TabButton tab="overview" label="Overview" icon="📊" />
          <TabButton tab="users" label="Users" icon="👥" />
          <TabButton tab="stations" label="Stations" icon="⚡" />
          <TabButton tab="owners" label="Owners" icon="🏢" />
          <TabButton tab="bookings" label="Bookings" icon="📅" />
          <TabButton tab="payments" label="Payments" icon="💳" />
          <TabButton tab="reports" label="Reports" icon="📈" />
        </div>

        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              {[
                { label: "Total Users", value: stats.totalUsers.toLocaleString(), icon: "👥", change: "+12%" },
                { label: "Total Stations", value: stats.totalStations.toLocaleString(), icon: "⚡", change: "+8%" },
                { label: "Station Owners", value: stats.totalOwners.toLocaleString(), icon: "🏢", change: "+15%" },
                { label: "Total Bookings", value: stats.totalBookings.toLocaleString(), icon: "📅", change: "+23%" },
                { label: "Revenue", value: `₹${(stats.revenue / 100000).toFixed(1)}L`, icon: "💰", change: "+18%" },
                { label: "Active Now", value: stats.activeBookings.toLocaleString(), icon: "🔥", change: "Live" },
              ].map((stat, index) => (
                <div key={index} className="bg-[#111] border border-[#1a1a1a] rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{stat.icon}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      stat.change === "Live" ? "bg-green-500/20 text-green-400" : "bg-blue-500/20 text-blue-400"
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
                  <p className="text-xs text-gray-400">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Recent Activity & Pending Approvals */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-5">
                <h3 className="text-lg font-bold mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3 p-3 bg-[#161616] rounded-lg">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                        activity.type === "station" ? "bg-green-500/20 text-green-400" :
                        activity.type === "user" ? "bg-blue-500/20 text-blue-400" :
                        activity.type === "booking" ? "bg-yellow-500/20 text-yellow-400" :
                        "bg-purple-500/20 text-purple-400"
                      }`}>
                        {activity.type === "station" ? "⚡" :
                         activity.type === "user" ? "👤" :
                         activity.type === "booking" ? "📅" : "🏢"}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-white">{activity.message}</p>
                        <p className="text-xs text-gray-400">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pending Approvals */}
              <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-5">
                <h3 className="text-lg font-bold mb-4">Pending Approvals</h3>
                <div className="space-y-3">
                  {pendingApprovals.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-[#161616] rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                          item.type === "station" ? "bg-green-500/20 text-green-400" : "bg-blue-500/20 text-blue-400"
                        }`}>
                          {item.type === "station" ? "⚡" : "🏢"}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{item.name}</p>
                          <p className="text-xs text-gray-400">
                            {"owner" in item ? item.owner : ("email" in item ? item.email : "")}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="px-3 py-1 bg-green-500 hover:bg-green-400 text-black text-xs font-medium rounded-lg transition-colors">
                          Approve
                        </button>
                        <button className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 text-xs font-medium rounded-lg transition-colors">
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "users" && (
          <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-5">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">User Management</h3>
              <button className="px-4 py-2 bg-green-500 hover:bg-green-400 text-black font-medium rounded-lg transition-colors">
                Export Users
              </button>
            </div>
            
            {/* Search and Filters */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search users..."
                  className="w-full bg-[#161616] border border-[#2a2a2a] rounded-lg px-4 py-2 pl-10 text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
                />
                <svg className="w-4 h-4 absolute left-3 top-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </div>
              <select className="bg-[#161616] border border-[#2a2a2a] rounded-lg px-4 py-2 text-white">
                <option>All Status</option>
                <option>Active</option>
                <option>Inactive</option>
                <option>Suspended</option>
              </select>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#1a1a1a]">
                    <th className="text-left py-3 px-4 font-medium text-gray-400">User</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-400">Email</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-400">Joined</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-400">Bookings</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-400">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: "Rajesh Kumar", email: "rajesh@gmail.com", joined: "Jan 15, 2024", bookings: 23, status: "Active" },
                    { name: "Priya Sharma", email: "priya@yahoo.com", joined: "Feb 3, 2024", bookings: 15, status: "Active" },
                    { name: "Amit Patel", email: "amit@outlook.com", joined: "Mar 12, 2024", bookings: 8, status: "Inactive" },
                  ].map((user, index) => (
                    <tr key={index} className="border-b border-[#1a1a1a] hover:bg-[#161616]">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 font-medium">
                            {user.name.split(" ").map(n => n[0]).join("")}
                          </div>
                          <span className="font-medium">{user.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-300">{user.email}</td>
                      <td className="py-3 px-4 text-gray-300">{user.joined}</td>
                      <td className="py-3 px-4 text-gray-300">{user.bookings}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.status === "Active" ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <button className="p-1 hover:bg-[#1f1f1f] rounded text-gray-400 hover:text-white">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                            </svg>
                          </button>
                          <button className="p-1 hover:bg-[#1f1f1f] rounded text-gray-400 hover:text-white">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Add more tab content here for stations, owners, bookings, payments, reports */}
      </div>
    </div>
  );
}