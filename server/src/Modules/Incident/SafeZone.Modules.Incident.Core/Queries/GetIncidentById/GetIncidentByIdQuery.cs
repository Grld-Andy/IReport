namespace SafeZone.Modules.Incident.Core.Queries.GetIncidentById;

public sealed record GetIncidentByIdQuery(Guid Id) : IQuery<IncidentDto>;