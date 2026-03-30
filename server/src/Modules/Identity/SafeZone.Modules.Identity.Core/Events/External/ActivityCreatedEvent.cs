using SafeZone.Shared.Abstractions.Events;

namespace SafeZone.Modules.Identity.Core.Events.External;

internal record ActivityCreatedEvent(
    Guid? ActorId,
    string ActorName,
    string Action,
    string Details,
    string Module
) : IEvent;