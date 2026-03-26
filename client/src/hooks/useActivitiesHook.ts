import { useEffect } from "react";
import * as signalR from "@microsoft/signalr";
import { useAppDispatch } from "@/redux/app/hooks";
import { addActivitieState } from "@/redux/features/activities/activitiesSlice";
import { socketUrl } from "@/constants";

export function useActivityHub() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    const hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${socketUrl}Activities`)
      .withAutomaticReconnect()
      .build();

    hubConnection
      .start()
      .then(() => console.log("Connected to ActivityHub"))
      .catch((err) => console.error("Failed to connect to activityHub: ", err));

    hubConnection.on("ActivityCreated", (activity) => {
      dispatch(addActivitieState(activity));
    });

    return () => {
      hubConnection.stop();
    };
  }, [dispatch]);

  return { };
}