using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using SafeZone.Shared.Abstractions.Events;

namespace SafeZone.Shared.Infrastructure.SignalR.UsersHub.UserUpdated;

internal class UserUpdatedEventHandler(IHubContext<UserHub> _hubContext) : IEventHandler<UserUpdatedEvent>
{
    private readonly IHubContext<UserHub> hubContext = _hubContext;

    public async Task HandleAsync(UserUpdatedEvent @event, CancellationToken cancellationToken = default)
    {
        await hubContext.Clients.All.SendAsync("UserUpdated", new UserUpdatedEvent(@event.User), cancellationToken);
    }
}