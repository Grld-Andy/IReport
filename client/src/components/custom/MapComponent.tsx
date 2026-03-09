import React, { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Rectangle,
  useMap,
} from "react-leaflet";
import { persolArea, persolCenter } from "@/constants/cordinates";
import "leaflet/dist/leaflet.css";
import type { Incident } from "@/types/Incident";

interface Props {
  incidents: Array<Incident>;
  myLocation: { lat: number; lng: number } | null;
}

const FlyToLocation: React.FC<{
  location: { lat: number; lng: number } | null;
}> = ({ location }) => {
  const map = useMap();

  useEffect(() => {
    if (location) {
      map.flyTo([location.lat, location.lng], 20, { duration: 1.5 });
    }
  }, [location, map]);

  return null;
};

const MapComponent: React.FC<Props> = ({ incidents, myLocation }) => {
  return (
    <MapContainer
      center={persolCenter}
      zoom={20}
      style={{ height: "500px", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker position={persolCenter}>
        <Popup className="">Default Location</Popup>
      </Marker>

      {incidents?.map((incident, index) => (
        <Marker
          key={index}
          position={{ lat: incident.latitude, lng: incident.longitude }}
        >
          <Popup>{incident.subject}</Popup>
        </Marker>
      ))}

      {myLocation && (
        <>
          <Marker position={myLocation}>
            <Popup>My Current Location</Popup>
          </Marker>
          <FlyToLocation location={myLocation} />
        </>
      )}

      <Rectangle bounds={persolArea} pathOptions={{ color: "blue" }} />
    </MapContainer>
  );
};

export default MapComponent;
