namespace SafeZone.Modules.Incident.Core.Queries.GetIncidentById;

internal class GetIncidentByIdHandler(IIncidentRepository _incidentRepository) : IQueryHandler<GetIncidentByIdQuery, IncidentDto>
{
    private readonly IIncidentRepository incidentRepository = _incidentRepository;

    public async Task<IncidentDto> HandleAsync(
        GetIncidentByIdQuery query,
        CancellationToken cancellationToken = default)
    {
        return await incidentRepository.GetByIdAsync(query.Id, cancellationToken);
    }

}