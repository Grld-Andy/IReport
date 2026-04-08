import { socketUrl } from "@/constants";
import { useAppDispatch, useAppSelector } from "@/redux/app/hooks";
import {
  setMyLocation,
  updateUserLocation,
} from "@/redux/features/location/locationSlice";
import * as signalR from "@microsoft/signalr";
import { useEffect, useRef } from "react";

type LocationPayload = {
  lat: number;
  lng: number;
  name: string;
  userId: string;
  companyId: string;
};

export function useLocationsHub() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const shouldSend = useAppSelector((state) => state.location.shouldSend);

  const connectionRef = useRef<signalR.HubConnection | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const lastSentRef = useRef<number>(0);

  useEffect(() => {
    if (!user?.companyId) return;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${socketUrl}Locations`)
      .withAutomaticReconnect()
      .build();

    connectionRef.current = connection;

    const joinRoom = async (): Promise<void> => {
      try {
        await connection.invoke("JoinRoom", user.companyId);
      } catch (err) {
        console.error("JoinRoom error:", err);
      }
    };

    const leaveRoom = async (): Promise<void> => {
      try {
        await connection.invoke("LeaveRoom", user.companyId);
      } catch (err) {
        console.error("LeaveRoom error:", err);
      }
    };

    const handleUserLocationUpdated = (location: LocationPayload): void => {
      dispatch(updateUserLocation(location));
    };

    connection.on("UserLocationUpdated", handleUserLocationUpdated);

    connection
      .start()
      .then(async () => {
        console.log("Connected to LocationHub");
        await joinRoom();
      })
      .catch((err) => console.error("SignalR error:", err));

    connection.onreconnected(async () => {
      console.log("Reconnected to LocationHub");
      await joinRoom();
    });

    return () => {
      connection.off("UserLocationUpdated", handleUserLocationUpdated);
      if (connection.state === signalR.HubConnectionState.Connected) {
        leaveRoom();
      }
      connection.stop();
    };
  }, [dispatch, user?.companyId]);

  useEffect(() => {
    if (!shouldSend || !user) return;

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const now = Date.now();
        if (now - lastSentRef.current < 3000) return;
        lastSentRef.current = now;

        const location: LocationPayload = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          name: user.name,
          userId: user.id,
          companyId: user.companyId
        };

        dispatch(setMyLocation(location));

        if (
          connectionRef.current?.state ===
          signalR.HubConnectionState.Connected
        ) {
          connectionRef.current
            .invoke("UpdateLocation", location)
            .catch((err) =>
              console.error("Failed to send location:", err)
            );
        }
      },
      (err) => {
        console.error("Geolocation error:", err);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 1000,
        timeout: 10000,
      }
    );

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [dispatch, shouldSend, user]);

  return {};
}