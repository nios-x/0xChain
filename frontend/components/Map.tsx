"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet-routing-machine";

// Fix for default marker icons in Leaflet when used with Webpack/Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface MapProps {
  origin: [number, number];
  destination: [number, number];
  onRouteCalculated?: (distance: number, time: number) => void;
}

const RoutingMachine = ({ origin, destination, onRouteCalculated }: MapProps) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(origin[0], origin[1]),
        L.latLng(destination[0], destination[1])
      ],
      routeWhileDragging: true,
      lineOptions: {
        styles: [{ color: "#1DB954", weight: 4 }],
        extendToWaypoints: true,
        missingRouteTolerance: 0
      },
      show: false, // Hide the default text instructions
      addWaypoints: false,
      fitSelectedRoutes: true,
      router: L.Routing.osrmv1({
        serviceUrl: "https://routing.openstreetmap.de/routed-car/route/v1"
      }),
    }).addTo(map);

    routingControl.on('routesfound', function(e: any) {
      const routes = e.routes;
      if (routes && routes.length > 0) {
        const summary = routes[0].summary;
        // summary.totalDistance is in meters, summary.totalTime is in seconds
        if (onRouteCalculated) {
          onRouteCalculated(summary.totalDistance, summary.totalTime);
        }
      }
    });

    routingControl.on('routingerror', function(e: any) {
      console.warn("Routing error (likely demo server rate limit/timeout):", e);
      // Fallback: Just calculate straight-line distance if the server fails
      if (onRouteCalculated) {
        const dist = map.distance(
          L.latLng(origin[0], origin[1]), 
          L.latLng(destination[0], destination[1])
        );
        onRouteCalculated(dist, dist / 22); // roughly 80 km/h
      }
    });

    return () => {
      try {
        if (map && routingControl) {
          map.removeControl(routingControl);
        }
      } catch (err) {
        console.warn("Error removing routing control on unmount:", err);
      }
    };
  }, [map, origin, destination, onRouteCalculated]);

  return null;
};

export default function Map({ origin, destination, onRouteCalculated }: MapProps) {
  return (
    <MapContainer 
      center={origin} 
      zoom={13} 
      style={{ height: "100%", width: "100%", zIndex: 1 }}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        className="map-tiles"
      />
      <RoutingMachine 
        origin={origin} 
        destination={destination} 
        onRouteCalculated={onRouteCalculated} 
      />
    </MapContainer>
  );
}