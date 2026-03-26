import { useEffect } from "react";
import { useDispatch } from "react-redux"
import * as signalR from "@microsoft/signalr"
import { socketUrl } from "@/constants";
import { updateUser } from "@/redux/features/users/usersSlice";

const useUsersHub = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const hubConnection = new signalR.HubConnectionBuilder()
            .withUrl(`${socketUrl}Users`)
            .withAutomaticReconnect()
            .build();
        
        hubConnection.start()
            .then(() => console.log("Connected to UsersHub"))
            .catch(() => console.error("Failed to connect to UsersHub"))
        
        hubConnection.on("UserUpdated", (user) => {
            dispatch(updateUser(user));
        })
        
        return () => {
            hubConnection.stop()
        }
    }, [dispatch])
}

export default useUsersHub