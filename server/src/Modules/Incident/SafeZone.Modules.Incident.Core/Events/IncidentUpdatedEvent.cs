namespace SafeZone.Modules.Incident.Core.Events;

internal record IncidentUpdatedEvent(IncidentDto Incident) : IEvent;