namespace SafeZone.Modules.Incident.Core.Domain.Enums;

internal enum IncidentStatus
{
    Open = 1,
    InProgress = 2,
    Resolved = 3,
    Closed = 4
}

internal class IncidentStatusDto
{
    public int Status { get; set; } = 0;
}
