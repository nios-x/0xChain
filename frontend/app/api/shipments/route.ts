import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ShipmentStatus } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const skip = parseInt(searchParams.get("skip") || "0", 10);
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    const statusParam = searchParams.get("status")?.toUpperCase();
    
    // Validate status
    let status: ShipmentStatus | undefined = undefined;
    if (statusParam && Object.values(ShipmentStatus).includes(statusParam as ShipmentStatus)) {
      status = statusParam as ShipmentStatus;
    }

    const where = status ? { status } : {};

    const [shipments, total] = await Promise.all([
      prisma.shipment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: "desc" },
      }),
      prisma.shipment.count({ where }),
    ]);

    // Format fields to match frontend expectations
    // The frontend expects lowercase statuses "in_transit", etc.
    const formattedShipments = shipments.map((s) => ({
      ...s,
      status: s.status.toLowerCase(), // prisma has IN_TRANSIT, frontend expects in_transit
      created_at: s.created_at.toISOString(),
      updated_at: s.updated_at.toISOString(),
      estimated_delivery: s.estimated_delivery?.toISOString() || null,
      actual_delivery: s.actual_delivery?.toISOString() || null,
    }));

    return NextResponse.json({
      total,
      shipments: formattedShipments,
    });
  } catch (error) {
    console.error("Error fetching shipments:", error);
    return NextResponse.json(
      { error: "Failed to fetch shipments" },
      { status: 500 }
    );
  }
}
