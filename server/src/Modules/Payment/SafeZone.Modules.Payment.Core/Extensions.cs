using System.Runtime.CompilerServices;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

[assembly: InternalsVisibleTo("SafeZone.Modules.Payment.Api")]
namespace SafeZone.Modules.Payment.Core;

internal static class Extensions
{
    public static IServiceCollection AddCore(this IServiceCollection service, IConfiguration configuration)
    {
        return service;
    }
}