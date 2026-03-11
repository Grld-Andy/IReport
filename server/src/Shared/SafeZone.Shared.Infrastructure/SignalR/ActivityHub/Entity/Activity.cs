using System;

namespace SafeZone.Shared.Infrastructure.SignalR.ActivityHub;
public class Activity
{
    public Guid Id { get; set; }
    public string ActorName { get; set; } = default!;
    public string Action { get; set; } = default!;
    public string Details { get; set; } = default!;
    public DateTime CreatedAt { get; set; }

    public Guid? ActorId { get; set; }
    public string Module { get; set; } = default!;
}