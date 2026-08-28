"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconCheck,
  IconX,
  IconStar,
  IconBolt,
  IconMapPin,
  IconShield,
  IconSparkles,
  IconLock,
} from "@tabler/icons-react";
import { QRCodePaymentModal } from "@/components/QRCodePaymentModal";
import { useAuth } from "@/components/AuthContext";
import { useRouter } from "next/navigation";

const PREMIUM_AMOUNT = 99;
const PREMIUM_KEY = "chargeiq_premium"; // localStorage key

export function PricingTeaser() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [qrOpen, setQrOpen] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [successBanner, setSuccessBanner] = useState<{ txnId: string } | null>(null);

  // Hydrate premium state from localStorage (keyed per user so it's user-specific)
  useEffect(() => {
    const key = user?.id ? `${PREMIUM_KEY}_${user.id}` : null;
    if (key) {
      setIsPremium(localStorage.getItem(key) === "true");
    } else {
      setIsPremium(false);
    }
  }, [user?.id]);

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
    },
  ];

  const handlePlanClick = (planName: string) => {
    if (planName === "Free") {
      router.push(isAuthenticated ? "/dashboard" : "/register");
      return;
    }

    // Premium plan
    if (!isAuthenticated) {
      // Not logged in — send to login with return hint
      router.push("/login?redirect=pricing");
      return;
    }

    if (isPremium) {
      // Already paid — go to dashboard
      router.push("/dashboard?premium=activated");
      return;
    }

    setQrOpen(true);
  };

  const handlePaymentSuccess = (paymentDetails: {
    transactionId: string;
    amount: number;
    paymentMethod: string;
    paidAt: string;
  }) => {
    // Persist premium per user
    if (user?.id) {
      localStorage.setItem(`${PREMIUM_KEY}_${user.id}`, "true");
    }
    setIsPremium(true);
    setQrOpen(false);
    setSuccessBanner({ txnId: paymentDetails.transactionId });

    // Navigate after banner is visible
    setTimeout(() => {
      router.push(`/dashboard?premium=activated&txn=${paymentDetails.transactionId}`);
    }, 2200);
  };

  const getPremiumButtonLabel = () => {
    if (isPremium) return "✓ Premium Active";
    if (!isAuthenticated) return "Login to Upgrade";
    return "Start Free Trial";
  };

  return (
    <section className="py-24 bg-gradient-to-b from-black via-gray-950/80 to-black relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-green-900/15 via-green-950/8 to-transparent" />
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
            Start free and upgrade when you&apos;re ready for advanced features
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => {
            const isPremiumCard = plan.name === "Premium";
            const isActive = isPremiumCard && isPremium;

            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className={`relative p-8 rounded-3xl border transition-all duration-300 hover:scale-105 ${
                  isActive
                    ? "bg-green-900/20 border-green-400/60 shadow-2xl shadow-green-400/30"
                    : isPremiumCard
                    ? "bg-white/10 border-green-400/50 shadow-2xl shadow-green-400/20"
                    : "bg-white/5 border-white/20 hover:border-white/30"
                }`}
              >
                {/* Badges */}
                {isActive && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="bg-green-500 text-black px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2">
                      <IconCheck className="w-4 h-4" />
                      Active Plan
                    </div>
                  </div>
                )}
                {!isActive && isPremiumCard && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
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
                        <IconCheck className="w-5 h-5 text-green-400 shrink-0" />
                      ) : (
                        <IconX className="w-5 h-5 text-gray-500 shrink-0" />
                      )}
                      <span className={feature.included ? "text-white" : "text-gray-500"}>
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>

                <motion.button
                  whileHover={isActive ? {} : { scale: 1.05 }}
                  whileTap={isActive ? {} : { scale: 0.95 }}
                  onClick={() => handlePlanClick(plan.name)}
                  disabled={isActive}
                  className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                    isActive
                      ? "bg-green-500/20 text-green-400 border border-green-500/40 cursor-default"
                      : isPremiumCard
                      ? "bg-gradient-to-r from-green-400 to-green-600 text-black hover:shadow-2xl hover:shadow-green-400/40 cursor-pointer"
                      : "bg-white/10 text-white border border-white/30 hover:bg-white/20 cursor-pointer"
                  }`}
                >
                  {isPremiumCard && !isAuthenticated && (
                    <IconLock className="w-4 h-4" />
                  )}
                  {getPremiumButtonLabel()}
                </motion.button>

                {/* Login hint below premium button when logged out */}
                {isPremiumCard && !isAuthenticated && (
                  <p className="text-center text-[11px] text-gray-500 mt-2">
                    You need to be logged in to subscribe
                  </p>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Trust badges */}
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

      {/* QR Payment Modal */}
      <QRCodePaymentModal
        isOpen={qrOpen}
        onClose={() => setQrOpen(false)}
        onSuccess={handlePaymentSuccess}
        amount={PREMIUM_AMOUNT}
        title="Charge IQ Premium — Monthly"
        upiId="chargeiq.ev@okaxis"
      />

      {/* Post-payment success banner */}
      <AnimatePresence>
        {successBanner && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-[#0d1f12] border border-green-500/40 text-white px-5 py-3.5 rounded-2xl shadow-[0_0_30px_rgba(34,197,94,0.25)] max-w-sm w-full"
          >
            <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center shrink-0">
              <IconSparkles className="w-4 h-4 text-green-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-green-400">Premium Activated!</p>
              <p className="text-[11px] text-gray-400 font-mono truncate">
                Txn: {successBanner.txnId}
              </p>
            </div>
            <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin shrink-0" />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
