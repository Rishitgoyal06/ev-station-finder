"use client";
import { Zap, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-black text-white py-8 sm:py-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center mb-4">
              <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-green-400 mr-2" />
              <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-green-300 to-emerald-300 bg-clip-text text-transparent">Charge IQ</span>
            </div>
            <p className="text-gray-300 mb-4 leading-relaxed text-sm sm:text-base">
              Find the nearest EV charging stations across India with real-time availability.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-3 sm:mb-4 text-green-300 text-sm sm:text-base">Quick Links</h3>
            <ul className="space-y-1.5 sm:space-y-2 text-gray-300 text-sm sm:text-base">
              <li><a href="#" className="hover:text-green-200 transition-colors">Find Stations</a></li>
              <li><a href="#" className="hover:text-green-200 transition-colors">Networks</a></li>
              <li><a href="#" className="hover:text-green-200 transition-colors">Mobile App</a></li>
              <li><a href="#" className="hover:text-green-200 transition-colors">Support</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-3 sm:mb-4 text-green-300 text-sm sm:text-base">Resources</h3>
            <ul className="space-y-1.5 sm:space-y-2 text-gray-300 text-sm sm:text-base">
              <li><a href="#" className="hover:text-green-200 transition-colors">EV Guide</a></li>
              <li><a href="#" className="hover:text-green-200 transition-colors">Charging Tips</a></li>
              <li><a href="#" className="hover:text-green-200 transition-colors">Route Planner</a></li>
              <li><a href="#" className="hover:text-green-200 transition-colors">Blog</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-3 sm:mb-4 text-green-300 text-sm sm:text-base">Contact</h3>
            <div className="space-y-1.5 sm:space-y-2 text-gray-300 text-sm sm:text-base">
              <div className="flex items-center hover:text-green-200 transition-colors">
                <Mail className="w-3 h-3 sm:w-4 sm:h-4 mr-2 flex-shrink-0" />
                <span className="break-all">test@gmail.com</span>
              </div>
              <div className="flex items-center hover:text-green-200 transition-colors">
                <Phone className="w-3 h-3 sm:w-4 sm:h-4 mr-2 flex-shrink-0" />
                <span>+91 9999999999</span>
              </div>
              <div className="flex items-center hover:text-green-200 transition-colors">
                <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-2 flex-shrink-0" />
                <span>Vadodara, India</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-gray-300">
          <p className="text-xs sm:text-sm">&copy; 2026 Charge IQ. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}