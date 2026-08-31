"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Lottie from "lottie-react";
import {
  BatteryCharging,
  Bot,
  Map,
  MapPin,
  Search,
  Shield,
  Sprout,
  Sparkles,
  Timer,
  TimerReset,
  Wallet,
} from "lucide-react";

export default function Features() {
  const [mapAnimation, setMapAnimation] = useState(null);
  const [chargingAnimation, setChargingAnimation] = useState(null);
  const [businessAnimation, setBusinessAnimation] = useState(null);

  useEffect(() => {
    const loadAnimations = async () => {
      try {
        const [mapAnim, chargingAnim, businessAnim] = await Promise.all([
          fetch("/animations/Map browsing.json").then((r) => r.json()),
          fetch("/animations/Electric vehicle charging animation.json").then(
            (r) => r.json(),
          ),
          fetch("/animations/Business team.json").then((r) => r.json()),
        ]);
        setMapAnimation(mapAnim);
        setChargingAnimation(chargingAnim);
        setBusinessAnimation(businessAnim);
      } catch (error) {
        console.log("Animations not found, using fallback icons");
      }
    };
    loadAnimations();
  }, []);

  const features = [
    {
      title: "Interactive Map",
      description:
        "Explore 5000+ charging stations across India with real-time availability",
      icon: <Map size={52} color="#1cb048" />,
      details: [
        "Real-time station status",
        "Interactive markers",
        "Zoom & pan controls",
        "Satellite view",
      ],
    },
    {
      title: "AI-Powered Assistant",
      description: "Multilingual chatbot supporting 40+ Indian languages",
      icon: <Bot size={52} color="#1cb048" />,
      details: [
        "Natural language queries",
        "Voice commands",
        "Smart recommendations",
        "24/7 availability",
      ],
    },
    {
      title: "Smart Charging",
      description: "Intelligent charging solutions with route optimization",
      icon: <BatteryCharging size={52} color="#1cb048" />,
      details: [
        "Route planning",
        "Charging time estimates",
        "Cost calculations",
        "Energy optimization",
      ],
    },
    {
      title: "Location Services",
      description: "GPS-based station discovery with precise navigation",
      icon: <MapPin size={52} color="#1cb048" />,
      details: [
        "Auto-location detection",
        "Turn-by-turn directions",
        "Distance calculations",
        "Nearby amenities",
      ],
    },
    {
      title: "Real-time Updates",
      description: "Live station availability and pricing information",
      icon: <TimerReset size={52} color="#1cb048" />,
      details: [
        "Live availability",
        "Dynamic pricing",
        "Queue status",
        "Maintenance alerts",
      ],
    },
    {
      title: "Advanced Search",
      description: "Smart filtering with Google Places API integration",
      icon: <Search size={52} color="#1cb048" />,
      details: [
        "Text-based search",
        "Filter by connector type",
        "Price range filters",
        "Rating-based sorting",
      ],
    },
  ];

  const benefits = [
    {
      title: "Save Time",
      description: "Find available stations instantly without driving around",
      icon: <Timer size={48} />,
      stat: "70% faster",
    },
    {
      title: "Save Money",
      description:
        "Compare prices and find the most cost-effective charging options",
      icon: <Wallet size={48} />,
      stat: "30% savings",
    },
    {
      title: "Peace of Mind",
      description: "Never worry about finding a charging station on your route",
      icon: <Shield size={48} />,
      stat: "100% reliable",
    },
    {
      title: "Go Green",
      description:
        "Support sustainable transportation and reduce carbon footprint",
      icon: <Sprout size={48} />,
      stat: "Zero emissions",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[#050705] text-white">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative px-4 pb-20 pt-28 sm:px-6 lg:px-8"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.2),_transparent_32%),radial-gradient(circle_at_80%_20%,_rgba(34,197,94,0.14),_transparent_24%)]" />
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-300">
            <Sparkles size={14} />
            Product capabilities
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 text-4xl font-black text-white sm:text-5xl lg:text-7xl"
          >
            Features built for the{" "}
            <span className="bg-gradient-to-r from-emerald-300 via-green-300 to-cyan-300 bg-clip-text text-transparent">
              full EV journey
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mt-6 max-w-3xl mx-auto text-lg leading-8 text-slate-300 sm:text-xl"
          >
            From discovery to booking, routing to administration, Charge IQ keeps every part of the charging experience connected and clear.
          </motion.p>
        </div>
      </motion.section>

      {/* Main Features Grid */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        className="pb-20 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-emerald-400/30"
              >
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-400/10 transition-transform group-hover:scale-110">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  {feature.title}
                </h3>
                <p className="mb-6 leading-7 text-slate-300">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.details.map((detail, idx) => (
                    <li
                      key={idx}
                      className="flex items-center text-sm text-slate-400"
                    >
                      <span className="mr-2 text-emerald-300">✓</span>
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
        className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Why Choose <span className="text-emerald-300">Charge IQ</span>?
            </h2>
            <p className="max-w-3xl mx-auto text-xl leading-8 text-slate-300">
              Experience the benefits that make us India's preferred EV charging
              platform
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="group rounded-[2rem] border border-white/10 bg-white/5 p-8 text-center backdrop-blur-sm transition-all hover:border-emerald-400/30"
              >
                <div className="mb-4 flex h-16 items-center justify-center text-emerald-300 transition-transform group-hover:scale-110">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {benefit.title}
                </h3>
                <p className="mb-4 text-sm leading-6 text-slate-300">
                  {benefit.description}
                </p>
                <div className="text-2xl font-bold text-emerald-300">
                  {benefit.stat}
                </div>
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
              Technical <span className="text-emerald-300">Specifications</span>
            </h2>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur-sm"
            >
              <h3 className="text-2xl font-bold text-white mb-6">
                Platform Features
              </h3>
              <div className="space-y-4">
                {[
                  { label: "Charging Stations", value: "5000+" },
                  { label: "Supported Languages", value: "40+" },
                  { label: "Cities Covered", value: "100+" },
                  { label: "Real-time Updates", value: "24/7" },
                  { label: "API Response Time", value: "<200ms" },
                  { label: "Map Accuracy", value: "99.9%" },
                ].map((spec, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center py-2 border-b border-gray-700/50"
                  >
                    <span className="text-slate-300">{spec.label}</span>
                    <span className="font-bold text-emerald-300">
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur-sm"
            >
              <h3 className="text-2xl font-bold text-white mb-6">
                Technology Stack
              </h3>
              <div className="space-y-4">
                {[
                  { category: "Frontend", tech: "Next.js, React, TypeScript" },
                  { category: "Backend", tech: "FastAPI, Flask, Python" },
                  { category: "Database", tech: "Redis Cache" },
                  { category: "APIs", tech: "Google Maps, Places API" },
                  {
                    category: "AI/ML",
                    tech: "Groq, Natural Language Processing",
                  },
                  { category: "Deployment", tech: "Vercel, Railway, Docker" },
                ].map((tech, index) => (
                  <div key={index} className="py-2">
                    <div className="mb-1 font-semibold text-emerald-300">
                      {tech.category}
                    </div>
                    <div className="text-sm text-slate-300">{tech.tech}</div>
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
        className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10"
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
            className="mb-8 text-xl text-slate-300"
          >
            Join thousands of EV users who trust Charge IQ for their charging
            needs
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button
              onClick={() => window.open("/stations", "_self")}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-300 px-8 py-4 font-bold text-black transition-transform hover:scale-[1.02]"
            >
              Find Charging Stations
            </button>
            <button
              onClick={() => (window.location.href = "/")}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 px-8 py-4 font-bold text-white transition-colors hover:bg-white/5"
            >
              Back to Home
            </button>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}
