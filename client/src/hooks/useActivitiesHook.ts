import { useEffect } from "react";
import * as signalR from "@microsoft/signalr";
import { useAppDispatch, useAppSelector } from "@/redux/app/hooks";
import { addActivitieState } from "@/redux/features/activities/activitiesSlice";
import { socketUrl } from "@/constants";
import type { ActivityFeed } from "@/types/ActivityFeed";

export function useActivityHub() {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    if (!currentUser?.companyId) return;

    const hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${socketUrl}Activities`)
      .withAutomaticReconnect()
      .build();

    const joinRoom = async () => {
      try {
        await hubConnection.invoke("JoinRoom", currentUser.companyId);
      } catch (err) {
        console.error("Failed to join activities room: ", err);
      }
    };

    const leaveRoom = async () => {
      try {
        await hubConnection.invoke("LeaveRoom", currentUser.companyId);
      } catch (err) {
        console.error("Failed to join activities room: ", err);
      }
    };

    hubConnection
      .start()
      .then(async () => {
        console.log("Connected to ActivityHub");
        await joinRoom();
      })
      .catch((err) => console.error("Failed to connect to activityHub: ", err));
    
    hubConnection.onreconnected(async() => {
      console.log("Reconnected to ActivityHub")
      await joinRoom()
    })

    const handleActivityCreated = (activity: ActivityFeed) => {
      dispatch(addActivitieState(activity));
    }

    hubConnection.on("ActivityCreated", handleActivityCreated);

    return () => {
      hubConnection.off("ActivityCreated", handleActivityCreated);
      if(hubConnection.state === signalR.HubConnectionState.Connected){
        leaveRoom()
      }
      hubConnection.stop();
    };
  }, [currentUser?.companyId, dispatch]);

  return {};
}
