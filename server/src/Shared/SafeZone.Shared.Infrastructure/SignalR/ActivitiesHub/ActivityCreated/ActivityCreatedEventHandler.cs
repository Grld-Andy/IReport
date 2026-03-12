using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using SafeZone.Shared.Abstractions.Events;
using SafeZone.Shared.Infrastructure.SignalR.ActivitiesHub.Clients;

namespace SafeZone.Shared.Infrastructure.SignalR.ActivitiesHub.ActivityCreated
{
    internal class ActivityCreatedEventHandler(IHubContext<ActivityHub> hub, IActivityApiClient _activityApiClient) : IEventHandler<ActivityCreatedEvent>
    {
        private readonly IHubContext<ActivityHub> _hub = hub;
        private readonly IActivityApiClient activityApiClient = _activityApiClient;

        async public Task HandleAsync(ActivityCreatedEvent @event, CancellationToken cancellationToken = default)
        {
            Console.WriteLine($"======================= got activity: {@event.ActorName}");
            ActivityEntity activity = await activityApiClient.AddAsync(new CreateActivityCommand(@event), cancellationToken);
            await _hub.Clients.All.SendAsync("ActivityCreated", activity, cancellationToken);
        }
    }
}