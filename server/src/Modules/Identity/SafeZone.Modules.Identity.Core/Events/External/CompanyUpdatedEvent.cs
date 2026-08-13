using SafeZone.Shared.Abstractions.Events;

namespace SafeZone.Modules.Identity.Core.Events.External;

internal record CompanyUpdatedEvent(Guid CompanyId, string CompanyName, string Extension, string LogoUrl) : IEvent;
