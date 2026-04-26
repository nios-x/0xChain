import MetricCard from "../../components/MetricCard";

const waypoints = [
  { name: "Departure — Shanghai Port", eta: "08:00", dist: "0 km", status: "Passed" },
  { name: "Waypoint A — Pacific Crossing", eta: "14:30", dist: "4,200 km", status: "Passed" },
  { name: "Waypoint B — Honolulu Refuel", eta: "22:15", dist: "6,800 km", status: "Active" },
  { name: "Waypoint C — LA Approach", eta: "06:00", dist: "10,100 km", status: "Pending" },
  { name: "Arrival — Los Angeles Hub", eta: "09:30", dist: "10,800 km", status: "Pending" },
];

export default function RoutesPage() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <span className="text-[11px] uppercase font-bold tracking-[0.2em] text-primary mb-2 block">AI-Powered</span>
          <h2 className="text-4xl font-extrabold tracking-tighter text-white">Route Optimization</h2>
        </div>
        <button className="rounded-full bg-primary px-8 py-3 text-white font-bold text-sm uppercase tracking-widest hover:scale-[1.04] hover:bg-primary-hover transition-all glow-primary">
          Run Optimization
        </button>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Left — Route Parameters */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-surface p-6 rounded-[8px] space-y-5">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-text-dim">Route Parameters</h3>
            <div className="space-y-4">
              {[
                { label: "Origin", placeholder: "Shanghai Port" },
                { label: "Destination", placeholder: "Los Angeles Hub" },
                { label: "Vehicle Type", placeholder: "Container Ship — Panamax" },
                { label: "Priority", placeholder: "Cost Optimized" },
              ].map((f) => (
                <div key={f.label} className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-text-dim">{f.label}</label>
                  <input className="w-full h-[40px] bg-surface-elevated border-none rounded-[4px] px-4 text-white text-sm placeholder:text-text-muted" defaultValue={f.placeholder} />
                </div>
              ))}
            </div>
            <button className="w-full h-[48px] bg-primary rounded-full text-white font-bold text-sm uppercase tracking-widest hover:bg-primary-hover hover:scale-[1.02] transition-all">
              Calculate Route
            </button>
          </div>

          {/* Risk Score */}
          <div className="bg-surface p-6 rounded-[8px] text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-text-dim mb-2">Risk Score</p>
            <p className="text-6xl font-extrabold tabular-nums text-primary">12</p>
            <p className="text-xs text-text-muted mt-1 font-bold uppercase">Low Risk — Safe Passage</p>
          </div>
        </div>

        {/* Right — Map + Metrics */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* Route Map */}
          <div className="bg-surface rounded-[8px] h-[400px] relative overflow-hidden">
            <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 800 400">
              <path d="M100 200 Q250 100 400 180 T700 150" stroke="#1DB954" fill="none" strokeWidth="3" strokeDasharray="8 4" />
              <path d="M100 200 Q300 300 500 250 T700 150" stroke="#333" fill="none" strokeWidth="1" strokeDasharray="4 4" />
              <circle cx="100" cy="200" r="8" fill="#1DB954" /><text x="100" y="230" fill="#888" fontSize="10" textAnchor="middle">Shanghai</text>
              <circle cx="400" cy="180" r="5" fill="#F59B23" /><text x="400" y="210" fill="#888" fontSize="10" textAnchor="middle">Honolulu</text>
              <circle cx="700" cy="150" r="8" fill="#1DB954" /><text x="700" y="180" fill="#888" fontSize="10" textAnchor="middle">Los Angeles</text>
            </svg>
            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-[8px] border border-white/10 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-white">Optimized Route</span>
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard title="Distance" value="10,800" subtitle="km total" icon="straighten" />
            <MetricCard title="Est. Time" value="96h" subtitle="4 days" icon="schedule" />
            <MetricCard title="Fuel Cost" value="$42.5K" trend="-8.2%" trendDirection="up" icon="local_gas_station" />
            <MetricCard title="CO₂ Saved" value="1.2T" trend="+15%" trendDirection="up" icon="eco" />
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
    </div>
  );
}
