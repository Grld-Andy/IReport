namespace SafeZone.Modules.Incident.Core.DTO;

internal class CreateIncidentDto
{
    public string Subject { get; init; } = default!;
    public string Description { get; init; } = default!;
    public IncidentCategory Category { get; init; }
    public IncidentSeverity Severity { get; init; }
    public double Latitude { get; init; }
    public double Longitude { get; init; }
    public string LocationDetails { get; init; } = default!;
}