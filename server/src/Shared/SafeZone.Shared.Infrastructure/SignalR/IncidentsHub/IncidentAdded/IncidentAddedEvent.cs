using System;
using SafeZone.Shared.Abstractions.Events;

namespace SafeZone.Shared.Infrastructure.SignalR.IncidentsHub.IncidentAdded;

internal record IncidentAddedEvent(IncidentDto Incident) : IEvent;

internal sealed class IncidentDto
{
    public Guid Id { get; init; }
    public string Subject { get; init; } = default!;
    public string Description { get; init; } = default!;
    public string Category { get; init; } = default!;
    public string Severity { get; init; } = default!;
    public string Status { get; init; } = default!;
    public UserDto Reporter { get; init; }
    public UserDto AssignedTo { get; init; }
    public double Latitude { get; init; }
    public double Longitude { get; init; }
    public string LocationDetails { get; init; } = default!;
    public string Team { get; init; } = default!;
    public DateTime CreatedAt { get; init; }
    public DateTime UpdatedAt { get; init; }
}

internal class UserDto
{
    public Guid Id { get; init; }
    public string Name { get; init; } = default!;
    public string Email { get; init; } = default!;
}