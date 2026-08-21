"use client";
import { useRouter } from "next/navigation";

export default function OwnerBookingsPage() {
  const router = useRouter();

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
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-[#111] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Bookings Management</h3>
          <p className="text-gray-400 mb-6">This page will show all customer bookings across your stations</p>
          <button onClick={() => router.push('/owner')} className="bg-green-500 hover:bg-green-400 text-black px-6 py-3 rounded-xl font-semibold transition-colors">
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}