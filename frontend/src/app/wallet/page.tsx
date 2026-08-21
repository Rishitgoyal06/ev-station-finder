"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function WalletRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace('/profile?tab=wallet');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-green-500/20 border-t-green-500 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white">Redirecting to Profile...</p>
      </div>
    </div>
  );
}