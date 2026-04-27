"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import StatusChip from "../../components/StatusChip";
import { getShipments, type Shipment, type ShipmentStatus } from "@/lib/api";

type ChipVariant = "delivered" | "in-transit" | "delayed" | "pending" | "active" | "completed" | "at-risk" | "overdue" | "failed" | "rerouted";

const STATUS_FILTERS = ["All", "In Transit", "Delivered", "Delayed", "Pending", "Failed"] as const;

const STATUS_MAP: Record<string, ShipmentStatus | undefined> = {
  "In Transit": "in_transit",
  "Delivered": "delivered",
  "Delayed": "delayed",
  "Pending": "pending",
  "Failed": "failed",
};

// Map backend status → StatusChip-compatible value
const CHIP_STATUS_MAP: Record<ShipmentStatus, ChipVariant> = {
  in_transit: "in-transit",
  delivered: "delivered",
  delayed: "delayed",
  pending: "pending",
  rerouted: "rerouted",
  failed: "failed",
};

function SkeletonRow() {
  return (
    <tr className="h-[56px]">
      {[...Array(6)].map((_, i) => (
        <td key={i} className="px-4">
          <div className="h-3 bg-surface-elevated rounded animate-pulse w-3/4" />
        </td>
      ))}
    </tr>
  );
}

export default function ShipmentsPage() {
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [search, setSearch] = useState("");
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchShipments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const status = STATUS_MAP[activeFilter];
      const res = await getShipments({ limit: 100, status });
      setShipments(res.shipments);
      setTotal(res.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch shipments");
    } finally {
      setLoading(false);
    }
  }, [activeFilter]);

  useEffect(() => {
    fetchShipments();
  }, [fetchShipments]);

  // Client-side search filter
  const displayed = search.trim()
    ? shipments.filter(
        (s) =>
          s.id.toLowerCase().includes(search.toLowerCase()) ||
          s.source.toLowerCase().includes(search.toLowerCase()) ||
          s.destination.toLowerCase().includes(search.toLowerCase())
      )
    : shipments;

  function formatDate(iso: string | null) {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <span className="text-[11px] uppercase font-bold tracking-[0.2em] text-primary mb-2 block">
            Fleet Inventory — {total} total
          </span>
          <h2 className="text-4xl font-extrabold tracking-tighter text-white">
            Shipments
          </h2>
        </div>
        <Link href="/shipments/create" className="rounded-full bg-primary px-8 py-3 text-white font-bold text-sm uppercase tracking-widest hover:scale-[1.04] hover:bg-primary-hover transition-all glow-primary inline-flex items-center justify-center">
          New Shipment
        </Link>
      </div>

      {/* Error banner */}
      {error && (
        <div className="bg-warning/10 border border-warning/30 rounded-[8px] px-4 py-3 flex items-center gap-3">
          <span className="material-symbols-outlined text-warning text-xl">wifi_off</span>
          <p className="text-[11px] text-text-muted">
            Backend disconnected — <code className="font-mono">localhost:8000</code>. {error}
          </p>
          <button
            onClick={fetchShipments}
            className="ml-auto text-[10px] font-bold uppercase text-primary hover:underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Search + Filters */}
      <div className="space-y-4">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">
            search
          </span>
          <input
            id="shipments-search"
            className="w-full h-[48px] bg-surface-elevated border-none rounded-full pl-12 pr-6 text-sm text-white placeholder:text-text-muted focus:ring-1 focus:ring-primary transition-all"
            placeholder="Search by tracking ID, origin, destination..."
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f}
              id={`filter-${f.toLowerCase().replace(" ", "-")}`}
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
              <th className="text-left text-[11px] uppercase font-bold tracking-[0.1em] text-text-secondary px-4 py-4">
                Tracking ID
              </th>
              <th className="text-left text-[11px] uppercase font-bold tracking-[0.1em] text-text-secondary px-4 py-4">
                Origin
              </th>
              <th className="text-left text-[11px] uppercase font-bold tracking-[0.1em] text-text-secondary px-4 py-4">
                Destination
              </th>
              <th className="text-left text-[11px] uppercase font-bold tracking-[0.1em] text-text-secondary px-4 py-4">
                Location
              </th>
              <th className="text-left text-[11px] uppercase font-bold tracking-[0.1em] text-text-secondary px-4 py-4">
                Est. Delivery
              </th>
              <th className="text-left text-[11px] uppercase font-bold tracking-[0.1em] text-text-secondary px-4 py-4">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              [...Array(6)].map((_, i) => <SkeletonRow key={i} />)
            ) : displayed.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-16 text-center">
                  <span className="material-symbols-outlined text-4xl text-text-dim block mb-2">
                    inventory_2
                  </span>
                  <p className="text-text-dim text-sm font-bold uppercase tracking-widest">
                    {error ? "Backend unavailable" : "No shipments found"}
                  </p>
                </td>
              </tr>
            ) : (
              displayed.map((s) => (
                <tr
                  key={s.id}
                  className="h-[56px] hover:bg-surface-elevated transition-colors cursor-pointer group"
                >
                  <td className="px-4">
                    <Link
                      href={`/shipments/${s.id}`}
                      className="text-sm font-bold tabular-nums text-primary hover:underline"
                    >
                      {s.id}
                    </Link>
                  </td>
                  <td className="px-4 text-sm text-white">{s.source}</td>
                  <td className="px-4 text-sm text-white">{s.destination}</td>
                  <td className="px-4 text-sm text-text-muted truncate max-w-[160px]">
                    {s.current_location ?? "—"}
                  </td>
                  <td className="px-4 text-sm text-text-muted tabular-nums">
                    {formatDate(s.estimated_delivery)}
                  </td>
                  <td className="px-4">
                    <StatusChip status={CHIP_STATUS_MAP[s.status]} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
