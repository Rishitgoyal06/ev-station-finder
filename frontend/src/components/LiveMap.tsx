"use client";
import { CLIENT_BACKEND_URL } from "@/lib/backend";

// Map rendering is handled by the ev-backend static/index.html Leaflet app
export function LiveMap() {
  return (
    <section className="bg-black relative overflow-hidden py-16 sm:py-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.12),transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(6,182,212,0.10),transparent_22%)]" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          <div className="lg:col-span-4 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-green-400/20 bg-green-400/8 px-4 py-2 text-xs sm:text-sm text-green-200 mb-5 backdrop-blur w-fit">
              <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
              Explore live stations near you
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mb-4">
              Real stations,
              <span className="block bg-gradient-to-r from-green-300 via-emerald-300 to-cyan-300 bg-clip-text text-transparent">
                real availability.
              </span>
            </h2>
            <p className="text-gray-300 text-base sm:text-lg leading-relaxed max-w-xl">
              Search, compare, and preview the nearest charging locations. The map section now feels like part of the product, not just a placeholder block.
            </p>
          </div>

          <div className="lg:col-span-8">
            <div className="rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_0_60px_rgba(0,0,0,0.35)] overflow-hidden">
              <iframe
                src={`${CLIENT_BACKEND_URL}/?embed=1&v=${Date.now()}`}
                title="Live EV stations map"
                className="w-full h-[300px] sm:h-[350px] md:h-[400px] border-0"
                allow="geolocation"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          {[
            { title: "Nearby charging", text: "Backed by live backend station data." },
            { title: "Booking ready", text: "Jump from discovery into reservation." },
            { title: "Direction first", text: "Route preview stays one tap away." },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur px-5 py-4">
              <p className="text-white font-semibold mb-1">{item.title}</p>
              <p className="text-sm text-gray-400">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
