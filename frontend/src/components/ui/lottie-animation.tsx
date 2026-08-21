"use client";
import { useEffect, useRef } from 'react';

interface LottieAnimationProps {
  src?: string;
  animationData?: any;
  className?: string;
  loop?: boolean;
  autoplay?: boolean;
  fallback?: React.ReactNode;
}

export function LottieAnimation({ 
  src,
  animationData, 
  className = "", 
  loop = true, 
  autoplay = true,
  fallback
}: LottieAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  // Stable string keys so the effect only re-runs when the source genuinely changes
  const srcKey = src ?? "";
  const dataKey = animationData ? JSON.stringify(animationData).slice(0, 64) : "";

  useEffect(() => {
    let animationInstance: any = null;
    let cancelled = false;

    const loadLottie = async () => {
      try {
        const lottie = (await import('lottie-web')).default;

        // If the component unmounted while we were awaiting, bail out
        if (cancelled || !containerRef.current) return;

        // Clear any previously injected SVG before loading a new one
        containerRef.current.innerHTML = "";

        let data = animationData;
        if (src && !animationData) {
          const response = await fetch(src);
          data = await response.json();
        }

        // Check again after the second await
        if (cancelled || !containerRef.current || !data) return;

        animationInstance = lottie.loadAnimation({
          container: containerRef.current,
          renderer: 'svg',
          loop,
          autoplay,
          animationData: data,
        });
      } catch (error) {
        console.log('Lottie animation failed to load:', error);
      }
    };

    loadLottie();

    return () => {
      cancelled = true;
      if (animationInstance) {
        animationInstance.destroy();
        animationInstance = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [srcKey, dataKey, loop, autoplay]);

  return <div ref={containerRef} className={className} />;
}
