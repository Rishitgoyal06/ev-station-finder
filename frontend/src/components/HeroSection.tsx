"use client";
import { useState } from "react";
import { BackgroundBeams } from "./ui/background-beams";
import { PointerHighlight } from "./ui/pointer-highlight";
import { VideoModal } from "./VideoModal";
import { useAuth } from "./AuthContext";
import { useRouter } from "next/navigation";
import { AuthModal } from "./AuthModal";

export function HeroSection() {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  const handleFindStations = () => {
    if (isAuthenticated) {
      const role = user?.role;
      router.push(
        role === "owner"
          ? "/owner"
          : role === "admin"
            ? "/admin"
            : role === "worker"
              ? "/worker"
              : "/dashboard"
      );
    } else {
      setIsAuthModalOpen(true);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.22),transparent_32%),linear-gradient(180deg,#06110d_0%,#020202_56%,#040404_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:72px_72px] opacity-[0.16]" />
      <div className="absolute inset-0 bg-black/20" />
      <BackgroundBeams />
    
      <div className="relative z-20 text-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-20 sm:pt-24">
        <div className="inline-flex items-center gap-2 rounded-full border border-green-400/20 bg-green-400/8 px-4 py-2 text-xs sm:text-sm text-green-200 mb-6 sm:mb-8 backdrop-blur">
          <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
          Real-time EV station discovery, booking, and route planning
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-white font-sans tracking-tight mb-6 sm:mb-8 leading-[0.95]">
          Find your next{" "}
          <div className="relative inline-block mt-2 sm:mt-4">
            <PointerHighlight
              rectangleClassName="border border-green-400/60 rounded-2xl bg-gradient-to-r from-green-400/12 via-emerald-400/12 to-cyan-400/12 shadow-[0_0_40px_rgba(34,197,94,0.18)]"
              pointerClassName="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-green-300 drop-shadow-lg"
            >
              <span className="px-3 py-2 sm:px-5 sm:py-3 md:px-7 md:py-4 bg-gradient-to-r from-green-300 via-emerald-300 to-cyan-300 bg-clip-text text-transparent font-black">
                Charge
              </span>
            </PointerHighlight>
          </div>
        </h1>
        
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-200/90 mb-8 sm:mb-10 md:mb-12 max-w-4xl mx-auto leading-relaxed px-2">
          Discover India's largest EV charging network with{" "}
          <span className="text-green-300 font-semibold hover:text-green-200 transition-colors">real-time availability</span> and{" "}
          <span className="text-emerald-300 font-semibold hover:text-emerald-200 transition-colors">intelligent routing</span>{" "}
          to power your journey.
        </p>
        
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-10 md:mb-12">
          <div className="text-center group cursor-pointer rounded-2xl px-5 py-4 bg-white/5 border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.03)] backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-green-400/30">
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-green-400 group-hover:scale-110 transition-transform duration-300">5000+</div>
            <div className="text-xs sm:text-sm text-gray-300 group-hover:text-gray-200 transition-colors">Charging Stations</div>
          </div>
          <div className="text-center group cursor-pointer rounded-2xl px-5 py-4 bg-white/5 border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.03)] backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400/30">
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-emerald-400 group-hover:scale-110 transition-transform duration-300">50K+</div>
            <div className="text-xs sm:text-sm text-gray-300 group-hover:text-gray-200 transition-colors">Happy Users</div>
          </div>
          <div className="text-center group cursor-pointer rounded-2xl px-5 py-4 bg-white/5 border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.03)] backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/30">
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-cyan-400 group-hover:scale-110 transition-transform duration-300">24/7</div>
            <div className="text-xs sm:text-sm text-gray-300 group-hover:text-gray-200 transition-colors">Support</div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center px-4">
          <button 
            onClick={handleFindStations}
            className="group w-full sm:w-auto px-8 sm:px-10 md:px-12 py-4 sm:py-5 bg-gradient-to-r from-green-400 via-emerald-500 to-cyan-400 text-black font-bold rounded-full hover:shadow-2xl hover:shadow-green-400/30 transition-all duration-300 transform hover:-translate-y-0.5 hover:scale-[1.02] text-base sm:text-lg relative overflow-hidden border border-green-300/20"
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
            className="group w-full sm:w-auto px-8 sm:px-10 md:px-12 py-4 sm:py-5 bg-white/5 backdrop-blur-md border border-white/20 text-white font-semibold rounded-full hover:bg-white/10 hover:border-white/40 transition-all duration-300 transform hover:-translate-y-0.5 hover:scale-[1.02] text-base sm:text-lg"
          >
            <span className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Watch Demo
            </span>
          </button>
        </div>

        <div className="mt-10 sm:mt-14 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 max-w-4xl mx-auto">
          {[
            { title: "Live availability", text: "See nearby chargers before you leave." },
            { title: "Fast booking", text: "Reserve slots in a few quick taps." },
            { title: "Smart routing", text: "Open directions and head straight there." },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur px-5 py-4 text-left shadow-[0_0_24px_rgba(0,0,0,0.12)]">
              <p className="text-white font-semibold mb-1">{item.title}</p>
              <p className="text-sm text-gray-300 leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
      
      <VideoModal 
        isOpen={isVideoModalOpen} 
        onClose={() => setIsVideoModalOpen(false)} 
      />
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode="login"
      />
    </div>
  );
}
