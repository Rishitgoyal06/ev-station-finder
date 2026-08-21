"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { usePullToRefresh } from "@/hooks/usePullToRefresh";
import { useSwipeGestures } from "@/hooks/useSwipeGestures";
import { HeroSection } from "@/components/HeroSection";
import { LiveMap } from "@/components/LiveMap";
import { LoadingScreen } from "@/components/LoadingScreen";
import { StatsSection } from "@/components/StatsSection";
import { Reviews } from "@/components/Reviews";
import { PricingTeaser } from "@/components/PricingTeaser";

const AnimatedSection = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);
  const sections = ['hero', 'stats', 'map', 'pricing', 'reviews'];

  const handleRefresh = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshKey(prev => prev + 1);
  };

  const scrollToSection = (index: number) => {
    const sectionId = sections[index];
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
    setCurrentSection(index);
  };

  const { pullDistance, isRefreshing, isPulling } = usePullToRefresh({
    onRefresh: handleRefresh,
    threshold: 80
  });

  useSwipeGestures({
    onSwipeUp: () => {
      if (currentSection < sections.length - 1) {
        scrollToSection(currentSection + 1);
      }
    },
    onSwipeDown: () => {
      if (currentSection > 0) {
        scrollToSection(currentSection - 1);
      }
    },
    threshold: 100
  });

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
        <div className="relative">
          {/* Pull to refresh indicator */}
          {isPulling && (
            <div 
              className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4"
              style={{ transform: `translateY(${Math.min(pullDistance - 80, 0)}px)` }}
            >
              <div className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                {pullDistance > 80 ? 'Release to refresh' : 'Pull to refresh'}
              </div>
            </div>
          )}
          
          {isRefreshing && (
            <div className="fixed top-4 left-0 right-0 z-50 flex justify-center">
              <div className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Refreshing...
              </div>
            </div>
          )}

          {/* Swipe indicator for mobile */}
          <div className="fixed bottom-4 right-4 z-40 md:hidden">
            <div className="bg-black/50 text-white px-3 py-2 rounded-full text-xs flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
              </svg>
              Swipe to navigate
            </div>
          </div>

          <motion.div
            key={refreshKey}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            id="hero"
          >
            <HeroSection />
          </motion.div>
          <AnimatedSection delay={0.1}>
            <div id="stats">
              <StatsSection />
            </div>
          </AnimatedSection>
          <AnimatedSection delay={0.2}>
            <div id="map">
              <LiveMap />
            </div>
          </AnimatedSection>
          <AnimatedSection delay={0.3}>
            <div id="pricing">
              <PricingTeaser />
            </div>
          </AnimatedSection>
          <AnimatedSection delay={0.4}>
            <div id="reviews">
              <Reviews />
            </div>
          </AnimatedSection>
        </div>
      )}
    </>
  );
}
