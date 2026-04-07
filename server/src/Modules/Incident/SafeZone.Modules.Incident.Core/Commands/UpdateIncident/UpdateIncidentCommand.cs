namespace SafeZone.Modules.Incident.Core.Commands.UpdateIncident;

internal record UpdateIncidentCommand(
    Guid IncidentId,
    string Subject,
    string Description,
    IncidentSeverity Severity,
    string Category,
    Guid? AssignedToId,
    IncidentStatus Status
) : ICommand;