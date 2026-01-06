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
    <div className="relative w-full h-[400px] bg-black overflow-hidden flex items-center justify-center">
      <div className="text-white text-center">
        <TypewriterEffectSmooth words={words} className="text-3xl md:text-4xl font-bold" />
      </div>
    </div>
  ),
});

export function LiveMap() {
  return (
    <>
      <DynamicMap />
      <section className="py-20 bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tl from-green-800/10 via-emerald-950/5 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-900/8 via-transparent to-transparent" />
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-green-800/3 to-transparent" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-emerald-600/5 via-green-700/3 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-gradient-to-br from-cyan-500/4 via-emerald-500/3 to-transparent rounded-full blur-2xl animate-pulse" style={{animationDelay: '1s'}} />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-7 gap-20 items-center">
            <div className="text-left md:col-span-2 relative">
              <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-green-400/25 via-emerald-500/15 to-transparent rounded-full" />
              <div className="mb-6 relative">
                <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight drop-shadow-2xl">
                  EV{" "}
                  <span className="bg-gradient-to-r from-green-300 via-emerald-400 to-cyan-300 bg-clip-text text-transparent animate-pulse">
                    Charging
                  </span>
                </h2>
                <p className="text-2xl md:text-3xl lg:text-4xl text-green-300 font-semibold mb-4 drop-shadow-lg">
                  In 3 Simple Steps
                </p>
                <div className="w-20 h-1 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full shadow-lg shadow-green-400/25" />
                <div className="absolute -bottom-2 left-0 w-32 h-0.5 bg-gradient-to-r from-green-400/15 to-transparent rounded-full animate-pulse" />
              </div>
            </div>
            <div className="md:col-span-5 -mr-20 ml-12 relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-green-400/8 via-emerald-500/8 to-cyan-400/8 rounded-2xl blur-xl opacity-25 group-hover:opacity-40 transition-all duration-700 animate-pulse" />
              <div className="absolute -inset-2 bg-gradient-to-r from-green-400/12 via-emerald-500/12 to-cyan-400/12 rounded-xl blur-lg opacity-20 group-hover:opacity-35 transition-opacity duration-500" />
              <div className="absolute top-4 right-4 w-4 h-4 bg-green-400 rounded-full animate-ping opacity-40" />
              <div className="absolute bottom-4 left-4 w-2 h-2 bg-emerald-400 rounded-full animate-pulse opacity-60" />
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