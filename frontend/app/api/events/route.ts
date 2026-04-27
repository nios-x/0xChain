import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const hours = parseInt(searchParams.get("hours") || "24", 10);

    const fromDate = new Date(Date.now() - hours * 60 * 60 * 1000);

    const events = await prisma.event.findMany({
      where: {
        timestamp: {
          gte: fromDate,
        },
      },
      take: limit,
      orderBy: { timestamp: "desc" },
    });

    const formattedEvents = events.map((e) => ({
      ...e,
      event_type: e.event_type.toLowerCase(), // prisma has LOCATION_UPDATE, frontend expects location_update
      timestamp: e.timestamp.toISOString(),
    }));

    return NextResponse.json(formattedEvents);
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}
