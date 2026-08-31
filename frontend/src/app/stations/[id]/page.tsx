"use client";
import { useEffect, useMemo, useState, Suspense } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import { BACKEND_BASE_URL, CLIENT_BACKEND_URL } from "@/lib/backend";

type StationDetail = {
  place_id?: string;
  name?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  rating?: number;
  open_now?: boolean;
  website?: string;
  phone_no?: string;
  photo_urls?: string[];
};

function StationDetailContent() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const stationId = String(params?.id ?? "");
  const [stationData, setStationData] = useState<StationDetail | null>(null);
  const [isStationLoading, setIsStationLoading] = useState(true);

  const fallbackName = searchParams?.get("name") || "EV Charging Station";
  const fallbackAddress = searchParams?.get("address") || "";
  const fallbackCity = searchParams?.get("city") || "";
  const fallbackPrice = parseFloat(searchParams?.get("price") || "15");
  const fallbackChargeTime = searchParams?.get("chargeTime") || "45 mins";
  const fallbackImg = searchParams?.get("img") || "";
  const fallbackAvail = parseInt(searchParams?.get("available") || "1");
  const fallbackTotal = parseInt(searchParams?.get("total") || "4");
  const fallbackPeakPower = searchParams?.get("peakPower") || "50 kW";
  const fallbackPowerType = searchParams?.get("powerType") || "AC Charging";
  const fallbackConnectorStr = searchParams?.get("connectors") || "Type 2";
  const fallbackConnectorNames = fallbackConnectorStr
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean);

  useEffect(() => {
    if (!stationId) return;
    let cancelled = false;

    const loadStation = async () => {
      setIsStationLoading(true);
      try {
        const res = await fetch(`${BACKEND_BASE_URL}/stations/${encodeURIComponent(stationId)}`);
        if (!res.ok) throw new Error("Failed to load station");
        const data = await res.json();
        if (!cancelled) setStationData(data.station ?? null);
      } catch {
        if (!cancelled) setStationData(null);
      } finally {
        if (!cancelled) setIsStationLoading(false);
      }
    };

    loadStation();
    return () => {
      cancelled = true;
    };
  }, [stationId]);

  const stationName = stationData?.name || fallbackName;
  const stationAddr = stationData?.address || fallbackAddress;
  const stationCity = fallbackCity;
  const stationPrice = fallbackPrice;
  const stationChargeTime = fallbackChargeTime;
  const stationPhotos = stationData?.photo_urls || [];
  const stationImg = stationPhotos[0]
    ? `${CLIENT_BACKEND_URL}${stationPhotos[0]}`
    : fallbackImg || "";
  const stationAvail = stationData?.open_now === false ? 0 : fallbackAvail;
  const stationTotal = fallbackTotal;
  const stationPeakPower = fallbackPeakPower;
  const stationPowerType = fallbackPowerType;
  const connectorNames = useMemo(
    () => fallbackConnectorNames.length ? fallbackConnectorNames : ["Type 2"],
    [fallbackConnectorNames]
  );

  const stationEnergy = "42.5 kWh";
  const totalCost = Math.round(42.5 * stationPrice);
  const serviceFee = 15;
  const tax = 10;
  const baseCharge = Math.max(0, totalCost - serviceFee - tax);

  const connectors = connectorNames.map((name) => ({
    id: name.toLowerCase().replace(/\s+/g, ""),
    name: name.toUpperCase(),
    type: name.toLowerCase().includes("ccs") ? "DC Fast Charge" : "AC 22kW",
    power: name.toLowerCase().includes("ccs") ? "DC Fast Charge" : "AC 22kW",
    max: name.toLowerCase().includes("ccs") ? "Up to 150 kW" : "Up to 22 kW",
  }));

  const [connector, setConnector] = useState(connectors[0]?.id || "");
  const [date, setDate] = useState("Today");
  const [time, setTime] = useState("5:30 PM");
  const [imgIdx, setImgIdx] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState("");

  const generateTimeSlots = () => {
    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();
    const timeSlots: string[] = [];
    for (let hour = 5; hour <= 22; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        if (date === "Today") {
          if (
            hour < currentHour ||
            (hour === currentHour && minute <= currentMinute)
          )
            continue;
        }
        const slotTime = new Date();
        slotTime.setHours(hour, minute, 0, 0);
        timeSlots.push(
          slotTime.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          })
        );
      }
    }
    return timeSlots;
  };

  const availableTimeSlots = generateTimeSlots();
  const selectedConnector =
    connectors.find((c) => c.id === connector) ?? connectors[0];
  const bookingDate =
    date === "Today"
      ? new Date().toISOString().slice(0, 10)
      : date === "Tomorrow"
      ? new Date(Date.now() + 86400000).toISOString().slice(0, 10)
      : new Date(Date.now() + 172800000).toISOString().slice(0, 10);
  const slotNumber = "A1";

  useEffect(() => {
    if (!isAuthenticated) router.replace("/");
    if (
      availableTimeSlots.length > 0 &&
      !availableTimeSlots.includes(time)
    ) {
      setTime(availableTimeSlots[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, router, date]);
  if (!isAuthenticated || isStationLoading) return null;

  const displayName =
    typeof user === "string" ? user : user?.name || "Driver";
  const navLinks = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Stations", path: "/stations" },
    { label: "My Bookings", path: "/bookings" },
    { label: "Profile", path: "/profile" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* ── Top nav ── */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-[#1a1a1a] bg-[#0d0d0d] sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="w-8 h-8 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center text-[#aaa] hover:text-white transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
          </button>
          <span className="text-lg font-black">
            <span className="text-green-400">Charge</span>
            <span className="text-white">IQ</span>
          </span>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map(({ label, path }) => (
            <button
              key={label}
              onClick={() => router.push(path)}
              className={`text-[13px] font-medium pb-0.5 transition-colors ${
                label === "Stations"
                  ? "text-white border-b-2 border-green-400"
                  : "text-[#666] hover:text-white"
              }`}
            >
              {label}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center text-[11px] font-bold text-green-400">
            {displayName[0].toUpperCase()}
          </div>
        </div>
      </header>

      {/* ── Body ── */}
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        {/* ── LEFT COLUMN ── */}
        <div className="space-y-4">
          {/* Title */}
          <div>
            <div className="inline-flex items-center gap-1.5 bg-green-500/10 border border-green-500/30 text-green-400 text-[11px] font-semibold px-3 py-1 rounded-full mb-3">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              {stationAvail > 0 ? "ACTIVE STATION" : "STATION OFFLINE"}
            </div>
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-3xl sm:text-4xl font-black leading-tight">
                <span className="text-green-400">{stationName}</span>
              </h1>
              <button
                onClick={() => {
                  const lat = stationData?.latitude ?? searchParams?.get("lat") ?? "";
                  const lng = stationData?.longitude ?? searchParams?.get("lng") ?? "";
                  const qs = new URLSearchParams({
                    station: stationName,
                    address: stationAddr,
                    ...(lat ? { lat: String(lat) } : {}),
                    ...(lng ? { lng: String(lng) } : {}),
                  });
                  router.push(`/directions?${qs.toString()}`);
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#2a2a2a] bg-[#111] text-[#aaa] hover:text-white hover:border-[#444] text-[13px] font-medium transition-all flex-shrink-0"
              >
                <svg
                  className="w-4 h-4 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                >
                  <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                Directions
              </button>
            </div>
            <div className="flex items-center gap-1.5 text-[#666] text-[13px] mt-2">
              <svg
                className="w-3.5 h-3.5 text-green-500 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path d="M12 2C8.686 2 6 4.686 6 8c0 4.5 6 12 6 12s6-7.5 6-12c0-3.314-2.686-6-6-6z" />
                <circle cx="12" cy="8" r="2" />
              </svg>
              {stationAddr}
              {stationCity ? ` • ${stationCity}` : ""}
            </div>
          </div>

          {/* Hero image */}
          <div className="relative rounded-2xl overflow-hidden aspect-[16/9] bg-[#111]">
            {stationImg ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={stationImg}
                  alt={stationName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const el = e.target as HTMLImageElement;
                    el.style.display = "none";
                    const fallback = document.getElementById("img-fallback-detail");
                    if (fallback) { fallback.style.display = "flex"; }
                  }}
                />
                {/* Shown if image fails to load */}
                <div className="hidden w-full h-full absolute inset-0 bg-[#111] flex-col items-center justify-center gap-3" id="img-fallback-detail">
                  <svg className="w-14 h-14 text-green-500/30" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                  </svg>
                  <span className="text-sm text-[#555]">No photo available</span>
                </div>
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                <svg className="w-14 h-14 text-green-500/30" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
                <span className="text-sm text-[#555]">No photo available</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm border border-green-500/40 text-green-400 text-[11px] font-semibold px-3 py-1.5 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              {stationAvail > 0 ? "AVAILABLE NOW" : "FULLY OCCUPIED"}
            </div>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {[0, 1, 2, 3].map((i) => (
                <button
                  key={i}
                  onClick={() => setImgIdx(i)}
                  className={`rounded-full transition-all ${
                    i === imgIdx
                      ? "w-5 h-2 bg-green-400"
                      : "w-2 h-2 bg-white/30 hover:bg-white/60"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-4">
              <p className="text-[10px] text-[#555] font-semibold tracking-widest uppercase mb-2">
                Peak Power
              </p>
              <div className="flex items-center gap-1.5 mb-1">
                <svg
                  className="w-5 h-5 text-green-400"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M13 2L4.5 13.5H11L10 22L19.5 10.5H13Z" />
                </svg>
                <span className="text-2xl font-black text-white">
                  {stationPeakPower}
                </span>
              </div>
              <p className="text-[11px] text-[#555]">{stationPowerType}</p>
            </div>
            <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-4">
              <p className="text-[10px] text-[#555] font-semibold tracking-widest uppercase mb-2">
                Availability
              </p>
              <div className="flex items-center gap-1.5 mb-1">
                <span
                  className={`text-2xl font-black ${
                    stationAvail > 0 ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {stationAvail}/{stationTotal}
                </span>
              </div>
              <p className="text-[11px] text-[#555]">Chargers free</p>
            </div>
            <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-4">
              <p className="text-[10px] text-[#555] font-semibold tracking-widest uppercase mb-2">
                Est. Charge
              </p>
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-2xl font-black text-white">
                  {stationChargeTime}
                </span>
              </div>
              <p className="text-[11px] text-[#555]">10% to 80%</p>
            </div>
          </div>

          {/* Feature badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { icon: "🕐", label: "24/7", sub: "Available" },
              { icon: "🛡️", label: "Safe & Secure", sub: "Monitored" },
              { icon: "🚪", label: "Easy Access", sub: "Wide Entry" },
              { icon: "🌿", label: "Eco Friendly", sub: "100% Green" },
            ].map(({ icon, label, sub }) => (
              <div
                key={label}
                className="bg-[#111] border border-[#1a1a1a] rounded-xl px-3 py-2.5 flex items-center gap-2.5"
              >
                <span className="text-base">{icon}</span>
                <div>
                  <p className="text-white text-[12px] font-semibold leading-tight">
                    {label}
                  </p>
                  <p className="text-[#555] text-[10px]">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT COLUMN — Configure Session ── */}
        <div className="lg:sticky lg:top-[61px] h-fit">
          <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl p-5 space-y-5">
            <h2 className="text-lg font-bold text-white">Configure Session</h2>

            {/* Connector type */}
            <div>
              <p className="text-[10px] font-semibold text-[#555] tracking-widest uppercase mb-3">
                Select Connector Type
              </p>
              <div className="grid grid-cols-2 gap-2">
                {connectors.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setConnector(c.id)}
                    className={`relative flex flex-col items-center gap-1.5 p-4 rounded-xl border transition-all ${
                      connector === c.id
                        ? "border-green-500/60 bg-green-500/8"
                        : "border-[#2a2a2a] bg-[#161616] hover:border-[#3a3a3a]"
                    }`}
                  >
                    {connector === c.id && (
                      <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                        <svg
                          className="w-3 h-3 text-black"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          strokeWidth={3}
                        >
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                    <svg
                      className="w-7 h-7 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                    >
                      {c.id.includes("ccs") ? (
                        <>
                          <rect x="6" y="3" width="12" height="14" rx="2" />
                          <circle
                            cx="9"
                            cy="10"
                            r="1.5"
                            fill="currentColor"
                          />
                          <circle
                            cx="15"
                            cy="10"
                            r="1.5"
                            fill="currentColor"
                          />
                          <rect x="8" y="17" width="3" height="4" rx="1" />
                          <rect x="13" y="17" width="3" height="4" rx="1" />
                        </>
                      ) : (
                        <>
                          <rect x="7" y="3" width="10" height="16" rx="2" />
                          <line x1="10" y1="7" x2="14" y2="7" />
                          <line x1="10" y1="11" x2="14" y2="11" />
                          <circle
                            cx="12"
                            cy="16"
                            r="1"
                            fill="currentColor"
                          />
                        </>
                      )}
                    </svg>
                    <span className="text-white text-[13px] font-bold">
                      {c.name}
                    </span>
                    <span className="text-[#666] text-[10px]">{c.power}</span>
                    <span className="text-[#555] text-[10px]">{c.max}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Date + Time */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-[10px] font-semibold text-[#555] tracking-widest uppercase mb-2">
                  Date
                </p>
                <div className="flex items-center justify-between bg-[#161616] border border-[#2a2a2a] rounded-xl px-3 py-2.5">
                  <select
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="bg-[#161616] text-white text-[13px] font-medium flex-1 focus:outline-none appearance-none cursor-pointer"
                    style={{
                      background: "#161616",
                      color: "white",
                      colorScheme: "dark",
                    }}
                  >
                    <option value="Today">Today</option>
                    <option value="Tomorrow">Tomorrow</option>
                    <option value="Day After">Day After</option>
                  </select>
                  <svg
                    className="w-4 h-4 text-[#555] flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                  >
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-[#555] tracking-widest uppercase mb-2">
                  Arrival Time
                </p>
                <div className="flex items-center justify-between bg-[#161616] border border-[#2a2a2a] rounded-xl px-3 py-2.5">
                  <select
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="bg-[#161616] text-white text-[13px] font-medium flex-1 focus:outline-none appearance-none cursor-pointer"
                    style={{
                      background: "#161616",
                      color: "white",
                      colorScheme: "dark",
                    }}
                  >
                    {availableTimeSlots.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                  <svg
                    className="w-4 h-4 text-[#555] flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                  >
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v5l3 3" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Estimates */}
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-[#666] text-[13px]">
                  Estimated Charge Time
                </span>
                <span className="text-green-400 text-[15px] font-bold">
                  {stationChargeTime}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#666] text-[13px]">
                  Energy Estimate
                </span>
                <span className="text-white text-[13px] font-semibold">
                  ~ {stationEnergy}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#666] text-[13px]">Rate</span>
                <span className="text-white text-[13px] font-semibold">
                  ₹{stationPrice} / kWh
                </span>
              </div>
            </div>

            <div className="h-px bg-[#1f1f1f]" />

            {/* Total */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-white text-[17px] font-bold">
                  Total Cost
                </span>
                <span className="text-green-400 text-[22px] font-black">
                  ₹{totalCost}
                </span>
              </div>
              <p className="text-[#555] text-[10px] flex items-center gap-1">
                Inclusive of taxes and service fee
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                >
                  <circle cx="12" cy="12" r="9" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </p>
            </div>

            {/* Pay button */}
            <button
              disabled={isSubmitting || stationAvail === 0}
              onClick={async () => {
                setIsSubmitting(true);
                try {
                  const res = await fetch("/api/bookings", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      stationId,
                      stationPlaceId: stationId,
                      stationName,
                      address: `${stationAddr}${
                        stationCity ? ", " + stationCity : ""
                      }`,
                      date: bookingDate,
                      time,
                      connector: selectedConnector?.name || connectorNames[0],
                      amount: totalCost,
                      baseCharge,
                      serviceFee,
                      tax,
                      ratePerKwh: stationPrice,
                      energyEstimateKwh: 42.5,
                      slotNumber,
                      estimatedCharge: stationChargeTime,
                      image: stationImg,
                      paymentMethod: "UPI",
                      vehicleInfo: user?.vehicleModel || "",
                      instructions: `Park in slot ${slotNumber}. Use the ChargeIQ app to start charging.`,
                    }),
                  });
                  const data = await res.json();
                  if (res.ok && data.booking?.id) {
                    router.push(
                      `/booking-success?bookingId=${data.booking.id}`
                    );
                  } else {
                    setBookingError(data.detail || data.error || "Booking failed");
                  }
                } catch (error: any) {
                  setBookingError(error?.message || "Booking failed");
                } finally {
                  setIsSubmitting(false);
                }
              }}
              className="w-full flex items-center justify-between bg-green-500 hover:bg-green-400 active:bg-green-600 disabled:bg-green-500/50 text-black font-bold px-5 py-4 rounded-xl transition-colors text-[15px]"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
              {isSubmitting
                ? "Confirming..."
                : stationAvail === 0
                ? "No Slots Available"
                : "Pay & Confirm"}
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[#555] text-[10px]">
              <svg
                className="w-3.5 h-3.5 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              Secure payment powered by Razorpay
            </div>
            {bookingError && (
              <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                {bookingError}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function StationDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen bg-[#0a0a0a] items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full" />
        </div>
      }
    >
      <StationDetailContent />
    </Suspense>
  );
}
