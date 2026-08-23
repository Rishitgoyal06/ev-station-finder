"use client";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "./AuthContext";
import {
  IconHome2,
  IconChargingPile,
  IconCalendarEvent,
  IconHeart,
  IconBell,
  IconUserCircle,
  IconHelpCircle,
  IconChartLine,
  IconUsers,
  IconBuildingStore,
  IconSettings,
  IconAdjustmentsHorizontal,
  IconReportAnalytics,
} from "@tabler/icons-react";

export default function RoleAwareNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) return null;

  // Customer Navigation
  const customerLinks = [
    { label: "Dashboard", path: "/dashboard", icon: IconHome2 },
    { label: "Stations", path: "/stations", icon: IconChargingPile },
    { label: "My Bookings", path: "/bookings", icon: IconCalendarEvent },
    { label: "Favorites", path: "/favorites", icon: IconHeart },
    { label: "Notifications", path: "/notifications", icon: IconBell },
    { label: "Profile", path: "/profile", icon: IconUserCircle },
    { label: "Help", path: "/help", icon: IconHelpCircle }
  ];

  // Owner Navigation  
  const ownerLinks = [
    { label: "Dashboard", path: "/owner", icon: IconHome2 },
    { label: "My Stations", path: "/owner/stations", icon: IconChargingPile },
    { label: "Analytics", path: "/owner/analytics", icon: IconChartLine },
    { label: "Workers", path: "/owner/workers", icon: IconUsers },
    { label: "Bookings", path: "/owner/bookings", icon: IconCalendarEvent },
    { label: "Settings", path: "/owner/settings", icon: IconSettings }
  ];

  // Worker Navigation
  const workerLinks = [
    { label: "Dashboard", path: "/worker", icon: IconHome2 },
    { label: "Station Control", path: "/worker/control", icon: IconAdjustmentsHorizontal },
    { label: "Bookings", path: "/worker/bookings", icon: IconCalendarEvent },
    { label: "Reports", path: "/worker/reports", icon: IconReportAnalytics },
    { label: "Help", path: "/help", icon: IconHelpCircle }
  ];

  // Admin Navigation
  const adminLinks = [
    { label: "Dashboard", path: "/admin", icon: IconHome2 },
    { label: "Users", path: "/admin/users", icon: IconUsers },
    { label: "Stations", path: "/admin/stations", icon: IconChargingPile },
    { label: "Owners", path: "/admin/owners", icon: IconBuildingStore },
    { label: "Analytics", path: "/admin/analytics", icon: IconChartLine },
    { label: "Settings", path: "/admin/settings", icon: IconSettings }
  ];

  // Get navigation links based on user role
  const getNavigationLinks = () => {
    const userRole = user?.role === 'customer' ? 'user' : (user?.role || 'user');
    switch (userRole) {
      case 'admin': return adminLinks;
      case 'owner': return ownerLinks;
      case 'worker': return workerLinks;
      default: return customerLinks;
    }
  };

  const navigationLinks = getNavigationLinks();
  const currentRole = user?.role === 'customer' ? 'user' : (user?.role || 'user');

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#111] border-t border-[#1a1a1a] px-4 py-2 z-50 md:hidden">
      <div className="flex items-center justify-around max-w-sm mx-auto">
        {navigationLinks.slice(0, 5).map((link) => {
          const isActive = pathname === link.path || 
            (link.path !== '/dashboard' && pathname.startsWith(link.path));
          
          return (
            <button
              key={link.path}
              onClick={() => router.push(link.path)}
            className={`flex flex-col items-center gap-1 px-2 py-2 rounded-lg transition-all ${
                isActive 
                  ? "text-green-400" 
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <link.icon size={18} stroke={1.8} />
              <span className="text-xs font-medium">{link.label}</span>
            </button>
          );
        })}
      </div>

      {/* Role Indicator */}
      <div className="absolute top-1 right-1">
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
          currentRole === 'admin' ? 'bg-red-500/20 text-red-400' :
          currentRole === 'owner' ? 'bg-blue-500/20 text-blue-400' :
          currentRole === 'worker' ? 'bg-yellow-500/20 text-yellow-400' :
          'bg-green-500/20 text-green-400'
        }`}>
          {currentRole.toUpperCase()}
        </span>
      </div>
    </nav>
  );
}
