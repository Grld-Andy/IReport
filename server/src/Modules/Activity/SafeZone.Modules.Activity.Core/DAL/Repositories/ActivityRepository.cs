using Microsoft.EntityFrameworkCore;
using SafeZone.Modules.Activity.Core.DAL;
using SafeZone.Modules.Activity.Core.Domain.Entities;
using SafeZone.Modules.Activity.Core.Domain.Repositories;

internal class ActivityRepository(ActivitiesDbContext context) : IActivityRepository
{
    private readonly ActivitiesDbContext _context = context;

    public async Task<ActivityEntity> AddAsync(ActivityEntity activity, CancellationToken ct)
    {
        _context.Activities.Add(activity);
        await _context.SaveChangesAsync(ct);
        return activity;
    }

    public async Task<List<ActivityEntity>> GetLatestAsync(int limit, CancellationToken ct)
    {
        return await _context.Activities
            .AsNoTracking()
            .OrderByDescending(x => x.CreatedAt)
            .Take(limit)
            .ToListAsync(ct);
    }
}