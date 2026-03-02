using System.Runtime.CompilerServices;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SafeZone.Shared.Infrastructure.Postgres;

[assembly: InternalsVisibleTo("SafeZone.Modules.Identity.Api")]
namespace SafeZone.Modules.Identity.Core;

internal static class Extensions
{
    public static IServiceCollection AddCore(this IServiceCollection services, IConfiguration configuration)
    {
        services
            .AddScoped<UsersRepository, UsersRepository>()
            .AddPostgres<UsersDbContext>(configuration);
        return services;
    }
}