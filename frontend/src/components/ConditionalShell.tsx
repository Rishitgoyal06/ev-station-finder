"use client";
import { usePathname } from "next/navigation";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import ChatbotButton from "@/components/ChatbotButton";

// Pages that use their own full-screen layout (no global nav/footer)
const STANDALONE_ROUTES = ["/dashboard", "/stations"];

export function ConditionalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isStandalone = STANDALONE_ROUTES.some((r) => pathname.startsWith(r));

  if (isStandalone) {
    return <>{children}</>;
  }

  return (
    <>
      <NavBar />
      {children}
      <ChatbotButton />
      <Footer />
    </>
  );
}
