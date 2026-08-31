"use client";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { useState } from "react";
import { AuthModal } from "./AuthModal";
import { useAuth } from "@/components/AuthContext";
import { useRouter } from "next/navigation";
import { IconBolt, IconChargingPile } from "@tabler/icons-react";
 
export function NavBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();

  const getDashboardPath = () => {
    const role = user?.role;
    return role === "owner"
      ? "/owner"
      : role === "admin"
        ? "/admin"
        : role === "worker"
          ? "/worker"
          : "/dashboard";
  };

  const navItems = [
    { name: "Home", link: "/" },
    { name: "About Us", link: "/about" },
    { name: "Features", link: "/features" },
    { name: "Contact Us", link: "/contact" },
  ];
 
  return (
    <>
      <div className="relative w-full">
        <Navbar>
          <NavBody>
            <button
              type="button"
              onClick={() => {
                if (isAuthenticated) {
                  router.push(getDashboardPath());
                } else {
                  router.push("/");
                }
              }}
              className="flex items-center gap-3 text-left"
            >
              <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1f1f1f] via-[#111] to-[#050505] border border-white/10 shadow-[0_0_30px_rgba(34,197,94,0.18)]">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-green-400/20 via-transparent to-emerald-500/10" />
                <IconChargingPile size={20} className="relative text-green-400" stroke={1.8} />
              </div>
              <div className="hidden sm:block leading-tight">
                <div className="text-white font-bold tracking-wide text-base">
                  <span className="text-green-400">Charge</span>IQ
                </div>
              </div>
            </button>
            <NavItems items={navItems} />
            <div className="flex items-center gap-4">
              {isAuthenticated && user ? (
                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/15 text-green-400">
                      <IconBolt size={16} stroke={1.9} />
                    </div>
                    <div className="text-right">
                      <div className="text-white text-sm font-semibold leading-none">{user.name}</div>
                      <div className="text-green-400 text-[11px] uppercase tracking-[0.2em]">{user.role}</div>
                    </div>
                  </div>
                  <NavbarButton 
                    variant="secondary"
                    onClick={logout}
                    className="border border-red-500/40 text-red-400 hover:bg-red-500/10 text-sm py-1.5 px-3"
                  >
                    Logout
                  </NavbarButton>
                </div>
              ) : (
                <>
                  <NavbarButton 
                    variant="secondary"
                    onClick={() => {
                      setAuthMode("login");
                      setIsAuthModalOpen(true);
                    }}
                  >
                    Login
                  </NavbarButton>
                  <NavbarButton 
                    variant="primary"
                    onClick={() => {
                      setAuthMode("signup");
                      setIsAuthModalOpen(true);
                    }}
                  >
                    Sign Up
                  </NavbarButton>
                </>
              )}
            </div>
          </NavBody>
 
          <MobileNav>
            <MobileNavHeader>
              <button
                type="button"
                onClick={() => {
                  if (isAuthenticated) {
                    router.push(getDashboardPath());
                  } else {
                    router.push("/");
                  }
                }}
                className="flex items-center gap-2 text-left"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1f1f1f] to-[#050505] border border-white/10">
                  <IconChargingPile size={18} className="text-green-400" stroke={1.8} />
                </div>
                <div className="text-white font-bold">
                  <span className="text-green-400">Charge</span>IQ
                </div>
              </button>
              <MobileNavToggle
                isOpen={isMobileMenuOpen}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              />
            </MobileNavHeader>
 
            <MobileNavMenu
              isOpen={isMobileMenuOpen}
              onClose={() => setIsMobileMenuOpen(false)}
            >
              {navItems.map((item, idx) => (
                <a
                  key={`mobile-link-${idx}`}
                  href={item.link}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="relative text-white/90 hover:text-white py-3 px-4 rounded-md hover:bg-white/10 transition-colors duration-200 text-lg font-medium"
                >
                  <span className="block">{item.name}</span>
                </a>
              ))}
              <div className="flex w-full flex-col gap-3 mt-6">
                {isAuthenticated && user ? (
                  <div className="flex flex-col gap-3 w-full bg-white/5 p-4 rounded-xl border border-white/10">
                    <div className="text-white font-semibold text-lg">{user.name}</div>
                    <div className="text-gray-300 text-sm">{user.email}</div>
                    <div className="text-green-400 text-xs font-semibold capitalize">Role: {user.role}</div>
                    <NavbarButton
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full py-3 text-base font-medium bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 mt-2"
                    >
                      Logout
                    </NavbarButton>
                  </div>
                ) : (
                  <>
                    <NavbarButton
                      onClick={() => {
                        setAuthMode("login");
                        setIsAuthModalOpen(true);
                        setIsMobileMenuOpen(false);
                      }}
                      variant="secondary"
                      className="w-full py-3 text-lg font-medium border-2 border-white/30 text-white hover:bg-white/10"
                    >
                      Login
                    </NavbarButton>
                    <NavbarButton
                      onClick={() => {
                        setAuthMode("signup");
                        setIsAuthModalOpen(true);
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full py-3 text-lg font-medium bg-green-500 hover:bg-green-600 text-white border-none"
                    >
                      Sign Up
                    </NavbarButton>
                  </>
                )}
              </div>
            </MobileNavMenu>
          </MobileNav>
        </Navbar>
      </div>
      
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
      />
    </>
  );
}
