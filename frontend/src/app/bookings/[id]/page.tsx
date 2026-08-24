"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/components/AuthContext";

export default function BookingDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [booking, setBooking] = useState<any>(null);
  const id = String(params?.id ?? "");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "text-green-400 bg-green-500/10 border-green-500/20";
      case "completed": return "text-blue-400 bg-blue-500/10 border-blue-500/20";
      case "cancelled": return "text-red-400 bg-red-500/10 border-red-500/20";
      default: return "text-gray-400 bg-gray-500/10 border-gray-500/20";
    }
  };

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.replace("/");
      return;
    }

    const loadBooking = async () => {
      if (!id) return;
      const res = await fetch(`/api/bookings/${id}`);
      if (res.ok) {
        const data = await res.json();
        setBooking(data.booking);
      }
    };

    loadBooking();
  }, [id, isAuthLoading, isAuthenticated, router]);

  const cancelBooking = async () => {
    setIsCancelling(true);
    try {
      const res = await fetch(`/api/bookings/${id}`, { method: "DELETE" });
      if (res.ok) {
        const data = await res.json().catch(() => ({}));
        setBooking((prev: any) => prev ? { ...prev, status: data.booking?.status || "cancelled" } : prev);
        setShowCancelModal(false);
      }
    } finally {
      setIsCancelling(false);
    }
  };

  const paymentSummary = {
    chargingFee: booking?.baseCharge ?? Math.max(0, (booking?.amount || 0) - 25),
    serviceFee: booking?.serviceFee ?? 15,
    taxes: booking?.tax ?? 10,
  };

  if (isAuthLoading || !booking) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-20">
      {/* Header */}
      <div className="bg-[#111] border-b border-[#1a1a1a] px-6 py-4 fixed top-0 left-0 right-0 z-50">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="p-2 hover:bg-[#1f1f1f] rounded-xl transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </button>
            <div>
              <h1 className="text-xl font-bold">Booking Details</h1>
              <p className="text-sm text-gray-400">Booking ID: {booking.id}</p>
            </div>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(booking.status)}`}>
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Station Info */}
            <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 bg-[#1f1f1f] rounded-lg overflow-hidden flex-shrink-0">
                  <img src={booking.image} alt={booking.stationName} className="w-full h-full object-cover"/>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-white mb-2">{booking.stationName}</h2>
                  <p className="text-gray-400 mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path d="M12 2C8.686 2 6 4.686 6 8c0 4.5 6 12 6 12s6-7.5 6-12c0-3.314-2.686-6-6-6z"/>
                      <circle cx="12" cy="8" r="2"/>
                    </svg>
                    {booking.address}
                  </p>
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-lg text-sm font-medium transition-colors hover:bg-blue-500/20">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path d="M9 11H7a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2h-2M9 11V9a2 2 0 1 1 4 0v2M9 11h6"/>
                      </svg>
                      Get Directions
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-[#1f1f1f] border border-[#2a2a2a] rounded-lg text-sm font-medium transition-colors hover:bg-[#2a2a2a]">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path d="M3 5a2 2 0 0 1 2-2h3.28a1 1 0 0 1 .948.684l1.498 4.493a1 1 0 0 1-.502 1.21l-2.257 1.13a11.042 11.042 0 0 0 5.516 5.516l1.13-2.257a1 1 0 0 1 1.21-.502l4.493 1.498a1 1 0 0 1 .684.949V19a2 2 0 0 1-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                      </svg>
                      Call Station
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Timeline */}
            <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Booking Timeline</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-green-500/10 border-2 border-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22,4 12,14.01 9,11.01"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium">Booking Confirmed</p>
                    <p className="text-sm text-gray-400">{booking.bookedAt}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-500/10 border-2 border-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium">Scheduled Charging</p>
                    <p className="text-sm text-gray-400">{booking.date} at {booking.time}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#1f1f1f] border-2 border-[#2a2a2a] rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22,4 12,14.01 9,11.01"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-500 font-medium">Charging Complete</p>
                    <p className="text-sm text-gray-500">Pending</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Charging Details */}
            <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Charging Session Details</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-[#161616] border border-[#2a2a2a] rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-1">Connector Type</p>
                  <p className="text-lg font-semibold text-white">{booking.connector}</p>
                </div>
                <div className="bg-[#161616] border border-[#2a2a2a] rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-1">Duration</p>
                  <p className="text-lg font-semibold text-white">{booking.estimatedCharge}</p>
                </div>
                <div className="bg-[#161616] border border-[#2a2a2a] rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-1">Energy Estimate</p>
                  <p className="text-lg font-semibold text-white">{booking.energyEstimate || "25 kWh"}</p>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-blue-500/5 border border-blue-500/20 rounded-lg">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <circle cx="12" cy="12" r="9"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  <div>
                    <p className="text-blue-400 font-medium text-sm">Charging Instructions</p>
                    <p className="text-gray-300 text-sm mt-1">{booking.instructions}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Payment Summary */}
            <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Payment Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Charging Fee</span>
                  <span className="text-white">₹{paymentSummary.chargingFee}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Service Fee</span>
                  <span className="text-white">₹{paymentSummary.serviceFee}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Taxes</span>
                  <span className="text-white">₹{paymentSummary.taxes}</span>
                </div>
                <div className="border-t border-[#1a1a1a] pt-3">
                  <div className="flex justify-between">
                    <span className="text-white font-semibold">Total Amount</span>
                    <span className="text-green-400 font-bold text-lg">₹{booking.amount}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-[#1a1a1a]">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400 text-sm">Payment Method</span>
                    <span className="text-white text-sm">{booking.paymentMethod}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Transaction ID</span>
                    <span className="text-white text-sm font-mono">{booking.transactionId}</span>
                </div>
              </div>
            </div>

            {/* Vehicle Info */}
            <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Vehicle Information</h3>
              <div className="flex items-center gap-3 p-4 bg-[#161616] border border-[#2a2a2a] rounded-lg">
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path d="M7 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"/><path d="M17 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"/><path d="M5 17h-2v-6l2-5h9l4 5h1a2 2 0 0 1 2 2v4h-2"/>
                  </svg>
                </div>
                <div>
                  <p className="text-white font-medium">{booking.vehicleInfo}</p>
                  <p className="text-gray-400 text-sm">Electric Vehicle</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              {booking.status === "confirmed" && (
                <button 
                  onClick={() => setShowCancelModal(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-xl font-semibold transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <circle cx="12" cy="12" r="9"/><path d="M15 9l-6 6M9 9l6 6"/>
                  </svg>
                  Cancel Booking
                </button>
              )}

              <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#1f1f1f] hover:bg-[#2a2a2a] border border-[#2a2a2a] rounded-xl font-semibold transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
                Contact Support
              </button>

              <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#1f1f1f] hover:bg-[#2a2a2a] border border-[#2a2a2a] rounded-xl font-semibold transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7,10 12,15 17,10"/><line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Download Receipt
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <circle cx="12" cy="12" r="9"/><path d="M15 9l-6 6M9 9l6 6"/>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Cancel Booking</h3>
                <p className="text-sm text-gray-400">Are you sure you want to cancel?</p>
              </div>
            </div>
            
            <p className="text-gray-300 text-sm mb-6">
              Canceling this booking will refund ₹{booking.amount} to your original payment method within 3-5 business days.
            </p>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setShowCancelModal(false)}
                className="flex-1 px-4 py-2 bg-[#1f1f1f] hover:bg-[#2a2a2a] border border-[#2a2a2a] rounded-lg font-medium transition-colors"
              >
                Keep Booking
              </button>
              <button
                onClick={cancelBooking}
                disabled={isCancelling}
                className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-red-500/60 text-white rounded-lg font-medium transition-colors"
              >
                {isCancelling ? "Cancelling..." : "Yes, Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
