import { useEffect } from "react";
import * as signalR from "@microsoft/signalr";
import { useAppDispatch, useAppSelector } from "@/redux/app/hooks";
import {
  addIncidentState,
  deleteIncidentState,
  updateIncidentState,
} from "@/redux/features/incidents/incidentsSlice";

export function useIncidentHub() {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    const hubConnection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5000/Incidents")
      .withAutomaticReconnect()
      .build();

    hubConnection
      .start()
      .then(() => console.log("Connected to IncidentHub"))
      .catch((err) => console.error("SignalR connection error: ", err));

    hubConnection.on("IncidentAdded", ({ incident }) => {
      if (incident.team == currentUser?.team || currentUser?.team == "Admin") {
        dispatch(addIncidentState(incident));
      }
    });

    hubConnection.on("IncidentDeleted", ({ id }) => {
      dispatch(deleteIncidentState(id));
    });

    hubConnection.on("IncidentUpdated", ({ incident }) => {
      console.log("Incident updated: ", incident, currentUser?.team);
      if (incident.team == currentUser?.team || currentUser?.team == "Admin") {
        dispatch(updateIncidentState(incident));
      }
    });

    return () => {
      hubConnection.stop();
    };
  }, [currentUser?.team, dispatch]);

  return {};
}
