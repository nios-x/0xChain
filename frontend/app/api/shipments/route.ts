import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ShipmentStatus } from "@prisma/client";
import { PriorityClass } from "@prisma/client";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    // Expected fields from form
    const {
      origin,
      destination,
      origin_lat,
      origin_lon,
      destination_lat,
      destination_lon,
      weight_kg,
      volume_m3,
      cargo_type,
      priority,
      scheduled_dispatch,
      notes,
    } = data;

    // Helper to map display strings to enum values
    const mapCargoType = (type: string) => {
      const map: Record<string, string> = {
        "Standard Freight": "STANDARD_FREIGHT",
        "Perishable Goods": "PERISHABLE_GOODS",
        "Hazardous Materials (Hazmat)": "HAZARDOUS_MATERIALS",
        "Fragile Items": "FRAGILE_ITEMS",
      };
      return map[type] ?? "STANDARD_FREIGHT";
    };
    const mapPriority = (p: string) => {
      const map: Record<string, string> = {
        "Standard (SLA 3 Days)": "STANDARD",
        "Express (SLA 24 Hours)": "EXPRESS",
        "Priority (Same Day Sync)": "PRIORITY",
      };
      return map[p] ?? "STANDARD";
    };

    const dispatchDate = scheduled_dispatch ? new Date(scheduled_dispatch) : new Date();
    let estimatedDelivery = new Date(dispatchDate);
    const prio = mapPriority(priority);

    if (prio === "STANDARD") {
      estimatedDelivery.setDate(estimatedDelivery.getDate() + 3);
    } else if (prio === "EXPRESS") {
      estimatedDelivery.setDate(estimatedDelivery.getDate() + 1);
    } else if (prio === "PRIORITY") {
      estimatedDelivery.setHours(estimatedDelivery.getHours() + 12);
    }

    const newShipment = await prisma.shipment.create({
      data: {
        source: origin,
        destination: destination,
        source_lat: origin_lat ? parseFloat(origin_lat) : undefined,
        source_lon: origin_lon ? parseFloat(origin_lon) : undefined,
        destination_lat: destination_lat ? parseFloat(destination_lat) : undefined,
        destination_lon: destination_lon ? parseFloat(destination_lon) : undefined,
        weight_kg: weight_kg ? parseFloat(weight_kg) : undefined,
        volume_m3: volume_m3 ? parseFloat(volume_m3) : undefined,
        cargo_type: (cargo_type),
        priority: (prio) as PriorityClass,
        scheduled_dispatch: dispatchDate,
        notes: notes ?? undefined,
        current_location: origin, // Initialize location at source
        current_lat: origin_lat ? parseFloat(origin_lat) : undefined,
        current_lon: origin_lon ? parseFloat(origin_lon) : undefined,
        estimated_delivery: estimatedDelivery,
      },
    });

    return NextResponse.json({
      success: true,
      shipment: newShipment,
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating shipment:", error);
    return NextResponse.json({ error: "Failed to create shipment" }, { status: 500 });
  }
}

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
