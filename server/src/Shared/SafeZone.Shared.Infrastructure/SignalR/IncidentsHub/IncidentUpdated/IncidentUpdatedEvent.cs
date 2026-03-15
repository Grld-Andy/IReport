using System;
using SafeZone.Shared.Abstractions.Events;

namespace SafeZone.Shared.Infrastructure.SignalR.IncidentsHub.IncidentUpdated;
internal record IncidentUpdatedEvent(IncidentDto Incident) : IEvent;


internal sealed class IncidentDto
{
    public Guid Id { get; init; }
    public string Subject { get; init; }
    public string Description { get; init; }
    public string Category { get; init; }
    public string Severity { get; init; }
    public string Status { get; init; }
    public UserDto Reporter { get; init; }
    public UserDto AssignedTo { get; init; }
    public double Latitude { get; init; }
    public double Longitude { get; init; }
    public string Team { get; init; }
    public string LocationDetails { get; init; }
    public DateTime CreatedAt { get; init; }
    public DateTime UpdatedAt { get; init; }
}

internal class UserDto
{
    public Guid Id { get; init; }
    public string Name { get; init; } = default;
    public string Email { get; init; } = default;
    public string Team { get; init; }
}