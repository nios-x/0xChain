// app/api/driver/upcoming-stops/route.ts

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const now = new Date();

        const stops = await prisma.shipment.findMany({
            where: {
                status: {
                    in: ["PENDING", "IN_TRANSIT"],
                },
                scheduled_dispatch: {
                    gte: now,
                },
            },
            orderBy: {
                scheduled_dispatch: "asc",
            },
            take: 5,
        });

        return NextResponse.json(stops);
    } catch (err) {
        return NextResponse.json({ error: "Failed" }, { status: 500 });
    }
}