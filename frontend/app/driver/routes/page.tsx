"use client";

import { useState } from "react";
import { Truck, CheckCircle2, ChevronRight, MapPin, Navigation } from "lucide-react";


interface Route {
  id: string;
  status: "ACTIVE" | "COMPLETED" | "SCHEDULED";
  departureTime: string;
  arrivalTime?: string;
  totalDistance: string;
  stops: number;
  origin: string;
  destination: string;
  progress?: number;
}

export default function MyRoutesPage() {
  const [activeTab, setActiveTab] = useState<"active" | "history">("active");

  const routes: Route[] = [
    {
      id: "RT-8812",
      status: "ACTIVE",
      departureTime: "08:00 AM",
      totalDistance: "124 mi",
      stops: 8,
      origin: "Hub Central B",
      destination: "Metro Distribution Center",
      progress: 65,
    },
    {
      id: "RT-8810",
      status: "COMPLETED",
      departureTime: "06:00 AM",
      arrivalTime: "11:45 AM",
      totalDistance: "85 mi",
      stops: 5,
      origin: "Hub Central B",
      destination: "Retail Zone 4",
    },
    {
      id: "RT-8809",
      status: "COMPLETED",
      departureTime: "Yesterday",
      arrivalTime: "14:20 PM",
      totalDistance: "210 mi",
      stops: 12,
      origin: "North Logistics Yard",
      destination: "Hub Central B",
    },
  ];

  const activeRoute = routes.find(r => r.status === "ACTIVE");
  const pastRoutes = routes.filter(r => r.status === "COMPLETED");

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <nav className="flex gap-2 mb-4">
            <button
              onClick={() => setActiveTab("active")}
              className={`text-[11px] uppercase font-bold tracking-widest px-4 py-1 rounded-full transition-all ${activeTab === "active" ? "bg-primary text-white" : "text-text-dim hover:text-white"}`}
            >
              Current Tasks
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`text-[11px] uppercase font-bold tracking-widest px-4 py-1 rounded-full transition-all ${activeTab === "history" ? "bg-primary text-white" : "text-text-dim hover:text-white"}`}
            >
              Route History
            </button>
          </nav>
          <h2 className="text-5xl font-extrabold tracking-tighter text-white">
            {activeTab === "active" ? "Fleet Dispatch" : "Historical Logs"}
          </h2>
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-3 border border-white/10 bg-white/5 rounded-full text-white text-[11px] font-bold uppercase tracking-widest hover:bg-white/10 transition-colors">
            Download Log
          </button>
          <button className="rounded-full bg-primary px-8 py-3 text-white font-bold text-[11px] uppercase tracking-widest hover:scale-[1.04] hover:bg-primary-hover transition-all glow-primary flex items-center gap-2">
            <Navigation size={14} />
            Sync Terminal
          </button>
        </div>
      </div>

      {activeTab === "active" && (
        <>
          {/* Active Route Section */}
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-12 lg:col-span-8">
              {activeRoute ? (
                <div className="bg-surface rounded-xl border border-white/5 overflow-hidden">
                  <div className="p-8 border-b border-white/5 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Truck className="text-primary" size={24} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-black text-white">{activeRoute.id}</span>
                          <span className="px-2 py-0.5 bg-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest rounded-md">In Progress</span>
                        </div>
                        <p className="text-[11px] text-text-dim font-bold uppercase tracking-widest">Departure: {activeRoute.departureTime}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-text-dim text-[10px] font-bold uppercase tracking-widest mb-1">Route Progress</p>
                      <p className="text-3xl font-black text-white tabular-nums">{activeRoute.progress}%</p>
                    </div>
                  </div>

                  <div className="p-8 space-y-8">
                    {/* Origin & Destination */}
                    <div className="flex items-center justify-between relative">
                      <div className="absolute left-[34px] right-[34px] top-[14px] h-[1px] bg-white/5" />
                      <div className="relative z-10 flex flex-col items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-surface-elevated border border-white/10 flex items-center justify-center text-primary">
                          <MapPin size={14} />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">{activeRoute.origin}</span>
                      </div>
                      <div className="relative z-10 flex flex-col items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white glow-primary">
                          <MapPin size={14} />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-white">{activeRoute.destination}</span>
                      </div>
                    </div>

                    {/* Stops Timeline */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-text-dim">Route Stops (8)</h3>
                        <span className="text-[10px] font-bold text-primary">Estimated ETA: 12:30 PM</span>
                      </div>
                      <div className="space-y-3">
                        {[
                          { name: "Hub Central B", status: "completed", time: "08:15" },
                          { name: "Industrial Plaza", status: "completed", time: "09:30" },
                          { name: "Sector 7 Depot", status: "active", time: "10:45" },
                          { name: "North Gateway", status: "pending", time: "11:20" },
                        ].map((stop, i) => (
                          <div key={i} className={`flex items-center justify-between p-4 rounded-lg border ${stop.status === 'active' ? 'border-primary/30 bg-primary/5' : 'border-white/5 bg-white/5'} transition-all hover:bg-white/10`}>
                            <div className="flex items-center gap-4">
                              <div className={`w-2 h-2 rounded-full ${stop.status === 'completed' ? 'bg-primary' : stop.status === 'active' ? 'bg-primary animate-pulse' : 'bg-white/20'}`} />
                              <span className={`text-sm font-bold uppercase tracking-tight ${stop.status === 'pending' ? 'text-text-dim' : 'text-white'}`}>{stop.name}</span>
                            </div>
                            <div className="flex items-center gap-6">
                              <span className="text-[10px] font-mono text-text-dim">{stop.time}</span>
                              {stop.status === 'active' && (
                                <button className="px-4 py-1.5 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-full glow-primary">
                                  Confirm Arrival
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full min-h-[400px] flex items-center justify-center border border-dashed border-white/10 rounded-xl bg-white/5">
                  <div className="text-center space-y-3">
                    <p className="text-text-dim font-bold uppercase tracking-widest text-[11px]">No active route assigned</p>
                    <button className="text-primary font-bold uppercase tracking-widest text-[10px] hover:underline">Request New Dispatch</button>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar Metrics */}
            <div className="col-span-12 lg:col-span-4 space-y-6">
              <div className="bg-surface p-6 rounded-xl border border-white/5">
                <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-text-dim mb-6">Today's Performance</h3>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">On-Time Accuracy</span>
                      <span className="text-sm font-black text-white">96%</span>
                    </div>
                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: '96%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Fuel Efficiency</span>
                      <span className="text-sm font-black text-white">92%</span>
                    </div>
                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-info rounded-full" style={{ width: '92%' }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-surface-elevated to-surface p-8 rounded-xl relative overflow-hidden group">
                <div className="relative z-10">
                  <h3 className="text-2xl font-black text-white tracking-tighter mb-2">Next Shift<br />Deployment</h3>
                  <p className="text-[11px] font-bold text-primary uppercase tracking-widest mb-6">Tomorrow • 05:00 AM</p>
                  <button className="px-6 py-2 bg-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-white/20 transition-all">Check Specs</button>
                </div>
                <Truck className="absolute -bottom-4 -right-4 text-white/5 w-32 h-32 group-hover:scale-110 transition-transform duration-500" />
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === "history" && (
        <div className="grid grid-cols-1 gap-4">
          {pastRoutes.map((route, i) => (
            <div key={i} className="bg-surface p-6 rounded-xl border border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:border-white/20 transition-all group cursor-pointer">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-lg bg-surface-elevated flex items-center justify-center text-text-dim group-hover:text-primary transition-colors">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-black text-white uppercase tracking-tight">{route.id}</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 bg-white/10 text-text-muted rounded">Completed</span>
                  </div>
                  <div className="flex items-center gap-4 mt-1">
                    <p className="text-[11px] font-bold text-text-dim uppercase tracking-widest">{route.origin} → {route.destination}</p>
                    <span className="w-1 h-1 bg-white/20 rounded-full" />
                    <p className="text-[11px] font-bold text-text-dim uppercase tracking-widest">{route.departureTime} - {route.arrivalTime}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-12 w-full md:w-auto">
                <div className="text-right">
                  <p className="text-[10px] font-bold text-text-dim uppercase tracking-widest mb-1">Total Distance</p>
                  <p className="text-xl font-black text-white tabular-nums">{route.totalDistance}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-text-dim uppercase tracking-widest mb-1">Stops</p>
                  <p className="text-xl font-black text-white tabular-nums">{route.stops}</p>
                </div>
                <ChevronRight className="text-text-dim group-hover:text-white transition-colors" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
