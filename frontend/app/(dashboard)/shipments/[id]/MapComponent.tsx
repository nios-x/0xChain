"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet's default icon path issues in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface MapProps {
  source_lat?: number | null;
  source_lon?: number | null;
  destination_lat?: number | null;
  destination_lon?: number | null;
  current_lat?: number | null;
  current_lon?: number | null;
}

export default function MapComponent({
  source_lat,
  source_lon,
  destination_lat,
  destination_lon,
  current_lat,
  current_lon,
}: MapProps) {
  // Try to find the best center
  let center: [number, number] = [0, 0];
  let hasValidCoords = false;

  if (current_lat != null && current_lon != null) {
    center = [current_lat, current_lon];
    hasValidCoords = true;
  } else if (source_lat != null && source_lon != null) {
    center = [source_lat, source_lon];
    hasValidCoords = true;
  } else if (destination_lat != null && destination_lon != null) {
    center = [destination_lat, destination_lon];
    hasValidCoords = true;
  }

  if (!hasValidCoords) {
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-surface to-surface-elevated flex items-center justify-center">
        <div className="text-center">
          <span className="material-symbols-outlined text-6xl text-primary/30 mb-2">map</span>
          <p className="text-text-dim text-sm font-bold uppercase tracking-widest">
            Map Unavailable
          </p>
          <p className="text-text-dim text-xs mt-1">Coordinates missing for this shipment.</p>
        </div>
      </div>
    );
  }

  const polylinePositions: [number, number][] = [];
  if (source_lat != null && source_lon != null) {
    polylinePositions.push([source_lat, source_lon]);
  }
  if (current_lat != null && current_lon != null) {
    polylinePositions.push([current_lat, current_lon]);
  } else if (destination_lat != null && destination_lon != null) {
    polylinePositions.push([destination_lat, destination_lon]);
  }

  return (
    <MapContainer center={center} zoom={6} className="w-full h-full z-0 relative">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      
      {source_lat != null && source_lon != null && (
        <Marker position={[source_lat, source_lon]}>
          <Popup>Origin</Popup>
        </Marker>
      )}

      {destination_lat != null && destination_lon != null && (
        <Marker position={[destination_lat, destination_lon]}>
          <Popup>Destination</Popup>
        </Marker>
      )}

      {current_lat != null && current_lon != null && (
        <Marker position={[current_lat, current_lon]}>
          <Popup>Current Location</Popup>
        </Marker>
      )}

      {polylinePositions.length > 1 && (
        <Polyline positions={polylinePositions} color="#10b981" weight={3} dashArray="5, 10" />
      )}
    </MapContainer>
  );
}
