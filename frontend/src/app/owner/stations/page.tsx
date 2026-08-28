"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import { fetchStationsCached } from "@/lib/stations";

type LiveStation = {
  place_id: string;
  name: string;
  address: string;
  distance_str: string;
  open_now: boolean;
  latitude: number;
  longitude: number;
};

export default function OwnerStationsPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [stations, setStations] = useState<LiveStation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) router.replace("/");
  }, [isAuthLoading, isAuthenticated, router]);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const data = await fetchStationsCached({ lat: 22.3072, lng: 73.1812, radius: 30000 });
        setStations(data.results || []);
      } catch {
        setStations([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) load();
  }, [isAuthenticated]);

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
              <h1 className="text-xl font-bold">My Stations</h1>
              <p className="text-sm text-gray-400">Manage all your charging stations</p>
            </div>
          </div>
          <button
            onClick={() => window.open("mailto:support@chargeiq.in?subject=Register New EV Station&body=I would like to register a new EV charging station.%0A%0AStation Name:%0AAddress:%0AConnector Types:%0ANumber of Slots:%0AOperating Hours:", "_blank")}
            className="px-4 py-2 bg-green-500 hover:bg-green-400 text-black font-medium rounded-lg transition-colors">
            + Add New Station
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {isLoading ? (
          <div className="text-center py-20 text-gray-400">Loading stations...</div>
        ) : stations.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="text-lg font-semibold text-white mb-2">No stations found</p>
            <p className="text-sm mb-6">Backend may be offline or there are no stations nearby.</p>
            <button onClick={() => router.push("/owner")} className="bg-green-500 hover:bg-green-400 text-black px-6 py-3 rounded-xl font-semibold transition-colors">
              Back to Dashboard
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {stations.slice(0, 9).map((station, index) => (
              <div key={station.place_id} className="bg-[#111] border border-[#1a1a1a] rounded-xl p-5 hover:border-green-500/30 transition-all cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-bold text-white mb-1 text-lg">{station.name}</h4>
                    <p className="text-sm text-gray-400">{station.address}</p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium border ${
                    station.open_now ? "bg-green-500/20 text-green-400 border-green-500/20" : "bg-red-500/20 text-red-400 border-red-500/20"
                  }`}>
                    {station.open_now ? "Open" : "Closed"}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4 text-center">
                  <div>
                    <p className="text-lg font-bold text-green-400">{station.distance_str}</p>
                    <p className="text-xs text-gray-400">Distance</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-blue-400">#{index + 1}</p>
                    <p className="text-xs text-gray-400">Rank</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-white">{station.place_id.slice(0, 4)}</p>
                    <p className="text-xs text-gray-400">ID</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#1a1a1a]">
                  <span className="text-xs text-gray-400">Live backend data</span>
                  <button
                    onClick={() => router.push(`/owner/stations/${index + 1}`)}
                    className="text-green-400 hover:text-green-300 font-medium text-sm transition-colors"
                  >
                    View Details →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
