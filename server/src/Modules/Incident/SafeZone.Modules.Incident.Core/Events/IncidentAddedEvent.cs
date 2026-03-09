namespace SafeZone.Modules.Incident.Core.Events;

internal record IncidentAddedEvent(IncidentDto Incident) : IEvent;