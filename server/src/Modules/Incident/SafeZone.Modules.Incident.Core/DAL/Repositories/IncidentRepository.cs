namespace SafeZone.Modules.Incident.Core.DAL.Repositories;

internal sealed class IncidentRepository(IncidentDbContext _dbcontext) : IIncidentRepository
{
    private readonly IncidentDbContext dbcontext = _dbcontext;

    public async Task SaveAsync(CancellationToken cancellationToken = default){
        await dbcontext.SaveChangesAsync(cancellationToken);
    }

    public async Task<IncidentEntity> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await dbcontext.Incidents
            .Include(i => i.AssignedTo)
            .Include(i => i.Reporter)
            .FirstOrDefaultAsync(i => i.Id == id, cancellationToken)
            ?? throw new NotFoundException("Incident", id);
    }

    public async Task AddAsync(IncidentEntity incident, CancellationToken cancellationToken = default)
    {
        await dbcontext.Incidents.AddAsync(incident, cancellationToken);
    }

    public Task UpdateAsync(IncidentEntity incident, CancellationToken cancellationToken = default)
    {
        dbcontext.Incidents.Update(incident);
        return Task.CompletedTask;
    }

    public async Task<bool> ExistsAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await dbcontext.Incidents
            .AnyAsync(x => x.Id == id, cancellationToken);
    }

    public async Task DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var incident = await dbcontext.Incidents
            .FirstOrDefaultAsync(i => i.Id == id, cancellationToken)
            ?? throw new NotFoundException("Incident", id);
        
        incident.Delete();

        await SaveAsync(cancellationToken);
    }
}