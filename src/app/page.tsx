import Image from "next/image";
import { HeroSection } from "@/components/HeroSection";
import { LiveMap } from "@/components/LiveMap";

export default function Home() {
  return (
    <>
      <HeroSection />
      <LiveMap />
    </>
  );
}
