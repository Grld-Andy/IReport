using SafeZone.Shared.Abstractions.Events;

namespace SafeZone.Modules.Identity.Core.Events;

internal record UserRegisteredEvent(Guid Id, string Name, string Email, string Role, string Team, string PhoneNumber, string OTP, Guid CompanyId) : IEvent;