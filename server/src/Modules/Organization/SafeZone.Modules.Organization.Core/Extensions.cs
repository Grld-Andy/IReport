using System.Runtime.CompilerServices;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SafeZone.Modules.Organization.Core.DAL.Repositories;

[assembly: InternalsVisibleTo("SafeZone.Modules.Organization.Api")]
namespace SafeZone.Modules.Organization.Core;

internal static class Extensions
{
    public static IServiceCollection AddCore(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddScoped<ITeamRepository, TeamRepository>();
        return services;
    }
}