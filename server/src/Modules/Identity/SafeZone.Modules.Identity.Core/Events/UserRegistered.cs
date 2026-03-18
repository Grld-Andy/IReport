using SafeZone.Shared.Abstractions.Events;

namespace SafeZone.Modules.Identity.Core.Events;

internal record UserRegistered(Guid Id, string Name, string Email, string Role) : IEvent;