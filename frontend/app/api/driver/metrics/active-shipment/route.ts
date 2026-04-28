// app/api/driver/active-shipment/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const shipment = await prisma.shipment.findFirst({
            where: {
                status: "IN_TRANSIT",
            },
            include: {
                route: true,
            },
        });

        return NextResponse.json(shipment);
    } catch {
        return NextResponse.json({ error: "Failed" }, { status: 500 });
    }
}