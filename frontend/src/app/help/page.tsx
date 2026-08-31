"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HelpPage() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("general");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const helpCategories = [
    { id: "general", name: "Getting Started", icon: "🚀", count: 8 },
    { id: "booking", name: "Booking & Payments", icon: "💳", count: 12 },
    { id: "charging", name: "Charging Process", icon: "⚡", count: 10 },
    { id: "account", name: "Account & Profile", icon: "👤", count: 6 },
    { id: "troubleshooting", name: "Troubleshooting", icon: "🔧", count: 9 },
    { id: "owners", name: "Station Owners", icon: "🏢", count: 7 }
  ];

  const faqData = {
    general: [
      {
        id: 1,
        question: "How do I find charging stations near me?",
        answer: "Use the main dashboard map or the 'Find Stations' feature. You can filter by distance, connector type, availability, and amenities. The app uses your location to show nearby stations."
      },
      {
        id: 2,
        question: "What types of charging connectors are supported?",
        answer: "We support CCS2, Type 2, and CHAdeMO connectors. Each station listing shows available connector types and power ratings."
      },
      {
        id: 3,
        question: "How do I create an account?",
        answer: "Click 'Sign Up' on the home page, enter your email and create a password. You can also sign up using Google or Apple ID for faster registration."
      }
    ],
    booking: [
      {
        id: 4,
        question: "How do I book a charging slot?",
        answer: "Find a station, select an available time slot, choose your connector type, and complete the payment. You'll receive a confirmation with booking details."
      },
      {
        id: 5,
        question: "Can I modify or cancel my booking?",
        answer: "Yes, you can modify or cancel bookings up to 30 minutes before your scheduled time. Cancellations made more than 2 hours in advance receive full refunds."
      },
      {
        id: 6,
        question: "What payment methods are accepted?",
        answer: "We accept all major credit/debit cards, UPI, net banking, and digital wallets through our secure payment partner Razorpay."
      }
    ],
    charging: [
      {
        id: 7,
        question: "How long does charging typically take?",
        answer: "Charging time depends on your vehicle's battery capacity and the charger power. DC fast charging (50-150kW) typically takes 30-45 minutes for 80% charge."
      },
      {
        id: 8,
        question: "What if my vehicle doesn't charge properly?",
        answer: "First, ensure the connector is properly seated. If issues persist, contact station support via the app or call the emergency number displayed at the station."
      }
    ]
  };

  const quickActions = [
    {
      title: "Contact Support",
      description: "Get help from our support team",
      icon: "📞",
      action: () => window.open("mailto:support@chargeiq.in?subject=Support Request", "_blank"),
      color: "bg-green-500/20 text-green-400 border-green-500/30"
    },
    {
      title: "Report an Issue",
      description: "Report problems with stations or app",
      icon: "⚠️",
      action: () => window.open("mailto:support@chargeiq.in?subject=Issue Report&body=Describe the issue:%0A%0AStation (if applicable):%0ASteps to reproduce:", "_blank"),
      color: "bg-red-500/20 text-red-400 border-red-500/30"
    },
    {
      title: "Live Chat",
      description: "Chat with our AI assistant",
      icon: "💬",
      action: () => router.push("/?chat=open"),
      color: "bg-blue-500/20 text-blue-400 border-blue-500/30"
    },
    {
      title: "Video Tutorials",
      description: "Watch step-by-step guides",
      icon: "🎥",
      action: () => window.open("https://www.youtube.com/@chargeiq", "_blank"),
      color: "bg-purple-500/20 text-purple-400 border-purple-500/30"
    }
  ];

  const filteredFAQs = faqData[activeCategory as keyof typeof faqData]?.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-20">
      {/* Header */}
      <div className="bg-[#111] border-b border-[#1a1a1a] px-6 py-4 fixed top-0 left-0 right-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
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
              <h1 className="text-xl font-bold">Help Center</h1>
              <p className="text-sm text-gray-400">Find answers and get support</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-green-500 hover:bg-green-400 text-black font-medium rounded-lg transition-colors">
              Contact Support
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for help articles, FAQs, or guides..."
              className="w-full bg-[#111] border border-[#1a1a1a] rounded-xl px-5 py-4 pl-12 text-white placeholder-gray-400 focus:outline-none focus:border-green-500 transition-colors"
            />
            <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className={`p-4 border rounded-xl hover:scale-105 transition-all text-left ${action.color}`}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{action.icon}</span>
                <h3 className="font-semibold">{action.title}</h3>
              </div>
              <p className="text-sm opacity-80">{action.description}</p>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-bold mb-4">Categories</h3>
            <div className="space-y-2">
              {helpCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                    activeCategory === category.id
                      ? "bg-green-500/20 border border-green-500/40 text-green-400"
                      : "bg-[#111] border border-[#1a1a1a] text-gray-300 hover:border-[#2a2a2a]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{category.icon}</span>
                    <span className="font-medium text-sm">{category.name}</span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    activeCategory === category.id
                      ? "bg-green-500/30 text-green-300"
                      : "bg-[#1f1f1f] text-gray-400"
                  }`}>
                    {category.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Emergency Contact */}
            <div className="mt-8 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-red-400">🚨</span>
                <h4 className="font-bold text-red-400">Emergency</h4>
              </div>
              <p className="text-xs text-red-300 mb-3">
                For urgent issues at charging stations
              </p>
              <button className="w-full bg-red-500 hover:bg-red-400 text-white font-bold py-2 rounded-lg transition-colors">
                Call Emergency: 1800-CHARGE
              </button>
            </div>
          </div>

          {/* FAQ Content */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">
                {helpCategories.find(c => c.id === activeCategory)?.name} 
                <span className="text-sm font-normal text-gray-400 ml-2">
                  ({filteredFAQs.length} articles)
                </span>
              </h3>
            </div>

            {searchQuery && (
              <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <p className="text-sm text-blue-300">
                  Showing results for "<strong>{searchQuery}</strong>"
                </p>
              </div>
            )}

            <div className="space-y-4">
              {filteredFAQs.length > 0 ? (
                filteredFAQs.map((faq) => (
                  <div key={faq.id} className="bg-[#111] border border-[#1a1a1a] rounded-xl overflow-hidden">
                    <button
                      onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                      className="w-full flex items-center justify-between p-5 text-left hover:bg-[#161616] transition-colors"
                    >
                      <h4 className="font-semibold text-white pr-4">{faq.question}</h4>
                      <svg 
                        className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${
                          expandedFAQ === faq.id ? "rotate-180" : ""
                        }`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                      </svg>
                    </button>
                    
                    {expandedFAQ === faq.id && (
                      <div className="px-5 pb-5 pt-0 border-t border-[#1a1a1a]">
                        <p className="text-gray-300 text-sm leading-relaxed mt-3">
                          {faq.answer}
                        </p>
                        
                        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-[#1a1a1a]">
                          <span className="text-xs text-gray-400">Was this helpful?</span>
                          <div className="flex items-center gap-2">
                            <button className="p-1 hover:bg-green-500/20 text-green-400 rounded transition-colors">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"/>
                              </svg>
                            </button>
                            <button className="p-1 hover:bg-red-500/20 text-red-400 rounded transition-colors">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018c.163 0 .326.02.485.06L17 4m-7 10v2a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5"/>
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-[#111] rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">No results found</h4>
                  <p className="text-gray-400 mb-4">
                    {searchQuery 
                      ? `No articles match "${searchQuery}". Try different keywords.`
                      : "No articles available in this category yet."
                    }
                  </p>
                  <button 
                    onClick={() => setSearchQuery("")}
                    className="px-4 py-2 bg-green-500 hover:bg-green-400 text-black font-medium rounded-lg transition-colors"
                  >
                    Clear Search
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}