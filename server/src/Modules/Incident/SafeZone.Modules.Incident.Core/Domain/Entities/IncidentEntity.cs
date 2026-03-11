using SafeZone.Modules.Incident.Core.Commands.UpdateIncident;
using SafeZone.Modules.Incident.Core.Domain.Enums;
using SafeZone.Modules.Incident.Core.Domain.ValueObjects;
using SafeZone.Shared.Abstractions.Exceptions.ExceptionClasses;

namespace SafeZone.Modules.Incident.Core.Domain.Entities;

internal class IncidentEntity
{
    public Guid Id { get; private set; }
    public IncidentSubject Subject { get; private set; } = default!;
    public IncidentDescription Description { get; private set; } = default!;
    public IncidentCategory Category { get; private set; }
    public IncidentSeverity Severity { get; private set; }
    public IncidentStatus Status { get; private set; }
    public Guid ReporterId { get; private set; }
    public Guid? AssignedToId { get; private set; }
    public bool IsDeleted { get; private set; }
    public IncidentLocation Location { get; private set; } = default!;
    public DateTime CreatedAt { get; private set; }
    public DateTime UpdatedAt { get; private set; }

    private IncidentEntity() { }

    private IncidentEntity(
        Guid id,
        IncidentSubject subject,
        IncidentDescription description,
        IncidentCategory category,
        IncidentSeverity severity,
        Guid reporterId,
        IncidentLocation location)
    {
        Id = id;
        Subject = subject;
        Description = description;
        Category = category;
        Severity = severity;
        ReporterId = reporterId;
        Location = location;
        Status = IncidentStatus.Open;
        CreatedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }

    public static IncidentEntity Report(
        string subject,
        string description,
        IncidentCategory category,
        IncidentSeverity severity,
        Guid reporterId,
        IncidentLocation location)
    {
        return new IncidentEntity(
            Guid.NewGuid(),
            new IncidentSubject(subject),
            new IncidentDescription(description),
            category,
            severity,
            reporterId,
            location);
    }

    public void AssignTo(Guid userId)
    {
        if (Status == IncidentStatus.Closed)
            throw new BadRequestException("Cannot assign a closed incident.");

        AssignedToId = userId;
        Status = IncidentStatus.InProgress;

        Touch();
    }

    public void ChangeSeverity(IncidentSeverity severity)
    {
        if (Status == IncidentStatus.Closed)
            throw new BadRequestException("Cannot change severity of a closed incident.");

        Severity = severity;
        Touch();
    }

    public void UpdateLocation(IncidentLocation location)
    {
        Location = location;
        Touch();
    }

    public void UpdateIncident(UpdateIncidentCommand updateDto)
    {
        Subject = updateDto.Subject;
        Description = updateDto.Description;
        Severity = updateDto.Severity;
        Category = updateDto.Category;
        Touch();
    }

    public void Resolve()
    {
        if (Status != IncidentStatus.InProgress)
            throw new BadRequestException("Only in-progress incidents can be resolved.");

        Status = IncidentStatus.Resolved;
        Touch();
    }

    public void Delete()
    {
        if (Status == IncidentStatus.InProgress)
            throw new BadRequestException("Cannot delete an incident in progress.");

        IsDeleted = true;
        Touch();
    }

    public void InProgress()
    {
        if (Status == IncidentStatus.Open || !AssignedToId.HasValue)
            throw new BadRequestException("Use Assign endpoint to move to InProgress");

        Status = IncidentStatus.InProgress;
        Touch();
    }

    public void Open()
    {
        Status = IncidentStatus.Open;
        AssignedToId = null;
        Touch();
    }

    public void Close()
    {
        if (Status != IncidentStatus.Resolved)
            throw new BadRequestException("Only resolved incidents can be closed.");

        Status = IncidentStatus.Closed;
        Touch();
    }

    private void Touch()
    {
        UpdatedAt = DateTime.UtcNow;
    }
}