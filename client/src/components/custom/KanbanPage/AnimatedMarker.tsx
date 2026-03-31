import React, { useEffect, useRef } from "react";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import type { UserLocation } from "@/redux/features/location/locationSlice";
import { userIcon } from "@/assets/Icon";

interface Props {
  user: UserLocation;
}

const AnimatedMarker: React.FC<Props> = ({ user }) => {
  const markerRef = useRef<L.Marker>(null);

  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.setLatLng([user.lat, user.lng]);
    }
  }, [user.lat, user.lng]);

  return (
    <Marker ref={markerRef} position={[user.lat, user.lng]} icon={userIcon} keyboard={true}>
      <Popup>
        <div role="dialog" aria-label={`${user.name} live location`}>
          <h1 className="font-semibold">{user.name}</h1>
          <p>Live location</p>
        </div>
      </Popup>
    </Marker>
  );
};

export default React.memo(AnimatedMarker);