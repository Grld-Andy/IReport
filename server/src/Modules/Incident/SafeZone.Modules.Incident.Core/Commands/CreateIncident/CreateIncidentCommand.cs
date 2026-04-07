namespace SafeZone.Modules.Incident.Core.Commands.CreateIncident;

internal record CreateIncidentCommand(
    string Subject,
    string Description,
    string Category,
    IncidentSeverity Severity,
    double Latitude,
    double Longitude,
    string LocationDetails
) : ICommand<Guid>;