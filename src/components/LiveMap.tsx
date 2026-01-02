"use client";
import React, { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
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
  return <DynamicMap />;
}