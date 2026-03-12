using System.Threading;
using System.Threading.Tasks;
using SafeZone.Shared.Abstractions.Modules;
using SafeZone.Shared.Infrastructure.SignalR.ActivitiesHub.ActivityCreated;

namespace SafeZone.Shared.Infrastructure.SignalR.ActivitiesHub.Clients;

internal class ActivityApiClient(IModuleClient _moduleClient) : IActivityApiClient
{
    private readonly IModuleClient moduleClient = _moduleClient;
    public Task<ActivityEntity> AddAsync(CreateActivityCommand command, CancellationToken ct)
    {
        return moduleClient.SendAsync<ActivityEntity>("activities/post", command, ct);
    }
}