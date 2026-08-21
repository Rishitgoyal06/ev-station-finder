"use client";
import { useRouter } from "next/navigation";

export default function OwnerStationsPage() {
  const router = useRouter();

  const stations = [
    {
      id: 1,
      name: "GreenCharge Whitefield",
      address: "ITPL Main Road, Whitefield, Bengaluru",
      totalSlots: 8,
      occupiedSlots: 5,
      availableSlots: 3,
      todayRevenue: 4200,
      status: "active",
      maintenanceSlots: 0
    },
    {
      id: 2,
      name: "GreenCharge HSR Layout",
      address: "Sector 2, HSR Layout, Bengaluru",
      totalSlots: 12,
      occupiedSlots: 8,
      availableSlots: 3,
      todayRevenue: 6800,
      status: "active",
      maintenanceSlots: 1
    },
    {
      id: 3,
      name: "GreenCharge Koramangala",
      address: "5th Block, Koramangala, Bengaluru",
      totalSlots: 6,
      occupiedSlots: 2,
      availableSlots: 4,
      todayRevenue: 2100,
      status: "active",
      maintenanceSlots: 0
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-20">
      {/* Header */}
      <div className="bg-[#111] border-b border-[#1a1a1a] px-6 py-4 fixed top-0 left-0 right-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.back()}
              className="p-2 hover:bg-[#1f1f1f] rounded-xl transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </button>
            <div>
              <h1 className="text-xl font-bold">My Stations</h1>
              <p className="text-sm text-gray-400">Manage all your charging stations</p>
            </div>
          </div>
          
          <button className="px-4 py-2 bg-green-500 hover:bg-green-400 text-black font-medium rounded-lg transition-colors">
            + Add New Station
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {stations.map((station) => (
            <div key={station.id} className="bg-[#111] border border-[#1a1a1a] rounded-xl p-5 hover:border-green-500/30 transition-all cursor-pointer">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="font-bold text-white mb-1 text-lg">{station.name}</h4>
                  <p className="text-sm text-gray-400">{station.address}</p>
                </div>
                <button 
                  onClick={() => router.push(`/owner/stations/${station.id}`)}
                  className="p-2 hover:bg-[#1f1f1f] rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-4 gap-3 mb-4">
                <div className="text-center">
                  <p className="text-lg font-bold text-green-400">{station.availableSlots}</p>
                  <p className="text-xs text-gray-400">Available</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-yellow-400">{station.occupiedSlots}</p>
                  <p className="text-xs text-gray-400">Occupied</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-red-400">{station.maintenanceSlots}</p>
                  <p className="text-xs text-gray-400">Maintenance</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-white">{station.totalSlots}</p>
                  <p className="text-xs text-gray-400">Total</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#1a1a1a]">
                <div>
                  <p className="text-sm text-gray-400">Today's Revenue</p>
                  <p className="font-bold text-green-400 text-lg">₹{station.todayRevenue.toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-400">Active</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}