// app/api/driver/events/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const events = await prisma.event.findMany({
            orderBy: { timestamp: "desc" },
            take: 10,
        });

        return NextResponse.json(
            events.map((e) => ({
                id: e.id,
                title: e.event_type,
                detail: JSON.stringify(e.data),
                time: e.timestamp,
                status: e.severity,
            }))
        );
    } catch {
        return NextResponse.json({ error: "Failed" }, { status: 500 });
    }
}