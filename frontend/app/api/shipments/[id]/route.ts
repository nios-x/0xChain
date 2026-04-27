import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const shipment = await prisma.shipment.findUnique({
      where: { id: params.id },
    });

    if (!shipment) {
      return NextResponse.json(
        { error: "Shipment not found" },
        { status: 404 }
      );
    }

    const formattedShipment = {
      ...shipment,
      status: shipment.status.toLowerCase(),
      created_at: shipment.created_at.toISOString(),
      updated_at: shipment.updated_at.toISOString(),
      estimated_delivery: shipment.estimated_delivery?.toISOString() || null,
      actual_delivery: shipment.actual_delivery?.toISOString() || null,
    };

    return NextResponse.json(formattedShipment);
  } catch (error) {
    console.error("Error fetching shipment details:", error);
    return NextResponse.json(
      { error: "Failed to fetch shipment details" },
      { status: 500 }
    );
  }
}
