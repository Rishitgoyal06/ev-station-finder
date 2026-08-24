"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";

type Booking = {
  id: string;
  stationName: string;
  address: string;
  date: string;
  time: string;
  connector: string;
  amount: number;
  status: "confirmed" | "completed" | "cancelled";
  slotNumber: string;
};

export default function OwnerBookingsPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) router.replace("/");
  }, [isAuthLoading, isAuthenticated, router]);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/bookings");
        if (res.ok) {
          const data = await res.json();
          setBookings(data.bookings || []);
        } else {
          setBookings([]);
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) load();
  }, [isAuthenticated]);

  if (isAuthLoading) {
    return <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full" /></div>;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-20">
      <div className="bg-[#111] border-b border-[#1a1a1a] px-6 py-4 fixed top-0 left-0 right-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="p-2 hover:bg-[#1f1f1f] rounded-xl transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </button>
            <div>
              <h1 className="text-xl font-bold">All Bookings</h1>
              <p className="text-sm text-gray-400">Manage customer bookings across all stations</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {isLoading ? (
          <div className="text-center py-20 text-gray-400">Loading bookings...</div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-[#111] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Bookings Management</h3>
            <p className="text-gray-400 mb-6">No bookings yet. They will appear here once customers start reserving slots.</p>
            <button onClick={() => router.push('/owner')} className="bg-green-500 hover:bg-green-400 text-black px-6 py-3 rounded-xl font-semibold transition-colors">
              Back to Dashboard
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-[#111] border border-[#1a1a1a] rounded-xl p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-white">{booking.stationName}</h3>
                    <p className="text-sm text-gray-400">{booking.address}</p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">{booking.status}</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <p className="text-gray-400">ID: <span className="text-white font-mono">{booking.id}</span></p>
                  <p className="text-gray-400">Slot: <span className="text-white">{booking.slotNumber}</span></p>
                  <p className="text-gray-400">Time: <span className="text-white">{booking.time}</span></p>
                  <p className="text-gray-400">Amount: <span className="text-green-400 font-semibold">₹{booking.amount}</span></p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
