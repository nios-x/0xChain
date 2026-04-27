import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  let dbStatus = "connected";
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch (error) {
    dbStatus = "disconnected";
  }

  return NextResponse.json({
    status: dbStatus === "connected" ? "healthy" : "degraded",
    database: dbStatus,
    redis: "disconnected", // Mocked as we don't have redis connected in Next.js right now
    neo4j: "disconnected", // Mocked as we don't have neo4j connected in Next.js right now
    timestamp: new Date().toISOString(),
  });
}
