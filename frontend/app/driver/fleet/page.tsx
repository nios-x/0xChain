"use client";

import { Gauge, Thermometer, Battery, Droplets, PenTool as Tool, AlertTriangle, CheckCircle2, TrendingUp } from "lucide-react";
import MetricCard from "../../components/MetricCard";

export default function VehicleStatusPage() {
  const vehicle = {
    id: "TRK-401",
    model: "Volta Zero - Electric heavy duty",
    status: "Optimal",
    odometer: "12,482 mi",
    lastService: "Oct 12, 2023",
  };

  const diagnostics = [
    { label: "Battery Level", value: "88%", icon: Battery, color: "text-primary", status: "NORMAL" },
    { label: "Motor Temp", value: "42°C", icon: Thermometer, color: "text-info", status: "STABLE" },
    { label: "Tire Pressure", value: "105 PSI", icon: Gauge, color: "text-primary", status: "OPTIMAL" },
    { label: "Coolant Level", value: "94%", icon: Droplets, color: "text-info", status: "NORMAL" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <span className="text-[11px] uppercase font-bold tracking-[0.2em] text-primary mb-2 block">
            Telemetry Feed: LIVE
          </span>
          <h2 className="text-5xl font-extrabold tracking-tighter text-white">
            Vehicle Assets
          </h2>
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-3 border border-white/10 bg-white/5 rounded-full text-white text-[11px] font-bold uppercase tracking-widest hover:bg-white/10 transition-colors flex items-center gap-2">
            <Tool size={14} />
            Request Service
          </button>
          <button className="rounded-full bg-primary px-8 py-3 text-white font-bold text-[11px] uppercase tracking-widest hover:scale-[1.04] hover:bg-primary-hover transition-all glow-primary">
            Run Diagnostics
          </button>
        </div>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Odometer" value={vehicle.odometer} icon="speed" />
        <MetricCard title="Power Consumption" value="1.2 kWh/mi" trend="-4%" trendDirection="up" icon="bolt" />
        <MetricCard title="Brake Health" value="94%" subtitle="Brake pads: Good" icon="settings_backup_restore" />
        <MetricCard title="Next Service" value="3,200 mi" variant="info" icon="calendar_today" />
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Main Content: Real-time Telemetry */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
          <div className="bg-surface rounded-xl border border-white/5 p-8">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-text-dim">Critical Systems Telemetry</h3>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-[10px] font-mono text-primary uppercase font-bold">Sync: 12.5ms</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {diagnostics.map((item, i) => (
                <div key={i} className="p-6 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-all group">
                   <div className="flex justify-between items-start mb-4">
                      <div className={`p-3 rounded-lg bg-surface-elevated ${item.color}`}>
                        <item.icon size={20} />
                      </div>
                      <span className="text-[10px] font-mono text-text-dim group-hover:text-white transition-colors">{item.status}</span>
                   </div>
                   <p className="text-[11px] font-bold text-text-dim uppercase tracking-widest mb-1">{item.label}</p>
                   <p className="text-3xl font-black text-white tabular-nums">{item.value}</p>
                   <div className="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className={`h-full bg-primary rounded-full`} style={{ width: '85%' }} />
                   </div>
                </div>
              ))}
            </div>
          </div>

          {/* Maintenance Logs */}
          <div className="bg-surface rounded-xl border border-white/5 p-8">
             <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-text-dim mb-6">Service Logs</h3>
             <div className="space-y-4">
                {[
                  { date: "Oct 12, 2023", type: "Full Inspection", status: "PASSED", technician: "Tech-B2" },
                  { date: "Aug 05, 2023", type: "Tire Rotation", status: "COMPLETED", technician: "Tech-A9" },
                  { date: "May 20, 2023", type: "Battery Optimization", status: "OPTIMIZED", technician: "System" },
                ].map((log, i) => (
                  <div key={i} className="flex items-center justify-between p-4 border border-white/5 rounded-lg hover:bg-white/5 transition-colors">
                     <div className="flex items-center gap-4">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <div>
                           <p className="text-sm font-bold text-white uppercase tracking-tight">{log.type}</p>
                           <p className="text-[10px] text-text-dim font-bold uppercase tracking-widest">{log.date} • {log.technician}</p>
                        </div>
                     </div>
                     <span className="text-[10px] font-mono text-primary font-bold px-3 py-1 bg-primary/10 rounded-full">{log.status}</span>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Sidebar: Vehicle Specs */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-surface p-8 rounded-xl border border-white/5">
             <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-white glow-primary">
                   <Tool size={24} />
                </div>
                <div>
                   <h4 className="text-xl font-black text-white">{vehicle.id}</h4>
                   <p className="text-[11px] text-text-dim font-bold uppercase tracking-widest">Active Asset</p>
                </div>
             </div>

             <div className="space-y-4 mb-8">
                <div className="p-4 bg-white/5 rounded-lg border border-white/5">
                   <p className="text-[10px] text-text-dim font-bold uppercase tracking-widest mb-1">Model Specification</p>
                   <p className="text-sm font-bold text-white mb-2">{vehicle.model}</p>
                   <p className="text-[11px] text-text-muted">High-torque electric platform optimized for urban logistics sync.</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                   <div className="p-4 bg-white/5 rounded-lg border border-white/5">
                      <p className="text-[10px] text-text-dim font-bold uppercase tracking-widest mb-1">Max Range</p>
                      <p className="text-lg font-black text-white tabular-nums">220 mi</p>
                   </div>
                   <div className="p-4 bg-white/5 rounded-lg border border-white/5">
                      <p className="text-[10px] text-text-dim font-bold uppercase tracking-widest mb-1">Payload Cap</p>
                      <p className="text-lg font-black text-white tabular-nums">8,500lb</p>
                   </div>
                </div>
             </div>

             <div className="flex flex-col gap-3">
                <button className="w-full py-3 bg-white/5 border border-white/10 rounded-full text-white text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-colors">
                   View Full History
                </button>
                <button className="w-full py-3 bg-error/10 border border-error/20 rounded-full text-error text-[10px] font-black uppercase tracking-widest hover:bg-error/20 transition-colors flex items-center justify-center gap-2">
                   <AlertTriangle size={12} />
                   Report Fault
                </button>
             </div>
          </div>

          <div className="bg-gradient-to-br from-surface to-surface-elevated p-8 rounded-xl border border-white/5 relative overflow-hidden group">
             <div className="relative z-10">
                <h3 className="text-2xl font-black text-white tracking-tighter mb-2">Firmware<br/>v4.2.1-Live</h3>
                <div className="flex items-center gap-2 mb-6">
                   <CheckCircle2 size={14} className="text-primary" />
                   <span className="text-[11px] font-bold text-primary uppercase tracking-widest">Protocol Secured</span>
                </div>
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mb-4">
                   <div className="h-full bg-primary rounded-full animate-pulse" style={{ width: '100%' }} />
                </div>
                <p className="text-[10px] text-text-dim font-bold uppercase tracking-widest text-center">System at Peak Performance</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
