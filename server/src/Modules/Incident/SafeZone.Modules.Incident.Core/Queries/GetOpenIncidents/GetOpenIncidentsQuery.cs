namespace SafeZone.Modules.Incident.Core.Queries.GetOpenIncidents;

internal record GetOpenIncidentsQuery() : IQuery<List<IncidentDto>>;