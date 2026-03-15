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
        await Clients.Others.SendAsync("UserLocationUpdated", locationDto);
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
}

public class UserLocationDto
{
    public decimal Lat { get; set; }
    public decimal Lng { get; set; }
    public string Name { get; set; } = string.Empty;
    public Guid UserId { get; set; }
}