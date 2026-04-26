export default function TrackingPage() {
  const fleet = [
    { id: "TRK-401", driver: "M. Santos", status: "moving", location: "Interstate 10, CA", speed: "62 mph" },
    { id: "TRK-402", driver: "J. Williams", status: "idle", location: "Fuel Stop FS-12", speed: "0 mph" },
    { id: "TRK-405", driver: "K. Tanaka", status: "moving", location: "Highway 101, OR", speed: "55 mph" },
    { id: "TRK-882", driver: "A. Rodriguez", status: "stopped", location: "Border Checkpoint G", speed: "0 mph" },
    { id: "TRK-290", driver: "L. Chen", status: "moving", location: "Route 66, AZ", speed: "68 mph" },
  ];

  const statusColors: Record<string, string> = { moving: "bg-primary", idle: "bg-warning", stopped: "bg-error" };

  return (
    <div className="space-y-6 -mx-8 -my-10">
      <div className="relative h-[calc(100vh-64px)]">
        <div className="absolute inset-0 bg-[#0a0a0a]">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_40%,rgba(29,185,84,0.15),transparent_50%),radial-gradient(circle_at_70%_60%,rgba(29,185,84,0.1),transparent_50%)]" />
          <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 1600 900">
            <path d="M0 200 Q400 180 800 220 T1600 200" stroke="#333" fill="none" strokeWidth="0.5" />
            <path d="M0 400 Q400 420 800 380 T1600 400" stroke="#333" fill="none" strokeWidth="0.5" />
            <path d="M0 600 Q400 580 800 620 T1600 600" stroke="#333" fill="none" strokeWidth="0.5" />
            <circle cx="300" cy="250" r="5" fill="#1DB954" opacity="0.8" />
            <circle cx="300" cy="250" r="14" fill="none" stroke="#1DB954" strokeWidth="1" opacity="0.3" />
            <circle cx="700" cy="350" r="5" fill="#1DB954" opacity="0.8" />
            <circle cx="1100" cy="300" r="5" fill="#1DB954" opacity="0.8" />
            <circle cx="500" cy="500" r="4" fill="#F59B23" opacity="0.8" />
            <circle cx="900" cy="200" r="4" fill="#E22134" opacity="0.8" />
            <line x1="300" y1="250" x2="700" y2="350" stroke="#1DB954" strokeWidth="2" opacity="0.3" />
            <line x1="700" y1="350" x2="1100" y2="300" stroke="#1DB954" strokeWidth="2" opacity="0.3" />
          </svg>
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
