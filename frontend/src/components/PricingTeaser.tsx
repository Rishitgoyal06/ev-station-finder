"use client";
import React from "react";
import { motion } from "framer-motion";
import { IconCheck, IconX, IconStar, IconBolt, IconMapPin, IconShield } from "@tabler/icons-react";

export function PricingTeaser() {
  const plans = [
    {
      name: "Free",
      price: "₹0",
      period: "forever",
      description: "Perfect for occasional EV drivers",
      features: [
        { text: "Find nearby charging stations", included: true },
        { text: "Real-time availability", included: true },
        { text: "Basic route planning", included: true },
        { text: "Community reviews", included: true },
        { text: "Advanced route optimization", included: false },
        { text: "Priority customer support", included: false },
        { text: "Booking reservations", included: false },
        { text: "Detailed analytics", included: false },
      ],
      popular: false,
      cta: "Get Started Free",
      gradient: "from-gray-600 to-gray-700"
    },
    {
      name: "Premium",
      price: "₹99",
      period: "per month",
      description: "For serious EV enthusiasts and daily drivers",
      features: [
        { text: "Everything in Free", included: true },
        { text: "Advanced route optimization", included: true },
        { text: "Booking reservations", included: true },
        { text: "Priority customer support", included: true },
        { text: "Detailed trip analytics", included: true },
        { text: "Offline maps", included: true },
        { text: "Multiple vehicle profiles", included: true },
        { text: "Carbon footprint tracking", included: true },
      ],
      popular: true,
      cta: "Start Free Trial",
      gradient: "from-green-400 to-green-600"
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-black via-gray-950/80 to-black relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-900/15 via-green-950/8 to-transparent" />
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-green-900/20 to-transparent" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-green-600/10 via-green-700/5 to-transparent rounded-full blur-3xl animate-pulse" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
            Choose Your{" "}
            <span className="bg-gradient-to-r from-green-300 via-green-400 to-green-500 bg-clip-text text-transparent">
              EV Journey
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Start free and upgrade when you're ready for advanced features
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className={`relative p-8 rounded-3xl border transition-all duration-300 hover:scale-105 ${
                plan.popular 
                  ? 'bg-white/10 border-green-400/50 shadow-2xl shadow-green-400/20' 
                  : 'bg-white/5 border-white/20 hover:border-white/30'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-green-400 to-green-600 text-black px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2">
                    <IconStar className="w-4 h-4" />
                    Most Popular
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center gap-2 mb-2">
                  <span className="text-4xl font-black text-white">{plan.price}</span>
                  <span className="text-gray-400">/{plan.period}</span>
                </div>
                <p className="text-gray-400">{plan.description}</p>
              </div>

              <div className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center gap-3">
                    {feature.included ? (
                      <IconCheck className="w-5 h-5 text-green-400 flex-shrink-0" />
                    ) : (
                      <IconX className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    )}
                    <span className={`${feature.included ? 'text-white' : 'text-gray-500'}`}>
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${
                  plan.popular
                    ? 'bg-gradient-to-r from-green-400 to-green-600 text-black hover:shadow-2xl hover:shadow-green-400/40'
                    : 'bg-white/10 text-white border border-white/30 hover:bg-white/20'
                }`}
              >
                {plan.cta}
              </motion.button>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center">
                <IconShield className="w-8 h-8 text-white" />
              </div>
              <div className="text-center">
                <h4 className="text-lg font-semibold text-white mb-2">30-Day Money Back</h4>
                <p className="text-gray-400 text-sm">Not satisfied? Get a full refund within 30 days</p>
              </div>
            </div>
            
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                <IconBolt className="w-8 h-8 text-white" />
              </div>
              <div className="text-center">
                <h4 className="text-lg font-semibold text-white mb-2">Instant Activation</h4>
                <p className="text-gray-400 text-sm">Premium features activate immediately after payment</p>
              </div>
            </div>
            
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
                <IconMapPin className="w-8 h-8 text-white" />
              </div>
              <div className="text-center">
                <h4 className="text-lg font-semibold text-white mb-2">All India Coverage</h4>
                <p className="text-gray-400 text-sm">Access to 5000+ charging stations nationwide</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}