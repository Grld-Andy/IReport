namespace SafeZone.Modules.Notifications.Core.Services.Email;

using SendGrid;
using SendGrid.Helpers.Mail;
using Microsoft.Extensions.Options;
using SafeZone.Modules.Notifications.Core.DTO;

public class SendGridEmailSender : IEmailSender
{
    private readonly SendGridSettings _settings;

    public SendGridEmailSender(IOptions<SendGridSettings> options)
    {
        _settings = options.Value;
    }

    public async Task SendAsync(EmailRequest request)
    {
        var c = new HttpClient();
        var result = await c.GetAsync("https://api.sendgrid.com");
        Console.WriteLine($"================= checking sendgrid: {result.StatusCode}");
        
        var client = new SendGridClient(_settings.ApiKey);
        var from = new EmailAddress(_settings.FromEmail, _settings.FromName);
        var to = new EmailAddress(request.To);

        var msg = MailHelper.CreateSingleEmail(from, to, request.Subject, null, request.HtmlBody);
        var response = await client.SendEmailAsync(msg);

        if (!response.IsSuccessStatusCode)
        {
            var body = await response.Body.ReadAsStringAsync();
            throw new Exception($"SendGrid failed: {body}");
        }
    }
}