namespace SafeZone.Modules.Incident.Core.Events.External;

internal record ActivityCreatedEvent(
    Guid? ActorId,
    string ActorName,
    string Action,
    string Details,
    string Module
) : IEvent;