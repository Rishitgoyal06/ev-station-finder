import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NavBar } from "@/components/NavBar";
import { AuthProvider } from "@/components/AuthContext";
import { Footer } from "@/components/Footer";
import ChatbotButton from "@/components/ChatbotButton";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Charge IQ - India's Largest EV Charging Network",
  description: "Discover India's largest EV charging network with real-time availability, intelligent routing, and 5000+ charging stations. Power your electric vehicle journey with confidence.",
  keywords: "EV charging, electric vehicle, charging stations, India, real-time availability, EV network, electric car charging",
  authors: [{ name: "EV Station Finder Team" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  openGraph: {
    title: "EV Station Finder - India's Largest EV Charging Network",
    description: "Find and navigate to 5000+ EV charging stations across India with real-time availability updates.",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Charge IQ - India's Largest EV Charging Network",
    description: "Discover India's largest EV charging network with real-time availability and intelligent routing.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-br from-black via-gray-950 to-black overflow-x-hidden`}
      >
        <AuthProvider>
          <NavBar />
          {children}
          <ChatbotButton />
        </AuthProvider>
        <Footer />
      </body>
    </html>
  );
}
