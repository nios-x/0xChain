import StatusChip from "../../components/StatusChip";

const upcoming = [
  { id: "DEL-9921", address: "1428 Elm Street, Chicago, IL", time: "14:30", priority: "Standard" },
  { id: "DEL-9922", address: "700 Commerce Drive, Dallas, TX", time: "16:15", priority: "Express" },
  { id: "DEL-9923", address: "250 Harbor Blvd, LA, CA", time: "18:00", priority: "Standard" },
];

const stats = [
  { label: "Deliveries Today", value: "12", icon: "local_shipping" },
  { label: "On-Time Rate", value: "96%", icon: "timer" },
  { label: "Total Distance", value: "342 mi", icon: "straighten" },
  { label: "Fuel Used", value: "48 gal", icon: "local_gas_station" },
];

export default function DriverPage() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <span className="text-[11px] uppercase font-bold tracking-[0.2em] text-primary mb-2 block">Active Session</span>
          <h2 className="text-4xl font-extrabold tracking-tighter text-white">Driver Dashboard</h2>
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-2.5 border border-text-dim rounded-full text-white text-[11px] font-bold uppercase tracking-widest hover:bg-surface-elevated transition-colors">
            End Shift
          </button>
          <button className="px-6 py-2.5 bg-primary rounded-full text-white text-[11px] font-bold uppercase tracking-widest hover:bg-primary-hover hover:scale-[1.04] transition-all glow-primary">
            Start Navigation
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Left Column */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* Driver Profile + Current Delivery */}
          <div className="bg-surface p-6 rounded-[8px] flex items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-surface-elevated flex items-center justify-center ring-2 ring-primary/30">
              <span className="material-symbols-outlined text-3xl text-primary">person</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-xl font-extrabold text-white">Marcus Rodriguez</h3>
                <StatusChip status="active" label="On Route" />
              </div>
              <p className="text-xs text-text-muted">CDL-A #4428 • Unit TRK-401 • Shift: 06:00-18:00</p>
            </div>
          </div>

          {/* Current Delivery */}
          <div className="bg-surface p-6 rounded-[8px] border-l-2 border-primary">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary mb-1">Current Delivery</p>
                <h4 className="text-lg font-extrabold text-white">DEL-9920 — Priority Express</h4>
                <p className="text-xs text-text-muted mt-1">1200 Michigan Ave, Chicago, IL 60601</p>
              </div>
              <button className="px-4 py-2 bg-primary rounded-full text-white text-[10px] font-bold uppercase tracking-widest hover:bg-primary-hover transition-all">
                Mark Delivered
              </button>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-bold uppercase">
                <span className="text-text-dim">Progress</span>
                <span className="text-white">78%</span>
              </div>
              <div className="w-full h-2 bg-white/5 rounded-full">
                <div className="h-full bg-primary rounded-full transition-all" style={{ width: "78%" }} />
              </div>
              <div className="flex justify-between text-[10px] text-text-muted">
                <span>ETA: 12 min</span>
                <span>3.2 mi remaining</span>
              </div>
            </div>
          </div>

          {/* Route Map */}
          <div className="bg-surface rounded-[8px] h-[300px] relative overflow-hidden">
            <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 800 300">
              <path d="M100 250 Q200 100 400 150 T700 80" stroke="#1DB954" fill="none" strokeWidth="3" strokeDasharray="8 4" />
              <circle cx="100" cy="250" r="6" fill="#1DB954" />
              <circle cx="700" cy="80" r="6" fill="#E22134" />
              <circle cx="400" cy="150" r="4" fill="#F59B23" />
            </svg>
            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-[8px] border border-white/10 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-white">Live Route</span>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* Performance Stats */}
          <div className="grid grid-cols-2 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="bg-surface p-4 rounded-[8px] text-center">
                <span className="material-symbols-outlined text-text-dim text-xl mb-2 block">{s.icon}</span>
                <p className="text-xl font-extrabold text-white tabular-nums">{s.value}</p>
                <p className="text-[10px] text-text-dim font-bold uppercase tracking-wider mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Upcoming */}
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-text-dim mb-4">Upcoming Deliveries</h3>
            <div className="space-y-2">
              {upcoming.map((d) => (
                <div key={d.id} className="bg-surface p-4 rounded-[8px] hover:bg-surface-elevated transition-colors cursor-pointer">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-sm font-bold text-white">{d.id}</span>
                    <span className={`text-[10px] font-bold uppercase ${d.priority === "Express" ? "text-warning" : "text-text-muted"}`}>{d.priority}</span>
                  </div>
                  <p className="text-[11px] text-text-muted truncate">{d.address}</p>
                  <p className="text-[10px] text-text-dim mt-1 tabular-nums">ETA: {d.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
