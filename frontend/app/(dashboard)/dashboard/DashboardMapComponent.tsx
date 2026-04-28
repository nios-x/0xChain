"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet's default icon path issues in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function DashboardMapComponent() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="absolute inset-0 bg-surface flex items-center justify-center text-text-dim text-sm font-bold uppercase tracking-widest">Loading Map...</div>;
  }

  // Example global coordinates for operations overview
  const hubs = [
    { name: "Global Hub: New York", position: [40.7128, -74.0060] as [number, number], color: "#1DB954" },
    { name: "Regional Hub: London", position: [51.5074, -0.1278] as [number, number], color: "#1DB954" },
    { name: "Regional Hub: Tokyo", position: [35.6762, 139.6503] as [number, number], color: "#1DB954" },
    { name: "Local Hub: Sydney", position: [-33.8688, 151.2093] as [number, number], color: "#F59B23" },
    { name: "Local Hub: Cape Town", position: [-33.9249, 18.4241] as [number, number], color: "#F59B23" },
  ];

  return (
    <MapContainer center={[20, 0]} zoom={2} className="w-full h-full z-0 relative">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      
      {hubs.map((hub, idx) => (
        <CircleMarker
          key={idx}
          center={hub.position}
          radius={6}
          pathOptions={{ color: hub.color, fillColor: hub.color, fillOpacity: 0.8 }}
        >
          <Popup>{hub.name}</Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
