import MetricCard from "../components/MetricCard";

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
  const loading = false;

  const metrics = {
    deliveries_today: 12,
    on_time_rate: 96,
    total_distance: 342,
    fuel_used: 48,
  };

  const events = [
    { icon: "local_shipping", title: "Departed Hub", detail: "Terminal B • 06:15:00", status: "LOGGED" },
    { icon: "check_circle", title: "Delivery Complete", detail: "Stop 1: 1428 Elm St • 08:30:22", status: "SYNCED" },
    { icon: "minor_crash", title: "Traffic Alert", detail: "Route I-95 • 09:12:15", status: "RE-ROUTED" },
  ];

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
            <div
              className="absolute inset-0 bg-cover bg-center opacity-60"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='500'%3E%3Crect fill='%23121212' width='800' height='500'/%3E%3Cg opacity='0.3'%3E%3Ccircle cx='200' cy='150' r='3' fill='%231DB954'/%3E%3Ccircle cx='350' cy='200' r='3' fill='%231DB954'/%3E%3Ccircle cx='500' cy='180' r='3' fill='%231DB954'/%3E%3Ccircle cx='150' cy='300' r='3' fill='%231DB954'/%3E%3Ccircle cx='600' cy='250' r='3' fill='%231DB954'/%3E%3Ccircle cx='400' cy='350' r='3' fill='%231DB954'/%3E%3Ccircle cx='300' cy='100' r='2' fill='%23F59B23'/%3E%3Ccircle cx='650' cy='150' r='2' fill='%23F59B23'/%3E%3Cline x1='200' y1='150' x2='350' y2='200' stroke='%231DB954' stroke-width='1' opacity='0.4'/%3E%3Cline x1='350' y1='200' x2='500' y2='180' stroke='%231DB954' stroke-width='1' opacity='0.4'/%3E%3Cline x1='500' y1='180' x2='600' y2='250' stroke='%231DB954' stroke-width='1' opacity='0.4'/%3E%3Cline x1='150' y1='300' x2='400' y2='350' stroke='%231DB954' stroke-width='1' opacity='0.3'/%3E%3C/g%3E%3Cg opacity='0.08'%3E%3Cpath d='M0 100 Q200 80 400 120 T800 100' stroke='%23333' fill='none'/%3E%3Cpath d='M0 200 Q200 220 400 180 T800 200' stroke='%23333' fill='none'/%3E%3Cpath d='M0 300 Q200 280 400 320 T800 300' stroke='%23333' fill='none'/%3E%3Cpath d='M0 400 Q200 380 400 420 T800 400' stroke='%23333' fill='none'/%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20" />

            {/* Map Overlay Labels */}
            <div className="absolute top-6 left-6 flex flex-col gap-2">
              <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-[8px] border border-white/10">
                <p className="text-[10px] font-bold uppercase tracking-widest text-text-dim">
                  Current Route
                </p>
                <p className="text-sm font-bold text-white uppercase">
                  DEL-9920 — Priority Express
                </p>
              </div>
              <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-[8px] border border-white/10 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-white">
                  Live GPS
                </p>
              </div>
            </div>

            {/* Stat overlays */}
            <div className="absolute bottom-6 left-6 flex gap-3">
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
            <div className="absolute bottom-6 right-6 flex gap-2">
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
