import * as signalR from "@microsoft/signalr"

const connections: signalR.HubConnection[] = []

export const registerConnection = (conn: signalR.HubConnection) => {
    connections.push(conn)
}

export const stopAllConnections = async() => {
    await Promise.all(
        connections.map(async (conn) => {
            try{
                if(conn.state !== signalR.HubConnectionState.Disconnected){
                    await conn.stop();
                }
            }catch(err){
                console.error("Error stopping connections: ", err)
            }
        })
    )
    connections.length = 0;
}

// todo: use registerconnection in hook
// todo: use stopallconnections in logout