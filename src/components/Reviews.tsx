"use client";

import React from "react";

export function Reviews() {
  return (
    <div className="py-20 bg-gradient-to-b from-black via-gray-950 to-black relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-900/8 via-transparent to-transparent" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">What Our Users Say</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-green-400 to-green-600 mx-auto mb-6" />
          <p className="text-xl text-gray-300">Real experiences from EV drivers across India</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-gray-900/50 border border-green-500/20 rounded-xl p-8 hover:border-green-400/40 hover:bg-gray-900/70 transition-all duration-300 group"
            >
              <div className="mb-6">
                <div className="flex text-green-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-300 leading-relaxed text-lg group-hover:text-gray-200 transition-colors">
                  "{testimonial.quote}"
                </p>
              </div>
              <div className="border-t border-gray-700 pt-6">
                <div className="font-semibold text-white text-lg">{testimonial.name}</div>
                <div className="text-green-400 text-sm font-medium">{testimonial.title}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const testimonials = [
  {
    quote:
      "Found the nearest charging station in seconds! The real-time availability feature saved me from a long wait. Perfect for my daily commute.",
    name: "Priya Sharma",
    title: "Tesla Model 3 Owner",
  },
  {
    quote:
      "The AI chatbot is incredibly helpful. It guided me to the best route with multiple charging stops for my Mumbai to Pune trip.",
    name: "Rajesh Kumar",
    title: "Tata Nexon EV Driver",
  },
  {
    quote: "Love how it shows all network providers in one place. No more switching between different apps!",
    name: "Anita Patel",
    title: "MG ZS EV Owner",
  },
  {
    quote:
      "The map interface is so intuitive. I can see charging speeds, prices, and availability at a glance. Highly recommended!",
    name: "Vikram Singh",
    title: "Hyundai Kona Owner",
  },
  {
    quote:
      "Been using this for 6 months now. Never had range anxiety again! The station verification is spot on.",
    name: "Meera Reddy",
    title: "Ather 450X Rider",
  },
  {
    quote:
      "Seamless booking experience and accurate real-time data. This app has made EV ownership so much easier!",
    name: "Arjun Mehta",
    title: "BYD Atto 3 Owner",
  },
];
