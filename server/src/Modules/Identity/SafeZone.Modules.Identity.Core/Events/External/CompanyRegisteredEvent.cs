using SafeZone.Shared.Abstractions.Events;

namespace SafeZone.Modules.Identity.Core.Events.External;

internal record CompanyRegisteredEvent(string AdminName, string Email, string Password, string PhoneNumber) : IEvent;
