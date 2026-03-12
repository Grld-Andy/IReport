using System;
using SafeZone.Shared.Abstractions.Events;

namespace SafeZone.Shared.Infrastructure.SignalR.ActivitiesHub.ActivityCreated;

internal record ActivityCreatedEvent(
    Guid? ActorId,
    string ActorName,
    string Action,
    string Details,
    string Module
) : IEvent;

internal record ActivityEntity(
    Guid Id,
    Guid? ActorId,
    string ActorName,
    string Action,
    string Details,
    string Module,
    DateTime CreatedAt
);
internal record CreateActivityCommand(ActivityCreatedEvent Activity);