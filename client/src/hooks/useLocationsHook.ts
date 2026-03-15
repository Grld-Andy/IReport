import { useAppDispatch, useAppSelector } from "@/redux/app/hooks";
import {
  setMyLocation,
  updateUserLocation,
} from "@/redux/features/location/locationSlice";
import * as signalR from "@microsoft/signalr";
import { useEffect, useRef } from "react";

export function useLocationsHub() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const shouldSend = useAppSelector((state) => state.location.shouldSend);

  const connectionRef = useRef<signalR.HubConnection | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const lastSentRef = useRef<number>(0);

  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5000/Locations")
      .withAutomaticReconnect()
      .build();

    connection.on("UserLocationUpdated", (location) => {
      dispatch(updateUserLocation(location));
    });

    connection
      .start()
      .then(() => console.log("Connected to LocationHub"))
      .catch((err) => console.error("SignalR error:", err));

    connectionRef.current = connection;

    return () => {
      connection.stop();
    };
  }, [dispatch]);

  useEffect(() => {
    if (!shouldSend || !user) return;
    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const now = Date.now();
        if (now - lastSentRef.current < 3000) return;
        lastSentRef.current = now;

        dispatch(
          setMyLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            name: "",
            userId: "",
          }),
        );

        const location = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          name: user.name,
          userId: user.id,
        };

        connectionRef.current
          ?.invoke("UpdateLocation", location)
          .catch((err) => console.error("Failed to send location:", err));
      },
      (err) => {
        console.error("Geolocation error:", err);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 1000,
        timeout: 10000,
      },
    );

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [dispatch, shouldSend, user]);

  return {};
}
