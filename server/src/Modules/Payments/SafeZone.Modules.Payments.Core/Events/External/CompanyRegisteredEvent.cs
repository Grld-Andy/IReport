using SafeZone.Shared.Abstractions.Events;

namespace SafeZone.Modules.Payments.Core.Events.External;

internal record CompanyRegisteredEvent(Guid CompanyId, string CompanyName, string Extension, string AdminName, string Email, string PhoneNumber, string PaymentRef) : IEvent;
