namespace SafeZone.Modules.Incident.Core.Queries.GetIncidentById;

internal class GetIncidentByIdHandler(IncidentDbContext _dbContext) : IQueryHandler<GetIncidentByIdQuery, IncidentDto>
{
    private readonly IncidentDbContext dbContext = _dbContext;

    public async Task<IncidentDto> HandleAsync(
        GetIncidentByIdQuery query,
        CancellationToken cancellationToken = default)
    {
        var incident = await dbContext.Incidents.AsNoTracking()
        .Where(i => i.Id == query.Id)
        .Select(IncidentQueries.ToDto())
            .FirstOrDefaultAsync(cancellationToken)
            ?? throw new NotFoundException("Incident", query.Id);
        return incident;
    }

}