namespace SafeZone.Modules.Incident.Core.DAL.Repositories;

internal sealed class IncidentRepository(IncidentDbContext _dbcontext, IContext _context) : IIncidentRepository
{
    private readonly IncidentDbContext dbcontext = _dbcontext;
    private readonly IContext context = _context;
    private Guid GetCompanyId() => Guid.Parse(context.Identity.Claims["CompanyId"].First());

    public async Task SaveAsync(CancellationToken cancellationToken = default){
        await dbcontext.SaveChangesAsync(cancellationToken);
    }

    public async Task<IncidentEntity> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await dbcontext.Incidents
            .Include(i => i.Reporter)
            .Where(i => i.Reporter.CompanyId == GetCompanyId())
            .Include(i => i.AssignedTo)
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
            .Where(i => i.Reporter.CompanyId == GetCompanyId())
            .AnyAsync(x => x.Id == id, cancellationToken);
    }

    public async Task DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var incident = await dbcontext.Incidents
            .Where(i => i.Reporter.CompanyId == GetCompanyId())
            .FirstOrDefaultAsync(i => i.Id == id, cancellationToken)
            ?? throw new NotFoundException("Incident", id);
        
        incident.Delete();

        await SaveAsync(cancellationToken);
    }
}