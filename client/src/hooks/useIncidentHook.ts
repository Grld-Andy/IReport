import { useEffect } from "react";
import * as signalR from "@microsoft/signalr";
import { useAppDispatch, useAppSelector } from "@/redux/app/hooks";
import {
  addIncidentState,
  deleteIncidentState,
  updateIncidentState,
} from "@/redux/features/incidents/incidentsSlice";
import { socketUrl } from "@/constants";
import type { Incident } from "@/types/Incident";

type IncidentPayload = {
  incident: Incident;
};

type DeletePayload = {
  id: string;
};

export function useIncidentHub() {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    if (!currentUser?.companyId) return;

    const hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${socketUrl}Incidents`)
      .withAutomaticReconnect()
      .build();

    const joinRoom = async(): Promise<void> => {
      try {
        await hubConnection.invoke("JoinRoom", currentUser.companyId);
      } catch (err) {
        console.error("Failed to join incident room: ", err);
      }
    };

    const leaveRoom = async(): Promise<void> => {
      try {
        await hubConnection.invoke("LeaveRoom", currentUser.companyId);
      } catch (err) {
        console.error("LeaveRoom error:", err);
      }
    };

    hubConnection
      .start()
      .then(async () => {
        console.log("Connected to IncidentHub");
        await joinRoom();
      })
      .catch((err) =>
        console.error("SignalR connection error:", err)
      );

    hubConnection.onreconnected(async () => {
      console.log("Reconnected to IncidentHub");
      await joinRoom();
    });

    const handleIncidentAdded = ({ incident }: IncidentPayload): void => {
      if (
        incident.team === currentUser?.team ||
        currentUser?.team === "Admin"
      ) {
        dispatch(addIncidentState(incident));
      }
    };

    const handleIncidentDeleted = ({ id }: DeletePayload): void => {
      dispatch(deleteIncidentState(id));
    };

    const handleIncidentUpdated = ({ incident }: IncidentPayload): void => {
      if (
        incident.team === currentUser?.team ||
        currentUser?.team === "Admin"
      ) {
        dispatch(updateIncidentState(incident));
      }
    };

    hubConnection.on("IncidentAdded", handleIncidentAdded);
    hubConnection.on("IncidentDeleted", handleIncidentDeleted);
    hubConnection.on("IncidentUpdated", handleIncidentUpdated);

    return () => {
      hubConnection.off("IncidentAdded", handleIncidentAdded);
      hubConnection.off("IncidentDeleted", handleIncidentDeleted);
      hubConnection.off("IncidentUpdated", handleIncidentUpdated);

      if (hubConnection.state === signalR.HubConnectionState.Connected) {
        leaveRoom();
      }

      hubConnection.stop();
    };
  }, [currentUser?.companyId, currentUser?.team, dispatch]);

  return {};
}