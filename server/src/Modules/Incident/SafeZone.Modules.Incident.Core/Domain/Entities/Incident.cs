namespace SafeZone.Modules.Incident.Core.Domain.Entities;

internal class Incident
{
    public Guid Id { get; private set; }
    public string Subject { get; private set; } = default!;
    public string Description { get; private set; } = default!;
    public string Category { get; private set; } = default!;
    public string Severity { get; private set; } = default!;
    public string Status { get; private set; } = default!;
    public Guid ReporterId { get; private set; }
    public Guid AssignedToId { get; private set; }
    public string Location { get; private set; } = default!;
    public DateTime CreatedAt { get; private set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; private set; } = DateTime.UtcNow;

    private Incident() { }

    private Incident(
        Guid id, string subject, string description, string category,
        string severity, string status, Guid reporterId,
        Guid assignedToId, string location
    )
    {
        Id = id;
        Subject = subject;
        Description = description;
        Category = category;
        Severity = severity;
        Status = status;
        Location = location;
        ReporterId = reporterId;
        AssignedToId = assignedToId;
    }

    public static Incident ReportIncident(
        string subject, string description, string category,
        string severity, string status, Guid reporterId,
        Guid assignedToId, string location
    )
    {
        return new Incident(
            Guid.NewGuid(), subject, description, category,
            severity, status, reporterId,
            assignedToId, location
        );
    }
}