import { useEffect } from "react";
import * as signalR from "@microsoft/signalr";
import { useAppDispatch } from "@/redux/app/hooks";
import { addIncidentState, deleteIncidentState, updateIncidentState } from "@/redux/features/incidents/incidentsSlice";

export function useIncidentHub() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    const hubConnection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5000/Incidents")
      .withAutomaticReconnect()
      .build();

    hubConnection
      .start()
      .then(() => console.log("Connected to IncidentHub"))
      .catch((err) => console.error("SignalR connection error: ", err));

    hubConnection.on("IncidentAdded", ({incident}) => {
      dispatch(addIncidentState(incident));
    });

    hubConnection.on("IncidentDeleted", ({id}) => {
      dispatch(deleteIncidentState(id))
    })

    hubConnection.on("IncidentUpdated", ({incident}) => {
      console.log("Incident updated:", incident);
      dispatch(updateIncidentState(incident));
    })

    return () => {
      hubConnection.stop();
    };
  }, [dispatch]);

  return { };
}