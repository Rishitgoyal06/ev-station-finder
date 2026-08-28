"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import QRCode from "qrcode";
import {
  IconCheck,
  IconCopy,
  IconClock,
  IconShieldCheck,
  IconX,
  IconBolt,
  IconAlertCircle,
  IconRefresh,
  IconSparkles,
} from "@tabler/icons-react";

interface QRCodePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (paymentDetails: {
    transactionId: string;
    amount: number;
    paymentMethod: string;
    paidAt: string;
  }) => void;
  amount: number;
  title?: string;
  upiId?: string;
}

export function QRCodePaymentModal({
  isOpen,
  onClose,
  onSuccess,
  amount,
  title = "EV Charging Slot Booking",
  upiId = "chargeiq.ev@okaxis",
}: QRCodePaymentModalProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState<number>(300); // 5 minutes
  const [copied, setCopied] = useState<boolean>(false);
  const [paymentStatus, setPaymentStatus] = useState<
    "idle" | "verifying" | "success" | "expired"
  >("idle");
  const [transactionId] = useState<string>(
    () => `CIQ${Date.now().toString().slice(-6)}${Math.floor(1000 + Math.random() * 9000)}`
  );

  // Generate UPI QR Code on open / amount change
  useEffect(() => {
    if (!isOpen) {
      // Delay reset so success screen isn't cut off mid-animation
      const t = setTimeout(() => {
        setPaymentStatus("idle");
        setTimeLeft(300);
        setQrDataUrl("");
      }, 600);
      return () => clearTimeout(t);
    }

    const upiUri = `upi://pay?pa=${encodeURIComponent(
      upiId
    )}&pn=${encodeURIComponent(
      "Charge IQ EV Network"
    )}&am=${amount.toFixed(2)}&cu=INR&tn=${encodeURIComponent(
      `ChargeIQ Order ${transactionId}`
    )}`;

    QRCode.toDataURL(upiUri, {
      width: 280,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
      errorCorrectionLevel: "H",
    })
      .then((url: string) => setQrDataUrl(url))
      .catch((err: Error) => console.error("QR Generation error", err));
  }, [isOpen, amount, upiId, transactionId]);

  // Countdown timer
  useEffect(() => {
    if (!isOpen || paymentStatus !== "idle") return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setPaymentStatus("expired");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, paymentStatus]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins}:${remainder < 10 ? "0" : ""}${remainder}`;
  };

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirmPayment = () => {
    setPaymentStatus("verifying");
    setTimeout(() => {
      setPaymentStatus("success");
      setTimeout(() => {
        onSuccess({
          transactionId,
          amount,
          paymentMethod: "UPI_QR",
          paidAt: new Date().toISOString(),
        });
      }, 1500);
    }, 2000);
  };

  if (!isOpen && paymentStatus !== "success") return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            if (paymentStatus !== "verifying" && paymentStatus !== "success") {
              onClose();
            }
          }}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
          className="relative w-full max-w-md bg-[#111111] border border-white/15 rounded-3xl shadow-[0_0_50px_rgba(34,197,94,0.18)] overflow-hidden z-10 text-white"
        >
          {/* Header Banner */}
          <div className="relative bg-linear-to-r from-green-600 via-emerald-600 to-cyan-600 px-6 py-4 text-black flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-black/20 backdrop-blur flex items-center justify-center">
                <IconBolt className="w-5 h-5 text-black fill-black" />
              </div>
              <div>
                <h3 className="text-base font-black tracking-wide leading-none text-black">
                  Charge IQ Gateway
                </h3>
                <p className="text-[11px] font-semibold text-black/75 mt-0.5">
                  UPI Instant QR Checkout
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              disabled={paymentStatus === "verifying" || paymentStatus === "success"}
              className="w-7 h-7 rounded-full bg-black/15 hover:bg-black/30 flex items-center justify-center text-black transition-colors disabled:opacity-40"
            >
              <IconX className="w-4 h-4" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-6 space-y-5">
            {paymentStatus === "success" ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="py-10 text-center space-y-4"
              >
                <div className="w-20 h-20 bg-green-500/20 border-2 border-green-400 rounded-full flex items-center justify-center mx-auto text-green-400">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                  >
                    <IconCheck className="w-10 h-10 stroke-3" />
                  </motion.div>
                </div>
                <h3 className="text-2xl font-black text-white">Payment Verified!</h3>
                <p className="text-sm text-gray-300">
                  ₹{amount.toFixed(2)} received successfully.
                </p>
                <p className="text-xs text-green-400 font-mono">
                  Txn ID: {transactionId}
                </p>
                <div className="inline-flex items-center gap-2 text-xs text-gray-400 animate-pulse pt-2">
                  <IconSparkles className="w-4 h-4 text-green-400" />
                  Finalizing your subscription...
                </div>
              </motion.div>
            ) : paymentStatus === "expired" ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-16 h-16 bg-red-500/10 border border-red-500/30 rounded-full flex items-center justify-center mx-auto text-red-400">
                  <IconAlertCircle className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white">QR Code Expired</h3>
                <p className="text-xs text-gray-400">
                  The payment window has timed out. Please generate a new QR.
                </p>
                <button
                  onClick={() => {
                    setTimeLeft(300);
                    setPaymentStatus("idle");
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-semibold text-white transition-colors"
                >
                  <IconRefresh className="w-4 h-4" />
                  Regenerate QR Code
                </button>
              </div>
            ) : (
              <>
                {/* Amount & Purpose Header */}
                <div className="flex items-center justify-between bg-white/4 border border-white/10 rounded-2xl p-4">
                  <div>
                    <p className="text-xs text-gray-400 font-medium">{title}</p>
                    <p className="text-[11px] text-gray-500 font-mono mt-0.5">
                      Ref: {transactionId}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400 uppercase font-semibold">Total Amount</p>
                    <p className="text-2xl font-black text-green-400">
                      ₹{amount.toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* QR Code Container */}
                <div className="relative mx-auto w-fit p-3.5 bg-white rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.15)] flex flex-col items-center">
                  {qrDataUrl ? (
                    <div className="relative overflow-hidden rounded-xl">
                      <img
                        src={qrDataUrl}
                        alt="Scan QR to Pay"
                        className="w-56 h-56 sm:w-60 sm:h-60 object-contain block"
                      />
                      {/* Scanning Laser Animation */}
                      {paymentStatus === "idle" && (
                        <motion.div
                          animate={{ y: [0, 230, 0] }}
                          transition={{
                            repeat: Infinity,
                            duration: 2.4,
                            ease: "easeInOut",
                          }}
                          className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-green-500 to-transparent shadow-[0_0_12px_#22c55e] pointer-events-none"
                        />
                      )}
                    </div>
                  ) : (
                    <div className="w-60 h-60 flex items-center justify-center text-gray-400">
                      <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}

                  {/* EV Badge Overlay */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-black rounded-xl border-2 border-green-400 flex items-center justify-center shadow-lg">
                    <IconBolt className="w-5 h-5 text-green-400 fill-green-400" />
                  </div>
                </div>

                {/* Timer & Security Row */}
                <div className="flex items-center justify-between text-xs px-1">
                  <div className="flex items-center gap-1.5 text-amber-400 bg-amber-400/10 border border-amber-400/20 px-3 py-1 rounded-full font-mono font-medium">
                    <IconClock className="w-3.5 h-3.5" />
                    <span>Expires in {formatTime(timeLeft)}</span>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] text-gray-400">
                    <IconShieldCheck className="w-4 h-4 text-green-400" />
                    <span>256-Bit SSL Encrypted</span>
                  </div>
                </div>

                {/* Supported Apps Row */}
                <div className="pt-1">
                  <p className="text-[10px] text-center text-gray-400 uppercase tracking-wider font-semibold mb-2">
                    Scan using any UPI App
                  </p>
                  <div className="grid grid-cols-5 gap-2 text-center">
                    {[
                      { name: "GPay", color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
                      { name: "PhonePe", color: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
                      { name: "Paytm", color: "bg-sky-500/10 text-sky-400 border-sky-500/20" },
                      { name: "BHIM", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
                      { name: "CRED", color: "bg-pink-500/10 text-pink-400 border-pink-500/20" },
                    ].map((app) => (
                      <div
                        key={app.name}
                        className={`py-1.5 px-1 rounded-lg border text-[11px] font-bold ${app.color}`}
                      >
                        {app.name}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Copy UPI ID Row */}
                <div className="flex items-center justify-between bg-black/60 border border-white/10 rounded-xl px-3.5 py-2.5">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-400 font-medium">UPI VPA</span>
                    <span className="text-xs font-mono text-gray-200 font-semibold">{upiId}</span>
                  </div>
                  <button
                    onClick={handleCopyUpi}
                    className="flex items-center gap-1 text-xs font-semibold text-green-400 hover:text-green-300 bg-green-500/10 hover:bg-green-500/20 px-2.5 py-1.5 rounded-lg border border-green-500/30 transition-all"
                  >
                    {copied ? (
                      <>
                        <IconCheck className="w-3.5 h-3.5" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <IconCopy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2 pt-1">
                  <button
                    disabled={paymentStatus === "verifying"}
                    onClick={handleConfirmPayment}
                    className="w-full py-3.5 bg-linear-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 active:scale-[0.99] text-black font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-green-500/20 disabled:opacity-50 cursor-pointer"
                  >
                    {paymentStatus === "verifying" ? (
                      <>
                        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        <span>Verifying Bank Transaction...</span>
                      </>
                    ) : (
                      <>
                        <IconCheck className="w-4 h-4 stroke-[2.5]" />
                        <span>I Have Paid — Verify & Complete</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={onClose}
                    disabled={paymentStatus === "verifying"}
                    className="w-full py-2.5 text-xs text-gray-400 hover:text-white transition-colors disabled:opacity-30"
                  >
                    Cancel Payment
                  </button>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
