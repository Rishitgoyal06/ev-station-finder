"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

const guideSteps = [
  {
    id: 1,
    title: "Create Your Account",
    description: "Sign up for ChargeIQ with your email and set up your profile with vehicle details for personalized recommendations.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
      </svg>
    ),
    tips: ["Use a valid email for account verification", "Add your vehicle model for better station recommendations", "Enable location services for nearby stations"]
  },
  {
    id: 2,
    title: "Find Charging Stations",
    description: "Use our interactive map or search feature to discover EV charging stations near you with real-time availability.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path d="M12 2C8.686 2 6 4.686 6 8c0 4.5 6 12 6 12s6-7.5 6-12c0-3.314-2.686-6-6-6z"/>
        <circle cx="12" cy="8" r="2"/>
      </svg>
    ),
    tips: ["Use filters to find specific connector types", "Check availability status before traveling", "Save frequently used stations as favorites"]
  },
  {
    id: 3,
    title: "Check Station Details",
    description: "View comprehensive information about each station including connector types, pricing, amenities, and user reviews.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <circle cx="12" cy="12" r="9"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
    ),
    tips: ["Read recent reviews for station quality", "Check operating hours before visiting", "Verify connector compatibility with your vehicle"]
  },
  {
    id: 4,
    title: "Book Your Slot",
    description: "Reserve a charging slot in advance to guarantee availability. Select your preferred time and connector type.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <rect x="3" y="4" width="18" height="18" rx="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
    tips: ["Book during off-peak hours for better availability", "Arrive 5 minutes before your slot time", "Keep your booking confirmation ready"]
  },
  {
    id: 5,
    title: "Make Payment",
    description: "Secure payment through multiple options including wallet, UPI, cards, and net banking. Get instant confirmation.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <rect x="1" y="4" width="22" height="16" rx="2"/>
        <line x1="1" y1="10" x2="23" y2="10"/>
      </svg>
    ),
    tips: ["Add money to wallet for faster checkout", "Keep payment methods updated", "Save receipts for expense tracking"]
  },
  {
    id: 6,
    title: "Start Charging",
    description: "Arrive at the station, locate your reserved slot, and use the ChargeIQ app to initiate charging remotely.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
      </svg>
    ),
    tips: ["Scan QR code or use app to start charging", "Monitor charging progress in real-time", "Get notifications when charging is complete"]
  }
];

export default function EVGuidePage() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(1);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white py-20">
      {/* Header */}
      <div className="bg-[#111] border-b border-[#1a1a1a] px-6 py-4 fixed top-0 left-0 right-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 hover:bg-[#1f1f1f] rounded-xl transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          <div>
            <h1 className="text-xl font-bold">EV Charging Guide</h1>
            <p className="text-sm text-gray-400">Step-by-step guide to using ChargeIQ</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-green-500 to-green-600 rounded-3xl flex items-center justify-center shadow-2xl">
            <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
            </svg>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-black text-white mb-6">
            EV Charging 
            <span className="text-green-400">Guide</span>
          </h1>
          
          <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed">
            Your complete step-by-step guide to using ChargeIQ for hassle-free electric vehicle charging across India
          </p>

          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-400 px-6 py-3 rounded-xl font-semibold">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
            </svg>
            Interactive Guide
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-400">Progress</span>
            <span className="text-sm text-green-400 font-medium">{activeStep} of {guideSteps.length}</span>
          </div>
          <div className="w-full bg-[#1f1f1f] rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-green-500 to-green-400 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(activeStep / guideSteps.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {guideSteps.map((step) => (
            <div
              key={step.id}
              className={`bg-[#111] border border-[#1a1a1a] rounded-2xl p-8 transition-all duration-300 cursor-pointer hover:bg-[#161616] ${
                activeStep === step.id ? 'ring-2 ring-green-500/30 border-green-500/30 bg-[#161616]' : ''
              }`}
              onClick={() => setActiveStep(step.id)}
            >
              {/* Step Header */}
              <div className="flex items-start gap-6 mb-6">
                <div className="flex-shrink-0">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${
                    activeStep === step.id 
                      ? 'bg-gradient-to-br from-green-500 to-green-600' 
                      : 'bg-[#1f1f1f] border border-[#2a2a2a]'
                  }`}>
                    <div className="text-white">
                      {step.icon}
                    </div>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                      activeStep === step.id ? 'bg-green-500 text-black' : 'bg-[#1f1f1f] text-gray-400 border border-[#2a2a2a]'
                    }`}>
                      {step.id}
                    </span>
                    <h3 className="text-xl font-bold text-white">{step.title}</h3>
                  </div>
                  <p className="text-gray-400 leading-relaxed">{step.description}</p>
                </div>
              </div>

              {/* Tips (show when active) */}
              {activeStep === step.id && (
                <div className="mt-6 pt-6 border-t border-[#1a1a1a]">
                  <h4 className="text-green-400 font-semibold mb-4 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                    </svg>
                    Pro Tips
                  </h4>
                  <ul className="space-y-3">
                    {step.tips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-300 text-sm leading-relaxed">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-center gap-4 mb-16">
          <button
            onClick={() => setActiveStep(Math.max(1, activeStep - 1))}
            disabled={activeStep === 1}
            className="flex items-center gap-2 px-6 py-3 bg-[#1f1f1f] hover:bg-[#2a2a2a] disabled:opacity-50 disabled:cursor-not-allowed border border-[#2a2a2a] rounded-xl transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
            Previous
          </button>
          
          <div className="flex gap-2">
            {guideSteps.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveStep(index + 1)}
                className={`w-3 h-3 rounded-full transition-all ${
                  activeStep === index + 1 ? 'bg-green-500' : 'bg-[#2a2a2a] hover:bg-[#3a3a3a]'
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => setActiveStep(Math.min(guideSteps.length, activeStep + 1))}
            disabled={activeStep === guideSteps.length}
            className="flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold rounded-xl transition-colors"
          >
            Next
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>

        {/* Help Section */}
        <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl p-8 mb-16">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">Need More Help?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">24/7 Support</h3>
              <p className="text-gray-400 leading-relaxed">Get help anytime through our in-app chat support system for any questions or issues.</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-purple-500/10 border border-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">Call Support</h3>
              <p className="text-gray-400 leading-relaxed">Speak directly with our experts at +91 9999999999 for personalized assistance.</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">Video Tutorials</h3>
              <p className="text-gray-400 leading-relaxed">Watch detailed video guides on our help center for visual step-by-step instructions.</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Ready to Start Charging?</h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Now that you know how ChargeIQ works, create your account and start finding charging stations near you.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => router.push('/dashboard')}
              className="px-8 py-4 bg-green-500 hover:bg-green-400 text-black font-semibold rounded-xl transition-colors"
            >
              Get Started Now
            </button>
            <button 
              onClick={() => router.push('/contact')}
              className="px-8 py-4 bg-[#1f1f1f] hover:bg-[#2a2a2a] border border-[#2a2a2a] text-white font-semibold rounded-xl transition-colors"
            >
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}