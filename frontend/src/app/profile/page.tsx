"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/AuthContext";

export default function ProfilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, logout } = useAuth();
  
  // Check if coming from wallet navigation
  const initialTab = searchParams?.get('tab') === 'wallet' ? 'wallet' : 'profile';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [isEditing, setIsEditing] = useState(false);
  
  const [profileData, setProfileData] = useState({
    name: "Arjun Sharma",
    email: "arjun.sharma@email.com",
    phone: "+91 98765 43210",
    address: "MG Road, Bengaluru, Karnataka 560001",
    vehicleModel: "Tesla Model 3",
    vehicleNumber: "KA01AB1234",
    preferredConnector: "CCS2"
  });

  const [preferences, setPreferences] = useState({
    notifications: true,
    locationSharing: true,
    emailUpdates: false,
    smsAlerts: true,
    darkMode: true
  });

  const handleSaveProfile = () => {
    setIsEditing(false);
    // API call to save profile data
  };

  const handleLogout = () => {
    logout();
    router.push('/');
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
            <h1 className="text-xl font-bold">Profile Settings</h1>
            <p className="text-sm text-gray-400">Manage your account and preferences</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-4 space-y-2">
              {[
                { key: "profile", label: "Profile Info", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
                { key: "vehicle", label: "Vehicle Details", icon: "M7 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0M17 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0M5 17h-2v-6l2-5h9l4 5h1a2 2 0 0 1 2 2v4h-2" },
                { key: "wallet", label: "Wallet & Payments", icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" },
                { key: "preferences", label: "Preferences", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" },
                { key: "security", label: "Security", icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                    activeTab === tab.key
                      ? "bg-green-500 text-black font-medium"
                      : "text-gray-400 hover:text-white hover:bg-[#1f1f1f]"
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path d={tab.icon}/>
                  </svg>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {activeTab === "profile" && (
              <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">Profile Information</h2>
                  <button
                    onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      isEditing 
                        ? "bg-green-500 hover:bg-green-400 text-black"
                        : "bg-[#1f1f1f] hover:bg-[#2a2a2a] border border-[#2a2a2a] text-white"
                    }`}
                  >
                    {isEditing ? "Save Changes" : "Edit Profile"}
                  </button>
                </div>

                {/* Profile Photo */}
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-24 h-24 bg-[#1f1f1f] rounded-full overflow-hidden">
                    <img src="/profile.png" alt="Profile" className="w-full h-full object-cover"/>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">{profileData.name}</h3>
                    <p className="text-gray-400 mb-3">Member since March 2026</p>
                    {isEditing && (
                      <button className="text-green-400 hover:text-green-300 text-sm font-medium">
                        Change Photo
                      </button>
                    )}
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 bg-[#161616] border border-[#2a2a2a] rounded-lg text-white focus:outline-none focus:border-green-500 disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 bg-[#161616] border border-[#2a2a2a] rounded-lg text-white focus:outline-none focus:border-green-500 disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 bg-[#161616] border border-[#2a2a2a] rounded-lg text-white focus:outline-none focus:border-green-500 disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Preferred Connector</label>
                    <select
                      value={profileData.preferredConnector}
                      onChange={(e) => setProfileData({...profileData, preferredConnector: e.target.value})}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 bg-[#161616] border border-[#2a2a2a] rounded-lg text-white focus:outline-none focus:border-green-500 disabled:opacity-50"
                    >
                      <option value="CCS2">CCS2</option>
                      <option value="Type2">Type 2</option>
                      <option value="CHAdeMO">CHAdeMO</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-400 mb-2">Address</label>
                    <textarea
                      value={profileData.address}
                      onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                      disabled={!isEditing}
                      rows={3}
                      className="w-full px-4 py-3 bg-[#161616] border border-[#2a2a2a] rounded-lg text-white focus:outline-none focus:border-green-500 disabled:opacity-50 resize-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "vehicle" && (
              <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-6">
                <h2 className="text-xl font-bold text-white mb-6">Vehicle Details</h2>
                
                <div className="space-y-6">
                  <div className="flex items-center gap-4 p-4 bg-[#161616] border border-[#2a2a2a] rounded-lg">
                    <div className="w-16 h-16 bg-green-500/10 rounded-lg flex items-center justify-center">
                      <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path d="M7 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"/><path d="M17 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"/><path d="M5 17h-2v-6l2-5h9l4 5h1a2 2 0 0 1 2 2v4h-2"/>
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white">{profileData.vehicleModel}</h3>
                      <p className="text-gray-400">{profileData.vehicleNumber}</p>
                      <p className="text-sm text-green-400 mt-1">Primary Vehicle</p>
                    </div>
                    <button className="px-4 py-2 bg-[#1f1f1f] hover:bg-[#2a2a2a] border border-[#2a2a2a] rounded-lg text-sm font-medium transition-colors">
                      Edit
                    </button>
                  </div>

                  <button className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-[#2a2a2a] rounded-lg text-gray-400 hover:border-green-500/50 hover:text-green-400 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <circle cx="12" cy="12" r="9"/><path d="M12 7v10M7 12h10"/>
                    </svg>
                    Add Another Vehicle
                  </button>
                </div>
              </div>
            )}

            {activeTab === "wallet" && (
              <div className="space-y-6">
                {/* Wallet Balance Card */}
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <p className="text-green-100 text-sm mb-1">Available Balance</p>
                        <h2 className="text-4xl font-bold text-white">₹855</h2>
                      </div>
                      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
                        </svg>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <button className="flex items-center gap-2 bg-white text-green-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <circle cx="12" cy="12" r="9"/><path d="M12 7v10M7 12h10"/>
                        </svg>
                        Add Money
                      </button>
                      <button className="flex items-center gap-2 bg-white/20 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/30 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7,10 12,15 17,10"/><line x1="12" y1="15" x2="12" y2="3"/>
                        </svg>
                        Send Money
                      </button>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-[#161616] border border-[#2a2a2a] rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm mb-1">This Month</p>
                        <p className="text-xl font-bold text-white">₹625</p>
                        <p className="text-green-400 text-xs">+12% from last month</p>
                      </div>
                      <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#161616] border border-[#2a2a2a] rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm mb-1">Avg. per Session</p>
                        <p className="text-xl font-bold text-white">₹208</p>
                        <p className="text-blue-400 text-xs">45 min avg duration</p>
                      </div>
                      <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/>
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#161616] border border-[#2a2a2a] rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm mb-1">Total Savings</p>
                        <p className="text-xl font-bold text-white">₹1,240</p>
                        <p className="text-yellow-400 text-xs">vs petrol costs</p>
                      </div>
                      <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Transactions */}
                <div className="bg-[#161616] border border-[#2a2a2a] rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Recent Transactions</h3>
                    <button className="text-green-400 hover:text-green-300 font-medium text-sm">
                      View All
                    </button>
                  </div>

                  <div className="space-y-3">
                    {[
                      { type: "charge", desc: "Charging at GreenCharge Hub", amount: -245, date: "Aug 15, 18:30" },
                      { type: "refund", desc: "Booking cancellation refund", amount: 180, date: "Aug 14, 10:15" },
                      { type: "topup", desc: "Wallet top-up via UPI", amount: 500, date: "Aug 12, 14:20" }
                    ].map((tx, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-[#1f1f1f] rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            tx.type === "charge" ? "bg-orange-500/10" :
                            tx.type === "topup" ? "bg-green-500/10" : "bg-blue-500/10"
                          }`}>
                            <svg className={`w-4 h-4 ${
                              tx.type === "charge" ? "text-orange-400" :
                              tx.type === "topup" ? "text-green-400" : "text-blue-400"
                            }`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                              {tx.type === "charge" ? <path d="M13 10V3L4 14h7v7l9-11h-7z"/> :
                               tx.type === "topup" ? <><circle cx="12" cy="12" r="9"/><path d="M12 7v10M7 12h10"/></> :
                               <path d="M3 10h10a8 8 0 018 8v2M3 10l6 6M3 10l6-6"/>}
                            </svg>
                          </div>
                          <div>
                            <p className="text-white font-medium text-sm">{tx.desc}</p>
                            <p className="text-gray-400 text-xs">{tx.date}</p>
                          </div>
                        </div>
                        <p className={`font-semibold ${tx.amount > 0 ? "text-green-400" : "text-white"}`}>
                          {tx.amount > 0 ? "+" : ""}₹{Math.abs(tx.amount)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "preferences" && (
              <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-6">
                <h2 className="text-xl font-bold text-white mb-6">Preferences</h2>
                
                <div className="space-y-6">
                  {[
                    { key: "notifications", label: "Push Notifications", desc: "Receive booking confirmations and reminders" },
                    { key: "locationSharing", label: "Location Sharing", desc: "Share your location for better station recommendations" },
                    { key: "emailUpdates", label: "Email Updates", desc: "Receive promotional emails and newsletters" },
                    { key: "smsAlerts", label: "SMS Alerts", desc: "Get SMS notifications for important updates" },
                    { key: "darkMode", label: "Dark Mode", desc: "Use dark theme throughout the app" }
                  ].map((pref) => (
                    <div key={pref.key} className="flex items-center justify-between p-4 bg-[#161616] border border-[#2a2a2a] rounded-lg">
                      <div>
                        <h3 className="text-white font-medium">{pref.label}</h3>
                        <p className="text-sm text-gray-400 mt-1">{pref.desc}</p>
                      </div>
                      <button
                        onClick={() => setPreferences({...preferences, [pref.key]: !preferences[pref.key as keyof typeof preferences]})}
                        className={`w-12 h-6 rounded-full transition-colors relative ${
                          preferences[pref.key as keyof typeof preferences] ? "bg-green-500" : "bg-[#2a2a2a]"
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                          preferences[pref.key as keyof typeof preferences] ? "translate-x-6" : "translate-x-0.5"
                        }`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-6">
                <h2 className="text-xl font-bold text-white mb-6">Security Settings</h2>
                
                <div className="space-y-4">
                  <button className="w-full flex items-center justify-between p-4 bg-[#161616] border border-[#2a2a2a] rounded-lg hover:bg-[#1f1f1f] transition-colors">
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                      </svg>
                      <div className="text-left">
                        <p className="text-white font-medium">Change Password</p>
                        <p className="text-sm text-gray-400">Update your account password</p>
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </button>

                  <button className="w-full flex items-center justify-between p-4 bg-[#161616] border border-[#2a2a2a] rounded-lg hover:bg-[#1f1f1f] transition-colors">
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                      </svg>
                      <div className="text-left">
                        <p className="text-white font-medium">Two-Factor Authentication</p>
                        <p className="text-sm text-gray-400">Add extra security to your account</p>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-gray-500/20 text-gray-400 text-xs rounded">Disabled</span>
                  </button>

                  <button className="w-full flex items-center justify-between p-4 bg-[#161616] border border-[#2a2a2a] rounded-lg hover:bg-[#1f1f1f] transition-colors">
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      <div className="text-left">
                        <p className="text-white font-medium">Login Activity</p>
                        <p className="text-sm text-gray-400">View recent login sessions</p>
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </button>

                  <div className="pt-4 border-t border-[#1a1a1a]">
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center gap-2 p-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-lg font-medium transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
                      </svg>
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}