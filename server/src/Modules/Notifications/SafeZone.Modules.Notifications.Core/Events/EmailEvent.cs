using SafeZone.Modules.Notifications.Core.DTO;
using SafeZone.Shared.Abstractions.Events;

namespace SafeZone.Modules.Notifications.Core.Events;

public record EmailEvent(
    string To,
    string Subject,
    string? TemplateName = null,
    object? Context = null,
    List<string>? Cc = null,
    List<string>? Bcc = null,
    Dictionary<string, string>? Headers = null
) : IEvent;