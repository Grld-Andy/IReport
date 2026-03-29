using Microsoft.AspNetCore.Mvc;
using SafeZone.Modules.Notifications.Core.DTO;
using SafeZone.Modules.Notifications.Core.Services;

[ApiController]
[Route("api/[controller]")]
public class NotificationsController : ControllerBase
{
    private readonly NotificationService _notificationService;

    public NotificationsController(NotificationService notificationService)
    {
        _notificationService = notificationService;
    }

    [HttpPost("welcome-email")]
    public async Task<IActionResult> SendWelcomeEmail([FromBody] WelcomeEmailModel model)
    {
        var emailRequest = new EmailRequest
        {
            To = $"{model.Email}",                   // Recipient
            Subject = "Welcome to SafeZone!",       // Email subject
            TemplateName = "WelcomeEmail",          // Razor template file in Templates/Emails
            Context = model,                        // Model to pass into the Razor template
            // Optional metadata: add CC, BCC, headers if needed
            // Cc = new List<string> { "manager@example.com" },
            // Bcc = new List<string> { "audit@example.com" },
            // Headers = new Dictionary<string, string> { { "X-Custom-Header", "Value" } }
        };

        await _notificationService.SendEmailAsync(emailRequest);

        return Ok(new { Message = "Welcome email sent!" });
    }
}