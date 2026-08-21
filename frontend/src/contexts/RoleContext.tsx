"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";

export type UserRole = "customer" | "owner" | "worker" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  permissions: string[];
  assignedStations?: string[]; // for workers
  businessName?: string; // for owners
  phone?: string;
  avatar?: string;
}

interface RoleContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role?: UserRole) => Promise<boolean>;
  logout: () => void;
  switchRole: (newRole: UserRole) => void;
  hasPermission: (permission: string) => boolean;
  loading: boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

// Mock user data for different roles
const mockUsers: Record<string, User> = {
  "customer@test.com": {
    id: "user_1",
    name: "Rajesh Kumar",
    email: "customer@test.com",
    role: "customer",
    permissions: ["view_stations", "book_slots", "view_bookings"],
    phone: "+91 98765 43210"
  },
  "owner@test.com": {
    id: "owner_1", 
    name: "Sunil Agarwal",
    email: "owner@test.com",
    role: "owner",
    permissions: ["manage_stations", "view_analytics", "manage_workers", "view_bookings"],
    businessName: "GreenPower Solutions",
    phone: "+91 98765 43211"
  },
  "worker@test.com": {
    id: "worker_1",
    name: "Suresh Kumar", 
    email: "worker@test.com",
    role: "worker",
    permissions: ["update_slots", "view_bookings", "emergency_stop"],
    assignedStations: ["1", "2"],
    phone: "+91 98765 43212"
  },
  "admin@test.com": {
    id: "admin_1",
    name: "Admin User",
    email: "admin@test.com", 
    role: "admin",
    permissions: ["manage_users", "manage_stations", "manage_owners", "view_analytics", "system_settings"],
    phone: "+91 98765 43213"
  }
};

export function RoleProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("chargeiq_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("chargeiq_user");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string, role?: UserRole): Promise<boolean> => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser = mockUsers[email.toLowerCase()];
    
    if (mockUser && password === "password123") {
      // If role is specified and matches, or if no role specified
      if (!role || mockUser.role === role) {
        setUser(mockUser);
        localStorage.setItem("chargeiq_user", JSON.stringify(mockUser));
        setLoading(false);
        
        // Redirect based on role
        switch (mockUser.role) {
          case "admin":
            router.push("/admin");
            break;
          case "owner":
            router.push("/owner");
            break;
          case "worker":
            router.push("/worker");
            break;
          default:
            router.push("/dashboard");
        }
        
        return true;
      }
    }
    
    setLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("chargeiq_user");
    router.push("/");
  };

  const switchRole = (newRole: UserRole) => {
    if (!user) return;
    
    // In a real app, this would make an API call to verify role switching permissions
    const updatedUser = { ...user, role: newRole };
    setUser(updatedUser);
    localStorage.setItem("chargeiq_user", JSON.stringify(updatedUser));
    
    // Redirect to appropriate dashboard
    switch (newRole) {
      case "admin":
        router.push("/admin");
        break;
      case "owner":
        router.push("/owner");
        break;
      case "worker":
        router.push("/worker");
        break;
      default:
        router.push("/dashboard");
    }
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    return user.permissions.includes(permission);
  };

  const value: RoleContextType = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    switchRole,
    hasPermission,
    loading
  };

  return (
    <RoleContext.Provider value={value}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
}