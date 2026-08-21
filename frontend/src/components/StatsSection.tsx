"use client";
import React from "react";
import { motion } from "framer-motion";
import { IconBolt, IconUsers, IconMapPin, IconTrendingUp, IconLeaf, IconClock } from "@tabler/icons-react";

const stats = [
  {
    icon: IconMapPin,
    number: "5,000+",
    label: "Charging Stations",
    description: "Across India",
    color: "from-green-400 to-green-600"
  },
  {
    icon: IconUsers,
    number: "50K+",
    label: "Happy Users",
    description: "And growing daily",
    color: "from-blue-400 to-blue-600"
  },
  {
    icon: IconBolt,
    number: "1M+",
    label: "Charging Sessions",
    description: "Completed successfully",
    color: "from-yellow-400 to-yellow-600"
  },
  {
    icon: IconClock,
    number: "24/7",
    label: "Support Available",
    description: "Always here to help",
    color: "from-purple-400 to-purple-600"
  },
  {
    icon: IconLeaf,
    number: "500T+",
    label: "CO₂ Saved",
    description: "Environmental impact",
    color: "from-emerald-400 to-emerald-600"
  },
  {
    icon: IconTrendingUp,
    number: "99.9%",
    label: "Uptime",
    description: "Reliable network",
    color: "from-orange-400 to-orange-600"
  }
];

export function StatsSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-black via-gray-950/80 to-black relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-900/15 via-green-950/8 to-transparent" />
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-green-900/20 to-transparent" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-green-600/8 via-green-700/4 to-transparent rounded-full blur-3xl animate-pulse" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
            Powering India's{" "}
            <span className="bg-gradient-to-r from-green-300 via-green-400 to-green-500 bg-clip-text text-transparent">
              EV Revolution
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Join millions of users who trust our network for their daily charging needs
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative"
            >
              <div className="relative p-8 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl text-center">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${stat.color} mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                
                <div className="mb-4">
                  <div className="text-4xl md:text-5xl font-black text-white mb-2 group-hover:text-green-300 transition-colors">
                    {stat.number}
                  </div>
                  <h3 className="text-xl font-bold text-green-400 mb-2">
                    {stat.label}
                  </h3>
                  <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">
                    {stat.description}
                  </p>
                </div>
                
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-400/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="inline-flex items-center gap-4 px-8 py-4 bg-gradient-to-r from-green-900/20 to-green-800/20 border border-green-500/30 rounded-full backdrop-blur-md">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
              <span className="text-green-300 font-semibold">Live Network Status</span>
            </div>
            <div className="w-px h-6 bg-green-500/30" />
            <span className="text-white font-medium">All systems operational</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}