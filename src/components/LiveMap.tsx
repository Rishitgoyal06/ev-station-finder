"use client";
import React, { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';

const DynamicMap = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="relative w-full h-[400px] bg-black overflow-hidden flex items-center justify-center">
      <div className="text-white text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Your EV Journey Starts Here</h2>
      </div>
    </div>
  ),
});

export function LiveMap() {
  return <DynamicMap />;
}