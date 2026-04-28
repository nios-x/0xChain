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

interface FleetVehicle {
  id: string;
  driver: string;
  status: string;
  location: string;
  speed: string;
  lat: number;
  lng: number;
}

export default function TrackingMapComponent({ fleet }: { fleet: FleetVehicle[] }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="absolute inset-0 bg-[#0a0a0a] flex items-center justify-center text-text-dim text-sm font-bold uppercase tracking-widest">Loading Map...</div>;
  }

  // Define custom icons based on status
  const getIcon = (status: string) => {
    let color = "#1DB954"; // primary (moving)
    if (status === "idle") color = "#F59B23"; // warning
    if (status === "stopped") color = "#E22134"; // error

    const svgIcon = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" width="32px" height="32px">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
      </svg>`;
    
    return L.divIcon({
      className: "custom-div-icon",
      html: svgIcon,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    });
  };

  return (
    <MapContainer center={[38.0, -115.0]} zoom={5} className="w-full h-full z-0 relative">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      
      {fleet.map((vehicle) => (
        <Marker key={vehicle.id} position={[vehicle.lat, vehicle.lng]} icon={getIcon(vehicle.status)}>
          <Popup>
            <div className="font-sans">
              <strong className="text-black block mb-1">{vehicle.id} - {vehicle.driver}</strong>
              <div className="text-sm">Status: <span className="capitalize">{vehicle.status}</span></div>
              <div className="text-sm">Speed: {vehicle.speed}</div>
              <div className="text-sm">Location: {vehicle.location}</div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
