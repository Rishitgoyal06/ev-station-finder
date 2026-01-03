"use client";
import { useState, useEffect } from "react";
import { LoginForm } from "./login-form";
import { SignupForm } from "./signup-form";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "login" | "signup";
}

export function AuthModal({ isOpen, onClose, initialMode = "login" }: AuthModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setMode(initialMode);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, initialMode]);

  const handleFlip = () => {
    setIsFlipping(true);
    setTimeout(() => {
      setMode(mode === "login" ? "signup" : "login");
      setIsFlipping(false);
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ${
      isOpen ? 'opacity-100' : 'opacity-0'
    }`}>
      <div 
        className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />
      <div className={`relative max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto transition-all duration-300 ${
        isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
      }`}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-gray-500 hover:text-gray-700 bg-white rounded-full p-2 transition-colors duration-200"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className={`transition-all duration-500 ${isFlipping ? 'opacity-50' : 'opacity-100'}`}>
          {mode === "login" ? (
            <LoginForm onSignupClick={handleFlip} />
          ) : (
            <SignupForm onLoginClick={handleFlip} />
          )}
        </div>
      </div>
      

    </div>
  );
}