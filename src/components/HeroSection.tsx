"use client";
import React, { useState } from "react";
import { BackgroundBeams } from "./ui/background-beams";
import { PointerHighlight } from "./ui/pointer-highlight";
import { VideoModal } from "./VideoModal";

export function HeroSection() {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-black to-gray-950" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-900/20 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-black/30" />
      <BackgroundBeams />
    
      <div className="relative z-20 text-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-white font-sans tracking-tight mb-6 sm:mb-8 leading-tight">
          Find Your Next{" "}
          <div className="relative inline-block mt-2 sm:mt-4">
            <PointerHighlight
              rectangleClassName="border-2 border-green-400/70 rounded-xl bg-gradient-to-r from-green-400/10 to-emerald-400/10 shadow-lg"
              pointerClassName="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-green-400 drop-shadow-lg"
            >
              <span className="px-3 py-2 sm:px-4 sm:py-2 md:px-6 md:py-3 bg-gradient-to-r from-green-300 via-emerald-400 to-cyan-300 bg-clip-text text-transparent font-black">
                Charge
              </span>
            </PointerHighlight>
          </div>
        </h1>
        
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-200 mb-8 sm:mb-10 md:mb-12 max-w-4xl mx-auto leading-relaxed px-2">
          Discover India's largest EV charging network with{" "}
          <span className="text-green-300 font-semibold hover:text-green-200 transition-colors">real-time availability</span> and{" "}
          <span className="text-emerald-300 font-semibold hover:text-emerald-200 transition-colors">intelligent routing</span>{" "}
          to power your journey.
        </p>
        
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-10 md:mb-12">
          <div className="text-center group cursor-pointer hover:bg-white/5 rounded-lg p-4 transition-all duration-300 hover:scale-110">
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-green-400 group-hover:scale-110 transition-transform duration-300">5000+</div>
            <div className="text-xs sm:text-sm text-gray-300 group-hover:text-gray-200 transition-colors">Charging Stations</div>
          </div>
          <div className="text-center group cursor-pointer hover:bg-white/5 rounded-lg p-4 transition-all duration-300 hover:scale-110">
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-emerald-400 group-hover:scale-110 transition-transform duration-300">50K+</div>
            <div className="text-xs sm:text-sm text-gray-300 group-hover:text-gray-200 transition-colors">Happy Users</div>
          </div>
          <div className="text-center group cursor-pointer hover:bg-white/5 rounded-lg p-4 transition-all duration-300 hover:scale-110">
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-cyan-400 group-hover:scale-110 transition-transform duration-300">24/7</div>
            <div className="text-xs sm:text-sm text-gray-300 group-hover:text-gray-200 transition-colors">Support</div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center px-4">
          <button 
            onClick={() => window.location.href = 'http://localhost:8000'}
            className="group w-full sm:w-auto px-8 sm:px-10 md:px-12 py-4 sm:py-5 bg-gradient-to-r from-green-400 via-emerald-500 to-cyan-400 text-black font-bold rounded-full hover:shadow-2xl hover:shadow-green-400/40 transition-all duration-300 transform hover:scale-105 text-base sm:text-lg relative overflow-hidden border border-green-300/20"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              <span className="hidden sm:inline">Find Charging Stations</span>
              <span className="sm:hidden">Find Stations</span>
              <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
          <button 
            onClick={() => setIsVideoModalOpen(true)}
            className="group w-full sm:w-auto px-8 sm:px-10 md:px-12 py-4 sm:py-5 bg-white/5 backdrop-blur-md border-2 border-white/30 text-white font-semibold rounded-full hover:bg-white/10 hover:border-white/50 transition-all duration-300 transform hover:scale-105 text-base sm:text-lg"
          >
            <span className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Watch Demo
            </span>
          </button>
        </div>
      </div>
      
      <VideoModal 
        isOpen={isVideoModalOpen} 
        onClose={() => setIsVideoModalOpen(false)} 
      />
    </div>
  );
}