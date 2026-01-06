"use client";

import React, { useEffect, useState } from "react";
import { InfiniteMovingCards } from "../components/ui/infinite-moving-cards";

export function Reviews() {
  return (
    <div className="py-16 bg-black relative overflow-hidden">
      
      <div className="relative z-10 text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">What Our Users Say</h2>
        <p className="text-gray-300 text-lg">Real experiences from EV drivers across India</p>
      </div>
      
      <div className="relative z-10 flex items-center justify-center">
        <InfiniteMovingCards
          items={testimonials}
          direction="right"
          speed="slow"
        />
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
];
