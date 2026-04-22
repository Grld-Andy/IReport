using Microsoft.AspNetCore.Mvc;
using SafeZone.Modules.Notifications.Core.DTO;
using SafeZone.Modules.Notifications.Core.Services;
using Swashbuckle.AspNetCore.Annotations;

namespace SafeZone.Modules.Notifications.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class NotificationsController(NotificationService notificationService) : ControllerBase
{
    private readonly NotificationService _notificationService = notificationService;

    [HttpPost("welcome-email")]
    [SwaggerOperation("Send test email")]
    public async Task<IActionResult> SendWelcomeEmail([FromBody] WelcomeEmailModel model)
    {
        var emailRequest = new EmailRequest
        {
            To = $"{model.Email}",
            Subject = "Welcome to SafeZone!",
            TemplateName = "WelcomeEmail",
            Context = model,
        };

        await _notificationService.SendEmailAsync(emailRequest);
        return Ok(new { Message = "Welcome email sent!" });
    }
}