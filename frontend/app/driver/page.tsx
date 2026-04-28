"use client"
import dynamic from "next/dynamic";
import MetricCard from "../components/MetricCard";
import { useEffect, useState } from "react";

const DriverMapComponent = dynamic(() => import("./DriverMapComponent"), { ssr: false });
function formatWindow(date: string) {
  if (!date) return "N/A";

  const start = new Date(date);
  const end = new Date(start.getTime() + 60 * 60 * 1000); // +1 hour

  return `${start.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })} - ${end.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
}
function formatEventTime(ts: string) {
  try {
    return new Date(ts).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  } catch {
    return "--:--:--";
  }
}

export default function DriverDashboardPage() {
  const [metrics, setMetrics] = useState({
    deliveries_today: 0,
    on_time_rate: 0,
    total_distance: 0,
    fuel_used: 0,
  });
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const interval = setInterval(() => {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        await fetch("/api/driver/location", {
          method: "POST",
          body: JSON.stringify({
            shipmentId: "your-id",
            lat: pos.coords.latitude,
            lon: pos.coords.longitude,
            location: "Live",
          }),
        });
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);
  const [stops, setStops] = useState<any[]>([]);
  async function loadDashboardData() {
    try {
      const [m, e, s] = await Promise.all([
        fetch("/api/driver/metrics").then((r) => r.json()),
        fetch("/api/driver/events").then((r) => r.json()),
        fetch("/api/driver/upcoming-stops").then((r) => r.json()),
      ]);

      // 🔒 Safety checks (important)
      setMetrics(m?.error ? {
        deliveries_today: 0,
        on_time_rate: 0,
        total_distance: 0,
        fuel_used: 0,
      } : m);

      setEvents(Array.isArray(e) ? e : []);
      setStops(Array.isArray(s) ? s : []);

    } catch (err) {
      console.error("Dashboard load failed:", err);

      // fallback (never break UI)
      setMetrics({
        deliveries_today: 0,
        on_time_rate: 0,
        total_distance: 0,
        fuel_used: 0,
      });
      setEvents([]);
      setStops([]);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    loadDashboardData();
  }, []);
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <span className="text-[11px] uppercase font-bold tracking-[0.2em] text-primary mb-2 block">
            Active Session: TRK-401
          </span>
          <h2 className="text-5xl font-extrabold tracking-tighter text-white">
            Driver Dashboard
          </h2>
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-3 border border-text-dim rounded-full text-white text-sm font-bold uppercase tracking-widest hover:bg-surface-elevated transition-colors">
            End Shift
          </button>
          <button className="rounded-full bg-primary px-8 py-3 text-white font-bold text-sm uppercase tracking-widest hover:scale-[1.04] hover:bg-primary-hover transition-all glow-primary">
            Start Navigation
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Deliveries Today"
          value={metrics.deliveries_today.toString()}
          trend="+2 vs Yesterday"
          trendDirection="up"
          icon="local_shipping"
        />
        <MetricCard
          title="On-Time Rate"
          value={`${metrics.on_time_rate}%`}
          trend="Optimal"
          trendDirection="up"
          icon="timer"
        />
        <MetricCard
          title="Total Distance"
          value={`${metrics.total_distance} mi`}
          subtitle="Route Progress"
          icon="straighten"
        />
        <MetricCard
          title="Fuel Used"
          value={`${metrics.fuel_used} gal`}
          subtitle="Efficiency Normal"
          icon="local_gas_station"
          variant="info"
        />
      </div>

      {/* Bento Content Grid */}
      <div className="grid grid-cols-12 gap-8">
        {/* Map Component (8 cols) */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* Dark Map Preview */}
          <div className="bg-surface rounded-[8px] overflow-hidden h-[500px] relative">
            <DriverMapComponent />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20 pointer-events-none z-10" />
            <div className="space-y-4">
              {stops.length === 0 ? (
                <p className="text-text-dim text-sm">No upcoming stops</p>
              ) : (
                stops.map((stop) => (
                  <div
                    key={stop.id}
                    className="bg-surface-container-high p-4 rounded-[8px] space-y-3 border border-white/5"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-sm font-bold text-white">
                        {stop.id.slice(0, 8).toUpperCase()}
                      </span>

                      <span
                        className={`text-[10px] font-bold uppercase ${stop.priority === "EXPRESS"
                          ? "text-warning"
                          : stop.priority === "PRIORITY"
                            ? "text-primary"
                            : "text-text-muted"
                          }`}
                      >
                        {stop.priority}
                      </span>
                    </div>

                    <p className="text-[11px] text-text-muted truncate">
                      {stop.destination}
                    </p>

                    <p className="text-[10px] text-text-dim mt-1 tabular-nums">
                      Window: {formatWindow(stop.scheduled_dispatch)}
                    </p>
                  </div>
                ))
              )}
            </div>
            {/* Stat overlays */}
            <div className="absolute bottom-6 left-6 flex gap-3 z-20 pointer-events-none">
              <div className="bg-black/70 backdrop-blur-md px-4 py-2 rounded-[8px] border border-white/10">
                <p className="text-[10px] text-text-dim uppercase font-bold">Progress</p>
                <p className="text-lg font-extrabold text-primary tabular-nums">78%</p>
              </div>
              <div className="bg-black/70 backdrop-blur-md px-4 py-2 rounded-[8px] border border-white/10">
                <p className="text-[10px] text-text-dim uppercase font-bold">Remaining</p>
                <p className="text-lg font-extrabold text-white tabular-nums">3.2 mi</p>
              </div>
              <div className="bg-black/70 backdrop-blur-md px-4 py-2 rounded-[8px] border border-white/10">
                <p className="text-[10px] text-text-dim uppercase font-bold">Next ETA</p>
                <p className="text-lg font-extrabold text-warning tabular-nums">12 min</p>
              </div>
            </div>

            {/* Map Actions */}
            <div className="absolute bottom-6 right-6 flex gap-2 z-20">
              <button className="w-12 h-12 rounded-[8px] bg-black/80 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                <span className="material-symbols-outlined text-white">add</span>
              </button>
              <button className="w-12 h-12 rounded-[8px] bg-black/80 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                <span className="material-symbols-outlined text-white">remove</span>
              </button>
              <button className="px-6 h-12 rounded-[8px] bg-primary/10 backdrop-blur-md border border-primary/20 text-primary font-bold text-[11px] uppercase tracking-widest hover:bg-primary/20 transition-colors">
                Report Issue
              </button>
            </div>
          </div>

          {/* Recent Events Feed */}
          <div className="bg-[#0e0e0e] rounded-[8px] p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-text-dim">
                Shift Log
              </h3>
              <button className="text-[10px] font-bold uppercase tracking-widest text-primary hover:underline">
                View Full Log
              </button>
            </div>
            <div className="divide-y divide-white/5">
              {events.map((event, i) => (
                <div key={i} className="flex items-center justify-between h-[56px] px-4 hover:bg-surface-elevated transition-colors rounded-[8px] group">
                  <div className="flex items-center gap-4">
                    <span className="material-symbols-outlined text-text-dim group-hover:text-primary transition-colors">
                      {event.icon}
                    </span>
                    <div>
                      <p className="text-sm font-bold text-white uppercase tracking-tight">
                        {event.title}
                      </p>
                      <p className="text-[10px] text-text-dim font-bold">{event.detail}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-text-dim group-hover:text-text-muted">
                    {event.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (4 cols) */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* Upcoming Stops */}
          <div className="bg-surface p-6 rounded-[8px] border-t-4 border-info">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-info">
                Upcoming Stops
              </h3>
            </div>
            <div className="space-y-4">
              <div className="bg-surface-container-high p-4 rounded-[8px] space-y-3 border border-white/5">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-sm font-bold text-white">DEL-9921</span>
                  <span className="text-[10px] font-bold uppercase text-text-muted">Standard</span>
                </div>
                <p className="text-[11px] text-text-muted truncate">1428 Elm Street, Chicago, IL</p>
                <p className="text-[10px] text-text-dim mt-1 tabular-nums">Window: 14:00 - 15:00</p>
              </div>
              <div className="bg-surface-container-high p-4 rounded-[8px] space-y-3 border border-white/5">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-sm font-bold text-white">DEL-9922</span>
                  <span className="text-[10px] font-bold uppercase text-warning">Express</span>
                </div>
                <p className="text-[11px] text-text-muted truncate">700 Commerce Drive, Dallas, TX</p>
                <p className="text-[10px] text-text-dim mt-1 tabular-nums">Window: 16:00 - 17:00</p>
              </div>
            </div>
          </div>

          {/* Vehicle Status Card */}
          <div className="bg-gradient-to-br from-surface to-surface-elevated p-8 rounded-[8px] relative overflow-hidden group border border-white/5">
            <div className="relative z-10">
              <h3 className="text-2xl font-extrabold text-white tracking-tighter leading-none mb-2">
                Vehicle<br />Health
              </h3>
              <p className="text-[11px] font-bold text-primary uppercase tracking-widest mb-6">
                Status: Optimal
              </p>
              <button className="px-6 py-2 bg-white/10 text-white font-black text-[10px] uppercase tracking-widest rounded-full hover:bg-white/20 transition-colors">
                Run Diagnostics
              </button>
            </div>
            <span className="material-symbols-outlined absolute -bottom-4 -right-4 text-[120px] text-white/5 group-hover:scale-110 transition-transform duration-500">
              directions_car
            </span>
          </div>

          {/* Shift Details */}
          <div className="bg-surface p-6 rounded-[8px]">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-text-dim mb-4">
              Shift Details
            </h3>
            <div className="space-y-4">
              {[
                { label: "Driving Time", value: 45, color: "bg-primary" },
                { label: "Break Allowance", value: 10, color: "bg-info" },
                { label: "Total Shift", value: 35, color: "bg-primary" },
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between text-[10px] font-bold uppercase mb-1">
                    <span className="text-text-muted">{item.label}</span>
                    <span className="text-white">{item.value}% Limit</span>
                  </div>
                  <div className="w-full h-1 bg-white/5 rounded-full">
                    <div
                      className={`h-full ${item.color} rounded-full`}
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
