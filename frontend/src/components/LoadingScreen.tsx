"use client";
import { useState, useEffect } from "react";
import { LottieAnimation } from "@/components/ui/lottie-animation";

interface LoadingScreenProps {
  isLoading: boolean;
  onComplete?: () => void;
}

export function LoadingScreen({ isLoading, onComplete }: LoadingScreenProps) {
  // Track fade-out separately so we can unmount after the transition ends
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      // Start fade-out
      setFading(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setFading(false);
        onComplete?.();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isLoading, onComplete]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black transition-opacity duration-500"
      style={{ opacity: fading ? 0 : 1, pointerEvents: fading ? "none" : "auto" }}
    >
      <div className="flex flex-col items-center gap-6">
        <LottieAnimation
          src="/animations/charging electricity.json"
          className="w-48 h-48"
          fallback={<div className="w-48 h-48 bg-green-400/10 rounded-xl animate-pulse" />}
        />
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-1">
            <span className="text-green-500">Charge</span>IQ
          </h2>
          <p className="text-gray-400 text-sm">Powering up your EV experience...</p>
        </div>
      </div>
    </div>
  );
}
