using System.Runtime.CompilerServices;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SafeZone.Modules.Payments.Core.Services;

[assembly: InternalsVisibleTo("SafeZone.Modules.Payments.Api")]
namespace Safezone.Modules.Payments.Core;

internal static class Extensions
{
    public static IServiceCollection AddCore(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddHttpClient<PaystackService>();
        return services;
    }
}