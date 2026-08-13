import { useEffect } from "react";
import { useDispatch } from "react-redux";
import * as signalR from "@microsoft/signalr";
import { socketUrl } from "@/constants";
import { updateUser } from "@/redux/features/users/usersSlice";
import { useAppSelector } from "@/redux/app/hooks";
import type { User } from "@/types/User";

const useUsersHub = () => {
  const dispatch = useDispatch();
  const currentUser = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    if (!currentUser?.companyId) return;
    const hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${socketUrl}Users`, { withCredentials: true })
      .withAutomaticReconnect()
      .build();

    const joinRoom = async (): Promise<void> => {
      try {
        await hubConnection.invoke("JoinRoom", currentUser.companyId);
      } catch (err) {
        console.error("Failed to join incident room: ", err);
      }
    };

    const leaveRoom = async (): Promise<void> => {
      try {
        await hubConnection.invoke("LeaveRoom", currentUser.companyId);
      } catch (err) {
        console.error("LeaveRoom error:", err);
      }
    };

    hubConnection
      .start()
      .then(async () => {
        console.log("Connected to UsersHub");
        await joinRoom();
      })
      .catch((err) => console.error("SignalR connection error:", err));

    hubConnection.onreconnected(async () => {
      console.log("Reconnected to UsersHub");
      await joinRoom();
    });

    const handleUserUpdated = (user: User) => {
      dispatch(updateUser(user));
    };

    hubConnection.on("UserUpdated", handleUserUpdated);

    return () => {
      hubConnection.off("UserUpdated", handleUserUpdated);
      if (hubConnection.state === signalR.HubConnectionState.Connected) {
        leaveRoom();
      }
      hubConnection.stop();
    };
  }, [currentUser?.companyId, dispatch]);
};

export default useUsersHub;
