using SafeZone.Modules.Activity.Core.Domain.Entities;

namespace SafeZone.Modules.Activity.Core.Domain.Repositories;

internal interface IActivityRepository
{
    Task<ActivityEntity> AddAsync(ActivityEntity activity, CancellationToken ct);

    Task<List<ActivityEntity>> GetLatestAsync(int limit, CancellationToken ct);
}