using System.Runtime.CompilerServices;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SafeZone.Modules.Notifications.Core.DTO;
using SafeZone.Modules.Notifications.Core.Services;
using SafeZone.Modules.Notifications.Core.Services.Email;

[assembly: InternalsVisibleTo("SafeZone.Modules.Notifications.Api")]
namespace SafeZone.Modules.Notifications.Core;

internal static class Extensions
{
    public static IServiceCollection AddCore(this IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<SendGridSettings>(
            configuration.GetSection("SendGrid")
        );

        services.AddScoped<IEmailSender, GmailSmtpEmailSender>();
        services.AddScoped<NotificationService>();
        return services;
    }
}