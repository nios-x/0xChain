import Link from "next/link";
import StatusChip from "../../../components/StatusChip";

const timeline = [
  { label: "Order Placed", time: "Mar 14, 08:00", completed: true },
  { label: "Picked Up", time: "Mar 14, 14:30", completed: true },
  { label: "In Transit — Shanghai", time: "Mar 15, 02:15", completed: true },
  { label: "Customs Clearance", time: "Mar 16, 09:00", completed: true },
  { label: "At Distribution Center", time: "Mar 17, 11:45", completed: false },
  { label: "Out for Delivery", time: "Pending", completed: false },
  { label: "Delivered", time: "Pending", completed: false },
];

const events = [
  { time: "14:22:01", event: "GPS Position Updated", detail: "Lat: 34.0522, Lng: -118.2437" },
  { time: "13:58:30", event: "Temperature Check Passed", detail: "Current: 2.8°C / Threshold: 4.0°C" },
  { time: "13:12:15", event: "Route Recalculated", detail: "New ETA: +45min due to traffic" },
  { time: "12:00:00", event: "Checkpoint Cleared", detail: "Border Control — Sector G" },
  { time: "09:30:22", event: "Fuel Stop Logged", detail: "Station ID: FS-4402, 120L Diesel" },
];

export default async function ShipmentDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className="space-y-8">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm">
        <Link href="/shipments" className="text-text-secondary hover:text-white transition-colors">Shipments</Link>
        <span className="text-text-dim">/</span>
        <span className="text-white font-bold">{id}</span>
      </div>

      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-4xl font-extrabold tracking-tighter text-white mb-2">{id}</h2>
          <StatusChip status="in-transit" />
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-2.5 border border-text-dim rounded-full text-white text-[11px] font-bold uppercase tracking-widest hover:bg-surface-elevated transition-colors">
            Print Manifest
          </button>
          <button className="px-6 py-2.5 bg-primary rounded-full text-white text-[11px] font-bold uppercase tracking-widest hover:bg-primary-hover hover:scale-[1.04] transition-all">
            Contact Driver
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Left Column */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* Detail Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Origin", value: "Shanghai Port" },
              { label: "Destination", value: "Los Angeles Hub" },
              { label: "Weight", value: "24,500 kg" },
              { label: "Est. Arrival", value: "Mar 17, 18:00" },
            ].map((item) => (
              <div key={item.label} className="bg-surface p-4 rounded-[8px]">
                <p className="text-[11px] uppercase font-bold tracking-[0.1em] text-text-dim mb-1">{item.label}</p>
                <p className="text-white text-base font-bold">{item.value}</p>
              </div>
            ))}
          </div>

          {/* Map Placeholder */}
          <div className="bg-surface rounded-[8px] h-[300px] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-surface to-surface-elevated flex items-center justify-center">
              <div className="text-center">
                <span className="material-symbols-outlined text-6xl text-primary/30 mb-2">map</span>
                <p className="text-text-dim text-sm font-bold uppercase tracking-widest">Live Tracking Map</p>
                <p className="text-text-dim text-xs mt-1">Mapbox integration required</p>
              </div>
            </div>
            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-[8px] border border-white/10 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-white">Live</span>
            </div>
          </div>

          {/* Event Log */}
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-text-dim mb-4">Event Log</h3>
            <div className="bg-surface rounded-[8px] divide-y divide-white/5">
              {events.map((e, i) => (
                <div key={i} className="flex items-center justify-between h-[56px] px-4 hover:bg-surface-elevated transition-colors group">
                  <div className="flex items-center gap-4">
                    <span className="text-[11px] font-mono tabular-nums text-text-muted w-16">{e.time}</span>
                    <div>
                      <p className="text-sm font-bold text-white">{e.event}</p>
                      <p className="text-[10px] text-text-dim">{e.detail}</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-text-dim text-sm group-hover:text-primary transition-colors">chevron_right</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column — Timeline */}
        <div className="col-span-12 lg:col-span-4">
          <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-text-dim mb-4">Delivery Timeline</h3>
          <div className="bg-surface p-6 rounded-[8px]">
            <div className="space-y-0">
              {timeline.map((step, i) => (
                <div key={i} className="flex gap-4">
                  {/* Vertical Line + Node */}
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full border-2 ${
                      step.completed ? "bg-primary border-primary" : "bg-transparent border-text-dim"
                    }`} />
                    {i < timeline.length - 1 && (
                      <div className={`w-0.5 h-12 ${step.completed ? "bg-primary/40" : "bg-border"}`} />
                    )}
                  </div>
                  {/* Content */}
                  <div className="pb-8">
                    <p className={`text-sm font-bold ${step.completed ? "text-white" : "text-text-dim"}`}>
                      {step.label}
                    </p>
                    <p className="text-[10px] text-text-muted tabular-nums mt-0.5">{step.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Info */}
          <div className="bg-surface p-6 rounded-[8px] mt-6 space-y-4">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-text-dim">Shipment Details</h3>
            {[
              { label: "Carrier", value: "TransGlobal Express" },
              { label: "Container", value: "TGEU-4428901" },
              { label: "Temp Zone", value: "2-8°C (Cold Chain)" },
              { label: "Insurance", value: "Full Coverage" },
            ].map((item) => (
              <div key={item.label} className="flex justify-between">
                <span className="text-[11px] uppercase font-bold tracking-[0.1em] text-text-dim">{item.label}</span>
                <span className="text-sm text-white font-bold">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
