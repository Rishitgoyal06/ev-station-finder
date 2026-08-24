"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Clock, Globe, Linkedin, Mail, MapPin, Phone, Twitter } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 900));
    setSubmitted(true);
    setIsSubmitting(false);
    setFormData({ name: "", email: "", subject: "", message: "" });
    setTimeout(() => setSubmitted(false), 2500);
  };

  const infoCards = [
    {
      title: "Head office",
      lines: ["123 EV Street, Tech City", "Mumbai, Maharashtra 400001", "India"],
      icon: <MapPin size={18} />,
    },
    {
      title: "Support",
      lines: ["+91 98765 43210", "+91 87654 32109"],
      icon: <Phone size={18} />,
    },
    {
      title: "Email",
      lines: ["support@chargeiq.com", "info@chargeiq.com"],
      icon: <Mail size={18} />,
    },
    {
      title: "Hours",
      lines: ["Mon - Fri: 9:00 AM - 6:00 PM", "Sat: 10:00 AM - 4:00 PM"],
      icon: <Clock size={18} />,
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050705] pt-24 pb-12 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.16),_transparent_30%),radial-gradient(circle_at_80%_30%,_rgba(34,197,94,0.12),_transparent_24%)]" />
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="mx-auto mb-14 max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-300">
            <Globe size={14} />
            We’d love to hear from you
          </div>
          <h1 className="mt-6 text-4xl font-black sm:text-5xl lg:text-6xl">
            Contact <span className="bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent">Charge IQ</span>
          </h1>
          <p className="mt-5 text-lg leading-8 text-slate-300 sm:text-xl">
            Reach out for support, partnerships, station onboarding, or anything else related to your EV charging journey.
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-sm"
          >
            <div className="mb-6">
              <div className="text-sm uppercase tracking-[0.28em] text-slate-400">Send a message</div>
              <h2 className="mt-2 text-3xl font-bold">Tell us what you need</h2>
            </div>

            {submitted && (
              <div className="mb-6 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
                Thanks. Your message has been sent successfully.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { label: "Name", name: "name", type: "text", placeholder: "Your full name" },
                  { label: "Email", name: "email", type: "email", placeholder: "you@example.com" },
                ].map((field) => (
                  <label key={field.name} className="block">
                    <span className="mb-2 block text-sm text-slate-300">{field.label}</span>
                    <input
                      type={field.type}
                      name={field.name}
                      value={formData[field.name as keyof typeof formData]}
                      onChange={handleChange}
                      required
                      placeholder={field.placeholder}
                      className="w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none transition focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/15"
                    />
                  </label>
                ))}
              </div>

              <label className="block">
                <span className="mb-2 block text-sm text-slate-300">Subject</span>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="What is this about?"
                  className="w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none transition focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/15"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm text-slate-300">Message</span>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  placeholder="Tell us how we can help..."
                  className="resize-none w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none transition focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/15"
                />
              </label>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-400 px-5 py-3.5 font-semibold text-black transition-transform hover:scale-[1.01] disabled:opacity-60 disabled:hover:scale-100"
              >
                {isSubmitting ? "Sending..." : "Send message"}
                <ArrowRight size={16} />
              </button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="rounded-[2rem] border border-emerald-400/20 bg-gradient-to-br from-emerald-500/10 to-black p-8 backdrop-blur-sm">
              <div className="text-sm uppercase tracking-[0.28em] text-slate-400">Contact details</div>
              <h2 className="mt-2 text-3xl font-bold">Talk to a real person</h2>
              <div className="mt-8 grid gap-4">
                {infoCards.map((card) => (
                  <div key={card.title} className="rounded-2xl border border-white/10 bg-black/25 p-4">
                    <div className="flex items-start gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-300">
                        {card.icon}
                      </div>
                      <div>
                        <div className="font-semibold">{card.title}</div>
                        <div className="mt-1 text-sm leading-6 text-slate-300">
                          {card.lines.map((line) => (
                            <div key={line}>{line}</div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
              <h3 className="text-xl font-bold">Follow the project</h3>
              <p className="mt-2 text-sm text-slate-400">Stay updated on launches, integrations, and improvements.</p>
              <div className="mt-6 flex gap-3">
                {[
                  { href: "#", icon: <Mail size={18} /> },
                  { href: "#", icon: <Twitter size={18} /> },
                  { href: "#", icon: <Linkedin size={18} /> },
                ].map((item, index) => (
                  <a
                    key={index}
                    href={item.href}
                    className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-black/30 text-emerald-300 transition hover:border-emerald-400/30 hover:bg-emerald-400/10"
                  >
                    {item.icon}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
