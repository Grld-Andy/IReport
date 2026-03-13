namespace SafeZone.Modules.Incident.Core.Queries.GetIncidentById;

internal class GetIncidentByIdHandler(IIncidentRepository _incidentRepository, IUserApiClient _userApiClient) : IQueryHandler<GetIncidentByIdQuery, IncidentDto>
{
    private readonly IIncidentRepository incidentRepository = _incidentRepository;
    private readonly IUserApiClient userApiClient = _userApiClient;

    public async Task<IncidentDto> HandleAsync(
        GetIncidentByIdQuery query,
        CancellationToken cancellationToken = default)
    {
        var incident = await incidentRepository.GetByIdAsync(query.Id, cancellationToken);
        List<Guid> usersIds = [incident.ReporterId];
        if (incident.AssignedToId.HasValue)
        {
            usersIds.Add(incident.AssignedToId.Value);
        }
        var users = await userApiClient.GetUsersByIds(usersIds);
        var usersDict = users.ToDictionary(u => u.Id);
        return IncidentMapper.FromEntity(incident, usersDict);
    }

}