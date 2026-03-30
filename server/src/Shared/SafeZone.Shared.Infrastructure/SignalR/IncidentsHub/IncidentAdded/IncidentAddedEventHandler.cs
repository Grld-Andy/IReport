using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using SafeZone.Shared.Abstractions.Events;

namespace SafeZone.Shared.Infrastructure.SignalR.IncidentsHub.IncidentAdded
{
    public class IncidentAddedEventHandler(IHubContext<IncidentHub> hub) : IEventHandler<IncidentAddedEvent>
    {
        private readonly IHubContext<IncidentHub> _hub = hub;

        async Task IEventHandler<IncidentAddedEvent>.HandleAsync(IncidentAddedEvent @event, CancellationToken cancellationToken)
        {
            await _hub.Clients.All.SendAsync("IncidentAdded", new IncidentAddedEvent(@event.Incident), cancellationToken: cancellationToken);
        }
    }
}