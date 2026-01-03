"use client";
import { useState, useEffect } from "react";
import Lottie from "lottie-react";
import chargingAnimation from "@/components/assets/charging electricity.json";

interface LoadingScreenProps {
  isLoading: boolean;
  onComplete?: () => void;
}

export function LoadingScreen({ isLoading, onComplete }: LoadingScreenProps) {
  const [isVisible, setIsVisible] = useState(isLoading);

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onComplete?.();
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(true);
    }
  }, [isLoading, onComplete]);

  if (!isVisible) return null;

  return (
    <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-black transition-opacity duration-500 ${
      isLoading ? 'opacity-100' : 'opacity-0'
    }`}>
      <div className="flex flex-col items-center gap-6">
        <Lottie 
          animationData={chargingAnimation}
          loop={true}
          className="w-64 h-64"
        />
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">
            <span className="text-green-500">Charge</span>IQ
          </h2>
          <p className="text-gray-300">Powering up your EV experience...</p>
        </div>
      </div>
    </div>
  );
}