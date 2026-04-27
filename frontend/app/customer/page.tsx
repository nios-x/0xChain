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

export default function CustomerDashboardPage() {
  const loading = false;

  const metrics = {
    total_orders: 124,
    active_shipments: 3,
    delivered_today: 1,
    support_tickets: 0,
  };

  const events = [
    { icon: "location_on", title: "Out for Delivery", detail: "Order #ORD-8821 • 08:30:00", status: "SYNCED" },
    { icon: "inventory", title: "Package Sorted", detail: "Facility HUB-02 • 04:15:22", status: "SYNCED" },
    { icon: "check_circle", title: "Order Confirmed", detail: "Order #ORD-8821 • Yesterday", status: "PROCESSED" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <span className="text-[11px] uppercase font-bold tracking-[0.2em] text-primary mb-2 block">
            Welcome Back
          </span>
          <h2 className="text-5xl font-extrabold tracking-tighter text-white">
            Customer Dashboard
          </h2>
        </div>
        <button className="rounded-full bg-primary px-8 py-3 text-white font-bold text-sm uppercase tracking-widest hover:scale-[1.04] hover:bg-primary-hover transition-all glow-primary">
          New Order
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Orders"
          value={metrics.total_orders.toString()}
          trend="+12 This Month"
          trendDirection="up"
          icon="shopping_cart"
        />
        <MetricCard
          title="Active Shipments"
          value={metrics.active_shipments.toString()}
          trend="On Time"
          trendDirection="up"
          icon="local_shipping"
        />
        <MetricCard
          title="Delivered Today"
          value={metrics.delivered_today.toString()}
          subtitle="Completed"
          icon="check_box"
        />
        <MetricCard
          title="Support Tickets"
          value={metrics.support_tickets.toString()}
          subtitle="All Resolved"
          icon="support_agent"
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
                  Live Tracking
                </p>
                <p className="text-sm font-bold text-white uppercase">
                  Order #ORD-8821
                </p>
              </div>
              <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-[8px] border border-white/10 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-white">
                  ETA: 2 Hours
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
            </div>
          </div>

          {/* Recent Events Feed */}
          <div className="bg-[#0e0e0e] rounded-[8px] p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-text-dim">
                Tracking Updates
              </h3>
              <button className="text-[10px] font-bold uppercase tracking-widest text-primary hover:underline">
                View All
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
          {/* Announcements */}
          <div className="bg-surface p-6 rounded-[8px] border-t-4 border-primary">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
                Notifications
              </h3>
            </div>
            <div className="space-y-4">
              <div className="bg-surface-container-high p-4 rounded-[8px] space-y-3">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">local_offer</span>
                  <span className="text-xs font-bold text-white uppercase tracking-tight">
                    Loyalty Reward
                  </span>
                </div>
                <p className="text-[11px] text-text-muted leading-relaxed">
                  You've earned 500 loyalty points from your last order. Redeem them now for free shipping!
                </p>
                <div className="flex gap-2">
                  <button className="flex-1 bg-primary hover:brightness-110 text-white text-[10px] font-black py-2 rounded uppercase transition-colors">
                    Redeem
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Active Subscription/Insights Card */}
          <div className="bg-gradient-to-br from-primary-container to-[#004a1c] p-8 rounded-[8px] relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="text-2xl font-extrabold text-white tracking-tighter leading-none mb-2">
                0xCHAIN<br />Prime
              </h3>
              <p className="text-[11px] font-bold text-white/60 uppercase tracking-widest mb-6">
                Active until Dec 2026
              </p>
              <button className="px-6 py-2 bg-white text-black font-black text-[10px] uppercase tracking-widest rounded-full hover:scale-105 transition-transform">
                Manage Plan
              </button>
            </div>
            <span className="material-symbols-outlined absolute -bottom-4 -right-4 text-[120px] text-white/10 group-hover:scale-110 transition-transform duration-500">
              star
            </span>
          </div>

          {/* Saved Addresses */}
          <div className="bg-surface p-6 rounded-[8px]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-text-dim">
                Saved Locations
              </h3>
              <button className="text-[10px] font-bold uppercase tracking-widest text-primary hover:underline">
                Edit
              </button>
            </div>
            <div className="space-y-4">
              {[
                { label: "Home", value: "123 Main St, NY", color: "bg-primary" },
                { label: "Office", value: "456 Market St, NY", color: "bg-info" },
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between text-[10px] font-bold uppercase mb-1">
                    <span className="text-text-muted">{item.label}</span>
                    <span className="text-white truncate max-w-[150px] text-right">{item.value}</span>
                  </div>
                  <div className="w-full h-1 bg-white/5 rounded-full">
                    <div
                      className={`h-full ${item.color} rounded-full`}
                      style={{ width: `100%` }}
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
