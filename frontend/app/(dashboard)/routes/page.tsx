"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import MetricCard from "../../components/MetricCard";
import MapWrapper from "../../../components/MapWrapper";
import LocationSearch, { GeoResult } from "./LocationSearch";

// ── CO₂ & cost helpers ─────────────────────────────────────────────────────────
const CO2_PER_KM: Record<string, number> = {
  "Heavy Duty Truck (Class 8)": 0.9,
  "Medium Duty Box Truck": 0.55,
  "Light Delivery Van": 0.21,
};
const FUEL_PER_KM: Record<string, number> = {
  "Heavy Duty Truck (Class 8)": 1.5,
  "Medium Duty Box Truck": 0.95,
  "Light Delivery Van": 0.5,
};

interface WaypointRow {
  name: string;
  eta: string;
  dist: string;
  status: "Passed" | "Active" | "Pending";
}

export default function RoutesPage() {
  // ── Location state ────────────────────────────────────────────────────────────
  const [origin, setOrigin] = useState<GeoResult | null>(null);
  const [destination, setDestination] = useState<GeoResult | null>(null);
  const [stops, setStops] = useState<(GeoResult | null)[]>([]);

  // ── Map route ─────────────────────────────────────────────────────────────────
  const [activeRoute, setActiveRoute] = useState<{
    origin: [number, number];
    destination: [number, number];
    stops: [number, number][];
  } | null>(null);

  // ── Metrics ───────────────────────────────────────────────────────────────────
  const [distance, setDistance] = useState("—");
  const [time, setTime] = useState("—");
  const [fuelCost, setFuelCost] = useState("—");
  const [co2, setCo2] = useState("—");
  const [vehicleType, setVehicleType] = useState("Heavy Duty Truck (Class 8)");
  const [priority, setPriority] = useState("Time Optimized (Fastest)");
  const [riskScore] = useState(() => Math.floor(Math.random() * 20) + 5);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Waypoints table ───────────────────────────────────────────────────────────
  const [waypointRows, setWaypointRows] = useState<WaypointRow[]>([]);

  // ── Live ETA ticker ───────────────────────────────────────────────────────────
  const [liveEta, setLiveEta] = useState<string | null>(null);
  const etaIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const arrivalRef = useRef<Date | null>(null);

  const startEtaTicker = useCallback((durationSeconds: number) => {
    if (etaIntervalRef.current) clearInterval(etaIntervalRef.current);
    arrivalRef.current = new Date(Date.now() + durationSeconds * 1000);
    const tick = () => {
      const rem = Math.max(0, arrivalRef.current!.getTime() - Date.now());
      const h = Math.floor(rem / 3_600_000);
      const m = Math.floor((rem % 3_600_000) / 60_000);
      const s = Math.floor((rem % 60_000) / 1_000);
      setLiveEta(rem === 0 ? "Arrived" : `${h > 0 ? h + "h " : ""}${m}m ${s}s`);
    };
    tick();
    etaIntervalRef.current = setInterval(tick, 1_000);
  }, []);

  useEffect(() => () => { if (etaIntervalRef.current) clearInterval(etaIntervalRef.current); }, []);

  // ── Route callback ────────────────────────────────────────────────────────────
  const handleRouteCalculated = useCallback(
    (distMeters: number, timeSeconds: number) => {
      const distKm = distMeters / 1000;
      const h = Math.floor(timeSeconds / 3600);
      const m = Math.floor((timeSeconds % 3600) / 60);

      setDistance(`${distKm.toFixed(1)} km`);
      setTime(`${h}h ${m}m`);
      setFuelCost(`$${(distKm * FUEL_PER_KM[vehicleType]).toFixed(0)}`);
      setCo2(`${(distKm * CO2_PER_KM[vehicleType]).toFixed(0)} kg`);
      startEtaTicker(timeSeconds);

      const allNames = [
        origin?.label.split(",")[0] ?? "Origin",
        ...stops.map((s, i) => s?.label.split(",")[0] ?? `Stop ${i + 1}`),
        destination?.label.split(",")[0] ?? "Destination",
      ];
      const segDist = distKm / (allNames.length - 1);
      const segTime = timeSeconds / (allNames.length - 1);

      setWaypointRows(
        allNames.map((name, i) => ({
          name: i === 0 ? `Departure — ${name}` : i === allNames.length - 1 ? `Arrival — ${name}` : name,
          eta:
            i === 0
              ? new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
              : new Date(Date.now() + segTime * i * 1000).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
          dist: i === 0 ? "0 km" : `${(segDist * i).toFixed(1)} km`,
          status: i === 0 ? "Passed" : i === 1 && allNames.length > 2 ? "Active" : "Pending",
        }))
      );
      setIsCalculating(false);
    },
    [vehicleType, origin, destination, stops, startEtaTicker]
  );

  // ── Calculate ─────────────────────────────────────────────────────────────────
  const canCalculate = origin !== null && destination !== null;

  const handleCalculate = () => {
    if (!origin || !destination) {
      setError("Please select both an origin and a destination.");
      return;
    }
    setError(null);
    setIsCalculating(true);
    setLiveEta(null);
    if (etaIntervalRef.current) clearInterval(etaIntervalRef.current);

    setActiveRoute({
      origin: [origin.lat, origin.lon],
      destination: [destination.lat, destination.lon],
      stops: stops
        .filter((s): s is GeoResult => s !== null)
        .map((s) => [s.lat, s.lon]),
    });
  };

  const addStop = () => setStops((s) => [...s, null]);
  const removeStop = (i: number) => setStops((s) => s.filter((_, idx) => idx !== i));
  const updateStop = (i: number, val: GeoResult | null) =>
    setStops((s) => s.map((x, idx) => (idx === i ? val : x)));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <span className="text-[11px] uppercase font-bold tracking-[0.2em] text-primary mb-2 block">AI-Powered</span>
          <h2 className="text-4xl font-extrabold tracking-tighter text-white">Route Optimization</h2>
        </div>
        <button
          onClick={handleCalculate}
          disabled={isCalculating || !canCalculate}
          className="rounded-full bg-primary px-8 py-3 text-white font-bold text-sm uppercase tracking-widest hover:scale-[1.04] hover:bg-primary-hover transition-all glow-primary disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isCalculating ? "Calculating…" : "Run Optimization"}
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-[8px] px-4 py-3 text-red-400 text-sm font-bold">
          ⚠ {error}
        </div>
      )}

      <div className="grid grid-cols-12 gap-8">
        {/* Left panel */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-surface p-6 rounded-[8px] space-y-5">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-text-dim">Route Parameters</h3>

            <div className="space-y-4">
              <LocationSearch
                label="Origin"
                placeholder="Search origin city or address…"
                value={origin}
                onChange={setOrigin}
                icon="origin"
              />

              {stops.map((stop, i) => (
                <div key={i} className="relative">
                  <LocationSearch
                    label={`Stop ${i + 1}`}
                    placeholder="Search a waypoint…"
                    value={stop}
                    onChange={(v) => updateStop(i, v)}
                    icon="stop"
                  />
                  <button
                    onClick={() => removeStop(i)}
                    className="absolute top-0 right-0 text-[10px] font-bold uppercase tracking-wide text-red-400 hover:text-red-300 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              ))}

              <LocationSearch
                label="Destination"
                placeholder="Search destination city or address…"
                value={destination}
                onChange={setDestination}
                icon="destination"
              />

              <button
                onClick={addStop}
                className="w-full h-[36px] border border-dashed border-white/20 rounded-[6px] text-text-dim text-[11px] font-bold uppercase tracking-widest hover:border-primary/60 hover:text-primary transition-colors flex items-center justify-center gap-2"
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M5 1v8M1 5h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                Add Stop
              </button>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-text-dim">Vehicle Type</label>
                <select
                  className="w-full h-[40px] bg-surface-elevated border border-white/5 rounded-[6px] px-4 text-white text-sm focus:ring-1 focus:ring-primary outline-none"
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value)}
                >
                  {Object.keys(CO2_PER_KM).map((v) => <option key={v}>{v}</option>)}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-text-dim">Priority</label>
                <select
                  className="w-full h-[40px] bg-surface-elevated border border-white/5 rounded-[6px] px-4 text-white text-sm focus:ring-1 focus:ring-primary outline-none"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option>Time Optimized (Fastest)</option>
                  <option>Cost Optimized (Fuel Efficient)</option>
                  <option>Balanced</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleCalculate}
              disabled={isCalculating || !canCalculate}
              className="w-full h-[48px] bg-primary rounded-full text-white font-bold text-sm uppercase tracking-widest hover:bg-primary-hover hover:scale-[1.02] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isCalculating ? "Calculating…" : "Calculate Route"}
            </button>

            {!canCalculate && (
              <p className="text-[11px] text-text-dim text-center">
                Search and select both origin &amp; destination to continue
              </p>
            )}
          </div>

          {/* Risk score */}
          <div className="bg-surface p-6 rounded-[8px] text-center border border-white/5 relative overflow-hidden group hover:border-primary/50 transition-colors">
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-text-dim mb-2">Weather &amp; Traffic Risk</p>
              <p className="text-6xl font-extrabold tabular-nums text-primary">{riskScore}</p>
              <p className="text-xs text-text-muted mt-1 font-bold uppercase">
                {riskScore < 20 ? "Low Risk — Safe Passage" : "Moderate Risk — Plan Ahead"}
              </p>
            </div>
          </div>

          {/* Live ETA */}
          {liveEta && (
            <div className="bg-surface p-6 rounded-[8px] text-center border border-primary/20 relative overflow-hidden">
              <div className="absolute inset-0 bg-primary/5" />
              <div className="relative z-10">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-text-dim mb-2">Live ETA Countdown</p>
                <p className="text-3xl font-extrabold tabular-nums text-primary tracking-tighter">{liveEta}</p>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-[10px] font-bold uppercase text-text-dim">Real-time tracking active</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right panel */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <div className="bg-surface rounded-[8px] h-[450px] relative overflow-hidden border border-white/5">
            {activeRoute ? (
              <MapWrapper
                origin={activeRoute.origin}
                destination={activeRoute.destination}
                stops={activeRoute.stops}
                onRouteCalculated={handleRouteCalculated}
                animateTruck
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-text-dim">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" opacity="0.3">
                  <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="2" />
                  <path d="M20 10v10l6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <span className="text-[11px] font-bold uppercase tracking-widest">Search locations to calculate route</span>
              </div>
            )}

            <div className="absolute top-4 left-4 z-[400] bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-[8px] border border-white/10 flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${activeRoute ? "bg-primary animate-pulse" : "bg-text-dim"}`} />
              <span className="text-[10px] font-bold uppercase tracking-widest text-white">
                {activeRoute ? "Live Tracking" : "Standby"}
              </span>
            </div>

            {isCalculating && (
              <div className="absolute inset-0 z-[500] bg-black/40 backdrop-blur-sm flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <span className="text-[11px] font-bold uppercase tracking-widest text-white">Fetching optimal route…</span>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard title="Distance" value={distance} subtitle="total travel" icon="straighten" />
            <MetricCard title="Est. Time" value={time} subtitle="driving time" icon="schedule" />
            <MetricCard title="Est. Cost" value={fuelCost} trend="-4.2%" trendDirection="up" icon="local_gas_station" />
            <MetricCard title="CO₂ Est." value={co2} trend="+5%" trendDirection="up" icon="eco" />
          </div>

          {waypointRows.length > 0 && (
            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-text-dim mb-4">Waypoints</h3>
              <div className="bg-surface rounded-[8px] divide-y divide-white/5">
                {waypointRows.map((w, i) => (
                  <div key={i} className="flex items-center justify-between h-[56px] px-4 hover:bg-surface-elevated transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-2.5 h-2.5 rounded-full ${w.status === "Passed" ? "bg-primary" : w.status === "Active" ? "bg-warning animate-pulse" : "bg-text-dim"}`} />
                      <span className="text-sm font-bold text-white">{w.name}</span>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="text-xs tabular-nums text-text-muted">{w.dist}</span>
                      <span className="text-xs tabular-nums text-text-muted">{w.eta}</span>
                      <span className={`text-[10px] font-bold uppercase ${w.status === "Passed" ? "text-primary" : w.status === "Active" ? "text-warning" : "text-text-dim"}`}>{w.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .leaflet-container { background-color: #121212; }
        .map-tiles { filter: invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%); }
        .leaflet-routing-container { display: none !important; }
      ` }} />
    </div>
  );
}