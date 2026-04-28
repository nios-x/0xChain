"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet's default icon path issues in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function DriverMapComponent() {
  const [mounted, setMounted] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<[number, number] | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocationError(error.message);
          // Fallback to Chicago if geolocation fails or is denied
          setCurrentLocation([41.8781, -87.6298]);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setLocationError("Geolocation not supported");
      // Fallback
      setCurrentLocation([41.8781, -87.6298]);
    }
  }, []);

  if (!mounted || !currentLocation) {
    return (
      <div className="absolute inset-0 bg-surface flex flex-col items-center justify-center text-center p-4">
        <span className="material-symbols-outlined text-primary text-4xl mb-2 animate-pulse">
          my_location
        </span>
        <div className="text-text-dim text-sm font-bold uppercase tracking-widest">
          Acquiring GPS Signal...
        </div>
        {locationError && (
          <div className="text-error text-xs mt-2 font-mono">
            {locationError} - Using Fallback Location
          </div>
        )}
      </div>
    );
  }

  return (
    <MapContainer center={currentLocation} zoom={14} className="w-full h-full z-0 relative">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />

      <Marker position={currentLocation}>
        <Popup>Live GPS: Current Location</Popup>
      </Marker>

    </MapContainer>
  );
}
