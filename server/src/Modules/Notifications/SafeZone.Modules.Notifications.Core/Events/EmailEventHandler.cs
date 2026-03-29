using SafeZone.Modules.Notifications.Core.DTO;
using SafeZone.Modules.Notifications.Core.Services;
using SafeZone.Shared.Abstractions.Events;

namespace SafeZone.Modules.Notifications.Core.Events;

public class EmailEventHandler : IEventHandler<EmailEvent>
{
    private readonly NotificationService _notificationService;

    public EmailEventHandler(NotificationService notificationService)
    {
        _notificationService = notificationService;
    }

    public async Task HandleAsync(EmailEvent @event, CancellationToken cancellationToken = default)
    {
        var request = new EmailRequest
        {
            To = @event.To,
            Subject = @event.Subject,
            TemplateName = @event.TemplateName,
            Context = @event.Context,
            Cc = @event.Cc,
            Bcc = @event.Bcc,
            Headers = @event.Headers
        };

        await _notificationService.SendEmailAsync(request);
    }
}