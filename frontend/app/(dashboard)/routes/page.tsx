"use client";

import { useState } from "react";
import MetricCard from "../../components/MetricCard";
import MapWrapper from "../../../components/MapWrapper";

// Some predefined locations for the demo to work with OSRM (road networks)
const LOCATIONS: Record<string, [number, number]> = {
  "Los Angeles Port": [33.7405, -118.2713],
  "Las Vegas Distribution Hub": [36.1699, -115.1398],
  "San Francisco Port": [37.7749, -122.4194],
  "Phoenix Depot": [33.4484, -112.0740],
  "Seattle Hub": [47.6062, -122.3321],
};

export default function RoutesPage() {
  const [origin, setOrigin] = useState<string>("Los Angeles Port");
  const [destination, setDestination] = useState<string>("Las Vegas Distribution Hub");
  const [activeRoute, setActiveRoute] = useState<{ origin: [number, number]; destination: [number, number] } | null>({
    origin: LOCATIONS["Los Angeles Port"],
    destination: LOCATIONS["Las Vegas Distribution Hub"]
  });

  // Metrics state
  const [distance, setDistance] = useState<string>("0 km");
  const [time, setTime] = useState<string>("0h");
  const [fuelCost, setFuelCost] = useState<string>("$0");
  const [isCalculating, setIsCalculating] = useState(false);

  const [waypoints, setWaypoints] = useState([
    { name: "Departure — " + origin, eta: "08:00", dist: "0 km", status: "Passed" },
    { name: "Arrival — " + destination, eta: "TBD", dist: "TBD", status: "Pending" },
  ]);

  const handleCalculate = () => {
    setIsCalculating(true);
    // Simulate a brief calculation delay
    setTimeout(() => {
      setActiveRoute({
        origin: LOCATIONS[origin],
        destination: LOCATIONS[destination]
      });
      setIsCalculating(false);
    }, 800);
  };

  const handleRouteCalculated = (distMeters: number, timeSeconds: number) => {
    const distKm = (distMeters / 1000).toFixed(1);
    const hours = Math.floor(timeSeconds / 3600);
    const mins = Math.floor((timeSeconds % 3600) / 60);
    
    setDistance(`${distKm} km`);
    setTime(`${hours}h ${mins}m`);
    
    // Rough estimate for trucking cost: $1.50 per km
    const cost = (distMeters / 1000) * 1.5;
    setFuelCost(`$${cost.toFixed(0)}`);

    // Update waypoints based on calculation
    setWaypoints([
      { name: "Departure — " + origin, eta: "08:00", dist: "0 km", status: "Passed" },
      { name: "En Route", eta: "Active", dist: `${(Number(distKm) * 0.4).toFixed(1)} km`, status: "Active" },
      { name: "Arrival — " + destination, eta: `+${hours}h`, dist: `${distKm} km`, status: "Pending" },
    ]);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <span className="text-[11px] uppercase font-bold tracking-[0.2em] text-primary mb-2 block">AI-Powered</span>
          <h2 className="text-4xl font-extrabold tracking-tighter text-white">Route Optimization</h2>
        </div>
        <button 
          onClick={handleCalculate}
          className="rounded-full bg-primary px-8 py-3 text-white font-bold text-sm uppercase tracking-widest hover:scale-[1.04] hover:bg-primary-hover transition-all glow-primary"
        >
          {isCalculating ? "Calculating..." : "Run Optimization"}
        </button>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Left — Route Parameters */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-surface p-6 rounded-[8px] space-y-5">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-text-dim">Route Parameters</h3>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-text-dim">Origin</label>
                <select 
                  className="w-full h-[40px] bg-surface-elevated border-none rounded-[4px] px-4 text-white text-sm focus:ring-1 focus:ring-primary outline-none"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                >
                  {Object.keys(LOCATIONS).map(loc => <option key={loc} value={loc}>{loc}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-text-dim">Destination</label>
                <select 
                  className="w-full h-[40px] bg-surface-elevated border-none rounded-[4px] px-4 text-white text-sm focus:ring-1 focus:ring-primary outline-none"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                >
                  {Object.keys(LOCATIONS).map(loc => <option key={loc} value={loc}>{loc}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-text-dim">Vehicle Type</label>
                <select className="w-full h-[40px] bg-surface-elevated border-none rounded-[4px] px-4 text-white text-sm focus:ring-1 focus:ring-primary outline-none">
                  <option>Heavy Duty Truck (Class 8)</option>
                  <option>Medium Duty Box Truck</option>
                  <option>Light Delivery Van</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-text-dim">Priority</label>
                <select className="w-full h-[40px] bg-surface-elevated border-none rounded-[4px] px-4 text-white text-sm focus:ring-1 focus:ring-primary outline-none">
                  <option>Time Optimized (Fastest)</option>
                  <option>Cost Optimized (Fuel Efficient)</option>
                  <option>Balanced</option>
                </select>
              </div>
            </div>
            <button 
              onClick={handleCalculate}
              className="w-full h-[48px] bg-primary rounded-full text-white font-bold text-sm uppercase tracking-widest hover:bg-primary-hover hover:scale-[1.02] transition-all"
            >
              Calculate Route
            </button>
          </div>

          {/* Risk Score */}
          <div className="bg-surface p-6 rounded-[8px] text-center border border-white/5 relative overflow-hidden group hover:border-primary/50 transition-colors">
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-text-dim mb-2">Weather & Traffic Risk</p>
              <p className="text-6xl font-extrabold tabular-nums text-primary">
                {Math.floor(Math.random() * 20) + 5}
              </p>
              <p className="text-xs text-text-muted mt-1 font-bold uppercase">Low Risk — Safe Passage</p>
            </div>
          </div>
        </div>

        {/* Right — Map + Metrics */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* Route Map */}
          <div className="bg-surface rounded-[8px] h-[450px] relative overflow-hidden border border-white/5">
            {activeRoute ? (
              <MapWrapper 
                origin={activeRoute.origin} 
                destination={activeRoute.destination} 
                onRouteCalculated={handleRouteCalculated}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-text-dim text-[11px] font-bold uppercase tracking-widest">
                Select origin and destination to calculate route
              </div>
            )}
            
            <div className="absolute top-4 left-4 z-[400] bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-[8px] border border-white/10 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-white">Live Tracking</span>
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard title="Distance" value={distance} subtitle="total travel" icon="straighten" />
            <MetricCard title="Est. Time" value={time} subtitle="driving time" icon="schedule" />
            <MetricCard title="Est. Cost" value={fuelCost} trend="-4.2%" trendDirection="up" icon="local_gas_station" />
            <MetricCard title="CO₂ Est." value="142kg" trend="+5%" trendDirection="up" icon="eco" />
          </div>

          {/* Waypoints */}
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-text-dim mb-4">Waypoints</h3>
            <div className="bg-surface rounded-[8px] divide-y divide-white/5">
              {waypoints.map((w, i) => (
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
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .leaflet-container {
          background-color: #121212;
        }
        .map-tiles {
          filter: invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%);
        }
        .leaflet-routing-container {
          display: none !important;
        }
      `}} />
    </div>
  );
}
