"use client";

import { motion } from "framer-motion";
import Lottie from "lottie-react";
import { useEffect, useState } from "react";
import { ArrowRight, MapPin, ShieldCheck, Sparkles, Zap } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, ease: "easeOut" },
};

const cards = [
  {
    title: "Smart discovery",
    description: "Find the right charger in seconds with live station data and intelligent routing.",
    icon: <MapPin size={22} />,
  },
  {
    title: "Reliable booking",
    description: "Reserve your slot before you arrive and avoid last-minute uncertainty.",
    icon: <ShieldCheck size={22} />,
  },
  {
    title: "Built for scale",
    description: "A platform designed for drivers, station owners, workers, and admins together.",
    icon: <Sparkles size={22} />,
  },
];

const stats = [
  { value: "10,000+", label: "Charging stations" },
  { value: "24/7", label: "Live availability" },
  { value: "10+", label: "Indian languages" },
  { value: "99.9%", label: "Routing confidence" },
];

export default function AboutSection() {
  const [chargingAnimation, setChargingAnimation] = useState<any>(null);
  const [teamAnimation, setTeamAnimation] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [charging, team] = await Promise.all([
          fetch("/animations/Electric vehicle charging animation.json").then((res) => res.json()),
          fetch("/animations/Business team.json").then((res) => res.json()),
        ]);
        setChargingAnimation(charging);
        setTeamAnimation(team);
      } catch {
        // animations are optional
      }
    };
    load();
  }, []);

  const team = [
    { name: "Rishit Goyal", role: "Product & Engineering", image: "/profile.png" },
    { name: "Het Mehta", role: "Operations", image: "/WhatsApp Image 2026-03-30 at 11.48.19 PM.jpeg" },
    { name: "Anuj Dubey", role: "Platform", image: "/WhatsApp Image 2026-03-31 at 8.25.52 PM.jpeg" },
    { name: "Shyamsundheraaj", role: "Experience", image: "/WhatsApp Image 2026-03-31 at 9.25.26 PM (1).jpeg" },
  ];

  return (
    <div className="min-h-screen overflow-hidden bg-[#050705] text-white">
      <section className="relative px-4 pb-20 pt-28 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.22),_transparent_34%),radial-gradient(circle_at_80%_20%,_rgba(34,197,94,0.16),_transparent_28%)]" />
        <div className="relative z-10 mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-center">
          <motion.div variants={fadeUp} initial="initial" animate="animate" className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-300">
              <Zap size={14} />
              About Charge IQ
            </div>
            <div className="space-y-5">
              <h1 className="text-4xl font-black leading-[0.95] sm:text-5xl lg:text-7xl">
                Charging that feels{" "}
                <span className="bg-gradient-to-r from-emerald-300 via-green-300 to-cyan-300 bg-clip-text text-transparent">
                  effortless
                </span>
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
                Charge IQ helps EV drivers discover nearby stations, compare connector types, book a slot, and navigate with confidence. We connect the whole charging ecosystem so users, owners, workers, and admins can act on real data instead of guesswork.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                  <div className="text-2xl font-bold text-emerald-300">{stat.value}</div>
                  <div className="mt-1 text-sm text-slate-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={fadeUp} initial="initial" animate="animate" className="relative">
            <div className="rounded-[2rem] border border-emerald-400/20 bg-gradient-to-br from-emerald-500/10 via-black to-black p-6 shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
              <div className="rounded-[1.75rem] border border-white/10 bg-black/40 p-4">
                <div className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-[1.5rem] bg-[#0b120d]">
                  {chargingAnimation ? (
                    <Lottie animationData={chargingAnimation} loop className="h-full w-full" />
                  ) : (
                    <div className="p-8 text-center">
                      <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-400/15 text-3xl text-emerald-300">
                        ⚡
                      </div>
                      <div className="text-xl font-semibold">Smart EV charging</div>
                      <div className="mt-2 text-sm text-slate-400">Premium tools for smoother journeys.</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-3">
          {cards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.12 }}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-colors hover:border-emerald-400/30"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-300">
                {card.icon}
              </div>
              <h3 className="text-xl font-bold">{card.title}</h3>
              <p className="mt-3 leading-7 text-slate-300">{card.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur-sm"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-300">
              <Sparkles size={12} />
              Our vision
            </div>
            <h2 className="mt-5 text-3xl font-bold">A better charging experience for every role</h2>
            <p className="mt-4 leading-7 text-slate-300">
              Our goal is to turn charging into a predictable part of travel. That means live availability, booking controls, route-aware suggestions, and dashboards that keep station owners and workers aligned with demand.
            </p>
            <div className="mt-6 grid gap-3">
              {[
                "Real-time station visibility",
                "Slot booking and cancellation flow",
                "Owner and worker dashboards",
                "Admin oversight with live operations",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-slate-200">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  {item}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="rounded-[2rem] border border-emerald-400/20 bg-gradient-to-br from-emerald-500/10 to-black p-8 backdrop-blur-sm"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-sm uppercase tracking-[0.28em] text-slate-400">Team</div>
                <h2 className="mt-2 text-3xl font-bold">Built by a focused crew</h2>
              </div>
              {teamAnimation ? (
                <div className="h-20 w-20 overflow-hidden rounded-2xl">
                  <Lottie animationData={teamAnimation} loop className="h-full w-full" />
                </div>
              ) : null}
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {team.map((member) => (
                <div key={member.name} className="rounded-2xl border border-white/10 bg-black/30 p-4">
                  <div className="flex items-center gap-4">
                    <img src={member.image} alt={member.name} className="h-14 w-14 rounded-full object-cover ring-2 ring-emerald-400/40" />
                    <div>
                      <div className="font-semibold">{member.name}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <a
              href="/stations"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-emerald-300 px-5 py-3 font-semibold text-black transition-transform hover:scale-[1.02]"
            >
              Explore stations
              <ArrowRight size={16} />
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
