namespace SafeZone.Modules.Notifications.Core.Events.External.UserRegistered;

internal record UserRegisteredEvent(string Name, string Email, string Role, string Team) : IEvent;