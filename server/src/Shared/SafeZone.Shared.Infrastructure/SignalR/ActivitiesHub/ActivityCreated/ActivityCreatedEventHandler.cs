using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using SafeZone.Shared.Abstractions.Events;

namespace SafeZone.Shared.Infrastructure.SignalR.ActivitiesHub.ActivityCreated
{
    public class ActivityCreatedEventHandler(IHubContext<ActivityHub> hub) : IEventHandler<ActivityCreatedEvent>
    {
        private readonly IHubContext<ActivityHub> _hub = hub;

        async public Task HandleAsync(ActivityCreatedEvent @event, CancellationToken cancellationToken = default)
        {
            System.Console.WriteLine("created new activity");
            await _hub.Clients.All.SendAsync("ActivityCreated", cancellationToken);
        }
    }
}