/**
 * 0xChain API Client
 * Typed fetch wrapper for the FastAPI backend.
 * Base URL: NEXT_PUBLIC_BACKEND_URL (default: http://localhost:8000)
 */

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 
  (typeof window !== "undefined" ? "/api" : "http://localhost:3000/api");

// ─── Types ────────────────────────────────────────────────────────────────────

export type ShipmentStatus =
  | "pending"
  | "in_transit"
  | "delayed"
  | "rerouted"
  | "delivered"
  | "failed";

export interface Shipment {
  id: string;
  source: string;
  destination: string;
  status: ShipmentStatus;
  current_location: string | null;
  current_lat: number | null;
  current_lon: number | null;
  created_at: string;
  updated_at: string;
  estimated_delivery: string | null;
  actual_delivery: string | null;
  metadata: Record<string, unknown> | null;
}

export interface ShipmentListResponse {
  total: number;
  shipments: Shipment[];
}

export type EventType =
  | "location_update"
  | "weather_update"
  | "traffic_update"
  | "delay_detected"
  | "anomaly_detected"
  | "reroute_triggered"
  | "prediction";

export interface ShipmentEvent {
  id: number;
  shipment_id: string;
  timestamp: string;
  event_type: EventType;
  data: Record<string, unknown>;
  severity: string;
}

export interface DashboardMetrics {
  total_shipments: number;
  in_transit: number;
  delivered: number;
  delayed: number;
  failed: number;
  average_delay_hours: number;
  disruption_probability_avg: number;
  alerts_active: number;
}

export interface DashboardResponse {
  metrics: DashboardMetrics;
  recent_events: ShipmentEvent[];
  critical_alerts: Record<string, unknown>[];
}

export interface PredictionResponse {
  disruption_probability: number;
  risk_factors: string[];
  recommended_actions: string[];
}

export interface RouteNode {
  id: string;
  name: string;
  lat?: number;
  lon?: number;
}

export interface RouteEdge {
  from: string;
  to: string;
  distance?: number;
  time?: number;
}

export interface RouteResponse {
  id: string;
  nodes: string[];
  edges: Record<string, unknown>[];
  total_distance: number;
  estimated_time: number;
  risk_score: number;
}

export interface OptimizeRouteResponse {
  route: RouteResponse;
  alternatives: RouteResponse[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    cache: "no-store",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${await res.text()}`);
  }
  return res.json() as Promise<T>;
}

async function apiPost<TBody, TResult>(
  path: string,
  body: TBody
): Promise<TResult> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    cache: "no-store",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${await res.text()}`);
  }
  return res.json() as Promise<TResult>;
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export async function getDashboardMetrics(): Promise<DashboardResponse> {
  return apiGet<DashboardResponse>("/admin/dashboard");
}

// ─── Shipments ────────────────────────────────────────────────────────────────

export interface GetShipmentsParams {
  skip?: number;
  limit?: number;
  status?: ShipmentStatus;
}

export async function getShipments(
  params: GetShipmentsParams = {}
): Promise<ShipmentListResponse> {
  const qs = new URLSearchParams();
  if (params.skip !== undefined) qs.set("skip", String(params.skip));
  if (params.limit !== undefined) qs.set("limit", String(params.limit));
  if (params.status) qs.set("status", params.status);
  const query = qs.toString() ? `?${qs.toString()}` : "";
  return apiGet<ShipmentListResponse>(`/shipments${query}`);
}

export async function getShipment(id: string): Promise<Shipment> {
  return apiGet<Shipment>(`/shipments/${id}`);
}

// ─── Events ───────────────────────────────────────────────────────────────────

export async function getShipmentEvents(
  shipmentId: string,
  limit = 20
): Promise<ShipmentEvent[]> {
  return apiGet<ShipmentEvent[]>(`/events/${shipmentId}?limit=${limit}`);
}

export async function getRecentEvents(
  hours = 24,
  limit = 20
): Promise<ShipmentEvent[]> {
  return apiGet<ShipmentEvent[]>(`/events?hours=${hours}&limit=${limit}`);
}

// ─── Predictions ──────────────────────────────────────────────────────────────

export async function getPrediction(
  shipmentId: string,
  opts?: {
    weather_condition?: string;
    traffic_level?: string;
    distance_remaining?: number;
  }
): Promise<PredictionResponse> {
  return apiPost<unknown, PredictionResponse>("/predictions/disruption", {
    shipment_id: shipmentId,
    ...opts,
  });
}

// ─── Routes ───────────────────────────────────────────────────────────────────

export async function optimizeRoute(
  source: string,
  destination: string,
  constraints?: Record<string, unknown>
): Promise<OptimizeRouteResponse> {
  return apiPost<unknown, OptimizeRouteResponse>("/routes/optimize", {
    source,
    destination,
    constraints,
  });
}

// ─── Health ───────────────────────────────────────────────────────────────────

export async function getHealth(): Promise<{ status: string }> {
  return apiGet<{ status: string }>("/health");
}
