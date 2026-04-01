using System.Runtime.CompilerServices;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

[assembly: InternalsVisibleTo("SafeZone.Modules.Media.Api")]
namespace SafeZone.Modules.Media.Core;

internal static class Extensions
{
    public static IServiceCollection AddCore(this IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<FormOptions>(options =>
        {
            options.MultipartBodyLengthLimit = 3 * 1024 * 1024;
        });
        return services;
    }
}