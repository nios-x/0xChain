"use client";

import { useEffect, useState } from "react";
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
  const [loading, setLoading] = useState(true);

  const [metrics, setMetrics] = useState({
    total_orders: 0,
    active_shipments: 0,
    delivered_today: 0,
    support_tickets: 0,
  });

  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch("/api/customer/dashboard");
        const data = await res.json();

        setMetrics(data.metrics);
        setEvents(data.events);
      } catch (err) {
        console.error("Dashboard fetch failed", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="text-white p-10 text-center">
        Loading dashboard...
      </div>
    );
  }

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
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Orders"
          value={`${metrics.total_orders}`}
          trend="+Live Data"
          trendDirection="up"
          icon="shopping_cart"
        />
        <MetricCard
          title="Active Shipments"
          value={`${metrics.active_shipments}`}
          trend="On Going"
          trendDirection="up"
          icon="local_shipping"
        />
        <MetricCard
          title="Delivered Today"
          value={`${metrics.delivered_today}`}
          subtitle="Completed"
          icon="check_box"
        />
        <MetricCard
          title="Support Tickets"
          value={`${metrics.support_tickets}`}
          subtitle="Pending"
          icon="support_agent"
          variant="info"
        />
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-12 gap-8">
        {/* LEFT */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* MAP (unchanged UI) */}
          <div className="bg-surface rounded-[8px] overflow-hidden h-[500px] relative">
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20" />

            {/* Overlay */}
            <div className="absolute top-6 left-6 flex flex-col gap-2">
              <div className="bg-black/60 px-4 py-2 rounded-[8px] border border-white/10">
                <p className="text-[10px] text-text-dim uppercase">
                  Live Tracking
                </p>
                <p className="text-sm font-bold text-white uppercase">
                  Latest Shipment
                </p>
              </div>

              <div className="bg-black/60 px-4 py-2 rounded-[8px] border border-white/10 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <p className="text-[10px] text-white uppercase">
                  ETA: Dynamic
                </p>
              </div>
            </div>
          </div>

          {/* EVENTS */}
          <div className="bg-[#0e0e0e] rounded-[8px] p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-text-dim">
                Tracking Updates
              </h3>
            </div>

            <div className="divide-y divide-white/5">
              {events.map((event, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between h-[56px] px-4 hover:bg-surface-elevated rounded-[8px]"
                >
                  <div className="flex items-center gap-4">
                    <span className="material-symbols-outlined text-text-dim">
                      {event.icon}
                    </span>

                    <div>
                      <p className="text-sm font-bold text-white uppercase">
                        {event.title}
                      </p>
                      <p className="text-[10px] text-text-dim font-bold">
                        {event.detail}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono text-text-dim">
                    {event.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* Notifications */}
          <div className="bg-surface p-6 rounded-[8px] border-t-4 border-primary">
            <h3 className="text-[11px] font-bold uppercase text-primary mb-6">
              Notifications
            </h3>

            <div className="bg-surface-container-high p-4 rounded-[8px]">
              <p className="text-[11px] text-text-muted">
                You have {metrics.support_tickets} active alerts.
              </p>
            </div>
          </div>

          {/* Subscription */}
          <div className="bg-gradient-to-br from-primary-container to-[#004a1c] p-8 rounded-[8px]">
            <h3 className="text-2xl font-extrabold text-white">
              0xCHAIN Prime
            </h3>
            <p className="text-[11px] text-white/60 mb-4">
              Active Subscription
            </p>
          </div>

          {/* Locations */}
          <div className="bg-surface p-6 rounded-[8px]">
            <h3 className="text-[11px] text-text-dim mb-4">
              Saved Locations
            </h3>
            <p className="text-sm text-white">Coming Soon...</p>
          </div>
        </div>
      </div>
    </div>
  );
}