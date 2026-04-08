using System;
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
        await hubContext.Clients.Group(@event.Incident.Reporter.CompanyId.ToString()).SendAsync("IncidentUpdated", new IncidentUpdatedEvent(@event.Incident), cancellationToken);
    }
}