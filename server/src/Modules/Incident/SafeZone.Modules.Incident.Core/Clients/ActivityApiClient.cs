using System.Diagnostics;
using SafeZone.Modules.Incident.Core.Clients.DTO;
using SafeZone.Shared.Abstractions.Modules;

namespace SafeZone.Modules.Incident.Core.Clients;

internal class ActivityApiClient(IModuleClient _moduleClient) : IActivityApiClient
{
    private readonly IModuleClient moduleClient = _moduleClient;
    public Task AddAsync(ActivityDto activity, CancellationToken ct)
    {
        return moduleClient.SendAsync<Activity>("activities/post", new {activity}, ct);
    }
}