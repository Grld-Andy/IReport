using System;
using SafeZone.Shared.Abstractions.Events;

namespace SafeZone.Shared.Infrastructure.SignalR.IncidentsHub.IncidentUpdated;
internal record IncidentUpdatedEvent(IncidentDto Incident) : IEvent;


internal sealed class IncidentDto
{
    public Guid Id { get; init; }
    public string Subject { get; init; } = default;
    public string Description { get; init; } = default;
    public string Category { get; init; } = default;
    public string Severity { get; init; } = default;
    public string Status { get; init; } = default;
    public string Team { get; init; } = default;
    public Guid ReporterId { get; set; }
    public Guid? AssignedToId { get; set; }
    public IncidentUserDto Reporter { get; init; } = default;
    public IncidentUserDto AssignedTo { get; init; } = default;
    public double Latitude { get; init; }
    public double Longitude { get; init; }
    public string LocationDetails { get; init; } = default;
    public DateTime CreatedAt { get; init; }
    public DateTime UpdatedAt { get; init; }
}

internal class IncidentUserDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = default;
    public string Email { get; set; } = default;
    public string Role { get; set; } = default;
    public Guid CompanyId { get; set; } = default;
}