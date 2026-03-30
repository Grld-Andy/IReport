using SafeZone.Modules.Notifications.Core.DTO;
using SafeZone.Modules.Notifications.Core.Services;

namespace SafeZone.Modules.Notifications.Core.Events.External.UserRegistered;

internal class UserRegisteredEventHandler(NotificationService notificationService) : IEventHandler<UserRegisteredEvent>
{
    private readonly NotificationService _notificationService = notificationService;
    public async Task HandleAsync(UserRegisteredEvent @event, CancellationToken cancellationToken = default)
    {
        var context = new RegisteredEmailModel
        {
            Name = @event.Name,
            Email = @event.Email,
            Team = @event.Team,
            Role = @event.Role,
            OTP = @event.OTP,
            LoginUrl = $"http://localhost:5173/auth/activate?name={@event.Name}&email={@event.Email}"
        };
        var emailRequest = new EmailRequest
        {
            To = @event.Email,
            Subject = "Welcome to SafeZone",
            TemplateName = "OtpEmail",
            Context = context
        };

       await _notificationService.SendEmailAsync(emailRequest);
    }
}