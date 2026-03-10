using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using SafeZone.Shared.Abstractions.Events;

namespace SafeZone.Shared.Infrastructure.SignalR.IncidentsHub.IncidentUpdated;

public class IncidentUpdatedEventHandler(IHubContext<IncidentHub> _hubContext) : IEventHandler<IncidentUpdatedEvent>
{
    private readonly IHubContext<IncidentHub> hubContext = _hubContext;

    async Task IEventHandler<IncidentUpdatedEvent>.HandleAsync(IncidentUpdatedEvent @event, CancellationToken cancellationToken)
    {
        System.Console.WriteLine($"==============   Incident update event called:   {@event.Incident.Id} {@event.Incident.Subject}    ==============");
        await hubContext.Clients.All.SendAsync("IncidentUpdated", new IncidentUpdatedEvent(@event.Incident), cancellationToken);
    }
}