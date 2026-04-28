import { NextRequest, NextResponse } from "next/server";

/* ─────────────────────────────────────────────────────────────────────────────
   /api/route-proxy
   Query params:
     coords  – "lat,lng;lat,lng;..."   (we accept lat,lng to keep Map.tsx simple)

   Tries in order:
     1. Valhalla  (openstreetmap.de)  – POST, no API key needed
     2. OSRM demo (project-osrm.org)  – GET, no API key needed
   Falls back to a straight-line response so the UI never breaks.

   Returns:
   {
     ok: true,
     polyline: [[lat,lng], ...],
     distanceMeters: number,
     durationSeconds: number,
   }
   or { ok: false, error: string }
───────────────────────────────────────────────────────────────────────────── */

type LatLng = [number, number]; // [lat, lng]

function haversine(a: LatLng, b: LatLng): number {
  const R = 6_371_000;
  const rad = (d: number) => (d * Math.PI) / 180;
  const dLat = rad(b[0] - a[0]);
  const dLng = rad(b[1] - a[1]);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(a[0])) * Math.cos(rad(b[0])) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.asin(Math.sqrt(h));
}

// ── 1. Valhalla ───────────────────────────────────────────────────────────────
async function tryValhalla(points: LatLng[]): Promise<{
  polyline: LatLng[];
  distanceMeters: number;
  durationSeconds: number;
} | null> {
  const body = {
    locations: points.map(([lat, lng]) => ({ lat, lon: lng })),
    costing: "auto",
    directions_options: { units: "km" },
    shape_match: "map_snap",
  };

  const res = await fetch("https://valhalla1.openstreetmap.de/route", {
    method: "POST",
    headers: { "Content-Type": "application/json", "User-Agent": "RouteOptimizer/1.0" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(12_000),
  });

  if (!res.ok) return null;
  const json = await res.json();

  const legs = json?.trip?.legs;
  if (!legs?.length) return null;

  // Valhalla returns shape as encoded polyline6 per leg – decode it
  const decodedPoints: LatLng[] = [];
  for (const leg of legs) {
    const pts = decodePolyline6(leg.shape);
    // Avoid duplicating the join point between legs
    if (decodedPoints.length > 0) pts.shift();
    decodedPoints.push(...pts);
  }

  const summary = json.trip.summary;
  return {
    polyline: decodedPoints,
    distanceMeters: summary.length * 1000,
    durationSeconds: summary.time,
  };
}

// Valhalla uses precision=6 encoded polyline
function decodePolyline6(encoded: string): LatLng[] {
  const pts: LatLng[] = [];
  let idx = 0;
  let lat = 0;
  let lng = 0;

  while (idx < encoded.length) {
    let b: number;
    let shift = 0;
    let result = 0;
    do {
      b = encoded.charCodeAt(idx++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    lat += result & 1 ? ~(result >> 1) : result >> 1;

    shift = 0;
    result = 0;
    do {
      b = encoded.charCodeAt(idx++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    lng += result & 1 ? ~(result >> 1) : result >> 1;

    pts.push([lat / 1e6, lng / 1e6]);
  }
  return pts;
}

// ── 2. OSRM ───────────────────────────────────────────────────────────────────
async function tryOSRM(points: LatLng[]): Promise<{
  polyline: LatLng[];
  distanceMeters: number;
  durationSeconds: number;
} | null> {
  // OSRM wants lng,lat
  const coordStr = points.map(([lat, lng]) => `${lng},${lat}`).join(";");
  const url = `https://router.project-osrm.org/route/v1/driving/${coordStr}?overview=full&geometries=geojson&steps=false`;

  const res = await fetch(url, {
    headers: { "User-Agent": "RouteOptimizer/1.0" },
    signal: AbortSignal.timeout(10_000),
  });

  if (!res.ok) return null;
  const json = await res.json();
  if (json.code !== "Ok" || !json.routes?.length) return null;

  const route = json.routes[0];
  const polyline: LatLng[] = route.geometry.coordinates.map(
    ([lng, lat]: [number, number]) => [lat, lng]
  );
  return {
    polyline,
    distanceMeters: route.distance,
    durationSeconds: route.duration,
  };
}

// ── Straight-line fallback ────────────────────────────────────────────────────
function straightLineFallback(points: LatLng[]): {
  polyline: LatLng[];
  distanceMeters: number;
  durationSeconds: number;
} {
  const dist = points.reduce(
    (acc, p, i) => (i === 0 ? 0 : acc + haversine(points[i - 1], p)),
    0
  );
  return {
    polyline: points,
    distanceMeters: dist,
    durationSeconds: dist / 22, // ~80 km/h
  };
}

// ── Handler ───────────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const raw = new URL(req.url).searchParams.get("coords");
  if (!raw) {
    return NextResponse.json({ ok: false, error: "coords required" }, { status: 400 });
  }

  // Parse "lat,lng;lat,lng;..."
  const points: LatLng[] = raw.split(";").map((seg) => {
    const [lat, lng] = seg.split(",").map(Number);
    return [lat, lng];
  });

  if (points.length < 2) {
    return NextResponse.json({ ok: false, error: "need at least 2 points" }, { status: 400 });
  }

  // Try each service in order
  let result =
    (await tryValhalla(points).catch(() => null)) ??
    (await tryOSRM(points).catch(() => null)) ??
    straightLineFallback(points);

  return NextResponse.json({ ok: true, ...result });
}