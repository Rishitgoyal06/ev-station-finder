"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/AuthContext";

function ProfileContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, logout, isLoading: isAuthLoading, isAuthenticated } = useAuth();

  const initialTab = searchParams?.get("tab") === "wallet" ? "wallet" : "profile";
  const [activeTab, setActiveTab] = useState(initialTab);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Real data from FastAPI backend / MongoDB Atlas
  const [profileData, setProfileData] = useState({
    phone: "",
    address: "",
    vehicleModel: "",
    vehicleNumber: "",
    preferredConnector: "CCS2",
  });

  const [preferences, setPreferences] = useState({
    notifications: true,
    locationSharing: true,
    emailUpdates: false,
    smsAlerts: true,
    darkMode: true,
  });

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/auth/profile");
        if (res.ok) {
          const data = await res.json();
          if (data.profile) {
            setProfileData({
              phone: data.profile.phone || "",
              address: data.profile.address || "",
              vehicleModel: data.profile.vehicleModel || "",
              vehicleNumber: data.profile.vehicleNumber || "",
              preferredConnector: data.profile.preferredConnector || "CCS2",
            });
            if (data.profile.preferences) {
              setPreferences(prev => ({ ...prev, ...data.profile.preferences }));
            }
          }
        }
      } catch (err) {
        console.error("Error loading profile:", err);
      }
    }
    if (isAuthenticated) {
      fetchProfile();
    }
  }, [isAuthenticated]);

  const handleSaveProfile = async () => {
    if (isEditing) {
      setIsSaving(true);
      try {
        await fetch("/api/auth/profile", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...profileData,
            preferences,
          }),
        });
      } catch (err) {
        console.error("Error saving profile:", err);
      } finally {
        setIsSaving(false);
        setIsEditing(false);
      }
    } else {
      setIsEditing(true);
    }
  };

  const handleTogglePreference = async (key: string) => {
    const newPrefs = { ...preferences, [key]: !preferences[key as keyof typeof preferences] };
    setPreferences(newPrefs);
    try {
      await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ preferences: newPrefs }),
      });
    } catch (err) {
      console.error("Error saving preference:", err);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  if (isAuthLoading) {
    return (
      <div className="flex h-screen bg-[#0a0a0a] items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const displayName = typeof user === "string" ? user : user?.name || "Driver";
  const displayEmail = typeof user === "string" ? "" : user?.email || "";
  const avatarLetter = displayName[0]?.toUpperCase() || "?";

  const tabs = [
    { key: "profile", label: "Profile Info", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
    { key: "vehicle", label: "Vehicle Details", icon: "M7 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0M17 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0M5 17h-2v-6l2-5h9l4 5h1a2 2 0 0 1 2 2v4h-2" },
    { key: "wallet", label: "Wallet & Payments", icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" },
    { key: "preferences", label: "Preferences", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" },
    { key: "security", label: "Security", icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" },
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
            <h1 className="text-xl font-bold">Profile Settings</h1>
            <p className="text-sm text-gray-400">Manage your account and preferences</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-4 space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                    activeTab === tab.key ? "bg-green-500 text-black font-medium" : "text-gray-400 hover:text-white hover:bg-[#1f1f1f]"
                  }`}
                >
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path d={tab.icon}/>
                  </svg>
                  <span className="text-sm">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {/* ── Profile Tab ── */}
            {activeTab === "profile" && (
              <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Profile Information</h2>
                  <button
                    disabled={isSaving}
                    onClick={handleSaveProfile}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      isEditing ? "bg-green-500 hover:bg-green-400 text-black" : "bg-[#1f1f1f] hover:bg-[#2a2a2a] border border-[#2a2a2a]"
                    }`}
                  >
                    {isSaving ? "Saving..." : isEditing ? "Save Changes" : "Edit Profile"}
                  </button>
                </div>

                {/* Avatar */}
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-24 h-24 bg-green-500/20 border-2 border-green-500/40 rounded-full flex items-center justify-center text-4xl font-black text-green-400">
                    {avatarLetter}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">{displayName}</h3>
                    <p className="text-gray-400 text-sm">{displayEmail}</p>
                    <p className="text-[#555] text-xs mt-1">Premium Member</p>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={displayName}
                      disabled
                      className="w-full px-4 py-3 bg-[#161616] border border-[#2a2a2a] rounded-lg text-white focus:outline-none disabled:opacity-50"
                    />
                    <p className="text-xs text-[#555] mt-1">Name comes from your account</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
                    <input
                      type="email"
                      value={displayEmail}
                      disabled
                      className="w-full px-4 py-3 bg-[#161616] border border-[#2a2a2a] rounded-lg text-white focus:outline-none disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="Enter phone number"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 bg-[#161616] border border-[#2a2a2a] rounded-lg text-white focus:outline-none focus:border-green-500 disabled:opacity-50 placeholder-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Preferred Connector</label>
                    <select
                      value={profileData.preferredConnector}
                      onChange={(e) => setProfileData({ ...profileData, preferredConnector: e.target.value })}
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
                      placeholder="Enter your address"
                      value={profileData.address}
                      onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                      disabled={!isEditing}
                      rows={3}
                      className="w-full px-4 py-3 bg-[#161616] border border-[#2a2a2a] rounded-lg text-white focus:outline-none focus:border-green-500 disabled:opacity-50 resize-none placeholder-gray-600"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ── Vehicle Tab ── */}
            {activeTab === "vehicle" && (
              <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-6">
                <h2 className="text-xl font-bold mb-6">Vehicle Details</h2>
                {profileData.vehicleModel ? (
                  <div className="flex items-center gap-4 p-4 bg-[#161616] border border-[#2a2a2a] rounded-lg mb-4">
                    <div className="w-16 h-16 bg-green-500/10 rounded-lg flex items-center justify-center">
                      <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path d="M7 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"/><path d="M17 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"/><path d="M5 17h-2v-6l2-5h9l4 5h1a2 2 0 0 1 2 2v4h-2"/>
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{profileData.vehicleModel}</h3>
                      <p className="text-gray-400">{profileData.vehicleNumber}</p>
                      <p className="text-sm text-green-400 mt-1">Primary Vehicle</p>
                    </div>
                    <button
                      onClick={() => setProfileData({ ...profileData, vehicleModel: "", vehicleNumber: "" })}
                      className="px-4 py-2 bg-[#1f1f1f] hover:bg-[#2a2a2a] border border-[#2a2a2a] rounded-lg text-sm font-medium transition-colors"
                    >
                      Edit
                    </button>
                  </div>
                ) : (
                  <div className="mb-6 text-center py-10 text-gray-500">
                    <svg className="w-12 h-12 mx-auto mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path d="M7 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"/><path d="M17 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"/><path d="M5 17h-2v-6l2-5h9l4 5h1a2 2 0 0 1 2 2v4h-2"/>
                    </svg>
                    <p className="text-sm">No vehicle added yet</p>
                  </div>
                )}
                <button className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-[#2a2a2a] rounded-lg text-gray-400 hover:border-green-500/50 hover:text-green-400 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <circle cx="12" cy="12" r="9"/><path d="M12 7v10M7 12h10"/>
                  </svg>
                  Add Vehicle
                </button>
              </div>
            )}

            {/* ── Wallet Tab ── */}
            {activeTab === "wallet" && (
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12" />
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <p className="text-green-100 text-sm mb-1">Available Balance</p>
                        <h2 className="text-4xl font-bold text-white">₹0.00</h2>
                      </div>
                      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
                        </svg>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <button className="flex items-center gap-2 bg-white text-green-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><circle cx="12" cy="12" r="9"/><path d="M12 7v10M7 12h10"/></svg>
                        Add Money
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-[#161616] border border-[#2a2a2a] rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
                  <div className="text-center py-10 text-gray-500">
                    <svg className="w-10 h-10 mx-auto mb-2 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
                    </svg>
                    <p className="text-sm">No transactions yet</p>
                  </div>
                </div>
              </div>
            )}

            {/* ── Preferences Tab ── */}
            {activeTab === "preferences" && (
              <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-6">
                <h2 className="text-xl font-bold mb-6">Preferences</h2>
                <div className="space-y-4">
                  {[
                    { key: "notifications", label: "Push Notifications", desc: "Receive booking confirmations and reminders" },
                    { key: "locationSharing", label: "Location Sharing", desc: "Share your location for better station recommendations" },
                    { key: "emailUpdates", label: "Email Updates", desc: "Receive promotional emails and newsletters" },
                    { key: "smsAlerts", label: "SMS Alerts", desc: "Get SMS notifications for important updates" },
                    { key: "darkMode", label: "Dark Mode", desc: "Use dark theme throughout the app" },
                  ].map((pref) => (
                    <div key={pref.key} className="flex items-center justify-between p-4 bg-[#161616] border border-[#2a2a2a] rounded-lg">
                      <div>
                        <h3 className="text-white font-medium">{pref.label}</h3>
                        <p className="text-sm text-gray-400 mt-0.5">{pref.desc}</p>
                      </div>
                      <button
                        onClick={() => setPreferences({ ...preferences, [pref.key]: !preferences[pref.key as keyof typeof preferences] })}
                        className={`w-12 h-6 rounded-full transition-colors relative flex-shrink-0 ${
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

            {/* ── Security Tab ── */}
            {activeTab === "security" && (
              <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-6">
                <h2 className="text-xl font-bold mb-6">Security Settings</h2>
                <div className="space-y-4">
                  {[
                    { label: "Change Password", desc: "Update your account password", icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z", color: "text-yellow-400", badge: null },
                    { label: "Two-Factor Authentication", desc: "Add extra security to your account", icon: "M9 9h13M9 15h13M9 9V7a2 2 0 00-2-2H4a2 2 0 00-2 2v6a2 2 0 002 2h3a2 2 0 002-2v-2", color: "text-blue-400", badge: "Disabled" },
                    { label: "Login Activity", desc: "View recent login sessions", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", color: "text-green-400", badge: null },
                  ].map((item) => (
                    <button key={item.label} className="w-full flex items-center justify-between p-4 bg-[#161616] border border-[#2a2a2a] rounded-lg hover:bg-[#1f1f1f] transition-colors">
                      <div className="flex items-center gap-3">
                        <svg className={`w-5 h-5 ${item.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path d={item.icon}/>
                        </svg>
                        <div className="text-left">
                          <p className="text-white font-medium">{item.label}</p>
                          <p className="text-sm text-gray-400">{item.desc}</p>
                        </div>
                      </div>
                      {item.badge ? (
                        <span className="px-2 py-1 bg-gray-500/20 text-gray-400 text-xs rounded">{item.badge}</span>
                      ) : (
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                      )}
                    </button>
                  ))}

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

export default function ProfilePage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen bg-[#0a0a0a] items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full" />
      </div>
    }>
      <ProfileContent />
    </Suspense>
  );
}