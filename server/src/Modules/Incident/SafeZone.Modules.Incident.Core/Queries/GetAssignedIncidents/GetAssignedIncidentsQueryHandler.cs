namespace SafeZone.Modules.Incident.Core.Queries.GetAssignedIncidents;

internal class GetAssignedIncidentsHandler(IIncidentRepository incidentRepository) : IQueryHandler<GetAssignedIncidentsQuery, Paged<IncidentDto>>
{
    private readonly IIncidentRepository _incidentRepository = incidentRepository;

    public async Task<Paged<IncidentDto>> HandleAsync(
        GetAssignedIncidentsQuery query,
        CancellationToken cancellationToken = default)
    {
        return await _incidentRepository.GetAllIncidents(query, query.OrderBy, query.SortOrder, new Dictionary<string, string>(){{"userId", query.UserId.ToString()}, {"status", "closed"}}, cancellationToken);
    }
}