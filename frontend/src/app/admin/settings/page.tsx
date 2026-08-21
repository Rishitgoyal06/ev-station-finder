"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminSettings() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("general");
  const [settings, setSettings] = useState({
    // General Settings
    appName: "ChargeIQ",
    companyName: "ChargeIQ Technologies",
    supportEmail: "support@chargeiq.com",
    maxBookingDuration: 120,
    defaultCancellationTime: 30,
    
    // Pricing Settings
    platformCommission: 10,
    processingFee: 2.5,
    cancellationFee: 25,
    
    // Notification Settings
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    maintenanceAlerts: true,
    
    // Security Settings
    sessionTimeout: 60,
    maxLoginAttempts: 3,
    passwordMinLength: 8,
    requireTwoFA: false,
    
    // API Settings
    rateLimitPerMinute: 100,
    maxFileUploadSize: 10,
    apiTimeout: 30,
    
    // Feature Flags
    enableRealtimeUpdates: true,
    enableAdvancedFilters: true,
    enablePriceAlerts: true,
    enableWaitlist: false
  });

  const sections = [
    { id: "general", name: "General", icon: "⚙️" },
    { id: "pricing", name: "Pricing & Fees", icon: "💰" },
    { id: "notifications", name: "Notifications", icon: "🔔" },
    { id: "security", name: "Security", icon: "🔒" },
    { id: "api", name: "API & Limits", icon: "🔌" },
    { id: "features", name: "Feature Flags", icon: "🚩" },
    { id: "integrations", name: "Integrations", icon: "🔗" },
    { id: "backup", name: "Backup & Data", icon: "💾" }
  ];

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const saveSettings = () => {
    // Here you would make an API call to save settings
    console.log("Saving settings:", settings);
    // Show success message
  };

  const resetToDefaults = () => {
    // Reset to default values
    console.log("Resetting to defaults");
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-20">
      {/* Header */}
      <div className="bg-[#111] border-b border-[#1a1a1a] px-6 py-4 fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.back()}
              className="p-2 hover:bg-[#1f1f1f] rounded-xl transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </button>
            <div>
              <h1 className="text-xl font-bold">System Settings</h1>
              <p className="text-sm text-gray-400">Manage global system configuration</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={resetToDefaults}
              className="px-4 py-2 bg-[#1f1f1f] hover:bg-[#2a2a2a] border border-[#2a2a2a] text-gray-300 rounded-lg transition-colors"
            >
              Reset to Defaults
            </button>
            <button
              onClick={saveSettings}
              className="px-4 py-2 bg-green-500 hover:bg-green-400 text-black font-medium rounded-lg transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Settings Navigation */}
          <div className="lg:col-span-1">
            <div className="space-y-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all text-left ${
                    activeSection === section.id
                      ? "bg-green-500/20 border border-green-500/40 text-green-400"
                      : "bg-[#111] border border-[#1a1a1a] text-gray-300 hover:border-[#2a2a2a]"
                  }`}
                >
                  <span className="text-lg">{section.icon}</span>
                  <span className="font-medium">{section.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-3">
            <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-6">
              {activeSection === "general" && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold">General Settings</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Application Name</label>
                      <input
                        type="text"
                        value={settings.appName}
                        onChange={(e) => updateSetting("appName", e.target.value)}
                        className="w-full bg-[#161616] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Company Name</label>
                      <input
                        type="text"
                        value={settings.companyName}
                        onChange={(e) => updateSetting("companyName", e.target.value)}
                        className="w-full bg-[#161616] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Support Email</label>
                      <input
                        type="email"
                        value={settings.supportEmail}
                        onChange={(e) => updateSetting("supportEmail", e.target.value)}
                        className="w-full bg-[#161616] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Max Booking Duration (minutes)</label>
                      <input
                        type="number"
                        value={settings.maxBookingDuration}
                        onChange={(e) => updateSetting("maxBookingDuration", parseInt(e.target.value))}
                        className="w-full bg-[#161616] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeSection === "pricing" && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold">Pricing & Fee Settings</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Platform Commission (%)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={settings.platformCommission}
                        onChange={(e) => updateSetting("platformCommission", parseFloat(e.target.value))}
                        className="w-full bg-[#161616] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Processing Fee (%)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={settings.processingFee}
                        onChange={(e) => updateSetting("processingFee", parseFloat(e.target.value))}
                        className="w-full bg-[#161616] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Cancellation Fee (₹)</label>
                      <input
                        type="number"
                        value={settings.cancellationFee}
                        onChange={(e) => updateSetting("cancellationFee", parseInt(e.target.value))}
                        className="w-full bg-[#161616] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500"
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <h4 className="font-medium text-blue-400 mb-2">Fee Structure Preview</h4>
                    <p className="text-sm text-blue-300">
                      For a ₹100 charging session: Platform Commission: ₹{settings.platformCommission}, 
                      Processing Fee: ₹{settings.processingFee.toFixed(2)}
                    </p>
                  </div>
                </div>
              )}

              {activeSection === "notifications" && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold">Notification Settings</h3>
                  
                  <div className="space-y-4">
                    {[
                      { key: "emailNotifications", label: "Email Notifications", description: "Send notifications via email" },
                      { key: "smsNotifications", label: "SMS Notifications", description: "Send notifications via SMS" },
                      { key: "pushNotifications", label: "Push Notifications", description: "Send push notifications to mobile apps" },
                      { key: "maintenanceAlerts", label: "Maintenance Alerts", description: "Automatic alerts for station maintenance" }
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between p-4 bg-[#161616] rounded-lg">
                        <div>
                          <h4 className="font-medium text-white">{item.label}</h4>
                          <p className="text-sm text-gray-400">{item.description}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings[item.key as keyof typeof settings] as boolean}
                            onChange={(e) => updateSetting(item.key, e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeSection === "security" && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold">Security Settings</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Session Timeout (minutes)</label>
                      <input
                        type="number"
                        value={settings.sessionTimeout}
                        onChange={(e) => updateSetting("sessionTimeout", parseInt(e.target.value))}
                        className="w-full bg-[#161616] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Max Login Attempts</label>
                      <input
                        type="number"
                        value={settings.maxLoginAttempts}
                        onChange={(e) => updateSetting("maxLoginAttempts", parseInt(e.target.value))}
                        className="w-full bg-[#161616] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-[#161616] rounded-lg">
                    <div>
                      <h4 className="font-medium text-white">Require Two-Factor Authentication</h4>
                      <p className="text-sm text-gray-400">Force 2FA for all admin accounts</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.requireTwoFA}
                        onChange={(e) => updateSetting("requireTwoFA", e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                    </label>
                  </div>
                </div>
              )}

              {activeSection === "features" && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold">Feature Flags</h3>
                  
                  <div className="space-y-4">
                    {[
                      { key: "enableRealtimeUpdates", label: "Real-time Updates", description: "Enable WebSocket connections for live updates" },
                      { key: "enableAdvancedFilters", label: "Advanced Filters", description: "Show advanced filtering options in station search" },
                      { key: "enablePriceAlerts", label: "Price Alerts", description: "Allow users to set price drop notifications" },
                      { key: "enableWaitlist", label: "Booking Waitlist", description: "Enable waitlist for fully booked stations" }
                    ].map((feature) => (
                      <div key={feature.key} className="flex items-center justify-between p-4 bg-[#161616] rounded-lg">
                        <div>
                          <h4 className="font-medium text-white">{feature.label}</h4>
                          <p className="text-sm text-gray-400">{feature.description}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings[feature.key as keyof typeof settings] as boolean}
                            onChange={(e) => updateSetting(feature.key, e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeSection === "integrations" && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold">External Integrations</h3>
                  
                  <div className="space-y-4">
                    {[
                      { name: "Google Maps API", status: "Connected", description: "Location services and directions" },
                      { name: "Razorpay", status: "Connected", description: "Payment processing" },
                      { name: "Twilio SMS", status: "Disconnected", description: "SMS notifications" },
                      { name: "Firebase FCM", status: "Connected", description: "Push notifications" },
                      { name: "AWS S3", status: "Connected", description: "File storage" }
                    ].map((integration, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-[#161616] rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${
                            integration.status === "Connected" ? "bg-green-400" : "bg-red-400"
                          }`}></div>
                          <div>
                            <h4 className="font-medium text-white">{integration.name}</h4>
                            <p className="text-sm text-gray-400">{integration.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-sm px-2 py-1 rounded-full ${
                            integration.status === "Connected" 
                              ? "bg-green-500/20 text-green-400" 
                              : "bg-red-500/20 text-red-400"
                          }`}>
                            {integration.status}
                          </span>
                          <button className="px-3 py-1 bg-[#1f1f1f] hover:bg-[#2a2a2a] text-gray-300 text-sm rounded-lg transition-colors">
                            Configure
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add more sections as needed */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}