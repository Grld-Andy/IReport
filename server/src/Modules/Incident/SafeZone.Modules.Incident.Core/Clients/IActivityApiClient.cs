using SafeZone.Modules.Incident.Core.Clients.DTO;

namespace SafeZone.Modules.Incident.Core.Clients;

internal interface IActivityApiClient
{
    Task AddAsync(ActivityDto activity, CancellationToken ct);
}