import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Rectangle,
  useMap,
} from "react-leaflet";
import { IoIosClose } from "react-icons/io";
import { MdOutlineArrowBackIosNew } from "react-icons/md";
import L from "leaflet";
import { persolArea, persolCenter } from "@/constants/cordinates";
import "leaflet/dist/leaflet.css";
import type { Incident } from "@/types/Incident";
import type { UserLocation } from "@/redux/features/location/locationSlice";
import { severityConfig, statusConfig } from "@/constants/getColors";
import Badge from "./Badge";
import {
  criticalIncidentIcon,
  highIncidentIcon,
  lowIncidentIcon,
  mediumIncidentIcon,
  meIcon,
} from "@/assets/Icon";
import { FitBounds } from "./FitBounds";
import AnimatedMarker from "./AnimatedMarker";

interface Props {
  incidents: Array<Incident>;
  myLocation: { lat: number; lng: number } | null;
  usersLocations: Record<string, UserLocation>;
}

interface FlyProps {
  location: { lat: number; lng: number } | null;
}

const FlyToLocation: React.FC<FlyProps> = ({ location }) => {
  const map = useMap();
  useEffect(() => {
    if (location)
      map.flyTo([location.lat, location.lng], 20, { duration: 1.5 });
  }, [location, map]);
  return null;
};

const MapComponent: React.FC<Props> = ({
  incidents,
  myLocation,
  usersLocations,
}) => {
  const [showIncidents, setShowIncidents] = useState(true);
  const [showResponders, setShowResponders] = useState(true);
  const [showLegend, setShowLegend] = useState(true);

  const getIncidentIcon = useCallback((severity: string) => {
    switch (severity) {
      case "Low":
        return lowIncidentIcon;
      case "Medium":
        return mediumIncidentIcon;
      case "High":
        return highIncidentIcon;
      default:
        return criticalIncidentIcon;
    }
  }, []);

  const bounds = useMemo(() => {
    const points: L.LatLngTuple[] = [
      ...incidents.map((i) => [i.latitude, i.longitude] as L.LatLngTuple),
      ...Object.values(usersLocations).map(
        (u) => [u.lat, u.lng] as L.LatLngTuple,
      ),
      ...(myLocation
        ? [[myLocation.lat, myLocation.lng] as L.LatLngTuple]
        : []),
    ];

    if (points.length === 0) return null;
    return L.latLngBounds(points);
  }, [incidents, usersLocations, myLocation]);

  return (
    <div className="relative">
      {showLegend && (
        <div className="absolute border top-2 right-2 z-[1000] bg-white p-2 rounded-lg shadow-md text-sm">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-semibold">Filters & Legend</h4>
            <button
              onClick={() => setShowLegend(false)}
              className="text-gray-500 hover:text-gray-700 font-bold"
            >
              <IoIosClose size={25} />
            </button>
          </div>
          <label className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={showIncidents}
              onChange={() => setShowIncidents((prev) => !prev)}
              className="w-4 h-4 accent-blue-500"
            />
            Incidents
          </label>
          <label className="flex items-center gap-1 mt-1">
            <input
              type="checkbox"
              checked={showResponders}
              onChange={() => setShowResponders((prev) => !prev)}
              className="w-4 h-4 accent-green-500"
            />
            Responders
          </label>
          <div className="mt-2 flex gap-10 pr-2">
            <div>
              <h4 className="mb-1 font-semibold">Incidents</h4>
              <div className="flex items-center gap-1">
                <div className="p-1 bg-blue-500 rounded-full" />
                <span>Low</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="p-1 bg-green-600 rounded-full" />
                <span>Medium</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="p-1 bg-amber-300 rounded-full" />
                <span>High</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="p-1 bg-red-500 rounded-full" />
                <span>Critical</span>
              </div>
            </div>
            <div>
              <h4 className="mb-1 font-semibold">Users</h4>
              <div className="flex items-center gap-1 mb-2">
                <img
                  src="/images/user.png"
                  alt="Responder"
                  className="w-5 h-7"
                />
                <span>Responder</span>
              </div>
              <div className="flex items-center gap-1">
                <img src="/images/me.png" alt="Me" className="w-5 h-7" />
                <span>Me</span>
              </div>
            </div>
          </div>
        </div>
      )}
      {!showLegend && (
        <button
          onClick={() => setShowLegend(true)}
          className="absolute top-2.5 right-2.5 z-[1000] bg-white p-1.5 rounded-full shadow-md hover:bg-gray-100 text-gray-600"
        >
          <MdOutlineArrowBackIosNew />
        </button>
      )}

      <MapContainer
        center={persolCenter}
        zoom={20}
        style={{ height: "500px", width: "100%" }}
        keyboard
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {bounds && <FitBounds bounds={bounds} />}
        {myLocation && (
          <>
            <Marker icon={meIcon} position={myLocation} keyboard>
              <Popup>
                <div role="dialog" aria-label="My Current Location">
                  <h1>My Current Location</h1>
                </div>
              </Popup>
            </Marker>
            <FlyToLocation location={myLocation} />
          </>
        )}
        {showIncidents &&
          incidents.map((incident) => (
            <Marker
              key={incident.id}
              position={{ lat: incident.latitude, lng: incident.longitude }}
              icon={getIncidentIcon(incident.severity)}
              keyboard
            >
              <Popup>
                <div>
                  <div className="flex gap-2">
                    <Badge value={incident.severity} config={severityConfig} />
                    <Badge
                      value={incident.status.toString()}
                      config={statusConfig}
                    />
                  </div>
                  <h1 className="text-lg font-semibold">{incident.subject}</h1>
                  <p className="text-gray-700">{incident.description}</p>
                  <p className="text-gray-700">Category: {incident.category}</p>
                  <p>
                    Created by {incident.reporter.name} on{" "}
                    {new Date(incident.createdAt).toDateString()}
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}
        {showResponders &&
          Object.values(usersLocations).map((user) => (
            <AnimatedMarker key={user.userId} user={user} />
          ))}
        <Rectangle bounds={persolArea} pathOptions={{ color: "blue" }} />
      </MapContainer>
    </div>
  );
};

export default MapComponent;
