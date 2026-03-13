import { useEffect } from "react";
import * as signalR from "@microsoft/signalr";
import { useAppDispatch } from "@/redux/app/hooks";
import { addActivitieState } from "@/redux/features/activities/activitiesSlice";

export function useActivityHub() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    const hubConnection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5000/Activities")
      .withAutomaticReconnect()
      .build();

    hubConnection
      .start()
      .then(() => console.log("Connected to ActivityHub"))
      .catch((err) => console.error("SignalR connection error: ", err));

    hubConnection.on("ActivityCreated", (activity) => {
        console.log("activity added: ", activity)
      dispatch(addActivitieState(activity));
    });

    return () => {
      hubConnection.stop();
    };
  }, [dispatch]);

  return { };
}