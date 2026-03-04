namespace SafeZone.Modules.Incident.Core.Queries.GetIncidents;

internal record GetIncidentsQuery() : IQuery<List<IncidentDto>>;