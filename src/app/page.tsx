"use client";
import { useState, useEffect } from "react";
import { HeroSection } from "@/components/HeroSection";
import { LiveMap } from "@/components/LiveMap";
import { LoadingScreen } from "@/components/LoadingScreen";
import { FAQSection } from "@/components/FAQSection";
import { Reviews } from "@/components/Reviews";

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
          <LiveMap />
          <Reviews />
          <FAQSection />
        </>
      )}
    </>
  );
}
