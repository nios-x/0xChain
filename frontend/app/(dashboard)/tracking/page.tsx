"use client"
import dynamic from "next/dynamic";

const TrackingMapComponent = dynamic(() => import("./TrackingMapComponent"), { ssr: false });

export default function TrackingPage() {
  const fleet = [
    { id: "TRK-401", driver: "M. Santos", status: "moving", location: "Interstate 10, CA", speed: "62 mph", lat: 34.0522, lng: -118.2437 },
    { id: "TRK-402", driver: "J. Williams", status: "idle", location: "Fuel Stop FS-12", speed: "0 mph", lat: 36.1699, lng: -115.1398 },
    { id: "TRK-405", driver: "K. Tanaka", status: "moving", location: "Highway 101, OR", speed: "55 mph", lat: 43.8041, lng: -120.5542 },
    { id: "TRK-882", driver: "A. Rodriguez", status: "stopped", location: "Border Checkpoint G", speed: "0 mph", lat: 31.7619, lng: -106.4850 },
    { id: "TRK-290", driver: "L. Chen", status: "moving", location: "Route 66, AZ", speed: "68 mph", lat: 35.1983, lng: -111.6513 },
  ];

  const statusColors: Record<string, string> = { moving: "bg-primary", idle: "bg-warning", stopped: "bg-error" };

  return (
    <div className="space-y-6 -mx-8 -my-10">
      <div className="relative h-[calc(100vh-64px)]">
        <div className="absolute inset-0 bg-[#0a0a0a]">
          <TrackingMapComponent fleet={fleet} />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20 pointer-events-none z-10" />
        </div>

        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 w-[500px] max-w-[calc(100%-2rem)]">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">search</span>
            <input className="w-full h-[48px] bg-surface/90 backdrop-blur-xl border border-white/10 rounded-full pl-12 pr-6 text-sm text-white placeholder:text-text-muted" placeholder="Search fleet, driver, or location..." type="text" />
          </div>
        </div>

        <div className="absolute top-6 right-6 w-[320px] bg-surface/95 backdrop-blur-xl rounded-[8px] border border-white/10 z-20 max-h-[calc(100vh-120px)] overflow-hidden flex flex-col">
          <div className="p-4 border-b border-white/5">
            <div className="flex justify-between items-center">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-text-dim">Active Fleet</h3>
              <span className="text-primary text-[11px] font-bold tabular-nums">{fleet.length} units</span>
            </div>
          </div>
          <div className="overflow-y-auto flex-1">
            {fleet.map((v) => (
              <div key={v.id} className="flex items-center gap-3 px-4 h-[64px] hover:bg-surface-elevated transition-colors cursor-pointer border-b border-white/5 last:border-0">
                <div className={`w-2.5 h-2.5 rounded-full ${statusColors[v.status]} ${v.status === "moving" ? "animate-pulse" : ""}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between">
                    <span className="text-sm font-bold text-white">{v.id}</span>
                    <span className="text-[10px] font-bold tabular-nums text-text-muted">{v.speed}</span>
                  </div>
                  <p className="text-[10px] text-text-dim truncate">{v.driver} • {v.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-6 left-6 flex flex-col gap-2 z-20">
          <button className="w-10 h-10 rounded-[8px] bg-surface/80 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
            <span className="material-symbols-outlined text-white text-sm">add</span>
          </button>
          <button className="w-10 h-10 rounded-[8px] bg-surface/80 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
            <span className="material-symbols-outlined text-white text-sm">remove</span>
          </button>
        </div>

        <div className="absolute bottom-6 right-6 bg-surface/80 backdrop-blur-md rounded-[8px] border border-white/10 px-4 py-3 z-20 flex items-center gap-6">
          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-primary" /><span className="text-[10px] font-bold text-text-muted uppercase">Moving</span></div>
          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-warning" /><span className="text-[10px] font-bold text-text-muted uppercase">Idle</span></div>
          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-error" /><span className="text-[10px] font-bold text-text-muted uppercase">Stopped</span></div>
        </div>
      </div>
    </div>
  );
}
