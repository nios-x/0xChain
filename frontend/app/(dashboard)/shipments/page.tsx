"use client";

import { useState } from "react";
import Link from "next/link";
import StatusChip from "../../components/StatusChip";

const shipments = [
  { id: "SHP-14208-XA", origin: "Shanghai Port", destination: "Los Angeles Hub", status: "in-transit" as const, date: "2024-03-15", weight: "24,500 kg" },
  { id: "SHP-14207-BK", origin: "Rotterdam Terminal", destination: "New York DC", status: "delivered" as const, date: "2024-03-14", weight: "18,200 kg" },
  { id: "SHP-14206-CL", origin: "Singapore Hub", destination: "Dubai Logistics", status: "delayed" as const, date: "2024-03-14", weight: "31,000 kg" },
  { id: "SHP-14205-DM", origin: "Tokyo Warehouse", destination: "Sydney Terminal", status: "in-transit" as const, date: "2024-03-13", weight: "12,800 kg" },
  { id: "SHP-14204-EN", origin: "Hamburg Port", destination: "São Paulo DC", status: "delivered" as const, date: "2024-03-13", weight: "22,100 kg" },
  { id: "SHP-14203-FP", origin: "Mumbai Terminal", destination: "London Hub", status: "pending" as const, date: "2024-03-12", weight: "15,600 kg" },
  { id: "SHP-14202-GQ", origin: "Busan Port", destination: "Vancouver DC", status: "in-transit" as const, date: "2024-03-12", weight: "28,400 kg" },
  { id: "SHP-14201-HR", origin: "Antwerp Hub", destination: "Chicago Terminal", status: "delivered" as const, date: "2024-03-11", weight: "19,700 kg" },
];

const filters = ["All", "In Transit", "Delivered", "Delayed", "Pending"];

export default function ShipmentsPage() {
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered = activeFilter === "All"
    ? shipments
    : shipments.filter(s => s.status === activeFilter.toLowerCase().replace(" ", "-"));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <span className="text-[11px] uppercase font-bold tracking-[0.2em] text-primary mb-2 block">
            Fleet Inventory
          </span>
          <h2 className="text-4xl font-extrabold tracking-tighter text-white">
            Shipments
          </h2>
        </div>
        <button className="rounded-full bg-primary px-8 py-3 text-white font-bold text-sm uppercase tracking-widest hover:scale-[1.04] hover:bg-primary-hover transition-all glow-primary">
          New Shipment
        </button>
      </div>

      {/* Search + Filters */}
      <div className="space-y-4">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">
            search
          </span>
          <input
            className="w-full h-[48px] bg-surface-elevated border-none rounded-full pl-12 pr-6 text-sm text-white placeholder:text-text-muted focus:ring-1 focus:ring-primary transition-all"
            placeholder="Search by tracking ID, origin, destination..."
            type="text"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${
                activeFilter === f
                  ? "bg-white text-black"
                  : "bg-surface-elevated text-white hover:bg-surface-high"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-surface rounded-[8px] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left text-[11px] uppercase font-bold tracking-[0.1em] text-text-secondary px-4 py-4">Tracking ID</th>
              <th className="text-left text-[11px] uppercase font-bold tracking-[0.1em] text-text-secondary px-4 py-4">Origin</th>
              <th className="text-left text-[11px] uppercase font-bold tracking-[0.1em] text-text-secondary px-4 py-4">Destination</th>
              <th className="text-left text-[11px] uppercase font-bold tracking-[0.1em] text-text-secondary px-4 py-4">Weight</th>
              <th className="text-left text-[11px] uppercase font-bold tracking-[0.1em] text-text-secondary px-4 py-4">Date</th>
              <th className="text-left text-[11px] uppercase font-bold tracking-[0.1em] text-text-secondary px-4 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filtered.map((s) => (
              <tr key={s.id} className="h-[56px] hover:bg-surface-elevated transition-colors cursor-pointer group">
                <td className="px-4">
                  <Link href={`/shipments/${s.id}`} className="text-sm font-bold tabular-nums text-primary hover:underline">
                    {s.id}
                  </Link>
                </td>
                <td className="px-4 text-sm text-white">{s.origin}</td>
                <td className="px-4 text-sm text-white">{s.destination}</td>
                <td className="px-4 text-sm text-text-muted tabular-nums">{s.weight}</td>
                <td className="px-4 text-sm text-text-muted tabular-nums">{s.date}</td>
                <td className="px-4"><StatusChip status={s.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
