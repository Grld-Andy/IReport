using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace SafeZone.Shared.Infrastructure.SignalR.LocationsHub;

public class LocationHub : Hub
{
    public override async Task OnConnectedAsync()
    {
        await base.OnConnectedAsync();
    }

    public async Task UpdateLocation(UserLocationDto locationDto)
    {
        await Clients.OthersInGroup(locationDto.CompanyId.ToString()).SendAsync("UserLocationUpdated", locationDto);
    }

    public override async Task OnDisconnectedAsync(Exception exception)
    {
        if (exception != null)
        {
            Console.WriteLine($"Connection lost due to error: {exception.Message}");
        }

        await Clients.All.SendAsync(
            "UserDisconnected",
            Context.UserIdentifier
        );

        await base.OnDisconnectedAsync(exception);
    }

    public Task JoinRoom(string CompanyId)
    {
        return Groups.AddToGroupAsync(Context.ConnectionId, CompanyId);
    }

    public Task LeaveRoom(string CompanyId)
    {
        return Groups.RemoveFromGroupAsync(Context.ConnectionId, CompanyId);
    }
}

public class UserLocationDto
{
    public decimal Lat { get; set; }
    public decimal Lng { get; set; }
    public string Name { get; set; } = string.Empty;
    public Guid UserId { get; set; }
    public Guid CompanyId { get; set; }
}