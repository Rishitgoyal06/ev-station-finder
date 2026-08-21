"use client";
import React from 'react';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function VideoModal({ isOpen, onClose }: VideoModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative z-10 w-full max-w-4xl mx-4 sm:mx-6 lg:mx-4">
        <div className="relative bg-black rounded-xl sm:rounded-2xl overflow-hidden border border-green-400/20 shadow-2xl">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 sm:top-4 sm:right-4 z-20 w-8 h-8 sm:w-10 sm:h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white hover:text-green-400 transition-colors"
          >
            <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="relative aspect-video bg-gray-900">
            <iframe
              className="w-full h-full"
              // src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1"
              title="Charge IQ Demo"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
       
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-emerald-950 via-black to-gray-950">
              <div className="text-center text-white p-4 sm:p-6 lg:p-8">
                <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 mx-auto mb-3 sm:mb-4 bg-green-400/20 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2">Charge IQ Demo</h3>
                <p className="text-sm sm:text-base text-gray-300 mb-3 sm:mb-4">See how easy it is to find and book EV charging stations</p>
                <div className="space-y-1.5 sm:space-y-2 text-left max-w-xs sm:max-w-md">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full flex-shrink-0"></div>
                    <span className="text-xs sm:text-sm">Find nearby charging stations</span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full flex-shrink-0"></div>
                    <span className="text-xs sm:text-sm">Check real-time availability</span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full flex-shrink-0"></div>
                    <span className="text-xs sm:text-sm">Navigate with smart routing</span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full flex-shrink-0"></div>
                    <span className="text-xs sm:text-sm">Book and pay seamlessly</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}