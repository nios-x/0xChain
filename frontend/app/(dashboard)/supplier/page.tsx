import MetricCard from "../../components/MetricCard";
import StatusChip from "../../components/StatusChip";

const orders = [
  { id: "ORD-7801", product: "Industrial Bearings — Class A", qty: "2,400 units", date: "Mar 15", status: "in-transit" as const },
  { id: "ORD-7800", product: "Steel Coils — Grade 316L", qty: "18,000 kg", date: "Mar 14", status: "delivered" as const },
  { id: "ORD-7799", product: "Circuit Boards — PCB Rev.4", qty: "12,000 units", date: "Mar 13", status: "delivered" as const },
  { id: "ORD-7798", product: "Hydraulic Pumps — HP-200", qty: "340 units", date: "Mar 12", status: "pending" as const },
  { id: "ORD-7797", product: "Aluminum Sheets — 3mm", qty: "8,500 kg", date: "Mar 11", status: "delivered" as const },
];

const production = [
  { line: "Assembly Line A", progress: 92, status: "Operational" },
  { line: "Assembly Line B", progress: 78, status: "Operational" },
  { line: "Quality Control", progress: 65, status: "Bottleneck" },
  { line: "Packaging Unit", progress: 88, status: "Operational" },
];

const deadlines = [
  { label: "ORD-7803 — Batch Ready", date: "Mar 18", urgent: true },
  { label: "Quality Audit — ISO 9001", date: "Mar 20", urgent: false },
  { label: "Warehouse Restock — Zone C", date: "Mar 22", urgent: false },
  { label: "Quarterly Review", date: "Mar 25", urgent: false },
];

export default function SupplierPage() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <span className="text-[11px] uppercase font-bold tracking-[0.2em] text-primary mb-2 block">Supply Chain Hub</span>
          <h2 className="text-4xl font-extrabold tracking-tighter text-white">Supplier Dashboard</h2>
        </div>
        <button className="rounded-full bg-primary px-8 py-3 text-white font-bold text-sm uppercase tracking-widest hover:scale-[1.04] hover:bg-primary-hover transition-all glow-primary">
          Create Shipment
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Active Orders" value="24" trend="+3 this week" trendDirection="up" icon="shopping_cart" />
        <MetricCard title="Pending Approvals" value="7" subtitle="Awaiting review" icon="pending_actions" variant="warning" />
        <MetricCard title="On-Time Rate" value="94.2%" trend="+2.1%" trendDirection="up" icon="verified" />
        <MetricCard title="Revenue (MTD)" value="$1.42M" trend="+18.5%" trendDirection="up" icon="payments" />
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Left Column */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* Production Progress */}
          <div className="bg-surface p-6 rounded-[8px]">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-text-dim mb-5">Production Lines</h3>
            <div className="space-y-4">
              {production.map((p) => (
                <div key={p.line}>
                  <div className="flex justify-between items-center mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{p.line}</span>
                      <span className={`text-[10px] font-bold uppercase ${p.status === "Bottleneck" ? "text-warning" : "text-primary"}`}>{p.status}</span>
                    </div>
                    <span className="text-sm font-bold text-white tabular-nums">{p.progress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/5 rounded-full">
                    <div
                      className={`h-full rounded-full transition-all ${p.status === "Bottleneck" ? "bg-warning" : "bg-primary"}`}
                      style={{ width: `${p.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Orders Table */}
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-text-dim mb-4">Recent Hand-offs</h3>
            <div className="bg-surface rounded-[8px] overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left text-[11px] uppercase font-bold tracking-[0.1em] text-text-secondary px-4 py-3">Order ID</th>
                    <th className="text-left text-[11px] uppercase font-bold tracking-[0.1em] text-text-secondary px-4 py-3">Product</th>
                    <th className="text-left text-[11px] uppercase font-bold tracking-[0.1em] text-text-secondary px-4 py-3">Quantity</th>
                    <th className="text-left text-[11px] uppercase font-bold tracking-[0.1em] text-text-secondary px-4 py-3">Date</th>
                    <th className="text-left text-[11px] uppercase font-bold tracking-[0.1em] text-text-secondary px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {orders.map((o) => (
                    <tr key={o.id} className="h-[56px] hover:bg-surface-elevated transition-colors">
                      <td className="px-4 text-sm font-bold tabular-nums text-primary">{o.id}</td>
                      <td className="px-4 text-sm text-white">{o.product}</td>
                      <td className="px-4 text-sm text-text-muted tabular-nums">{o.qty}</td>
                      <td className="px-4 text-sm text-text-muted tabular-nums">{o.date}</td>
                      <td className="px-4"><StatusChip status={o.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* Upcoming Deadlines */}
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-text-dim mb-4">Upcoming Deadlines</h3>
            <div className="space-y-2">
              {deadlines.map((d, i) => (
                <div key={i} className={`bg-surface p-4 rounded-[8px] flex justify-between items-center hover:bg-surface-elevated transition-colors ${d.urgent ? "border-l-2 border-error" : ""}`}>
                  <div>
                    <p className="text-sm font-bold text-white">{d.label}</p>
                    <p className="text-[10px] text-text-dim tabular-nums mt-0.5">{d.date}</p>
                  </div>
                  {d.urgent && <span className="text-[10px] font-black text-error uppercase">Urgent</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Production Trend */}
          <div className="bg-surface p-6 rounded-[8px]">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-text-dim mb-4">Output Trend</h3>
            <div className="h-24 flex items-end gap-1">
              {[45, 52, 48, 61, 58, 72, 68, 75, 71, 82, 78, 88].map((v, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className={`w-full rounded-t-sm ${i === 11 ? "bg-primary" : "bg-surface-elevated"} hover:bg-primary/50 transition-all`}
                    style={{ height: `${(v / 88) * 100}%` }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Quick Action */}
          <div className="bg-gradient-to-br from-primary-container to-[#004a1c] p-6 rounded-[8px] relative overflow-hidden group">
            <div className="relative z-10">
              <p className="text-[11px] font-bold text-white/60 uppercase tracking-widest mb-1">Supply Score</p>
              <p className="text-3xl font-extrabold text-white tabular-nums">A+</p>
              <p className="text-[10px] text-white/60 mt-2 mb-4">Top 5% of network suppliers</p>
              <button className="px-5 py-2 bg-white text-black font-black text-[10px] uppercase tracking-widest rounded-full hover:scale-105 transition-transform">
                View Report
              </button>
            </div>
            <span className="material-symbols-outlined absolute -bottom-2 -right-2 text-[80px] text-white/10 group-hover:scale-110 transition-transform duration-500">star</span>
          </div>
        </div>
      </div>
    </div>
  );
}
