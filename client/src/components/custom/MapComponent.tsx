import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Rectangle } from 'react-leaflet';
import { persolArea, persolCenter } from '@/constants/cordinates';
import 'leaflet/dist/leaflet.css';

const MapComponent: React.FC = () => {

  return (
    <MapContainer center={persolCenter} zoom={20} style={{ height: '500px', width: '100%' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={persolCenter}>
        <Popup>My Current Location</Popup>
      </Marker>
      <Rectangle bounds={persolArea} pathOptions={{color: 'blue'}} />
    </MapContainer>
  );
};

export default MapComponent;
