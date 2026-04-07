namespace SafeZone.Modules.Incident.Core.Events;

internal record IncidentDeletedEvent(Guid Id, Guid CompanyId) : IEvent;