"use client";
import { useRouter } from "next/navigation";

export default function NetworksPage() {
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
            <h1 className="text-xl font-bold">Partner Networks</h1>
            <p className="text-sm text-gray-400">Expanding charging accessibility across India</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center shadow-2xl">
            <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"/>
            </svg>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-black text-white mb-6">
            Partner 
            <span className="text-green-400">Networks</span>
          </h1>
          
          <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed">
            We're building partnerships with India's leading charging networks to provide you seamless access to thousands of stations with unified payments and real-time availability.
          </p>

          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 px-6 py-3 rounded-xl font-semibold">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            Partnerships Expanding - 2026
          </div>
        </div>

        {/* Current Partners */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Current & Upcoming Partners</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl p-8 text-center hover:bg-[#161616] transition-colors">
              <div className="w-20 h-20 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Tata Power</h3>
              <p className="text-gray-400 text-sm mb-4">1000+ charging points across highways and cities</p>
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-green-400 text-xs font-medium">Live Integration</span>
              </div>
            </div>

            <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl p-8 text-center hover:bg-[#161616] transition-colors">
              <div className="w-20 h-20 bg-orange-500/10 border border-orange-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Ather Grid</h3>
              <p className="text-gray-400 text-sm mb-4">Fast charging network in major Indian cities</p>
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                <span className="text-orange-400 text-xs font-medium">Integration Soon</span>
              </div>
            </div>

            <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl p-8 text-center hover:bg-[#161616] transition-colors">
              <div className="w-20 h-20 bg-purple-500/10 border border-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">IOCL</h3>
              <p className="text-gray-400 text-sm mb-4">Petrol pumps with integrated EV charging</p>
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span className="text-purple-400 text-xs font-medium">In Discussion</span>
              </div>
            </div>

            <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl p-8 text-center hover:bg-[#161616] transition-colors">
              <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Reliance BP</h3>
              <p className="text-gray-400 text-sm mb-4">Premium charging at fuel station locations</p>
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                <span className="text-red-400 text-xs font-medium">Partnership Pending</span>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">One Account, All Networks</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl p-8">
              <div className="w-16 h-16 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Single Authentication</h3>
              <p className="text-gray-400 leading-relaxed">Access all partner networks with your ChargeIQ account. No need to register separately with each provider.</p>
            </div>

            <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl p-8">
              <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Unified Payments</h3>
              <p className="text-gray-400 leading-relaxed">One wallet, multiple networks. Pay for all your charging sessions through a single ChargeIQ wallet.</p>
            </div>

            <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl p-8">
              <div className="w-16 h-16 bg-purple-500/10 border border-purple-500/20 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Best Pricing</h3>
              <p className="text-gray-400 leading-relaxed">Exclusive member rates and bulk discounts across all partner networks. Save more on every charge.</p>
            </div>
          </div>
        </div>

        {/* Coverage Map */}
        <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl p-8 mb-16">
          <h2 className="text-2xl font-bold text-white text-center mb-8">Network Coverage Across India</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-black text-green-400 mb-2">5,000+</div>
              <p className="text-gray-400">Total Stations</p>
            </div>
            <div>
              <div className="text-3xl font-black text-blue-400 mb-2">28</div>
              <p className="text-gray-400">States & UTs</p>
            </div>
            <div>
              <div className="text-3xl font-black text-purple-400 mb-2">150+</div>
              <p className="text-gray-400">Cities Covered</p>
            </div>
            <div>
              <div className="text-3xl font-black text-yellow-400 mb-2">24/7</div>
              <p className="text-gray-400">Support Available</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Join Our Partner Network Waitlist</h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Be the first to know when we launch new network partnerships. Get early access to exclusive rates and features.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto mb-8">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-6 py-4 bg-[#1f1f1f] border border-[#2a2a2a] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
            <button className="px-8 py-4 bg-blue-500 hover:bg-blue-400 text-white font-semibold rounded-xl transition-colors">
              Join Waitlist
            </button>
          </div>

          <p className="text-sm text-gray-500 mb-8">
            Get notified about new partnerships and exclusive network access.
          </p>

          {/* Network Partnership Interest */}
          <div className="pt-8 border-t border-[#1a1a1a]">
            <p className="text-gray-400 text-sm mb-4">
              Are you a charging network operator interested in partnership?
            </p>
            <button 
              onClick={() => router.push('/contact')}
              className="px-6 py-3 bg-[#1f1f1f] hover:bg-[#2a2a2a] border border-[#2a2a2a] text-white rounded-xl transition-colors"
            >
              Partner With Us
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}