import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { shipmentId: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "20", 10);

    const events = await prisma.event.findMany({
      where: { shipment_id: params.shipmentId },
      take: limit,
      orderBy: { timestamp: "desc" },
    });

    const formattedEvents = events.map((e) => ({
      ...e,
      event_type: e.event_type.toLowerCase(),
      timestamp: e.timestamp.toISOString(),
    }));

    return NextResponse.json(formattedEvents);
  } catch (error) {
    console.error("Error fetching shipment events:", error);
    return NextResponse.json(
      { error: "Failed to fetch shipment events" },
      { status: 500 }
    );
  }
}
