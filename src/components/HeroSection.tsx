"use client";
import React from "react";
import { BackgroundBeams } from "./ui/background-beams";
import { PointerHighlight } from "./ui/pointer-highlight";

export function HeroSection() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-black to-gray-950" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-900/20 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-black/30" />
      <BackgroundBeams />
      
      {/* Hero Content */}
      <div className="relative z-20 text-center px-6 max-w-7xl mx-auto">
        {/* Enhanced Badge */}
        <div className="mb-8">
          <span className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-400/40 rounded-full text-sm font-semibold text-green-300 backdrop-blur-md shadow-lg hover:shadow-green-400/20 transition-all duration-300">
            <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
            ⚡ India's #1 EV Charging Network
          </span>
        </div>
        
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white font-sans tracking-tight mb-8 leading-tight">
          Find Your Next{" "}
          <div className="relative inline-block mt-4">
            <PointerHighlight
              rectangleClassName="border-2 border-green-400/70 rounded-xl bg-gradient-to-r from-green-400/10 to-emerald-400/10 shadow-lg"
              pointerClassName="h-7 w-7 text-green-400 drop-shadow-lg"
            >
              <span className="px-6 py-3 bg-gradient-to-r from-green-300 via-emerald-400 to-cyan-300 bg-clip-text text-transparent font-black">
                Charge
              </span>
            </PointerHighlight>
          </div>
          <br />
          <span className="text-3xl md:text-5xl lg:text-6xl font-light text-gray-100">with Charge IQ</span>
        </h1>
        
        <p className="text-lg md:text-xl lg:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
          Discover <span className="text-green-400 font-semibold hover:text-green-300 transition-colors">5000+ charging stations</span> across India with real-time availability, 
          smart routing, and seamless payment integration. 
          <br className="hidden md:block" />
          Join <span className="text-cyan-400 font-semibold hover:text-cyan-300 transition-colors">50K+ happy EV owners</span> today.
        </p>
        
        {/* Enhanced Stats */}
        <div className="flex flex-wrap justify-center gap-8 mb-12">
          <div className="text-center group cursor-pointer">
            <div className="text-2xl md:text-3xl font-bold text-green-400 group-hover:scale-110 transition-transform duration-300">5000+</div>
            <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">Charging Stations</div>
          </div>
          <div className="text-center group cursor-pointer">
            <div className="text-2xl md:text-3xl font-bold text-emerald-400 group-hover:scale-110 transition-transform duration-300">50K+</div>
            <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">Happy Users</div>
          </div>
          <div className="text-center group cursor-pointer">
            <div className="text-2xl md:text-3xl font-bold text-cyan-400 group-hover:scale-110 transition-transform duration-300">24/7</div>
            <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">Support</div>
          </div>
        </div>
        
        {/* Enhanced Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <button className="group px-12 py-5 bg-gradient-to-r from-green-400 via-emerald-500 to-cyan-400 text-black font-bold rounded-full hover:shadow-2xl hover:shadow-green-400/40 transition-all duration-300 transform hover:scale-105 text-lg relative overflow-hidden border border-green-300/20">
            <span className="relative z-10 flex items-center gap-2">
              Find Charging Stations
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
          <button className="group px-12 py-5 bg-white/5 backdrop-blur-md border-2 border-white/30 text-white font-semibold rounded-full hover:bg-white/10 hover:border-white/50 transition-all duration-300 transform hover:scale-105 text-lg">
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Watch Demo
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}