import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';  // Import Leaflet CSS for map styling
import L from 'leaflet';

const Map = ({ routeCoords }) => {
  const defaultPosition = [23.073, 76.855];  // Default center position

  const icon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  return (
    <div style={{ height: '70vh' }}> {/* Set height of the map */}
      <MapContainer center={routeCoords && routeCoords.length > 0 ? routeCoords[0] : defaultPosition} zoom={13} style={{ height: '100%' }}>
        {/* TileLayer: Defines the background map source */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {/* Markers for start and end points */}
        {routeCoords && routeCoords.length > 0 && (
          <>
            <Marker position={routeCoords[0]} icon={icon}>
              <Popup>Start</Popup>
            </Marker>
            <Marker position={routeCoords[routeCoords.length - 1]} icon={icon}>
              <Popup>End</Popup>
            </Marker>
            {/* Polyline to show the route */}
            <Polyline positions={routeCoords} color="blue" />
          </>
        )}
      </MapContainer>
    </div>
  );
};

export default Map;
