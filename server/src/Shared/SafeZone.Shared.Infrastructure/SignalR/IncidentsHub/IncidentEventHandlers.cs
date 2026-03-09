using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using SafeZone.Shared.Abstractions.Events;

namespace SafeZone.Shared.Infrastructure.SignalR.IncidentsHub
{
    public class IncidentAddedEventHandler(IHubContext<IncidentHub> hub) : IEventHandler<IncidentAddedEvent>
    {
        private readonly IHubContext<IncidentHub> _hub = hub;

        public async Task HandleAsync(IncidentAddedEvent @event, CancellationToken cancellationToken = default)
        {
            System.Console.WriteLine($"==============   Incident added event called:    {@event.Id} {@event.Title}    ==============");
            await _hub.Clients.All.SendAsync("IncidentAdded", new IncidentAddedEvent(@event.Id, @event.Title, @event.Status), cancellationToken: cancellationToken);
        }
    }
}