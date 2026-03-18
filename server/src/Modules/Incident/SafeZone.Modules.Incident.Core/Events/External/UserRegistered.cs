namespace SafeZone.Modules.Incident.Core.Events.External;

internal record UserRegistered(Guid Id, string Name, string Email, string Role) : IEvent;