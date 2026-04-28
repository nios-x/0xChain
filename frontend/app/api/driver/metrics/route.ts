// app/api/driver/metrics/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const deliveries_today = await prisma.shipment.count({
            where: {
                status: "DELIVERED",
                updated_at: { gte: today },
            },
        });

        const total = await prisma.shipment.count();
        const delivered = await prisma.shipment.count({
            where: { status: "DELIVERED" },
        });

        const on_time_rate = total
            ? Math.round((delivered / total) * 100)
            : 0;

        const logs = await prisma.locationLog.findMany();
        let total_distance = logs.length * 2; // mock logic (replace later)

        return NextResponse.json({
            deliveries_today,
            on_time_rate,
            total_distance,
            fuel_used: Math.round(total_distance * 0.14),
        });
    } catch (err) {
        return NextResponse.json({ error: "Failed" }, { status: 500 });
    }
}