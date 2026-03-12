using System.Threading;
using System.Threading.Tasks;
using SafeZone.Shared.Abstractions.Modules;
using SafeZone.Shared.Infrastructure.SignalR.ActivitiesHub.ActivityCreated;

namespace SafeZone.Shared.Infrastructure.SignalR.ActivitiesHub.Clients;

internal class ActivityApiClient(IModuleClient _moduleClient) : IActivityApiClient
{
    private readonly IModuleClient moduleClient = _moduleClient;
    public async Task<ActivityEntity> AddAsync(CreateActivityCommand command, CancellationToken ct)
    {
        var result = await moduleClient.SendAsync<ActivityEntity>("activities/post", command, ct);
        return result;
    }
}