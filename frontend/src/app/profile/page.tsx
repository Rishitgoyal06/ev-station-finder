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
  const [profile, setProfile] = useState<Record<string, any> | null>(null);

  // Seed local state from auth context
  useEffect(() => {
    if (user) setProfile(user);
  }, [user]);

  // Fetch full profile from backend (includes phone, address, vehicle, preferences)
  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/auth/profile");
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setProfile((prev) => ({ ...(prev ?? {}), ...data.user }));
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
    if (!isEditing) {
      setIsEditing(true);
      return;
    }
    setIsSaving(true);
    try {
      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      const data = await res.json();
      if (data.ok && data.user) setProfile(data.user);
      setIsEditing(false);
    } catch (err) {
      console.error("Error saving profile:", err);
    } finally {
      setIsSaving(false);
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
  if (!isAuthenticated || !profile) return null;

  const displayName = profile.name || "Driver";
  const displayEmail = profile.email || "";
  const avatarLetter = displayName[0]?.toUpperCase() || "?";

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-20">
      <div className="bg-[#111] border-b border-[#1a1a1a] px-6 py-4 fixed top-0 left-0 right-0 z-50">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-[#1f1f1f] rounded-xl transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
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
          {/* Sidebar tabs */}
          <div className="lg:col-span-1">
            <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-4 space-y-2">
              {["profile", "vehicle", "wallet", "preferences"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`w-full px-3 py-2.5 rounded-lg text-left capitalize ${
                    activeTab === tab
                      ? "bg-green-500 text-black font-semibold"
                      : "text-gray-400 hover:text-white hover:bg-[#1f1f1f]"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Content area */}
          <div className="lg:col-span-3 space-y-6">
            {activeTab === "profile" && (
              <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Profile Information</h2>
                  <button
                    disabled={isSaving}
                    onClick={handleSaveProfile}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 ${
                      isEditing
                        ? "bg-green-500 hover:bg-green-400 text-black"
                        : "bg-[#1f1f1f] hover:bg-[#2a2a2a] border border-[#2a2a2a] text-white"
                    }`}
                  >
                    {isSaving ? "Saving..." : isEditing ? "Save Changes" : "Edit Profile"}
                  </button>
                </div>

                <div className="flex items-center gap-6 mb-8">
                  <div className="w-24 h-24 bg-green-500/20 border-2 border-green-500/40 rounded-full flex items-center justify-center text-4xl font-black text-green-400">
                    {avatarLetter}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">{displayName}</h3>
                    <p className="text-gray-400 text-sm">{displayEmail}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Field label="Full Name" value={profile.name || ""} disabled />
                  <Field label="Email Address" value={profile.email || ""} disabled />
                  <Field
                    label="Phone Number"
                    value={profile.phone || ""}
                    disabled={!isEditing}
                    onChange={(v: string) => setProfile({ ...profile, phone: v })}
                  />
                  <Field
                    label="Preferred Connector"
                    value={profile.preferredConnector || "CCS2"}
                    disabled={!isEditing}
                    onChange={(v: string) => setProfile({ ...profile, preferredConnector: v })}
                    asSelect
                    options={["CCS2", "Type2", "CHAdeMO"]}
                  />
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-400 mb-2">Address</label>
                    <textarea
                      value={profile.address || ""}
                      onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                      disabled={!isEditing}
                      rows={3}
                      className="w-full px-4 py-3 bg-[#161616] border border-[#2a2a2a] rounded-lg text-white disabled:opacity-50 resize-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "vehicle" && (
              <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-6 space-y-6">
                <h2 className="text-xl font-bold">Vehicle Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Field
                    label="Vehicle Model"
                    value={profile.vehicleModel || ""}
                    disabled={!isEditing}
                    onChange={(v: string) => setProfile({ ...profile, vehicleModel: v })}
                  />
                  <Field
                    label="Vehicle Number"
                    value={profile.vehicleNumber || ""}
                    disabled={!isEditing}
                    onChange={(v: string) => setProfile({ ...profile, vehicleNumber: v })}
                  />
                </div>
                <button
                  disabled={isSaving}
                  onClick={handleSaveProfile}
                  className="px-4 py-2 rounded-lg bg-green-500 hover:bg-green-400 text-black font-medium transition-colors disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : isEditing ? "Save Changes" : "Edit Vehicle"}
                </button>
              </div>
            )}

            {activeTab === "wallet" && (
              <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-6">
                <h2 className="text-xl font-bold mb-4">Wallet</h2>
                <p className="text-gray-400 text-sm">Wallet & payment history coming soon.</p>
              </div>
            )}

            {activeTab === "preferences" && (
              <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-6 space-y-4">
                <h2 className="text-xl font-bold">Preferences</h2>
                {[
                  { key: "notifications", label: "Push Notifications" },
                  { key: "locationSharing", label: "Location Sharing" },
                  { key: "emailUpdates", label: "Email Updates" },
                  { key: "smsAlerts", label: "SMS Alerts" },
                  { key: "darkMode", label: "Dark Mode" },
                ].map(({ key, label }) => {
                  const prefs = profile.preferences ?? {};
                  const value = prefs[key] ?? false;
                  return (
                    <div key={key} className="flex items-center justify-between py-3 border-b border-[#1a1a1a] last:border-0">
                      <span className="text-sm text-gray-300">{label}</span>
                      <button
                        onClick={async () => {
                          const newPrefs = { ...prefs, [key]: !value };
                          setProfile({ ...profile, preferences: newPrefs });
                          try {
                            await fetch("/api/auth/profile", {
                              method: "PUT",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ [key]: !value }),
                            });
                          } catch (err) {
                            console.error("Error saving preference:", err);
                          }
                        }}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          value ? "bg-green-500" : "bg-[#2a2a2a]"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
                            value ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            <button
              onClick={handleLogout}
              className="text-red-400 hover:text-red-300 text-sm transition-colors"
            >
              Log out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  disabled,
  onChange,
  asSelect,
  options = [],
}: {
  label: string;
  value: string;
  disabled?: boolean;
  onChange?: (v: string) => void;
  asSelect?: boolean;
  options?: string[];
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-400 mb-2">{label}</label>
      {asSelect ? (
        <select
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={disabled}
          className="w-full px-4 py-3 bg-[#161616] border border-[#2a2a2a] rounded-lg text-white disabled:opacity-50"
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      ) : (
        <input
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={disabled}
          className="w-full px-4 py-3 bg-[#161616] border border-[#2a2a2a] rounded-lg text-white disabled:opacity-50"
        />
      )}
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0a0a]" />}>
      <ProfileContent />
    </Suspense>
  );
}
