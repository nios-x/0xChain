import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ShipmentStatus } from "@prisma/client";

export async function GET() {
  try {
    const [
      total_shipments,
      in_transit,
      delivered,
      delayed,
      failed,
      recent_events,
      active_alerts,
      delivered_shipments
    ] = await Promise.all([
      prisma.shipment.count(),
      prisma.shipment.count({ where: { status: ShipmentStatus.IN_TRANSIT } }),
      prisma.shipment.count({ where: { status: ShipmentStatus.DELIVERED } }),
      prisma.shipment.count({ where: { status: ShipmentStatus.DELAYED } }),
      prisma.shipment.count({ where: { status: ShipmentStatus.FAILED } }),
      prisma.event.findMany({
        take: 10,
        orderBy: { timestamp: "desc" },
      }),
      prisma.alert.findMany({
        where: { is_resolved: false },
        take: 5,
        orderBy: { created_at: "desc" },
      }),
      prisma.shipment.findMany({
        where: {
          status: ShipmentStatus.DELIVERED,
          actual_delivery: { not: null },
          estimated_delivery: { not: null },
        },
      })
    ]);

    let avg_delay = 0;
    if (delivered_shipments.length > 0) {
      const total_delay_ms = delivered_shipments.reduce((acc, s) => {
        if (s.actual_delivery && s.estimated_delivery && s.actual_delivery > s.estimated_delivery) {
          return acc + (s.actual_delivery.getTime() - s.estimated_delivery.getTime());
        }
        return acc;
      }, 0);
      avg_delay = (total_delay_ms / delivered_shipments.length) / (1000 * 60 * 60); // in hours
    }

    const metrics = {
      total_shipments,
      in_transit,
      delivered,
      delayed,
      failed,
      average_delay_hours: Math.max(0, avg_delay),
      disruption_probability_avg: 0.15, // Mocked for now
      alerts_active: active_alerts.length,
    };

    return NextResponse.json({
      metrics,
      recent_events,
      critical_alerts: active_alerts,
    });
  } catch (error) {
    console.error("Error fetching dashboard metrics:", error);
    return NextResponse.json(
      { error: "Failed to load dashboard metrics" },
      { status: 500 }
    );
  }
}
