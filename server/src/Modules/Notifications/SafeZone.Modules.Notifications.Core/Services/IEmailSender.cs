using SafeZone.Modules.Notifications.Core.DTO;

namespace SafeZone.Modules.Notifications.Core.Services;

public interface IEmailSender
{
    Task SendAsync(EmailRequest request);
}