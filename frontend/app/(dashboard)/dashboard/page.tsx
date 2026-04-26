import MetricCard from "../../components/MetricCard";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <span className="text-[11px] uppercase font-bold tracking-[0.2em] text-primary mb-2 block">
            System Status: Optimal
          </span>
          <h2 className="text-5xl font-extrabold tracking-tighter text-white">
            Operations Overview
          </h2>
        </div>
        <button className="rounded-full bg-primary px-8 py-3 text-white font-bold text-sm uppercase tracking-widest hover:scale-[1.04] hover:bg-primary-hover transition-all glow-primary">
          Generate Report
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Shipments"
          value="14,208"
          trend="+12.5%"
          trendDirection="up"
          icon="local_shipping"
        />
        <MetricCard
          title="Delayed Units"
          value="42"
          trend="Requires Action"
          trendDirection="down"
          icon="warning"
          variant="error"
        />
        <MetricCard
          title="In Transit"
          value="2,841"
          subtitle="Active Flow"
          icon="route"
        />
        <MetricCard
          title="System Alerts"
          value="08"
          subtitle="Maintenance Pending"
          icon="notification_important"
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
                  Region Focus
                </p>
                <p className="text-sm font-bold text-white uppercase">
                  North American Hub
                </p>
              </div>
              <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-[8px] border border-white/10 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-white">
                  Live Telemetry
                </p>
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
                Expand Fleet
              </button>
            </div>
          </div>

          {/* Recent Events Feed */}
          <div className="bg-[#0e0e0e] rounded-[8px]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-text-dim">
                Global Logistics Stream
              </h3>
              <button className="text-[10px] font-bold uppercase tracking-widest text-primary hover:underline">
                View All Events
              </button>
            </div>
            <div className="divide-y divide-white/5">
              {[
                { icon: "rocket_launch", title: "Vessel TX-902 Departed", detail: "Port of Singapore • 14:22:01", status: "STATUS_SYNCED" },
                { icon: "inventory", title: "Cargo Inspection Clear", detail: "Terminal 4 • Bulk Storage A • 13:58:30", status: "STATUS_SYNCED" },
                { icon: "minor_crash", title: "Route Re-calculation", detail: "Fleet Truck ID-405 • Traffic Delay • 13:12:15", status: "STATUS_AUTO_RESCHEDULE" },
              ].map((event, i) => (
                <div key={i} className="flex items-center justify-between h-[56px] px-4 hover:bg-surface-elevated transition-colors rounded-[8px] group">
                  <div className="flex items-center gap-4">
                    <span className="material-symbols-outlined text-text-dim group-hover:text-primary transition-colors">
                      {event.icon}
                    </span>
                    <div>
                      <p className="text-sm font-bold text-white uppercase tracking-tight">
                        {event.title}
                      </p>
                      <p className="text-[10px] text-text-dim font-bold">
                        {event.detail}
                      </p>
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
          {/* Critical Alerts */}
          <div className="bg-surface p-6 rounded-[8px] border-t-4 border-error">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-error">
                Critical Warnings
              </h3>
              <span className="bg-error/10 text-error text-[10px] px-2 py-0.5 rounded font-black">
                HIGH PRIORITY
              </span>
            </div>
            <div className="space-y-4">
              <div className="bg-surface-container-high p-4 rounded-[8px] space-y-3">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-error">report</span>
                  <span className="text-xs font-bold text-white uppercase tracking-tight">
                    Temperature Violation
                  </span>
                </div>
                <p className="text-[11px] text-text-muted leading-relaxed">
                  Pharma-Chain Container #9283 exceeded 4.0°C. Immediate stabilization required.
                </p>
                <div className="flex gap-2">
                  <button className="flex-1 bg-error hover:brightness-110 text-white text-[10px] font-black py-2 rounded uppercase transition-colors">
                    Acknowledge
                  </button>
                  <button className="px-3 bg-white/5 hover:bg-white/10 text-text-muted rounded transition-colors">
                    <span className="material-symbols-outlined text-sm">more_horiz</span>
                  </button>
                </div>
              </div>
              <div className="bg-surface-container-high p-4 rounded-[8px] space-y-3">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-warning">priority_high</span>
                  <span className="text-xs font-bold text-white uppercase tracking-tight">
                    Geofence Breach
                  </span>
                </div>
                <p className="text-[11px] text-text-muted leading-relaxed">
                  Unit TRK-882 departed designated transit corridor. Contacting driver.
                </p>
                <button className="w-full bg-warning/10 text-warning border border-warning/20 hover:bg-warning/20 text-[10px] font-black py-2 rounded uppercase transition-colors">
                  Open Comms
                </button>
              </div>
            </div>
          </div>

          {/* AI Insights Card */}
          <div className="bg-gradient-to-br from-primary-container to-[#004a1c] p-8 rounded-[8px] relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="text-2xl font-extrabold text-white tracking-tighter leading-none mb-2">
                Automated<br />Insights
              </h3>
              <p className="text-[11px] font-bold text-white/60 uppercase tracking-widest mb-6">
                AI-Driven Efficiency Score: 98.4
              </p>
              <button className="px-6 py-2 bg-white text-black font-black text-[10px] uppercase tracking-widest rounded-full hover:scale-105 transition-transform">
                Optimize Routes
              </button>
            </div>
            <span className="material-symbols-outlined absolute -bottom-4 -right-4 text-[120px] text-white/10 group-hover:scale-110 transition-transform duration-500">
              query_stats
            </span>
          </div>

          {/* Inventory Thresholds */}
          <div className="bg-surface p-6 rounded-[8px]">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-text-dim mb-4">
              Inventory Thresholds
            </h3>
            <div className="space-y-4">
              {[
                { label: "Jet Fuel (Hub-A)", value: 82, color: "bg-primary" },
                { label: "Storage Capacity", value: 64, color: "bg-info" },
                { label: "Spare Parts", value: 91, color: "bg-primary" },
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between text-[10px] font-bold uppercase mb-1">
                    <span className="text-text-muted">{item.label}</span>
                    <span className="text-white">{item.value}%</span>
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
