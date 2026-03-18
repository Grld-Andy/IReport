using SafeZone.Shared.Infrastructure.Postgres;

namespace SafeZone.Modules.Incident.Core.Queries.GetIncidents;

internal class GetIncidentsHandler(IIncidentRepository _incidentsRepo, IncidentDbContext _dbContext, IContext _context) : IQueryHandler<GetIncidentsQuery, Paged<IncidentDto>>
{
    private readonly IIncidentRepository incidentsRepo = _incidentsRepo;
    private readonly IncidentDbContext dbcontext = _dbContext;
    private readonly IContext context = _context;

    public async Task<Paged<IncidentDto>> HandleAsync(
        GetIncidentsQuery query,
        CancellationToken cancellationToken = default)
    {
        Dictionary<string, string> dict = [];
        if (!string.IsNullOrWhiteSpace(query.Filter))
        {
            dict.Add("filter", query.Filter);
        }
        if (!string.IsNullOrWhiteSpace(query.Team))
        {
            dict.Add("team", query.Team);
        }
        
        var incidentsQuery = dbcontext.Incidents
            .AsNoTracking()
            .Select(IncidentQueries.ToDto())
            .ApplyFilters(dict, context)
            .ApplySorting(query.OrderBy, query.SortOrder);

        return await incidentsQuery.PaginateAsync(query, cancellationToken);
    }
}