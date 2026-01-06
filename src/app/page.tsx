"use client";
import { useState, useEffect } from "react";
import { HeroSection } from "@/components/HeroSection";
import { LiveMap } from "@/components/LiveMap";
import { LoadingScreen } from "@/components/LoadingScreen";
import { StatsSection } from "@/components/StatsSection";
import { Reviews } from "@/components/Reviews";
import { PricingTeaser } from "@/components/PricingTeaser";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <LoadingScreen isLoading={isLoading} />
      {!isLoading && (
        <>
          <HeroSection />
          <StatsSection />
          <LiveMap />
          <PricingTeaser />
          <Reviews />
        </>
      )}
    </>
  );
}
