using Microsoft.EntityFrameworkCore;

namespace SafeZone.Modules.Incident.Core.DAL.Repositories;

internal sealed class IncidentRepository(IncidentDbContext _context) : IIncidentRepository
{
    private readonly IncidentDbContext context = _context;

    public async Task<IncidentEntity?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await context.Incidents
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
    }

    public async Task<IReadOnlyList<IncidentEntity>> GetOpenAsync(CancellationToken cancellationToken = default)
    {
        return await context.Incidents
            .Where(x => x.Status == IncidentStatus.Open)
            .ToListAsync(cancellationToken);
    }

    public async Task AddAsync(IncidentEntity incident, CancellationToken cancellationToken = default)
    {
        await context.Incidents.AddAsync(incident, cancellationToken);
    }

    public Task UpdateAsync(IncidentEntity incident, CancellationToken cancellationToken = default)
    {
        context.Incidents.Update(incident);
        return Task.CompletedTask;
    }

    public async Task<bool> ExistsAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await context.Incidents
            .AnyAsync(x => x.Id == id, cancellationToken);
    }
}