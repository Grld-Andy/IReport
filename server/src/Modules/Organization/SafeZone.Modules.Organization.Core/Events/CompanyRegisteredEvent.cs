using SafeZone.Shared.Abstractions.Events;

namespace SafeZone.Modules.Organization.Core.Events;

internal record CompanyRegisteredEvent(Guid CompanyId, string CompanyName, string Extension, string AdminName, string Email, string PhoneNumber, string PaymentRef, string LogoUrl = "") : IEvent;
