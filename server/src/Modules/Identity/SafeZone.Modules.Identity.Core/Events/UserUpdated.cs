using SafeZone.Shared.Abstractions.Events;
namespace SafeZone.Modules.Identity.Core.Events;

internal record UserUpdatedEvent(UserDetailsDto User) : IEvent;