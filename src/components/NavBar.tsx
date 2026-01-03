"use client";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { useState } from "react";
import { SignupModal } from "./SignupModal";
import { LoginModal } from "./LoginModal";
 
export function NavBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const navItems = [
    { name: "Home", link: "/" },
    { name: "Features", link: "#features" },
    { name: "About Us", link: "#about" },
    { name: "Services", link: "#services" },
    { name: "Contact Us", link: "#contact" },
  ];
 
  return (
    <>
      <div className="relative w-full">
        <Navbar>
          <NavBody>
            <NavbarLogo />
            <NavItems items={navItems} />
            <div className="flex items-center gap-4">
              <NavbarButton 
                variant="secondary"
                onClick={() => setIsLoginModalOpen(true)}
              >
                Login
              </NavbarButton>
              <NavbarButton 
                variant="primary"
                onClick={() => setIsSignupModalOpen(true)}
              >
                Sign Up
              </NavbarButton>
            </div>
          </NavBody>
 
          <MobileNav>
            <MobileNavHeader>
              <NavbarLogo />
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
                <NavbarButton
                  onClick={() => {
                    setIsLoginModalOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  variant="secondary"
                  className="w-full py-3 text-lg font-medium border-2 border-white/30 text-white hover:bg-white/10"
                >
                  Login
                </NavbarButton>
                <NavbarButton
                  onClick={() => {
                    setIsSignupModalOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full py-3 text-lg font-medium bg-green-500 hover:bg-green-600 text-white border-none"
                >
                  Sign Up
                </NavbarButton>
              </div>
            </MobileNavMenu>
          </MobileNav>
        </Navbar>
      </div>
      
      <SignupModal 
        isOpen={isSignupModalOpen} 
        onClose={() => setIsSignupModalOpen(false)} 
      />
      
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </>
  );
}