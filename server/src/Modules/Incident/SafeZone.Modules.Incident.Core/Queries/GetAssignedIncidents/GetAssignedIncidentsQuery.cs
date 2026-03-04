namespace SafeZone.Modules.Incident.Core.Queries.GetAssignedIncidents;

internal record GetAssignedIncidentsQuery(Guid UserId) : IQuery<List<IncidentDto>>;