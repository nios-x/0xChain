// app/api/driver/location/route.ts
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { shipmentId, lat, lon, location } = await req.json();

        await prisma.locationLog.create({
            data: {
                shipment_id: shipmentId,
                lat,
                lon,
                location,
            },
        });

        await prisma.shipment.update({
            where: { id: shipmentId },
            data: {
                current_lat: lat,
                current_lon: lon,
                current_location: location,
            },
        });

        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: "Failed" }, { status: 500 });
    }
}