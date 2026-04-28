"use client";

import { useEffect, useRef, useCallback } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// ── Fix Leaflet default icon paths ────────────────────────────────────────────

// extend the type safely
type LeafletDefaultIcon = typeof L.Icon.Default & {
  prototype: {
    _getIconUrl?: string;
  };
};

const DefaultIcon = L.Icon.Default as LeafletDefaultIcon;

delete DefaultIcon.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// ── Icon factories ────────────────────────────────────────────────────────────
const makeIcon = (svg: string, size: [number, number], anchor?: [number, number]) =>
  L.divIcon({
    html: svg,
    className: "",
    iconSize: size,
    iconAnchor: anchor ?? [size[0] / 2, size[1]],
  });

/** Large labelled pin: letter A / B / 1 / 2 … */
function makePinIcon(label: string, color: string) {
  return makeIcon(
    `<svg width="40" height="54" viewBox="0 0 40 54" xmlns="http://www.w3.org/2000/svg" style="filter:drop-shadow(0 3px 6px rgba(0,0,0,.55))">
      <path d="M20 0C8.954 0 0 8.954 0 20c0 13.333 20 34 20 34S40 33.333 40 20C40 8.954 31.046 0 20 0z" fill="${color}"/>
      <circle cx="20" cy="20" r="13" fill="rgba(0,0,0,0.25)"/>
      <circle cx="20" cy="20" r="12" fill="white"/>
      <text x="20" y="25" text-anchor="middle" font-size="${label.length > 1 ? "11" : "14"}" font-weight="800"
            font-family="system-ui,sans-serif" fill="${color}">${label}</text>
    </svg>`,
    [40, 54],
    [20, 54]
  );
}

/** Small numbered circle for intermediate stops */
function makeStopIcon(n: number) {
  return makeIcon(
    `<svg width="30" height="42" viewBox="0 0 30 42" xmlns="http://www.w3.org/2000/svg" style="filter:drop-shadow(0 2px 4px rgba(0,0,0,.5))">
      <path d="M15 0C6.716 0 0 6.716 0 15c0 10 15 27 15 27S30 25 30 15C30 6.716 23.284 0 15 0z" fill="#f59e0b"/>
      <circle cx="15" cy="15" r="9" fill="white"/>
      <text x="15" y="19" text-anchor="middle" font-size="10" font-weight="800"
            font-family="system-ui,sans-serif" fill="#b45309">${n}</text>
    </svg>`,
    [30, 42],
    [15, 42]
  );
}

/** Midpoint distance badge shown along each leg */
function makeBadgeIcon(text: string) {
  const w = Math.max(60, text.length * 7 + 20);
  return makeIcon(
    `<div style="
      background:#1a1a2e;border:1.5px solid #1DB954;border-radius:20px;
      padding:3px 10px;white-space:nowrap;
      font-size:10px;font-weight:700;font-family:system-ui,sans-serif;
      color:#1DB954;box-shadow:0 2px 8px rgba(0,0,0,.6);
      letter-spacing:.04em;
    ">${text}</div>`,
    [w, 22],
    [w / 2, 11]
  );
}

/** Small directional arrow along the polyline */
function makeArrowIcon(angleDeg: number) {
  return makeIcon(
    `<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"
         style="transform:rotate(${angleDeg}deg);opacity:0.85">
      <polygon points="10,2 18,18 10,13 2,18" fill="#1DB954" stroke="#0f172a" stroke-width="1.5"/>
    </svg>`,
    [20, 20],
    [10, 10]
  );
}

/** Animated truck */
const truckIcon = makeIcon(
  `<svg width="38" height="38" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg"
       style="filter:drop-shadow(0 2px 6px rgba(0,0,0,.7))">
    <circle cx="19" cy="19" r="18" fill="#0f172a" stroke="#1DB954" stroke-width="2.5"/>
    <text x="19" y="25" text-anchor="middle" font-size="17">🚛</text>
  </svg>`,
  [38, 38],
  [19, 19]
);

// ── Helpers ───────────────────────────────────────────────────────────────────
function haversine(a: [number, number], b: [number, number]): number {
  const R = 6_371_000;
  const rad = (d: number) => (d * Math.PI) / 180;
  const dLat = rad(b[0] - a[0]);
  const dLng = rad(b[1] - a[1]);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(a[0])) * Math.cos(rad(b[0])) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.asin(Math.sqrt(h));
}

/** Compass bearing a→b in degrees (0=N,90=E) */
function bearing(a: [number, number], b: [number, number]): number {
  const rad = (d: number) => (d * Math.PI) / 180;
  const dLng = rad(b[1] - a[1]);
  const y = Math.sin(dLng) * Math.cos(rad(b[0]));
  const x =
    Math.cos(rad(a[0])) * Math.sin(rad(b[0])) -
    Math.sin(rad(a[0])) * Math.cos(rad(b[0])) * Math.cos(dLng);
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

/** Pick the point at fraction t (0–1) along a polyline */
function pointAtFraction(poly: [number, number][], t: number): [number, number] {
  const total = poly.reduce((acc, p, i) => (i === 0 ? 0 : acc + haversine(poly[i - 1], p)), 0);
  let target = total * t;
  for (let i = 1; i < poly.length; i++) {
    const seg = haversine(poly[i - 1], poly[i]);
    if (target <= seg) {
      const f = target / seg;
      return [
        poly[i - 1][0] + (poly[i][0] - poly[i - 1][0]) * f,
        poly[i - 1][1] + (poly[i][1] - poly[i - 1][1]) * f,
      ];
    }
    target -= seg;
  }
  return poly[poly.length - 1];
}

/** Format metres to "x.x km" or "x m" */
function fmtDist(m: number) {
  return m >= 1000 ? `${(m / 1000).toFixed(1)} km` : `${Math.round(m)} m`;
}

/** Format seconds to "Xh Ym" */
function fmtTime(s: number) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

// ── Fetch via proxy ───────────────────────────────────────────────────────────
async function fetchRoute(coords: [number, number][]): Promise<{
  polyline: [number, number][];
  distanceMeters: number;
  durationSeconds: number;
}> {
  const coordStr = coords.map(([lat, lng]) => `${lat},${lng}`).join(";");
  try {
    const res = await fetch(`/api/route-proxy?coords=${encodeURIComponent(coordStr)}`);
    const json = await res.json();
    if (json.ok) return json;
  } catch { }
  // straight-line fallback
  const dist = coords.reduce((acc, p, i) => (i === 0 ? 0 : acc + haversine(coords[i - 1], p)), 0);
  return { polyline: coords, distanceMeters: dist, durationSeconds: dist / 22 };
}

// ── Routing layer ─────────────────────────────────────────────────────────────
interface RoutingLayerProps {
  waypoints: [number, number][];
  waypointLabels: string[];          // e.g. ["New York", "Chicago", "LA"]
  onRouteCalculated?: (dist: number, time: number) => void;
  animateTruck?: boolean;
}

function RoutingLayer({ waypoints, waypointLabels, onRouteCalculated, animateTruck = true }: RoutingLayerProps) {
  const map = useMap();
  const layersRef = useRef<L.Layer[]>([]);
  const animFrameRef = useRef<number | null>(null);
  const truckRef = useRef<L.Marker | null>(null);

  const clearAll = useCallback(() => {
    layersRef.current.forEach((l) => { try { map.removeLayer(l); } catch { } });
    layersRef.current = [];
    if (animFrameRef.current) { cancelAnimationFrame(animFrameRef.current); animFrameRef.current = null; }
    if (truckRef.current) { try { map.removeLayer(truckRef.current); } catch { } truckRef.current = null; }
  }, [map]);

  const add = useCallback((l: L.Layer) => {
    if (!map) return;
    l.addTo(map);
    layersRef.current.push(l);
  }, [map]);


  useEffect(() => {
    if (!map || waypoints.length < 2) return;
    clearAll();
    let cancelled = false;

    fetchRoute(waypoints).then((result) => {
      if (cancelled) return;
      const { polyline, distanceMeters, durationSeconds } = result;
      onRouteCalculated?.(distanceMeters, durationSeconds);

      // ── 1. Shadow polyline ──
      add(L.polyline(polyline, { color: "#000", weight: 9, opacity: 0.18 }));

      // ── 2. Dashed underline (shows road underneath) ──
      add(L.polyline(polyline, { color: "#0f172a", weight: 5, opacity: 0.6 }));

      // ── 3. Main green route ──
      add(L.polyline(polyline, { color: "#1DB954", weight: 3.5, opacity: 1 }));

      // ── 4. Direction arrows every ~15% of route ──
      const ARROW_FRACTIONS = [0.15, 0.30, 0.45, 0.60, 0.75];
      ARROW_FRACTIONS.forEach((t) => {
        const pt = pointAtFraction(polyline, t);
        const ptNext = pointAtFraction(polyline, Math.min(t + 0.01, 0.99));
        const angleDeg = bearing(pt, ptNext);
        add(L.marker(pt, { icon: makeArrowIcon(angleDeg), interactive: false, zIndexOffset: 200 }));
      });

      // ── 5. Per-leg midpoint badges (distance + time per segment) ──
      for (let i = 0; i < waypoints.length - 1; i++) {
        // Find the slice of polyline that belongs to this leg
        // (approximation: split evenly across legs)
        const legFrac0 = i / (waypoints.length - 1);
        const legFrac1 = (i + 1) / (waypoints.length - 1);
        const midFrac = (legFrac0 + legFrac1) / 2;
        const midPt = pointAtFraction(polyline, midFrac);

        const legDist = distanceMeters / (waypoints.length - 1);
        const legTime = durationSeconds / (waypoints.length - 1);
        const badge = `${fmtDist(legDist)} · ${fmtTime(legTime)}`;

        add(L.marker(midPt, { icon: makeBadgeIcon(badge), interactive: false, zIndexOffset: 300 }));
      }

      // ── 6. Origin / Stop / Destination markers with popups ──
      waypoints.forEach((wp, i) => {
        const isOrigin = i === 0;
        const isDest = i === waypoints.length - 1;
        const label = isOrigin ? "A" : isDest ? "B" : String(i);
        const color = isOrigin ? "#1DB954" : isDest ? "#ef4444" : "#f59e0b";

        const icon = isOrigin || isDest
          ? makePinIcon(label, color)
          : makeStopIcon(i);

        const name = waypointLabels[i] ?? (isOrigin ? "Origin" : isDest ? "Destination" : `Stop ${i}`);
        const role = isOrigin ? "Origin" : isDest ? "Destination" : `Stop ${i}`;
        const roleColor = isOrigin ? "#1DB954" : isDest ? "#ef4444" : "#f59e0b";

        const popupHtml = `
          <div style="font-family:system-ui,sans-serif;min-width:160px;padding:2px 0">
            <div style="font-size:10px;font-weight:700;text-transform:uppercase;
                        letter-spacing:.1em;color:${roleColor};margin-bottom:4px">
              ${role}
            </div>
            <div style="font-size:13px;font-weight:700;color:#fff;line-height:1.3;margin-bottom:6px">
              ${name}
            </div>
            ${isOrigin ? `
            <div style="font-size:11px;color:#94a3b8">
              🚛 Truck departs from here
            </div>` : ""}
            ${isDest ? `
            <div style="font-size:11px;color:#94a3b8">
              🏁 Final destination
            </div>
            <div style="font-size:11px;color:#94a3b8;margin-top:2px">
              📏 ${fmtDist(distanceMeters)} &nbsp;⏱ ${fmtTime(durationSeconds)}
            </div>` : ""}
            ${!isOrigin && !isDest ? `
            <div style="font-size:11px;color:#94a3b8">
              📍 Waypoint stop ${i}
            </div>` : ""}
          </div>`;

        const marker = L.marker(wp, { icon, zIndexOffset: 500 })
          .bindPopup(popupHtml, {
            className: "route-popup",
            maxWidth: 220,
            offset: [0, -10],
          });

        // Auto-open origin popup on first load
        marker.addTo(map);
        layersRef.current.push(marker);

        if (isOrigin) setTimeout(() => marker.openPopup(), 600);
      });

      // ── 7. Fit bounds ──
      map.fitBounds(L.latLngBounds(polyline), { padding: [50, 50] });

      // ── 8. Animated truck ──
      if (animateTruck && polyline.length > 1) {
        const truck = L.marker(polyline[0], { icon: truckIcon, zIndexOffset: 1000 }).addTo(map);
        truckRef.current = truck;

        const SPEED = 0.0003;
        let progress = 0;
        let lastTs: number | null = null;

        const animate = (ts: number) => {
          if (cancelled) return;
          if (lastTs !== null) { progress += (ts - lastTs) * SPEED; if (progress >= 1) progress = 0; }
          lastTs = ts;
          const total = polyline.length - 1;
          const raw = progress * total;
          const idx = Math.min(Math.floor(raw), total - 1);
          const t = raw - idx;
          const a = polyline[idx], b = polyline[Math.min(idx + 1, total)];
          truck.setLatLng([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]);
          animFrameRef.current = requestAnimationFrame(animate);
        };
        animFrameRef.current = requestAnimationFrame(animate);
      }
    });

    return () => { cancelled = true; clearAll(); };
  }, [map, waypoints, waypointLabels, onRouteCalculated, animateTruck, clearAll, add]);

  return null;
}

// ── Public component ──────────────────────────────────────────────────────────
export interface MapProps {
  origin: [number, number];
  destination: [number, number];
  originLabel?: string;
  destinationLabel?: string;
  stops?: [number, number][];
  stopLabels?: string[];
  onRouteCalculated?: (distanceMeters: number, durationSeconds: number) => void;
  animateTruck?: boolean;
}

export default function Map({
  origin,
  destination,
  originLabel = "Origin",
  destinationLabel = "Destination",
  stops = [],
  stopLabels = [],
  onRouteCalculated,
  animateTruck = true,
}: MapProps) {
  const allWaypoints: [number, number][] = [origin, ...stops, destination];
  const allLabels: string[] = [originLabel, ...stopLabels, destinationLabel];
  const center: [number, number] = [(origin[0] + destination[0]) / 2, (origin[1] + destination[1]) / 2];

  return (
    <>
      <MapContainer center={center} zoom={6} style={{ height: "100%", width: "100%", zIndex: 1 }} zoomControl={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="map-tiles"
        />
        <RoutingLayer
          waypoints={allWaypoints}
          waypointLabels={allLabels}
          onRouteCalculated={onRouteCalculated}
          animateTruck={animateTruck}
        />
      </MapContainer>

      {/* Popup dark theme override */}
      <style>{`
        .route-popup .leaflet-popup-content-wrapper {
          background: #1e293b;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.6);
          padding: 0;
        }
        .route-popup .leaflet-popup-content {
          margin: 12px 14px;
          color: #fff;
        }
        .route-popup .leaflet-popup-tip {
          background: #1e293b;
        }
        .route-popup .leaflet-popup-close-button {
          color: #64748b !important;
          font-size: 16px !important;
          padding: 6px 8px !important;
        }
        .route-popup .leaflet-popup-close-button:hover {
          color: #fff !important;
        }
      `}</style>
    </>
  );
}