using System.Runtime.CompilerServices;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SafeZone.Modules.Incident.Core.Clients;
using SafeZone.Modules.Incident.Core.DAL.Repositories;
using SafeZone.Shared.Infrastructure.Postgres;

[assembly: InternalsVisibleTo("SafeZone.Modules.Incident.Api")]
namespace SafeZone.Modules.Incident.Core;

internal static class Extensions
{
    public static IServiceCollection AddCore(this IServiceCollection services, IConfiguration configuration)
    {
        services
            .AddSingleton<IUserApiClient, UserApiClient>()
            .AddScoped<IIncidentRepository, IncidentRepository>()
            .AddPostgres<IncidentDbContext>(configuration);
        return services;
    }
}