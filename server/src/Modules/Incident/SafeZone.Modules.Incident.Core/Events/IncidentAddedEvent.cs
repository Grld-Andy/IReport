namespace SafeZone.Modules.Incident.Core.Events;

public record IncidentAddedEvent(Guid Id, string Title, string Status) : IEvent;