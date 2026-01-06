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

  useEffect(() => {
    let animationInstance: any = null;

    const loadLottie = async () => {
      try {
        const lottie = (await import('lottie-web')).default;
        
        if (containerRef.current) {
          let data = animationData;
          
          // If src is provided, fetch the JSON file
          if (src && !animationData) {
            const response = await fetch(src);
            data = await response.json();
          }
          
          if (data) {
            animationInstance = lottie.loadAnimation({
              container: containerRef.current,
              renderer: 'svg',
              loop,
              autoplay,
              animationData: data,
            });
          }
        }
      } catch (error) {
        console.log('Lottie animation failed to load:', error);
      }
    };

    loadLottie();

    return () => {
      if (animationInstance) {
        animationInstance.destroy();
      }
    };
  }, [src || '', animationData || null, loop, autoplay]);

  return (
    <div ref={containerRef} className={className}>
      {/* Fallback will be replaced by Lottie animation when loaded */}
    </div>
  );
}