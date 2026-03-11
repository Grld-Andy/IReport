using System;
using SafeZone.Shared.Abstractions.Events;

namespace SafeZone.Shared.Infrastructure.SignalR.ActivitiesHub.ActivityCreated;

public record ActivityCreatedEvent(ActivityEntity Activity) : IEvent;

public class ActivityEntity
{
    public Guid Id { get; set; }
    public Guid? ActorId { get; set; }
    public string ActorName { get; set; } = default!;
    public string Action { get; set; } = default!;
    public string Details { get; set; } = default!;
    public string Module { get; set; } = default!;
    public DateTime CreatedAt { get; set; }
}