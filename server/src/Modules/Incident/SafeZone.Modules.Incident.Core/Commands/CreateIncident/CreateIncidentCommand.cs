namespace SafeZone.Modules.Incident.Core.Commands.CreateIncident;

internal record CreateIncidentCommand(
    string Subject,
    string Description,
    IncidentCategory Category,
    IncidentSeverity Severity,
    double Latitude,
    double Longitude,
    string LocationDetails
) : ICommand<Guid>;