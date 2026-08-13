using SafeZone.Shared.Abstractions.Events;

namespace SafeZone.Modules.Organization.Core.Events;

internal record CompanyUpdatedEvent(Guid CompanyId, string CompanyName, string Extension, string LogoUrl) : IEvent;
