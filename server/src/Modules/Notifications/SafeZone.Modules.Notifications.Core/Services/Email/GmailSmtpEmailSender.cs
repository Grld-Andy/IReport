using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Options;
using SafeZone.Modules.Notifications.Core.DTO;
using SafeZone.Modules.Notifications.Core.Services;

internal class GmailSmtpEmailSender(IOptions<GmailSmtpSettings> options) : IEmailSender
{
    private readonly GmailSmtpSettings _settings = options.Value;

    public async Task SendAsync(EmailRequest request)
    {
        var message = new MailMessage
        {
            From = new MailAddress(_settings.Email, _settings.FromName),
            Subject = request.Subject,
            Body = request.HtmlBody,
            IsBodyHtml = true,
        };

        message.To.Add(request.To);

        using var client = new SmtpClient("smtp.gmail.com", 587)
        {
            Credentials = new NetworkCredential(_settings.Email, _settings.AppPassword),
            EnableSsl = true
        };

        await client.SendMailAsync(message);
    }
}