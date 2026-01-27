"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import Lottie from "lottie-react";
import { useEffect } from "react";
import { ChartNoAxesCombined, Search, Smartphone } from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.2
    }
  }
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.6, ease: "easeOut" }
};

export default function AboutSection() {
  const [activeTab, setActiveTab] = useState(0);
  const [chargingAnimation, setChargingAnimation] = useState(null);
  const [businessTeamAnimation, setBusinessTeamAnimation] = useState(null);
  const [mapBrowsingAnimation, setMapBrowsingAnimation] = useState(null);

  // Load animations
  useEffect(() => {
    const loadAnimations = async () => {
      try {
        const [charging, team, map] = await Promise.all([
          fetch('/animations/Electric vehicle charging animation.json').then(res => res.json()),
          fetch('/animations/Business team.json').then(res => res.json()),
          fetch('/animations/Map browsing.json').then(res => res.json())
        ]);
        setChargingAnimation(charging);
        setBusinessTeamAnimation(team);
        setMapBrowsingAnimation(map);
      } catch (error) {
        console.log('Animation loading failed:', error);
      }
    };
    loadAnimations();
  }, []);

  const techHighlights = [
    { title: "AI-Powered", description: "Smart Recommendations", icon: "🤖" },
    { title: "Real-Time", description: "Live Updates", icon: "⚡" },
    { title: "Multi-Platform", description: "Web & Mobile", icon: "📱" },
    { title: "Secure", description: "Payment Gateway", icon: "🔒" }
  ];

  const features = [
    {
      title: "Smart Discovery",
      description: "AI-powered station recommendations based on your route and preferences",
      icon: <Search size={28} />  
    },
    {
      title: "Real-time Availability",
      description: "Live updates on charging port availability and wait times",
      icon: <ChartNoAxesCombined size={28} color="#ffffff" />
    },
    {
      title: "Seamless Booking",
      description: "Reserve your charging slot and pay in advance for hassle-free experience",
      icon: <Smartphone size={28} color="#ffffff" />
    }
  ];

  const team = [
    {
      name: "Rajesh Kumar",
      role: "CEO & Founder",
      image: "/team/ceo.jpg",
      description: "10+ years in clean energy and automotive technology"
    },
    {
      name: "Priya Sharma",
      role: "CTO",
      image: "/team/cto.jpg",
      description: "Former Tesla engineer with expertise in EV infrastructure"
    },
    {
      name: "Arjun Patel",
      role: "Head of Operations",
      image: "/team/ops.jpg",
      description: "Scaling operations across 100+ cities in India"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-black">
      {/* Hero Section */}
      <motion.section 
        initial="initial"
        animate="animate"
        variants={staggerContainer}
        className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-900/20 via-transparent to-transparent" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white mb-6">
              About <span className="bg-gradient-to-r from-green-300 via-emerald-400 to-cyan-300 bg-clip-text text-transparent">Charge IQ</span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Revolutionizing India's electric mobility ecosystem with intelligent charging solutions
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left Side - Content */}
            <motion.div variants={fadeInUp} className="space-y-8">
              <div className="bg-gray-900/50 backdrop-blur-md rounded-2xl p-8 border border-green-400/20">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">
                  About <span className="bg-gradient-to-r from-green-300 via-emerald-400 to-cyan-300 bg-clip-text text-transparent">CHARGEIQ</span>
                </h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  <span className="font-semibold text-green-400">CHARGEIQ</span> is a smart
                  EV-tech startup redefining how electric vehicle owners find, access,
                  and manage charging. Built for convenience and reliability, our
                  platform enables users to locate nearby charging stations, check
                  real-time availability, book preferred time slots, and make advance
                  payments — all through a seamless digital experience.
                </p>
                <p className="text-gray-300 leading-relaxed mb-4">
                  We understand that <span className="font-semibold text-emerald-400">range anxiety</span>{" "}
                  and long waiting times are major barriers to EV adoption. CHARGEIQ
                  eliminates uncertainty by bringing intelligent charging discovery
                  and scheduling right to your fingertips — saving time and ensuring
                  stress-free journeys.
                </p>
                <p className="text-gray-300 leading-relaxed mb-6">
                  Driven by innovation and sustainability, we are committed to
                  accelerating India's electric mobility ecosystem. Our technology
                  supports EV users, charging station operators, and partners with
                  data-driven insights and automation.
                </p>
              </div>

              <div className="bg-gray-900/50 backdrop-blur-md rounded-2xl p-8 border border-green-400/20">
                <h3 className="text-xl font-bold text-white mb-4">Why Choose Charge IQ?</h3>
                <div className="space-y-4">
                  {features.map((feature, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-4 p-4 rounded-lg hover:bg-white/5 transition-colors"
                    >
                      <span className="text-2xl">{feature.icon}</span>
                      <div>
                        <h4 className="font-semibold text-white mb-1">{feature.title}</h4>
                        <p className="text-gray-400 text-sm">{feature.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right Side - Visual */}
            <motion.div variants={scaleIn} className="relative">
              <div className="bg-gradient-to-br from-green-400/20 to-emerald-600/20 rounded-2xl p-8 backdrop-blur-md border border-green-400/30">
                <div className="aspect-video bg-gray-900/50 rounded-xl mb-6 flex items-center justify-center overflow-hidden">
                  {chargingAnimation ? (
                    <Lottie 
                      animationData={chargingAnimation} 
                      loop={true}
                      className="w-full h-full"
                    />
                  ) : (
                    <div className="text-center text-white p-8">
                      <div className="w-20 h-20 bg-green-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl">⚡</span>
                      </div>
                      <h3 className="text-xl font-bold mb-2">Smart EV Charging</h3>
                      <p className="text-gray-300">Intelligent solutions for sustainable mobility</p>
                    </div>
                  )}
                </div>
                
                {/* Technology Highlights */}
                <div className="grid grid-cols-2 gap-4">
                  {techHighlights.map((tech, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="text-center p-4 bg-gray-900/30 rounded-lg border border-green-400/20 hover:border-green-400/40 transition-colors group"
                    >
                      <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">{tech.icon}</div>
                      <div className="text-sm font-bold text-green-400 mb-1">{tech.title}</div>
                      <div className="text-xs text-gray-300">{tech.description}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Vision Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-emerald-950/50 to-gray-950/50"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Our <span className="text-green-400">Vision</span>
            </h2>
            <p className="text-green-400 font-semibold text-xl mb-4">
              The Future Is Electric. The Future Is Now.
            </p>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              We envision an India where EV adoption is effortless, accessible,
              and environmentally responsible — where charging is planned,
              optimized, and intelligent.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {[
              {
                title: "Accessibility",
                description: "Making EV charging accessible to every Indian, from metros to rural areas",
                animation: mapBrowsingAnimation
              },
              {
                title: "Sustainability",
                description: "Promoting clean energy adoption and reducing carbon footprint nationwide",
                animation: chargingAnimation
              },
              {
                title: "Innovation",
                description: "Leveraging cutting-edge technology for seamless charging experiences",
                animation: null
              }
            ].map((item, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="bg-gray-900/50 backdrop-blur-md rounded-2xl p-8 border border-green-400/20 text-center hover:border-green-400/40 transition-colors group"
              >
                <div className="h-24 mb-4 flex items-center justify-center">
                  {item.animation ? (
                    <Lottie 
                      animationData={item.animation} 
                      loop={true}
                      className="w-16 h-16 group-hover:scale-110 transition-transform"
                    />
                  ) : (
                    <div className="text-4xl group-hover:scale-110 transition-transform">🚀</div>
                  )}
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{item.title}</h3>
                <p className="text-gray-300 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Team Section */}
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
              Meet Our <span className="text-green-400">Team</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Passionate innovators driving India's electric future
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-900/50 backdrop-blur-md rounded-2xl p-8 border border-green-400/20 text-center hover:border-green-400/40 transition-all group hover:scale-105"
              >
                <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                  {businessTeamAnimation && index === 0 ? (
                    <Lottie 
                      animationData={businessTeamAnimation} 
                      loop={true}
                      className="w-full h-full"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-green-400/20 rounded-full flex items-center justify-center">
                      <span className="text-3xl">👤</span>
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{member.name}</h3>
                <p className="text-green-400 font-semibold mb-4">{member.role}</p>
                <p className="text-gray-300 text-sm">{member.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
    </div>
  );
}