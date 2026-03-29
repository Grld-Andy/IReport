using RazorLight;
using SafeZone.Modules.Notifications.Core.DTO;
using System.Reflection;

namespace SafeZone.Modules.Notifications.Core.Services;

public class NotificationService
{
    private readonly IEmailSender _emailSender;
    private readonly RazorLightEngine _razorEngine;

    public NotificationService(IEmailSender emailSender)
    {
        _emailSender = emailSender;

        string templatesRoot = Path.Combine(AppContext.BaseDirectory, "Templates");
        _razorEngine = new RazorLightEngineBuilder()
            .UseFileSystemProject(templatesRoot)
            .SetOperatingAssembly(Assembly.GetExecutingAssembly())
            .UseMemoryCachingProvider()
            .Build();
    }

    public async Task SendEmailAsync(EmailRequest request)
    {
        string htmlBody;

        // Render template if provided
        if (!string.IsNullOrEmpty(request.TemplateName) && request.Context != null)
        {
            string templatePath = Path.Combine("Emails", request.TemplateName + ".cshtml");
            htmlBody = await _razorEngine.CompileRenderAsync(templatePath, request.Context);
        }
        else
        {
            htmlBody = request.HtmlBody ?? string.Empty;
        }

        var emailToSend = new EmailRequest
        {
            To = request.To,
            Subject = request.Subject,
            HtmlBody = htmlBody,
            Cc = request.Cc,
            Bcc = request.Bcc,
            Headers = request.Headers
        };

        await _emailSender.SendAsync(emailToSend);
    }
}