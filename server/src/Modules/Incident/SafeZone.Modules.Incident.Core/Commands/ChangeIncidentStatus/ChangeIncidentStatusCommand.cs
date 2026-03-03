namespace SafeZone.Modules.Incident.Core.Commands.ChangeIncidentStatus;

internal record ChangeIncidentStatusCommand(Guid IncidentId, IncidentStatus Status) : ICommand;