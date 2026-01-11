'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Lottie from 'lottie-react';

export default function Features() {
  const [mapAnimation, setMapAnimation] = useState(null);
  const [chargingAnimation, setChargingAnimation] = useState(null);
  const [businessAnimation, setBusinessAnimation] = useState(null);

  useEffect(() => {
    const loadAnimations = async () => {
      try {
        const [mapAnim, chargingAnim, businessAnim] = await Promise.all([
          fetch('/animations/Map browsing.json').then(r => r.json()),
          fetch('/animations/Electric vehicle charging animation.json').then(r => r.json()),
          fetch('/animations/Business team.json').then(r => r.json())
        ]);
        setMapAnimation(mapAnim);
        setChargingAnimation(chargingAnim);
        setBusinessAnimation(businessAnim);
      } catch (error) {
        console.log('Animations not found, using fallback icons');
      }
    };
    loadAnimations();
  }, []);

  const features = [
    {
      title: "Interactive Map",
      description: "Explore 5000+ charging stations across India with real-time availability",
      icon: "🗺️",
      animation: mapAnimation,
      details: ["Real-time station status", "Interactive markers", "Zoom & pan controls", "Satellite view"]
    },
    {
      title: "AI-Powered Assistant",
      description: "Multilingual chatbot supporting 40+ Indian languages",
      icon: "🤖",
      animation: businessAnimation,
      details: ["Natural language queries", "Voice commands", "Smart recommendations", "24/7 availability"]
    },
    {
      title: "Smart Charging",
      description: "Intelligent charging solutions with route optimization",
      icon: "⚡",
      animation: chargingAnimation,
      details: ["Route planning", "Charging time estimates", "Cost calculations", "Energy optimization"]
    },
    {
      title: "Location Services",
      description: "GPS-based station discovery with precise navigation",
      icon: "📍",
      details: ["Auto-location detection", "Turn-by-turn directions", "Distance calculations", "Nearby amenities"]
    },
    {
      title: "Real-time Updates",
      description: "Live station availability and pricing information",
      icon: "🔄",
      details: ["Live availability", "Dynamic pricing", "Queue status", "Maintenance alerts"]
    },
    {
      title: "Advanced Search",
      description: "Smart filtering with Google Places API integration",
      icon: "🔍",
      details: ["Text-based search", "Filter by connector type", "Price range filters", "Rating-based sorting"]
    }
  ];

  const benefits = [
    {
      title: "Save Time",
      description: "Find available stations instantly without driving around",
      icon: "⏰",
      stat: "70% faster"
    },
    {
      title: "Save Money",
      description: "Compare prices and find the most cost-effective charging options",
      icon: "💰",
      stat: "30% savings"
    },
    {
      title: "Peace of Mind",
      description: "Never worry about finding a charging station on your route",
      icon: "🛡️",
      stat: "100% reliable"
    },
    {
      title: "Go Green",
      description: "Support sustainable transportation and reduce carbon footprint",
      icon: "🌱",
      stat: "Zero emissions"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-emerald-950/20 to-gray-950">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="pt-32 pb-20 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6"
          >
            Powerful <span className="text-green-400">Features</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto mb-12"
          >
            Discover everything that makes Charge IQ the ultimate EV charging companion
          </motion.p>
        </div>
      </motion.section>

      {/* Main Features Grid */}
      <motion.section 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        className="py-20 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                variants={itemVariants}
                className="bg-gray-900/50 backdrop-blur-md rounded-2xl p-8 border border-green-400/20 hover:border-green-400/40 transition-all group hover:scale-105"
              >
                <div className="h-20 mb-6 flex items-center justify-center">
                  {feature.animation ? (
                    <Lottie 
                      animationData={feature.animation} 
                      loop={true}
                      className="w-16 h-16 group-hover:scale-110 transition-transform"
                    />
                  ) : (
                    <div className="text-4xl group-hover:scale-110 transition-transform">
                      {feature.icon}
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-300 mb-6">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.details.map((detail, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-400">
                      <span className="text-green-400 mr-2">✓</span>
                      {detail}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Benefits Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-emerald-950/30 to-gray-950/30"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Why Choose <span className="text-green-400">Charge IQ</span>?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Experience the benefits that make us India's preferred EV charging platform
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="text-center bg-gray-900/50 backdrop-blur-md rounded-2xl p-8 border border-green-400/20 hover:border-green-400/40 transition-all group"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{benefit.title}</h3>
                <p className="text-gray-300 mb-4 text-sm">{benefit.description}</p>
                <div className="text-2xl font-bold text-green-400">{benefit.stat}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Technical Specifications */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="py-20 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Technical <span className="text-green-400">Specifications</span>
            </h2>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="bg-gray-900/50 backdrop-blur-md rounded-2xl p-8 border border-green-400/20"
            >
              <h3 className="text-2xl font-bold text-white mb-6">Platform Features</h3>
              <div className="space-y-4">
                {[
                  { label: "Charging Stations", value: "5000+" },
                  { label: "Supported Languages", value: "40+" },
                  { label: "Cities Covered", value: "100+" },
                  { label: "Real-time Updates", value: "24/7" },
                  { label: "API Response Time", value: "<200ms" },
                  { label: "Map Accuracy", value: "99.9%" }
                ].map((spec, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-700/50">
                    <span className="text-gray-300">{spec.label}</span>
                    <span className="text-green-400 font-bold">{spec.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="bg-gray-900/50 backdrop-blur-md rounded-2xl p-8 border border-green-400/20"
            >
              <h3 className="text-2xl font-bold text-white mb-6">Technology Stack</h3>
              <div className="space-y-4">
                {[
                  { category: "Frontend", tech: "Next.js, React, TypeScript" },
                  { category: "Backend", tech: "FastAPI, Flask, Python" },
                  { category: "Database", tech: "MongoDB, Redis Cache" },
                  { category: "APIs", tech: "Google Maps, Places API" },
                  { category: "AI/ML", tech: "Groq, Natural Language Processing" },
                  { category: "Deployment", tech: "Vercel, Railway, Docker" }
                ].map((tech, index) => (
                  <div key={index} className="py-2">
                    <div className="text-green-400 font-semibold mb-1">{tech.category}</div>
                    <div className="text-gray-300 text-sm">{tech.tech}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-green-400/10 to-emerald-600/10"
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl font-bold text-white mb-6"
          >
            Ready to Experience the Future?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-300 mb-8"
          >
            Join thousands of EV users who trust Charge IQ for their charging needs
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button 
              onClick={() => window.open('http://localhost:8000', '_blank')}
              className="px-8 py-4 bg-green-400 text-gray-900 font-bold rounded-xl hover:bg-green-300 transition-colors"
            >
              Find Charging Stations
            </button>
            <button 
              onClick={() => window.location.href = '/'}
              className="px-8 py-4 border border-green-400 text-green-400 font-bold rounded-xl hover:bg-green-400/10 transition-colors"
            >
              Back to Home
            </button>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}