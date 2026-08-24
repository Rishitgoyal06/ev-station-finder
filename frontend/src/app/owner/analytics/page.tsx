"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";

export default function OwnerAnalytics() {
  const router = useRouter();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [timeRange, setTimeRange] = useState("7days");
  const [selectedStation, setSelectedStation] = useState("all");
  const [bookings, setBookings] = useState<any[]>([]);
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

  const analyticsData = useMemo(() => {
    const revenue = bookings.reduce((sum, booking) => sum + (booking.amount || 0), 0);
    const completed = bookings.filter((booking) => booking.status === "completed").length;
    const confirmed = bookings.filter((booking) => booking.status === "confirmed").length;
    const cancelled = bookings.filter((booking) => booking.status === "cancelled").length;
    return {
      revenue: {
        today: revenue,
        week: revenue,
        month: revenue,
        growth: 0,
      },
      bookings: {
        today: bookings.length,
        week: bookings.length,
        month: bookings.length,
        growth: 0,
      },
      utilization: {
        current: bookings.length ? Math.min(100, Math.round((confirmed + completed) / bookings.length * 100)) : 0,
        average: bookings.length ? Math.round((confirmed + completed) / bookings.length * 100) : 0,
        peak: bookings.length ? Math.min(100, Math.round(((confirmed + completed) / bookings.length) * 100)) : 0,
      },
      customers: {
        total: new Set(bookings.map((booking) => booking.userId)).size,
        returning: completed,
        new: confirmed,
        satisfaction: bookings.length ? 4.7 : 0,
      },
      cancelled,
    };
  }, [bookings]);

  const revenueData = bookings.length
    ? bookings.map((booking, index) => ({ day: `#${index + 1}`, amount: booking.amount || 0 }))
    : [{ day: "No data", amount: 0 }];

  const utilizationData = bookings.length
    ? bookings.map((booking, index) => ({ hour: `${index + 1} slot`, usage: booking.status === "cancelled" ? 0 : 100 }))
    : [{ hour: "No data", usage: 0 }];

  const stationPerformance = [
    { name: "Whitefield Hub", revenue: 125400, bookings: 456, utilization: 89, rating: 4.9 },
    { name: "HSR Layout", revenue: 98750, bookings: 389, utilization: 82, rating: 4.6 },
    { name: "Koramangala", revenue: 87650, bookings: 234, utilization: 75, rating: 4.8 },
    { name: "Electronic City", revenue: 76540, bookings: 198, utilization: 68, rating: 4.5 }
  ];

  const maxRevenue = Math.max(...revenueData.map(d => d.amount));
  const maxUsage = Math.max(...utilizationData.map(d => d.usage));

  if (isAuthLoading || isLoading) {
    return <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full" /></div>;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-20">
      {/* Header */}
      <div className="bg-[#111] border-b border-[#1a1a1a] px-6 py-4 fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
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
              <h1 className="text-xl font-bold">Analytics Dashboard</h1>
              <p className="text-sm text-gray-400">Performance insights and metrics</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <select 
              value={selectedStation}
              onChange={(e) => setSelectedStation(e.target.value)}
              className="bg-[#1f1f1f] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm"
              style={{ colorScheme: 'dark' }}
            >
              <option value="all">All Stations</option>
              <option value="1">Whitefield Hub</option>
              <option value="2">HSR Layout</option>
              <option value="3">Koramangala</option>
            </select>

            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-[#1f1f1f] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm"
              style={{ colorScheme: 'dark' }}
            >
              <option value="today">Today</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
                </svg>
              </div>
              <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-full">
                +{analyticsData.revenue.growth}%
              </span>
            </div>
            <h3 className="text-sm text-gray-400 mb-1">Revenue (7 days)</h3>
            <p className="text-2xl font-bold text-white">₹{analyticsData.revenue.week.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">₹{analyticsData.revenue.today.toLocaleString()} today</p>
          </div>

          <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              </div>
              <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full">
                +{analyticsData.bookings.growth}%
              </span>
            </div>
            <h3 className="text-sm text-gray-400 mb-1">Bookings (7 days)</h3>
            <p className="text-2xl font-bold text-white">{analyticsData.bookings.week}</p>
            <p className="text-xs text-gray-500 mt-1">{analyticsData.bookings.today} today</p>
          </div>

          <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              </div>
              <span className="text-xs px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full">
                Peak: {analyticsData.utilization.peak}%
              </span>
            </div>
            <h3 className="text-sm text-gray-400 mb-1">Utilization</h3>
            <p className="text-2xl font-bold text-white">{analyticsData.utilization.current}%</p>
            <p className="text-xs text-gray-500 mt-1">Avg: {analyticsData.utilization.average}%</p>
          </div>

          <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
              </div>
              <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full">
                ★ {analyticsData.customers.satisfaction}
              </span>
            </div>
            <h3 className="text-sm text-gray-400 mb-1">Total Customers</h3>
            <p className="text-2xl font-bold text-white">{analyticsData.customers.total}</p>
            <p className="text-xs text-gray-500 mt-1">{analyticsData.customers.new} new this month</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Chart */}
          <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">Revenue Trend</h3>
              <span className="text-xs text-gray-400">Last 7 days</span>
            </div>
            
            <div className="space-y-4">
              {revenueData.map((day, index) => (
                <div key={day.day} className="flex items-center gap-4">
                  <span className="text-xs text-gray-400 w-12">{day.day}</span>
                  <div className="flex-1 bg-[#1f1f1f] rounded-full h-3 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all duration-1000 ease-out"
                      style={{ 
                        width: `${(day.amount / maxRevenue) * 100}%`,
                        transitionDelay: `${index * 100}ms`
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-white w-20 text-right">
                    ₹{(day.amount / 1000).toFixed(0)}k
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Utilization Chart */}
          <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">Hourly Utilization</h3>
              <span className="text-xs text-gray-400">Today</span>
            </div>
            
            <div className="space-y-4">
              {utilizationData.map((hour, index) => (
                <div key={hour.hour} className="flex items-center gap-4">
                  <span className="text-xs text-gray-400 w-12">{hour.hour}</span>
                  <div className="flex-1 bg-[#1f1f1f] rounded-full h-3 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-1000 ease-out"
                      style={{ 
                        width: `${(hour.usage / maxUsage) * 100}%`,
                        transitionDelay: `${index * 100}ms`
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-white w-12 text-right">
                    {hour.usage}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Station Performance Table */}
        <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold">Station Performance</h3>
            <button className="px-4 py-2 bg-green-500 hover:bg-green-400 text-black font-medium rounded-lg transition-colors">
              Export Report
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1a1a1a]">
                  <th className="text-left py-3 px-4 font-medium text-gray-400">Station</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-400">Revenue</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-400">Bookings</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-400">Utilization</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-400">Rating</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {stationPerformance.map((station, index) => (
                  <tr key={index} className="border-b border-[#1a1a1a] hover:bg-[#161616] transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center text-green-400 text-xs font-bold">
                          {index + 1}
                        </div>
                        <span className="font-medium">{station.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-semibold text-green-400">₹{station.revenue.toLocaleString()}</td>
                    <td className="py-4 px-4 text-white">{station.bookings}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-[#1f1f1f] rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-400 rounded-full"
                            style={{ width: `${station.utilization}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-white">{station.utilization}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                        <span className="text-sm text-white">{station.rating}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <button 
                        onClick={() => router.push(`/owner/stations/${index + 1}`)}
                        className="text-green-400 hover:text-green-300 text-sm font-medium transition-colors"
                      >
                        View Details →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
