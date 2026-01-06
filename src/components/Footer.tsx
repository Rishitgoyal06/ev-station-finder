"use client";
import { Zap, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-black text-white py-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <Zap className="w-6 h-6 text-green-400 mr-2" />
              <span className="text-xl font-bold bg-gradient-to-r from-green-300 to-emerald-300 bg-clip-text text-transparent">Charge IQ</span>
            </div>
            <p className="text-gray-300 mb-4 leading-relaxed">
              Find the nearest EV charging stations across India with real-time availability.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-green-300">Quick Links</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-green-200 transition-colors">Find Stations</a></li>
              <li><a href="#" className="hover:text-green-200 transition-colors">Networks</a></li>
              <li><a href="#" className="hover:text-green-200 transition-colors">Mobile App</a></li>
              <li><a href="#" className="hover:text-green-200 transition-colors">Support</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-green-300">Resources</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-green-200 transition-colors">EV Guide</a></li>
              <li><a href="#" className="hover:text-green-200 transition-colors">Charging Tips</a></li>
              <li><a href="#" className="hover:text-green-200 transition-colors">Route Planner</a></li>
              <li><a href="#" className="hover:text-green-200 transition-colors">Blog</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-green-300">Contact</h3>
            <div className="space-y-2 text-gray-300">
              <div className="flex items-center hover:text-green-200 transition-colors">
                <Mail className="w-4 h-4 mr-2" />
                <span>test@gmail.com</span>
              </div>
              <div className="flex items-center hover:text-green-200 transition-colors">
                <Phone className="w-4 h-4 mr-2" />
                <span>+91 9999999999</span>
              </div>
              <div className="flex items-center hover:text-green-200 transition-colors">
                <MapPin className="w-4 h-4 mr-2" />
                <span>Vadodara, India</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-300">
          <p>&copy; 2026 Charge IQ. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}