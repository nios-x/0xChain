import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const [
            totalOrders,
            activeShipments,
            deliveredToday,
            supportTickets,
            latestShipments,
        ] = await Promise.all([
            prisma.shipment.count(),

            prisma.shipment.count({
                where: {
                    status: "IN_TRANSIT",
                },
            }),

            prisma.shipment.count({
                where: {
                    status: "DELIVERED",
                    actual_delivery: {
                        gte: new Date(new Date().setHours(0, 0, 0, 0)),
                    },
                },
            }),

            prisma.alert.count({
                where: { is_resolved: false },
            }),

            prisma.shipment.findMany({
                take: 5,
                orderBy: { updated_at: "desc" },
                include: {
                    events: {
                        take: 1,
                        orderBy: { timestamp: "desc" },
                    },
                },
            }),
        ]);

        const events = latestShipments.map((s) => {
            const event = s.events[0];

            return {
                icon: "local_shipping",
                title: s.status.replace("_", " "),
                detail: `${s.id.slice(0, 8)} • ${event ? new Date(event.timestamp).toLocaleTimeString() : "No updates"
                    }`,
                status: s.status,
            };
        });

        return NextResponse.json({
            metrics: {
                total_orders: totalOrders,
                active_shipments: activeShipments,
                delivered_today: deliveredToday,
                support_tickets: supportTickets,
            },
            events,
        });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Dashboard error" }, { status: 500 });
    }
}