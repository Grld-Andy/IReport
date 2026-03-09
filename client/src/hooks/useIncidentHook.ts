import { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import type { IncidentAddedEvent } from "@/types/Incident";

export function useIncidentHub() {
  const [incidents, setIncidents] = useState<IncidentAddedEvent[]>([]);

  useEffect(() => {
    const hubConnection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5000/Incidents")
      .withAutomaticReconnect()
      .build();

    hubConnection
      .start()
      .then(() => console.log("Connected to IncidentHub"))
      .catch((err) => console.error("SignalR connection error: ", err));

    hubConnection.on("IncidentAdded", (incident: IncidentAddedEvent) => {
      console.log("Incident added:", incident);
      setIncidents((prev) => [...prev, incident]);
    });

    return () => {
      hubConnection.stop();
    };
  }, []);

  return { incidents };
}