namespace SafeZone.Modules.Incident.Core.Commands.AssignIncident;

internal record AssignIncidentCommand(Guid IncidentId, Guid UserId) : ICommand;