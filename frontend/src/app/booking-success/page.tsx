"use client";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function BookingSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [countdown, setCountdown] = useState(5);
  const bookingId = searchParams.get("bookingId");
  const [bookingData, setBookingData] = useState<any>(null);

  useEffect(() => {
    const loadBooking = async () => {
      if (!bookingId) return;
      const res = await fetch(`/api/bookings/${bookingId}`);
      if (res.ok) {
        const data = await res.json();
        setBookingData(data.booking);
      }
    };
    loadBooking();

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router, bookingId]);

  useEffect(() => {
    if (countdown === 0) {
      router.push("/bookings");
    }
  }, [countdown, router]);

  const fallbackBooking = {
    id: "BK001",
    stationName: "GreenCharge Hub",
    address: "MG Road, Bengaluru, Karnataka 560001",
    date: "2026-08-15",
    time: "5:30 PM - 6:15 PM",
    connector: "CCS2",
    amount: 245,
    slotNumber: "A3",
    estimatedCharge: "45 minutes",
    image: "/WhatsApp Image 2026-03-30 at 11.48.19 PM.jpeg"
  };
  const activeBooking = bookingData ?? fallbackBooking;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        {/* Success Animation */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
              <path d="M5 13l4 4L19 7"/>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Booking Confirmed!</h1>
          <p className="text-gray-400">Your charging slot has been successfully reserved</p>
        </div>

        {/* Booking Details Card */}
        <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl p-6 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-[#1f1f1f] rounded-lg overflow-hidden">
              <img src={activeBooking.image} alt={activeBooking.stationName} className="w-full h-full object-cover"/>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{activeBooking.stationName}</h3>
              <p className="text-sm text-gray-400">{activeBooking.address}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-[#161616] border border-[#2a2a2a] rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">Booking ID</p>
              <p className="text-white font-semibold">{activeBooking.id}</p>
            </div>
            <div className="bg-[#161616] border border-[#2a2a2a] rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">Slot Number</p>
              <p className="text-green-400 font-semibold">{activeBooking.slotNumber}</p>
            </div>
            <div className="bg-[#161616] border border-[#2a2a2a] rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">Date & Time</p>
              <p className="text-white font-semibold">{activeBooking.date}</p>
              <p className="text-xs text-gray-400">{activeBooking.time}</p>
            </div>
            <div className="bg-[#161616] border border-[#2a2a2a] rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">Connector</p>
              <p className="text-white font-semibold">{activeBooking.connector}</p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#1a1a1a]">
            <span className="text-gray-400">Total Amount Paid</span>
            <span className="text-2xl font-bold text-green-400">₹{activeBooking.amount}</span>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4 mb-8">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <circle cx="12" cy="12" r="9"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <div>
              <h4 className="text-blue-400 font-semibold mb-2">Next Steps</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Arrive at the station 5 minutes before your slot time</li>
                <li>• Park your vehicle in slot {activeBooking.slotNumber}</li>
                <li>• Use the ChargeIQ app to start charging</li>
                <li>• Your slot is reserved for {activeBooking.estimatedCharge}</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button 
            onClick={() => router.push(`/bookings/${activeBooking.id}`)}
            className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-black px-6 py-4 rounded-xl font-semibold transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
            </svg>
            View Booking Details
          </button>

          <button 
            onClick={() => router.push('/dashboard')}
            className="w-full flex items-center justify-center gap-2 bg-[#111] hover:bg-[#1f1f1f] border border-[#2a2a2a] px-6 py-4 rounded-xl font-semibold transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
              <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
            </svg>
            Back to Dashboard
          </button>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => router.push('/stations')}
              className="flex-1 flex items-center justify-center gap-2 bg-[#1f1f1f] hover:bg-[#2a2a2a] border border-[#2a2a2a] px-4 py-3 rounded-xl font-medium text-sm transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              Find More Stations
            </button>
            <button 
              onClick={() => router.push('/bookings')}
              className="flex-1 flex items-center justify-center gap-2 bg-[#1f1f1f] hover:bg-[#2a2a2a] border border-[#2a2a2a] px-4 py-3 rounded-xl font-medium text-sm transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              My Bookings
            </button>
          </div>
        </div>

        {/* Auto Redirect Info */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Redirecting to My Bookings in {countdown} seconds
          </p>
        </div>

        {/* Share Options */}
        <div className="flex items-center justify-center gap-4 mt-6 pt-6 border-t border-[#1a1a1a]">
          <span className="text-sm text-gray-400">Share:</span>
          <button className="p-2 bg-[#1f1f1f] hover:bg-[#2a2a2a] rounded-lg transition-colors">
            <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.106"/>
            </svg>
          </button>
          <button className="p-2 bg-[#1f1f1f] hover:bg-[#2a2a2a] rounded-lg transition-colors">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"/><polyline points="16,6 12,2 8,6"/><line x1="12" y1="2" x2="12" y2="15"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function BookingSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-4">Loading booking details...</div>}>
      <BookingSuccessContent />
    </Suspense>
  );
}
