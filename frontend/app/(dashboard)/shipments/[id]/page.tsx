"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import StatusChip from "../../../components/StatusChip";

const MapComponent = dynamic(() => import("./MapComponent"), { ssr: false });
import { getShipment, getShipmentEvents, type Shipment, type ShipmentEvent, type ShipmentStatus } from "@/lib/api";

type ChipVariant = "delivered" | "in-transit" | "delayed" | "pending" | "active" | "completed" | "at-risk" | "overdue" | "failed" | "rerouted";

const CHIP_STATUS_MAP: Record<ShipmentStatus, ChipVariant> = {
  in_transit: "in-transit",
  delivered: "delivered",
  delayed: "delayed",
  pending: "pending",
  rerouted: "rerouted",
  failed: "failed",
};

const EVENT_ICON_MAP: Record<string, string> = {
  location_update: "location_on",
  weather_update: "cloud",
  traffic_update: "traffic",
  delay_detected: "schedule",
  anomaly_detected: "warning",
  reroute_triggered: "alt_route",
  prediction: "query_stats",
};

function formatTime(ts: string) {
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

function formatDate(iso: string | null) {
  if (!iso) return "Pending";
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function SkeletonBlock({ className = "" }: { className?: string }) {
  return <div className={`bg-surface-elevated rounded animate-pulse ${className}`} />;
}

export default function ShipmentDetailsPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id ?? "";

  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [events, setEvents] = useState<ShipmentEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [s, ev] = await Promise.all([
          getShipment(id),
          getShipmentEvents(id, 10).catch(() => [] as ShipmentEvent[]),
        ]);
        if (!cancelled) {
          setShipment(s);
          setEvents(ev);
        }
      } catch (err) {
        if (!cancelled)
          setError(err instanceof Error ? err.message : "Shipment not found");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [id]);

  const chipStatus: ChipVariant = shipment
    ? (CHIP_STATUS_MAP[shipment.status] as ChipVariant)
    : "pending";

  // Build a pseudo-timeline from the shipment status
  const TIMELINE_STEPS = [
    { label: "Order Placed", done: true },
    { label: "Picked Up", done: shipment?.status !== "pending" },
    { label: "In Transit", done: ["in_transit","delayed","rerouted","delivered"].includes(shipment?.status ?? "") },
    { label: "Customs Clearance", done: ["delivered"].includes(shipment?.status ?? "") },
    { label: "Out for Delivery", done: shipment?.status === "delivered" },
    { label: "Delivered", done: shipment?.status === "delivered" },
  ];

  return (
    <div className="space-y-8">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm">
        <Link href="/shipments" className="text-text-secondary hover:text-white transition-colors">
          Shipments
        </Link>
        <span className="text-text-dim">/</span>
        <span className="text-white font-bold">{id}</span>
      </div>

      {/* Header */}
      {loading ? (
        <div className="space-y-3">
          <SkeletonBlock className="h-10 w-64" />
          <SkeletonBlock className="h-6 w-32" />
        </div>
      ) : error ? (
        <div className="bg-error/10 border border-error/30 rounded-[8px] px-6 py-8 text-center">
          <span className="material-symbols-outlined text-4xl text-error mb-2 block">
            error_outline
          </span>
          <p className="text-white font-bold text-lg mb-1">Shipment Not Found</p>
          <p className="text-text-muted text-sm">{error}</p>
          <Link href="/shipments" className="mt-4 inline-block text-primary text-sm font-bold hover:underline">
            ← Back to Shipments
          </Link>
        </div>
      ) : (
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-4xl font-extrabold tracking-tighter text-white mb-2">{id}</h2>
            <StatusChip status={chipStatus} />
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
      )}

      {!error && (
        <div className="grid grid-cols-12 gap-8">
          {/* Left Column */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            {/* Detail Cards */}
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => <SkeletonBlock key={i} className="h-[80px]" />)}
              </div>
            ) : shipment && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Origin", value: shipment.source },
                  { label: "Destination", value: shipment.destination },
                  { label: "Est. Arrival", value: formatDate(shipment.estimated_delivery) },
                  { label: "Actual Delivery", value: formatDate(shipment.actual_delivery) },
                ].map((item) => (
                  <div key={item.label} className="bg-surface p-4 rounded-[8px]">
                    <p className="text-[11px] uppercase font-bold tracking-[0.1em] text-text-dim mb-1">
                      {item.label}
                    </p>
                    <p className="text-white text-base font-bold">{item.value}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Current Location */}
            {shipment?.current_location && (
              <div className="bg-surface p-4 rounded-[8px] flex items-center gap-4">
                <span className="material-symbols-outlined text-primary text-xl">location_on</span>
                <div>
                  <p className="text-[11px] uppercase font-bold tracking-[0.1em] text-text-dim">
                    Current Location
                  </p>
                  <p className="text-white font-bold">{shipment.current_location}</p>
                  {shipment.current_lat && shipment.current_lon && (
                    <p className="text-[10px] text-text-muted font-mono">
                      {shipment.current_lat.toFixed(4)}, {shipment.current_lon.toFixed(4)}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Live Map */}
            <div className="bg-surface rounded-[8px] h-[300px] relative overflow-hidden">
              <MapComponent 
                source_lat={shipment?.source_lat}
                source_lon={shipment?.source_lon}
                destination_lat={shipment?.destination_lat}
                destination_lon={shipment?.destination_lon}
                current_lat={shipment?.current_lat}
                current_lon={shipment?.current_lon}
              />
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-[8px] border border-white/10 flex items-center gap-2 z-10 pointer-events-none">
                <div className={`w-2 h-2 rounded-full ${shipment?.status === "in_transit" ? "bg-primary animate-pulse" : "bg-text-dim"}`} />
                <span className="text-[10px] font-bold uppercase tracking-widest text-white">
                  {shipment?.status === "in_transit" ? "Live Tracking" : "Static Route"}
                </span>
              </div>
            </div>

            {/* Event Log */}
            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-text-dim mb-4">
                Event Log
              </h3>
              <div className="bg-surface rounded-[8px] divide-y divide-white/5">
                {loading ? (
                  [...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between h-[56px] px-4">
                      <SkeletonBlock className="h-4 w-48" />
                      <SkeletonBlock className="h-3 w-20" />
                    </div>
                  ))
                ) : events.length > 0 ? (
                  events.map((e, i) => (
                    <div key={i} className="flex items-center justify-between h-[56px] px-4 hover:bg-surface-elevated transition-colors group">
                      <div className="flex items-center gap-4">
                        <span className="text-[11px] font-mono tabular-nums text-text-muted w-16">
                          {formatTime(e.timestamp)}
                        </span>
                        <div>
                          <p className="text-sm font-bold text-white">
                            {e.event_type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                          </p>
                          <p className="text-[10px] text-text-dim">
                            Severity: {e.severity.toUpperCase()}
                          </p>
                        </div>
                      </div>
                      <span className="material-symbols-outlined text-text-dim text-sm group-hover:text-primary transition-colors">
                        {EVENT_ICON_MAP[e.event_type] ?? "radio_button_unchecked"}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-text-dim text-sm">
                    No events recorded yet.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column — Timeline */}
          <div className="col-span-12 lg:col-span-4">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-text-dim mb-4">
              Delivery Timeline
            </h3>
            <div className="bg-surface p-6 rounded-[8px]">
              <div className="space-y-0">
                {TIMELINE_STEPS.map((step, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full border-2 ${step.done ? "bg-primary border-primary" : "bg-transparent border-text-dim"}`} />
                      {i < TIMELINE_STEPS.length - 1 && (
                        <div className={`w-0.5 h-12 ${step.done ? "bg-primary/40" : "bg-border"}`} />
                      )}
                    </div>
                    <div className="pb-8">
                      <p className={`text-sm font-bold ${step.done ? "text-white" : "text-text-dim"}`}>
                        {step.label}
                      </p>
                      <p className="text-[10px] text-text-muted tabular-nums mt-0.5">
                        {step.done ? "Completed" : "Pending"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Info */}
            {shipment && (
              <div className="bg-surface p-6 rounded-[8px] mt-6 space-y-4">
                <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-text-dim">
                  Shipment Details
                </h3>
                {[
                  { label: "Shipment ID", value: shipment.id },
                  { label: "Status", value: shipment.status.replace(/_/g, " ").toUpperCase() },
                  { label: "Created", value: formatDate(shipment.created_at) },
                  { label: "Last Updated", value: formatDate(shipment.updated_at) },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between">
                    <span className="text-[11px] uppercase font-bold tracking-[0.1em] text-text-dim">
                      {item.label}
                    </span>
                    <span className="text-sm text-white font-bold truncate ml-4">{item.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
