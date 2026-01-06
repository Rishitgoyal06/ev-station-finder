"use client";
import React from 'react';
import { Zap, MapPin, Users, Shield } from 'lucide-react';
import { LottieAnimation } from './ui/lottie-animation';

export function AboutUs() {
  const features = [
    {
      icon: <Zap className="w-8 h-8 text-green-400" />,
      title: "Fast Charging",
      description: "Quick and efficient charging solutions for all EV models"
    },
    {
      icon: <MapPin className="w-8 h-8 text-green-400" />,
      title: "Wide Network",
      description: "Extensive charging network across major Indian cities"
    },
    {
      icon: <Users className="w-8 h-8 text-green-400" />,
      title: "Community Driven",
      description: "Built by EV enthusiasts for the EV community"
    },
    {
      icon: <Shield className="w-8 h-8 text-green-400" />,
      title: "Reliable Service",
      description: "24/7 support and maintenance for uninterrupted service"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-black via-emerald-950/30 to-black relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-900/15 via-lime-900/8 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            About <span className="text-green-400">CHARGEIQ</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-green-400 to-green-600 mx-auto mb-8" />
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            CHARGEIQ is a smart EV-tech startup redefining how electric vehicle owners find, access, and manage charging. 
            Built for convenience and reliability, CHARGEIQ helps users locate the nearest EV charging stations, 
            check real-time availability, book preferred time slots, and make advance payments — all through a seamless digital experience.
          </p>
        </div>

        <div className="flex justify-center mb-16">
          <LottieAnimation 
            src="/animations/Business team.json"
            className="w-full max-w-lg h-80"
            fallback={<div className="w-full max-w-lg h-80 bg-emerald-400/10 rounded-xl animate-pulse" />}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-16 items-center mb-20">
          <div>
            <div className="flex items-center mb-8">
              <h3 className="text-3xl font-bold text-white">Our Mission</h3>
            </div>
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              We understand that range anxiety and long waiting times are major challenges for EV adoption. 
              CHARGEIQ solves this by bringing intelligent charging discovery and scheduling to your fingertips, 
              eliminating uncertainty and saving valuable time.
            </p>
            <p className="text-gray-300 text-lg leading-relaxed mb-8">
              Whether you're commuting daily or planning a long journey, CHARGEIQ ensures your charging experience 
              is smooth, predictable, and stress-free.
            </p>
            <div className="bg-gray-900/50 border-l-4 border-green-400 p-6 rounded-r-lg">
              <p className="text-gray-300 leading-relaxed">
                Driven by innovation and sustainability, we are committed to accelerating India's electric mobility ecosystem. 
                Our platform supports EV users, charging station operators, and partners with data-driven insights, 
                automation, and scalable technology.
              </p>
            </div>
          </div>
          
          <div className="relative">
            <LottieAnimation 
              src="/animations/Electric vehicle charging animation.json"
              className="w-full h-96"
              fallback={<div className="w-full h-96 bg-emerald-400/10 rounded-xl animate-pulse" />}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-gray-900/50 border border-green-500/30 rounded-xl p-6 hover:border-green-400/50 transition-all duration-300 group"
            >
              <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
              <h4 className="text-white font-semibold mb-2">{feature.title}</h4>
              <p className="text-gray-400 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center mb-20">
          <h3 className="text-4xl font-bold text-white mb-4">Our Vision</h3>
          <div className="text-2xl font-semibold text-green-400 mb-8">The Future Is Electric. The Future Is Now.</div>
          <div className="max-w-5xl mx-auto">
            <p className="text-xl text-gray-300 leading-relaxed mb-6">
              We envision an India where electric vehicle adoption is effortless, accessible, and environmentally responsible. 
              A future where drivers never have to worry about finding a charger or waiting in long queues — 
              because charging is planned, optimized, and intelligent.
            </p>
            <div className="bg-gradient-to-r from-green-900/30 to-green-700/20 border border-green-500/30 rounded-xl p-8">
              <p className="text-lg text-gray-300 leading-relaxed">
                At CHARGEIQ, everything we build — from our products to our partnerships — is focused on enabling 
                a climate-conscious society without compromising on convenience, speed, or reliability. 
                By combining technology, sustainability, and user-centric design, we aim to power the next generation 
                of clean mobility in India.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center mb-8">
            <h3 className="text-3xl font-bold text-white">Why Choose CHARGEIQ?</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-900/30 border border-green-500/20 rounded-xl p-8 group hover:border-green-400/40 transition-all duration-300">
              <div className="text-4xl font-bold text-green-400 mb-2 group-hover:scale-110 transition-transform duration-300">10+</div>
              <div className="text-white font-semibold mb-2">Cities Covered</div>
              <div className="text-gray-400 text-sm">Major metropolitan areas across India</div>
            </div>
            <div className="bg-gray-900/30 border border-green-500/20 rounded-xl p-8 group hover:border-green-400/40 transition-all duration-300">
              <div className="text-4xl font-bold text-green-400 mb-2 group-hover:scale-110 transition-transform duration-300">24/7</div>
              <div className="text-white font-semibold mb-2">Support</div>
              <div className="text-gray-400 text-sm">Round-the-clock assistance and monitoring</div>
            </div>
            <div className="bg-gray-900/30 border border-green-500/20 rounded-xl p-8 group hover:border-green-400/40 transition-all duration-300">
              <div className="text-4xl font-bold text-green-400 mb-2 group-hover:scale-110 transition-transform duration-300">100%</div>
              <div className="text-white font-semibold mb-2">Reliable</div>
              <div className="text-gray-400 text-sm">Verified and maintained charging stations</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}