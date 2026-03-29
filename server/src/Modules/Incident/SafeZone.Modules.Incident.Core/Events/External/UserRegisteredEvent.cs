namespace SafeZone.Modules.Incident.Core.Events.External;

internal record UserRegisteredEvent(Guid Id, string Name, string Email, string Role) : IEvent;