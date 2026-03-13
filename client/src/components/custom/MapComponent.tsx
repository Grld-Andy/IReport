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
import { severityConfig, statusConfig } from "@/constants/getColors";
import Badge from "./Badge";
import { criticalIncidentIcon, highIncidentIcon, lowIncidentIcon, mediumIncidentIcon, meIcon } from "@/assets/Icon";

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
  console.log(incidents)
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

      {myLocation && (
        <>
          <Marker icon={meIcon} position={myLocation}>
            <Popup>My Current Location</Popup>
          </Marker>
          <FlyToLocation location={myLocation} />
        </>
      )}

      {incidents?.map((incident) => (
        <Marker
        icon={
          incident.severity == "Low" ? lowIncidentIcon :
          incident.severity == "Medium" ? mediumIncidentIcon :
          incident.severity == "High" ? highIncidentIcon : criticalIncidentIcon
        }
          key={incident.id}
          position={{ lat: incident.latitude, lng: incident.longitude }}
        >
          <Popup>
            <div className="">
              <div className="flex gap-2">
                <Badge value={incident.severity} config={severityConfig} />
                <Badge
                  value={incident.status.toString()}
                  config={statusConfig}
                />
              </div>
              <h1 className="text-lg font-semibold">{incident.subject}</h1>
              <p className="text-md text-gray-700">{incident.description}</p>
              <p className="text-gray-700">Category: {incident.category}</p>
              <p className="">Created by {incident.reporter.name} on </p>
              <p>{new Date(incident.createdAt).toDateString()}</p>
            </div>
          </Popup>
        </Marker>
      ))}

      <Rectangle bounds={persolArea} pathOptions={{ color: "blue" }} />
    </MapContainer>
  );
};

export default MapComponent;
