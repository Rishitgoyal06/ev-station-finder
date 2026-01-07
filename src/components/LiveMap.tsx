"use client";
import React, { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { TypewriterEffectSmooth } from "./ui/typewriter-effect";

const words = [
  {
    text: "Your",
    className: "text-white dark:text-white",
  },
  {
    text: "EV",
    className: "text-green-400 dark:text-green-400",
  },
  {
    text: "Journey",
    className: "text-white dark:text-white",
  },
  {
    text: "Starts",
    className: "text-white dark:text-white",
  },
  {
    text: "Here",
    className: "text-white dark:text-white",
  },
];

const DynamicMap = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="relative w-full h-[300px] sm:h-[350px] md:h-[400px] bg-black overflow-hidden flex items-center justify-center px-4">
      <div className="text-white text-center">
        <TypewriterEffectSmooth words={words} className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold" />
      </div>
    </div>
  ),
});

export function LiveMap() {
  return (
    <>
      <DynamicMap />
      <section className="py-12 sm:py-16 md:py-20 bg-black relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-7 gap-8 sm:gap-12 lg:gap-20 items-center">
            <div className="text-center lg:text-left lg:col-span-2 relative order-2 lg:order-1">
              <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-green-400/40 via-green-500/25 to-green-600/15 rounded-full hidden lg:block" />
              <div className="mb-6 relative">
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white mb-4 sm:mb-6 leading-tight drop-shadow-2xl">
                  EV{" "}
                  <span className="bg-gradient-to-r from-green-300 via-green-400 to-green-500 bg-clip-text text-transparent animate-pulse">
                    Charging
                  </span>
                </h2>
                <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-green-300 font-semibold mb-3 sm:mb-4 drop-shadow-lg">
                  In 3 Simple Steps
                </p>
                <div className="w-16 sm:w-20 h-1 bg-gradient-to-r from-green-400 to-green-600 rounded-full shadow-lg shadow-green-400/25 mx-auto lg:mx-0" />
                <div className="absolute -bottom-2 left-1/2 lg:left-0 transform -translate-x-1/2 lg:translate-x-0 w-24 sm:w-32 h-0.5 bg-gradient-to-r from-green-400/15 to-transparent rounded-full animate-pulse" />
              </div>
            </div>
            <div className="lg:col-span-5 relative group order-1 lg:order-2 lg:-mr-20 lg:ml-12">
              <div className="absolute -inset-2 bg-green-400/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <Image
                src="/Plug in your vehicle and start charging instantly with a smooth, reliable experience..png"
                alt="EV Charging in 3 Simple Steps"
                width={1200}
                height={900}
                className="relative rounded-xl shadow-2xl w-full h-auto object-cover transform group-hover:scale-[1.02] transition-all duration-500 border border-green-500/10 group-hover:border-green-400/25"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}