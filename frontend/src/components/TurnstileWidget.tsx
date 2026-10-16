"use client";
import { useEffect, useRef, useCallback } from "react";

declare global {
  interface Window {
    turnstile: {
      render: (
        container: string | HTMLElement,
        params: {
          sitekey: string;
          callback?: (token: string) => void;
          "error-callback"?: () => void;
          "expired-callback"?: () => void;
          action?: string;
          theme?: "light" | "dark" | "auto";
          size?: "normal" | "compact";
        }
      ) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

interface TurnstileWidgetProps {
  /** Called with the challenge token once the user passes. */
  onToken: (token: string) => void;
  /** Called when the challenge expires or errors — clears the token. */
  onReset?: () => void;
  /** data-action label for this surface (e.g. "login" | "signup"). */
  action: "login" | "signup";
  className?: string;
}

const SITEKEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "0x4AAAAAAFYSm6q49XZR9SIa";

export function TurnstileWidget({
  onToken,
  onReset,
  action,
  className,
}: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  const renderWidget = useCallback(() => {
    if (!containerRef.current || !window.turnstile) return;
    // Remove any previous widget before re-rendering
    if (widgetIdRef.current) {
      try {
        window.turnstile.remove(widgetIdRef.current);
      } catch {
        // ignore if already removed
      }
      widgetIdRef.current = null;
    }
    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey: SITEKEY,
      action,
      theme: "dark",
      callback: (token) => onToken(token),
      "expired-callback": () => onReset?.(),
      "error-callback": () => onReset?.(),
    });
  }, [action, onToken, onReset]);

  useEffect(() => {
    // If the Turnstile script is already loaded, render immediately.
    if (window.turnstile) {
      renderWidget();
      return;
    }

    // Otherwise inject the script once and render on load.
    const existing = document.querySelector(
      'script[src*="challenges.cloudflare.com/turnstile"]'
    );
    if (!existing) {
      const script = document.createElement("script");
      script.src =
        "https://challenges.cloudflare.com/turnstile/v0/api.js";
      script.async = true;
      script.defer = true;
      script.onload = renderWidget;
      document.head.appendChild(script);
    } else {
      // Script tag exists but may still be loading — poll briefly.
      const interval = setInterval(() => {
        if (window.turnstile) {
          clearInterval(interval);
          renderWidget();
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, [renderWidget]);

  // Expose a reset helper so parent can call it after a failed submission.
  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          // ignore
        }
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={className}
      aria-label="Human verification challenge"
    />
  );
}
