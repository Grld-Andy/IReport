namespace SafeZone.Modules.Incident.Core.Queries.GetIncidents;

internal class GetIncidentsHandler(IIncidentRepository _incidentsRepo) : IQueryHandler<GetIncidentsQuery, Paged<IncidentDto>>
{
    private readonly IIncidentRepository incidentsRepo = _incidentsRepo;

    public async Task<Paged<IncidentDto>> HandleAsync(
        GetIncidentsQuery query,
        CancellationToken cancellationToken = default)
    {
        Dictionary<string, string> dict = [];
        if (!string.IsNullOrWhiteSpace(query.Filter))
        {
            dict = new Dictionary<string, string>(){{"filter", query.Filter}};
        }
        return await incidentsRepo.GetAllIncidents(query, query.OrderBy, query.SortOrder, dict, cancellationToken);
    }
}