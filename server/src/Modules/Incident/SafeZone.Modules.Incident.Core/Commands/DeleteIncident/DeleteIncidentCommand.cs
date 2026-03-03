namespace SafeZone.Modules.Incident.Core.Commands.DeleteIncident;

public sealed record DeleteIncidentCommand(Guid IncidentId) : ICommand;