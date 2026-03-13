using System.Threading;
using System.Threading.Tasks;
using SafeZone.Shared.Infrastructure.SignalR.ActivitiesHub.ActivityCreated;

namespace SafeZone.Shared.Infrastructure.SignalR.ActivitiesHub.Clients;

internal interface IActivityApiClient
{
    Task<ActivityEntity> AddAsync(CreateActivityCommand activity, CancellationToken ct);
}