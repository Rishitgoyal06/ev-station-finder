"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { HeroSection } from "@/components/HeroSection";
import { LiveMap } from "@/components/LiveMap";
import { LoadingScreen } from "@/components/LoadingScreen";

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
        </>
      )}
    </>
  );
}
