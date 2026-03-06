namespace SafeZone.Modules.Incident.Core.Queries.GetIncidents;

internal class GetIncidentsHandler(IIncidentRepository _incidentsRepo) : IQueryHandler<GetIncidentsQuery, Paged<IncidentDto>>
{
    private readonly IIncidentRepository incidentsRepo = _incidentsRepo;

    public async Task<Paged<IncidentDto>> HandleAsync(
        GetIncidentsQuery query,
        CancellationToken cancellationToken = default)
    {
        return await incidentsRepo.GetAllIncidents(query, [], cancellationToken);
    }
}