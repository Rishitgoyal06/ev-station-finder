"use client";
import { useRouter } from "next/navigation";

export default function MobileAppPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white py-20">
      {/* Header */}
      <div className="bg-[#111] border-b border-[#1a1a1a] px-6 py-4 fixed top-0 left-0 right-0 z-50">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 hover:bg-[#1f1f1f] rounded-xl transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          <div>
            <h1 className="text-xl font-bold">Mobile App</h1>
            <p className="text-sm text-gray-400">Coming soon to iOS and Android</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-green-500 to-green-600 rounded-3xl flex items-center justify-center shadow-2xl">
            <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 15h3M1 9h3M1 15h3"/>
            </svg>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-black text-white mb-6">
            ChargeIQ 
            <span className="text-green-400">Mobile</span>
          </h1>
          
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
            We're building the ultimate mobile experience for EV charging. Get ready for seamless charging on the go with real-time updates and smart features.
          </p>

          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-400 px-6 py-3 rounded-xl font-semibold">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            Coming Soon - 2026
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl p-8 hover:bg-[#161616] transition-colors">
            <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Real-time Updates</h3>
            <p className="text-gray-400 leading-relaxed">Get instant notifications about station availability, charging progress, and booking confirmations.</p>
          </div>

          <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl p-8 hover:bg-[#161616] transition-colors">
            <div className="w-16 h-16 bg-purple-500/10 border border-purple-500/20 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path d="M12 2C8.686 2 6 4.686 6 8c0 4.5 6 12 6 12s6-7.5 6-12c0-3.314-2.686-6-6-6z"/>
                <circle cx="12" cy="8" r="2"/>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Offline Maps</h3>
            <p className="text-gray-400 leading-relaxed">Navigate to charging stations even without internet connection using downloaded offline maps.</p>
          </div>

          <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl p-8 hover:bg-[#161616] transition-colors">
            <div className="w-16 h-16 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Smart Charging</h3>
            <p className="text-gray-400 leading-relaxed">AI-powered recommendations for optimal charging times and routes based on your usage patterns.</p>
          </div>

          <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl p-8 hover:bg-[#161616] transition-colors">
            <div className="w-16 h-16 bg-yellow-500/10 border border-yellow-500/20 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Quick Pay</h3>
            <p className="text-gray-400 leading-relaxed">Lightning-fast payments with saved cards, UPI, and digital wallets for seamless transactions.</p>
          </div>

          <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl p-8 hover:bg-[#161616] transition-colors">
            <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Push Notifications</h3>
            <p className="text-gray-400 leading-relaxed">Stay informed with smart notifications about your bookings, charging status, and account updates.</p>
          </div>

          <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl p-8 hover:bg-[#161616] transition-colors">
            <div className="w-16 h-16 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82 1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1 1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-1.82.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1.51 1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1z"/>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Personalization</h3>
            <p className="text-gray-400 leading-relaxed">Customize your experience with themes, preferred stations, and personalized charging schedules.</p>
          </div>
        </div>

        {/* Platform Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-800" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.1 22C7.79 22.05 6.8 20.68 5.96 19.47C4.25 17 2.94 12.45 4.7 9.39C5.57 7.87 7.13 6.91 8.82 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z"/>
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">iOS App</h3>
                <p className="text-gray-400">Native iOS experience with seamless integration</p>
              </div>
            </div>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                iOS 14.0 and later support
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                Apple Pay integration
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                Siri Shortcuts support
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                Apple Maps integration
              </li>
            </ul>
          </div>

          <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Android App</h3>
                <p className="text-gray-400">Optimized for Android with Material Design</p>
              </div>
            </div>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                Android 8.0 (API 26) and above
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                Google Pay integration
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                Android Auto support
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                Google Maps integration
              </li>
            </ul>
          </div>
        </div>

        {/* Notify Section */}
        <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Get Notified When We Launch</h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Be among the first to experience the future of EV charging. Join our waitlist and get exclusive early access to the ChargeIQ mobile app.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto mb-8">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-6 py-4 bg-[#1f1f1f] border border-[#2a2a2a] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors"
            />
            <button className="px-8 py-4 bg-green-500 hover:bg-green-400 text-black font-semibold rounded-xl transition-colors">
              Notify Me
            </button>
          </div>

          <p className="text-sm text-gray-500">
            We'll only send you updates about the app launch. No spam, ever.
          </p>
        </div>
      </div>
    </div>
  );
}