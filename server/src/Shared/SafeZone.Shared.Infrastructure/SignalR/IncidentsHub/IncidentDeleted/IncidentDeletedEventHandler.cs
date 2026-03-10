using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using SafeZone.Shared.Abstractions.Events;

namespace SafeZone.Shared.Infrastructure.SignalR.IncidentsHub.IncidentDeleted;

public class IncidentDeletedEventHandler(IHubContext<IncidentHub> _hubContext) : IEventHandler<IncidentDeletedEvent>
{
    private readonly IHubContext<IncidentHub> hubContext = _hubContext;

    async Task IEventHandler<IncidentDeletedEvent>.HandleAsync(IncidentDeletedEvent @event, CancellationToken cancellationToken)
    {
        System.Console.WriteLine($"==============   Incident delete event called:    {@event.Id}    ==============");
        await hubContext.Clients.All.SendAsync("IncidentDeleted", new IncidentDeletedEvent(@event.Id), cancellationToken);
    }
}