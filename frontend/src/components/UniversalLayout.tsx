"use client";
import { ReactNode } from "react";
import { useAuth } from "./AuthContext";
import RoleAwareNavigation from "./RoleAwareNavigation";

interface UniversalLayoutProps {
  children: ReactNode;
}

export default function UniversalLayout({ children }: UniversalLayoutProps) {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {children}
      {isAuthenticated && <RoleAwareNavigation />}
      
      {/* Add padding bottom for mobile navigation on authenticated pages */}
      {isAuthenticated && (
        <div className="h-20 md:h-0"></div>
      )}
    </div>
  );
}