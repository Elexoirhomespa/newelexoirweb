'use client';

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for Next.js leaflet icon issues
const createCustomIcon = (name: string) => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="
        background-color: #2D372B; 
        width: 14px; 
        height: 14px; 
        border-radius: 50%; 
        border: 2px solid white; 
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        transform: translate(-50%, -50%);
      "></div>
    `,
    iconSize: [14, 14],
    iconAnchor: [7, 7]
  });
};

const locations = [
  { name: "Ubud", coords: [-8.5069, 115.2625] as [number, number], desc: "Cultural Heart" },
  { name: "Canggu", coords: [-8.6478, 115.1385] as [number, number], desc: "Coastal Lifestyle" },
  { name: "Seminyak", coords: [-8.6913, 115.1639] as [number, number], desc: "Exclusive Villas" },
  { name: "Uluwatu", coords: [-8.8291, 115.0886] as [number, number], desc: "Cliff-side Relaxation" },
  { name: "Sanur", coords: [-8.6946, 115.2599] as [number, number], desc: "Tranquil Wellness" },
  { name: "Nusa Dua", coords: [-8.8066, 115.2268] as [number, number], desc: "5-Star Resorts" },
  { name: "Jimbaran", coords: [-8.7847, 115.1643] as [number, number], desc: "Sunset Relaxation" },
  { name: "Kuta", coords: [-8.7233, 115.1723] as [number, number], desc: "Professional Therapy" }
];

export default function ServiceMap() {
  return (
    <div className="w-full h-full relative overflow-hidden rounded-[32px] border border-border/40 shadow-inner bg-[#f5f5f3]">
      <MapContainer 
        center={[-8.68, 115.18]} 
        zoom={10} 
        scrollWheelZoom={false}
        dragging={false} // Disable dragging so it doesn't block page scroll on mobile
        touchZoom={true}
        doubleClickZoom={false}
        zoomControl={false}
        attributionControl={false}
        className="w-full h-full z-0"
        style={{ background: '#f5f5f3' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}"
        />
        {locations.map((loc, idx) => (
          <Marker key={idx} position={loc.coords} icon={createCustomIcon(loc.name)}>
            <Popup className="custom-popup" closeButton={false}>
              <div className="text-center p-1">
                <h4 className="font-serif font-medium text-primary text-sm m-0">{loc.name}</h4>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
