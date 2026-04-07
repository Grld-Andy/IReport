using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace SafeZone.Shared.Infrastructure.SignalR.IncidentsHub;

public class IncidentHub : Hub
{
    public Task JoinRoom(string CompanyId)
    {
        return Groups.AddToGroupAsync(Context.ConnectionId, CompanyId);
    }

    public Task LeaveRoom(string CompanyId)
    {
        return Groups.RemoveFromGroupAsync(Context.ConnectionId, CompanyId);
    }
}